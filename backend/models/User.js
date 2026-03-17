// User Model (SQLite version)
// Provides helper functions for interacting with the users table.

const { getDb } = require('../config/db');
const bcrypt = require('bcryptjs');

// Convert sqlite3 row to user object with toJSON method
function buildUser(row) {
  if (!row) return null;
  const user = {
    id: row.id,
    _id: row.id,
    username: row.username,
    email: row.email,
    phone: row.phone,
    password: row.password,
    fullName: row.fullName,
    createdAt: row.createdAt,
    toJSON() {
      const obj = { ...this };
      delete obj.password;
      return obj;
    },
    async matchPassword(password) {
      return await bcrypt.compare(password, this.password);
    },
  };
  return user;
}

const User = {
  async create({ username, email, phone, password, fullName }) {
    const db = getDb();
    const hashed = await bcrypt.hash(password, 10);
    return new Promise((resolve, reject) => {
      const stmt = db.prepare(
        `INSERT INTO users (username, email, phone, password, fullName) VALUES (?, ?, ?, ?, ?)`
      );
      stmt.run(username, email, phone || null, hashed, fullName, function (err) {
        if (err) return reject(err);
        User.findById(this.lastID).then(resolve).catch(reject);
      });
    });
  },

  async findOne(filter) {
    const db = getDb();
    let query = 'SELECT * FROM users WHERE ';
    const params = [];
    const parts = [];
    if (filter.email) {
      parts.push('email = ?');
      params.push(filter.email);
    }
    if (filter.username) {
      parts.push('username = ?');
      params.push(filter.username);
    }
    if (filter.id) {
      parts.push('id = ?');
      params.push(filter.id);
    }
    if (parts.length === 0) return null;
    query += parts.join(' OR ');
    return new Promise((resolve, reject) => {
      db.get(query, params, (err, row) => {
        if (err) return reject(err);
        resolve(buildUser(row));
      });
    });
  },

  async findById(id) {
    return User.findOne({ id });
  },

  async countDocuments(filter = {}) {
    const db = getDb();
    let query = 'SELECT COUNT(*) as count FROM users';
    const params = [];
    if (filter.email) {
      query += ' WHERE email = ?';
      params.push(filter.email);
    }
    return new Promise((resolve, reject) => {
      db.get(query, params, (err, row) => {
        if (err) return reject(err);
        resolve(row.count);
      });
    });
  },

  async update(id, updates) {
    const db = getDb();
    const fields = [];
    const params = [];
    if (updates.fullName) {
      fields.push('fullName = ?');
      params.push(updates.fullName);
    }
    if (updates.email) {
      fields.push('email = ?');
      params.push(updates.email);
    }
    if (fields.length === 0) return User.findById(id);
    params.push(id);
    const query = `UPDATE users SET ${fields.join(', ')} WHERE id = ?`;
    return new Promise((resolve, reject) => {
      db.run(query, params, function (err) {
        if (err) return reject(err);
        User.findById(id).then(resolve).catch(reject);
      });
    });
  },
};

module.exports = User;
