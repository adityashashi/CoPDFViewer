const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");
const path = require("path");

const app = express();
app.use(cors());

// Serve static files from the "public" directory
app.use(express.static(path.join(__dirname, "public")));

const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "http://localhost:3000",
        methods: ["GET", "POST"]
    }
});

let currentPage = 1; // Initial page

io.on("connection", (socket) => {
    console.log("A user connected:", socket.id);

    // Send current page to newly connected user
    socket.emit("pageChanged", currentPage);

    // Listen for page change from admin
    socket.on("changePage", (newPage) => {
        currentPage = newPage;
        io.emit("pageChanged", currentPage); // Broadcast to all users
    });

    socket.on("disconnect", () => {
        console.log("A user disconnected:", socket.id);
    });
});

const PORT = 5000;
server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
