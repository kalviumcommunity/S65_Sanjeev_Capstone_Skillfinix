const { Server } = require("socket.io");
const registerHandlers = require("./handlers");

const initSocket = (server) => {
  const io = new Server(server, {
    cors: {
      origin: "http://localhost:3000", // Frontend URL
      methods: ["GET", "POST"],
      credentials: true
    },
    pingTimeout: 60000, // Increase timeout
    pingInterval: 25000
  });

  io.on("connection", (socket) => {
    console.log(`New connection: ${socket.id}`);
    
    // Add error handling
    socket.on("error", (error) => {
      console.error("Socket error:", error);
    });

    registerHandlers(io, socket);
  });

  return io;
};

module.exports = { initSocket };