import { drizzle,BunSQLiteDatabase } from 'drizzle-orm/bun-sqlite';  
import { Database } from 'bun:sqlite';  
 
const sqlite = new Database(process.env.DB_FILE);

const DB : BunSQLiteDatabase = drizzle(sqlite);

export default DB;

 