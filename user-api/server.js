// server.js - Backend API using sqlite3 (ESM) + RBAC (JWT) + Elasticsearch
// Run with: node server.js
// Requires: npm i @elastic/elasticsearch jsonwebtoken bcrypt sqlite3 express body-parser
// NOTE: This file assumes "type": "module" in package.json (ESM imports).

import express from 'express';
import bodyParser from 'body-parser';
import sqlite3 from 'sqlite3';
import bcrypt from 'bcrypt';
import path from 'path';
import { fileURLToPath } from 'url';

// ⭐ NEW: added JSON Web Token and Elasticsearch client
import jwt from 'jsonwebtoken';
import { Client as ESClient } from '@elastic/elasticsearch';

const SALT_ROUNDS = 10;

// ⭐ NEW: allow overrides via environment variables
const PORT = Number(process.env.PORT || 3001);
const JWT_SECRET = process.env.JWT_SECRET || 'syntra-secret-key'; // change in prod!
const ELASTIC_URL = process.env.ELASTIC_URL || 'http://192.168.56.128:9200';

// ⭐ NEW: create Elasticsearch client (used by /api/suricata/alerts and /api/zeek/logs)
const es = new ESClient({ node: ELASTIC_URL });

// --- Role normalizer (unchanged) ---
const normalizeRole = (r = '') => {
  const map = {
    'Platform Admin': 'Platform Administrator',
    'platform admin': 'Platform Administrator',
    'Network Admin': 'Network Administrator',
    'network admin': 'Network Administrator',
  };
  return map[r] || r; // Security Analyst and canonical names pass through
};

const app = express();
app.use(bodyParser.json());

// CORS (unchanged but expanded headers include Authorization for JWT)
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept, Authorization'
  );
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  if (req.method === 'OPTIONS') return res.sendStatus(204);
  next();
});

// ⭐ NEW: tiny health endpoints
app.get('/api/health', (req, res) => res.json({ ok: true, service: 'user-api' }));
app.get('/api/health/es', async (req, res) => {
  try {
    const info = await es.info();
    res.json({ ok: true, cluster: info.cluster_name || 'elasticsearch', node: ELASTIC_URL });
  } catch (e) {
    res.status(500).json({ ok: false, error: String(e), node: ELASTIC_URL });
  }
});

// Get dirname in ES module mode
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Create / open database (users.db sits beside this server.js)
const db = new sqlite3.Database(path.join(__dirname, 'users.db'), (err) => {
  if (err) console.error('Error opening database:', err.message);
  else console.log('✅ Connected to SQLite database');
});

// Users table
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

// Normalize legacy short roles to canonical names
db.serialize(() => {
  db.run(`UPDATE users SET role = 'Platform Administrator' WHERE role IN ('Platform Admin','platform admin')`);
  db.run(`UPDATE users SET role = 'Network Administrator'  WHERE role IN ('Network Admin','network admin')`);
});

// ⭐ NEW: JWT-based RBAC middleware
function authorize(roles = []) {
  return (req, res, next) => {
    const header = req.headers.authorization;
    if (!header) return res.status(401).json({ error: 'Missing Authorization header' });
    try {
      const token = header.split(' ')[1];
      const decoded = jwt.verify(token, JWT_SECRET);
      if (roles.length && !roles.includes(decoded.role)) {
        return res.status(403).json({ error: 'Forbidden: insufficient role' });
      }
      req.user = decoded; // { id, role, name, email, iat, exp }
      next();
    } catch (err) {
      console.error('[authorize] Invalid token:', err);
      return res.status(401).json({ error: 'Invalid or expired token' });
    }
  };
}

// ➕ POST /api/users - Create user
app.post('/api/users', async (req, res) => {
  const { name, email, password, role } = req.body;

  if (!name || !email || !password || !role) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
    const now = new Date().toISOString();
    const roleNorm = normalizeRole(role);

    const query = `INSERT INTO users (name, email, password_hash, role, status, joined_at, last_active)
                   VALUES (?, ?, ?, ?, 'Active', ?, ?)`;

    db.run(query, [name.trim(), String(email).toLowerCase().trim(), hashedPassword, roleNorm, now, now], function (err) {
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
        email: String(email).toLowerCase().trim(),
        role: roleNorm,
        status: 'Active',
        joined_at: now,
      });
    });
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
      const normalized = rows.map((r) => ({ ...r, role: normalizeRole(r.role) }));
      res.json(normalized);
    }
  );
});

// GET /api/users/:id
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
      return res.json({ ...row, role: normalizeRole(row.role) });
    }
  );
});

