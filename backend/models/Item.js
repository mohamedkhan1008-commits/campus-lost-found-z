// Item Model (SQLite version)
// Provides helper functions for interacting with the items table.

const { getDb } = require('../config/db');

function buildItem(row) {
  if (!row) return null;

  const userObj = {
    id: row.userId,
    _id: row.userId,
    username: row.user_username,
    email: row.user_email,
    fullName: row.user_fullName,
    phone: row.user_phone,
    toString() {
      return String(row.userId);
    },
  };

  const item = {
    id: row.id,
    _id: row.id,
    title: row.title,
    category: row.category,
    type: row.type,
    description: row.description,
    location: row.location,
    dateTime: row.dateTime,
    contactPhone: row.contactPhone,
    imageUrl: row.imageUrl,
    userId: userObj,
    user: userObj,
    relatedItemId: row.relatedItemId,
    status: row.status,
    createdAt: row.createdAt,
  };

  return item;
}

const Item = {
  async create(data) {
    const db = getDb();
    const {
      title,
      category,
      type,
      description,
      location,
      dateTime,
      contactPhone,
      imageUrl,
      userId,
      relatedItemId,
    } = data;
    return new Promise((resolve, reject) => {
      const stmt = db.prepare(`
        INSERT INTO items (title, category, type, description, location, dateTime, contactPhone, imageUrl, userId, relatedItemId)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `);
      stmt.run(
        title,
        category,
        type,
        description,
        location,
        dateTime,
        contactPhone || null,
        imageUrl || null,
        userId,
        relatedItemId || null,
        function (err) {
          if (err) return reject(err);
          Item.findById(this.lastID).then(resolve).catch(reject);
        }
      );
    });
  },

  async find(filter = {}, options = {}) {
    const db = getDb();
    // join with users to fetch username, email, fullName and phone
    let query = `
      SELECT items.*, users.username as user_username, users.email as user_email,
             users.fullName as user_fullName, users.phone as user_phone
      FROM items
      JOIN users ON items.userId = users.id
    `;
    const params = [];
    const clauses = [];
    if (filter.type) {
      clauses.push('items.type = ?');
      params.push(filter.type);
    }
    if (filter.category) {
      clauses.push('items.category = ?');
      params.push(filter.category);
    }
    if (filter.status) {
      clauses.push('items.status = ?');
      params.push(filter.status);
    }
    if (filter.userId) {
      clauses.push('items.userId = ?');
      params.push(filter.userId);
    }
    if (filter.relatedItemId) {
      clauses.push('items.relatedItemId = ?');
      params.push(filter.relatedItemId);
    }
    if (clauses.length) {
      query += ' WHERE ' + clauses.join(' AND ');
    }
    if (options.sort) {
      query += ' ORDER BY ' + options.sort;
    }
    if (options.limit) {
      query += ' LIMIT ' + options.limit;
    }
    if (options.offset) {
      query += ' OFFSET ' + options.offset;
    }
    return new Promise((resolve, reject) => {
      db.all(query, params, (err, rows) => {
        if (err) return reject(err);
        const items = rows.map(row => {
          const item = buildItem(row);
          item.user = {
            id: row.userId,
            username: row.user_username,
            email: row.user_email,
            fullName: row.user_fullName,
            phone: row.user_phone,
          };
          return item;
        });
        resolve(items);
      });
    });
  },

  async findById(id) {
    const db = getDb();
    return new Promise((resolve, reject) => {
      db.get(`
        SELECT items.*, users.username as user_username, users.email as user_email,
               users.fullName as user_fullName, users.phone as user_phone
        FROM items
        JOIN users ON items.userId = users.id
        WHERE items.id = ?
      `, [id], (err, row) => {
        if (err) return reject(err);
        if (!row) return resolve(null);
        const item = buildItem(row);
        item.user = {
          id: row.userId,
          username: row.user_username,
          email: row.user_email,
          fullName: row.user_fullName,
          phone: row.user_phone,
        };
        resolve(item);
      });
    });
  },

  async countDocuments(filter = {}) {
    const db = getDb();
    let query = 'SELECT COUNT(*) as count FROM items';
    const params = [];
    const clauses = [];
    if (filter.type) {
      clauses.push('type = ?');
      params.push(filter.type);
    }
    if (filter.category) {
      clauses.push('category = ?');
      params.push(filter.category);
    }
    if (filter.status) {
      clauses.push('status = ?');
      params.push(filter.status);
    }
    if (clauses.length) {
      query += ' WHERE ' + clauses.join(' AND ');
    }
    return new Promise((resolve, reject) => {
      db.get(query, params, (err, row) => {
        if (err) return reject(err);
        resolve(row.count);
      });
    });
  },

  async deleteById(id) {
    const db = getDb();
    return new Promise((resolve, reject) => {
      db.run('DELETE FROM items WHERE id = ?', [id], function (err) {
        if (err) return reject(err);
        resolve(this.changes);
      });
    });
  },

  async updateStatus(id, status) {
    const db = getDb();
    return new Promise((resolve, reject) => {
      db.run(
        'UPDATE items SET status = ? WHERE id = ?',
        [status, id],
        function (err) {
          if (err) return reject(err);
          Item.findById(id).then(resolve).catch(reject);
        }
      );
    });
  },
};

module.exports = Item;
