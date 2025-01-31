import React, { useState, useEffect } from 'react';
import { io } from 'socket.io-client';

const socket = io("http://localhost:5000"); // Connect to backend

const App = () => {
    const [players, setPlayers] = useState({});
    const [position, setPosition] = useState({ x: 0, y: 0 });

    // Listen for player updates
    useEffect(() => {
        socket.on('updatePlayers', (players) => {
            setPlayers(players);
        });

        return () => socket.off('updatePlayers');
    }, []);

    // Move player with arrow keys
    useEffect(() => {
        const handleKeyDown = (event) => {
            let { x, y } = position;
            if (event.key === "ArrowUp") y -= 10;
            if (event.key === "ArrowDown") y += 10;
            if (event.key === "ArrowLeft") x -= 10;
            if (event.key === "ArrowRight") x += 10;
            
            const newPosition = { x, y };
            setPosition(newPosition);
            socket.emit("move", newPosition);
        };

        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [position]);

    return (
        <div>
            <h1>Multiplayer Game</h1>
            <div style={{ position: "relative", width: "500px", height: "500px", border: "1px solid black" }}>
                {Object.entries(players).map(([id, pos]) => (
                    <div key={id} style={{
                        position: "absolute",
                        left: pos.x + "px",
                        top: pos.y + "px",
                        width: "20px",
                        height: "20px",
                        backgroundColor: id === socket.id ? "blue" : "red"
                    }} />
                ))}
            </div>
        </div>
    );
};

export default App;
