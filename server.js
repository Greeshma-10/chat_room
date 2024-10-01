const express = require("express");
const path = require("path");
const http = require("http");
const socketio = require("socket.io");
const cors = require("cors");

const app = express();
const server = http.createServer(app);

// Allow CORS for cross-origin requests
const io = socketio(server, {
    cors: {
        origin: "https://realtimechat-git-main-greeshma-vs-projects.vercel.app/", // Allows any origin. You can restrict it by specifying your frontend URL
        methods: ["GET", "POST"],
        credentials: true
    }
});

// Serve static files (like index.html, style.css, etc.)
app.use(express.static(path.join(__dirname, "public")));

// Middleware for CORS (if needed for other routes)
app.use(cors());

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

// Use a dynamic port for deployment (process.env.PORT) or default to 5000 locally
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
