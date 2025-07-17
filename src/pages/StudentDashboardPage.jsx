import React, { useState, useEffect } from 'react';
import { 
  Sparkles, 
  Home, 
  Map, 
  Trophy, 
  Settings, 
  LogOut, 
  User,
  Volume2,
  Star,
  Crown,
  Zap,
  BookOpen,
  Target,
  Lock,
  Play
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { progressService } from '../services/progressService';

const StudentDashboard = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [userData, setUserData] = useState(null);
  const [progressData, setProgressData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {
      setLoading(true);
      const user = progressService.getCurrentUser();
      
      if (!user) {
        navigate('/login');
        return;
      }

      setUserData(user);
      
      const progress = await progressService.getDashboardData(user.uid);
      
      console.log('Loaded progress data:', progress);
      console.log('Achievements in progress:', progress?.achievements);
      
      setProgressData(progress);
      
    } catch (err) {
      console.error('Error loading user data:', err);
      setError(`Failed to load user data: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const sidebarItems = [
    { id: 'logo', type: 'logo' },
    { id: 'dashboard', icon: Home, label: 'Dashboard', path: '/student-dashboard' },
    { id: 'adventure', icon: Map, label: 'Adventure', path: '/worlds' },
    { id: 'achievements', icon: Trophy, label: 'Achievements', path: '/achievements' },
    { id: 'settings', icon: Settings, label: 'Settings', path: '/settings' },
    { id: 'logout', icon: LogOut, label: 'Logout', path: '/logout', type: 'logout' }
  ];

  const getWorldsData = () => {
    if (!progressData || !progressData.worlds) {
      return [
        {
          id: 1,
          name: "Village Basics",
          concept: "Variables",
          icon: "🏘️",
          color: "from-green-400 to-emerald-600",
          progress: 0,
          unlocked: true,
          levels: [
            { id: 1, name: "Apple Counting", completed: false, stars: 0, unlocked: true },
            { id: 2, name: "Message Delivery", completed: false, stars: 0, unlocked: false },
            { id: 3, name: "Potion Making", completed: false, stars: 0, unlocked: false }
          ]
        },
        {
          id: 2,
          name: "Forest Decisions",
          concept: "If/Else",
          icon: "🌲",
          color: "from-emerald-500 to-teal-700",
          progress: 0,
          unlocked: false,
          levels: [
            { id: 4, name: "Weather Paths", completed: false, stars: 0, unlocked: false },
            { id: 5, name: "Monster Spells", completed: false, stars: 0, unlocked: false },
            { id: 6, name: "Villager Problems", completed: false, stars: 0, unlocked: false }
          ]
        },
        {
          id: 3,
          name: "Mountain Challenges",
          concept: "Loops",
          icon: "⛰️",
          color: "from-blue-500 to-indigo-600",
          progress: 0,
          unlocked: false,
          levels: [
            { id: 7, name: "Bridge Crossing", completed: false, stars: 0, unlocked: false },
            { id: 8, name: "Rock Clearing", completed: false, stars: 0, unlocked: false },
            { id: 9, name: "Dragon Battle", completed: false, stars: 0, unlocked: false }
          ]
        }
      ];
    }

    return [
      {
        id: 1,
        name: "Village Basics",
        concept: "Variables",
        icon: "🏘️",
        color: "from-green-400 to-emerald-600",
        progress: progressData.worlds.village?.progress || 0,
        unlocked: progressData.worlds.village?.unlocked || true,
        levels: [
          { 
            id: 1, 
            name: "Apple Counting", 
            completed: progressData.worlds.village?.levels?.level1?.completed || false, 
            stars: progressData.worlds.village?.levels?.level1?.stars || 0,
            unlocked: progressData.worlds.village?.unlocked || true
          },
          { 
            id: 2, 
            name: "Message Delivery", 
            completed: progressData.worlds.village?.levels?.level2?.completed || false, 
            stars: progressData.worlds.village?.levels?.level2?.stars || 0,
            unlocked: progressData.worlds.village?.levels?.level1?.completed || false
          },
          { 
            id: 3, 
            name: "Potion Making", 
            completed: progressData.worlds.village?.levels?.level3?.completed || false, 
            stars: progressData.worlds.village?.levels?.level3?.stars || 0,
            unlocked: progressData.worlds.village?.levels?.level2?.completed || false
          }
        ]
      },
      {
        id: 2,
        name: "Forest Decisions",
        concept: "If/Else",
        icon: "🌲",
        color: "from-emerald-500 to-teal-700",
        progress: progressData.worlds.forest?.progress || 0,
        unlocked: progressData.worlds.forest?.unlocked || false,
        levels: [
          { 
            id: 4, 
            name: "Weather Paths", 
            completed: progressData.worlds.forest?.levels?.level4?.completed || false, 
            stars: progressData.worlds.forest?.levels?.level4?.stars || 0,
            unlocked: progressData.worlds.forest?.unlocked || false
          },
          { 
            id: 5, 
            name: "Monster Spells", 
            completed: progressData.worlds.forest?.levels?.level5?.completed || false, 
            stars: progressData.worlds.forest?.levels?.level5?.stars || 0,
            unlocked: progressData.worlds.forest?.levels?.level4?.completed || false
          },
          { 
            id: 6, 
            name: "Villager Problems", 
            completed: progressData.worlds.forest?.levels?.level6?.completed || false, 
            stars: progressData.worlds.forest?.levels?.level6?.stars || 0,
            unlocked: progressData.worlds.forest?.levels?.level5?.completed || false
          }
        ]
      },
      {
        id: 3,
        name: "Mountain Challenges",
        concept: "Loops",
        icon: "⛰️",
        color: "from-blue-500 to-indigo-600",
        progress: progressData.worlds.mountain?.progress || 0,
        unlocked: progressData.worlds.mountain?.unlocked || false,
        levels: [
          { 
            id: 7, 
            name: "Bridge Crossing", 
            completed: progressData.worlds.mountain?.levels?.level7?.completed || false, 
            stars: progressData.worlds.mountain?.levels?.level7?.stars || 0,
            unlocked: progressData.worlds.mountain?.unlocked || false
          },
          { 
            id: 8, 
            name: "Rock Clearing", 
            completed: progressData.worlds.mountain?.levels?.level8?.completed || false, 
            stars: progressData.worlds.mountain?.levels?.level8?.stars || 0,
            unlocked: progressData.worlds.mountain?.levels?.level7?.completed || false
          },
          { 
            id: 9, 
            name: "Dragon Battle", 
            completed: progressData.worlds.mountain?.levels?.level9?.completed || false, 
            stars: progressData.worlds.mountain?.levels?.level9?.stars || 0,
            unlocked: progressData.worlds.mountain?.levels?.level8?.completed || false
          }
        ]
      }
    ];
  };

  const getAchievements = () => {
    const allAchievements = [
      { id: 'first-level', name: 'First Steps', description: 'Complete your first level', icon: '🎯' },
      { id: 'perfect-score', name: 'Perfect Score', description: 'Get 3 stars on a level', icon: '⭐' },
      { id: 'world-champion', name: 'World Champion', description: 'Complete an entire world', icon: '🏆' },
      { id: 'code-master', name: 'Code Master', description: 'Complete all levels', icon: '🧙‍♂️' },
      { id: 'speed-runner', name: 'Speed Runner', description: 'Complete a level in under 60 seconds', icon: '⚡' },
      { id: 'problem-solver', name: 'Problem Solver', description: 'Complete 5 levels', icon: '🧩' }
    ];

    const earnedAchievements = progressData?.achievements || [];
    const earnedIds = Array.isArray(earnedAchievements) 
      ? earnedAchievements.map(achievement => achievement.id || achievement)
      : [];

    return allAchievements.map(achievement => ({
      ...achievement,
      earned: earnedIds.includes(achievement.id)
    }));
  };

  const getStats = () => {
    if (!progressData) {
      return {
        totalLevels: 9,
        completedLevels: 0,
        totalStars: 27,
        earnedStars: 0,
        currentStreak: 0,
        rank: "Novice Wizard"
      };
    }

    return {
      totalLevels: 9,
      completedLevels: progressData.totalLevelsCompleted || 0,
      totalStars: progressData.totalStars || 0,
      currentStreak: progressData.currentStreak || 0,
      rank: progressData.rank || "Novice Wizard"
    };
  };

  const handleLogout = () => {
    sessionStorage.clear();
    navigate('/login');
  };

  const getLevelPath = (levelId) => {
    const levelPaths = {
      1: '/level-1', 2: '/level-2', 3: '/level-3',
      4: '/level-4', 5: '/level-5', 6: '/level-6',
      7: '/level-7', 8: '/level-8', 9: '/level-9'
    };
    return levelPaths[levelId] || '/worlds';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-white border-t-transparent rounded-full animate-spin mb-4"></div>
          <div className="text-white text-xl">Loading your magical progress...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">❌</div>
          <div className="text-white text-xl mb-4">Error loading data</div>
          <button 
            onClick={loadUserData}
            className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  const worlds = getWorldsData();
  const achievements = getAchievements();
  const stats = getStats();

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 text-white">
      {/* Sidebar */}
      <div className={`fixed left-0 top-0 h-full bg-slate-900/90 backdrop-blur-xl border-r border-white/10 transition-all duration-300 z-50 ${
        isSidebarOpen ? 'w-64' : 'w-16'
      }`}>
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="p-4 border-b border-white/10 flex items-center justify-center">
            <Link to="/" className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-xl flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              {isSidebarOpen && (
                <span className="text-xl font-bold text-white">Code4Kids</span>
              )}
            </Link>
          </div>

          {/* User Profile */}
          {isSidebarOpen && userData && (
            <div className="p-4 border-b border-white/10">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-r from-purple-400 to-pink-500 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold">🧙‍♂️</span>
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
            {sidebarItems.slice(1, -1).map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    if (item.id === 'adventure') {
                      navigate('/worlds');
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
          </nav>

          {/* Logout */}
          <div className="p-4 border-t border-white/10 mt-auto">
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

        {/* Tabbed Content */}
        <main className="p-6">
          {/* Dashboard Tab */}
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
                      <div className="text-green-200 text-sm">Levels Completed</div>
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
                      <div className="text-yellow-200 text-sm">Stars Earned</div>
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
                      <div className="text-purple-200 text-sm">Day Streak</div>
                    </div>
                  </div>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-3xl p-6 border border-white/20">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-blue-400 to-indigo-500 rounded-2xl flex items-center justify-center">
                      <BookOpen className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-white">{achievements.filter(a => a.earned).length}</div>
                      <div className="text-blue-200 text-sm">Achievements</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Worlds Progress */}
              <div>
                <h2 className="text-2xl font-bold text-white mb-6">Your Coding Worlds</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {worlds.map((world) => (
                    <div key={world.id} className={`bg-gradient-to-br ${world.color} rounded-3xl p-6 border border-white/20 transition-all duration-300 ${
                      world.unlocked ? 'hover:scale-105 cursor-pointer' : 'opacity-60'
                    }`}>
                      <div className="relative z-10">
                        <div className="flex items-center space-x-3 mb-4">
                          <span className="text-4xl">{world.icon}</span>
                          <div>
                            <h3 className="text-xl font-bold text-white">{world.name}</h3>
                            <p className="text-white/80 text-sm">{world.concept}</p>
                          </div>
                          {!world.unlocked && (
                            <Lock className="w-6 h-6 text-white/60 ml-auto" />
                          )}
                        </div>
                        
                        <div className="mb-4">
                          <div className="flex justify-between text-sm mb-2 text-white">
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
                            <div key={level.id} className={`flex items-center justify-between bg-white/10 rounded-lg p-2 ${
                              level.unlocked ? 'hover:bg-white/20 cursor-pointer' : 'opacity-50'
                            }`} onClick={() => {
                              if (level.unlocked) {
                                navigate(getLevelPath(level.id));
                              }
                            }}>
                              <div className="flex items-center space-x-2">
                                {!level.unlocked && <Lock className="w-3 h-3 text-white/60" />}
                                <span className="text-sm text-white">{level.name}</span>
                                {level.unlocked && (
                                  <Play className="w-3 h-3 text-white/60" />
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
                    </div>
                  ))}
                </div>
              </div>

              {/* Recent Achievements */}
              <div>
                <h2 className="text-2xl font-bold text-white mb-6">Recent Achievements</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {achievements.slice(0, 6).map((achievement, index) => (
                    <div key={index} className={`p-4 rounded-2xl border transition-all duration-300 ${
                      achievement.earned 
                        ? 'bg-gradient-to-r from-green-500/20 to-emerald-500/20 border-green-400/30' 
                        : 'bg-white/5 border-white/10'
                    }`}>
                      <div className="text-center">
                        <div className="text-3xl mb-2">{achievement.icon}</div>
                        <h3 className={`font-bold mb-1 ${achievement.earned ? 'text-green-300' : 'text-white/60'}`}>
                          {achievement.name}
                        </h3>
                        <p className={`text-xs ${achievement.earned ? 'text-green-200' : 'text-white/40'}`}>
                          {achievement.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Quick Actions */}
              <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-3xl p-6 text-white">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-2xl font-bold mb-2">Ready for your next adventure?</h3>
                    <p className="text-purple-100">Continue your coding journey and unlock new worlds!</p>
                  </div>
                  <div className="flex space-x-3">
                    <button 
                      onClick={() => navigate('/worlds')}
                      className="px-6 py-3 bg-white/20 rounded-xl hover:bg-white/30 transition-colors"
                    >
                      Continue Learning
                    </button>
                    <button 
                      onClick={() => setActiveTab('achievements')}
                      className="px-6 py-3 bg-white rounded-xl text-purple-600 font-bold hover:scale-105 transition-transform"
                    >
                      View Achievements
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {/* Achievements Tab */}
          {activeTab === 'achievements' && (
            <div className="space-y-6">
              <h2 className="text-3xl font-bold text-white">Your Magical Achievements</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 text-center">
                  <Trophy className="w-8 h-8 text-yellow-400 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-white">{achievements.filter(a => a.earned).length}</div>
                  <div className="text-blue-200 text-sm">Achievements Unlocked</div>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 text-center">
                  <Star className="w-8 h-8 text-yellow-400 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-white">{stats.earnedStars}</div>
                  <div className="text-blue-200 text-sm">Total Stars Earned</div>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 text-center">
                  <Target className="w-8 h-8 text-green-400 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-white">{Math.round((achievements.filter(a => a.earned).length / achievements.length) * 100)}%</div>
                  <div className="text-blue-200 text-sm">Completion Rate</div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {achievements.map((achievement, index) => (
                  <div key={index} className={`p-6 rounded-3xl border transition-all duration-300 ${
                    achievement.earned 
                      ? 'bg-gradient-to-r from-green-500/20 to-emerald-500/20 border-green-400/30' 
                      : 'bg-white/5 border-white/10'
                  }`}>
                    <div className="text-center">
                      <div className="text-3xl mb-2">{achievement.icon}</div>
                      <h3 className={`font-bold mb-1 ${achievement.earned ? 'text-green-300' : 'text-white/60'}`}>
                        {achievement.name}
                      </h3>
                      <p className={`text-xs ${achievement.earned ? 'text-green-200' : 'text-white/40'}`}>
                        {achievement.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Settings Tab */}
          {activeTab === 'settings' && (
            <div className="space-y-6">
              <h2 className="text-3xl font-bold text-white">Settings</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                  <div className="flex items-center space-x-3 mb-4">
                    <User className="w-6 h-6 text-blue-400" />
                    <h3 className="text-xl font-bold text-white">Profile</h3>
                  </div>
                  <div className="space-y-3">
                    <div>
                      <label className="text-white/60 text-sm">Username</label>
                      <div className="text-white font-medium">{userData?.username}</div>
                    </div>
                    <div>
                      <label className="text-white/60 text-sm">Email</label>
                      <div className="text-white font-medium">{userData?.email}</div>
                    </div>
                    <div>
                      <label className="text-white/60 text-sm">Rank</label>
                      <div className="text-white font-medium">{stats.rank}</div>
                    </div>
                  </div>
                </div>

                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                  <div className="flex items-center space-x-3 mb-4">
                    <Volume2 className="w-6 h-6 text-green-400" />
                    <h3 className="text-xl font-bold text-white">Sound Settings</h3>
                  </div>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-white">Sound Effects</span>
                      <button className="w-12 h-6 bg-green-500 rounded-full relative">
                        <div className="w-5 h-5 bg-white rounded-full absolute right-0.5 top-0.5"></div>
                      </button>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-white">Background Music</span>
                      <button className="w-12 h-6 bg-gray-500 rounded-full relative">
                        <div className="w-5 h-5 bg-white rounded-full absolute left-0.5 top-0.5"></div>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default StudentDashboard;