const db = require('../config/db');

//Exported functions for user operations

exports.createUser = async (username, hashedPassword) => {
  const sql = 'INSERT INTO users (username, password) VALUES (?, ?)';
  const [result] = await db.execute(sql, [username, hashedPassword]);
  return result;
};

exports.findUserByUsername = async (username) => {
  const sql = 'SELECT * FROM users WHERE username = ?';
  const [rows] = await db.execute(sql, [username]);
  return rows[0];
};