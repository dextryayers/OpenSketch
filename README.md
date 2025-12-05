
<div align="center">

  <h1>🎨 OpenSketch</h1>
  
  <p>
    <strong>The Collaborative, Infinite Canvas Whiteboard for the Modern Web.</strong>
  </p>

  <p>
    <a href="https://haniipp.space">
      <img src="https://img.shields.io/badge/Maintained_by-haniipp.space-blueviolet?style=for-the-badge" alt="Maintained by haniipp.space" />
    </a>
  </p>

  <p>
    <img src="https://img.shields.io/badge/Next.js_15-000000?style=for-the-badge&logo=next.js&logoColor=white" alt="Next.js" />
    <img src="https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" />
    <img src="https://img.shields.io/badge/Socket.io-010101?style=for-the-badge&logo=socket.io&logoColor=white" alt="Socket.io" />
    <img src="https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white" alt="Docker" />
    <img src="https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="Tailwind" />
  </p>

  <br />

  <p align="center">
    <strong>OpenSketch</strong> is a high-performance, open-source real-time collaboration tool. <br />
    It mimics the feel of hand-drawn diagrams while providing the power of an infinite digital canvas.
  </p>

</div>

<br />

---

## ✨ Core Features

<table>
  <tr>
    <td width="50%">
      <h3 align="center">🤝 Real-Time Collaboration</h3>
      <p align="center">Seamlessly sync drawings and cursors across multiple users with sub-millisecond latency using WebSockets.</p>
    </td>
    <td width="50%">
      <h3 align="center">🎨 Hand-Drawn Aesthetics</h3>
      <p align="center">Built-in algorithms to make digital shapes look organic and sketchy, perfect for brainstorming and wireframing.</p>
    </td>
  </tr>
  <tr>
    <td width="50%">
      <h3 align="center">🛠️ Powerful Toolset</h3>
      <p align="center">Rectangle, Diamond, Arrow, Line, Pencil, Eraser, and Text support. Full control over stroke, fill, and roughness.</p>
    </td>
    <td width="50%">
      <h3 align="center">🌗 Adaptive UI</h3>
      <p align="center">Fully responsive design with native Dark Mode support and customizable grid systems (Dots, Lines, None).</p>
    </td>
  </tr>
</table>

---

## 🏗️ Architecture & Tech Stack

This project uses a modern **Monorepo** structure managed by NPM Workspaces.

### 🖥️ Client (`apps/web`)
*   **Framework:** Next.js 15 (App Router)
*   **Language:** TypeScript
*   **Canvas Engine:** Fabric.js v6 + Rough.js (for the hand-drawn look)
*   **State Management:** Zustand (Client state)
*   **Styling:** Tailwind CSS + Lucide React
*   **Communication:** Socket.io-client

### 🔌 Server (`apps/server`)
*   **Runtime:** Node.js
*   **Framework:** Express
*   **Real-time Engine:** Socket.io
*   **State Sync:** In-Memory Map (Dev) / Redis (Production ready via Docker)

---

## 🚀 Getting Started

You can run OpenSketch locally using Docker (recommended) or manually via NPM.

### Method 1: Docker Compose (Recommended)

The easiest way to get the entire stack (Web, Server, Redis) running instantly.

```bash
# 1. Clone the repository
git clone https://github.com/dextryayers/OpenSketch.git

# 2. Start the services
docker-compose up --build
```

> The app will be available at **http://localhost:3000**

### Method 2: Manual Development

<details>
<summary>Click to expand manual installation steps</summary>

1.  **Install dependencies**
    ```bash
    npm install
    ```

2.  **Configure Environment**
    Create `.env` files for both apps.

    *   **apps/web/.env**
        ```env
        NEXT_PUBLIC_WS_URL=http://localhost:3001
        ```

    *   **apps/server/.env**
        ```env
        PORT=3001
        REDIS_HOST=localhost
        ```

3.  **Run Development Mode**
    This command starts both the frontend and backend concurrently.
    ```bash
    npm run dev
    ```

</details>

---

## 📂 Project Structure

```bash
opensketch/
├── apps/
│   ├── web/                 # Next.js Frontend
│   │   ├── app/             # App Router Pages (Room & Landing)
│   │   ├── components/      # UI & Canvas Logic (Whiteboard.tsx)
│   │   ├── store/           # Zustand Stores
│   │   └── ...
│   └── server/              # Express Backend
│       ├── src/             # WebSocket Events & Room Logic
│       └── ...
├── docker-compose.yml       # Production/Dev Orchestration
└── package.json             # Monorepo Config
```

---

## 🛣️ Roadmap

- [x] Basic Shapes (Rect, Circle, Triangle)
- [x] Real-time Cursor Tracking
- [x] Undo/Redo History
- [x] Dark Mode
- [ ] Image Upload Support
- [ ] Export to PNG/SVG
- [ ] Authentication (NextAuth)

---

## 📝 License

This project is open-source and available under the **MIT License**.

<br />

<div align="center">
  <p>
    Copyright © 2024 <a href="https://haniipp.space"><strong>haniipp.space</strong></a>. All rights reserved.
  </p>
  <p>
    <em>Designed with passion for the open web.</em>
  </p>
</div>
