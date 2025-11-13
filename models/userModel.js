const db = require('../config/db');

// Create a new user
exports.createUser = (username, hashedPassword) => {
  return new Promise((resolve, reject) => {
    const sql = 'INSERT INTO users (username, password) VALUES (?, ?)';
    db.run(sql, [username, hashedPassword], function (err) {
      if (err) return reject(err);
      resolve({ id: this.lastID });
    });
  });
};

// Find a user by username
exports.findUserByUsername = (username) => {
  return new Promise((resolve, reject) => {
    const sql = 'SELECT * FROM users WHERE username = ?';
    db.get(sql, [username], (err, row) => {
      if (err) return reject(err);
      resolve(row);
    });
  });
};
