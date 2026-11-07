import { createClient } from "@libsql/client";
export const db = createClient({ url: process.env.TURSO_DATABASE_URL, authToken: process.env.TURSO_AUTH_TOKEN });
export const init = () => db.execute(`CREATE TABLE IF NOT EXISTS products(
  id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT NOT NULL, price INTEGER NOT NULL,
  description TEXT, category TEXT, image TEXT, in_stock INTEGER DEFAULT 1,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP)`);
