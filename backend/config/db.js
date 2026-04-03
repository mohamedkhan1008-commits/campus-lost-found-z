// Database Configuration
// This file handles both MySQL and SQLite connections

const mysql = require('mysql2/promise');
const sqlite3 = require('sqlite3').verbose();
const { open } = require('sqlite');
const path = require('path');
const fs = require('fs');
require('dotenv').config();

let db;
const dbType = (process.env.DB_TYPE || 'mysql').toLowerCase();

const connectDB = async () => {
  if (dbType === 'sqlite') {
    try {
      const sqliteFile = process.env.SQLITE_FILE || path.join(__dirname, '..', 'data', 'campus_lost_found.sqlite');
      const dbDir = path.dirname(sqliteFile);
      if (!fs.existsSync(dbDir)) {
        fs.mkdirSync(dbDir, { recursive: true });
      }

      const sqliteDb = await open({
        filename: sqliteFile,
        driver: sqlite3.Database,
      });

      await sqliteDb.run('PRAGMA foreign_keys = ON;');

      // Wrap sqlite interface as execute() compatible with mysql2 code
      db = {
        execute: async (sql, params = []) => {
          const normalized = sql.trim().toUpperCase();
          if (normalized.startsWith('SELECT')) {
            const rows = await sqliteDb.all(sql, params);
            return [rows];
          }

          const result = await sqliteDb.run(sql, params);
          return [{ insertId: result.lastID, affectedRows: result.changes }];
        },
        getConnection: async () => ({ release: () => {} }),
        close: async () => sqliteDb.close(),
      };

      console.log(`✓ SQLite connected at ${sqliteFile}`);
      await initializeTables();
      return db;
    } catch (err) {
      console.error('✗ SQLite Connection Error:', err.message);
      throw err;
    }
  }

  // Default to MySQL
  try {
    const tempConnection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
    });

    const dbName = process.env.DB_NAME || 'campus_lost_found';
    await tempConnection.execute(`CREATE DATABASE IF NOT EXISTS \`${dbName}\``);
    console.log(`✓ Database '${dbName}' ensured to exist`);

    await tempConnection.end();

    db = mysql.createPool({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      database: dbName,
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0,
    });

    const connection = await db.getConnection();
    console.log('✓ MySQL Connected Successfully');

    await initializeTables();

    connection.release();
    return db;
  } catch (err) {
    console.error('✗ MySQL Connection Error:', err.message);
    throw err;
  }
};

const initializeTables = async () => {
  try {
    if (dbType === 'sqlite') {
      await db.execute(`
        CREATE TABLE IF NOT EXISTS users (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          username TEXT NOT NULL UNIQUE,
          email TEXT NOT NULL UNIQUE,
          phone TEXT,
          password TEXT NOT NULL,
          fullName TEXT NOT NULL,
          createdAt TEXT DEFAULT (datetime('now'))
        )
      `);

      await db.execute(`
        CREATE TABLE IF NOT EXISTS items (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          title TEXT NOT NULL,
          category TEXT NOT NULL,
          type TEXT NOT NULL CHECK(type IN ('lost', 'found')),
          description TEXT NOT NULL,
          location TEXT NOT NULL,
          dateTime TEXT NOT NULL,
          contactPhone TEXT,
          imageUrl TEXT,
          userId INTEGER NOT NULL,
          relatedItemId INTEGER,
          status TEXT NOT NULL DEFAULT 'active',
          createdAt TEXT DEFAULT (datetime('now')),
          FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE,
          FOREIGN KEY (relatedItemId) REFERENCES items(id) ON DELETE SET NULL
        )
      `);
    } else {
      await db.execute(`
        CREATE TABLE IF NOT EXISTS users (
          id INT AUTO_INCREMENT PRIMARY KEY,
          username VARCHAR(255) NOT NULL UNIQUE,
          email VARCHAR(255) NOT NULL UNIQUE,
          phone VARCHAR(20),
          password VARCHAR(255) NOT NULL,
          fullName VARCHAR(255) NOT NULL,
          createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
      `);

      await db.execute(`
        CREATE TABLE IF NOT EXISTS items (
          id INT AUTO_INCREMENT PRIMARY KEY,
          title VARCHAR(255) NOT NULL,
          category VARCHAR(100) NOT NULL,
          type ENUM('lost', 'found') NOT NULL,
          description TEXT NOT NULL,
          location VARCHAR(255) NOT NULL,
          dateTime DATETIME NOT NULL,
          contactPhone VARCHAR(20),
          imageUrl VARCHAR(500),
          userId INT NOT NULL,
          relatedItemId INT,
          status VARCHAR(50) NOT NULL DEFAULT 'active',
          createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE,
          FOREIGN KEY (relatedItemId) REFERENCES items(id) ON DELETE SET NULL
        )
      `);
    }

    console.log('✓ Database tables initialized');
  } catch (err) {
    console.error('✗ Error initializing tables:', err.message);
    throw err;
  }
};

module.exports = {
  connectDB,
  getDb: () => db,
};
