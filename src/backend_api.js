// src/backend_api.js
const API = process.env.REACT_APP_API_URL;

function getAuthHeader() {
  const token = localStorage.getItem("accessToken"); // <- unified
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export async function login(email, password) {
  const res = await fetch(`${API}/api/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Login failed");
  // store handled by AuthContext.login(), see below
  return data; // { token, user }
}

export async function getUsers() {
  const res = await fetch(`${API}/api/users`, { headers: { ...getAuthHeader() } });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}

export async function getSuricataAlerts(limit = 20) {
  const res = await fetch(`${API}/api/suricata/alerts?limit=${limit}`, { headers: { ...getAuthHeader() } });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}

export async function getZeekLogs(limit = 20) {
  const res = await fetch(`${API}/api/zeek/logs?limit=${limit}`, { headers: { ...getAuthHeader() } });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}

export async function getIDSRules() {
  const res = await fetch(`${API}/api/ids-rules`, {
    headers: { ...getAuthHeader() }
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}

export async function getIDSRule(id) {
  const res = await fetch(`${API}/api/ids-rules/${id}`, {
    headers: { ...getAuthHeader() }
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}

export async function createIDSRule(ruleData) {
  const res = await fetch(`${API}/api/ids-rules`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeader()
    },
    body: JSON.stringify(ruleData),
  });
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.error || `HTTP ${res.status}`);
  }
  return res.json();
}

export async function updateIDSRule(id, ruleData) {
  const res = await fetch(`${API}/api/ids-rules/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeader()
    },
    body: JSON.stringify(ruleData),
  });
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.error || `HTTP ${res.status}`);
  }
  return res.json();
}

export async function deleteIDSRule(id) {
  const res = await fetch(`${API}/api/ids-rules/${id}`, {
    method: 'DELETE',
    headers: { ...getAuthHeader() },
  });
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.error || `HTTP ${res.status}`);
  }
  return res.json();
}

export async function searchIDSRules(query) {
  const res = await fetch(`${API}/api/ids-rules/search?q=${encodeURIComponent(query)}`, {
    headers: { ...getAuthHeader() },
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}