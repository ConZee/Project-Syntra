// server.js - Backend API using only sqlite3 (ESM)

import express from 'express';
import bodyParser from 'body-parser';
import sqlite3 from 'sqlite3';
import bcrypt from 'bcrypt';
import path from 'path';
import { fileURLToPath } from 'url';

const SALT_ROUNDS = 10; // <-- needed for password hashing

const app = express();
app.use(bodyParser.json());

// Enable CORS with support for PUT/DELETE + preflight
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*'); // tighten in prod
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept, Authorization',
  );
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  if (req.method === 'OPTIONS') return res.sendStatus(204);
  next();
});

// Get dirname in ES module mode
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Create / open database
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

  if (!name || !email || !password || !role) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
    const now = new Date().toISOString();

    const query = `INSERT INTO users (name, email, password_hash, role, status, joined_at, last_active)
                   VALUES (?, ?, ?, ?, 'Active', ?, ?)`;

    db.run(
      query,
      [name.trim(), email.toLowerCase().trim(), hashedPassword, role, now, now],
      function (err) {
        if (err) {
          if (String(err.message).includes('UNIQUE constraint failed')) {
            return res.status(409).json({ error: 'Email already exists' });
          }
          console.error('[POST /api/users] DB error:', err);
          return res.status(500).json({ error: 'Internal server error' });
        }
        res.status(201).json({
          id: this.lastID,
          name: name.trim(),
          email: email.toLowerCase().trim(),
          role,
          status: 'Active',
          joined_at: now,
        });
      },
    );
  } catch (err) {
    console.error('[POST /api/users] bcrypt error:', err);
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
        console.error('[GET /api/users] DB error:', err);
        return res.status(500).json({ error: err.message });
      }
      res.json(rows);
    },
  );
});

// (Optional) GET /api/users/:id - fetch single user
app.get('/api/users/:id', (req, res) => {
  const id = Number(req.params.id);
  db.get(
    `SELECT id, name, email, role, status, joined_at, last_active FROM users WHERE id = ?`,
    [id],
    (err, row) => {
      if (err) {
        console.error('[GET /api/users/:id] DB error:', err);
        return res.status(500).json({ error: err.message });
      }
      if (!row) return res.status(404).json({ error: 'User not found.' });
      res.json(row);
    },
  );
});

// 🔐 POST /api/auth/login - authenticate (email + password)
app.post('/api/auth/login', (req, res) => {
  const { email, password, expectedRole } = req.body || {};
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required.' });
  }

  const sql = `SELECT id, name, email, role, status, joined_at, last_active, password_hash
               FROM users WHERE email = ? LIMIT 1`;
  db.get(sql, [String(email).toLowerCase().trim()], async (err, row) => {
    if (err) {
      console.error('[POST /api/auth/login] DB error:', err);
      return res.status(500).json({ error: 'Internal server error.' });
    }
    if (!row) {
      return res.status(401).json({ error: 'Invalid email or password.' });
    }
    try {
      const ok = await bcrypt.compare(password, row.password_hash);
      if (!ok) {
        return res.status(401).json({ error: 'Invalid email or password.' });
      }

      if (expectedRole && expectedRole !== row.role) {
        return res
          .status(403)
          .json({ error: 'Role mismatch for this account.' });
      }

      const token = 'demo-token-' + row.id;
      return res.json({
        token,
        user: {
          id: row.id,
          name: row.name,
          email: row.email,
          role: row.role,
          status: row.status,
          joined_at: row.joined_at,
          last_active: row.last_active,
        },
      });
    } catch (e) {
      console.error('[POST /api/auth/login] bcrypt compare error:', e);
      return res.status(500).json({ error: 'Authentication failed.' });
    }
  });
});

// ✏️ PUT /api/users/:id - update name, email, role; optional password
app.put('/api/users/:id', async (req, res) => {
  const id = Number(req.params.id);
  const { name, email, role, password } = req.body || {};

  console.log('[PUT /api/users/:id] id=', id, 'body=', req.body);

  if (!id || !name || !email || !role) {
    return res
      .status(400)
      .json({ error: 'id, name, email, and role are required.' });
  }

  const emailNorm = String(email).toLowerCase().trim();
  const nameTrim = String(name).trim();

  // Validate email format
  const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailNorm);
  if (!emailOk) {
    return res.status(400).json({ error: 'Invalid email format.' });
  }

  // Helpers (promisified sqlite3)
  const getUserById = () =>
    new Promise((resolve, reject) => {
      db.get(`SELECT id FROM users WHERE id = ?`, [id], (err, row) =>
        err ? reject(err) : resolve(row),
      );
    });

  const emailTakenByAnother = () =>
    new Promise((resolve, reject) => {
      db.get(
        `SELECT id FROM users WHERE email = ? AND id <> ? LIMIT 1`,
        [emailNorm, id],
        (err, row) => (err ? reject(err) : resolve(!!row)),
      );
    });

  const runUpdate = (sql, params) =>
    new Promise((resolve, reject) => {
      db.run(sql, params, function (err) {
        if (err) return reject(err);
        resolve(this.changes);
      });
    });

  try {
    const exists = await getUserById();
    if (!exists) {
      return res.status(404).json({ error: 'User not found.' });
    }

    const taken = await emailTakenByAnother();
    if (taken) {
      return res
        .status(409)
        .json({ error: 'Email already in use by another account.' });
    }

    let sql, params;
    if (password && String(password).length > 0) {
      if (String(password).length < 8) {
        return res
          .status(400)
          .json({ error: 'Password must be at least 8 characters.' });
      }
      const hash = await bcrypt.hash(password, SALT_ROUNDS);
      sql = `UPDATE users SET name = ?, email = ?, role = ?, password_hash = ? WHERE id = ?`;
      params = [nameTrim, emailNorm, role, hash, id];
    } else {
      sql = `UPDATE users SET name = ?, email = ?, role = ? WHERE id = ?`;
      params = [nameTrim, emailNorm, role, id];
    }

    await runUpdate(sql, params);

    db.get(
      `SELECT id, name, email, role, status, joined_at, last_active FROM users WHERE id = ?`,
      [id],
      (err, row) => {
        if (err) {
          console.error('[PUT /api/users/:id] select-after-update error:', err);
          return res.status(500).json({ error: 'Internal server error.' });
        }
        return res.json(row);
      },
    );
  } catch (e) {
    console.error('[PUT /api/users/:id] error:', e);
    if (e && e.code === 'SQLITE_CONSTRAINT') {
      return res
        .status(409)
        .json({ error: 'Email already in use by another account.' });
    }
    if (String(e.message || '').includes('no such column: password_hash')) {
      return res.status(500).json({
        error:
          "Database schema missing 'password_hash' column. Add it or remove password update.",
      });
    }
    return res.status(500).json({ error: 'Internal server error.' });
  }
});

// DELETE /api/users/:id
app.delete('/api/users/:id', (req, res) => {
  const id = Number(req.params.id);
  if (!id) return res.status(400).json({ error: 'Valid id is required.' });

  db.run(`DELETE FROM users WHERE id = ?`, [id], function (err) {
    if (err) return res.status(500).json({ error: err.message });
    if (this.changes === 0)
      return res.status(404).json({ error: 'User not found.' });
    return res.json({ success: true });
  });
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
});
