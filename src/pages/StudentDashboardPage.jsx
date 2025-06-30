import React, { useState } from 'react';
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
  Award
} from 'lucide-react';

const StudentDashboard = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const Link = ({ to, children, className, onClick }) => (
    <a href={to} className={className} onClick={onClick}>
      {children}
    </a>
  );

  const sidebarItems = [
    { id: 'logo', type: 'logo' },
    { id: 'dashboard', icon: Home, label: 'Dashboard', path: '/student-dashboard' },
    { id: 'adventure', icon: Map, label: 'Adventure', path: '/adventure' },
    { id: 'achievements', icon: Trophy, label: 'Achievements', path: '/achievements' },
    { id: 'settings', icon: Settings, label: 'Settings', path: '/student-settings' },
    { id: 'logout', icon: LogOut, label: 'Logout', path: '/logout', type: 'logout' }
  ];

  const settingsSubItems = [
    { id: 'profile', icon: User, label: 'My Wizard', path: '/profile' },
    { id: 'progress', icon: BarChart3, label: 'Progress', path: '/user-stats' },
    { id: 'sound', icon: Volume2, label: 'Sound Settings', path: '/sound' }
  ];

  const worlds = [
    {
      id: 1,
      name: "Village Basics",
      concept: "Variables",
      icon: "🏘️",
      color: "from-green-400 to-emerald-600",
      progress: 85,
      levels: [
        { id: 1, name: "Apple Collection", completed: true, stars: 3 },
        { id: 2, name: "Message Delivery", completed: true, stars: 2 },
        { id: 3, name: "Potion Ingredients", completed: false, stars: 0 }
      ]
    },
    {
      id: 2,
      name: "Forest Decisions",
      concept: "If/Else",
      icon: "🌲",
      color: "from-emerald-500 to-teal-700",
      progress: 45,
      levels: [
        { id: 4, name: "Weather Paths", completed: true, stars: 3 },
        { id: 5, name: "Monster Spells", completed: false, stars: 0 },
        { id: 6, name: "Villager Problems", completed: false, stars: 0 }
      ]
    },
    {
      id: 3,
      name: "Mountain Challenges",
      concept: "Loops",
      icon: "⛰️",
      color: "from-blue-500 to-indigo-600",
      progress: 0,
      levels: [
        { id: 7, name: "Bridge Crossing", completed: false, stars: 0 },
        { id: 8, name: "Rock Clearing", completed: false, stars: 0 },
        { id: 9, name: "Dragon Battle", completed: false, stars: 0 }
      ]
    }
  ];

  const achievements = [
    { name: "First Steps", icon: "🌟", earned: true, description: "Complete your first level" },
    { name: "Apple Master", icon: "🍎", earned: true, description: "Perfect score in Apple Collection" },
    { name: "Variable Wizard", icon: "🧙‍♂️", earned: false, description: "Master all Variable levels" },
    { name: "Decision Maker", icon: "🌲", earned: false, description: "Complete Forest World" }
  ];

  const stats = {
    totalLevels: 9,
    completedLevels: 3,
    totalStars: 27,
    earnedStars: 8,
    currentStreak: 3,
    rank: "Apprentice Wizard"
  };

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

          {/* Navigation Items */}
          <nav className="flex-1 p-4 space-y-2">
            {sidebarItems.slice(1, -1).map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
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
            <Link
              to="/logout"
              className="w-full flex items-center space-x-3 px-4 py-3 text-red-300 hover:bg-red-500/20 rounded-xl transition-all duration-300"
            >
              <LogOut className="w-5 h-5" />
              {isSidebarOpen && <span className="font-medium">Logout</span>}
            </Link>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className={`transition-all duration-300 ${isSidebarOpen ? 'ml-64' : 'ml-16'}`}>
        {/* Header */}
        <header className="bg-white/5 backdrop-blur-sm border-b border-white/10 p-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white">Welcome back, Young Wizard!</h1>
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
                      <div className="text-lg font-bold text-white">Apprentice</div>
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
                    <div key={world.id} className={`bg-gradient-to-br ${world.color} rounded-3xl p-6 text-white relative overflow-hidden group hover:scale-105 transition-transform duration-300`}>
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
                            <div key={level.id} className="flex items-center justify-between bg-white/10 rounded-lg p-2">
                              <span className="text-sm">{level.name}</span>
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

              {/* Recent Achievements */}
              <div>
                <h2 className="text-2xl font-bold text-white mb-6">Recent Achievements</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {achievements.map((achievement, index) => (
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
            </div>
          )}

          {/* Adventure Tab */}
          {activeTab === 'adventure' && (
            <div className="text-center py-20">
              <div className="text-6xl mb-6">🗺️</div>
              <h2 className="text-3xl font-bold text-white mb-4">Adventure Awaits!</h2>
              <p className="text-blue-200 mb-8">Choose your next magical coding quest</p>
              <button className="px-8 py-4 bg-gradient-to-r from-green-400 to-blue-500 text-white font-bold rounded-2xl hover:scale-105 transition-transform">
                Start Adventure
              </button>
            </div>
          )}

          {/* Achievements Tab */}
          {activeTab === 'achievements' && (
            <div className="space-y-6">
              <h2 className="text-3xl font-bold text-white">Your Magical Achievements</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {achievements.map((achievement, index) => (
                  <div key={index} className={`p-6 rounded-3xl border transition-all duration-300 ${
                    achievement.earned 
                      ? 'bg-gradient-to-r from-green-500/20 to-emerald-500/20 border-green-400/30' 
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
                    </div>
                  </div>
                ))}
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