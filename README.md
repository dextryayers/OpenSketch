# 🎨 OpenSketch V.1.0.1

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=flat&logo=typescript&logoColor=white)
![Next.js](https://img.shields.io/badge/Next.js-black?style=flat&logo=next.js&logoColor=white)
![Socket.io](https://img.shields.io/badge/Socket.io-010101?style=flat&logo=socket.io&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-2496ED?style=flat&logo=docker&logoColor=white)

**OpenSketch** is a high-performance, open-source collaborative whiteboard application. Built with a focus on speed and usability, it allows multiple users to draw, sketch, and brainstorm in real-time on an infinite canvas. It features a hand-drawn aesthetic style, dark mode support, and a robust undo/redo system.

---

## ✨ Key Features

*   **🤝 Real-time Collaboration:** See other users' cursors and drawings instantly via WebSockets.
*   **🖌️ Rich Toolset:** Pencil, Rectangle, Circle, Diamond, Arrows, Lines, Text, and Eraser.
*   **🎨 Customization:** Adjust stroke color, width, opacity, and fill styles.
*   **🌗 Dark/Light Mode:** Native support for dark themes with adaptive grid systems.
*   **📐 Grid Systems:** Toggle between Blank, Line, and Dot grids for precision.
*   **↩️ History Management:** Robust Undo/Redo functionality.
*   **🖐️ Infinite Canvas:** Pan and zoom capabilities (up to 500%).
*   **📱 Responsive:** Optimized for both Desktop and Mobile touch interactions.

---

## 🛠️ Tech Stack

### Monorepo Structure
This project is organized as a monorepo using **npm workspaces**.

| Domain | Technology | Description |
| :--- | :--- | :--- |
| **Frontend** | **Next.js 15 (App Router)** | React Framework for the UI. |
| | **TypeScript** | Type safety and developer experience. |
| | **Fabric.js v6** | Powerful HTML5 canvas library for object manipulation. |
| | **Zustand** | Lightweight state management for UI controls. |
| | **Tailwind CSS** | Utility-first CSS framework for styling. |
| | **Lucide React** | Beautiful, consistent icons. |
| **Backend** | **Node.js & Express** | API server environment. |
| | **Socket.io** | Real-time bidirectional event-based communication. |
| | **Redis** | In-memory data store for syncing room states (optional/production). |
| **DevOps** | **Docker & Compose** | Containerization for consistent environments. |

---

## 🚀 Getting Started

Follow these steps to set up the project locally.

### Prerequisites
*   Node.js (v18 or higher)
*   npm (v9 or higher)
*   Docker & Docker Compose (optional, for containerized run)

### Method 1: Local Development (Manual)

1.  **Clone the repository**
    ```bash
    git clone https://github.com/yourusername/opensketch.git
    cd opensketch
    ```

2.  **Install Dependencies**
    From the root directory:
    ```bash
    npm install
    ```

3.  **Environment Setup**
    Create a `.env` file in `apps/web`:
    ```env
    NEXT_PUBLIC_WS_URL=http://localhost:3001
    ```

    Create a `.env` file in `apps/server`:
    ```env
    PORT=3001
    REDIS_HOST=localhost
    CORS_ORIGIN=*
    ```

4.  **Run Development Servers**
    This command runs both the Next.js frontend and Express backend concurrently:
    ```bash
    npm run dev
    ```

    *   **Frontend:** http://localhost:3000
    *   **Backend:** http://localhost:3001

### Method 2: Docker Compose (Recommended)

Run the entire stack (Frontend + Backend + Redis) with a single command.

```bash
docker-compose up --build
```

---

## 📂 Project Structure

```
opensketch-monorepo/
├── apps/
│   ├── web/                 # Frontend Application
│   │   ├── app/             # Next.js App Router pages
│   │   ├── components/      # React components (Canvas, UI)
│   │   ├── store/           # Zustand state stores
│   │   └── types.ts         # Shared frontend types
│   └── server/              # Backend Application
│       ├── src/             # Express & Socket.io logic
│       └── Dockerfile       # Server container config
├── package.json             # Monorepo configuration
├── docker-compose.yml       # Orchestration
└── README.md                # Documentation
```

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1.  Fork the project.
2.  Create your feature branch (`git checkout -b feature/AmazingFeature`).
3.  Commit your changes (`git commit -m 'Add some AmazingFeature'`).
4.  Push to the branch (`git push origin feature/AmazingFeature`).
5.  Open a Pull Request.

---

## 📜 License

Distributed under the MIT License. See `LICENSE` for more information.

---

<p align="center">
  Built with ❤️ by <a href="https://haniipp.space" target="_blank">haniipp.space</a>
</p>
