/**
 * Native SQLite Service using better-sqlite3
 * This service provides direct access to the better-sqlite3 database connection
 * for optimal performance without an ORM or query builder layer.
 */
require("dotenv").config();
import config from "../../knexfile";
import Database from 'better-sqlite3';
import type * as BetterSqlite3 from 'better-sqlite3';

// Use a default connection if DB_CONNECTION is not set
const connectionType = process.env.DB_CONNECTION || 'development';
const dbConfig = config[connectionType];

// Type guard to check if connection has filename property
interface SQLiteConnectionConfig {
  filename: string;
}

// Ensure we have a valid configuration with filename
if (!dbConfig || 
    !dbConfig.connection || 
    typeof dbConfig.connection !== 'object' || 
    !('filename' in dbConfig.connection)) {
  throw new Error(`Invalid database configuration for connection: ${connectionType}`);
}

// Safe to access filename now that we've validated it exists
const connectionConfig = dbConfig.connection as SQLiteConnectionConfig;
 
 
const nativeDb = new Database(connectionConfig.filename);

// Set pragmas for better performance
nativeDb.pragma('journal_mode = WAL');
nativeDb.pragma('synchronous = NORMAL');
nativeDb.pragma('foreign_keys = ON');

// Statement cache to reuse prepared statements
const statementCache: Record<string, BetterSqlite3.Statement<any[], any>> = {};

/**
 * SQLite Service with optimized prepared statements
 */
