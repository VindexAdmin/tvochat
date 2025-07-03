import { useState, useEffect, useRef } from 'react';
import { WebRTCService, WebRTCEvents } from '../services/WebRTCService';

interface Message {
  id: string;
  text: string;
  sender: 'you' | 'stranger';
  timestamp: Date;
}

export const useWebRTC = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [error, setError] = useState<string | null>(null);
  
  const webrtcService = useRef<WebRTCService | null>(null);
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const events: WebRTCEvents = {
      onRemoteStream: (stream: MediaStream) => {
        if (remoteVideoRef.current) {
          remoteVideoRef.current.srcObject = stream;
        }
      },
      onMessage: (message) => {
        setMessages(prev => [...prev, {
          id: Date.now().toString(),
          text: message.text,
          sender: message.sender,
          timestamp: new Date()
        }]);
      },
      onUserConnected: () => {
        setIsConnected(true);
        setIsSearching(false);
        setError(null);
        setMessages([{
          id: '1',
          text: 'You\'re now connected! Say hi!',
          sender: 'stranger',
          timestamp: new Date()
        }]);
      },
      onUserDisconnected: () => {
        setIsConnected(false);
        setIsSearching(false);
        if (remoteVideoRef.current) {
          remoteVideoRef.current.srcObject = null;
        }
      },
      onSearching: () => {
        setIsSearching(true);
        setIsConnected(false);
        setMessages([]);
        setError(null);
      },
      onError: (errorMessage: string) => {
        setError(errorMessage);
        setIsSearching(false);
        setIsConnected(false);
      }
    };

    webrtcService.current = new WebRTCService(events);
    
    const initializeWebRTC = async () => {
      try {
        await webrtcService.current!.initialize();
        
        // Configurar video local
        const localStream = webrtcService.current!.getLocalStream();
        if (localStream && localVideoRef.current) {
          localVideoRef.current.srcObject = localStream;
        }
      } catch (error) {
        console.error('Failed to initialize WebRTC:', error);
        setError('Failed to access camera/microphone');
      }
    };

    initializeWebRTC();

    return () => {
      if (webrtcService.current) {
        webrtcService.current.destroy();
      }
    };
  }, []);

  const startSearch = () => {
    if (webrtcService.current) {
      webrtcService.current.startSearch();
    }
  };

  const sendMessage = (text: string) => {
    if (webrtcService.current && isConnected) {
      webrtcService.current.sendMessage(text);
      setMessages(prev => [...prev, {
        id: Date.now().toString(),
        text,
        sender: 'you',
        timestamp: new Date()
      }]);
    }
  };

  const nextUser = () => {
    if (webrtcService.current) {
      webrtcService.current.nextUser();
      setMessages([]);
    }
  };

  const disconnect = () => {
    if (webrtcService.current) {
      webrtcService.current.disconnect();
      setMessages([]);
    }
  };

  const toggleCamera = (enabled: boolean) => {
    if (webrtcService.current) {
      webrtcService.current.toggleCamera(enabled);
    }
  };

  const toggleMicrophone = (enabled: boolean) => {
    if (webrtcService.current) {
      webrtcService.current.toggleMicrophone(enabled);
    }
  };

  return {
    isConnected,
    isSearching,
    messages,
    error,
    localVideoRef,
    remoteVideoRef,
    startSearch,
    sendMessage,
    nextUser,
    disconnect,
    toggleCamera,
    toggleMicrophone
  };
};