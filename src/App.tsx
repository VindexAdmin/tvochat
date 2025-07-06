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
  RotateCcw
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
    startSearch();
  };

  const handleDeclineTerms = () => {
    setShowParentalModal(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
      {/* Parental Advisory Modal */}
      <ParentalAdvisoryModal
        isOpen={showParentalModal}
        onAccept={handleAcceptTerms}
        onDecline={handleDeclineTerms}
      />

      {/* Header */}
      <header className="bg-black/20 backdrop-blur-md border-b border-white/10 px-4 py-3">
        <div className="flex items-center justify-between max-w-6xl mx-auto">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
              <Video className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">TVO</h1>
              <p className="text-xs text-purple-200">Video Chat</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2 text-green-400">
              <Users className="w-4 h-4" />
              <span className="text-sm font-medium">{onlineUsers.toLocaleString()}</span>
            </div>
            
            <div className="flex items-center space-x-2">
              {isConnected ? (
                <Wifi className="w-4 h-4 text-green-400" />
              ) : (
                <WifiOff className="w-4 h-4 text-gray-400" />
              )}
              <span className="text-sm text-white">
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

      <main className="flex-1 p-4 max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-140px)]">
          {/* Video Section */}
          <div className="lg:col-span-2 space-y-4">
            {/* Remote Video */}
            <div className="relative bg-black rounded-2xl overflow-hidden h-3/5 border border-white/10">
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
                        <div className="w-16 h-16 mx-auto border-4 border-purple-500/30 border-t-purple-500 rounded-full animate-spin"></div>
                        <p className="text-xl font-medium text-white">Buscando personas...</p>
                        <p className="text-purple-200">Conectando con alguien nuevo</p>
                      </>
                    ) : (
                      <>
                        <Video className="w-20 h-20 mx-auto text-gray-600" />
                        <p className="text-xl font-medium text-white">Stranger</p>
                        <p className="text-purple-200">Presiona "Start" para conectar</p>
                      </>
                    )}
                  </div>
                </div>
              )}
              
              <div className="absolute top-4 left-4 bg-black/70 backdrop-blur-sm rounded-lg px-3 py-1">
                <span className="text-white text-sm font-medium">Stranger</span>
              </div>
            </div>

            {/* Local Video */}
            <div className="relative bg-black rounded-2xl overflow-hidden h-2/5 border border-white/10">
              <video
                ref={localVideoRef}
                className="w-full h-full object-cover"
                autoPlay
                playsInline
                muted
              />
              <div className="absolute top-4 left-4 bg-black/70 backdrop-blur-sm rounded-lg px-3 py-1">
                <span className="text-white text-sm font-medium">You</span>
              </div>
              
              {!isCameraOn && (
                <div className="absolute inset-0 bg-gray-900 flex items-center justify-center">
                  <VideoOff className="w-16 h-16 text-gray-500" />
                </div>
              )}
            </div>
          </div>

          {/* Chat Section */}
          <div className="bg-black/30 backdrop-blur-sm rounded-2xl border border-white/10 flex flex-col">
            <div className="p-4 border-b border-white/10 flex items-center justify-between">
              <h3 className="font-semibold text-white flex items-center space-x-2">
                <MessageCircle className="w-5 h-5" />
                <span>Chat</span>
              </h3>
              <button
                onClick={() => setShowChat(!showChat)}
                className="lg:hidden p-2 hover:bg-white/10 rounded-lg text-white"
              >
                {showChat ? '✕' : '💬'}
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 p-4 overflow-y-auto space-y-3">
              {messages.length === 0 ? (
                <div className="text-center text-purple-200/70 py-8">
                  <MessageCircle className="w-12 h-12 mx-auto mb-3 opacity-50" />
                  <p>Los mensajes aparecerán aquí</p>
                  <p className="text-xs mt-1">Conecta para empezar a chatear</p>
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
                          ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white ml-auto'
                          : 'bg-white/10 backdrop-blur-sm text-white border border-white/20'
                      }`}
                    >
                      <p className="text-sm">{message.text}</p>
                    </div>
                    <p className="text-xs text-purple-200/60 mt-1 px-1">
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
            <div className="p-4 border-t border-white/10">
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={messageInput}
                  onChange={(e) => setMessageInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  placeholder={isConnected ? "Escribe un mensaje..." : "Conecta para chatear"}
                  disabled={!isConnected}
                  className="flex-1 bg-white/10 border border-white/20 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-purple-400 disabled:opacity-50 text-white placeholder-purple-200/50 backdrop-blur-sm"
                />
                <button
                  onClick={handleSendMessage}
                  disabled={!isConnected || !messageInput.trim()}
                  className="p-2 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 disabled:opacity-50 rounded-xl transition-all"
                >
                  <Send className="w-4 h-4 text-white" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="mt-6 flex items-center justify-center">
          {!isConnected && !isSearching ? (
            <div className="text-center space-y-4">
              <button
                onClick={handleStartChat}
                className="px-8 py-4 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 rounded-2xl font-semibold text-lg text-white transition-all transform hover:scale-105 shadow-xl"
              >
                Start Video Chat
              </button>
              <p className="text-purple-200 text-sm">
                Conecta con personas aleatorias de todo el mundo
              </p>
            </div>
          ) : (
            <div className="flex items-center space-x-4">
              <button
                onClick={handleToggleCamera}
                className={`p-4 rounded-2xl border transition-all ${
                  isCameraOn 
                    ? 'bg-white/10 border-white/20 hover:bg-white/20 text-white' 
                    : 'bg-red-500/80 border-red-400/50 hover:bg-red-400/80 text-white'
                }`}
              >
                {isCameraOn ? <Video className="w-6 h-6" /> : <VideoOff className="w-6 h-6" />}
              </button>

              <button
                onClick={handleToggleMic}
                className={`p-4 rounded-2xl border transition-all ${
                  isMicOn 
                    ? 'bg-white/10 border-white/20 hover:bg-white/20 text-white' 
                    : 'bg-red-500/80 border-red-400/50 hover:bg-red-400/80 text-white'
                }`}
              >
                {isMicOn ? <Mic className="w-6 h-6" /> : <MicOff className="w-6 h-6" />}
              </button>

              <button
                onClick={nextUser}
                className="p-4 rounded-2xl bg-blue-500/80 border border-blue-400/50 hover:bg-blue-400/80 transition-all text-white"
                title="Next User"
              >
                <RotateCcw className="w-6 h-6" />
              </button>

              <button
                onClick={disconnect}
                className="p-4 rounded-2xl bg-gray-600/80 border border-gray-500/50 hover:bg-gray-500/80 transition-all text-white"
                title="Stop"
              >
                <Power className="w-6 h-6" />
              </button>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="mt-8 text-center text-purple-200/70 text-sm">
          <p>Habla con extraños de forma anónima • Sé respetuoso y diviértete</p>
          <p className="mt-2 text-xs">
            Video chat gratuito y anónimo • Tu privacidad está protegida
          </p>
        </div>
      </main>
    </div>
  );
}

export default App;