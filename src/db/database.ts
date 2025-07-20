import Database from 'better-sqlite3';

const db = new Database('wallets.db');

// Create table if not exists
db.prepare(`
  CREATE TABLE IF NOT EXISTS transactions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    signature TEXT,
    wallet TEXT,
    amount REAL,
    direction TEXT,
    protocol TEXT,
    timestamp TEXT
  )
`).run();


export default db;
