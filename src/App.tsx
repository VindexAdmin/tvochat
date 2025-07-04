import React, { useState } from 'react';
import { 
  Video, 
  VideoOff, 
  Mic, 
  MicOff, 
  MessageCircle, 
  SkipForward, 
  Power,
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
  const [onlineUsers] = useState(Math.floor(Math.random() * 10000) + 5000);
  
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
    setShowChat(true);
    startSearch();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white">
      {/* Header */}
      <header className="backdrop-blur-md bg-black/20 border-b border-white/10 px-6 py-4">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
              <Video className="w-6 h-6" />
            </div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              TVO
            </h1>
          </div>
          
          {/* Center - Status */}
          <div className="flex-1 flex justify-center">
            {(isConnected || isSearching) && (
              <div className="flex items-center space-x-2 px-4 py-2 bg-white/10 rounded-xl backdrop-blur-sm">
                {isSearching ? (
                  <>
                    <div className="w-4 h-4 border-2 border-blue-500/30 border-t-blue-500 rounded-full animate-spin"></div>
                    <span className="text-sm font-medium">Finding someone...</span>
                  </>
                ) : (
                  <>
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                    <span className="text-sm font-medium">Connected</span>
                  </>
                )}
              </div>
            )}
          </div>
          
          {/* Right Side Info */}
          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-2 text-green-400">
              <Users className="w-4 h-4" />
              <span className="text-sm font-medium">{onlineUsers.toLocaleString()} online</span>
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

      {/* AdSense Ad Section */}
      <div className="bg-gradient-to-r from-gray-900/50 to-gray-800/50 border-b border-white/5 px-6 py-3">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-center">
            <div className="bg-white/5 border border-white/10 rounded-lg p-4 backdrop-blur-sm">
              <div className="text-center text-gray-400 text-sm mb-2">Advertisement</div>
              <div className="w-full h-20 bg-gradient-to-r from-gray-700/30 to-gray-600/30 rounded border border-white/10 flex items-center justify-center">
                <span className="text-gray-500 text-sm">AdSense Ad Space</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Error Banner */}
      {error && (
        <div className="bg-red-500/20 border-b border-red-500/30 px-6 py-3">
          <div className="flex items-center space-x-2 max-w-7xl mx-auto">
            <AlertCircle className="w-5 h-5 text-red-400" />
            <span className="text-red-200">{error}</span>
          </div>
        </div>
      )}

      <main className="flex-1 p-6 max-w-7xl mx-auto">
        <div className={`grid ${showChat ? 'grid-cols-1 lg:grid-cols-4' : 'grid-cols-1'} gap-6 h-[calc(100vh-200px)]`}>
          {/* Video Section */}
          <div className={`${showChat ? 'lg:col-span-3' : 'col-span-1'} space-y-6`}>
            {/* Video Grid - Symmetric Layout */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 h-4/5">
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
                          <p className="text-lg font-medium">Searching for someone...</p>
                          <p className="text-sm text-gray-400">This may take a few moments</p>
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
                  {isConnected ? 'Stranger' : 'Waiting...'}
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

            {/* Controls */}
            <div className="h-1/5 flex items-center justify-center">
              {!isConnected && !isSearching ? (
                <div className="text-center space-y-4">
                  <button
                    onClick={handleStartChat}
                    className="px-8 py-3 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 rounded-xl font-semibold transition-all transform hover:scale-105 shadow-lg text-lg"
                  >
                    Start Video Chat
                  </button>
                  <p className="text-sm text-gray-400">
                    Click to connect with a random person
                  </p>
                </div>
              ) : (
                <div className="flex items-center space-x-6">
                  <button
                    onClick={handleToggleCamera}
                    className={`p-4 rounded-2xl border transition-all ${
                      isCameraOn 
                        ? 'bg-white/10 border-white/20 hover:bg-white/20' 
                        : 'bg-red-500/20 border-red-500/50 hover:bg-red-500/30'
                    }`}
                    title={isCameraOn ? 'Turn off camera' : 'Turn on camera'}
                  >
                    {isCameraOn ? <Video className="w-6 h-6" /> : <VideoOff className="w-6 h-6" />}
                  </button>

                  <button
                    onClick={handleToggleMic}
                    className={`p-4 rounded-2xl border transition-all ${
                      isMicOn 
                        ? 'bg-white/10 border-white/20 hover:bg-white/20' 
                        : 'bg-red-500/20 border-red-500/50 hover:bg-red-500/30'
                    }`}
                    title={isMicOn ? 'Mute microphone' : 'Unmute microphone'}
                  >
                    {isMicOn ? <Mic className="w-6 h-6" /> : <MicOff className="w-6 h-6" />}
                  </button>

                  <button
                    onClick={() => setShowChat(!showChat)}
                    className="p-4 rounded-2xl bg-white/10 border border-white/20 hover:bg-white/20 transition-all lg:hidden"
                    title="Toggle chat"
                  >
                    <MessageCircle className="w-6 h-6" />
                  </button>

                  {isConnected && (
                    <button
                      onClick={nextUser}
                      className="p-4 rounded-2xl bg-blue-500/20 border border-blue-500/50 hover:bg-blue-500/30 transition-all"
                      title="Next user"
                    >
                      <SkipForward className="w-6 h-6" />
                    </button>
                  )}

                  <button
                    onClick={disconnect}
                    className="p-4 rounded-2xl bg-red-500/20 border border-red-500/50 hover:bg-red-500/30 transition-all"
                    title="Disconnect"
                  >
                    <Power className="w-6 h-6" />
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Chat Section */}
          {showChat && (
            <div className="bg-gradient-to-br from-blue-900/30 via-purple-900/20 to-gray-900/40 backdrop-blur-sm rounded-2xl border border-blue-500/20 flex flex-col shadow-xl">
              <div className="p-4 border-b border-blue-500/20 flex items-center justify-between bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-t-2xl">
                <h3 className="font-semibold text-blue-100">Chat</h3>
                <button
                  onClick={() => setShowChat(false)}
                  className="lg:hidden p-1 hover:bg-white/10 rounded text-blue-200"
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
        <div className="mt-6 text-center text-gray-400 text-sm">
          <p>Connect with random people around the world • Be respectful and have fun!</p>
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