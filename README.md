# Project Syntra – Intrusion Detection System (IDS) Monitoring Dashboard

Project Syntra is a web-based Intrusion Detection and Security Operations dashboard developed as part of our Final Year Project (FYP-25-S3-09).  
The system centralises security events from IDS sensors, manages multi-role access, visualises alerts, and supports threat-intelligence enrichment.

This repository contains both the **React frontend** and the **Node.js backend**.

## 🚀 Features

### Frontend (React + Chakra UI)
- Role-based dashboards located under `src/pages`:
  - **Platform Admin**
  - **Network Admin**
  - **Security Analyst**
- Authentication workflow with **MFA (TOTP)** using the `MFASetup` component.
- Token-based API authentication integrated through `backend_api.js`.
- Route segregation for each role via:
  - `platformAdminRoutes.js`
  - `networkAdminRoutes.js`
  - `securityAnalystRoutes.js`
- UI components based on the Horizon UI design system.
- Footer components:
  - `FooterAdmin.js`
  - `FooterAuth.js`

### Backend (Node.js + Express)
Located in `/user-api`:
- **JWT-based authentication**
- **SQLite database** (`users.db`)
- **Password hashing**
- **CORS support**
- **TOTP MFA** (via `speakeasy`)
- **QR code generation** for MFA (via `qrcode`)
- **Elasticsearch client** for threat-intelligence enrichment
- Migration script: `migrate_alert_table.js`

Backend starts using:
```bash
npm start
```

## 🛠️ Getting Started

### 1. Clone the Repository
```bash
git clone https://github.com/ConZee/Project-Syntra
cd Project-Syntra
```

### 2. Install Frontend Dependencies
```bash
npm install
```

### 3. Start the Frontend
```bash
npm start
```
Runs by default on: **http://localhost:3000**

### 4. Install Backend Dependencies
```bash
cd user-api
npm install
```

### 5. Start the Backend API
```bash
npm start
```

## 🧩 Tech Stack

### Frontend
- React.js
- Chakra UI (Horizon UI component base)
- React Router
- ApexCharts
- Fetch/Axios integration through `backend_api.js`

### Backend
- Node.js
- Express
- SQLite3
- JWT authentication
- Speakeasy (TOTP MFA)
- Qrcode (QR generation)
- @elastic/elasticsearch

## 🔐 Authentication & Security

Project Syntra implements:
- Local user accounts stored in SQLite  
- Hashed passwords  
- Token-based authentication using JWT  
- Multi-Factor Authentication via TOTP  
- **Role-Based Access Control (RBAC)** for:
  - **Platform Admin**
  - **Network Admin**
  - **Security Analyst**

## 🧠 Threat Intelligence Integration

The backend includes support for Elasticsearch-driven enrichment, enabling:
- Threat scoring  
- Alert context enrichment  
- Future compatibility with external TI feeds  

## 📝 Credits

This project uses **Horizon UI (React + Chakra UI)** as the initial design and component reference.

**Credit:**  
Horizon UI React – https://horizon-ui.com  
© Simmmple – https://simmmple.com  

## 📄 License

This project follows the license included in this repository.

## 👥 Contributors

Chia Yi Ting
Chung Jung Han
Foo Zhi Yuan
Phua Jian Wei
Sri Rafhanah Bte Rudi
