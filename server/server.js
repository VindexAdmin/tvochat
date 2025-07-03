const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');

const app = express();
const server = http.createServer(app);

// Configurar CORS para producción
app.use(cors({
  origin: [
    "http://localhost:5173", 
    "https://tvo-video-chat.netlify.app",
    "https://tvo-video-chat.vercel.app",
    "https://vindexadmin.github.io",
    "https://tvo.netlify.app",
    "https://tvo.vercel.app"
  ],
  methods: ["GET", "POST"]
}));

const io = socketIo(server, {
  cors: {
    origin: [
      "http://localhost:5173", 
      "https://tvo-video-chat.netlify.app",
      "https://tvo-video-chat.vercel.app",
      "https://vindexadmin.github.io",
      "https://tvo.netlify.app",
      "https://tvo.vercel.app"
    ],
    methods: ["GET", "POST"]
  }
});

// Almacenar usuarios esperando conexión
const waitingUsers = new Set();
const activeConnections = new Map();

app.get('/', (req, res) => {
  res.json({ 
    status: 'TVO Signaling Server Running ✅',
    users: waitingUsers.size,
    connections: activeConnections.size,
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  });
});

app.get('/health', (req, res) => {
  res.json({ 
    status: 'healthy',
    uptime: process.uptime(),
    timestamp: new Date().toISOString()
  });
});

io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  socket.on('join', ({ peerId }) => {
    socket.peerId = peerId;
    console.log('User joined with peer ID:', peerId);
    
    // Si hay alguien esperando, hacer match
    if (waitingUsers.size > 0) {
      const waitingUser = waitingUsers.values().next().value;
      
      if (waitingUser && waitingUser.id !== socket.id) {
        waitingUsers.delete(waitingUser);
        
        // Crear conexión entre usuarios
        activeConnections.set(socket.id, waitingUser.id);
        activeConnections.set(waitingUser.id, socket.id);
        
        // Notificar a ambos usuarios
        socket.emit('user-matched', { partnerId: waitingUser.peerId });
        waitingUser.emit('user-matched', { partnerId: socket.peerId });
        
        console.log(`Match created: ${socket.peerId} <-> ${waitingUser.peerId}`);
      } else {
        waitingUsers.add(socket);
      }
    } else {
      // Agregar a la lista de espera
      waitingUsers.add(socket);
      console.log('User added to waiting list:', socket.peerId);
    }
  });

  socket.on('chat-message', ({ target, message }) => {
    const partnerId = activeConnections.get(socket.id);
    if (partnerId) {
      const partnerSocket = [...io.sockets.sockets.values()]
        .find(s => s.id === partnerId);
      
      if (partnerSocket) {
        partnerSocket.emit('chat-message', {
          message,
          sender: socket.peerId,
          timestamp: Date.now()
        });
      }
    }
  });

  socket.on('next-user', () => {
    // Desconectar del usuario actual
    const partnerId = activeConnections.get(socket.id);
    if (partnerId) {
      const partnerSocket = [...io.sockets.sockets.values()]
        .find(s => s.id === partnerId);
      
      if (partnerSocket) {
        partnerSocket.emit('user-disconnected', socket.id);
      }
      
      activeConnections.delete(socket.id);
      activeConnections.delete(partnerId);
    }
    
    // Agregar de nuevo a la lista de espera
    waitingUsers.add(socket);
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
    
    // Remover de lista de espera
    waitingUsers.delete(socket);
    
    // Notificar al partner si existe
    const partnerId = activeConnections.get(socket.id);
    if (partnerId) {
      const partnerSocket = [...io.sockets.sockets.values()]
        .find(s => s.id === partnerId);
      
      if (partnerSocket) {
        partnerSocket.emit('user-disconnected', socket.id);
      }
      
      activeConnections.delete(socket.id);
      activeConnections.delete(partnerId);
    }
  });

  // Limpiar conexiones inactivas cada 5 minutos
  setInterval(() => {
    const now = Date.now();
    for (const [socketId, partnerId] of activeConnections.entries()) {
      const socket = io.sockets.sockets.get(socketId);
      if (!socket || !socket.connected) {
        activeConnections.delete(socketId);
        activeConnections.delete(partnerId);
        console.log('Cleaned up inactive connection:', socketId);
      }
    }
  }, 5 * 60 * 1000);
});

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`🚀 TVO Signaling Server running on port ${PORT}`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`📡 Server URL: https://tvo-signaling-server.onrender.com`);
});