"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv").config();
const knexfile_1 = __importDefault(require("../../knexfile"));
const better_sqlite3_1 = __importDefault(require("better-sqlite3"));
const connectionType = process.env.DB_CONNECTION || 'development';
const dbConfig = knexfile_1.default[connectionType];
if (!dbConfig ||
    !dbConfig.connection ||
    typeof dbConfig.connection !== 'object' ||
    !('filename' in dbConfig.connection)) {
    throw new Error(`Invalid database configuration for connection: ${connectionType}`);
}
const connectionConfig = dbConfig.connection;
const nativeDb = new better_sqlite3_1.default(connectionConfig.filename);
nativeDb.pragma('journal_mode = WAL');
nativeDb.pragma('synchronous = NORMAL');
nativeDb.pragma('foreign_keys = ON');
const statementCache = {};
const SQLiteService = {
    get(sql, params = []) {
        try {
            const parameters = Array.isArray(params) ? params : Object.values(params);
            let stmt = statementCache[sql];
            if (!stmt) {
                stmt = nativeDb.prepare(sql);
                statementCache[sql] = stmt;
            }
            return stmt.get(...parameters);
        }
        catch (error) {
            console.error('SQLite get error:', error);
            throw error;
        }
    },
    all(sql, params = []) {
        try {
            const parameters = Array.isArray(params) ? params : Object.values(params);
            let stmt = statementCache[sql];
            if (!stmt) {
                stmt = nativeDb.prepare(sql);
                statementCache[sql] = stmt;
            }
            return stmt.all(...parameters);
        }
        catch (error) {
            console.error('SQLite all error:', error);
            throw error;
        }
    },
    run(sql, params = []) {
        try {
            const parameters = Array.isArray(params) ? params : Object.values(params);
            let stmt = statementCache[sql];
            if (!stmt) {
                stmt = nativeDb.prepare(sql);
                statementCache[sql] = stmt;
            }
            return stmt.run(...parameters);
        }
        catch (error) {
            console.error('SQLite run error:', error);
            throw error;
        }
    },
    transaction(fn) {
        const transaction = nativeDb.transaction(() => {
            return fn(SQLiteService);
        });
        return transaction();
    },
    getDatabase() {
        return nativeDb;
    },
    searchArticlesFTS(q, lang = 'ar', limit = 20, offset = 0) {
        try {
            const allowedLangs = ['ar', 'en', 'id', 'ur', 'de', 'tr', 'sw', 'fr', 'ps', 'fa'];
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
        }
        catch (error) {
            console.error('SQLite searchArticlesFTS error:', error);
            throw error;
        }
    },
    reindexArticlesFTS() {
        try {
            SQLiteService.transaction((db) => {
                db.run("DELETE FROM articles_fts");
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
        }
        catch (error) {
            console.error('SQLite reindexArticlesFTS error:', error);
            throw error;
        }
    }
};
exports.default = SQLiteService;
//# sourceMappingURL=SQLite.js.map