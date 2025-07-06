import React, { useState } from 'react';
import { 
  Sparkles, 
  Zap, 
  Heart, 
  Star, 
  Rocket,
  Moon,
  Sun,
  Menu,
  X,
  ArrowRight,
  Check,
  Globe,
  Shield,
  Smartphone
} from 'lucide-react';

function App() {
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  const features = [
    {
      icon: <Zap className="w-6 h-6" />,
      title: "Lightning Fast",
      description: "Built with modern technologies for optimal performance"
    },
    {
      icon: <Shield className="w-6 h-6" />,
      title: "Secure & Reliable",
      description: "Enterprise-grade security with 99.9% uptime guarantee"
    },
    {
      icon: <Smartphone className="w-6 h-6" />,
      title: "Mobile First",
      description: "Responsive design that works perfectly on all devices"
    },
    {
      icon: <Globe className="w-6 h-6" />,
      title: "Global Scale",
      description: "Deployed worldwide with CDN for fastest access"
    }
  ];

  const stats = [
    { number: "10K+", label: "Happy Users" },
    { number: "99.9%", label: "Uptime" },
    { number: "24/7", label: "Support" },
    { number: "50+", label: "Countries" }
  ];

  return (
    <div className={`min-h-screen transition-all duration-500 ${
      isDarkMode 
        ? 'bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900 text-white' 
        : 'bg-gradient-to-br from-blue-50 via-white to-purple-50 text-gray-900'
    }`}>
      {/* Navigation */}
      <nav className={`backdrop-blur-md border-b transition-all duration-300 ${
        isDarkMode 
          ? 'bg-black/20 border-white/10' 
          : 'bg-white/70 border-gray-200/50'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center space-x-2">
              <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${
                isDarkMode 
                  ? 'bg-gradient-to-r from-purple-500 to-pink-500' 
                  : 'bg-gradient-to-r from-blue-500 to-purple-500'
              }`}>
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                ModernApp
              </span>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              <a href="#features" className={`hover:text-purple-400 transition-colors ${
                isDarkMode ? 'text-gray-300' : 'text-gray-600'
              }`}>
                Features
              </a>
              <a href="#about" className={`hover:text-purple-400 transition-colors ${
                isDarkMode ? 'text-gray-300' : 'text-gray-600'
              }`}>
                About
              </a>
              <a href="#contact" className={`hover:text-purple-400 transition-colors ${
                isDarkMode ? 'text-gray-300' : 'text-gray-600'
              }`}>
                Contact
              </a>
              
              {/* Theme Toggle */}
              <button
                onClick={toggleTheme}
                className={`p-2 rounded-xl transition-all hover:scale-110 ${
                  isDarkMode 
                    ? 'bg-yellow-500/20 text-yellow-400 hover:bg-yellow-500/30' 
                    : 'bg-purple-500/20 text-purple-600 hover:bg-purple-500/30'
                }`}
              >
                {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </button>
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden flex items-center space-x-2">
              <button
                onClick={toggleTheme}
                className={`p-2 rounded-xl transition-all ${
                  isDarkMode 
                    ? 'bg-yellow-500/20 text-yellow-400' 
                    : 'bg-purple-500/20 text-purple-600'
                }`}
              >
                {isDarkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
              </button>
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className={`p-2 rounded-xl transition-all ${
                  isDarkMode 
                    ? 'bg-white/10 text-white hover:bg-white/20' 
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {/* Mobile Navigation */}
          {isMenuOpen && (
            <div className={`md:hidden py-4 border-t ${
              isDarkMode ? 'border-white/10' : 'border-gray-200'
            }`}>
              <div className="flex flex-col space-y-3">
                <a href="#features" className={`hover:text-purple-400 transition-colors ${
                  isDarkMode ? 'text-gray-300' : 'text-gray-600'
                }`}>
                  Features
                </a>
                <a href="#about" className={`hover:text-purple-400 transition-colors ${
                  isDarkMode ? 'text-gray-300' : 'text-gray-600'
                }`}>
                  About
                </a>
                <a href="#contact" className={`hover:text-purple-400 transition-colors ${
                  isDarkMode ? 'text-gray-300' : 'text-gray-600'
                }`}>
                  Contact
                </a>
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
          <div className="text-center">
            {/* Floating elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              <div className={`absolute top-20 left-10 w-20 h-20 rounded-full opacity-20 animate-pulse ${
                isDarkMode ? 'bg-purple-500' : 'bg-blue-500'
              }`}></div>
              <div className={`absolute top-40 right-20 w-16 h-16 rounded-full opacity-30 animate-bounce ${
                isDarkMode ? 'bg-pink-500' : 'bg-purple-500'
              }`}></div>
              <div className={`absolute bottom-20 left-1/4 w-12 h-12 rounded-full opacity-25 animate-ping ${
                isDarkMode ? 'bg-blue-500' : 'bg-pink-500'
              }`}></div>
            </div>

            <div className="relative z-10">
              <h1 className="text-4xl sm:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
                <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent">
                  Beautiful
                </span>
                <br />
                <span className={isDarkMode ? 'text-white' : 'text-gray-900'}>
                  Modern Web
                </span>
              </h1>
              
              <p className={`text-xl sm:text-2xl mb-8 max-w-3xl mx-auto leading-relaxed ${
                isDarkMode ? 'text-gray-300' : 'text-gray-600'
              }`}>
                Experience the future of web applications with our cutting-edge platform. 
                Built for performance, designed for beauty.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6">
                <button className="group px-8 py-4 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 rounded-2xl font-semibold text-white transition-all transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center space-x-2">
                  <span>Get Started</span>
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>
                
                <button className={`px-8 py-4 rounded-2xl font-semibold transition-all transform hover:scale-105 border-2 ${
                  isDarkMode 
                    ? 'border-white/20 text-white hover:bg-white/10' 
                    : 'border-gray-300 text-gray-700 hover:bg-gray-100'
                }`}>
                  Learn More
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className={`py-16 ${
        isDarkMode 
          ? 'bg-black/20 backdrop-blur-sm' 
          : 'bg-white/50 backdrop-blur-sm'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-2">
                  {stat.number}
                </div>
                <div className={`text-sm lg:text-base ${
                  isDarkMode ? 'text-gray-400' : 'text-gray-600'
                }`}>
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-5xl font-bold mb-6">
              <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                Amazing Features
              </span>
            </h2>
            <p className={`text-xl max-w-3xl mx-auto ${
              isDarkMode ? 'text-gray-300' : 'text-gray-600'
            }`}>
              Discover what makes our platform special and why thousands of users choose us every day.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className={`group p-6 rounded-2xl transition-all duration-300 hover:scale-105 cursor-pointer ${
                  isDarkMode 
                    ? 'bg-white/5 backdrop-blur-sm border border-white/10 hover:bg-white/10' 
                    : 'bg-white/70 backdrop-blur-sm border border-gray-200/50 hover:bg-white shadow-lg hover:shadow-xl'
                }`}
              >
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 transition-all group-hover:scale-110 ${
                  isDarkMode 
                    ? 'bg-gradient-to-r from-purple-500/20 to-pink-500/20 text-purple-400' 
                    : 'bg-gradient-to-r from-purple-500/10 to-pink-500/10 text-purple-600'
                }`}>
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                <p className={`${
                  isDarkMode ? 'text-gray-400' : 'text-gray-600'
                }`}>
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className={`py-20 ${
        isDarkMode 
          ? 'bg-gradient-to-r from-purple-900/50 to-pink-900/50' 
          : 'bg-gradient-to-r from-purple-100/50 to-pink-100/50'
      }`}>
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl lg:text-5xl font-bold mb-6">
            Ready to get started?
          </h2>
          <p className={`text-xl mb-8 ${
            isDarkMode ? 'text-gray-300' : 'text-gray-600'
          }`}>
            Join thousands of satisfied users and experience the difference today.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6">
            <button className="group px-8 py-4 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 rounded-2xl font-semibold text-white transition-all transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center space-x-2">
              <Rocket className="w-5 h-5" />
              <span>Start Free Trial</span>
            </button>
            
            <div className="flex items-center space-x-2 text-sm">
              <Check className="w-4 h-4 text-green-400" />
              <span className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>
                No credit card required
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className={`py-12 border-t ${
        isDarkMode 
          ? 'bg-black/20 border-white/10' 
          : 'bg-white/50 border-gray-200'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${
                isDarkMode 
                  ? 'bg-gradient-to-r from-purple-500 to-pink-500' 
                  : 'bg-gradient-to-r from-blue-500 to-purple-500'
              }`}>
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                ModernApp
              </span>
            </div>
            
            <div className={`flex items-center space-x-6 text-sm ${
              isDarkMode ? 'text-gray-400' : 'text-gray-600'
            }`}>
              <span>© 2025 ModernApp. All rights reserved.</span>
              <div className="flex items-center space-x-1">
                <span>Made with</span>
                <Heart className="w-4 h-4 text-red-400" />
                <span>and React</span>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;