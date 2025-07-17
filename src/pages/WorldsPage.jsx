import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  Star, 
  Lock, 
  Play, 
  CheckCircle, 
  ArrowLeft, 
  Home, 
  Sparkles
} from 'lucide-react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from './firebase';
import { progressService } from '../services/progressService';

const WorldsPage = () => {
  const navigate = useNavigate();
  const [selectedWorld, setSelectedWorld] = useState(null);
  const [particles, setParticles] = useState([]);
  const [userProgress, setUserProgress] = useState(null);
  const [loading, setLoading] = useState(true);

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

    // Load user data and progress
    loadUserData();
  }, []);

  // Add effect to refresh data when user returns from a level
  useEffect(() => {
    const handleFocus = () => {
      loadUserData();
    };

    const handleStorageChange = () => {
      loadUserData();
    };

    const handleLevelCompleted = () => {
      loadUserData();
    };

    window.addEventListener('focus', handleFocus);
    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('levelCompleted', handleLevelCompleted);

    return () => {
      window.removeEventListener('focus', handleFocus);
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('levelCompleted', handleLevelCompleted);
    };
  }, []);

  const loadUserData = async () => {
    try {
      const userString = sessionStorage.getItem('user');
      if (!userString) {
        navigate('/login');
        return;
      }

      const user = JSON.parse(userString);

      // Load user progress from Firestore with migration check
      const progressData = await progressService.getDashboardData(user.uid);
      
      if (progressData) {
        setUserProgress(progressData);
      } else {
        // If no progress exists, initialize it
        const initialProgress = await progressService.initializeUserProgress(user.uid);
        setUserProgress(initialProgress);
      }
    } catch (error) {
      console.error('Error loading user data:', error);
      navigate('/login');
    } finally {
      setLoading(false);
    }
  };

  const getWorldsFromProgress = () => {
    if (!userProgress) return [];

    const worldsData = userProgress.worlds;
    return [
      {
        id: 1,
        name: worldsData.village.name,
        concept: "Variables",
        icon: "🏘️",
        color: "from-green-400 to-emerald-600",
        shadowColor: "shadow-green-500/50",
        unlocked: worldsData.village.unlocked,
        progress: worldsData.village.progress,
        description: "Learn the fundamentals of coding through village adventures",
        levels: Object.entries(worldsData.village.levels).map(([key, level]) => {
          const levelId = parseInt(key.replace('level', ''));
          let isUnlocked = false;
          
          // Level 1 is always unlocked if the world is unlocked
          if (key === 'level1' && worldsData.village.unlocked) {
            isUnlocked = true;
          }
          // Use the stored unlocked status if available
          else if (level.unlocked !== undefined) {
            isUnlocked = level.unlocked;
          }
          // If completed, it should be unlocked
          else if (level.completed) {
            isUnlocked = true;
          }
          
          console.log(`Village Level ${levelId}:`, { key, level, isUnlocked });
          return {
            ...level,
            id: levelId,
            name: level.name || `Level ${key.replace('level', '')}`,
            unlocked: isUnlocked
          };
        }),
        completed: worldsData.village.progress === 100
      },
      {
        id: 2,
        name: worldsData.forest.name,
        concept: "If/Else",
        icon: "🌲",
        color: "from-emerald-500 to-teal-700",
        shadowColor: "shadow-emerald-500/50",
        unlocked: worldsData.forest.unlocked,
        progress: worldsData.forest.progress,
        description: "Master conditional logic through mystical forest challenges",
        levels: Object.entries(worldsData.forest.levels).map(([key, level]) => {
          const levelId = parseInt(key.replace('level', ''));
          let isUnlocked = false;
          
          // Level 4 (first forest level) is unlocked if the forest world is unlocked
          if (key === 'level4' && worldsData.forest.unlocked) {
            isUnlocked = true;
          }
          // Use the stored unlocked status if available
          else if (level.unlocked !== undefined) {
            isUnlocked = level.unlocked;
          }
          // If completed, it should be unlocked
          else if (level.completed) {
            isUnlocked = true;
          }
          
          console.log(`Forest Level ${levelId}:`, { key, level, isUnlocked });
          return {
            ...level,
            id: levelId,
            name: level.name || `Level ${key.replace('level', '')}`,
            unlocked: isUnlocked
          };
        }),
        completed: worldsData.forest.progress === 100
      },
      {
        id: 3,
        name: worldsData.mountain.name,
        concept: "Loops",
        icon: "⛰️",
        color: "from-blue-500 to-indigo-600",
        shadowColor: "shadow-blue-500/50",
        unlocked: worldsData.mountain.unlocked,
        progress: worldsData.mountain.progress,
        description: "Conquer repetition and loops in the magical mountains",
        levels: Object.entries(worldsData.mountain.levels).map(([key, level]) => {
          const levelId = parseInt(key.replace('level', ''));
          let isUnlocked = false;
          
          // Level 7 (first mountain level) is unlocked if the mountain world is unlocked
          if (key === 'level7' && worldsData.mountain.unlocked) {
            isUnlocked = true;
          }
          // Use the stored unlocked status if available
          else if (level.unlocked !== undefined) {
            isUnlocked = level.unlocked;
          }
          // If completed, it should be unlocked
          else if (level.completed) {
            isUnlocked = true;
          }
          
          console.log(`Mountain Level ${levelId}:`, { key, level, isUnlocked });
          return {
            ...level,
            id: levelId,
            name: level.name || `Level ${key.replace('level', '')}`,
            unlocked: isUnlocked
          };
        }),
        completed: worldsData.mountain.progress === 100
      }
    ];
  };

  const handleLevelClick = (levelId, isUnlocked) => {
    console.log('Level click:', { levelId, isUnlocked });
    if (!isUnlocked) {
      console.log('Level is locked, cannot navigate');
      return;
    }
    console.log('Navigating to level:', levelId);
    navigate(`/level-${levelId}`);
  };

  const handleEnterWorld = (worldId) => {
    const worlds = getWorldsFromProgress();
    const world = worlds.find(w => w.id === worldId);
    
    if (!world || !world.unlocked) return;

    // Find the first unlocked level in the world
    const firstUnlockedLevel = world.levels.find(level => level.unlocked);
    if (firstUnlockedLevel) {
      navigate(`/level-${firstUnlockedLevel.id}`);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center">
        <div className="text-white text-center">
          <div className="animate-spin w-12 h-12 border-4 border-white border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-xl">Loading magical worlds...</p>
        </div>
      </div>
    );
  }

  const worlds = getWorldsFromProgress();
  const completedLevels = worlds.reduce((acc, world) => acc + world.levels.filter(l => l.completed).length, 0);
  const totalLevels = worlds.reduce((acc, world) => acc + world.levels.length, 0);
  const totalStars = worlds.reduce((acc, world) => acc + world.levels.reduce((starAcc, level) => starAcc + level.stars, 0), 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 relative overflow-hidden">
      {/* Floating Particles */}
      {particles.map((particle) => (
        <div
          key={particle.id}
          className="absolute w-1 h-1 bg-white rounded-full animate-pulse"
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            animationDelay: `${particle.delay}s`,
            animationDuration: `${particle.duration}s`
          }}
        />
      ))}

      {/* Navbar */}
      <div className="relative z-10 bg-black/20 backdrop-blur-sm border-b border-white/20 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Sparkles className="w-6 h-6 text-yellow-400" />
              <h1 className="text-2xl font-bold text-white">Worlds</h1>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <Link 
              to="/student-dashboard"
              className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors flex items-center space-x-2"
            >
              <Home className="w-4 h-4" />
              <span>Return Dashboard</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Header */}
      <div className="relative z-10 text-center pt-8 pb-8">
        <div className="flex items-center justify-center space-x-2 mb-4">
          <Sparkles className="w-8 h-8 text-yellow-400" />
          <h1 className="text-4xl font-bold text-white">Choose Your Adventure</h1>
          <Sparkles className="w-8 h-8 text-yellow-400" />
        </div>
        
        <p className="text-blue-200 text-lg max-w-2xl mx-auto px-4">
          Master programming concepts through magical quests!
        </p>
        
        {/* Progress Overview */}
        <div className="bg-white/10 backdrop-blur-sm rounded-3xl border border-white/20 p-6 max-w-4xl mx-auto mb-12 mt-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
            <div>
              <div className="text-3xl font-bold text-green-400">{completedLevels}</div>
              <div className="text-white font-medium">Levels Completed</div>
              <div className="text-blue-200 text-sm">out of {totalLevels} total</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-yellow-400">{totalStars}</div>
              <div className="text-white font-medium">Stars Earned</div>
              <div className="text-blue-200 text-sm">out of {totalLevels * 3} possible</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-purple-400">{worlds.filter(w => w.unlocked).length}</div>
              <div className="text-white font-medium">Worlds Unlocked</div>
              <div className="text-blue-200 text-sm">out of 3 magical realms</div>
            </div>
          </div>
        </div>
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
              className={`relative w-80 h-96 cursor-pointer transition-all duration-500 ${
                world.unlocked 
                  ? 'hover:scale-105 hover:shadow-2xl' 
                  : 'opacity-70 cursor-not-allowed'
              }`}
              onClick={() => world.unlocked && setSelectedWorld(world)}
            >
              {/* World Card */}
              <div className={`h-full bg-gradient-to-br ${world.color} rounded-3xl shadow-2xl ${world.shadowColor} border border-white/20 overflow-hidden`}>
                {/* Lock Overlay */}
                {!world.unlocked && (
                  <div className="absolute inset-0 bg-black/50 backdrop-blur-sm rounded-3xl flex items-center justify-center z-10">
                    <div className="text-center">
                      <Lock className="w-12 h-12 text-white mb-4 mx-auto" />
                      <div className="text-white font-bold text-lg">Locked</div>
                      <div className="text-white/80 text-sm">Complete previous world</div>
                    </div>
                  </div>
                )}

                {/* World Content */}
                <div className="p-6 h-full flex flex-col">
                  {/* World Header */}
                  <div className="text-center mb-4">
                    <div className="text-4xl mb-2">{world.icon}</div>
                    <h3 className="text-xl font-bold text-white">{world.name}</h3>
                    <div className="text-blue-200 text-sm">{world.concept}</div>
                  </div>

                  {/* Progress Bar */}
                  <div className="mb-4">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-white text-sm font-medium">Progress</span>
                      <span className="text-white text-sm">{world.progress}%</span>
                    </div>
                    <div className="w-full bg-white/20 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full transition-all duration-300 ${
                          world.completed 
                            ? 'bg-gradient-to-r from-yellow-400 to-yellow-500' 
                            : 'bg-gradient-to-r from-blue-400 to-purple-500'
                        }`}
                        style={{ width: `${world.progress}%` }}
                      />
                    </div>
                  </div>

                  {/* Completion Badge */}
                  {world.completed && (
                    <div className="flex items-center justify-center mb-4">
                      <div className="bg-yellow-400/20 border border-yellow-400/50 rounded-xl px-3 py-1 flex items-center space-x-2">
                        <CheckCircle className="w-4 h-4 text-yellow-400" />
                        <span className="text-yellow-200 text-sm font-medium">Completed</span>
                        <div className="animate-pulse">✨</div>
                      </div>
                    </div>
                  )}
                  
                  {/* Levels Preview */}
                  <div className="space-y-2 flex-1">
                    {world.levels.map((level) => (
                      <div 
                        key={level.id}
                        className={`relative group/level bg-white/10 backdrop-blur-sm rounded-lg p-2 mx-4 border transition-all duration-300 ${
                          level.unlocked 
                            ? 'border-white/30 hover:bg-white/20 cursor-pointer' 
                            : 'border-white/10 opacity-50'
                        } ${level.completed ? 'bg-green-500/20 border-green-400/50' : ''}`}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleLevelClick(level.id, level.unlocked);
                        }}
                      >
                        <div className="flex items-center justify-between text-sm">
                          <div className="flex items-center space-x-2">
                            {!level.unlocked && <Lock className="w-3 h-3 text-gray-400" />}
                            {level.completed && <CheckCircle className="w-3 h-3 text-green-400" />}
                            <span className={`font-medium ${level.completed ? 'text-green-200' : 'text-white'}`}>
                              {level.name}
                            </span>
                            {level.unlocked && !level.completed && (
                              <Play className="w-3 h-3 text-green-300 opacity-0 group-hover/level:opacity-100 transition-opacity" />
                            )}
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
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        handleEnterWorld(world.id);
                      }}
                      className={`mt-4 px-6 py-2 text-white font-bold rounded-xl hover:scale-105 transition-transform shadow-lg flex items-center space-x-2 mx-auto ${
                        world.completed 
                          ? 'bg-gradient-to-r from-yellow-400 to-yellow-500' 
                          : 'bg-gradient-to-r from-blue-400 to-purple-500'
                      }`}
                    >
                      <Play className="w-4 h-4" />
                      <span>Enter World</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* World Detail Modal */}
      {selectedWorld && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className={`bg-gradient-to-br ${selectedWorld.color} rounded-3xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto text-white shadow-2xl`}>
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-4">
                <div className="text-4xl">{selectedWorld.icon}</div>
                <div>
                  <h2 className="text-2xl font-bold">{selectedWorld.name}</h2>
                  <p className="text-blue-200">{selectedWorld.concept}</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedWorld(null)}
                className="text-white/80 hover:text-white transition-colors"
              >
                <ArrowLeft className="w-6 h-6" />
              </button>
            </div>
            
            <p className="text-white/90 mb-6">{selectedWorld.description}</p>
            
            <div className="mb-6">
              <div className="flex justify-between items-center mb-2">
                <span className="text-white font-medium">World Progress</span>
                <span className="text-white">{selectedWorld.progress}%</span>
              </div>
              <div className="w-full bg-white/20 rounded-full h-3">
                <div 
                  className={`h-3 rounded-full transition-all duration-300 ${
                    selectedWorld.completed 
                      ? 'bg-gradient-to-r from-yellow-400 to-yellow-500' 
                      : 'bg-gradient-to-r from-blue-400 to-purple-500'
                  }`}
                  style={{ width: `${selectedWorld.progress}%` }}
                />
              </div>
            </div>
            
            <div className="space-y-3 mb-6">
              <h4 className="text-lg font-bold text-white">Levels in this World:</h4>
              {selectedWorld.levels.map((level) => (
                <div 
                  key={level.id} 
                  className={`bg-white/5 rounded-xl p-4 border border-white/10 transition-all duration-200 ${
                    level.unlocked ? 'hover:bg-white/10 cursor-pointer' : ''
                  } ${level.completed ? 'bg-green-500/10 border-green-400/30' : ''}`}
                  onClick={() => level.unlocked && handleLevelClick(level.id, level.unlocked)}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="flex items-center space-x-2">
                        {!level.unlocked && <Lock className="w-4 h-4 text-gray-400" />}
                        {level.completed && <CheckCircle className="w-4 h-4 text-green-400" />}
                        <h5 className={`font-bold ${level.completed ? 'text-green-300' : 'text-white'}`}>
                          {level.name}
                        </h5>
                        {level.unlocked && !level.completed && (
                          <Play className="w-4 h-4 text-green-300" />
                        )}
                      </div>
                      <p className="text-blue-200 text-sm">
                        {level.completed ? 'Completed! Click to replay.' : level.unlocked ? 'Ready to play!' : 'Complete previous levels to unlock.'}
                      </p>
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
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            {selectedWorld.unlocked && (
              <button 
                onClick={() => handleEnterWorld(selectedWorld.id)}
                className={`w-full px-6 py-3 text-white font-bold rounded-xl hover:scale-105 transition-transform shadow-lg flex items-center justify-center space-x-2 ${
                  selectedWorld.completed 
                    ? 'bg-gradient-to-r from-yellow-400 to-yellow-500' 
                    : 'bg-gradient-to-r from-blue-400 to-purple-500'
                }`}
              >
                <Play className="w-5 h-5" />
                <span>Enter World</span>
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default WorldsPage;