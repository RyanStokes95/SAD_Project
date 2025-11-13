const db = require('../config/db');

// Get all students
exports.getAll = () => {
  return new Promise((resolve, reject) => {
    const sql = 'SELECT * FROM students';
    db.all(sql, [], (err, rows) => {
      if (err) return reject(err);
      resolve(rows);
    });
  });
};

// Create a new student
exports.create = (name, course) => {
  return new Promise((resolve, reject) => {
    const sql = 'INSERT INTO students (name, course) VALUES (?, ?)';
    db.run(sql, [name, course], function (err) {
      if (err) return reject(err);
      resolve({ id: this.lastID });
    });
  });
};

// Get a student by ID
exports.getById = (id) => {
  return new Promise((resolve, reject) => {
    const sql = 'SELECT * FROM students WHERE id = ?';
    db.get(sql, [id], (err, row) => {
      if (err) return reject(err);
      resolve(row);
    });
  });
};

// Update a student
exports.update = (id, name, course) => {
  return new Promise((resolve, reject) => {
    const sql = 'UPDATE students SET name = ?, course = ? WHERE id = ?';
    db.run(sql, [name, course, id], function (err) {
      if (err) return reject(err);
      resolve({ changes: this.changes });
    });
  });
};

// Delete a student
exports.remove = (id) => {
  return new Promise((resolve, reject) => {
    const sql = 'DELETE FROM students WHERE id = ?';
    db.run(sql, [id], function (err) {
      if (err) return reject(err);
      resolve({ changes: this.changes });
    });
  });
};
