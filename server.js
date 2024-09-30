const express = require("express");
const path = require("path");

const app = express();
const server = require("http").createServer(app);
const io = require("socket.io")(server);

app.use(express.static(path.join(__dirname + "/public")));

io.on("connection", function(socket) {
    // Listen for a new user joining
    socket.on("newuser", function(username) {
        socket.broadcast.emit("update", username + " joined the conversation");
    });

    // Listen for a user leaving
    socket.on("exituser", function(username) {
        socket.broadcast.emit("update", username + " left the conversation");
    });

    // Listen for a chat message
    socket.on("chat", function(message) {
        // Here, 'message' contains both the username and the text
        socket.broadcast.emit("chat", message);
    });
});

server.listen(5000, () => {
    console.log("Server is running on port 5000");
});
