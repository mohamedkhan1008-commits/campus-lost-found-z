// Database Configuration
// This file handles SQLite connection using sqlite3

const path = require('path');
const sqlite3 = require('sqlite3').verbose();

// Path to SQLite database file (creates the file if it doesn't exist)
const dbPath = process.env.SQLITE_DB_PATH || path.join(__dirname, '..', 'data', 'database.sqlite');
let db;

// Function to connect to SQLite and initialize schema
const connectDB = async () => {
  return new Promise((resolve, reject) => {
    // ensure data directory exists
    const fs = require('fs');
    const dir = path.dirname(dbPath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    db = new sqlite3.Database(dbPath, (err) => {
      if (err) {
        console.error('✗ SQLite Connection Error:', err.message);
        reject(err);
        return;
      }

      console.log('✓ SQLite Connected Successfully at', dbPath);
      // initialize tables
      db.serialize(() => {
        db.run(`
          CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT NOT NULL UNIQUE,
            email TEXT NOT NULL UNIQUE,
            phone TEXT,
            password TEXT NOT NULL,
            fullName TEXT NOT NULL,
            createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
          )
        `);

        db.run(`
          CREATE TABLE IF NOT EXISTS items (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            title TEXT NOT NULL,
            category TEXT NOT NULL,
            type TEXT NOT NULL,
            description TEXT NOT NULL,
            location TEXT NOT NULL,
            dateTime DATETIME NOT NULL,
            contactPhone TEXT,
            imageUrl TEXT,
            userId INTEGER NOT NULL,
            relatedItemId INTEGER,
            status TEXT NOT NULL DEFAULT 'active',
            createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY(userId) REFERENCES users(id),
            FOREIGN KEY(relatedItemId) REFERENCES items(id)
          )
        `);

        // Ensure contactPhone column exists for existing databases
        db.get("PRAGMA table_info(items)", (err, row) => {
          if (err) {
            console.error('Error checking items table schema:', err.message);
          } else {
            // PRAGMA table_info returns multiple rows; query separately
            db.all("PRAGMA table_info(items)", (err2, columns) => {
              if (!err2) {
                const hasContact = columns.some(col => col.name === 'contactPhone');
                if (!hasContact) {
                  console.log('⚠️ Adding contactPhone column to items table');
                  db.run('ALTER TABLE items ADD COLUMN contactPhone TEXT');
                }
              }
            });
          }
        });
      });

      resolve(db);
    });
  });
};

// Export both connect and the db instance getter
module.exports = {
  connectDB,
  getDb: () => db,
};
