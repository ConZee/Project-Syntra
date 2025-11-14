# Project Syntra – Intrusion Detection System (IDS) Monitoring Dashboard

Project Syntra is a web-based Intrusion Detection and Security Operations dashboard developed as part of our Final Year Project (FYP-25-S3-03).  
The system centralises security events from IDS sensors, manages multi-role access, visualises alerts, and supports threat-intelligence enrichment.

This repository contains both the **React frontend** and the **Node.js backend**.


## 🚀 Features

### Frontend (React + Chakra UI)
- Role-based dashboards:
  - **Platform Admin**
  - **Network Admin**
  - **Security Analyst**
- Authentication workflow with **MFA (TOTP)** using the `MFASetup` component.
- Token-based API authentication.
- Route segregation for each role.
- UI components based on the Horizon UI design system.

### Backend (Node.js + Express):
- **JWT-based authentication**
- **SQLite database** 
- **Password hashing**
- **CORS support**
- **TOTP MFA** 
- **QR code generation** for MFA 
- **Elasticsearch client** for threat-intelligence enrichment


## 🧩 Tech Stack

### Frontend
- React.js
- Chakra UI (Horizon UI component base)
- React Router
- ApexCharts
- Fetch/Axios integration

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
