# 🚀 DevOps Monitoring System (Mini Datadog)

A full-stack **DevOps monitoring system** that collects real-time server metrics (CPU, memory, disk, containers) from an EC2 instance and visualizes them in a modern dashboard using Supabase and React.

---

## 🧠 Overview

This project simulates a lightweight version of tools like **Datadog / Grafana**:

* 🖥️ Agent runs on server (EC2)
* 📡 Metrics are collected & pushed to Supabase
* 🗄️ Supabase stores data (Postgres)
* 📊 React dashboard visualizes metrics in real-time

---

## 🏗️ Architecture

```
[EC2 Server]
   └── Docker Monitoring Agent
            ↓
     (HTTP via SSH Tunnel)
            ↓
[Local Supabase]
   └── Postgres Database
            ↓
[React Dashboard]
   └── Visualization (Charts + UI)
```

---

## ⚙️ Features

### 🔍 Monitoring

* CPU usage tracking
* Memory usage tracking
* Disk usage tracking
* Docker container status

### 📊 Dashboard

* Modern dark UI (Tailwind)
* Live updating charts
* Stat cards (CPU, Memory, Disk)
* Container status panel

### 🚨 Alerts (basic)

* CPU threshold-based alerts
* Stored in database

---

## 🧱 Tech Stack

### Backend / Infra

* Node.js (Agent)
* Docker (Agent deployment)
* systeminformation (metrics)
* dockerode (container stats)

### Database / API

* Supabase (Postgres + REST API)

### Frontend

* React (Vite)
* Tailwind CSS
* Recharts (charts)

---

## 🚀 Setup Guide

---

### 1️⃣ Supabase (Local Setup)

```bash
npx supabase init
npx supabase start
```

👉 Access:

* API: http://localhost:54321
* Studio: http://localhost:54323

---

### 2️⃣ Database Schema

Run in Supabase SQL Editor:

```sql
create table metrics (
  id bigint generated always as identity primary key,
  server_id text,
  cpu_usage float,
  memory_usage float,
  disk_usage float,
  created_at timestamp default now()
);

create table containers (
  id bigint generated always as identity primary key,
  server_id text,
  container_name text,
  status text,
  created_at timestamp default now()
);

create table alerts (
  id bigint generated always as identity primary key,
  server_id text,
  type text,
  message text,
  created_at timestamp default now()
);
```

---

### 3️⃣ SSH Tunnel (Local → EC2)

```bash
ssh -i "your-key.pem" \
-R 0.0.0.0:54321:localhost:54321 \
ubuntu@your-ec2-ip
```

---

### 4️⃣ Monitoring Agent (EC2)

#### Install Docker

```bash
sudo apt update
sudo apt install docker.io -y
```

---

#### Run Agent

```bash
docker run -d \
  --name monitor-agent \
  --restart unless-stopped \
  --network host \
  -v /var/run/docker.sock:/var/run/docker.sock \
  --env-file .env \
  monitor-agent
```

---

### 5️⃣ Environment Variables

`.env` file:

```
SUPABASE_URL=http://localhost:54321
SUPABASE_KEY=your_publishable_key
SERVER_ID=your-server-id
```

---

### 6️⃣ Frontend Dashboard

```bash
npm install
npm run dev
```

👉 Open: http://localhost:5173

---

## 📊 Dashboard Features

* 📈 CPU / Memory / Disk charts
* ⚡ Auto-refresh (5s)
* 🐳 Container status list
* 🌙 Dark theme UI

---

## 🔐 Security Notes

* Uses **publishable key (safe)**
* Avoid using `service_role` key
* SSH tunnel prevents public exposure

---

## ⚠️ Known Limitations

* Supabase running locally (not production)
* No authentication in dashboard
* Basic alerting system

---

## 🚀 Future Improvements

* 🔴 Real-time updates (WebSockets)
* 📊 Multi-server monitoring
* 🔔 Slack / Email alerts
* 📅 Time filters (1h, 24h)
* 🌍 Deploy Supabase on EC2
* 🔐 Authentication system

---

## 💡 Learnings

* Docker networking challenges
* SSH reverse tunneling
* Supabase RLS & API behavior
* Observability system design

---

## 📸 Screenshots

![alt text](image.png)

---

## 🧑‍💻 Author

Built by **Ashutosh Singh**
DevOps Engineer 🚀

---

## ⭐ Inspiration

* Datadog
* Grafana
* Prometheus

---

## 📌 Conclusion

This project demonstrates:

✔️ Real-world DevOps monitoring
✔️ Distributed system design
✔️ Full-stack implementation
✔️ Production-like debugging skills

---

⭐ If you like this project, consider starring it!
