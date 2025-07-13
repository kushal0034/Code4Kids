import React, { useState, useEffect } from 'react';
import { 
  Sparkles, 
  Home, 
  Map, 
  Trophy, 
  Settings, 
  LogOut, 
  User,
  BarChart3,
  Volume2,
  Star,
  Crown,
  Zap,
  BookOpen,
  Target,
  Award,
  Lock,
  Play,
  CheckCircle
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { signOut } from 'firebase/auth';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { auth, db } from './firebase';

const StudentDashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [userData, setUserData] = useState(null);
  const [userProgress, setUserProgress] = useState(null);
  const [loading, setLoading] = useState(true);

  const Link = ({ to, children, className, onClick }) => (
    <a href={to} className={className} onClick={onClick}>
      {children}
    </a>
  );

  // Initialize user progress structure
  const initializeUserProgress = async (userId) => {
    const defaultProgress = {
      userId: userId,
      currentLevel: 1,
      totalStars: 0,
      completedLevels: 0,
      currentStreak: 0,
      rank: "Novice Wizard",
      lastActiveDate: new Date().toISOString(),
      worlds: {
        village: {
          id: 1,
          name: "Village Basics",
          concept: "Variables",
          unlocked: true,
          progress: 0,
          levels: {
            level1: { id: 1, name: "Apple Collection", completed: false, stars: 0, unlocked: true },
            level2: { id: 2, name: "Message Delivery", completed: false, stars: 0, unlocked: false },
            level3: { id: 3, name: "Potion Ingredients", completed: false, stars: 0, unlocked: false }
          }
        },
        forest: {
          id: 2,
          name: "Forest Decisions",
          concept: "If/Else",
          unlocked: false,
          progress: 0,
          levels: {
            level4: { id: 4, name: "Weather Paths", completed: false, stars: 0, unlocked: false },
            level5: { id: 5, name: "Monster Spells", completed: false, stars: 0, unlocked: false },
            level6: { id: 6, name: "Villager Problems", completed: false, stars: 0, unlocked: false }
          }
        },
        mountain: {
          id: 3,
          name: "Mountain Challenges",
          concept: "Loops",
          unlocked: false,
          progress: 0,
          levels: {
            level7: { id: 7, name: "Bridge Crossing", completed: false, stars: 0, unlocked: false },
            level8: { id: 8, name: "Rock Clearing", completed: false, stars: 0, unlocked: false },
            level9: { id: 9, name: "Dragon Battle", completed: false, stars: 0, unlocked: false }
          }
        }
      },
      achievements: {
        firstSteps: { name: "First Steps", icon: "🌟", earned: false, description: "Complete your first level" },
        appleMaster: { name: "Apple Master", icon: "🍎", earned: false, description: "Perfect score in Apple Collection" },
        variableWizard: { name: "Variable Wizard", icon: "🧙‍♂️", earned: false, description: "Master all Variable levels" },
        decisionMaker: { name: "Decision Maker", icon: "🌲", earned: false, description: "Complete Forest World" }
      }
    };
    
    try {
      await setDoc(doc(db, 'userProgress', userId), defaultProgress);
      return defaultProgress;
    } catch (error) {
      console.error('Error initializing user progress:', error);
      return null;
    }
  };

  // Load user data and progress
  useEffect(() => {
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

        let progressData;
        if (progressSnap.exists()) {
          progressData = progressSnap.data();
        } else {
          // Initialize progress if it doesn't exist
          progressData = await initializeUserProgress(user.uid);
        }

        setUserProgress(progressData);
      } catch (error) {
        console.error('Error loading user data:', error);
        navigate('/login');
      } finally {
        setLoading(false);
      }
    };

    loadUserData();
  }, [navigate]);

  // Handle logout
  const handleLogout = async () => {
    try {
      await signOut(auth);
      sessionStorage.clear();
      navigate('/');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  // Handle level click
  const handleLevelClick = (levelId, isUnlocked) => {
    if (!isUnlocked || !levelId) return;
    
    navigate(`/level-${levelId}`);
  };

  // Handle world navigation
  const handleWorldNavigation = () => {
    navigate('/worlds');
  };

  // Calculate stats from user progress
  const calculateStats = () => {
    if (!userProgress) return { totalLevels: 9, completedLevels: 0, totalStars: 0, earnedStars: 0, currentStreak: 0, rank: "Novice Wizard" };

    const worlds = userProgress.worlds;
    let completedLevels = 0;
    let earnedStars = 0;

    Object.values(worlds).forEach(world => {
      Object.values(world.levels).forEach(level => {
        if (level.completed) completedLevels++;
        earnedStars += level.stars;
      });
    });

    return {
      totalLevels: 9,
      completedLevels,
      totalStars: 27, // 9 levels × 3 stars each
      earnedStars,
      currentStreak: userProgress.currentStreak || 0,
      rank: userProgress.rank || "Novice Wizard"
    };
  };

  // Format worlds data for display
  const getWorldsDisplay = () => {
    if (!userProgress) return [];

    const worldsData = userProgress.worlds;
    return [
      {
        id: 1,
        name: worldsData.village.name,
        concept: worldsData.village.concept,
        icon: "🏘️",
        color: "from-green-400 to-emerald-600",
        progress: worldsData.village.progress,
        unlocked: worldsData.village.unlocked,
        levels: Object.values(worldsData.village.levels)
      },
      {
        id: 2,
        name: worldsData.forest.name,
        concept: worldsData.forest.concept,
        icon: "🌲",
        color: "from-emerald-500 to-teal-700",
        progress: worldsData.forest.progress,
        unlocked: worldsData.forest.unlocked,
        levels: Object.values(worldsData.forest.levels)
      },
      {
        id: 3,
        name: worldsData.mountain.name,
        concept: worldsData.mountain.concept,
        icon: "⛰️",
        color: "from-blue-500 to-indigo-600",
        progress: worldsData.mountain.progress,
        unlocked: worldsData.mountain.unlocked,
        levels: Object.values(worldsData.mountain.levels)
      }
    ];
  };

  const sidebarItems = [
    { id: 'dashboard', icon: Home, label: 'Dashboard' },
    { id: 'adventure', icon: Map, label: 'Adventure', onClick: handleWorldNavigation },
    { id: 'achievements', icon: Trophy, label: 'Achievements' },
    { id: 'settings', icon: Settings, label: 'Settings' }
  ];

  const settingsSubItems = [
    { id: 'profile', icon: User, label: 'My Wizard' },
    { id: 'progress', icon: BarChart3, label: 'Progress' },
    { id: 'sound', icon: Volume2, label: 'Sound Settings' }
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-white border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <div className="text-white text-xl">Loading your magical dashboard...</div>
        </div>
      </div>
    );
  }

  const stats = calculateStats();
  const worldsDisplay = getWorldsDisplay();
  const achievements = userProgress?.achievements ? Object.values(userProgress.achievements) : [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
      {/* Sidebar */}
      <div className={`fixed left-0 top-0 h-full bg-slate-900/90 backdrop-blur-xl border-r border-white/10 transition-all duration-300 z-50 ${
        isSidebarOpen ? 'w-64' : 'w-16'
      }`}>
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="p-6 border-b border-white/10">
            <button onClick={() => navigate('/')} className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-xl flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              {isSidebarOpen && (
                <span className="text-xl font-bold text-white">Code4Kids</span>
              )}
            </button>
          </div>

          {/* User Profile */}
          {isSidebarOpen && userData && (
            <div className="p-4 border-b border-white/10">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-r from-purple-400 to-pink-500 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-lg">🧙‍♂️</span>
                </div>
                <div>
                  <div className="text-white font-medium">{userData.username}</div>
                  <div className="text-blue-200 text-sm">{stats.rank}</div>
                </div>
              </div>
            </div>
          )}

          {/* Navigation Items */}
          <nav className="flex-1 p-4 space-y-2">
            {sidebarItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    if (item.onClick) {
                      item.onClick();
                    } else {
                      setActiveTab(item.id);
                    }
                  }}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-300 ${
                    isActive 
                      ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white transform scale-105' 
                      : 'text-blue-100 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  {isSidebarOpen && <span className="font-medium">{item.label}</span>}
                </button>
              );
            })}

            {/* Settings Submenu */}
            {activeTab === 'settings' && isSidebarOpen && (
              <div className="ml-4 space-y-1 border-l-2 border-purple-400 pl-4">
                {settingsSubItems.map((subItem) => {
                  const SubIcon = subItem.icon;
                  return (
                    <button
                      key={subItem.id}
                      className="flex items-center space-x-3 px-3 py-2 text-blue-200 hover:text-white transition-colors"
                    >
                      <SubIcon className="w-4 h-4" />
                      <span className="text-sm">{subItem.label}</span>
                    </button>
                  );
                })}
              </div>
            )}
          </nav>

          {/* Logout */}
          <div className="p-4 border-t border-white/10">
            <button
              onClick={handleLogout}
              className="w-full flex items-center space-x-3 px-4 py-3 text-red-300 hover:bg-red-500/20 rounded-xl transition-all duration-300"
            >
              <LogOut className="w-5 h-5" />
              {isSidebarOpen && <span className="font-medium">Logout</span>}
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className={`transition-all duration-300 ${isSidebarOpen ? 'ml-64' : 'ml-16'}`}>
        {/* Header */}
        <header className="bg-white/5 backdrop-blur-sm border-b border-white/10 p-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white">
                Welcome back, {userData?.username || 'Young Wizard'}!
              </h1>
              <p className="text-blue-200 mt-1">Continue your magical coding adventure</p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="bg-gradient-to-r from-yellow-400 to-orange-500 px-4 py-2 rounded-xl">
                <span className="text-white font-bold flex items-center space-x-1">
                  <Crown className="w-4 h-4" />
                  <span>{stats.rank}</span>
                </span>
              </div>
              <div className="text-right">
                <div className="text-white font-bold">Level Progress</div>
                <div className="text-blue-200 text-sm">{stats.completedLevels}/{stats.totalLevels} Levels</div>
              </div>
            </div>
          </div>
        </header>

        {/* Dashboard Content */}
        <main className="p-6">
          {activeTab === 'dashboard' && (
            <div className="space-y-8">
              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="bg-white/10 backdrop-blur-sm rounded-3xl p-6 border border-white/20">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-green-400 to-emerald-500 rounded-2xl flex items-center justify-center">
                      <Target className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-white">{stats.completedLevels}</div>
                      <div className="text-blue-200 text-sm">Levels Complete</div>
                    </div>
                  </div>
                </div>

                <div className="bg-white/10 backdrop-blur-sm rounded-3xl p-6 border border-white/20">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-2xl flex items-center justify-center">
                      <Star className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-white">{stats.earnedStars}</div>
                      <div className="text-blue-200 text-sm">Stars Earned</div>
                    </div>
                  </div>
                </div>

                <div className="bg-white/10 backdrop-blur-sm rounded-3xl p-6 border border-white/20">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-purple-400 to-pink-500 rounded-2xl flex items-center justify-center">
                      <Zap className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-white">{stats.currentStreak}</div>
                      <div className="text-blue-200 text-sm">Day Streak</div>
                    </div>
                  </div>
                </div>

                <div className="bg-white/10 backdrop-blur-sm rounded-3xl p-6 border border-white/20">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-blue-400 to-indigo-500 rounded-2xl flex items-center justify-center">
                      <Crown className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <div className="text-lg font-bold text-white">
                        {stats.rank.split(' ')[0]}
                      </div>
                      <div className="text-blue-200 text-sm">Current Rank</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Worlds Grid */}
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-white">Your Magical Worlds</h2>
                  <button
                    onClick={handleWorldNavigation}
                    className="px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl hover:scale-105 transition-transform flex items-center space-x-2"
                  >
                    <Map className="w-4 h-4" />
                    <span>Explore Worlds</span>
                  </button>
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {worldsDisplay.map((world) => (
                    <div key={world.id} className={`relative rounded-3xl p-6 text-white overflow-hidden group transition-all duration-300 ${
                      world.unlocked 
                        ? `bg-gradient-to-br ${world.color} hover:scale-105 cursor-pointer`
                        : 'bg-gradient-to-br from-gray-600 to-gray-700 opacity-60'
                    }`}>
                      {!world.unlocked && (
                        <div className="absolute top-4 right-4 w-8 h-8 bg-red-500 rounded-full flex items-center justify-center">
                          <Lock className="w-4 h-4 text-white" />
                        </div>
                      )}
                      
                      <div className="relative z-10">
                        <div className="flex items-center space-x-3 mb-4">
                          <span className="text-4xl">{world.icon}</span>
                          <div>
                            <h3 className="text-xl font-bold">{world.name}</h3>
                            <p className="text-white/80 text-sm">{world.concept}</p>
                          </div>
                        </div>
                        
                        <div className="mb-4">
                          <div className="flex justify-between text-sm mb-2">
                            <span>Progress</span>
                            <span>{world.progress}%</span>
                          </div>
                          <div className="w-full bg-white/20 rounded-full h-2">
                            <div 
                              className="bg-white rounded-full h-2 transition-all duration-500"
                              style={{ width: `${world.progress}%` }}
                            ></div>
                          </div>
                        </div>

                        <div className="space-y-2">
                          {world.levels.map((level) => (
                            <div 
                              key={level.id} 
                              className={`flex items-center justify-between bg-white/10 rounded-lg p-2 transition-all duration-200 ${
                                level.unlocked ? 'hover:bg-white/20 cursor-pointer' : 'opacity-50'
                              }`}
                              onClick={() => handleLevelClick(level.id, level.unlocked)}
                            >
                              <div className="flex items-center space-x-2">
                                {!level.unlocked && <Lock className="w-3 h-3" />}
                                <span className="text-sm">{level.name}</span>
                                {level.unlocked && !level.completed && (
                                  <Play className="w-3 h-3 text-green-300" />
                                )}
                              </div>
                              <div className="flex items-center space-x-1">
                                {[...Array(3)].map((_, i) => (
                                  <Star 
                                    key={i} 
                                    className={`w-4 h-4 ${i < level.stars ? 'text-yellow-400 fill-current' : 'text-white/30'}`}
                                  />
                                ))}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                      
                      <div className="absolute -top-4 -right-4 w-24 h-24 bg-white/10 rounded-full"></div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Adventure Tab */}
          {activeTab === 'adventure' && (
            <div className="space-y-8">
              <div className="text-center">
                <h2 className="text-4xl font-bold text-white mb-4">Choose Your Adventure!</h2>
                <p className="text-blue-200 text-xl mb-8">Select a magical world to continue your coding quest</p>
              </div>
              
              {/* Quick Stats */}
              <div className="bg-white/10 backdrop-blur-sm rounded-3xl border border-white/20 p-6">
                <div className="grid grid-cols-3 gap-6 text-center">
                  <div>
                    <div className="text-2xl font-bold text-green-400">{worldsDisplay.filter(w => w.unlocked).length}</div>
                    <div className="text-white/60 text-sm">Worlds Unlocked</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-yellow-400">
                      {worldsDisplay.reduce((total, world) => total + world.levels.filter(l => l.completed).length, 0)}
                    </div>
                    <div className="text-white/60 text-sm">Levels Completed</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-blue-400">
                      {worldsDisplay.reduce((total, world) => total + world.levels.reduce((sum, l) => sum + l.stars, 0), 0)}
                    </div>
                    <div className="text-white/60 text-sm">Total Stars</div>
                  </div>
                </div>
              </div>
              
              {/* World Selection */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {worldsDisplay.map((world) => (
                  <div key={world.id} className={`relative rounded-3xl p-6 text-white overflow-hidden group transition-all duration-300 ${
                    world.unlocked 
                      ? `bg-gradient-to-br ${world.color} hover:scale-105 cursor-pointer`
                      : 'bg-gradient-to-br from-gray-600 to-gray-700 opacity-60'
                  }`}>
                    {!world.unlocked && (
                      <div className="absolute top-4 right-4 w-8 h-8 bg-red-500 rounded-full flex items-center justify-center">
                        <Lock className="w-4 h-4 text-white" />
                      </div>
                    )}
                    
                    {world.progress === 100 && (
                      <div className="absolute top-4 right-4 w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center animate-pulse">
                        <Crown className="w-4 h-4 text-white" />
                      </div>
                    )}
                    
                    <div className="relative z-10">
                      <div className="flex items-center space-x-3 mb-4">
                        <span className="text-4xl">{world.icon}</span>
                        <div>
                          <h3 className="text-xl font-bold">{world.name}</h3>
                          <p className="text-white/80 text-sm">{world.concept}</p>
                        </div>
                      </div>
                      
                      <div className="mb-4">
                        <div className="flex justify-between text-sm mb-2">
                          <span>Progress</span>
                          <span>{world.progress}%</span>
                        </div>
                        <div className="w-full bg-white/20 rounded-full h-2">
                          <div 
                            className={`h-2 rounded-full transition-all duration-500 ${
                              world.progress === 100 
                                ? 'bg-gradient-to-r from-yellow-400 to-yellow-500' 
                                : 'bg-white'
                            }`}
                            style={{ width: `${world.progress}%` }}
                          ></div>
                        </div>
                        {world.progress === 100 && (
                          <div className="text-yellow-200 text-xs mt-1 font-bold text-center">✨ Complete! ✨</div>
                        )}
                      </div>

                      <div className="space-y-2 mb-4">
                        {world.levels.slice(0, 2).map((level) => (
                          <div key={level.id} className="flex items-center justify-between bg-white/10 rounded-lg p-2">
                            <div className="flex items-center space-x-2">
                              {!level.unlocked && <Lock className="w-3 h-3" />}
                              {level.completed && <CheckCircle className="w-3 h-3 text-green-400" />}
                              <span className={`text-sm ${level.completed ? 'text-green-200' : 'text-white'}`}>
                                {level.name}
                              </span>
                            </div>
                            <div className="flex items-center space-x-1">
                              {[...Array(3)].map((_, i) => (
                                <Star 
                                  key={i} 
                                  className={`w-3 h-3 ${i < level.stars ? 'text-yellow-400 fill-current' : 'text-white/30'}`}
                                />
                              ))}
                            </div>
                          </div>
                        ))}
                        {world.levels.length > 2 && (
                          <div className="text-center text-xs text-white/60">
                            +{world.levels.length - 2} more levels
                          </div>
                        )}
                      </div>
                      
                      {world.unlocked ? (
                        <button 
                          onClick={() => {
                            const nextLevel = world.levels.find(l => l.unlocked && !l.completed);
                            const levelToPlay = nextLevel || world.levels.find(l => l.unlocked);
                            if (levelToPlay) {
                              handleLevelClick(levelToPlay.id, true);
                            }
                          }}
                          className={`w-full py-2 px-4 rounded-xl font-bold transition-transform hover:scale-105 flex items-center justify-center space-x-2 ${
                            world.progress === 100 
                              ? 'bg-gradient-to-r from-yellow-500 to-yellow-600 text-white' 
                              : 'bg-gradient-to-r from-purple-500 to-pink-500 text-white'
                          }`}
                        >
                          <Play className="w-4 h-4" />
                          <span>{world.progress === 100 ? 'Replay World' : 'Continue Adventure'}</span>
                        </button>
                      ) : (
                        <div className="w-full py-2 px-4 bg-white/10 text-white/60 rounded-xl text-center text-sm">
                          Complete previous world to unlock
                        </div>
                      )}
                    </div>
                    
                    <div className="absolute -top-4 -right-4 w-24 h-24 bg-white/10 rounded-full"></div>
                  </div>
                ))}
              </div>
              
              {/* Action Buttons */}
              <div className="text-center space-y-4">
                <button 
                  onClick={handleWorldNavigation}
                  className="px-8 py-4 bg-gradient-to-r from-green-400 to-blue-500 text-white font-bold rounded-2xl hover:scale-105 transition-transform flex items-center space-x-2 mx-auto"
                >
                  <Map className="w-5 h-5" />
                  <span>Explore All Worlds</span>
                </button>
                
                <p className="text-blue-200 text-sm">
                  Visit the worlds page to see detailed level information and progress
                </p>
              </div>
            </div>
          )}

          {/* Achievements Tab */}
          {activeTab === 'achievements' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-3xl font-bold text-white">Your Magical Achievements</h2>
                <div className="text-right">
                  <div className="text-white font-bold">
                    {achievements.filter(a => a.earned).length}/{achievements.length} Unlocked
                  </div>
                  <div className="text-blue-200 text-sm">Keep coding to unlock more!</div>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {achievements.map((achievement, index) => (
                  <div key={index} className={`p-6 rounded-3xl border transition-all duration-300 transform hover:scale-105 ${
                    achievement.earned 
                      ? 'bg-gradient-to-r from-green-500/20 to-emerald-500/20 border-green-400/30 shadow-lg shadow-green-500/25' 
                      : 'bg-white/5 border-white/10 hover:bg-white/10'
                  }`}>
                    <div className="text-center">
                      <div className={`text-6xl mb-4 ${achievement.earned ? 'animate-bounce' : ''}`}>
                        {achievement.icon}
                      </div>
                      <h3 className={`text-xl font-bold mb-2 ${achievement.earned ? 'text-green-300' : 'text-white/60'}`}>
                        {achievement.name}
                      </h3>
                      <p className={`${achievement.earned ? 'text-green-200' : 'text-white/40'}`}>
                        {achievement.description}
                      </p>
                      {achievement.earned ? (
                        <div className="mt-4">
                          <span className="inline-flex items-center space-x-2 bg-green-500/20 text-green-300 px-3 py-2 rounded-full text-sm">
                            <CheckCircle className="w-4 h-4" />
                            <span>Achievement Unlocked!</span>
                          </span>
                        </div>
                      ) : (
                        <div className="mt-4">
                          <span className="inline-flex items-center space-x-2 bg-white/10 text-white/60 px-3 py-2 rounded-full text-sm">
                            <Lock className="w-4 h-4" />
                            <span>Keep Learning</span>
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
              
              {/* Achievement Progress */}
              <div className="bg-white/10 backdrop-blur-sm rounded-3xl border border-white/20 p-6">
                <h3 className="text-xl font-bold text-white mb-4">Achievement Progress</h3>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm text-white mb-2">
                      <span>Overall Progress</span>
                      <span>{achievements.filter(a => a.earned).length}/{achievements.length}</span>
                    </div>
                    <div className="w-full bg-white/20 rounded-full h-3">
                      <div 
                        className="bg-gradient-to-r from-green-400 to-emerald-500 h-3 rounded-full transition-all duration-1000"
                        style={{ width: `${(achievements.filter(a => a.earned).length / achievements.length) * 100}%` }}
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 text-center">
                    <div className="bg-white/5 rounded-xl p-4">
                      <div className="text-2xl font-bold text-green-400">
                        {achievements.filter(a => a.earned).length}
                      </div>
                      <div className="text-sm text-white/60">Earned</div>
                    </div>
                    <div className="bg-white/5 rounded-xl p-4">
                      <div className="text-2xl font-bold text-blue-400">
                        {achievements.filter(a => !a.earned).length}
                      </div>
                      <div className="text-sm text-white/60">Remaining</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Settings Tab */}
          {activeTab === 'settings' && (
            <div className="text-center py-20">
              <div className="text-6xl mb-6">⚙️</div>
              <h2 className="text-3xl font-bold text-white mb-4">Wizard Settings</h2>
              <p className="text-blue-200">Customize your magical experience</p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default StudentDashboard;