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
  methods: ["GET", "POST"],
  credentials: true
}));

// Middleware para parsear JSON
app.use(express.json());

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
    methods: ["GET", "POST"],
    credentials: true
  }
});

// Almacenar usuarios esperando conexión
const waitingUsers = new Set();
const activeConnections = new Map();

// Ruta principal con información del servidor
app.get('/', (req, res) => {
  res.json({ 
    status: 'TVO Signaling Server Running ✅',
    message: 'WebRTC Video Chat Server',
    users: waitingUsers.size,
    connections: activeConnections.size,
    timestamp: new Date().toISOString(),
    version: '1.0.0',
    uptime: Math.floor(process.uptime()),
    environment: process.env.NODE_ENV || 'production'
  });
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'healthy',
    uptime: Math.floor(process.uptime()),
    timestamp: new Date().toISOString(),
    memory: process.memoryUsage(),
    connections: {
      waiting: waitingUsers.size,
      active: activeConnections.size
    }
  });
});

// Endpoint para estadísticas
app.get('/stats', (req, res) => {
  res.json({
    waitingUsers: waitingUsers.size,
    activeConnections: activeConnections.size,
    connectedSockets: io.engine.clientsCount,
    uptime: Math.floor(process.uptime()),
    timestamp: new Date().toISOString()
  });
});

// Socket.io events
io.on('connection', (socket) => {
  console.log(`✅ User connected: ${socket.id} | Total: ${io.engine.clientsCount}`);

  socket.on('join', ({ peerId }) => {
    socket.peerId = peerId;
    console.log(`👤 User joined with peer ID: ${peerId}`);
    
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
        
        console.log(`🤝 Match created: ${socket.peerId} <-> ${waitingUser.peerId}`);
      } else {
        waitingUsers.add(socket);
        console.log(`⏳ User added to waiting list: ${socket.peerId}`);
      }
    } else {
      // Agregar a la lista de espera
      waitingUsers.add(socket);
      console.log(`⏳ User added to waiting list: ${socket.peerId}`);
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
        console.log(`💬 Message sent from ${socket.peerId} to partner`);
      }
    }
  });

  socket.on('next-user', () => {
    console.log(`🔄 User ${socket.peerId} looking for next user`);
    
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
    console.log(`❌ User disconnected: ${socket.id} | Remaining: ${io.engine.clientsCount - 1}`);
    
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
});

// Limpiar conexiones inactivas cada 5 minutos
setInterval(() => {
  const now = Date.now();
  let cleaned = 0;
  
  for (const [socketId, partnerId] of activeConnections.entries()) {
    const socket = io.sockets.sockets.get(socketId);
    if (!socket || !socket.connected) {
      activeConnections.delete(socketId);
      activeConnections.delete(partnerId);
      cleaned++;
    }
  }
  
  if (cleaned > 0) {
    console.log(`🧹 Cleaned up ${cleaned} inactive connections`);
  }
}, 5 * 60 * 1000);

// Estadísticas cada 10 minutos
setInterval(() => {
  console.log(`📊 Server Stats - Connected: ${io.engine.clientsCount} | Waiting: ${waitingUsers.size} | Active: ${activeConnections.size}`);
}, 10 * 60 * 1000);

const PORT = process.env.PORT || 3001;

server.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 TVO Signaling Server running on port ${PORT}`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV || 'production'}`);
  console.log(`📡 Server ready to accept connections`);
  console.log(`🔗 Health check: https://tvo-x2ie.onrender.com/health`);
});

// Manejo de errores
process.on('uncaughtException', (error) => {
  console.error('❌ Uncaught Exception:', error);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('❌ Unhandled Rejection at:', promise, 'reason:', reason);
});