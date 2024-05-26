const express = require('express')
const server = express()
var cors = require('cors')
const PORT = 8080
const userrouter = require('./routers/userinformation')
const path = require('path');
// const conversationrouters = require('./routers/conversation')


const httpServer = require("http").createServer(server); // Create an HTTP server

const io = require("socket.io")(httpServer, {
  pingTimeout: 60000,
  cors: {
    origin: "http://localhost:3000",
  },
});

// middleware to connect react port 3000 with backend port 8080 : it act like barrier because security of each port don't allow both without this middleware
server.use(cors());

// bodyparser : it take data from body
server.use(express.json())

// middleware to connect with users routes
server.use('/',userrouter.userrouter)

// // middleware to connect with conversations routes
// server.use('/addconversations',conversationrouters.conversationrouter)

// server.use(express.static(path.join(__dirname,'./client/build')))

// server.get('*',(req,res)=>{
//   res.sendFile(path.join(__dirname,'./client/build/index.html'))
// })


const mongoose = require('mongoose');

main().catch(err => console.log(err));
async function main() {
  await mongoose.connect('mongodb+srv://nitinkumarvasdhani786:G4yn6wjW5Uuxnp4r@cluster0.n8mom8n.mongodb.net/mychatwebappdatabase');
  console.log('database connected');
}

// server.listen(PORT, ()=>{
//     console.log(`Server is running on port ${PORT}`)
// })



// Establish a Socket.io connection
io.on("connection", (socket) => {
  console.log("A user connected with socket id:", socket.id);

  // Handle joining a room
  socket.on("joinRoom", (room) => {
    socket.join(room);
    console.log(`Socket ${socket.id} joined room`);
  });

  // Handle incoming messages
  socket.on("message", (messageData) => {
    console.log("Received message:", messageData);

    // Broadcast the message to the receiver
    // io.to(messageData.receiver_id).emit("message", messageData);
    io.emit("message", messageData);
  });

  // Handle disconnection
  socket.on("disconnect", () => {
    console.log("A user disconnected with socket id:", socket.id);
  });
});


httpServer.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});


