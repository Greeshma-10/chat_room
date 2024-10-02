const express = require("express");
const path = require("path");
const http = require("http");
const socketio = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = socketio(server);

// Serve static files
app.use(express.static(path.join(__dirname, "public")));

io.on("connection", (socket) => {
    console.log("New user connected");

    // User joins a room
    socket.on("joinRoom", ({ username, room }) => {
        socket.join(room);
        socket.to(room).emit("update", `${username} joined the room`);
        socket.emit("update", `You joined the ${room} room`);
    });

    // Handle chat messages
    socket.on("chat", ({ username, text, room }) => {
        const messageData = {
            username,
            text,
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) // Format as HH:MM
        };
        io.to(room).emit("chat", messageData);
    });

    // Handle user exiting the chat
    socket.on("exituser", ({ username, room }) => {
        socket.leave(room);
        socket.to(room).emit("update", `${username} left the room`);
    });

    // Handle disconnection
    socket.on("disconnect", () => {
        console.log("A user disconnected");
    });
});

// Server listening on port 5000
server.listen(5000, () => {
    console.log("Server running on port 5000");
});