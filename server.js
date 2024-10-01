const express = require("express");
const path = require("path");
const http = require("http");
const socketio = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = socketio(server);

// Serve static files
app.use(express.static(path.join(__dirname, "public")));

// Socket.IO connection handling
io.on("connection", (socket) => {
    console.log("New user connected");

    // User joins a room
    socket.on("joinRoom", ({ username, room }) => {
        socket.join(room);
        socket.to(room).emit("update", `${username} joined the room`); // Notify others in the room
        socket.emit("update", `You joined the ${room} room`); // Notify the user themselves
    });

    // Handle chat messages
    socket.on("chat", ({ username, text, room }) => {
        io.to(room).emit("chat", { username, text });
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

// Server listening on a dynamic port
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
