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
const chessWaitingUsers = new Set();
const activeConnections = new Map();
const chessGames = new Map();

// Ruta principal con información del servidor
app.get('/', (req, res) => {
  res.json({ 
    status: 'TVO Signaling Server Running ✅',
    message: 'WebRTC Video Chat & Chess Server',
    users: waitingUsers.size,
    chessUsers: chessWaitingUsers.size,
    connections: activeConnections.size,
    chessGames: chessGames.size,
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
    chessWaitingUsers: chessWaitingUsers.size,
    activeConnections: activeConnections.size,
    chessGames: chessGames.size,
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

  // Chess game events
  socket.on('find-chess-game', () => {
    console.log(`🔍 User ${socket.id} looking for chess game`);
    
    // Si hay alguien esperando, hacer match
    if (chessWaitingUsers.size > 0) {
      const waitingUser = chessWaitingUsers.values().next().value;
      
      if (waitingUser && waitingUser.id !== socket.id) {
        chessWaitingUsers.delete(waitingUser);
        
        // Crear juego de ajedrez
        const gameId = `chess_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        const whitePlayer = Math.random() < 0.5 ? socket : waitingUser;
        const blackPlayer = whitePlayer === socket ? waitingUser : socket;
        
        chessGames.set(gameId, {
          white: whitePlayer.id,
          black: blackPlayer.id,
          fen: 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1',
          moves: [],
          status: 'active'
        });
        
        // Notificar a ambos jugadores
        whitePlayer.emit('game-start', { 
          gameId, 
          color: 'white', 
          opponentId: blackPlayer.id 
        });
        blackPlayer.emit('game-start', { 
          gameId, 
          color: 'black', 
          opponentId: whitePlayer.id 
        });
        
        console.log(`♟️ Chess game created: ${gameId} | White: ${whitePlayer.id} | Black: ${blackPlayer.id}`);
      } else {
        chessWaitingUsers.add(socket);
        console.log(`⏳ User added to chess waiting list: ${socket.id}`);
      }
    } else {
      // Agregar a la lista de espera
      chessWaitingUsers.add(socket);
      console.log(`⏳ User added to chess waiting list: ${socket.id}`);
    }
  });

  socket.on('make-move', ({ gameId, from, to, promotion, fen }) => {
    const game = chessGames.get(gameId);
    if (!game) {
      socket.emit('error', { message: 'Game not found' });
      return;
    }
    
    // Verificar que es el turno del jugador
    const isWhiteTurn = fen.includes(' w ');
    const isPlayerWhite = game.white === socket.id;
    
    if ((isWhiteTurn && !isPlayerWhite) || (!isWhiteTurn && isPlayerWhite)) {
      socket.emit('error', { message: 'Not your turn' });
      return;
    }
    
    // Actualizar el juego
    game.fen = fen;
    game.moves.push({ from, to, promotion, timestamp: Date.now() });
    
    // Notificar al oponente
    const opponentId = isPlayerWhite ? game.black : game.white;
    const opponentSocket = [...io.sockets.sockets.values()]
      .find(s => s.id === opponentId);
    
    if (opponentSocket) {
      opponentSocket.emit('move-made', { from, to, promotion, fen });
    }
    
    console.log(`♟️ Move made in game ${gameId}: ${from} -> ${to}`);
  });

  socket.on('resign', ({ gameId }) => {
    const game = chessGames.get(gameId);
    if (!game) return;
    
    const isPlayerWhite = game.white === socket.id;
    const opponentId = isPlayerWhite ? game.black : game.white;
    const opponentSocket = [...io.sockets.sockets.values()]
      .find(s => s.id === opponentId);
    
    // Notificar resultado
    socket.emit('game-end', { result: 'loss', reason: 'You resigned' });
    if (opponentSocket) {
      opponentSocket.emit('game-end', { result: 'win', reason: 'Opponent resigned' });
    }
    
    // Limpiar juego
    chessGames.delete(gameId);
    console.log(`♟️ Game ${gameId} ended by resignation`);
  });

  socket.on('offer-draw', ({ gameId }) => {
    const game = chessGames.get(gameId);
    if (!game) return;
    
    const isPlayerWhite = game.white === socket.id;
    const opponentId = isPlayerWhite ? game.black : game.white;
    const opponentSocket = [...io.sockets.sockets.values()]
      .find(s => s.id === opponentId);
    
    if (opponentSocket) {
      opponentSocket.emit('draw-offered', { from: socket.id });
    }
    
    console.log(`♟️ Draw offered in game ${gameId}`);
  });

  socket.on('disconnect', () => {
    console.log(`❌ User disconnected: ${socket.id} | Remaining: ${io.engine.clientsCount - 1}`);
    
    // Remover de lista de espera
    waitingUsers.delete(socket);
    chessWaitingUsers.delete(socket);
    
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
    
    // Limpiar juegos de ajedrez
    for (const [gameId, game] of chessGames.entries()) {
      if (game.white === socket.id || game.black === socket.id) {
        const opponentId = game.white === socket.id ? game.black : game.white;
        const opponentSocket = [...io.sockets.sockets.values()]
          .find(s => s.id === opponentId);
        
        if (opponentSocket) {
          opponentSocket.emit('opponent-disconnected');
        }
        
        chessGames.delete(gameId);
        console.log(`♟️ Game ${gameId} ended due to disconnection`);
      }
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
  console.log(`📊 Server Stats - Connected: ${io.engine.clientsCount} | Video Waiting: ${waitingUsers.size} | Chess Waiting: ${chessWaitingUsers.size} | Video Active: ${activeConnections.size} | Chess Games: ${chessGames.size}`);
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