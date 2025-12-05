"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const http_1 = __importDefault(require("http"));
const socket_io_1 = require("socket.io");
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const app = (0, express_1.default)();
// Konfigurasi CORS agar bisa diakses dari domain frontend Anda
app.use((0, cors_1.default)({
    origin: "*", // Ubah ke domain Anda nanti, misal: "https://art.haniipp.space"
    methods: ["GET", "POST"]
}));
const server = http_1.default.createServer(app);
const io = new socket_io_1.Server(server, {
    cors: {
        origin: "*", // Ubah ke domain Anda nanti
        methods: ["GET", "POST"]
    }
});
const PORT = process.env.PORT || 3001;
app.get('/', (req, res) => {
    res.send('OpenSketch API Running');
});
// In-Memory Storage (Pengganti Redis untuk cPanel Shared Hosting)
// Catatan: Data akan hilang jika server restart.
const roomState = new Map();
io.on('connection', (socket) => {
    console.log(`User connected: ${socket.id}`);
    socket.on('join-room', (roomId) => {
        socket.join(roomId);
        console.log(`User ${socket.id} joined room ${roomId}`);
        // Kirim state canvas terakhir ke user yang baru join (jika ada)
        if (roomState.has(roomId)) {
            const objects = roomState.get(roomId);
            // Kita kirim satu per satu atau batch, tergantung logika frontend
            // Di sini kita biarkan frontend meminta/menunggu, 
            // tapi idealnya kita kirim snapshot history.
        }
    });
    socket.on('drawing-data', (data) => {
        const { roomId, ...drawingData } = data;
        // Simpan ke memory
        if (!roomState.has(roomId)) {
            roomState.set(roomId, []);
        }
        const roomObjects = roomState.get(roomId);
        // Logic sederhana: Update object jika ada, atau tambah baru
        const existingIndex = roomObjects.findIndex((o) => o.id === drawingData.id);
        if (existingIndex !== -1) {
            roomObjects[existingIndex] = { ...roomObjects[existingIndex], ...drawingData };
        }
        else {
            roomObjects.push(drawingData);
        }
        // Broadcast ke user lain
        socket.to(roomId).emit('drawing-data', drawingData);
    });
    socket.on('delete-object', (data) => {
        const { roomId, id } = data;
        // Hapus dari memory
        if (roomState.has(roomId)) {
            const roomObjects = roomState.get(roomId);
            const newObjects = roomObjects.filter((o) => o.id !== id);
            roomState.set(roomId, newObjects);
        }
        socket.to(roomId).emit('delete-object', id);
    });
    socket.on('cursor-move', (data) => {
        socket.to(data.roomId).emit('cursor-move', {
            userId: socket.id,
            ...data
        });
    });
    socket.on('disconnect', () => {
        console.log(`User disconnected: ${socket.id}`);
    });
});
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
