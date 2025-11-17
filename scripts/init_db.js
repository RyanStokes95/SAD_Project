const db = require('../config/db');

//This script initializes the database with required tables, it is needed to be run once before starting the application.

//It is required to create the users and students tables.

db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )`);
  db.run(`CREATE TABLE IF NOT EXISTS students (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    course TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )`);
});

console.log('Database Initialized');
db.close();
