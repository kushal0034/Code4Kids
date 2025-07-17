import React, { useState, useEffect } from 'react';
import { useNavigate, Routes, Route, BrowserRouter } from 'react-router-dom';
import { 
  Star, 
  Lock, 
  Play, 
  CheckCircle, 
  ArrowLeft, 
  Home, 
  Trophy,
  Clock,
  Target,
  Sparkles
} from 'lucide-react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../pages/firebase';
import { progressService } from '../services/progressService';

// Worlds Page Component
const WorldsPage = () => {
  const navigate = useNavigate();
  const [selectedWorld, setSelectedWorld] = useState(null);
  const [particles, setParticles] = useState([]);
  const [userProgress, setUserProgress] = useState(null);
  const [userData, setUserData] = useState(null);
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

  const loadUserData = async () => {
    try {
      const userString = sessionStorage.getItem('user');
      if (!userString) {
        navigate('/login');
        return;
      }

      const user = JSON.parse(userString);
      setUserData(user);

      // Load user progress from Firestore
      const progressRef = doc(db, 'userProgress', user.uid);
      const progressSnap = await getDoc(progressRef);

      if (progressSnap.exists()) {
        setUserProgress(progressSnap.data());
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
        levels: Object.entries(worldsData.village.levels).map(([key, level]) => ({
          ...level,
          id: parseInt(key.replace('level', '')),
          name: level.name || `Level ${key.replace('level', '')}`,
          unlocked: level.unlocked || (key === 'level1' && worldsData.village.unlocked)
        })),
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
        levels: Object.entries(worldsData.forest.levels).map(([key, level]) => ({
          ...level,
          id: parseInt(key.replace('level', '')),
          name: level.name || `Level ${key.replace('level', '')}`,
          unlocked: level.unlocked || false
        })),
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
        levels: Object.entries(worldsData.mountain.levels).map(([key, level]) => ({
          ...level,
          id: parseInt(key.replace('level', '')),
          name: level.name || `Level ${key.replace('level', '')}`,
          unlocked: level.unlocked || false
        })),
        completed: worldsData.mountain.progress === 100
      }
    ];
  };

  const handleLevelClick = (levelId, isUnlocked) => {
    if (!isUnlocked) return;
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

      {/* Header */}
      <div className="relative z-10 text-center pt-12 pb-8">
        <div className="flex items-center justify-center space-x-2 mb-4">
          <button
            onClick={() => navigate('/student-dashboard')}
            className="text-white/80 hover:text-white transition-colors"
          >
            <Home className="w-6 h-6" />
          </button>
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

// Individual Level Component
const LevelPage = ({ levelId }) => {
  const navigate = useNavigate();
  const [gameStarted, setGameStarted] = useState(false);
  const [gameCompleted, setGameCompleted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [levelData, setLevelData] = useState(null);
  const [timeSpent, setTimeSpent] = useState(0);
  const [startTime, setStartTime] = useState(null);
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    loadLevelData();
  }, [levelId]);

  useEffect(() => {
    let interval;
    if (gameStarted && !gameCompleted) {
      interval = setInterval(() => {
        setTimeSpent(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [gameStarted, gameCompleted]);

  const loadLevelData = async () => {
    try {
      const userString = sessionStorage.getItem('user');
      if (!userString) {
        navigate('/login');
        return;
      }

      const user = JSON.parse(userString);
      setUserData(user);

      const progress = await progressService.getUserProgress(user.uid);
      if (!progress) {
        navigate('/student-dashboard');
        return;
      }

      // Find level data across all worlds
      const allLevels = [];
      Object.values(progress.worlds).forEach(world => {
        Object.entries(world.levels).forEach(([key, level]) => {
          allLevels.push({
            ...level,
            id: parseInt(key.replace('level', '')),
            name: level.name || `Level ${key.replace('level', '')}`
          });
        });
      });

      const level = allLevels.find(l => l.id === parseInt(levelId));
      if (!level) {
        navigate('/worlds');
        return;
      }

      setLevelData(level);
    } catch (error) {
      console.error('Error loading level:', error);
      navigate('/worlds');
    }
  };

  const startGame = () => {
    setGameStarted(true);
    setStartTime(Date.now());
  };

  const completeLevel = async (stars = 3) => {
    setIsLoading(true);
    try {
      const result = await progressService.recordLevelAttempt(
        parseInt(levelId), 
        true, 
        stars, 
        timeSpent
      );
      
      if (result.success) {
        setGameCompleted(true);
        // Show completion animation for 3 seconds then navigate back
        setTimeout(() => {
          navigate('/worlds');
        }, 3000);
      }
    } catch (error) {
      console.error('Error completing level:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (!levelData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 to-blue-900 flex items-center justify-center">
        <div className="text-white text-center">
          <div className="animate-spin w-12 h-12 border-4 border-white border-t-transparent rounded-full mx-auto mb-4"></div>
          <p>Loading level...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-800 via-green-700 to-emerald-800 relative overflow-hidden">
      {/* Loading Overlay */}
      {isLoading && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center">
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 text-center">
            <div className="w-12 h-12 border-4 border-white border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <div className="text-white font-bold">Saving Progress...</div>
          </div>
        </div>
      )}

      {/* Completion Modal */}
      {gameCompleted && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-gradient-to-br from-green-600 to-emerald-700 rounded-3xl p-8 max-w-md w-full text-white text-center shadow-2xl">
            <div className="text-6xl mb-4">🎉</div>
            <h2 className="text-3xl font-bold mb-4">Level Complete!</h2>
            
            <div className="space-y-4 mb-6">
              <div className="flex items-center justify-center space-x-1">
                {[...Array(3)].map((_, i) => (
                  <Star key={i} className="w-8 h-8 text-yellow-400 fill-current" />
                ))}
              </div>
              
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="bg-white/10 rounded-lg p-3">
                  <Clock className="w-5 h-5 mx-auto mb-1" />
                  <div className="font-bold">{formatTime(timeSpent)}</div>
                  <div className="opacity-80">Time</div>
                </div>
                <div className="bg-white/10 rounded-lg p-3">
                  <Trophy className="w-5 h-5 mx-auto mb-1" />
                  <div className="font-bold">3/3</div>
                  <div className="opacity-80">Stars</div>
                </div>
              </div>
            </div>
            
            <div className="text-sm opacity-80 mb-4">
              Returning to worlds in 3 seconds...
            </div>
            
            <button
              onClick={() => navigate('/worlds')}
              className="bg-white/20 hover:bg-white/30 px-6 py-2 rounded-lg transition-colors"
            >
              Return to Worlds
            </button>
          </div>
        </div>
      )}

      {/* Level Header */}
      <div className="relative z-10 bg-black/20 backdrop-blur-sm border-b border-white/10">
        <div className="max-w-4xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate('/worlds')}
                className="text-white/80 hover:text-white transition-colors"
              >
                <ArrowLeft className="w-6 h-6" />
              </button>
              <div>
                <h1 className="text-2xl font-bold text-white">{levelData.name}</h1>
                <p className="text-blue-200">Level {levelId}</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-1">
                {[...Array(3)].map((_, i) => (
                  <Star 
                    key={i} 
                    className={`w-5 h-5 ${
                      i < levelData.stars 
                        ? 'text-yellow-400 fill-current' 
                        : 'text-white/30'
                    }`}
                  />
                ))}
              </div>
              
              <div className="text-white">
                <Clock className="w-5 h-5 inline mr-1" />
                {formatTime(timeSpent)}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Level Content */}
      <div className="relative z-10 max-w-4xl mx-auto px-6 py-8">
        <div className="bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20 p-8 text-center">
          <div className="text-6xl mb-6">🎮</div>
          <h2 className="text-3xl font-bold text-white mb-4">
            {gameStarted ? 'Game in Progress' : 'Ready to Start?'}
          </h2>
          
          {!gameStarted && (
            <div className="space-y-4">
              <p className="text-blue-200 text-lg">
                Click the button below to begin your adventure
              </p>
              <button
                onClick={startGame}
                className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-bold py-3 px-8 rounded-xl transition-all duration-200 transform hover:scale-105 shadow-lg"
              >
                <Play className="w-5 h-5 inline mr-2" />
                Start Level
              </button>
            </div>
          )}
          
          {gameStarted && !gameCompleted && (
            <div className="space-y-6">
              <p className="text-blue-200 text-lg">
                Complete the coding challenge to finish this level!
              </p>
              
              {/* Game simulation area */}
              <div className="bg-black/20 rounded-xl p-6 border border-white/10">
                <div className="text-white text-left">
                  <h3 className="text-lg font-bold mb-4">Game Area</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                      <span>Drag code blocks here</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-blue-400 rounded-full"></div>
                      <span>Execute your code</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-purple-400 rounded-full"></div>
                      <span>See results</span>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Simulation buttons */}
              <div className="flex justify-center space-x-4">
                <button
                  onClick={() => completeLevel(1)}
                  className="bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-2 px-6 rounded-lg transition-colors"
                >
                  Complete (1 Star)
                </button>
                <button
                  onClick={() => completeLevel(2)}
                  className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-2 px-6 rounded-lg transition-colors"
                >
                  Complete (2 Stars)
                </button>
                <button
                  onClick={() => completeLevel(3)}
                  className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-6 rounded-lg transition-colors"
                >
                  Complete (3 Stars)
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Main App Component with Routing
const WorldsLevelsApp = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/worlds" element={<WorldsPage />} />
        <Route path="/level-:levelId" element={<LevelPageWrapper />} />
      </Routes>
    </BrowserRouter>
  );
};

// Wrapper component to pass levelId as prop
const LevelPageWrapper = () => {
  const navigate = useNavigate();
  const levelId = window.location.pathname.split('/level-')[1];
  
  if (!levelId) {
    navigate('/worlds');
    return null;
  }
  
  return <LevelPage levelId={levelId} />;
};

export default WorldsLevelsApp;