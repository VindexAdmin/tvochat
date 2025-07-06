import React, { useState } from 'react';
import { 
  Video, 
  VideoOff, 
  Mic, 
  MicOff, 
  MessageCircle, 
  SkipForward,
  Send,
  Users,
  Wifi,
  WifiOff,
  AlertCircle
} from 'lucide-react';
import { useWebRTC } from './hooks/useWebRTC';

function App() {
  const [isCameraOn, setIsCameraOn] = useState(true);
  const [isMicOn, setIsMicOn] = useState(true);
  const [showChat, setShowChat] = useState(false);
  const [messageInput, setMessageInput] = useState('');
  const [onlineUsers] = useState(Math.floor(Math.random() * 5000) + 2000);
  
  const {
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
  } = useWebRTC();

  const handleToggleCamera = () => {
    const newState = !isCameraOn;
    setIsCameraOn(newState);
    toggleCamera(newState);
  };

  const handleToggleMic = () => {
    const newState = !isMicOn;
    setIsMicOn(newState);
    toggleMicrophone(newState);
  };

  const handleSendMessage = () => {
    if (messageInput.trim() && isConnected) {
      sendMessage(messageInput.trim());
      setMessageInput('');
    }
  };

  const handleStart = () => {
    startSearch();
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      {/* Header */}
      <header className="bg-gray-900/50 backdrop-blur-sm border-b border-gray-800 px-4 py-3">
        <div className="flex items-center justify-between max-w-6xl mx-auto">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <Video className="w-5 h-5" />
            </div>
            <h1 className="text-xl font-bold">TVO</h1>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2 text-green-400">
              <Users className="w-4 h-4" />
              <span className="text-sm">{onlineUsers.toLocaleString()}</span>
            </div>
            
            <div className="flex items-center space-x-2">
              {isConnected ? (
                <Wifi className="w-4 h-4 text-green-400" />
              ) : (
                <WifiOff className="w-4 h-4 text-gray-400" />
              )}
              <span className="text-sm">
                {isConnected ? 'Connected' : isSearching ? 'Searching...' : 'Offline'}
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Error Banner */}
      {error && (
        <div className="bg-red-500/20 border-b border-red-500/30 px-4 py-2">
          <div className="flex items-center space-x-2 max-w-6xl mx-auto">
            <AlertCircle className="w-4 h-4 text-red-400" />
            <span className="text-red-200 text-sm">{error}</span>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="flex-1 flex">
        {/* Video Section */}
        <div className="flex-1 flex flex-col">
          {/* Main Video Area */}
          <div className="flex-1 relative bg-gray-900">
            {isConnected ? (
              <video
                ref={remoteVideoRef}
                className="w-full h-full object-cover"
                autoPlay
                playsInline
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <div className="text-center space-y-4">
                  {isSearching ? (
                    <>
                      <div className="w-16 h-16 mx-auto border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin"></div>
                      <p className="text-xl font-medium">Looking for someone...</p>
                      <p className="text-gray-400">Please wait while we connect you</p>
                    </>
                  ) : (
                    <>
                      <Video className="w-24 h-24 mx-auto text-gray-600" />
                      <p className="text-2xl font-medium">Welcome to TVO</p>
                      <p className="text-gray-400">Click start to begin video chatting with strangers</p>
                      <button
                        onClick={handleStart}
                        className="px-8 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg font-medium transition-colors"
                      >
                        Start
                      </button>
                    </>
                  )}
                </div>
              </div>
            )}

            {/* Local Video (Picture in Picture) */}
            <div className="absolute top-4 right-4 w-48 h-36 bg-gray-800 rounded-lg overflow-hidden border-2 border-gray-700">
              <video
                ref={localVideoRef}
                className="w-full h-full object-cover"
                autoPlay
                playsInline
                muted
              />
              {!isCameraOn && (
                <div className="absolute inset-0 bg-gray-900 flex items-center justify-center">
                  <VideoOff className="w-8 h-8 text-gray-500" />
                </div>
              )}
              <div className="absolute bottom-1 left-1 bg-black/50 backdrop-blur-sm rounded px-2 py-1 text-xs">
                You
              </div>
            </div>
          </div>

          {/* Controls */}
          <div className="bg-gray-900/80 backdrop-blur-sm border-t border-gray-800 p-4">
            <div className="flex items-center justify-center space-x-4">
              <button
                onClick={handleToggleCamera}
                className={`p-3 rounded-full transition-all ${
                  isCameraOn 
                    ? 'bg-gray-700 hover:bg-gray-600' 
                    : 'bg-red-600 hover:bg-red-700'
                }`}
              >
                {isCameraOn ? <Video className="w-5 h-5" /> : <VideoOff className="w-5 h-5" />}
              </button>

              <button
                onClick={handleToggleMic}
                className={`p-3 rounded-full transition-all ${
                  isMicOn 
                    ? 'bg-gray-700 hover:bg-gray-600' 
                    : 'bg-red-600 hover:bg-red-700'
                }`}
              >
                {isMicOn ? <Mic className="w-5 h-5" /> : <MicOff className="w-5 h-5" />}
              </button>

              <button
                onClick={() => setShowChat(!showChat)}
                className="p-3 rounded-full bg-blue-600 hover:bg-blue-700 transition-all"
              >
                <MessageCircle className="w-5 h-5" />
              </button>

              {isConnected && (
                <button
                  onClick={nextUser}
                  className="p-3 rounded-full bg-purple-600 hover:bg-purple-700 transition-all"
                >
                  <SkipForward className="w-5 h-5" />
                </button>
              )}

              <button
                onClick={disconnect}
                className="p-3 rounded-full bg-gray-700 hover:bg-gray-600 transition-all"
              >
                Stop
              </button>
            </div>
          </div>
        </div>

        {/* Chat Sidebar */}
        {showChat && (
          <div className="w-80 bg-gray-900 border-l border-gray-800 flex flex-col">
            <div className="bg-gray-800 p-4 border-b border-gray-700">
              <h3 className="font-semibold">Chat</h3>
            </div>

            {/* Messages */}
            <div className="flex-1 p-4 overflow-y-auto space-y-3">
              {messages.length === 0 ? (
                <div className="text-center text-gray-500 py-8">
                  <MessageCircle className="w-12 h-12 mx-auto mb-3 opacity-50" />
                  <p>No messages yet</p>
                  <p className="text-sm">Start chatting when connected!</p>
                </div>
              ) : (
                messages.map((message) => (
                  <div
                    key={message.id}
                    className={`max-w-[80%] ${
                      message.sender === 'you' ? 'ml-auto' : 'mr-auto'
                    }`}
                  >
                    <div
                      className={`p-3 rounded-lg ${
                        message.sender === 'you'
                          ? 'bg-blue-600 text-white ml-auto'
                          : 'bg-gray-700 text-gray-100'
                      }`}
                    >
                      <p className="text-sm">{message.text}</p>
                    </div>
                    <p className="text-xs text-gray-500 mt-1 px-1">
                      {message.timestamp.toLocaleTimeString([], { 
                        hour: '2-digit', 
                        minute: '2-digit' 
                      })}
                    </p>
                  </div>
                ))
              )}
            </div>

            {/* Message Input */}
            <div className="p-4 border-t border-gray-700">
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={messageInput}
                  onChange={(e) => setMessageInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  placeholder={isConnected ? "Type a message..." : "Connect to chat"}
                  disabled={!isConnected}
                  className="flex-1 bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:opacity-50"
                />
                <button
                  onClick={handleSendMessage}
                  disabled={!isConnected || !messageInput.trim()}
                  className="p-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 rounded-lg transition-all"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-gray-900/50 backdrop-blur-sm border-t border-gray-800 px-4 py-3">
        <div className="text-center text-gray-400 text-sm max-w-6xl mx-auto">
          <p>Connect with strangers around the world • Be respectful and have fun!</p>
        </div>
      </footer>
    </div>
  );
}

export default App;