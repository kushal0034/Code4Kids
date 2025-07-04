import React, { useState, useEffect } from 'react';
import { Play, Code, Users, Trophy, Star, ChevronRight, Sparkles, Zap, BookOpen } from 'lucide-react';
import {Link} from "react-router-dom"

const LandingPage = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [currentWorld, setCurrentWorld] = useState(0);

  useEffect(() => {
    setIsVisible(true);
    const interval = setInterval(() => {
      setCurrentWorld((prev) => (prev + 1) % 3);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const worlds = [
    { 
      name: "Village Basics", 
      icon: "🏘️", 
      color: "from-green-400 to-emerald-600",
      description: "Master variables through village adventures"
    },
    { 
      name: "Forest Decisions", 
      icon: "🌲", 
      color: "from-emerald-500 to-teal-700",
      description: "Navigate choices with conditional logic"
    },
    { 
      name: "Mountain Challenges", 
      icon: "⛰️", 
      color: "from-blue-500 to-indigo-600",
      description: "Conquer loops and iteration mastery"
    }
  ];

  const features = [
    {
      icon: <Code className="w-8 h-8" />,
      title: "Drag & Drop Coding",
      description: "Visual programming blocks make coding intuitive and fun",
      color: "from-purple-500 to-pink-500"
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: "Character Stories",
      description: "Learn through engaging adventures with memorable characters",
      color: "from-orange-500 to-red-500"
    },
    {
      icon: <Trophy className="w-8 h-8" />,
      title: "Achievement System",
      description: "Unlock badges and celebrate your coding milestones",
      color: "from-yellow-500 to-orange-500"
    }
  ];

  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900" style={{ 
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #581c87 0%, #1e3a8a 50%, #312e81 100%)'
    }}>
      {/* Fixed Background Layer */}
      <div className="fixed inset-0 w-full h-full bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 -z-10"></div>
      
      {/* Animated Background Elements */}
      <div className="fixed inset-0 opacity-30 pointer-events-none">
        <div className="absolute top-10 left-10 w-20 h-20 bg-yellow-400 rounded-full animate-pulse"></div>
        <div className="absolute top-1/4 right-20 w-16 h-16 bg-pink-400 rounded-full animate-bounce"></div>
        <div className="absolute bottom-1/4 left-1/4 w-12 h-12 bg-green-400 rounded-full animate-ping"></div>
        <div className="absolute bottom-20 right-1/3 w-8 h-8 bg-blue-400 rounded-full animate-pulse"></div>
      </div>

      {/* Main Content Container */}
      <div className="relative z-10 w-full min-h-screen">
        {/* Navigation */}
        <nav className="w-full flex items-center justify-between p-6">
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-xl flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold text-white">Code4Kids</span>
          </Link>
          
          <div className="flex items-center space-x-4">
            <Link to="/login" className="px-6 py-2 text-white hover:bg-white/10 rounded-full transition-all duration-300">
              Login
            </Link>
            <Link to="/register" className="px-6 py-2 bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-full hover:scale-105 transform transition-all duration-300 shadow-lg">
              Register
            </Link>
          </div>
        </nav>

        {/* Hero Section */}
        <div className="w-full max-w-7xl mx-auto px-6 pt-12 pb-20">
          <div className="text-center">
            <div className={`transform transition-all duration-1000 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
              <h1 className="text-6xl md:text-8xl font-bold text-white mb-6 leading-tight">
                Code Your Way to
                <span className="bg-gradient-to-r from-yellow-400 via-pink-500 to-purple-600 bg-clip-text text-transparent block">
                  Magic!
                </span>
              </h1>
              
              <p className="text-xl md:text-2xl text-blue-100 mb-8 max-w-3xl mx-auto leading-relaxed">
                Journey through enchanted worlds, solve puzzles with programming blocks, and become the wizard you were meant to be
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6">
                <Link to="/register" className="group px-8 py-4 bg-gradient-to-r from-green-400 to-blue-500 text-white rounded-2xl font-bold text-lg hover:scale-105 transform transition-all duration-300 shadow-2xl flex items-center space-x-2">
                  <Play className="w-6 h-6" />
                  <span>Start Learning</span>
                  <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
                
                <button className="px-8 py-4 bg-white/10 backdrop-blur-sm text-white rounded-2xl font-bold text-lg hover:bg-white/20 transition-all duration-300 border border-white/20">
                  Watch Demo
                </button>
              </div>
            </div>
          </div>

          {/* Stats Section */}
          <div className="mt-32 py-16 bg-white/5 backdrop-blur-sm rounded-3xl border border-white/10">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              {[
                { number: "9", label: "Magical Levels", subtitle: "Progressive learning adventures" },
                { number: "500+", label: "Young Wizards", subtitle: "Students actively learning" },
                { number: "3", label: "Enchanted Worlds", subtitle: "Village, Forest and Mountain" },
                { number: "95%", label: "Success Rate", subtitle: "Students complete all worlds" }
              ].map((stat, index) => (
                <div key={index} className="group">
                  <div className="text-4xl font-bold text-transparent bg-gradient-to-r from-yellow-400 to-pink-500 bg-clip-text mb-2 group-hover:scale-110 transition-transform duration-300">
                    {stat.number}
                  </div>
                  <div className="text-white font-bold mb-1">{stat.label}</div>
                  <div className="text-blue-100 text-sm">{stat.subtitle}</div>
                </div>
              ))}
            </div>
          </div>

          {/* About Component 1 */}
          <div className="mt-32">
            <div className="text-center mb-16">
              <h2 className="text-5xl font-bold text-white mb-6">
                Programming Made Simple
                <span className="bg-gradient-to-r from-yellow-400 to-pink-500 bg-clip-text text-transparent block">
                  Through Magic
                </span>
              </h2>
              <p className="text-xl text-blue-100 max-w-4xl mx-auto leading-relaxed">
                No complex syntax or confusing code. Just drag colorful blocks, cast programming spells, and watch your wizard character come to life. Our visual programming system transforms abstract coding concepts into magical adventures that kids aged 8-14 actually understand and remember.
              </p>
            </div>
          </div>

          {/* Worlds Showcase */}
          <div className="mt-32">
            <h2 className="text-4xl font-bold text-white text-center mb-12">
              Explore Amazing Worlds
            </h2>
            
            <div className="grid md:grid-cols-3 gap-8">
              {worlds.map((world, index) => (
                <div
                  key={index}
                  className={`relative p-8 rounded-3xl bg-gradient-to-br ${world.color} transform transition-all duration-500 hover:scale-105 cursor-pointer ${
                    currentWorld === index ? 'ring-4 ring-white/50 scale-105' : ''
                  }`}
                >
                  <div className="text-center">
                    <div className="text-6xl mb-4">{world.icon}</div>
                    <h3 className="text-2xl font-bold text-white mb-2">{world.name}</h3>
                    <p className="text-white/90">{world.description}</p>
                  </div>
                  
                  <div className="absolute -top-2 -right-2 w-6 h-6 bg-yellow-400 rounded-full animate-ping"></div>
                </div>
              ))}
            </div>
          </div>

          {/* Features Section */}
          <div className="mt-32">
            <div className="text-center mb-16">
              <h2 className="text-5xl font-bold text-white mb-6">
                Why Kids Love
                <span className="bg-gradient-to-r from-yellow-400 to-pink-500 bg-clip-text text-transparent"> Code4Kids</span>
              </h2>
              <p className="text-xl text-blue-100 max-w-2xl mx-auto">
                Designed specifically for young minds to make programming fun, engaging, and accessible
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {features.map((feature, index) => (
                <div
                  key={index}
                  className="group p-8 bg-white/10 backdrop-blur-sm rounded-3xl border border-white/20 hover:bg-white/20 transition-all duration-300 hover:scale-105"
                >
                  <div className={`w-16 h-16 bg-gradient-to-br ${feature.color} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                    {React.cloneElement(feature.icon, { className: "w-8 h-8 text-white" })}
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-4">{feature.title}</h3>
                  <p className="text-blue-100 leading-relaxed">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* About Component 2 */}
          <div className="mt-32">
            <div className="text-center mb-16">
              <h2 className="text-5xl font-bold text-white mb-6">
                Three Worlds,
                <span className="bg-gradient-to-r from-yellow-400 to-pink-500 bg-clip-text text-transparent block">
                  Endless Possibilities
                </span>
              </h2>
              <p className="text-xl text-blue-100 max-w-4xl mx-auto leading-relaxed">
                Begin your journey in the peaceful Village learning variables, venture into the mysterious Forest mastering if-else decisions, and conquer the challenging Mountain with powerful loops. Each world builds upon the last, ensuring your young wizard develops real programming skills through epic quests and collaborative adventures.
              </p>
            </div>
          </div>

          {/* CTA Section */}
          <div className="mt-32 text-center">
            <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-3xl p-12 relative overflow-hidden">
              {/* Dotted Background Pattern */}
              <div 
                className="absolute inset-0 opacity-20" 
                style={{
                  backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.3) 1px, transparent 1px)',
                  backgroundSize: '30px 30px'
                }}
              ></div>
              
              <div className="relative z-10">
                <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                  Ready to Start Your Coding Quest?
                </h2>
                <p className="text-xl text-purple-100 mb-8 max-w-2xl mx-auto">
                  Join thousands of young coders who are already building amazing things!
                </p>
                
                <Link to="/register" className="group inline-flex items-center space-x-3 px-10 py-5 bg-white text-purple-600 rounded-2xl font-bold text-xl hover:scale-105 transform transition-all duration-300 shadow-2xl">
                  <Zap className="w-6 h-6" />
                  <span>Begin Adventure</span>
                  <Star className="w-5 h-5 group-hover:rotate-12 transition-transform" />
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="w-full bg-black/20 backdrop-blur-sm border-t border-white/10 mt-32">
          <div className="max-w-7xl mx-auto px-6 py-16">
            <div className="text-center">
              <div className="flex items-center justify-center space-x-2 mb-8">
                <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-xl flex items-center justify-center">
                  <Sparkles className="w-8 h-8 text-white" />
                </div>
                <span className="text-3xl font-bold text-white">Code4Kids</span>
              </div>
              
              <h3 className="text-3xl font-bold text-white mb-4">
                Three Worlds, Endless Possibilities
              </h3>
              
              <p className="text-lg text-blue-100 max-w-3xl mx-auto leading-relaxed mb-12">
                Begin your journey in the peaceful Village learning variables, venture into the mysterious Forest mastering if-else decisions, and conquer the challenging Mountain with powerful loops. Each world builds upon the last, ensuring your young wizard develops real programming skills through epic quests and collaborative adventures.
              </p>
              
              <div className="flex flex-wrap justify-center gap-8 mb-12">
                <Link to="/about" className="text-blue-100 hover:text-white transition-colors">About</Link>
                <Link to="/worlds" className="text-blue-100 hover:text-white transition-colors">Worlds</Link>
                <Link to="/pricing" className="text-blue-100 hover:text-white transition-colors">Pricing</Link>
                <Link to="/contact" className="text-blue-100 hover:text-white transition-colors">Contact</Link>
                <Link to="/privacy" className="text-blue-100 hover:text-white transition-colors">Privacy</Link>
                <Link to="/terms" className="text-blue-100 hover:text-white transition-colors">Terms</Link>
              </div>
              
              <div className="border-t border-white/10 pt-8">
                <p className="text-blue-200 text-sm">
                  © 2025 Code4Kids. All rights reserved. Made with ❤️ for young wizards everywhere.
                </p>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default LandingPage;