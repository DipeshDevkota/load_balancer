# QueueLess

QueueLess is a lightweight distributed web app that demonstrates a reverse proxy load balancer, backend health checks, automatic failover, and a real-time monitoring dashboard.

The project is split into three main parts:

- `load-balancer/`: a Node.js + TypeScript reverse proxy that distributes traffic across healthy backend servers
- `backend/`: three Express servers that act as application instances
- `client/`: a React + Vite dashboard that visualizes load balancer and backend health metrics

## Architecture

The system uses a round-robin style load balancer in front of three backend services. Each backend exposes a `/health` endpoint that the load balancer checks periodically. If a backend becomes unhealthy, the load balancer stops sending traffic to it and retries against another healthy instance.

```text
                 ┌────────────────────┐
                 │   React Dashboard  │
                 │      client/       │
                 └─────────┬──────────┘
                           │
                           │ http://localhost:5173
                           │
                 ┌─────────▼──────────┐
                 │  Load Balancer     │
                 │  load-balancer/    │
                 │  :3000             │
                 └───────┬─────┬──────┘
                         │     │
            ┌────────────┘     └────────────┐
            ▼                              ▼
   ┌──────────────┐              ┌──────────────┐
   │ Backend #1   │              │ Backend #2   │
   │ :3001        │              │ :3002        │
   └──────────────┘              └──────────────┘
            │                              │
            └──────────────┬───────────────┘
                           ▼
                   ┌──────────────┐
                   │ Backend #3   │
                   │ :3003        │
                   └──────────────┘
```

## Features

- Health-based routing across multiple backend instances
- Automatic failover when a backend server is unhealthy
- Request and success/failure metrics collection
- Round-robin request distribution
- Live monitoring dashboard for traffic and server status
- Docker Compose setup for running the full stack together

## Repository structure

```text
QueueLess/
├── docker-compose.yml
├── README.md
├── backend/
│   ├── Dockerfile
│   ├── package.json
│   ├── tsconfig.json
│   └── src/
│       ├── app.ts
│       ├── config/
│       ├── controllers/
│       ├── middleware/
│       ├── routes/
│       ├── servers/
│       ├── services/
│       └── utils/
├── client/
│   ├── Dockerfile
│   ├── README.md
│   ├── package.json
│   ├── vite.config.ts
│   └── src/
├── load-balancer/
│   ├── Dockerfile
│   ├── package.json
│   ├── tsconfig.json
│   └── src/
│       ├── config.ts
│       ├── healthChecker.ts
│       ├── loadBalancer.ts
│       ├── logger.ts
│       └── serverManager.ts
└── .gitignore
```

## Tech stack

- TypeScript
- Node.js
- Express.js
- React + Vite
- Docker + Docker Compose
- http-proxy

## Prerequisites

Before running the project, make sure you have:

- Node.js 18+ or later
- npm
- Docker and Docker Compose installed (recommended for full-stack setup)

## Running the project

### Option 1: Run everything with Docker

From the project root:

```bash
docker compose up --build
```

This will start:

- Frontend: http://localhost:5173
- Load balancer: http://localhost:3000
- Backend 1: http://localhost:3001
- Backend 2: http://localhost:3002
- Backend 3: http://localhost:3003

### Option 2: Run services locally

#### Start the backend servers

```bash
cd backend
npm install
npm run server1
```

Open additional terminals and run:

```bash
cd backend
npm run server2
```

```bash
cd backend
npm run server3
```

#### Start the load balancer

```bash
cd load-balancer
npm install
npm run dev
```

#### Start the dashboard

```bash
cd client
npm install
npm run dev -- --host 0.0.0.0
```

## API and monitoring endpoints

### Load balancer

- `GET /stats` — returns current backend health and traffic stats
- Proxies all other requests to the next healthy backend server

### Backends

- `GET /` — returns a backend greeting message
- `GET /health` — returns server health status

## Notes

- The load balancer checks server health every 15 seconds by default.
- Nodes are marked unhealthy when health checks fail or proxy requests fail.
- The dashboard polls the load balancer every 3 seconds to refresh live metrics.

## Useful commands

```bash
# Build frontend
cd client && npm run build

# Start Docker environment
docker compose up

# Stop Docker environment
docker compose down
```

## License

This project is licensed under the ISC License.
