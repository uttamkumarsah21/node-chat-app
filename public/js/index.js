const path = require("path");
const http = require("http");
const express = require("express");
const socketio = require("socket.io");
const { disconnect } = require("process");

const app = express();
const server = http.createServer(app);
const io = socketio(server);

const port = process.env.PORT || 3000;

const publicDirectoryPath = path.join(__dirname,"../public");

app.use(express.static(publicDirectoryPath));

io.on('connection', (socket) => {
    console.log("Start new Websocket connection");

    socket.emit("message","Welcome!");
    socket.broadcast.emit("message","A new user connected");

    socket.on("sendMessage", (message) => {
        io.emit("message",message);
    })

    socket.on("disconnect", () => {
        io.emit("message","User disconnected");  
    })
})

server.listen(port,() => {
    console.log(`Server running on port ${port}`);
})