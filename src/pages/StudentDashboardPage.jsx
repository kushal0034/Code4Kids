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
  Play
} from 'lucide-react';
import { progressService } from '../services/progressService';

const StudentDashboard = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [userData, setUserData] = useState(null);
  const [progressData, setProgressData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {
      setLoading(true);
      const user = progressService.getCurrentUser();
      
      if (!user) {
        window.location.href = '/login';
        return;
      }

      setUserData(user);
      
      // Get user progress from database
      const progress = await progressService.getDashboardData(user.uid);
      
      // Debug log for troubleshooting
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

  const Link = ({ to, children, className, onClick }) => (
    <a href={to} className={className} onClick={onClick}>
      {children}
    </a>
  );

  const sidebarItems = [
    { id: 'logo', type: 'logo' },
    { id: 'dashboard', icon: Home, label: 'Dashboard', path: '/student-dashboard' },
    { id: 'adventure', icon: Map, label: 'Adventure', path: '/worlds' },
    { id: 'achievements', icon: Trophy, label: 'Achievements', path: '/achievements' },
    { id: 'settings', icon: Settings, label: 'Settings', path: '/student-settings' },
    { id: 'logout', icon: LogOut, label: 'Logout', path: '/logout', type: 'logout' }
  ];

  const settingsSubItems = [
    { id: 'profile', icon: User, label: 'My Wizard', path: '/profile' },
    { id: 'progress', icon: BarChart3, label: 'Progress', path: '/user-stats' },
    { id: 'sound', icon: Volume2, label: 'Sound Settings', path: '/sound' }
  ];

  // Convert database progress to display format
  const getWorldsData = () => {
    if (!progressData?.worlds) return [];

    return [
      {
        id: 1,
        name: "Village Basics",
        concept: "Variables",
        icon: "🏘️",
        color: "from-green-400 to-emerald-600",
        progress: progressData.worlds.village?.progress || 0,
        unlocked: progressData.worlds.village?.unlocked || false,
        levels: [
          { 
            id: 1, 
            name: "Apple Collection", 
            completed: progressData.worlds.village?.levels?.level1?.completed || false, 
            stars: progressData.worlds.village?.levels?.level1?.stars || 0,
            unlocked: true 
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
            name: "Potion Ingredients", 
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
      { id: 'first_steps', name: "First Steps", icon: "🌟", description: "Complete your first level" },
      { id: 'apple_master', name: "Apple Master", icon: "🍎", description: "Perfect score in Apple Collection" },
      { id: 'message_master', name: "Message Master", icon: "📮", description: "Successfully deliver all village messages" },
      { id: 'delivery_expert', name: "Delivery Expert", icon: "🚀", description: "Perfect score in Message Delivery" },
      { id: 'string_wizard', name: "String Wizard", icon: "🔤", description: "Master string variables in Village levels" },
      { id: 'speedy_messenger', name: "Speedy Messenger", icon: "⚡", description: "Deliver messages in record time" },
      { id: 'variable_wizard', name: "Variable Wizard", icon: "🧙‍♂️", description: "Master all Variable levels" },
      { id: 'decision_maker', name: "Decision Maker", icon: "🌲", description: "Complete all Forest Decision levels" },
      { id: 'loop_master', name: "Loop Master", icon: "⛰️", description: "Complete all Mountain Challenge levels" },
      { id: 'perfect_student', name: "Perfect Student", icon: "👑", description: "Get 3 stars on all levels" }
    ];

    // Safely check achievements - handle both array and non-array cases
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
      totalStars: 27,
      earnedStars: progressData.totalStars || 0,
      currentStreak: progressData.currentStreak || 0,
      rank: progressData.rank || "Novice Wizard"
    };
  };

  const handleLogout = () => {
    sessionStorage.clear();
    window.location.href = '/login';
  };

  const getLevelPath = (levelId) => {
    const levelPaths = {
      1: '/level-1',
      2: '/level-2',
      3: '/level-3',
      4: '/level-4',
      5: '/level-5',
      6: '/level-6',
      7: '/level-7',
      8: '/level-8',
      9: '/level-9'
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
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
      {/* Sidebar */}
      <div className={`fixed left-0 top-0 h-full bg-slate-900/90 backdrop-blur-xl border-r border-white/10 transition-all duration-300 z-50 ${
        isSidebarOpen ? 'w-64' : 'w-16'
      }`}>
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="p-6 border-b border-white/10">
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
                      window.location.href = '/worlds';
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
                    <Link
                      key={subItem.id}
                      to={subItem.path}
                      className="flex items-center space-x-3 px-3 py-2 text-blue-200 hover:text-white transition-colors"
                    >
                      <SubIcon className="w-4 h-4" />
                      <span className="text-sm">{subItem.label}</span>
                    </Link>
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
                      <div className="text-lg font-bold text-white">{stats.rank.split(' ')[0]}</div>
                      <div className="text-blue-200 text-sm">Current Rank</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Worlds Grid */}
              <div>
                <h2 className="text-2xl font-bold text-white mb-6">Your Magical Worlds</h2>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {worlds.map((world) => (
                    <div key={world.id} className={`bg-gradient-to-br ${world.color} rounded-3xl p-6 text-white relative overflow-hidden group transition-all duration-300 ${
                      world.unlocked ? 'hover:scale-105 cursor-pointer' : 'opacity-60'
                    }`}>
                      <div className="relative z-10">
                        <div className="flex items-center space-x-3 mb-4">
                          <span className="text-4xl">{world.icon}</span>
                          <div>
                            <h3 className="text-xl font-bold">{world.name}</h3>
                            <p className="text-white/80 text-sm">{world.concept}</p>
                          </div>
                          {!world.unlocked && (
                            <Lock className="w-6 h-6 text-white/60" />
                          )}
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
                            <div key={level.id} className={`flex items-center justify-between bg-white/10 rounded-lg p-2 ${
                              level.unlocked ? 'hover:bg-white/20 cursor-pointer' : 'opacity-50'
                            }`} onClick={() => {
                              if (level.unlocked) {
                                window.location.href = getLevelPath(level.id);
                              }
                            }}>
                              <div className="flex items-center space-x-2">
                                {!level.unlocked && <Lock className="w-3 h-3 text-white/60" />}
                                <span className="text-sm">{level.name}</span>
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

                        {world.unlocked && (
                          <button 
                            onClick={() => window.location.href = '/worlds'}
                            className="mt-4 w-full py-2 bg-white/20 rounded-lg hover:bg-white/30 transition-colors text-sm font-medium"
                          >
                            Enter World
                          </button>
                        )}
                      </div>
                      
                      <div className="absolute -top-4 -right-4 w-24 h-24 bg-white/10 rounded-full"></div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recent Achievements */}
              <div>
                <h2 className="text-2xl font-bold text-white mb-6">Recent Achievements</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {achievements.slice(0, 4).map((achievement, index) => (
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
                      onClick={() => window.location.href = '/worlds'}
                      className="px-6 py-3 bg-white/20 rounded-xl hover:bg-white/30 transition-colors"
                    >
                      Continue Learning
                    </button>
                    <button 
                      onClick={() => setActiveTab('achievements')}
                      className="px-6 py-3 bg-white rounded-xl text-purple-600 hover:scale-105 transition-transform"
                    >
                      View Achievements
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Adventure Tab */}
          {activeTab === 'adventure' && (
            <div className="text-center py-20">
              <div className="text-6xl mb-6">🗺️</div>
              <h2 className="text-3xl font-bold text-white mb-4">Adventure Awaits!</h2>
              <p className="text-blue-200 mb-8">Choose your next magical coding quest</p>
              <button 
                onClick={() => window.location.href = '/worlds'}
                className="px-8 py-4 bg-gradient-to-r from-green-400 to-blue-500 text-white font-bold rounded-2xl hover:scale-105 transition-transform"
              >
                Start Adventure
              </button>
            </div>
          )}

          {/* Achievements Tab */}
          {activeTab === 'achievements' && (
            <div className="space-y-6">
              <h2 className="text-3xl font-bold text-white">Your Magical Achievements</h2>
              
              {/* Achievement Stats */}
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

              {/* Achievement Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {achievements.map((achievement, index) => (
                  <div key={index} className={`p-6 rounded-3xl border transition-all duration-300 ${
                    achievement.earned 
                      ? 'bg-gradient-to-r from-green-500/20 to-emerald-500/20 border-green-400/30 transform hover:scale-105' 
                      : 'bg-white/5 border-white/10'
                  }`}>
                    <div className="text-center">
                      <div className="text-6xl mb-4">{achievement.icon}</div>
                      <h3 className={`text-xl font-bold mb-2 ${achievement.earned ? 'text-green-300' : 'text-white/60'}`}>
                        {achievement.name}
                      </h3>
                      <p className={`${achievement.earned ? 'text-green-200' : 'text-white/40'}`}>
                        {achievement.description}
                      </p>
                      {achievement.earned && (
                        <div className="mt-4 inline-flex items-center space-x-2 bg-green-500/20 px-3 py-1 rounded-full">
                          <CheckCircle className="w-4 h-4 text-green-400" />
                          <span className="text-green-300 text-sm">Unlocked</span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Settings Tab */}
          {activeTab === 'settings' && (
            <div className="space-y-6">
              <h2 className="text-3xl font-bold text-white">Wizard Settings</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                  <div className="flex items-center space-x-4 mb-4">
                    <User className="w-8 h-8 text-blue-400" />
                    <h3 className="text-xl font-bold text-white">Profile Settings</h3>
                  </div>
                  <div className="space-y-3">
                    <div>
                      <label className="block text-white/60 text-sm mb-1">Username</label>
                      <div className="text-white font-medium">{userData?.username}</div>
                    </div>
                    <div>
                      <label className="block text-white/60 text-sm mb-1">Email</label>
                      <div className="text-white font-medium">{userData?.email}</div>
                    </div>
                    <div>
                      <label className="block text-white/60 text-sm mb-1">Rank</label>
                      <div className="text-white font-medium">{stats.rank}</div>
                    </div>
                  </div>
                </div>

                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                  <div className="flex items-center space-x-4 mb-4">
                    <Volume2 className="w-8 h-8 text-purple-400" />
                    <h3 className="text-xl font-bold text-white">Audio Settings</h3>
                  </div>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-white">Sound Effects</span>
                      <button className="w-12 h-6 bg-green-500 rounded-full p-1">
                        <div className="w-4 h-4 bg-white rounded-full transform translate-x-6"></div>
                      </button>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-white">Background Music</span>
                      <button className="w-12 h-6 bg-gray-500 rounded-full p-1">
                        <div className="w-4 h-4 bg-white rounded-full"></div>
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