const SQLiteService = {
  /**
   * Get a single row from the database
   * @param sql SQL query with ? placeholders
   * @param params Parameters to bind to the query
   * @returns The first row or undefined if not found
   */
  get(sql: string, params: any = []): any {
    try {
      // Convert object params to array if needed
      const parameters = Array.isArray(params) ? params : Object.values(params);
      
      // Get or create prepared statement
      let stmt = statementCache[sql];
      if (!stmt) {
        stmt = nativeDb.prepare(sql);
        statementCache[sql] = stmt;
      }
      
      // Execute the statement and return the first row
      return stmt.get(...parameters);
    } catch (error) {
      console.error('SQLite get error:', error);
      throw error;
    }
  },

  /**
   * Get all rows from the database
   * @param sql SQL query with ? placeholders
   * @param params Parameters to bind to the query
   * @returns Array of rows
   */
  all(sql: string, params: any = []): any[] {
    try {
      // Convert object params to array if needed
      const parameters = Array.isArray(params) ? params : Object.values(params);
      
      // Get or create prepared statement
      let stmt = statementCache[sql];
      if (!stmt) {
        stmt = nativeDb.prepare(sql);
        statementCache[sql] = stmt;
      }
      
      // Execute the statement and return all rows
      return stmt.all(...parameters);
    } catch (error) {
      console.error('SQLite all error:', error);
      throw error;
    }
  },

  /**
   * Execute a query that modifies the database
   * @param sql SQL query with ? placeholders
   * @param params Parameters to bind to the query
   * @returns Result of the run operation
   */
  run(sql: string, params: any = []): BetterSqlite3.RunResult {
    try {
      // Convert object params to array if needed
      const parameters = Array.isArray(params) ? params : Object.values(params);
      
      // Get or create prepared statement
      let stmt = statementCache[sql];
      if (!stmt) {
        stmt = nativeDb.prepare(sql);
        statementCache[sql] = stmt;
      }
      
      // Execute the statement
      return stmt.run(...parameters);
    } catch (error) {
      console.error('SQLite run error:', error);
      throw error;
    }
  },

  /**
   * Execute a transaction with multiple statements
   * @param fn Function containing the transaction logic
   * @returns Result of the transaction
   */
  transaction<T>(fn: (db: any) => T): T {
    const transaction = nativeDb.transaction(() => {
      return fn(SQLiteService);
    });
    
    return transaction();
  },

  /**
   * Get the raw database instance
   * @returns The better-sqlite3 database instance
   */
  getDatabase(): BetterSqlite3.Database {
    return nativeDb;
  }
  ,

  /**
   * Full-text search articles using FTS5 index
   * @param q Query string to search
   * @param lang Language code for selecting localized fields
   * @param limit Number of results to return
   * @param offset Offset for pagination
   */
  searchArticlesFTS(q: string, lang: string = 'ar', limit: number = 20, offset: number = 0): any[] {
    try {
      const allowedLangs = ['ar','en','id','ur','de','tr','sw','fr','ps','fa'];
      const safeLang = allowedLangs.includes(lang) ? lang : 'ar';

      const sql = `
        SELECT
          a.id,
          a.slug,
          a.featured_image,
          a.post_type,
          a.priority,
          a.category_id,
          a.video_url,
          a.audio_url,
          a.tags,
          a.published_at,
          a.created_at,
          a.title_${safeLang} AS title,
          a.excerpt_${safeLang} AS excerpt,
          snippet(articles_fts, 2, '<mark>', '</mark>', '...', 10) AS snippet
        FROM articles_fts
        JOIN articles a ON a.id = articles_fts.article_id
        WHERE articles_fts.lang = ?
          AND articles_fts MATCH ?
          AND a.status = 'published'
          AND a.title_${safeLang} IS NOT NULL
        ORDER BY a.published_at DESC
        LIMIT ? OFFSET ?`;

      return SQLiteService.all(sql, [safeLang, q, limit, offset]);
    } catch (error) {
      console.error('SQLite searchArticlesFTS error:', error);
      throw error;
    }
  },

  /**
   * Rebuild the FTS index for articles
   */
  reindexArticlesFTS(): void {
    try {
      SQLiteService.transaction((db) => {
        // Clear existing FTS content rows
        db.run("DELETE FROM articles_fts");

        // Repopulate FTS with one row per language per article using deterministic rowid
        // Only insert rows where at least one of title/excerpt/content is non-empty
        db.run(`
          INSERT INTO articles_fts(rowid, article_id, lang, title, excerpt, content, tags)
          SELECT a.rowid*100+1, a.id, 'ar',
                 coalesce(a.title_ar,''), coalesce(a.excerpt_ar,''), coalesce(a.content_ar,''), coalesce(a.tags,'')
          FROM articles a
          WHERE coalesce(a.title_ar,'') <> '' OR coalesce(a.excerpt_ar,'') <> '' OR coalesce(a.content_ar,'') <> ''
        `);

        db.run(`
          INSERT INTO articles_fts(rowid, article_id, lang, title, excerpt, content, tags)
          SELECT a.rowid*100+2, a.id, 'en',
                 coalesce(a.title_en,''), coalesce(a.excerpt_en,''), coalesce(a.content_en,''), coalesce(a.tags,'')
          FROM articles a
          WHERE coalesce(a.title_en,'') <> '' OR coalesce(a.excerpt_en,'') <> '' OR coalesce(a.content_en,'') <> ''
        `);

        db.run(`
          INSERT INTO articles_fts(rowid, article_id, lang, title, excerpt, content, tags)
          SELECT a.rowid*100+3, a.id, 'id',
                 coalesce(a.title_id,''), coalesce(a.excerpt_id,''), coalesce(a.content_id,''), coalesce(a.tags,'')
          FROM articles a
          WHERE coalesce(a.title_id,'') <> '' OR coalesce(a.excerpt_id,'') <> '' OR coalesce(a.content_id,'') <> ''
        `);

        db.run(`
          INSERT INTO articles_fts(rowid, article_id, lang, title, excerpt, content, tags)
          SELECT a.rowid*100+4, a.id, 'ur',
                 coalesce(a.title_ur,''), coalesce(a.excerpt_ur,''), coalesce(a.content_ur,''), coalesce(a.tags,'')
          FROM articles a
          WHERE coalesce(a.title_ur,'') <> '' OR coalesce(a.excerpt_ur,'') <> '' OR coalesce(a.content_ur,'') <> ''
        `);

        db.run(`
          INSERT INTO articles_fts(rowid, article_id, lang, title, excerpt, content, tags)
          SELECT a.rowid*100+5, a.id, 'de',
                 coalesce(a.title_de,''), coalesce(a.excerpt_de,''), coalesce(a.content_de,''), coalesce(a.tags,'')
          FROM articles a
          WHERE coalesce(a.title_de,'') <> '' OR coalesce(a.excerpt_de,'') <> '' OR coalesce(a.content_de,'') <> ''
        `);

        db.run(`
          INSERT INTO articles_fts(rowid, article_id, lang, title, excerpt, content, tags)
          SELECT a.rowid*100+6, a.id, 'tr',
                 coalesce(a.title_tr,''), coalesce(a.excerpt_tr,''), coalesce(a.content_tr,''), coalesce(a.tags,'')
          FROM articles a
          WHERE coalesce(a.title_tr,'') <> '' OR coalesce(a.excerpt_tr,'') <> '' OR coalesce(a.content_tr,'') <> ''
        `);

        db.run(`
          INSERT INTO articles_fts(rowid, article_id, lang, title, excerpt, content, tags)
          SELECT a.rowid*100+7, a.id, 'sw',
                 coalesce(a.title_sw,''), coalesce(a.excerpt_sw,''), coalesce(a.content_sw,''), coalesce(a.tags,'')
          FROM articles a
          WHERE coalesce(a.title_sw,'') <> '' OR coalesce(a.excerpt_sw,'') <> '' OR coalesce(a.content_sw,'') <> ''
        `);

        db.run(`
          INSERT INTO articles_fts(rowid, article_id, lang, title, excerpt, content, tags)
          SELECT a.rowid*100+8, a.id, 'fr',
                 coalesce(a.title_fr,''), coalesce(a.excerpt_fr,''), coalesce(a.content_fr,''), coalesce(a.tags,'')
          FROM articles a
          WHERE coalesce(a.title_fr,'') <> '' OR coalesce(a.excerpt_fr,'') <> '' OR coalesce(a.content_fr,'') <> ''
        `);

        db.run(`
          INSERT INTO articles_fts(rowid, article_id, lang, title, excerpt, content, tags)
          SELECT a.rowid*100+9, a.id, 'ps',
                 coalesce(a.title_ps,''), coalesce(a.excerpt_ps,''), coalesce(a.content_ps,''), coalesce(a.tags,'')
          FROM articles a
          WHERE coalesce(a.title_ps,'') <> '' OR coalesce(a.excerpt_ps,'') <> '' OR coalesce(a.content_ps,'') <> ''
        `);

        db.run(`
          INSERT INTO articles_fts(rowid, article_id, lang, title, excerpt, content, tags)
          SELECT a.rowid*100+10, a.id, 'fa',
                 coalesce(a.title_fa,''), coalesce(a.excerpt_fa,''), coalesce(a.content_fa,''), coalesce(a.tags,'')
          FROM articles a
          WHERE coalesce(a.title_fa,'') <> '' OR coalesce(a.excerpt_fa,'') <> '' OR coalesce(a.content_fa,'') <> ''
        `);
      });
    } catch (error) {
      console.error('SQLite reindexArticlesFTS error:', error);
      throw error;
    }
  }
};

export default SQLiteService;
 
