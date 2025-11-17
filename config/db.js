const sqlite3 = require('sqlite3').verbose();

// Connect to SQLite database, db stored in student.db file
const db = new sqlite3.Database('./student.db', (err) => {
  if (err) {
    console.error('Failed to connect to SQLite:', err.message);
  } else {
    console.log('Connected to SQLite database');
  }
});

//Export the database connection
module.exports = db;

