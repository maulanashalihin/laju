import { sql } from "drizzle-orm";
import { integer, sqliteTable,index, text } from "drizzle-orm/sqlite-core";

export const users = sqliteTable("users", {
  id: text("id").primaryKey(),
  username: text("username").unique(), 
  pin : text("pin"),
  loginAt: text("login_at"),
  createdAt: text("created_at"),
  updatedAt: text("updated_at"),
});


export const sessions = sqliteTable("sessions", {
  id: text("id").primaryKey(),
  user_id: text("user_id"),   
  user_agent : text("user_agent"),  
  createdAt: text("created_at"),
  deletedAt: text("deleted_at"),
  updatedAt: text("updated_at")
}, (table) => {
  return {
    userIdx: index("user_idx").on(table.user_id)
  };
});

export const logs = sqliteTable("logs", {
  id: text("id").primaryKey(),
  table : text("table"), 
  data : text("data"),
  createdAt: text("created_at"),
}, (table) => {
  return {
    createdAtIdx: index("created_at_idx").on(table.createdAt),
  };
});

 

export const access_keys = sqliteTable("access_keys", {
  hash_id : text("hash_id").primaryKey()
});

 


 