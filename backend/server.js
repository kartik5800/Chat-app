
const express = require("express")
const { Server } = require("socket.io");
const dotenv = require("dotenv")
var http = require('http');
const cors = require("cors")

const app = express()
dotenv.config();

app.use(cors())

var server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"]
  }
});

app.get("/", (req, res) => {res.send("API is running 123"); res.end()})

io.on("connection", (socket) => {
  console.log(socket.id , "user has connected")

  socket.on("joinRoom", room => {
		socket.join(room)
    
  })

  socket.on("disconnect", (room) => {
    console.log(room);
    console.log(socket.room , "user has disconnected");
  });

  socket.on("newMessage", ({newMessage, room}) => {
    io.in(room).emit("getLatestMessage", newMessage)
    console.log(newMessage);
  })

});

const PORT = process.env.PORT || 9000

server.listen(9000, console.log(`App started at port ${PORT}`))
