// User Model (MySQL version)
// Provides helper functions for interacting with the users table.

const { getDb } = require('../config/db');
const bcrypt = require('bcryptjs');

// Convert MySQL row to user object with toJSON method
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
    try {
      const [result] = await db.execute(
        'INSERT INTO users (username, email, phone, password, fullName) VALUES (?, ?, ?, ?, ?)',
        [username, email, phone || null, hashed, fullName]
      );
      return await User.findById(result.insertId);
    } catch (err) {
      throw err;
    }
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
    try {
      const [rows] = await db.execute(query, params);
      return buildUser(rows[0]);
    } catch (err) {
      throw err;
    }
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
    try {
      const [rows] = await db.execute(query, params);
      return rows[0].count;
    } catch (err) {
      throw err;
    }
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
    try {
      await db.execute(query, params);
      return await User.findById(id);
    } catch (err) {
      throw err;
    }
  },
};

module.exports = User;
