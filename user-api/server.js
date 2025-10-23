// server.js - Backend API using only sqlite3

import express from 'express';
import bodyParser from 'body-parser';
import sqlite3 from 'sqlite3';
import bcrypt from 'bcrypt';
import path from 'path';
import { fileURLToPath } from 'url';

const app = express();
app.use(bodyParser.json());

// Enable CORS (optional if frontend is separate)
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*'); // You can restrict this in production
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept',
  );
  res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  next();
});

// Get dirname in ES module mode
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Create database file in project directory
const db = new sqlite3.Database(path.join(__dirname, 'users.db'), (err) => {
  if (err) {
    console.error('Error opening database:', err.message);
  } else {
    console.log('✅ Connected to SQLite database');
  }
});

// Create table if not exists
db.run(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    password_hash TEXT NOT NULL,
    role TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'Active',
    joined_at TEXT NOT NULL,
    last_active TEXT
  )
`);

// ➕ POST /api/users - Create user
app.post('/api/users', async (req, res) => {
  const { name, email, password, role } = req.body;

  // Basic validation
  if (!name || !email || !password || !role) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const now = new Date().toISOString();

    const query = `INSERT INTO users (name, email, password_hash, role, status, joined_at, last_active)
                   VALUES (?, ?, ?, ?, 'Active', ?, ?)`;

    db.run(
      query,
      [name, email.toLowerCase(), hashedPassword, role, now, now],
      function (err) {
        if (err) {
          if (err.message.includes('UNIQUE constraint failed')) {
            return res.status(409).json({ error: 'Email already exists' });
          }
          console.error(err);
          return res.status(500).json({ error: 'Internal server error' });
        }
        res.status(201).json({
          id: this.lastID,
          name,
          email: email.toLowerCase(),
          role,
          status: 'Active',
          joined_at: now,
        });
      },
    );
  } catch (err) {
    res.status(500).json({ error: 'Password hashing failed' });
  }
});

// 📄 GET /api/users - List users
app.get('/api/users', (req, res) => {
  db.all(
    `SELECT id, name, email, role, status, joined_at, last_active FROM users ORDER BY id DESC`,
    [],
    (err, rows) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.json(rows);
    },
  );
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
});
