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
  Play,
  RefreshCw,
  Save,
  Edit,
  Users,
  Mail,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { progressService } from '../services/progressService';

const StudentDashboard = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [userData, setUserData] = useState(null);
  const [progressData, setProgressData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [profileData, setProfileData] = useState({
    username: '',
    email: '',
    parentName: '',
    parentEmail: ''
  });
  const [profileUpdateLoading, setProfileUpdateLoading] = useState(false);
  const [profileUpdateSuccess, setProfileUpdateSuccess] = useState(false);
  const [profileUpdateError, setProfileUpdateError] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    loadUserData();
  }, []);

  // Refresh data when location changes (e.g., navigating back to dashboard)
  useEffect(() => {
    if (location.pathname === '/student-dashboard') {
      loadUserData();
    }
  }, [location]);

  // Refresh data when navigating to this page
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        loadUserData();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
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
      setLoading(true);
      console.log('Loading user data...');
      
      const user = progressService.getCurrentUser();
      
      if (!user) {
        navigate('/login');
        return;
      }

      // Fetch the latest user data from database
      const freshUserData = await progressService.getUserData(user.uid);
      
      if (freshUserData) {
        // Merge with session data to keep auth info
        const updatedUser = {
          ...user,
          ...freshUserData,
          uid: user.uid, // Keep original UID
          role: user.role // Keep original role
        };
        
        setUserData(updatedUser);
        
        // Update session storage with fresh data
        sessionStorage.setItem('user', JSON.stringify(updatedUser));
        
        // Initialize profile data with fresh data
        setProfileData({
          username: updatedUser.username || '',
          email: updatedUser.email || '',
          parentName: updatedUser.parentName || '',
          parentEmail: updatedUser.parentEmail || ''
        });
      } else {
        // Fallback to session data if database fetch fails
        setUserData(user);
        setProfileData({
          username: user.username || '',
          email: user.email || '',
          parentName: user.parentName || '',
          parentEmail: user.parentEmail || ''
        });
      }
      
      const progress = await progressService.getDashboardData(user.uid);
      
      console.log('Loaded progress data:', progress);
      console.log('Village levels:', progress?.worlds?.village?.levels);
      console.log('Forest world:', progress?.worlds?.forest);
      console.log('Mountain world:', progress?.worlds?.mountain);
      console.log('Level 7 unlock status:', progress?.worlds?.mountain?.levels?.level7?.unlocked);
      console.log('Achievements in progress:', progress?.achievements);
      
      setProgressData(progress);
      
    } catch (err) {
      console.error('Error loading user data:', err);
      setError(`Failed to load user data: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleProfileUpdate = async () => {
    if (!userData) return;
    
    setProfileUpdateLoading(true);
    setProfileUpdateError('');
    setProfileUpdateSuccess(false);
    
    try {
      // Update user profile in Firebase
      const result = await progressService.updateUserProfile(userData.uid, {
        username: profileData.username,
        email: profileData.email,
        parentName: profileData.parentName,
        parentEmail: profileData.parentEmail
      });
      
      // Use the updated data from Firebase to ensure accuracy
      const updatedUserData = {
        ...userData,
        ...result.userData,
        uid: userData.uid, // Keep the original UID
        role: userData.role // Keep the original role
      };
      
      setUserData(updatedUserData);
      sessionStorage.setItem('user', JSON.stringify(updatedUserData));
      
      setProfileUpdateSuccess(true);
      setIsEditingProfile(false);
      
      // Clear success message after 3 seconds
      setTimeout(() => {
        setProfileUpdateSuccess(false);
      }, 3000);
      
    } catch (error) {
      console.error('Error updating profile:', error);
      setProfileUpdateError('Failed to update profile. Please try again.');
    } finally {
      setProfileUpdateLoading(false);
    }
  };

  const handleProfileInputChange = (field, value) => {
    setProfileData(prev => ({
      ...prev,
      [field]: value
    }));
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
            unlocked: progressData.worlds.mountain?.levels?.level7?.unlocked || progressData.worlds.mountain?.unlocked || false
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
    const allAchievements = progressService.getAllAchievements();
    const earnedAchievements = progressData?.achievements || [];
    const earnedIds = Array.isArray(earnedAchievements) 
      ? earnedAchievements.map(achievement => achievement.id || achievement)
      : [];

    return allAchievements.map(achievement => ({
      ...achievement,
      earned: earnedIds.includes(achievement.id),
      earnedAt: earnedAchievements.find(earned => earned.id === achievement.id)?.earnedAt
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

  const handleLogout = async () => {
    try {
      // Clear all session data
      sessionStorage.clear();
      
      // Clear cached user data from progressService
      progressService.clearCurrentUser();
      
      // Sign out from Firebase Auth
      const { auth } = await import('./firebase');
      await auth.signOut();
      
      // Navigate to login
      navigate('/login', { replace: true });
      
      console.log('Student logged out successfully');
    } catch (error) {
      console.error('Error during logout:', error);
      // Still navigate to login even if there's an error
      navigate('/login', { replace: true });
    }
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
              <button
                onClick={loadUserData}
                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
              >
                <RefreshCw className="w-4 h-4" />
                <span>Refresh</span>
              </button>
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
                {achievements.map((achievement, index) => {
                  const getRarityColor = (rarity, earned) => {
                    if (!earned) return 'bg-white/5 border-white/10';
                    switch(rarity) {
                      case 'common': return 'bg-gradient-to-r from-gray-500/20 to-slate-500/20 border-gray-400/30';
                      case 'uncommon': return 'bg-gradient-to-r from-green-500/20 to-emerald-500/20 border-green-400/30';
                      case 'rare': return 'bg-gradient-to-r from-blue-500/20 to-indigo-500/20 border-blue-400/30';
                      case 'legendary': return 'bg-gradient-to-r from-purple-500/20 to-pink-500/20 border-purple-400/30';
                      default: return 'bg-white/5 border-white/10';
                    }
                  };

                  const getRarityTextColor = (rarity, earned) => {
                    if (!earned) return 'text-white/60';
                    switch(rarity) {
                      case 'common': return 'text-gray-300';
                      case 'uncommon': return 'text-green-300';
                      case 'rare': return 'text-blue-300';
                      case 'legendary': return 'text-purple-300';
                      default: return 'text-white/60';
                    }
                  };

                  const getRarityBadge = (rarity) => {
                    const colors = {
                      common: 'bg-gray-500/20 text-gray-300',
                      uncommon: 'bg-green-500/20 text-green-300',
                      rare: 'bg-blue-500/20 text-blue-300',
                      legendary: 'bg-purple-500/20 text-purple-300'
                    };
                    return colors[rarity] || colors.common;
                  };

                  return (
                    <div key={index} className={`p-6 rounded-3xl border transition-all duration-300 hover:scale-105 hover:shadow-2xl ${
                      getRarityColor(achievement.rarity, achievement.earned)
                    }`}>
                      <div className="text-center">
                        <div className="relative">
                          <div className={`text-4xl mb-3 ${achievement.earned ? 'animate-pulse' : 'grayscale'}`}>
                            {achievement.icon}
                          </div>
                          <div className={`inline-block px-2 py-1 rounded-full text-xs font-medium mb-2 ${
                            getRarityBadge(achievement.rarity)
                          }`}>
                            {achievement.rarity.charAt(0).toUpperCase() + achievement.rarity.slice(1)}
                          </div>
                        </div>
                        <h3 className={`font-bold mb-2 ${getRarityTextColor(achievement.rarity, achievement.earned)}`}>
                          {achievement.name}
                        </h3>
                        <p className={`text-sm mb-3 ${achievement.earned ? 'text-white/80' : 'text-white/40'}`}>
                          {achievement.description}
                        </p>
                        {achievement.earned && achievement.earnedAt && (
                          <div className="text-xs text-white/60">
                            Earned: {new Date(achievement.earnedAt).toLocaleDateString()}
                          </div>
                        )}
                        {achievement.earned && (
                          <div className="mt-3 flex items-center justify-center space-x-1">
                            <CheckCircle className="w-4 h-4 text-green-400" />
                            <span className="text-xs text-green-400 font-medium">Unlocked</span>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Settings Tab */}
          {activeTab === 'settings' && (
            <div className="space-y-6">
              <h2 className="text-3xl font-bold text-white">Settings</h2>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Profile Information */}
                <div className="bg-white/10 backdrop-blur-sm rounded-3xl p-6 border border-white/20">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center space-x-3">
                      <User className="w-6 h-6 text-blue-400" />
                      <h3 className="text-xl font-bold text-white">Profile Information</h3>
                    </div>
                    <button
                      onClick={() => setIsEditingProfile(!isEditingProfile)}
                      className="flex items-center space-x-2 px-4 py-2 bg-blue-500/20 hover:bg-blue-500/30 text-blue-300 rounded-lg transition-colors"
                    >
                      <Edit className="w-4 h-4" />
                      <span>{isEditingProfile ? 'Cancel' : 'Edit Profile'}</span>
                    </button>
                  </div>

                  {profileUpdateSuccess && (
                    <div className="mb-4 p-3 bg-green-500/20 border border-green-400/30 rounded-lg flex items-center space-x-2">
                      <CheckCircle className="w-5 h-5 text-green-400" />
                      <span className="text-green-300">Profile updated successfully!</span>
                    </div>
                  )}

                  {profileUpdateError && (
                    <div className="mb-4 p-3 bg-red-500/20 border border-red-400/30 rounded-lg flex items-center space-x-2">
                      <AlertCircle className="w-5 h-5 text-red-400" />
                      <span className="text-red-300">{profileUpdateError}</span>
                    </div>
                  )}

                  <div className="space-y-4">
                    {/* Student Information */}
                    <div className="bg-white/5 rounded-2xl p-4 border border-white/10">
                      <h4 className="text-lg font-semibold text-white mb-4 flex items-center space-x-2">
                        <span>🧙‍♂️</span>
                        <span>Student Information</span>
                      </h4>
                      <div className="space-y-4">
                        <div>
                          <label className="block text-white/80 text-sm font-medium mb-2">Username</label>
                          {isEditingProfile ? (
                            <input
                              type="text"
                              value={profileData.username}
                              onChange={(e) => handleProfileInputChange('username', e.target.value)}
                              className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-blue-400 transition-colors"
                              placeholder="Enter username"
                            />
                          ) : (
                            <div className="text-white font-medium px-4 py-2 bg-white/5 rounded-lg border border-white/10">
                              {userData?.username || 'Not set'}
                            </div>
                          )}
                        </div>
                        <div>
                          <label className="block text-white/80 text-sm font-medium mb-2">Email</label>
                          {isEditingProfile ? (
                            <input
                              type="email"
                              value={profileData.email}
                              onChange={(e) => handleProfileInputChange('email', e.target.value)}
                              className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-blue-400 transition-colors"
                              placeholder="Enter email"
                            />
                          ) : (
                            <div className="text-white font-medium px-4 py-2 bg-white/5 rounded-lg border border-white/10">
                              {userData?.email || 'Not set'}
                            </div>
                          )}
                        </div>
                        <div>
                          <label className="block text-white/80 text-sm font-medium mb-2">Rank</label>
                          <div className="text-white font-medium px-4 py-2 bg-gradient-to-r from-yellow-400/20 to-orange-500/20 rounded-lg border border-yellow-400/30">
                            <span className="flex items-center space-x-2">
                              <Crown className="w-4 h-4 text-yellow-400" />
                              <span>{stats.rank}</span>
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Parent Information */}
                    <div className="bg-white/5 rounded-2xl p-4 border border-white/10">
                      <h4 className="text-lg font-semibold text-white mb-4 flex items-center space-x-2">
                        <Users className="w-5 h-5 text-purple-400" />
                        <span>Parent Information</span>
                      </h4>
                      <div className="space-y-4">
                        <div>
                          <label className="block text-white/80 text-sm font-medium mb-2">Parent Name</label>
                          {isEditingProfile ? (
                            <input
                              type="text"
                              value={profileData.parentName}
                              onChange={(e) => handleProfileInputChange('parentName', e.target.value)}
                              className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-purple-400 transition-colors"
                              placeholder="Enter parent/guardian name"
                            />
                          ) : (
                            <div className="text-white font-medium px-4 py-2 bg-white/5 rounded-lg border border-white/10">
                              {userData?.parentName || 'Not set'}
                            </div>
                          )}
                        </div>
                        <div>
                          <label className="block text-white/80 text-sm font-medium mb-2">Parent Email</label>
                          {isEditingProfile ? (
                            <input
                              type="email"
                              value={profileData.parentEmail}
                              onChange={(e) => handleProfileInputChange('parentEmail', e.target.value)}
                              className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-purple-400 transition-colors"
                              placeholder="Enter parent/guardian email"
                            />
                          ) : (
                            <div className="text-white font-medium px-4 py-2 bg-white/5 rounded-lg border border-white/10">
                              {userData?.parentEmail || 'Not set'}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Update Button */}
                    {isEditingProfile && (
                      <div className="flex space-x-3">
                        <button
                          onClick={handleProfileUpdate}
                          disabled={profileUpdateLoading}
                          className="flex-1 flex items-center justify-center space-x-2 px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {profileUpdateLoading ? (
                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          ) : (
                            <>
                              <Save className="w-5 h-5" />
                              <span>Update Profile</span>
                            </>
                          )}
                        </button>
                        <button
                          onClick={() => {
                            setIsEditingProfile(false);
                            setProfileUpdateError('');
                            setProfileData({
                              username: userData?.username || '',
                              email: userData?.email || '',
                              parentName: userData?.parentName || '',
                              parentEmail: userData?.parentEmail || ''
                            });
                          }}
                          className="px-6 py-3 bg-gray-500/20 hover:bg-gray-500/30 text-gray-300 rounded-lg transition-colors"
                        >
                          Cancel
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                {/* Sound Settings */}
                <div className="bg-white/10 backdrop-blur-sm rounded-3xl p-6 border border-white/20">
                  <div className="flex items-center space-x-3 mb-6">
                    <Volume2 className="w-6 h-6 text-green-400" />
                    <h3 className="text-xl font-bold text-white">Sound Settings</h3>
                  </div>
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-white font-medium">Sound Effects</span>
                        <p className="text-white/60 text-sm">Game sounds and feedback</p>
                      </div>
                      <button className="w-12 h-6 bg-green-500 rounded-full relative transition-colors">
                        <div className="w-5 h-5 bg-white rounded-full absolute right-0.5 top-0.5 transition-transform"></div>
                      </button>
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-white font-medium">Background Music</span>
                        <p className="text-white/60 text-sm">Ambient music during gameplay</p>
                      </div>
                      <button className="w-12 h-6 bg-gray-500 rounded-full relative transition-colors">
                        <div className="w-5 h-5 bg-white rounded-full absolute left-0.5 top-0.5 transition-transform"></div>
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