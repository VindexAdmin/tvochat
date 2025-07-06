import { Chess, Square } from 'chess.js';
import { io, Socket } from 'socket.io-client';

export interface ChessGameEvents {
  onGameStart: (color: 'white' | 'black', opponentId: string) => void;
  onMove: (from: Square, to: Square, promotion?: string) => void;
  onGameEnd: (result: 'win' | 'loss' | 'draw', reason: string) => void;
  onOpponentDisconnected: () => void;
  onError: (error: string) => void;
}

export class ChessGameService {
  private socket: Socket | null = null;
  private game: Chess;
  private events: ChessGameEvents;
  private playerColor: 'white' | 'black' | null = null;
  private gameId: string | null = null;

  private readonly SIGNALING_SERVER = import.meta.env.VITE_SIGNALING_SERVER || 'http://localhost:3001';

  constructor(events: ChessGameEvents) {
    this.events = events;
    this.game = new Chess();
  }

  async initialize(): Promise<void> {
    try {
      this.socket = io(this.SIGNALING_SERVER, {
        transports: ['websocket', 'polling'],
        timeout: 10000,
        forceNew: true
      });

      this.setupSocketEvents();
      console.log('Chess game service initialized');
    } catch (error) {
      console.error('Error initializing chess service:', error);
      this.events.onError('Failed to connect to game server');
    }
  }

  private setupSocketEvents(): void {
    if (!this.socket) return;

    this.socket.on('connect', () => {
      console.log('Connected to chess server');
    });

    this.socket.on('disconnect', () => {
      console.log('Disconnected from chess server');
      this.events.onError('Lost connection to server');
    });

    this.socket.on('game-start', ({ gameId, color, opponentId }) => {
      console.log('Game started:', { gameId, color, opponentId });
      this.gameId = gameId;
      this.playerColor = color;
      this.game = new Chess(); // Reset game
      this.events.onGameStart(color, opponentId);
    });

    this.socket.on('move-made', ({ from, to, promotion, fen }) => {
      console.log('Opponent move:', { from, to, promotion });
      try {
        this.game.load(fen);
        this.events.onMove(from, to, promotion);
      } catch (error) {
        console.error('Error processing opponent move:', error);
        this.events.onError('Invalid move received');
      }
    });

    this.socket.on('game-end', ({ result, reason }) => {
      console.log('Game ended:', { result, reason });
      this.events.onGameEnd(result, reason);
    });

    this.socket.on('opponent-disconnected', () => {
      console.log('Opponent disconnected');
      this.events.onOpponentDisconnected();
    });

    this.socket.on('error', (error) => {
      console.error('Chess server error:', error);
      this.events.onError(error.message || 'Game error occurred');
    });
  }

  findGame(): void {
    if (!this.socket || !this.socket.connected) {
      this.events.onError('Not connected to server');
      return;
    }

    console.log('Looking for chess game...');
    this.socket.emit('find-chess-game');
  }

  makeMove(from: Square, to: Square, promotion?: string): boolean {
    if (!this.socket || !this.gameId) {
      this.events.onError('Game not ready');
      return false;
    }

    try {
      const move = this.game.move({ from, to, promotion });
      if (!move) {
        this.events.onError('Invalid move');
        return false;
      }

      // Send move to server
      this.socket.emit('make-move', {
        gameId: this.gameId,
        from,
        to,
        promotion,
        fen: this.game.fen()
      });

      return true;
    } catch (error) {
      console.error('Error making move:', error);
      this.events.onError('Failed to make move');
      return false;
    }
  }

  resign(): void {
    if (this.socket && this.gameId) {
      this.socket.emit('resign', { gameId: this.gameId });
    }
  }

  offerDraw(): void {
    if (this.socket && this.gameId) {
      this.socket.emit('offer-draw', { gameId: this.gameId });
    }
  }

  getGame(): Chess {
    return this.game;
  }

  getPlayerColor(): 'white' | 'black' | null {
    return this.playerColor;
  }

  isPlayerTurn(): boolean {
    if (!this.playerColor) return false;
    const currentTurn = this.game.turn();
    return (this.playerColor === 'white' && currentTurn === 'w') ||
           (this.playerColor === 'black' && currentTurn === 'b');
  }

  destroy(): void {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
    this.game = new Chess();
    this.playerColor = null;
    this.gameId = null;
  }
}