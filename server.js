const express = require("express");
const path = require("path");

const app = express();
const server = require("http").createServer(app);
const io = require("socket.io")(server);

app.use(express.static(path.join(__dirname + "/public")));

io.on("connection", function (socket) {
    // Join room
    socket.on("joinRoom", function ({ username, room }) {
        socket.join(room);
        socket.to(room).emit("update", `${username} joined the room`);

        // Notify the user that they joined the room successfully
        socket.emit("update", `You joined the ${room} room`);
    });

    // Handle user messages
    socket.on("chat", function ({ username, text, room }) {
        io.to(room).emit("chat", { username, text });
    });

    // Handle user exiting the room
    socket.on("exituser", function ({ username, room }) {
        socket.leave(room);
        socket.to(room).emit("update", `${username} left the room`);
    });

    socket.on("disconnect", () => {
        console.log("A user disconnected");
    });
});

server.listen(5000, () => {
    console.log("Server running on port 5000");
});
