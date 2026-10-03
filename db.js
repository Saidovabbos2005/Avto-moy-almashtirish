// db.js — SQLite bazasi bilan ishlash
const Database = require('better-sqlite3');
const db = new Database('moy.db');

// Jadval: har bir mijoz uchun bitta yozuv
db.exec(`
  CREATE TABLE IF NOT EXISTS mijozlar (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    chat_id INTEGER NOT NULL,
    ism TEXT NOT NULL,
    telefon TEXT,
    mashina TEXT,
    oxirgi_sana TEXT NOT NULL,     -- YYYY-MM-DD formatida
    interval_oy INTEGER NOT NULL,   -- mijoz tanlagan oy soni
    oxirgi_eslatma_sana TEXT,       -- oxirgi marta eslatma yuborilgan sana (takror yubormaslik uchun)
    created_at TEXT DEFAULT CURRENT_TIMESTAMP
  )
`);

module.exports = db;