// 🔐 POST /api/auth/login - authenticate (email + password) + issue JWT
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
    if (!row) return res.status(401).json({ error: 'Invalid email or password.' });

    try {
      const ok = await bcrypt.compare(password, row.password_hash);
      if (!ok) return res.status(401).json({ error: 'Invalid email or password.' });

      const storedRole = normalizeRole(row.role);
      const desiredRole = expectedRole ? normalizeRole(expectedRole) : null;
      if (desiredRole && desiredRole !== storedRole) {
        return res.status(403).json({ error: 'Role mismatch for this account.' });
      }

      // ⭐ NEW: sign a real JWT with the user's role
      const token = jwt.sign(
        { id: row.id, role: storedRole, name: row.name, email: row.email },
        JWT_SECRET,
        { expiresIn: '2h' }
      );

      return res.json({
        token,
        user: {
          id: row.id,
          name: row.name,
          email: row.email,
          role: storedRole,
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

  if (!id || !name || !email || !role) {
    return res.status(400).json({ error: 'id, name, email, and role are required.' });
  }

  const emailNorm = String(email).toLowerCase().trim();
  const nameTrim = String(name).trim();
  const roleNorm = normalizeRole(role);

  // Validate email format
  const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailNorm);
  if (!emailOk) return res.status(400).json({ error: 'Invalid email format.' });

  const getUserById = () =>
    new Promise((resolve, reject) => {
      db.get(`SELECT id FROM users WHERE id = ?`, [id], (err, row) => (err ? reject(err) : resolve(row)));
    });

  const emailTakenByAnother = () =>
    new Promise((resolve, reject) => {
      db.get(
        `SELECT id FROM users WHERE email = ? AND id <> ? LIMIT 1`,
        [emailNorm, id],
        (err, row) => (err ? reject(err) : resolve(!!row))
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
    if (!exists) return res.status(404).json({ error: 'User not found.' });

    const taken = await emailTakenByAnother();
    if (taken) return res.status(409).json({ error: 'Email already in use by another account.' });

    let sql, params;
    if (password && String(password).length > 0) {
      if (String(password).length < 8) {
        return res.status(400).json({ error: 'Password must be at least 8 characters.' });
      }
      const hash = await bcrypt.hash(password, SALT_ROUNDS);
      sql = `UPDATE users SET name = ?, email = ?, role = ?, password_hash = ? WHERE id = ?`;
      params = [nameTrim, emailNorm, roleNorm, hash, id];
    } else {
      sql = `UPDATE users SET name = ?, email = ?, role = ? WHERE id = ?`;
      params = [nameTrim, emailNorm, roleNorm, id];
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
        return res.json({ ...row, role: normalizeRole(row.role) });
      }
    );
  } catch (e) {
    console.error('[PUT /api/users/:id] error:', e);
    if (e && e.code === 'SQLITE_CONSTRAINT') {
      return res.status(409).json({ error: 'Email already in use by another account.' });
    }
    if (String(e.message || '').includes('no such column: password_hash')) {
      return res.status(500).json({
        error: "Database schema missing 'password_hash' column. Add it or remove password update.",
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
    if (this.changes === 0) return res.status(404).json({ error: 'User not found.' });
    return res.json({ success: true });
  });
});

// Profile types table
db.run(`
  CREATE TABLE IF NOT EXISTS profile_types (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT UNIQUE NOT NULL,
    status TEXT NOT NULL DEFAULT 'Active',
    created_at TEXT NOT NULL
  )
`);

// Profile Types APIs (unchanged)
app.get('/api/profile-types', (req, res) => {
  db.all(`SELECT id, name, status, created_at FROM profile_types ORDER BY id DESC`, [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    return res.json(rows);
  });
});

app.post('/api/profile-types', (req, res) => {
  const { name, status } = req.body || {};
  if (!name || !status) return res.status(400).json({ error: 'name and status are required.' });
  const now = new Date().toISOString();
  const sql = `INSERT INTO profile_types (name, status, created_at) VALUES (?, ?, ?)`;
  db.run(sql, [String(name).trim(), String(status).trim(), now], function (err) {
    if (err) {
      if (String(err.message).includes('UNIQUE')) {
        return res.status(409).json({ error: 'Profile type already exists.' });
      }
      return res.status(500).json({ error: err.message });
    }
    return res.status(201).json({ id: this.lastID, name: String(name).trim(), status, created_at: now });
  });
});

app.put('/api/profile-types/:id', (req, res) => {
  const id = Number(req.params.id);
  const { name, status } = req.body || {};
  if (!id || !name || !status) return res.status(400).json({ error: 'id, name and status are required.' });

  const sql = `UPDATE profile_types SET name = ?, status = ? WHERE id = ?`;
  db.run(sql, [String(name).trim(), String(status).trim(), id], function (err) {
    if (err) {
      if (String(err.message).includes('UNIQUE')) {
        return res.status(409).json({ error: 'Profile type already exists.' });
      }
      return res.status(500).json({ error: err.message });
    }
    if (this.changes === 0) return res.status(404).json({ error: 'Profile type not found.' });
    db.get(`SELECT id, name, status, created_at FROM profile_types WHERE id = ?`, [id], (err2, row) => {
      if (err2) return res.status(500).json({ error: err2.message });
      return res.json(row);
    });
  });
});

app.delete('/api/profile-types/:id', (req, res) => {
  const id = Number(req.params.id);
  if (!id) return res.status(400).json({ error: 'Valid id is required.' });

  db.run(`DELETE FROM profile_types WHERE id = ?`, [id], function (err) {
    if (err) return res.status(500).json({ error: err.message });
    if (this.changes === 0) return res.status(404).json({ error: 'Profile type not found.' });
    return res.json({ success: true });
  });
});

// =========================================================
// IDS INTEGRATION ROUTES — Suricata & Zeek
// (Place this block ABOVE app.listen(...))
// =========================================================

// GET /api/suricata/alerts?limit=20
// Returns recent Suricata alerts from Elasticsearch
app.get(
  "/api/suricata/alerts",
  authorize(["Platform Administrator", "Security Analyst"]),
  async (req, res) => {
    try {
      const limit = Math.max(1, Math.min(200, Number(req.query.limit || 20)));
      const result = await es.search({
        index: ["filebeat-*", ".ds-filebeat-*"],  // cover indices & data streams
        size: limit,
        sort: [{ "@timestamp": { order: "desc" } }],
        track_total_hits: false,
        query: {
          bool: {
            must: [{ match: { "event.module": "suricata" } }],
            filter: [{ exists: { field: "suricata.eve.alert.signature" } }],
          },
        },
        _source: [
          "@timestamp",
          "suricata.eve.alert.signature",
          "suricata.eve.alert.severity",
          "source.ip",
          "source.port",
          "destination.ip",
          "destination.port",
          "network.protocol",
        ],
      });

      const alerts = result.hits.hits.map((h) => ({
        id: h._id,
        timestamp: h._source?.["@timestamp"],
        signature: h._source?.suricata?.eve?.alert?.signature,
        severity: h._source?.suricata?.eve?.alert?.severity,
        src_ip: h._source?.source?.ip,
        src_port: h._source?.source?.port,
        dest_ip: h._source?.destination?.ip,
        dest_port: h._source?.destination?.port,
        protocol: h._source?.network?.protocol,
      }));

      res.json(alerts);
    } catch (err) {
      console.error("[/api/suricata/alerts] ES error:", err?.meta?.body || err);
      res.status(500).json({ error: "ES query failed" });
    }
  }
);

// GET /api/zeek/logs?limit=20
// ⭐ FIXED: Now parses raw TSV message when structured fields are missing
app.get(
  "/api/zeek/logs",
  authorize(["Platform Administrator", "Security Analyst"]),
  async (req, res) => {
    try {
      const limit = Math.max(1, Math.min(200, Number(req.query.limit || 20)));
      const result = await es.search({
        index: ["filebeat-*", ".ds-filebeat-*"],
        size: limit,
        sort: [{ "@timestamp": { order: "desc" } }],
        track_total_hits: false,
        query: { match: { "event.module": "zeek" } },
        _source: [
          "@timestamp",
          "message",
          "event.dataset",
          "zeek.session_id",
          "source.ip",
          "source.port",
          "destination.ip",
          "destination.port",
          "network.transport"
        ],
      });

      const logs = result.hits.hits.map((h) => {
        const src = h._source;

        // Try structured fields first
        let src_ip = src?.source?.ip;
        let src_port = src?.source?.port;
        let dest_ip = src?.destination?.ip;
        let dest_port = src?.destination?.port;
        let proto = src?.network?.transport;
        let service = "—";

        // If structured fields are missing, parse the raw TSV message
        if (!src_ip && src?.message) {
          const parts = src.message.split("\t");
          // TSV format: ts uid orig_h orig_p resp_h resp_p proto service ...
          if (parts.length >= 8) {
            src_ip = parts[2];
            src_port = parts[3];
            dest_ip = parts[4];
            dest_port = parts[5];
            proto = parts[6];
            service = parts[7];
          }
        }

        return {
          id: h._id,
          timestamp: src?.["@timestamp"],
          event_type: (src?.event?.dataset || "").replace("zeek.", "") || "connection",
          service: service,
          src_ip: src_ip || "—",
          src_port: src_port || "—",
          dest_ip: dest_ip || "—",
          dest_port: dest_port || "—",
          proto: proto || "—",
        };
      });

      res.json(logs);
    } catch (err) {
      console.error("[/api/zeek/logs] ES error:", err?.meta?.body || err);
      res.status(500).json({ error: "ES query failed" });
    }
  }
);


app.listen(PORT, () => {
  console.log(`Server is running on http://0.0.0.0:${PORT}`);
  console.log(`JWT roles enforced. ES at ${ELASTIC_URL}`);
});