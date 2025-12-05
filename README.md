
<div align="center">

  <h1>🎨 OpenSketch</h1>
  
  <p>
    <strong>The Collaborative, Infinite Canvas Whiteboard for the Modern Web.</strong>
  </p>

  <p>
    <a href="https://haniipp.space">
      <img src="https://img.shields.io/badge/Maintained_by-haniipp.space-7c3aed?style=for-the-badge&logo=spaceship&logoColor=white" alt="Maintained by haniipp.space" />
    </a>
  </p>

  <p>
    <img src="https://img.shields.io/badge/Next.js_15-000000?style=for-the-badge&logo=next.js&logoColor=white" alt="Next.js" />
    <img src="https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" />
    <img src="https://img.shields.io/badge/Socket.io-010101?style=for-the-badge&logo=socket.io&logoColor=white" alt="Socket.io" />
    <img src="https://img.shields.io/badge/Fabric.js_v6-e75165?style=for-the-badge&logo=fabric&logoColor=white" alt="Fabric.js" />
    <img src="https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white" alt="Docker" />
    <img src="https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="Tailwind" />
  </p>

  <br />

  <p align="center">
    <strong>OpenSketch</strong> is a high-performance, open-source real-time collaboration tool designed to mimic the freedom of a physical whiteboard.<br /> 
    Built with a Monorepo architecture, it leverages the latest web technologies to provide a seamless drawing experience.
  </p>

</div>

<br />

---

## 🌟 Key Features

<table>
  <tr>
    <td width="50%">
      <h3 align="center">🤝 Real-Time Collaboration</h3>
      <p>Seamlessly sync drawings, cursors, and object modifications across multiple users with sub-millisecond latency using <strong>WebSockets</strong>.</p>
    </td>
    <td width="50%">
      <h3 align="center">🖌️ Smart Drawing Tools</h3>
      <p>Includes a comprehensive suite of tools: Rectangle, Circle, Triangle, Rhombus, Arrow, Line, Freehand Pencil, Text, and Eraser.</p>
    </td>
  </tr>
  <tr>
    <td width="50%">
      <h3 align="center">⚡ High Performance</h3>
      <p>Powered by <strong>Fabric.js v6</strong> for hardware-accelerated rendering, supporting thousands of objects on an infinite canvas without lag.</p>
    </td>
    <td width="50%">
      <h3 align="center">🌗 UI/UX Excellence</h3>
      <p>Fully responsive interface with native <strong>Dark Mode</strong>, customizable Grid systems (Dots/Lines), and mobile-first gesture support.</p>
    </td>
  </tr>
  <tr>
    <td width="50%">
      <h3 align="center">↺ Undo / Redo History</h3>
      <p>Robust state management allows users to traverse drawing history effortlessly, ensuring no mistake is permanent.</p>
    </td>
    <td width="50%">
      <h3 align="center">📦 Monorepo Structure</h3>
      <p>Organized using <strong>NPM Workspaces</strong>, separating the Client and Server logic for better maintainability and scalability.</p>
    </td>
  </tr>
</table>

---

## 🛠️ Technology Stack

OpenSketch is built on a modern stack ensuring type safety, speed, and scalability.

### 🖥️ Client (Frontend)
Located in `apps/web`:
*   **Framework:** [Next.js 15](https://nextjs.org/) (App Router)
*   **Language:** [TypeScript](https://www.typescriptlang.org/)
*   **Canvas Engine:** [Fabric.js v6](http://fabricjs.com/) (HTML5 Canvas Abstraction)
*   **State Management:** [Zustand](https://github.com/pmndrs/zustand) (Global Client State)
*   **Styling:** [Tailwind CSS](https://tailwindcss.com/)
*   **Icons:** [Lucide React](https://lucide.dev/)
*   **Real-time Client:** Socket.io-client

### 🔌 Server (Backend)
Located in `apps/server`:
*   **Runtime:** Node.js
*   **Framework:** [Express](https://expressjs.com/)
*   **WebSocket Engine:** [Socket.io](https://socket.io/)
*   **Database/Cache:** Redis (via Docker) or In-Memory Map (Fallback)
*   **Language:** TypeScript

### ⚙️ DevOps & Tooling
*   **Containerization:** Docker & Docker Compose
*   **Package Manager:** NPM Workspaces
*   **Linting:** ESLint

---

## 🚀 Step-by-Step Installation Guide

Follow these steps to get OpenSketch running on your local machine.

### Prerequisites
*   **Node.js** (v18 or higher)
*   **npm** (v9 or higher)
*   **Git**
*   *(Optional)* **Docker Desktop** (for Redis/Production simulation)

### 1. Clone the Repository
```bash
git clone https://github.com/haniipp/opensketch.git
cd opensketch
```

### 2. Install Dependencies
Since this is a Monorepo, this command installs dependencies for both the root, web app, and server app.
```bash
npm install
```

### 3. Environment Configuration
OpenSketch works out-of-the-box with default settings, but you can configure it via `.env`.

**Web App Config:**
Create a file `apps/web/.env.local` (optional):
```env
NEXT_PUBLIC_WS_URL=http://localhost:3001
```

**Server Config:**
Create a file `apps/server/.env` (optional):
```env
PORT=3001
REDIS_HOST=localhost
```

### 4. Running the Application

#### Option A: Development Mode (Fastest)
Run both the frontend and backend concurrently in development mode with hot-reloading.

```bash
npm run dev
```
*   **Frontend:** `http://localhost:3000`
*   **Backend:** `http://localhost:3001`

#### Option B: Using Docker (Recommended for Stability)
If you have Docker installed, you can spin up the entire stack including Redis.

```bash
docker-compose up --build
```

---

## 📂 Project Structure Overview

```bash
opensketch/
├── apps/
│   ├── web/                 # Next.js Frontend Application
│   │   ├── app/             # App Router: Pages & Layouts
│   │   ├── components/      # React Components
│   │   │   ├── canvas/      # Core Whiteboard Logic (Fabric.js)
│   │   │   └── ui/          # Toolbar, Sidebar, Controls
│   │   ├── store/           # Zustand State Store
│   │   └── types.ts         # Shared Types
│   │
│   └── server/              # Express Backend Application
│       ├── src/
│       │   └── index.ts     # WebSocket Server Logic
│       └── Dockerfile
│
├── packages/                # Shared Packages (Future use)
├── docker-compose.yml       # Docker Orchestration
├── package.json             # Root Workspace Config
└── README.md                # Documentation
```

---

## 🛣️ Roadmap

- [x] **Basic Shapes:** Rectangles, Circles, Triangles, Lines.
- [x] **Freehand Drawing:** Pencil tool with adjustable thickness.
- [x] **Text Support:** Add and edit text on canvas.
- [x] **Room System:** Generate unique room IDs for collaboration.
- [x] **Dark Mode:** System-aware theme switching.
- [ ] **Image Upload:** Drag and drop images onto the canvas.
- [ ] **Export Options:** Save as PNG, SVG, or JSON.
- [ ] **Selection Transform:** Rotate and scale groups of objects.

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1.  Fork the Project
2.  Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3.  Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4.  Push to the Branch (`git push origin feature/AmazingFeature`)
5.  Open a Pull Request

---

## 📝 License & Copyright

Distributed under the MIT License. See `LICENSE` for more information.

<br />

<div align="center">
  <p>
    Copyright © 2024 <a href="https://haniipp.space" target="_blank"><strong>haniipp.space</strong></a>.<br />
    All rights reserved.
  </p>
  <p>
    <em>Created with ❤️ by Haniip.</em>
  </p>
</div>
