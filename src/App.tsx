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
  AlertCircle,
  Power
} from 'lucide-react';
import { useWebRTC } from './hooks/useWebRTC';
import { ParentalAdvisoryModal } from './components/ParentalAdvisoryModal';

function App() {
  const [isCameraOn, setIsCameraOn] = useState(true);
  const [isMicOn, setIsMicOn] = useState(true);
  const [showChat, setShowChat] = useState(false);
  const [messageInput, setMessageInput] = useState('');
  const [onlineUsers] = useState(Math.floor(Math.random() * 50000) + 25000);
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

  const handleStart = () => {
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
    <div className="min-h-screen bg-white text-black">
      {/* Parental Advisory Modal */}
      <ParentalAdvisoryModal
        isOpen={showParentalModal}
        onAccept={handleAcceptTerms}
        onDecline={handleDeclineTerms}
      />

      {/* Header - Omegle Style */}
      <header className="bg-blue-600 text-white px-4 py-3 shadow-md">
        <div className="flex items-center justify-between max-w-6xl mx-auto">
          <div className="flex items-center space-x-3">
            <h1 className="text-2xl font-bold">Omegle</h1>
            <span className="text-blue-200 text-sm">Talk to strangers!</span>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2 text-blue-200">
              <Users className="w-4 h-4" />
              <span className="text-sm">{onlineUsers.toLocaleString()} online now</span>
            </div>
          </div>
        </div>
      </header>

      {/* Error Banner */}
      {error && (
        <div className="bg-red-100 border-b border-red-300 px-4 py-2">
          <div className="flex items-center space-x-2 max-w-6xl mx-auto">
            <AlertCircle className="w-4 h-4 text-red-600" />
            <span className="text-red-700 text-sm">{error}</span>
          </div>
        </div>
      )}

      {/* Main Content - Omegle Layout */}
      <main className="flex-1">
        <div className="max-w-6xl mx-auto p-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 h-[calc(100vh-200px)]">
            
            {/* Video Section */}
            <div className="space-y-4">
              {/* Stranger's Video */}
              <div className="bg-black rounded-lg overflow-hidden shadow-lg h-64 lg:h-80 relative">
                {isConnected ? (
                  <video
                    ref={remoteVideoRef}
                    className="w-full h-full object-cover"
                    autoPlay
                    playsInline
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gray-900">
                    <div className="text-center space-y-4 text-white">
                      {isSearching ? (
                        <>
                          <div className="w-12 h-12 mx-auto border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin"></div>
                          <p className="text-lg">Looking for someone you can chat with. Hang on.</p>
                        </>
                      ) : (
                        <>
                          <Video className="w-16 h-16 mx-auto text-gray-500" />
                          <p className="text-lg">Stranger</p>
                        </>
                      )}
                    </div>
                  </div>
                )}
                <div className="absolute bottom-2 left-2 bg-black/70 text-white px-2 py-1 rounded text-sm">
                  Stranger
                </div>
              </div>

              {/* Your Video */}
              <div className="bg-black rounded-lg overflow-hidden shadow-lg h-64 lg:h-80 relative">
                <video
                  ref={localVideoRef}
                  className="w-full h-full object-cover"
                  autoPlay
                  playsInline
                  muted
                />
                {!isCameraOn && (
                  <div className="absolute inset-0 bg-gray-900 flex items-center justify-center">
                    <VideoOff className="w-16 h-16 text-gray-500" />
                  </div>
                )}
                <div className="absolute bottom-2 left-2 bg-black/70 text-white px-2 py-1 rounded text-sm">
                  You
                </div>
              </div>
            </div>

            {/* Chat Section */}
            <div className="bg-white border border-gray-300 rounded-lg shadow-lg flex flex-col h-64 lg:h-[calc(100%-2rem)]">
              <div className="bg-gray-100 border-b border-gray-300 p-3 rounded-t-lg">
                <h3 className="font-semibold text-gray-800">Chat</h3>
              </div>

              {/* Messages */}
              <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-white">
                {messages.length === 0 ? (
                  <div className="text-center text-gray-500 py-8">
                    {isConnected ? (
                      <p>You're now chatting with a random stranger. Say hi!</p>
                    ) : isSearching ? (
                      <p>Looking for someone you can chat with. Hang on.</p>
                    ) : (
                      <p>You're not connected to anyone. Click "Start" to begin!</p>
                    )}
                  </div>
                ) : (
                  messages.map((message) => (
                    <div key={message.id} className="text-sm">
                      <span className={`font-semibold ${
                        message.sender === 'you' ? 'text-blue-600' : 'text-red-600'
                      }`}>
                        {message.sender === 'you' ? 'You' : 'Stranger'}:
                      </span>
                      <span className="ml-2 text-gray-800">{message.text}</span>
                    </div>
                  ))
                )}
              </div>

              {/* Message Input */}
              <div className="border-t border-gray-300 p-3 bg-gray-50 rounded-b-lg">
                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={messageInput}
                    onChange={(e) => setMessageInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                    placeholder={isConnected ? "Type your message here..." : "Connect to start chatting"}
                    disabled={!isConnected}
                    className="flex-1 border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:text-gray-500"
                  />
                  <button
                    onClick={handleSendMessage}
                    disabled={!isConnected || !messageInput.trim()}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white rounded text-sm transition-colors"
                  >
                    Send
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Controls - Omegle Style */}
          <div className="mt-6 flex flex-wrap items-center justify-center gap-4">
            {!isConnected && !isSearching ? (
              <button
                onClick={handleStart}
                className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium text-lg transition-colors shadow-md"
              >
                Start chatting
              </button>
            ) : (
              <>
                <button
                  onClick={handleToggleCamera}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors shadow-md ${
                    isCameraOn 
                      ? 'bg-gray-600 hover:bg-gray-700 text-white' 
                      : 'bg-red-600 hover:bg-red-700 text-white'
                  }`}
                >
                  {isCameraOn ? 'Turn off camera' : 'Turn on camera'}
                </button>

                <button
                  onClick={handleToggleMic}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors shadow-md ${
                    isMicOn 
                      ? 'bg-gray-600 hover:bg-gray-700 text-white' 
                      : 'bg-red-600 hover:bg-red-700 text-white'
                  }`}
                >
                  {isMicOn ? 'Mute' : 'Unmute'}
                </button>

                {isConnected && (
                  <button
                    onClick={nextUser}
                    className="px-6 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-lg font-medium transition-colors shadow-md"
                  >
                    New
                  </button>
                )}

                <button
                  onClick={disconnect}
                  className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors shadow-md"
                >
                  Stop
                </button>
              </>
            )}
          </div>

          {/* Omegle-style disclaimer */}
          <div className="mt-6 text-center text-gray-600 text-sm max-w-4xl mx-auto">
            <p className="mb-2">
              <strong>Omegle</strong> lets you chat with strangers instantly. When you use Omegle, we pick someone else at random and let you talk one-on-one.
            </p>
            <p className="mb-2">
              To help you stay safe, chats are anonymous unless you tell someone who you are (not suggested!), and you can stop a chat at any time.
            </p>
            <p className="text-xs text-gray-500">
              Predators have been known to use Omegle, so please be careful. You must be 18+ or 13+ with parental permission.
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-100 border-t border-gray-300 px-4 py-6 mt-8">
        <div className="text-center text-gray-600 text-sm max-w-6xl mx-auto">
          <p className="mb-2">© 2024 Omegle.com LLC. All rights reserved.</p>
          <div className="flex justify-center space-x-4 text-xs">
            <a href="#" className="text-blue-600 hover:underline">Terms of Service</a>
            <a href="#" className="text-blue-600 hover:underline">Privacy Policy</a>
            <a href="#" className="text-blue-600 hover:underline">Community Guidelines</a>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;