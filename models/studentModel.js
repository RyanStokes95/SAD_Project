const db = require('../config/db');

//Exported CRUD functions for student operations

exports.getAll = async () => {
  const [rows] = await db.execute('SELECT id, name, course FROM students ORDER BY id DESC');
  return rows;
};

exports.getById = async (id) => {
  const [rows] = await db.execute('SELECT id, name, course FROM students WHERE id = ?', [id]);
  return rows[0];
};

exports.create = async (name, course) => {
  const [result] = await db.execute('INSERT INTO students (name, course) VALUES (?, ?)', [name, course]);
  return result;
};

exports.update = async (id, name, course) => {
  const [result] = await db.execute('UPDATE students SET name = ?, course = ? WHERE id = ?', [name, course, id]);
  return result;
};

exports.remove = async (id) => {
  const [result] = await db.execute('DELETE FROM students WHERE id = ?', [id]);
  return result;
};