
(function () {
    const app = document.querySelector(".app");
    const socket = io("http://localhost:5000"); // Ensure it points to your server's URL and port
    let uname, room;

    // Join user to a room
    app.querySelector("#join-user").addEventListener("click", function () {
        let username = app.querySelector("#username").value;
        room = app.querySelector("#room-select").value;

        if (username.length === 0 || room === "") {
            alert("Please enter a username and select a room."); // Alert for missing data
            return;
        }

        socket.emit("joinRoom", { username, room }); // Emit to server
        uname = username;
        app.querySelector(".join-screen").classList.remove("active");
        app.querySelector(".chat-screen").classList.add("active");
    });

    // Handle Enter key on username input
    app.querySelector("#username").addEventListener("keypress", function (event) {
        if (event.key === "Enter") {
            app.querySelector("#join-user").click(); // Trigger join button on Enter
        }
    });

    // Handle sending messages
    app.querySelector("#send-message").addEventListener("click", function () {
        let message = app.querySelector("#message-input").value;
        if (message.length === 0) {
            return; // Don't send empty messages
        }

        renderMessage("my", { username: uname, text: message });
        socket.emit("chat", { username: uname, text: message, room });
        app.querySelector("#message-input").value = ""; // Clear input field after sending
    });

    // Handle Enter key for sending messages
    app.querySelector("#message-input").addEventListener("keypress", function (event) {
        if (event.key === "Enter") {
            app.querySelector("#send-message").click();
        }
    });

    // Listen for chat messages from the server
    socket.on("chat", function (message) {
        if (message.username !== uname) {
            renderMessage("other", message);
        }
    });

    // Listen for room updates from the server
    socket.on("update", function (update) {
        renderMessage("update", update);
    });

    // Handle exiting the chat
    app.querySelector("#exit-chat").addEventListener("click", function () {
        socket.emit("exituser", { username: uname, room });
        window.location.href = window.location.href; // Refresh the page
    });

    // Function to render messages in the chat screen
    function renderMessage(type, message) {
        let messageContainer = app.querySelector(".messages");
        let el = document.createElement("div");

        if (type === "my") {
            el.setAttribute("class", "message my-message");
            el.innerHTML = `<div><div class="name">You</div><div class="text">${message.text}</div></div>`;
        } else if (type === "other") {
            el.setAttribute("class", "message other-message");
            el.innerHTML = `<div><div class="name">${message.username}</div><div class="text">${message.text}</div></div>`;
        } else if (type === "update") {
            el.setAttribute("class", "update");
            el.innerText = message;
        }

        messageContainer.appendChild(el);
        messageContainer.scrollTop = messageContainer.scrollHeight - messageContainer.clientHeight; // Scroll to bottom
    }
})();
