import React, { useState, useEffect } from 'react';
import { Sparkles, Star, Lock, Play, ChevronRight } from 'lucide-react';

const WorldsPage = () => {
  const [selectedWorld, setSelectedWorld] = useState(null);
  const [particles, setParticles] = useState([]);

  useEffect(() => {
    // Generate floating particles
    const newParticles = [];
    for (let i = 0; i < 20; i++) {
      newParticles.push({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        delay: Math.random() * 4,
        duration: 3 + Math.random() * 2
      });
    }
    setParticles(newParticles);
  }, []);

  const worlds = [
    {
      id: 1,
      name: "Village Basics",
      concept: "Variables",
      icon: "🏘️",
      color: "from-green-400 to-emerald-600",
      shadowColor: "shadow-green-500/50",
      unlocked: true,
      progress: 100,
      description: "Learn the fundamentals of coding through village adventures",
      levels: [
        { id: 1, name: "Apple Collection", concept: "Counter Variables", unlocked: true, completed: true, stars: 3 },
        { id: 2, name: "Message Delivery", concept: "String Variables", unlocked: true, completed: true, stars: 2 },
        { id: 3, name: "Potion Ingredients", concept: "Math Variables", unlocked: true, completed: false, stars: 0 }
      ]
    },
    {
      id: 2,
      name: "Forest Decisions",
      concept: "If/Else Logic",
      icon: "🌲",
      color: "from-emerald-500 to-teal-700",
      shadowColor: "shadow-emerald-500/50",
      unlocked: true,
      progress: 33,
      description: "Master conditional logic through mystical forest challenges",
      levels: [
        { id: 4, name: "Weather Paths", concept: "Basic If/Else", unlocked: true, completed: true, stars: 3 },
        { id: 5, name: "Monster Spells", concept: "Multiple Conditions", unlocked: true, completed: false, stars: 0 },
        { id: 6, name: "Villager Problems", concept: "Nested Logic", unlocked: false, completed: false, stars: 0 }
      ]
    },
    {
      id: 3,
      name: "Mountain Challenges",
      concept: "Loops & Iteration",
      icon: "⛰️",
      color: "from-blue-500 to-indigo-600",
      shadowColor: "shadow-blue-500/50",
      unlocked: false,
      progress: 0,
      description: "Conquer repetition and loops in the magical mountains",
      levels: [
        { id: 7, name: "Bridge Crossing", concept: "For Loops", unlocked: false, completed: false, stars: 0 },
        { id: 8, name: "Rock Clearing", concept: "While Loops", unlocked: false, completed: false, stars: 0 },
        { id: 9, name: "Dragon Battle", concept: "Nested Loops", unlocked: false, completed: false, stars: 0 }
      ]
    }
  ];

  const Link = ({ to, children, className }) => (
    <a href={to} className={className}>
      {children}
    </a>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 z-0">
        {/* Stars */}
        {[...Array(50)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-white rounded-full animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${2 + Math.random() * 2}s`
            }}
          />
        ))}
        
        {/* Floating Particles */}
        {particles.map(particle => (
          <div
            key={particle.id}
            className="absolute w-2 h-2 bg-yellow-400 rounded-full opacity-60"
            style={{
              left: `${particle.x}%`,
              top: `${particle.y}%`,
              animation: `float ${particle.duration}s ease-in-out infinite`,
              animationDelay: `${particle.delay}s`
            }}
          />
        ))}
        
        {/* Floating Clouds */}
        <div className="absolute top-20 left-10 w-32 h-16 bg-white/10 rounded-full animate-bounce opacity-30" style={{ animationDuration: '6s' }} />
        <div className="absolute top-40 right-20 w-24 h-12 bg-white/10 rounded-full animate-bounce opacity-20" style={{ animationDuration: '8s', animationDelay: '2s' }} />
        <div className="absolute bottom-40 left-1/4 w-20 h-10 bg-white/10 rounded-full animate-bounce opacity-25" style={{ animationDuration: '7s', animationDelay: '4s' }} />
      </div>

      {/* Header */}
      <div className="relative z-10 text-center py-12 px-6">
        <Link to="/" className="inline-flex items-center space-x-2 mb-8 hover:scale-105 transition-transform">
          <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-xl flex items-center justify-center">
            <Sparkles className="w-8 h-8 text-white" />
          </div>
          <span className="text-2xl font-bold text-white">Code4Kids</span>
        </Link>
        
        <h1 className="text-5xl md:text-7xl font-bold mb-6">
          <span className="bg-gradient-to-r from-yellow-400 via-pink-500 to-purple-600 bg-clip-text text-transparent">
            Magical Worlds
          </span>
        </h1>
        <p className="text-xl text-blue-200 max-w-3xl mx-auto">
          Embark on epic coding adventures across three enchanted realms. Master programming concepts through magical quests!
        </p>
      </div>

      {/* Worlds Container */}
      <div className="relative z-10 flex flex-col lg:flex-row items-center justify-center gap-16 lg:gap-8 px-6 pb-16">
        {worlds.map((world, index) => (
          <div key={world.id} className="relative group">
            {/* Connecting Path Lines */}
            {index < worlds.length - 1 && (
              <div className="hidden lg:block absolute top-1/2 -right-16 w-16 h-1 bg-gradient-to-r from-white/30 to-transparent">
                <div className="absolute inset-0 bg-gradient-to-r from-yellow-400/50 to-transparent animate-pulse" />
              </div>
            )}
            
            {/* World Island */}
            <div 
              className={`relative w-80 h-96 cursor-pointer transition-all duration-500 hover:scale-105 ${
                world.unlocked ? 'hover:-translate-y-4' : 'opacity-60'
              }`}
              style={{
                animation: `worldFloat 6s ease-in-out infinite`,
                animationDelay: `${index * -2}s`
              }}
              onClick={() => world.unlocked && setSelectedWorld(world)}
            >
              {/* World Base/Ground */}
              <div className={`absolute bottom-0 left-1/2 transform -translate-x-1/2 w-72 h-32 bg-gradient-to-br ${world.color} rounded-t-full shadow-2xl ${world.shadowColor}`}>
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-t-full" />
                
                {/* World Surface Details */}
                <div className="absolute inset-0 overflow-hidden rounded-t-full">
                  {world.id === 1 && (
                    <>
                      <div className="absolute bottom-4 left-8 w-6 h-8 bg-amber-600 rounded-sm transform rotate-12" />
                      <div className="absolute bottom-6 right-12 w-4 h-6 bg-amber-700 rounded-sm" />
                      <div className="absolute bottom-2 left-1/2 w-8 h-3 bg-red-500 rounded-full" />
                    </>
                  )}
                  {world.id === 2 && (
                    <>
                      <div className="absolute bottom-8 left-12 w-3 h-12 bg-amber-800 rounded-sm" />
                      <div className="absolute bottom-6 right-16 w-2 h-8 bg-amber-900 rounded-sm" />
                      <div className="absolute bottom-4 left-1/3 w-4 h-10 bg-green-800 rounded-sm" />
                    </>
                  )}
                  {world.id === 3 && (
                    <>
                      <div className="absolute bottom-12 left-1/4 w-8 h-8 bg-gray-600 rounded" />
                      <div className="absolute bottom-8 right-1/4 w-6 h-12 bg-gray-700 rounded-t-lg" />
                      <div className="absolute bottom-4 left-1/2 w-4 h-6 bg-gray-500 rounded" />
                    </>
                  )}
                </div>
              </div>

              {/* World Content */}
              <div className="absolute top-8 left-1/2 transform -translate-x-1/2 text-center w-full">
                {/* Lock Icon for Locked Worlds */}
                {!world.unlocked && (
                  <div className="absolute -top-2 -right-2 w-8 h-8 bg-red-500 rounded-full flex items-center justify-center z-20">
                    <Lock className="w-4 h-4 text-white" />
                  </div>
                )}
                
                {/* World Icon */}
                <div className="text-8xl mb-4 filter drop-shadow-lg animate-bounce" style={{ animationDuration: '3s' }}>
                  {world.icon}
                </div>
                
                {/* World Title */}
                <h2 className="text-2xl font-bold text-white mb-2 drop-shadow-lg">
                  {world.name}
                </h2>
                <p className="text-blue-200 text-sm mb-4 drop-shadow">
                  {world.concept}
                </p>
                
                {/* Progress Bar */}
                {world.unlocked && (
                  <div className="w-48 mx-auto mb-4">
                    <div className="flex justify-between text-xs text-white mb-1">
                      <span>Progress</span>
                      <span>{world.progress}%</span>
                    </div>
                    <div className="w-full bg-white/20 rounded-full h-2">
                      <div 
                        className="bg-gradient-to-r from-yellow-400 to-orange-500 h-2 rounded-full transition-all duration-1000"
                        style={{ width: `${world.progress}%` }}
                      />
                    </div>
                  </div>
                )}
                
                {/* Levels Preview */}
                <div className="space-y-2">
                  {world.levels.map((level) => (
                    <div 
                      key={level.id}
                      className={`bg-white/10 backdrop-blur-sm rounded-lg p-2 mx-4 border transition-all duration-300 ${
                        level.unlocked 
                          ? 'border-white/30 hover:bg-white/20' 
                          : 'border-white/10 opacity-50'
                      }`}
                    >
                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center space-x-2">
                          {!level.unlocked && <Lock className="w-3 h-3 text-gray-400" />}
                          <span className="text-white font-medium">{level.name}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          {[...Array(3)].map((_, i) => (
                            <Star 
                              key={i} 
                              className={`w-3 h-3 ${
                                i < level.stars 
                                  ? 'text-yellow-400 fill-current' 
                                  : 'text-white/30'
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                
                {/* Enter World Button */}
                {world.unlocked && (
                  <button className="mt-4 px-6 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold rounded-xl hover:scale-105 transition-transform shadow-lg flex items-center space-x-2 mx-auto">
                    <Play className="w-4 h-4" />
                    <span>Enter World</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* World Detail Modal */}
      {selectedWorld && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-3xl p-8 max-w-2xl w-full border border-white/20 shadow-2xl">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-4">
                <span className="text-5xl">{selectedWorld.icon}</span>
                <div>
                  <h3 className="text-2xl font-bold text-white">{selectedWorld.name}</h3>
                  <p className="text-blue-200">{selectedWorld.concept}</p>
                </div>
              </div>
              <button 
                onClick={() => setSelectedWorld(null)}
                className="text-white hover:text-red-400 text-2xl"
              >
                ×
              </button>
            </div>
            
            <p className="text-blue-100 mb-6">{selectedWorld.description}</p>
            
            <div className="space-y-3 mb-6">
              <h4 className="text-lg font-bold text-white">Levels in this World:</h4>
              {selectedWorld.levels.map((level) => (
                <div key={level.id} className="bg-white/5 rounded-xl p-4 border border-white/10">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="flex items-center space-x-2">
                        {!level.unlocked && <Lock className="w-4 h-4 text-gray-400" />}
                        <h5 className="text-white font-bold">{level.name}</h5>
                      </div>
                      <p className="text-blue-200 text-sm">{level.concept}</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="flex space-x-1">
                        {[...Array(3)].map((_, i) => (
                          <Star 
                            key={i} 
                            className={`w-4 h-4 ${
                              i < level.stars 
                                ? 'text-yellow-400 fill-current' 
                                : 'text-white/30'
                            }`}
                          />
                        ))}
                      </div>
                      {level.unlocked && (
                        <ChevronRight className="w-5 h-5 text-blue-400" />
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="flex space-x-4">
              <button 
                onClick={() => setSelectedWorld(null)}
                className="flex-1 px-6 py-3 bg-white/10 text-white rounded-xl hover:bg-white/20 transition-colors"
              >
                Back to Worlds
              </button>
              <button className="flex-1 px-6 py-3 bg-gradient-to-r from-green-500 to-blue-500 text-white font-bold rounded-xl hover:scale-105 transition-transform">
                Start Adventure
              </button>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes worldFloat {
          0%, 100% { transform: translateY(0px) rotateY(0deg); }
          50% { transform: translateY(-15px) rotateY(3deg); }
        }
        
        @keyframes float {
          0%, 100% { 
            transform: translateY(0px) translateX(0px);
            opacity: 0.6;
          }
          50% { 
            transform: translateY(-20px) translateX(5px);
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
};

export default WorldsPage;