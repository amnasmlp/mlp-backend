const socketIO = require('socket.io');


const setupGameSocket = (server) => {
  const io = socketIO(server);


  io.on('connection', (socket) => {
    console.log(`User connected: ${socket.id}`);
   
    // Handle user disconnect
    socket.on('disconnect', () => {
      console.log(`User disconnected: ${socket.id}`);
    });


    // Handle connection error
    socket.on('connect_error', (err) => {
      console.error(`Connection error with user: ${socket.id}`, err);
    });


    // Additional event handlers can be added here
  });


  // Handle general connection errors
  io.on('error', (err) => {
    console.error('Socket.io error', err);
  });
};


module.exports = setupGameSocket;