import React, { useState } from 'react';
import { 
  Video, 
  VideoOff, 
  Mic, 
  MicOff, 
  MessageCircle, 
  Power,
  Send,
  Users,
  Wifi,
  WifiOff,
  AlertCircle,
  SkipForward
} from 'lucide-react';
import { useWebRTC } from './hooks/useWebRTC';
import { ParentalAdvisoryModal } from './components/ParentalAdvisoryModal';

function App() {
  const [isCameraOn, setIsCameraOn] = useState(true);
  const [isMicOn, setIsMicOn] = useState(true);
  const [showChat, setShowChat] = useState(false);
  const [messageInput, setMessageInput] = useState('');
  const [onlineUsers] = useState(Math.floor(Math.random() * 5000) + 2000);
  const [showParentalModal, setShowParentalModal] = useState(false);
  
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

  const handleStartChat = () => {
    setShowParentalModal(true);
  };

  const handleAcceptTerms = () => {
    setShowParentalModal(false);
    setShowChat(true);
    startSearch();
  };

  const handleDeclineTerms = () => {
    setShowParentalModal(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white">
      {/* Parental Advisory Modal */}
      <ParentalAdvisoryModal
        isOpen={showParentalModal}
        onAccept={handleAcceptTerms}
        onDecline={handleDeclineTerms}
      />

      {/* Header */}
      <header className="backdrop-blur-md bg-black/20 border-b border-white/10 px-4 py-3">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
              <Video className="w-5 h-5" />
            </div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              TVO
            </h1>
          </div>
          
          {/* Center - Status */}
          <div className="hidden sm:flex flex-1 justify-center">
            {(isConnected || isSearching) && (
              <div className="flex items-center space-x-2 px-3 py-1 bg-white/10 rounded-lg backdrop-blur-sm">
                {isSearching ? (
                  <>
                    <div className="w-3 h-3 border-2 border-blue-500/30 border-t-blue-500 rounded-full animate-spin"></div>
                    <span className="text-xs font-medium">Finding someone...</span>
                  </>
                ) : (
                  <>
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                    <span className="text-xs font-medium">Connected</span>
                  </>
                )}
              </div>
            )}
          </div>
          
          {/* Right Side Info */}
          <div className="flex items-center space-x-3">
            <div className="hidden sm:flex items-center space-x-2 text-green-400">
              <Users className="w-3 h-3" />
              <span className="text-xs font-medium">{onlineUsers.toLocaleString()}</span>
            </div>
            
            <div className="flex items-center space-x-1">
              {isConnected ? (
                <Wifi className="w-4 h-4 text-green-400" />
              ) : (
                <WifiOff className="w-4 h-4 text-gray-400" />
              )}
              <span className="text-xs hidden sm:inline">
                {isConnected ? 'Connected' : isSearching ? 'Searching...' : 'Offline'}
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Status Bar */}
      <div className="sm:hidden bg-gradient-to-r from-gray-900/50 to-gray-800/50 border-b border-white/5 px-4 py-2">
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center space-x-2 text-green-400">
            <Users className="w-3 h-3" />
            <span>{onlineUsers.toLocaleString()} online</span>
          </div>
          {(isConnected || isSearching) && (
            <div className="flex items-center space-x-2">
              {isSearching ? (
                <>
                  <div className="w-3 h-3 border-2 border-blue-500/30 border-t-blue-500 rounded-full animate-spin"></div>
                  <span>Finding someone...</span>
                </>
              ) : (
                <>
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  <span>Connected</span>
                </>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Error Banner */}
      {error && (
        <div className="bg-red-500/20 border-b border-red-500/30 px-4 py-2">
          <div className="flex items-center space-x-2 max-w-7xl mx-auto">
            <AlertCircle className="w-4 h-4 text-red-400" />
            <span className="text-red-200 text-sm">{error}</span>
          </div>
        </div>
      )}

      <main className="flex-1 p-4 max-w-7xl mx-auto">
        {/* Mobile Layout */}
        <div className="block lg:hidden space-y-4 h-[calc(100vh-200px)]">
          {/* Video Section */}
          <div className="grid grid-cols-1 gap-4 h-4/5">
            {/* Remote Video */}
            <div className="relative bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl overflow-hidden border border-white/10">
              {isConnected ? (
                <video
                  ref={remoteVideoRef}
                  className="w-full h-full object-cover"
                  autoPlay
                  playsInline
                />
              ) : (
                <div className="flex items-center justify-center h-full">
                  <div className="text-center space-y-4">
                    {isSearching ? (
                      <>
                        <div className="w-12 h-12 mx-auto border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin"></div>
                        <p className="text-lg font-medium">Finding someone...</p>
                      </>
                    ) : (
                      <>
                        <Video className="w-16 h-16 mx-auto text-gray-600" />
                        <p className="text-lg font-medium text-gray-300">Stranger</p>
                      </>
                    )}
                  </div>
                </div>
              )}
              
              <div className="absolute top-4 left-4 bg-black/50 backdrop-blur-sm rounded-lg px-3 py-1 text-sm">
                Stranger
              </div>
            </div>

            {/* Local Video */}
            <div className="relative bg-gray-800 rounded-xl overflow-hidden border border-white/10 h-32">
              <video
                ref={localVideoRef}
                className="w-full h-full object-cover"
                autoPlay
                playsInline
                muted
              />
              <div className="absolute top-2 left-2 bg-black/50 backdrop-blur-sm rounded px-2 py-1 text-xs">
                You
              </div>
              
              {!isCameraOn && (
                <div className="absolute inset-0 bg-gray-900 flex items-center justify-center">
                  <VideoOff className="w-8 h-8 text-gray-500" />
                </div>
              )}
            </div>
          </div>

          {/* Mobile Controls */}
          <div className="flex items-center justify-center">
            {!isConnected && !isSearching ? (
              <div className="text-center space-y-3 w-full">
                <button
                  onClick={handleStartChat}
                  className="w-full px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 rounded-xl font-semibold transition-all transform hover:scale-105 shadow-lg text-white"
                >
                  Start Video Chat
                </button>
                <p className="text-xs text-gray-400">
                  Talk to random people worldwide
                </p>
              </div>
            ) : (
              <div className="flex items-center justify-center space-x-2 w-full flex-wrap gap-2">
                <button
                  onClick={handleToggleCamera}
                  className={`p-2 rounded-xl border transition-all text-white ${
                    isCameraOn 
                      ? 'bg-gray-700/80 border-gray-600/50 hover:bg-gray-600/80' 
                      : 'bg-red-600/80 border-red-500/50 hover:bg-red-500/80'
                  }`}
                >
                  {isCameraOn ? <Video className="w-4 h-4" /> : <VideoOff className="w-4 h-4" />}
                </button>

                <button
                  onClick={handleToggleMic}
                  className={`p-2 rounded-xl border transition-all text-white ${
                    isMicOn 
                      ? 'bg-gray-700/80 border-gray-600/50 hover:bg-gray-600/80' 
                      : 'bg-red-600/80 border-red-500/50 hover:bg-red-500/80'
                  }`}
                >
                  {isMicOn ? <Mic className="w-4 h-4" /> : <MicOff className="w-4 h-4" />}
                </button>

                <button
                  onClick={() => setShowChat(!showChat)}
                  className="p-2 rounded-xl bg-blue-600/80 border border-blue-500/50 hover:bg-blue-500/80 transition-all text-white"
                >
                  <MessageCircle className="w-4 h-4" />
                </button>

                <button
                  onClick={nextUser}
                  className="p-2 rounded-xl bg-purple-600/80 border border-purple-500/50 hover:bg-purple-500/80 transition-all text-white"
                  title="Next User"
                >
                  <SkipForward className="w-4 h-4" />
                </button>

                <button
                  onClick={disconnect}
                  className="p-2 rounded-xl bg-gray-600/80 border border-gray-500/50 hover:bg-gray-500/80 transition-all text-white"
                >
                  <Power className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>

          {/* Mobile Chat - Full screen overlay */}
          {showChat && (
            <div className="fixed inset-0 bg-black/90 backdrop-blur-sm z-50 flex flex-col">
              <div className="bg-gradient-to-r from-blue-900/30 via-purple-900/20 to-gray-900/40 backdrop-blur-sm border-b border-blue-500/20 p-4 flex items-center justify-between">
                <h3 className="font-semibold text-blue-100">Chat</h3>
                <button
                  onClick={() => setShowChat(false)}
                  className="p-2 hover:bg-white/10 rounded text-blue-200"
                >
                  ✕
                </button>
              </div>

              {/* Messages */}
              <div className="flex-1 p-4 overflow-y-auto space-y-3">
                {messages.length === 0 ? (
                  <div className="text-center text-blue-200/70 py-8">
                    <MessageCircle className="w-12 h-12 mx-auto mb-3 opacity-50" />
                    <p>Start chatting when connected!</p>
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
                        className={`p-3 rounded-2xl ${
                          message.sender === 'you'
                            ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white ml-auto shadow-lg'
                            : 'bg-gradient-to-r from-gray-700/80 to-gray-600/80 text-gray-100 backdrop-blur-sm border border-white/10'
                        }`}
                      >
                        <p className="text-sm">{message.text}</p>
                      </div>
                      <p className="text-xs text-blue-200/60 mt-1 px-1">
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
              <div className="p-4 border-t border-blue-500/20 bg-gradient-to-r from-blue-500/5 to-purple-500/5">
                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={messageInput}
                    onChange={(e) => setMessageInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                    placeholder={isConnected ? "Type a message..." : "Connect to chat"}
                    disabled={!isConnected}
                    className="flex-1 bg-gray-800/50 border border-blue-500/30 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 disabled:opacity-50 text-white placeholder-blue-200/50 backdrop-blur-sm"
                  />
                  <button
                    onClick={handleSendMessage}
                    disabled={!isConnected || !messageInput.trim()}
                    className="p-3 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 disabled:opacity-50 rounded-xl transition-all shadow-lg"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Desktop Layout */}
        <div className={`hidden lg:grid ${showChat ? 'grid-cols-3' : 'grid-cols-2'} gap-6 h-[calc(100vh-160px)]`}>
          {/* Video Section */}
          <div className="space-y-6">
            {/* Video Grid */}
            <div className="grid grid-cols-1 gap-4 h-4/5">
              {/* Remote Video */}
              <div className="relative bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl overflow-hidden border border-white/10">
                {isConnected ? (
                  <video
                    ref={remoteVideoRef}
                    className="w-full h-full object-cover"
                    autoPlay
                    playsInline
                  />
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <div className="text-center space-y-4">
                      {isSearching ? (
                        <>
                          <div className="w-12 h-12 mx-auto border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin"></div>
                          <p className="text-lg font-medium">Finding someone...</p>
                        </>
                      ) : (
                        <>
                          <Video className="w-16 h-16 mx-auto text-gray-600" />
                          <p className="text-lg font-medium text-gray-300">Stranger</p>
                        </>
                      )}
                    </div>
                  </div>
                )}
                
                <div className="absolute top-4 left-4 bg-black/50 backdrop-blur-sm rounded-lg px-3 py-1 text-sm">
                  Stranger
                </div>
              </div>

              {/* Local Video */}
              <div className="relative bg-gray-800 rounded-2xl overflow-hidden border border-white/10">
                <video
                  ref={localVideoRef}
                  className="w-full h-full object-cover"
                  autoPlay
                  playsInline
                  muted
                />
                <div className="absolute top-4 left-4 bg-black/50 backdrop-blur-sm rounded-lg px-3 py-1 text-sm">
                  You
                </div>
                
                {!isCameraOn && (
                  <div className="absolute inset-0 bg-gray-900 flex items-center justify-center">
                    <VideoOff className="w-16 h-16 text-gray-500" />
                  </div>
                )}
              </div>
            </div>

            {/* Video Controls */}
            <div className="h-1/5 flex items-center justify-center space-x-4">
              <button
                onClick={handleToggleCamera}
                className={`p-3 rounded-2xl border transition-all text-white ${
                  isCameraOn 
                    ? 'bg-gray-700/80 border-gray-600/50 hover:bg-gray-600/80' 
                    : 'bg-red-600/80 border-red-500/50 hover:bg-red-500/80'
                }`}
              >
                {isCameraOn ? <Video className="w-5 h-5" /> : <VideoOff className="w-5 h-5" />}
              </button>

              <button
                onClick={handleToggleMic}
                className={`p-3 rounded-2xl border transition-all text-white ${
                  isMicOn 
                    ? 'bg-gray-700/80 border-gray-600/50 hover:bg-gray-600/80' 
                    : 'bg-red-600/80 border-red-500/50 hover:bg-red-500/80'
                }`}
              >
                {isMicOn ? <Mic className="w-5 h-5" /> : <MicOff className="w-5 h-5" />}
              </button>

              <button
                onClick={() => setShowChat(!showChat)}
                className="p-3 rounded-2xl bg-blue-600/80 border border-blue-500/50 hover:bg-blue-500/80 transition-all lg:hidden text-white"
              >
                <MessageCircle className="w-5 h-5" />
              </button>

              <button
                onClick={nextUser}
                className="p-3 rounded-2xl bg-purple-600/80 border border-purple-500/50 hover:bg-purple-500/80 transition-all text-white"
                title="Next User"
              >
                <SkipForward className="w-5 h-5" />
              </button>

              <button
                onClick={disconnect}
                className="p-3 rounded-2xl bg-gray-600/80 border border-gray-500/50 hover:bg-gray-500/80 transition-all text-white"
              >
                <Power className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Welcome Section or Chat Toggle */}
          <div className="flex flex-col items-center justify-center space-y-6">
            {!isConnected && !isSearching ? (
              <>
                <div className="text-center space-y-4">
                  <div className="w-32 h-32 bg-gradient-to-br from-blue-500/20 to-purple-600/20 rounded-full flex items-center justify-center border border-blue-500/30 backdrop-blur-sm">
                    <Video className="w-16 h-16 text-blue-400" />
                  </div>
                  <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                    TVO
                  </h2>
                  <p className="text-gray-300 text-lg">Talk to Video Online</p>
                  <p className="text-gray-400 text-sm max-w-md">
                    Connect with random people from around the world through video chat
                  </p>
                </div>
                <button
                  onClick={handleStartChat}
                  className="px-8 py-3 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 rounded-xl font-semibold transition-all transform hover:scale-105 shadow-lg text-lg text-white"
                >
                  Start Video Chat
                </button>
              </>
            ) : (
              <div className="text-center space-y-4">
                <div className="w-32 h-32 bg-gradient-to-br from-blue-500/20 to-purple-600/20 rounded-full flex items-center justify-center border border-blue-500/30 backdrop-blur-sm">
                  {isSearching ? (
                    <div className="w-12 h-12 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin"></div>
                  ) : (
                    <div className="w-4 h-4 bg-green-400 rounded-full animate-pulse"></div>
                  )}
                </div>
                <h3 className="text-xl font-semibold">
                  {isSearching ? 'Finding someone...' : 'Connected!'}
                </h3>
                <p className="text-gray-400">
                  {isSearching ? 'Please wait while we connect you' : 'Enjoy your conversation'}
                </p>
                <button
                  onClick={() => setShowChat(!showChat)}
                  className="px-6 py-2 bg-blue-600/80 border border-blue-500/50 hover:bg-blue-500/80 rounded-xl transition-all text-white flex items-center space-x-2 mx-auto"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>{showChat ? 'Hide Chat' : 'Show Chat'}</span>
                </button>
              </div>
            )}
          </div>

          {/* Desktop Chat Section */}
          {showChat && (
            <div className="bg-gradient-to-br from-blue-900/30 via-purple-900/20 to-gray-900/40 backdrop-blur-sm rounded-2xl border border-blue-500/20 flex flex-col shadow-xl">
              <div className="p-4 border-b border-blue-500/20 flex items-center justify-between bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-t-2xl">
                <h3 className="font-semibold text-blue-100">Chat</h3>
              </div>

              {/* Messages */}
              <div className="flex-1 p-4 overflow-y-auto space-y-3">
                {messages.length === 0 ? (
                  <div className="text-center text-blue-200/70 py-8">
                    <MessageCircle className="w-12 h-12 mx-auto mb-3 opacity-50" />
                    <p>Start chatting when connected!</p>
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
                        className={`p-3 rounded-2xl ${
                          message.sender === 'you'
                            ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white ml-auto shadow-lg'
                            : 'bg-gradient-to-r from-gray-700/80 to-gray-600/80 text-gray-100 backdrop-blur-sm border border-white/10'
                        }`}
                      >
                        <p className="text-sm">{message.text}</p>
                      </div>
                      <p className="text-xs text-blue-200/60 mt-1 px-1">
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
              <div className="p-4 border-t border-blue-500/20 bg-gradient-to-r from-blue-500/5 to-purple-500/5 rounded-b-2xl">
                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={messageInput}
                    onChange={(e) => setMessageInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                    placeholder={isConnected ? "Type a message..." : "Connect to chat"}
                    disabled={!isConnected}
                    className="flex-1 bg-gray-800/50 border border-blue-500/30 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 disabled:opacity-50 text-white placeholder-blue-200/50 backdrop-blur-sm"
                  />
                  <button
                    onClick={handleSendMessage}
                    disabled={!isConnected || !messageInput.trim()}
                    className="p-2 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 disabled:opacity-50 rounded-xl transition-all shadow-lg"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Instructions */}
        <div className="mt-6 text-center text-gray-400 text-xs sm:text-sm">
          <p>Talk to random people worldwide • Be respectful and have fun!</p>
          {!isConnected && !isSearching && (
            <p className="mt-2 text-xs">
              Real video chat powered by WebRTC • Your privacy is protected
            </p>
          )}
        </div>
      </main>
    </div>
  );
}

export default App;