const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const path = require('path');

const app = express();
const server = http.createServer(app);

// הגדרת Socket.io עם הרשאות CORS פתוחות לממשק החדש
const io = socketIo(server, {
  cors: {
    origin: "*", // מאפשר חיבור מכל כתובת (כולל localhost ומובייל)
    methods: ["GET", "POST"]
  }
});

// דף נחיתה בסיסי לבדיקת תקינות השרת
app.get('/', (req, res) => {
  res.send('<h1>ZDT Signaling Server is Online and Healthy.</h1>');
});

io.on('connection', (socket) => {
  console.log('New device connected:', socket.id);

  socket.on('join', (room) => {
    const rooms = io.sockets.adapter.rooms;
    const clientCount = rooms.get(room) ? rooms.get(room).size : 0;

    if (clientCount < 2) {
      socket.join(room);
      console.log(`Socket ${socket.id} joined room: ${room}`);
      socket.emit('joined', room);
      
      if (clientCount === 1) {
        io.to(room).emit('ready');
        console.log(`Room ${room} is ready for P2P connection`);
      }
    } else {
      socket.emit('full', room);
      console.log(`Room ${room} is full`);
    }
  });

  socket.on('message', (room, message) => {
    // העברת הודעות האיתות (Signaling) בין המכשירים בלבד
    socket.to(room).emit('message', message);
  });

  socket.on('disconnect', () => {
    console.log('Device disconnected:', socket.id);
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`ZDT Server running on port ${PORT}`);
});
