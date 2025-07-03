import Peer, { DataConnection, MediaConnection } from 'peerjs';
import { io, Socket } from 'socket.io-client';

export interface WebRTCEvents {
  onRemoteStream: (stream: MediaStream) => void;
  onMessage: (message: { text: string; sender: 'stranger' }) => void;
  onUserConnected: () => void;
  onUserDisconnected: () => void;
  onSearching: () => void;
  onError: (error: string) => void;
}

export class WebRTCService {
  private peer: Peer | null = null;
  private socket: Socket | null = null;
  private localStream: MediaStream | null = null;
  private remoteConnection: MediaConnection | null = null;
  private dataConnection: DataConnection | null = null;
  private events: WebRTCEvents;
  private isSearching = false;
  private partnerId: string | null = null;

  // URL del servidor de señalización desplegado en Render
  private readonly SIGNALING_SERVER = 'https://tvo-x2ie.onrender.com';
  
  constructor(events: WebRTCEvents) {
    this.events = events;
  }

  async initialize(): Promise<void> {
    try {
      // Initialize PeerJS with cloud service (free)
      this.peer = new Peer({
        config: {
          iceServers: [
            { urls: 'stun:stun.l.google.com:19302' },
            { urls: 'stun:stun1.l.google.com:19302' },
            { urls: 'stun:stun2.l.google.com:19302' },
            {
              urls: 'turn:openrelay.metered.ca:80',
              username: 'openrelayproject',
              credential: 'openrelayproject'
            }
          ]
        }
      });

      // Connect to signaling server
      this.socket = io(this.SIGNALING_SERVER, {
        transports: ['websocket', 'polling'],
        timeout: 10000,
        forceNew: true
      });

      this.setupPeerEvents();
      this.setupSocketEvents();

      // Get local stream
      this.localStream = await navigator.mediaDevices.getUserMedia({
        video: { 
          width: { ideal: 640 },
          height: { ideal: 480 },
          frameRate: { ideal: 15 }
        },
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true
        }
      });

      console.log('WebRTC initialized successfully');

    } catch (error) {
      console.error('Error initializing WebRTC:', error);
      this.events.onError('Failed to access camera/microphone. Please allow permissions and try again.');
    }
  }

  private setupPeerEvents(): void {
    if (!this.peer) return;

    this.peer.on('open', (id) => {
      console.log('Peer ID:', id);
      if (this.socket && this.socket.connected) {
        this.socket.emit('join', { peerId: id });
      }
    });

    this.peer.on('call', (call) => {
      console.log('Incoming call received');
      if (this.localStream) {
        call.answer(this.localStream);
        this.handleIncomingCall(call);
      }
    });

    this.peer.on('connection', (conn) => {
      console.log('Incoming data connection');
      this.setupDataConnection(conn);
    });

    this.peer.on('error', (error) => {
      console.error('Peer error:', error);
      if (error.type === 'peer-unavailable') {
        this.events.onError('User is no longer available');
      } else if (error.type === 'network') {
        this.events.onError('Network connection failed');
      } else {
        this.events.onError('Connection error occurred');
      }
    });
  }

  private setupSocketEvents(): void {
    if (!this.socket) return;

    this.socket.on('connect', () => {
      console.log('Connected to signaling server');
      if (this.peer?.id) {
        this.socket!.emit('join', { peerId: this.peer.id });
      }
    });

    this.socket.on('disconnect', () => {
      console.log('Disconnected from signaling server');
      this.events.onError('Lost connection to server');
    });

    this.socket.on('connect_error', (error) => {
      console.error('Socket connection error:', error);
      this.events.onError('Failed to connect to signaling server');
    });

    this.socket.on('user-matched', ({ partnerId }) => {
      console.log('Matched with user:', partnerId);
      this.partnerId = partnerId;
      this.isSearching = false;
      this.connectToPeer(partnerId);
    });

    this.socket.on('user-disconnected', (userId) => {
      console.log('User disconnected:', userId);
      this.events.onUserDisconnected();
      this.cleanup();
    });

    this.socket.on('chat-message', ({ message, sender, timestamp }) => {
      this.events.onMessage({
        text: message,
        sender: 'stranger'
      });
    });
  }

  private async connectToPeer(peerId: string): Promise<void> {
    if (!this.peer || !this.localStream) {
      console.error('Peer or local stream not available');
      return;
    }

    try {
      console.log('Connecting to peer:', peerId);
      
      // Establish video connection
      const call = this.peer.call(peerId, this.localStream);
      if (call) {
        this.handleIncomingCall(call);
      }

      // Establish data connection for chat
      const dataConn = this.peer.connect(peerId);
      if (dataConn) {
        this.setupDataConnection(dataConn);
      }

    } catch (error) {
      console.error('Error connecting to peer:', error);
      this.events.onError('Failed to connect to user');
    }
  }

  private handleIncomingCall(call: MediaConnection): void {
    this.remoteConnection = call;

    call.on('stream', (remoteStream) => {
      console.log('Received remote stream');
      this.events.onRemoteStream(remoteStream);
      this.events.onUserConnected();
    });

    call.on('close', () => {
      console.log('Call closed');
      this.events.onUserDisconnected();
      this.cleanup();
    });

    call.on('error', (error) => {
      console.error('Call error:', error);
      this.events.onError('Call connection failed');
    });
  }

  private setupDataConnection(conn: DataConnection): void {
    this.dataConnection = conn;

    conn.on('open', () => {
      console.log('Data connection established');
    });

    conn.on('data', (data: any) => {
      if (data && data.type === 'message') {
        this.events.onMessage({
          text: data.text,
          sender: 'stranger'
        });
      }
    });

    conn.on('close', () => {
      console.log('Data connection closed');
    });

    conn.on('error', (error) => {
      console.error('Data connection error:', error);
    });
  }

  startSearch(): void {
    if (!this.socket || this.isSearching) {
      console.log('Cannot start search - socket not ready or already searching');
      return;
    }

    console.log('Starting search for users...');
    this.isSearching = true;
    this.events.onSearching();
    
    // Join the matching queue
    if (this.peer?.id && this.socket.connected) {
      this.socket.emit('join', { peerId: this.peer.id });
    } else {
      console.error('Peer ID not available or socket not connected');
      this.events.onError('Not ready to search. Please wait a moment and try again.');
      this.isSearching = false;
    }
  }

  sendMessage(text: string): void {
    if (this.dataConnection && this.dataConnection.open) {
      this.dataConnection.send({
        type: 'message',
        text: text
      });
    } else if (this.socket && this.partnerId) {
      this.socket.emit('chat-message', {
        target: this.partnerId,
        message: text
      });
    }
  }

  nextUser(): void {
    console.log('Looking for next user...');
    this.disconnect();
    setTimeout(() => {
      this.startSearch();
    }, 1000);
  }

  disconnect(): void {
    console.log('Disconnecting...');
    this.isSearching = false;
    
    if (this.socket && this.socket.connected) {
      this.socket.emit('next-user');
    }

    this.cleanup();
  }

  private cleanup(): void {
    if (this.remoteConnection) {
      this.remoteConnection.close();
      this.remoteConnection = null;
    }

    if (this.dataConnection) {
      this.dataConnection.close();
      this.dataConnection = null;
    }

    this.partnerId = null;
  }

  toggleCamera(enabled: boolean): void {
    if (this.localStream) {
      const videoTrack = this.localStream.getVideoTracks()[0];
      if (videoTrack) {
        videoTrack.enabled = enabled;
      }
    }
  }

  toggleMicrophone(enabled: boolean): void {
    if (this.localStream) {
      const audioTrack = this.localStream.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = enabled;
      }
    }
  }

  getLocalStream(): MediaStream | null {
    return this.localStream;
  }

  destroy(): void {
    this.disconnect();
    
    if (this.localStream) {
      this.localStream.getTracks().forEach(track => track.stop());
      this.localStream = null;
    }

    if (this.peer) {
      this.peer.destroy();
      this.peer = null;
    }

    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }
}