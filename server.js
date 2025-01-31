require('dotenv').config();
const express = require('express');
const http = require('http');
const cors = require('cors');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);

app.use(cors()); // Enable CORS
app.use(express.json());

const io = new Server(server, {
    cors: {
        origin: "http://localhost:3000", // React frontend
        methods: ["GET", "POST"]
    }
});

// Store players' positions
let players = {};

io.on('connection', (socket) => {
    console.log(`User Connected: ${socket.id}`);

    // Add new player
    players[socket.id] = { x: 0, y: 0 };

    // Broadcast updated players list
    io.emit('updatePlayers', players);

    // Handle player movement
    socket.on('move', (data) => {
        if (players[socket.id]) {
            players[socket.id] = data;
            io.emit('updatePlayers', players);
        }
    });

    // Handle disconnection
    socket.on('disconnect', () => {
        console.log(`User Disconnected: ${socket.id}`);
        delete players[socket.id];
        io.emit('updatePlayers', players);
    });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
