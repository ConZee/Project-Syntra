# Syntra IDS Platform

<div align="center">

![Syntra IDS](https://img.shields.io/badge/IDS-Network%20Security-blue)
![React](https://img.shields.io/badge/React-18.2.0-61DAFB?logo=react)
![Node.js](https://img.shields.io/badge/Node.js-Express-339933?logo=node.js)
![License](https://img.shields.io/badge/License-MIT-green)

**A comprehensive web-based Intrusion Detection System with real-time monitoring and multi-role access control**

[Features](#features) • [Architecture](#architecture) • [Installation (VM Setup)](#installation-vm-setup) • [Usage](#usage) • [API Documentation](#api-documentation)

</div>

---

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Architecture](#architecture)
- [Technology Stack](#technology-stack)
- [Prerequisites](#prerequisites)
- [Installation (VM Setup)](#installation-vm-setup)
- [Configuration](#configuration)
- [Usage](#usage)
- [API Documentation](#api-documentation)
- [User Roles](#user-roles)
- [Security](#security)
- [Deployment](#deployment)
- [Troubleshooting](#troubleshooting)
- [Contributing](#contributing)
- [License](#license)

---

## Overview

**Syntra IDS Platform** is a full-stack network security monitoring system that combines intrusion detection, network analysis, and data visualization into a unified web interface. Built as a final year project, it demonstrates modern web development practices with enterprise-grade security features.

### What Makes Syntra Unique?

- **Real-time IDS Monitoring**: Integrates Suricata and Zeek for comprehensive network security
- **Multi-Factor Authentication**: TOTP-based 2FA for enhanced security
- **Role-Based Access Control**: Three distinct user roles with granular permissions
- **Modern Tech Stack**: React frontend with Node.js backend and Elasticsearch for data storage
- **Enterprise Features**: Alert management, rule configuration, and notification system

---

## Features

### Core Functionality

- **Real-time Intrusion Detection** - Suricata IDS for signature-based threat detection
- **Network Protocol Analysis** - Zeek integration for deep packet inspection
- **Alert Visualization** - Interactive dashboards with ApexCharts
- **Log Management** - Elasticsearch-powered log aggregation and search
- **Rule Management** - Configure and manage IDS rules via web interface
- **Multi-Factor Authentication** - TOTP-based 2FA for all users
- **Role-Based Access Control** - Three user roles with distinct permissions
- **Health Monitoring** - Real-time status of all IDS components
- **Notification System** - Alert notifications for security events

### User Interface

- Modern, responsive design with Chakra UI
- Real-time charts and graphs for threat visualization
- Dark mode support

---

## Architecture

### High-Level System Design

```
┌─────────────┐     ┌─────────────┐
│   Suricata  │────▶│  Filebeat   │
│     IDS     │     │             │
└─────────────┘     │             │     ┌──────────────┐
                    │             │────▶│ Elasticsearch│
┌─────────────┐     │             │     │    :9200     │
│    Zeek     │────▶│             │     └──────┬───────┘
│  Monitor    │     └─────────────┘            │
└─────────────┘                                │
                                               │ REST API
                                               ▼
                                    ┌──────────────────┐
                                    │  Backend API     │
                                    │  (Express :3001) │
                                    │  - JWT Auth      │
                                    │  - MFA (TOTP)    │
                                    │  - SQLite        │
                                    └────────┬─────────┘
                                             │
                                             │ REST API
                                             ▼
                                    ┌──────────────────┐
                                    │  Frontend (React)│
                                    │      :3000       │
                                    │  - Chakra UI     │
                                    │  - ApexCharts    │
                                    └──────────────────┘
```

### Key Components

1. **Frontend (React)**: Single-page application with role-based routing
2. **Backend (Express)**: RESTful API with JWT authentication and MFA
3. **Database (SQLite)**: User data and application state
4. **IDS Layer**: Suricata and Zeek for network monitoring
5. **Data Pipeline**: Filebeat → Elasticsearch for log aggregation
6. **Search Engine**: Elasticsearch for fast log queries

---

## 🛠️ Technology Stack

### Frontend
- **React** 18.2.0 - UI framework
- **Chakra UI** 2.6.1 - Component library
- **React Router** 6.30.1 - Client-side routing
- **ApexCharts** 3.50.0 - Data visualization
- **Axios** 1.12.0 - HTTP client

### Backend
- **Node.js** with ES Modules
- **Express** 4.21.2 - Web framework
- **SQLite3** 5.1.7 - Database
- **JWT** 9.0.2 - Authentication
- **bcrypt** 5.1.1 - Password hashing
- **Speakeasy** 2.0.0 - TOTP/MFA implementation

### Infrastructure
- **Suricata IDS** - Signature-based intrusion detection
- **Zeek** - Network protocol analysis
- **Filebeat** - Log shipping
- **Elasticsearch** 7.x - Log storage and search
- **Linux** 4.4.0 - Operating system

---

## 📦 Prerequisites

Before installation, ensure you have:

- **Operating System**: Ubuntu 20.04+ or Debian-based Linux
- **Node.js**: Version 16.x or higher
- **npm**: Version 8.x or higher
- **RAM**: Minimum 4GB (8GB recommended)
- **Disk Space**: At least 20GB free
- **Network**: Interface for IDS monitoring
- **Sudo Access**: Required for system service installation

---

## Installation (VM Setup)

The Syntra IDS Platform is distributed as pre-configured Virtual Machine (VM) files in OVA format. Follow the comprehensive step-by-step installation guide available in the project's Google Drive folder.

**Google Drive Link**: https://drive.google.com/drive/u/2/folders/1EvCYrAsTrbO5IaYXsA0ebfbilWEXEFwH

**Setup Guide Document**: `Syntra_IDS_User_Manual_Setup_Guide.docx`

### Quick Installation Overview

1. **Download OVA Files** from Google Drive
   - IDS-VM.ova (Main system with Suricata, Zeek, and Dashboard)
   - Logging-VM.ova (Optional centralized logging)

2. **Import into VMware Workstation**
   - File > Open > Select OVA file
   - Accept default settings or customize as needed

3. **Configure Network**
   - Ensure Host-Only Adapter (VMnet2) is configured
   - Verify static IP: 192.168.56.128 for Logging-VM
   - Verify static IP: 192.168.56.10 for IDS-VM

4. **Power On and Access**
   - Start Logging-VM first (centralized logging)
   - Wait 60 seconds for Elasticsearch to initialize
   - Start IDS-VM (main system)
   - Start Kali Linux VM (for attack simulations)
   - Wait 2-3 minutes for all services to initialize

5. **Starting the Web Dashboard**
   
   The VMs come with pre-configured PyCharm terminals for easy startup.
   
   **Option A: Quick Start (Recommended)**
   ```bash
   # Open PyCharm with pre-configured terminals
   Pycharm &
   ```
   
   Two terminals should automatically open:
   - Terminal 1: Backend API directory (`/user-api`)
   - Terminal 2: Frontend directory (root folder)
   
   If terminals are already pointing to the correct folders:
   - In Terminal 1 (user-api): Run `node server.js`
   - In Terminal 2 (root): Run `npm start`
   - Wait 1-2 minutes for the dashboard to start
   
   **Option B: Manual Start (if terminals not pre-configured)**
   
   Open a new terminal and follow these steps:
   
   ```bash
   # Step 1: Start Backend API
   cd ~/PycharmProjects/This-is-the-ConZee-Folder-For-Testing/user-api
   
   # Install dependencies (first time only)
   npm install
   
   # Run database migration (first time only)
   node migrate_alert_table.js
   
   # Start backend server
   node server.js
   ```
   
   Open a second terminal:
   
   ```bash
   # Step 2: Start Frontend
   cd ~/PycharmProjects/This-is-the-ConZee-Folder-For-Testing/
   
   # Install dependencies (first time only)
   npm install
   
   # Start React development server
   npm start
   ```
   
   Wait 1-2 minutes for all dependencies to load and the dashboard to start.

6. **Access the Dashboard**
   
   Once both servers are running, check the terminal output for the network address.
   
   Look for the message in the frontend terminal:
   ```
   On Your Network:  http://192.168.56.128:3000
   ```
   
   Access the dashboard using one of these URLs:
   - **Primary**: http://192.168.56.128:3000
   - **Alternative**: http://192.168.143.128:3000
   - **Alternative**: http://192.168.143.132:3000
   - **From within VM**: http://localhost:3000
   
   If none of the IP matches: Follow IP will be shown in the terminal output under "On Your Network".

**Important Notes**:
- **First Time Setup**: Run `npm install` in both directories and `node migrate_alert_table.js` once
- **Subsequent Startups**: Only run `node server.js` and `npm start`
- **Default Credentials**: See Usage section below for login credentials
- **Port Conflicts**: If port 3000 or 3001 is already in use, stop conflicting services first

For detailed installation instructions including:
- Pre-installation preparation
- VMware Workstation setup
- Network configuration
- Troubleshooting steps
- System verification

Please refer to the complete User Manual in the Google Drive folder.

---

## Configuration

### Environment Variables

Create a `.env` file in the root directory:

```env
# Backend API
REACT_APP_API_URL=http://192.168.56.128:3001

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-this

# Elasticsearch
ELASTICSEARCH_URL=http://localhost:9200

# Server Configuration
PORT=3001
FRONTEND_PORT=3000

# MFA Configuration
MFA_ISSUER=Syntra IDS Platform
```

### Network Configuration

**VM Network Setup** (if using virtual machine):
- Network Adapter: Host-Only & Bridged
- IP Address: 192.168.56.128 (static)
- IP AddressL Follows Bridging VM IP
- Ports to expose: 3000 (Frontend), 3001 (Backend)

### Firewall Rules

```bash
# Allow required ports
sudo ufw allow 3000/tcp  # Frontend
sudo ufw allow 3001/tcp  # Backend API
sudo ufw enable
```

---

## Usage

### Default Credentials

After installation, use these credentials to log in:

**Platform Administrator**:
- Username: `admin`
- Password: `admin123` (Change immediately!)

### First-Time Setup

1. **Access the application**: Navigate (on local device eg. Laptop) to `http://192.168.56.128:3000` or follow the IP on terminal
2. **Login**: Use default admin credentials
3. **Setup MFA**: 
   - Go to Settings → MFA Settings
   - Scan QR code with authenticator app (Google Authenticator, Authy, etc.)
   - Enter 6-digit code to verify
4. **Change Password**: Go to Settings → Change Password
5. **Create Users**: Go to Users → Add User to create additional accounts

### Starting the System

**Method 1: Using PyCharm (Recommended)**

The VM comes with PyCharm pre-configured for easy startup:

```bash
# Open PyCharm with pre-configured terminals
Pycharm &
```

In the PyCharm terminals:
- Terminal 1 (user-api): `node server.js`
- Terminal 2 (root): `npm start`


### Accessing Different Dashboards

**Platform Administrator** - Full system access:
- User Management: `/platformadmin/users`
- System Alerts: `/platformadmin/alerts`
- Dashboard: `/platformadmin/dashboard`

**Network Administrator** - Rule and source management:
- Rules Management: `/networkadmin/rules`
- Sources Integration: `/networkadmin/sources`
- Notifications: `/networkadmin/notifications`

**Security Analyst** - Monitoring and analysis:
- Alert Monitor: `/securityanalyst/alerts`
- Log Viewer: `/securityanalyst/logs`
- Dashboard: `/securityanalyst/dashboard`

---

## 📡 API Documentation

### Authentication Endpoints

#### POST `/api/auth/register`
Register a new user account.

**Request Body**:
```json
{
  "username": "john_doe",
  "email": "john@example.com",
  "password": "SecurePass123!",
  "role": "Security Analyst"
}
```

**Response**:
```json
{
  "message": "User registered successfully",
  "userId": 5
}
```

#### POST `/api/auth/login`
Authenticate user and receive JWT token.

**Request Body**:
```json
{
  "email": "john@example.com",
  "password": "SecurePass123!"
}
```

**Response** (without MFA):
```json
{
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": 5,
    "username": "john_doe",
    "email": "john@example.com",
    "role": "Security Analyst"
  }
}
```

**Response** (with MFA enabled):
```json
{
  "requiresMFA": true,
  "userId": 5
}
```

#### POST `/api/auth/verify-mfa`
Verify MFA code and complete authentication.

**Request Body**:
```json
{
  "userId": 5,
  "token": "123456"
}
```

### User Management Endpoints

#### GET `/api/users`
Get all users (Platform Admin only).

**Headers**: `Authorization: Bearer <jwt_token>`

**Response**:
```json
[
  {
    "id": 1,
    "username": "admin",
    "email": "admin@syntra.local",
    "role": "Platform Administrator",
    "mfa_enabled": 1,
    "created_at": "2025-01-01 10:00:00"
  }
]
```

#### PUT `/api/users/:id`
Update user details.

**Headers**: `Authorization: Bearer <jwt_token>`

**Request Body**:
```json
{
  "username": "john_updated",
  "email": "john.new@example.com",
  "role": "Network Administrator"
}
```

#### DELETE `/api/users/:id`
Delete a user (Platform Admin only).

**Headers**: `Authorization: Bearer <jwt_token>`

### Alert Endpoints

#### GET `/api/alerts`
Get IDS alerts from Elasticsearch.

**Headers**: `Authorization: Bearer <jwt_token>`

**Query Parameters**:
- `from`: Start index (default: 0)
- `size`: Number of results (default: 50)
- `severity`: Filter by severity (optional)
- `startDate`: Start date filter (ISO format)
- `endDate`: End date filter (ISO format)

**Response**:
```json
{
  "total": 127,
  "alerts": [
    {
      "timestamp": "2025-11-15T10:30:45.123Z",
      "alert": {
        "signature": "ET POLICY Suspicious User-Agent",
        "severity": 2,
        "category": "Policy Violation"
      },
      "src_ip": "192.168.1.100",
      "dest_ip": "10.0.0.50",
      "src_port": 45321,
      "dest_port": 80,
      "proto": "TCP"
    }
  ]
}
```

#### GET `/api/alerts/stats`
Get alert statistics.

**Headers**: `Authorization: Bearer <jwt_token>`

**Response**:
```json
{
  "total": 127,
  "critical": 5,
  "high": 23,
  "medium": 67,
  "low": 32,
  "last24h": 45
}
```

### Rules Management Endpoints

#### GET `/api/rules`
Get all IDS rules (Network Admin only).

**Headers**: `Authorization: Bearer <jwt_token>`

**Response**:
```json
[
  {
    "id": 1,
    "name": "SSH Brute Force Detection",
    "content": "alert tcp any any -> any 22 (msg:\"SSH Brute Force\"; ...)",
    "enabled": true,
    "category": "Authentication",
    "created_at": "2025-01-15 08:00:00"
  }
]
```

#### POST `/api/rules`
Create a new IDS rule.

**Headers**: `Authorization: Bearer <jwt_token>`

**Request Body**:
```json
{
  "name": "SQL Injection Detection",
  "content": "alert tcp any any -> any 80 (msg:\"SQL Injection Attempt\"; ...)",
  "category": "Web Application",
  "enabled": true
}
```

#### PUT `/api/rules/:id`
Update an existing rule.

#### DELETE `/api/rules/:id`
Delete a rule.

### System Health Endpoints

#### GET `/api/health`
Get system health status.

**Response**:
```json
{
  "elasticsearch": "healthy",
  "suricata": "running",
  "zeek": "running",
  "filebeat": "running",
  "api": "healthy",
  "timestamp": "2025-11-15T10:30:00.000Z"
}
```

#### GET `/api/health/elasticsearch`
Check Elasticsearch connectivity.

**Response**:
```json
{
  "status": "healthy",
  "cluster": "elasticsearch",
  "indices": 5,
  "documents": 125431
}
```

---

## 👥 User Roles

### Platform Administrator
**Full system access with all permissions**

**Capabilities**:
- User management (create, edit, delete users)
- View all alerts and logs
- Configure system settings
- Manage IDS rules
- Access all dashboards
- System health monitoring

**Dashboard Features**:
- User management interface
- System-wide alert overview
- IDS health status
- Activity logs
- Configuration management

---

### Network Administrator
**Focused on IDS configuration and rule management**

**Capabilities**:
- Manage IDS rules (create, edit, enable/disable)
- Configure alert notifications
- Integrate IDS sources
- View alerts and logs
- Cannot manage users
- Cannot access system settings

**Dashboard Features**:
- Rule management interface
- Source integration panel
- Notification configuration
- Alert statistics

---

### Security Analyst
**Monitoring and analysis role**

**Capabilities**:
- View all IDS alerts
- View network logs (Zeek)
- Filter and search alerts
- Export alert data
- Cannot modify rules
- Cannot manage users
- Cannot change system configuration

**Dashboard Features**:
- Real-time alert monitor
- Zeek log viewer
- Alert filtering and search
- Threat visualization charts
- Export functionality

---

## 🔒 Security

### Authentication & Authorization

- **JWT Tokens**: Stateless authentication with 24-hour expiration
- **Password Hashing**: bcrypt with salt rounds (cost factor: 10)
- **Multi-Factor Authentication**: TOTP-based 2FA using Speakeasy
- **Role-Based Access Control**: Middleware enforces role permissions
- **Session Management**: Token refresh mechanism

### Security Best Practices

1. **Change Default Credentials**: Immediately change the default admin password
2. **Enable MFA**: Enforce MFA for all users, especially admins
3. **Firewall Configuration**: Only expose necessary ports (3000, 3001)
4. **Elasticsearch Security**: Keep Elasticsearch on localhost (127.0.0.1)
5. **HTTPS**: Deploy behind reverse proxy with SSL/TLS in production
6. **Input Validation**: All inputs are validated and sanitized
7. **SQL Injection Protection**: Parameterized queries prevent SQL injection
8. **XSS Protection**: React automatically escapes rendered content

### Password Requirements

- Minimum 8 characters
- Must contain uppercase and lowercase letters
- Must contain at least one number
- Special characters recommended

---

## Deployment

### VM Deployment (Recommended)

The application is designed for VM deployment. For complete step-by-step VM setup instructions, please refer to the **User Manual & Setup Guide** available in the project's Google Drive folder.

**Google Drive Link**: https://drive.google.com/drive/u/2/folders/1EvCYrAsTrbO5IaYXsA0ebfbilWEXEFwH

**VM Specifications**:
- OS: Ubuntu 24.04 LTS (Linux 4.4.0)
- RAM: 4GB minimum, 6GB recommended
- CPU: 2 cores minimum, 4 cores recommended
- Disk: 30GB+ (dynamically allocated)
- Network: Host-Only Adapter (VMnet2)
- Static IP: 192.168.56.128

---

## Troubleshooting

### Emergency Restart Scripts

If services are not responding or the dashboard shows errors, use the emergency restart scripts included in the VM:

**On IDS-VM** (192.168.56.10):
```bash
sudo ./emergency_restart_ids_vm.sh
```

This script will:
- Stop all IDS services (Filebeat, Suricata, Zeek)
- Clean up stale PID files
- Restart services in the correct order
- Verify each service is working
- Generate test traffic
- Estimated time: 30-60 seconds

**On Logging-VM** (if using centralized logging):
```bash
sudo ./emergency_restart_logging_vm.sh
```

This script will:
- Restart Elasticsearch gracefully
- Wait for full initialization (30-60 seconds)
- Verify cluster health
- Check for recent data from IDS-VM
- Estimated time: 60-90 seconds

**Recommended Procedure** (when both VMs have issues):
1. Run emergency_restart_logging_vm.sh on Logging-VM FIRST
2. Wait 60 seconds for Elasticsearch to fully start
3. Run emergency_restart_ids_vm.sh on IDS-VM
4. Wait 2-3 minutes for data pipeline to establish
5. Refresh dashboard (Ctrl+F5)

### Common Issues

#### 1. Services Not Starting
**Symptoms:**
- IDS Health shows 'Partial Service' or 'Degraded'
- Zeek Network Monitor shows 'OFFLINE'
- Cannot access dashboard

**Solution:**
Run the emergency restart script on IDS-VM (see above)

#### 2. Cannot Access Dashboard
If you cannot access http://192.168.56.128:3000:

1. **Verify services are running**:
```bash
# Check if backend is running (should show node server.js)
ps aux | grep "node server.js"

# Check if frontend is running (should show npm/react-scripts)
ps aux | grep react-scripts
```

2. **Check which network address the system is using**:
```bash
# On IDS-VM terminal
ip addr show
```

3. **Try alternative URLs**:
   - http://localhost:3000 (from within VM)
   - http://192.168.56.128:3000 (from host)
   - http://192.168.143.128:3000 (alternative network)
   - http://192.168.143.132:3000 (alternative network)
   - Check IP address after running "npm start" in "This-is-the-ConZee-Folder-For-Testing/" folder

4. **Restart the dashboard**:
```bash
# Stop running processes
pkill -f "node server.js"
pkill -f "react-scripts"

# Restart using PyCharm or manual method (see Installation section)
```

5. **Check firewall settings on host machine**

#### 3. VM Screen Goes Black
The VM may enter power-saving mode and display a black screen.

**Solution:**
1. Press Enter or move the mouse
2. If still black, click inside the VM window and press any key
3. If no response:
   - In VMware: VM menu > Power > Restart Guest
   - Or use VM > Send Ctrl+Alt+Del

#### 4. Elasticsearch Not Starting
```bash
# Check logs
sudo journalctl -u elasticsearch -f

# Verify disk space (Elasticsearch requires at least 10% free)
df -h

# Check if Elasticsearch is already running
sudo systemctl status elasticsearch

# Manually start if needed
sudo systemctl start elasticsearch
sudo systemctl enable elasticsearch
```

#### 5. No Alerts in Dashboard
```bash
# Check Elasticsearch indices
curl http://localhost:9200/_cat/indices?v

# Verify Filebeat is shipping logs
sudo filebeat test output

# Check Filebeat logs
sudo journalctl -u filebeat -f

# View Suricata alerts directly
sudo tail -f /var/log/suricata/eve.json
```

#### 6. Network Connectivity Issues
**Problem:** Cannot ping VM from host

**Solution:**
1. Verify VMnet2 adapter is enabled on host machine
2. Check IP configuration:
```bash
# On host (Windows)
ipconfig

# On IDS-VM
ip addr show
```

3. Verify VM network adapter settings:
   - VM Settings > Network Adapter > Host-only (VMnet2)
   - Ensure 'Connected' is checked

4. Check firewall settings (Windows Defender Firewall may block pings)

### Running Attack Simulations

To test the IDS detection capabilities, use the malicious IP simulator from Kali Linux VM:

#### Setting Up Kali Linux
1. Import Kali-Linux.ova into VMware (if available)
2. Configure network adapter to use same Host-Only network (VMnet2)
3. Power on Kali Linux VM
4. Login with default credentials

#### Running the Malicious IP Simulator

On Kali Linux terminal:
```bash
# List available files
ls

# You should see:
# - malicious_ip_simulator_scapy.py
# - malicious_ip_config.json

# Run the simulator with sudo
sudo ./malicious_ip_simulator_scapy.py
```

The script will:
1. Query AbuseIPDB for known malicious IPs (confidence >= 90)
2. Fetch approximately 20 malicious IP addresses
3. Display a summary of IPs by country
4. Show threat scores (typically 100/100 for high-confidence threats)

**Attack Types Available:**
1. Port Scan - Scans multiple ports from malicious IPs
2. Web Attack - Simulates SQL injection and XSS attempts
3. DDoS Simulation - Mixed SYN/HTTP/ICMP flood
4. All of the above - Full demonstration
0. Exit

Select your choice (1-4) and press Enter.

#### Monitoring Attack Detection

While the attack simulation is running:

1. Open the Syntra IDS Dashboard in your browser
2. Navigate to **Security Analyst Dashboard**
3. Monitor:
   - Total Alerts (should increase as attacks are detected)
   - High Severity Alerts (critical detections)
   - Alert Timeline (real-time visualization)
   - Alert Categories (types of attacks detected)
4. Click on individual alerts to see details:
   - Source IP (the malicious IP)
   - Destination IP (your target)
   - Attack signature
   - Timestamp
   - Severity level
5. Check the Alerts page for comprehensive alert log

### Debug Mode

Enable debug logging for troubleshooting:

```bash
# Backend debug mode
cd ~/This-is-the-ConZee-Folder-For-Testing/Project-Syntra-main/user-api
DEBUG=* node server.js

# Check all service statuses
cd ~/FYP_Test_2
./check-services.sh
```

### Log Locations

```bash
# Application logs
/home/logging/PycharmProjects/This-is-the-ConZee-Folder-For-Testing/Project-Syntra-main/user-api/logs/

# Suricata logs
/var/log/suricata/eve.json

# Zeek logs
/opt/zeek/logs/current/

# Elasticsearch logs
/var/log/elasticsearch/

# Filebeat logs
/var/log/filebeat/
```

**Network Commands:**
```bash
# Check IP address
ip addr show

# Test connectivity
ping -c 4 192.168.56.1

# Check open ports
sudo netstat -tulpn | grep LISTEN
```

**Logs and Monitoring:**
```bash
# View Suricata alerts in real-time
sudo tail -f /var/log/suricata/eve.json

# View system resources
htop

# Check disk space
df -h
```

---

## Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

### Development Guidelines

- Follow ESLint configuration for code style
- Write meaningful commit messages
- Add comments for complex logic
- Update documentation for new features
- Test thoroughly before submitting PR

---

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## Authors

**Final Year Project Team**
- Project Type: Web-Based Intrusion Detection System
- Academic Year: 2025
- Institution: Singapore Institute of Management - Universirty of Wollonggong (SIM-UOW)

---

## Acknowledgments

- **Suricata** - Open-source IDS engine
- **Zeek** - Network security monitoring platform
- **Elastic Stack** - Search and analytics
- **Chakra UI** - React component library
- **ApexCharts** - Modern charting library

---

## Roadmap

### Version 1.1 (Planned)
- [ ] Docker containerization
- [ ] Automated rule updates
- [ ] Email notification integration
- [ ] Advanced threat intelligence feeds
- [ ] Performance dashboard

### Version 2.0 (Future)
- [ ] Machine learning-based anomaly detection
- [ ] Multi-node deployment support
- [ ] Mobile application
- [ ] Integration with SIEM platforms
- [ ] Custom rule creation wizard

---

<div align="center">

Made by the Syntra IDS Team - FYPJ Project (SIM)

</div>
