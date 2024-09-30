(function () {
    const app = document.querySelector(".app");
    const socket = io();
    let uname, room;

    // Join user to a room
    app.querySelector(".join-screen #join-user").addEventListener("click", function () {
        let username = app.querySelector(".join-screen #username").value;
        room = app.querySelector(".join-screen #room-select").value;

        if (username.length == 0 || !room) {
            return;
        }

        socket.emit("joinRoom", { username, room });
        uname = username;
        app.querySelector(".join-screen").classList.remove("active");
        app.querySelector(".chat-screen").classList.add("active");
    });
    app.querySelector(".join-screen #username").addEventListener("keypress", function(event) {
        if (event.key === "Enter") {
            event.preventDefault(); // Prevent the default action (e.g., form submission)
            app.querySelector(".join-screen #join-user").click(); // Trigger the join button click
        }
    });

    // Send message
    app.querySelector(".chat-screen #send-message").addEventListener("click", function () {
        let message = app.querySelector(".chat-screen #message-input").value;
        if (message.length == 0) {
            return;
        }

        renderMessage("my", { username: uname, text: message });
        socket.emit("chat", { username: uname, text: message, room });
        app.querySelector(".chat-screen #message-input").value = "";
    });
    app.querySelector(".chat-screen #message-input").addEventListener("keypress", function(event) {
        if (event.key === "Enter") {
            event.preventDefault(); // Prevent the default action (e.g., form submission)
            app.querySelector(".chat-screen #send-message").click(); // Trigger the send message button click
        }
    });

    // Listen for chat message from server, but skip if it's from the current user
    socket.on("chat", function (message) {
        if (message.username !== uname) { // Check if message is from a different user
            renderMessage("other", message);
        }
    });

    // Listen for updates from the server
    socket.on("update", function (update) {
        renderMessage("update", update);
    });

    // Exit chat
    app.querySelector(".chat-screen #exit-chat").addEventListener("click", function () {
        socket.emit("exituser", { username: uname, room });
        window.location.href = window.location.href;
    });

    // Function to render messages
    function renderMessage(type, message) {
        let messageContainer = app.querySelector(".chat-screen .messages");
        let el = document.createElement("div");
        if (type == "my") {
            el.setAttribute("class", "message my-message");
            el.innerHTML = `<div><div class="name">You</div><div class="text">${message.text}</div></div>`;
        } else if (type == "other") {
            el.setAttribute("class", "message other-message");
            el.innerHTML = `<div><div class="name">${message.username}</div><div class="text">${message.text}</div></div>`;
        } else if (type == "update") {
            el.setAttribute("class", "update");
            el.innerText = message;
        }
        messageContainer.appendChild(el);
        messageContainer.scrollTop = messageContainer.scrollHeight - messageContainer.clientHeight;
    }
})();
