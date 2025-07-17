import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Sparkles, 
  Home, 
  User, 
  Settings, 
  LogOut,
  Star,
  Trophy,
  Clock,
  Target,
  BookOpen,
  Crown,
  Calendar,
  TrendingUp,
  Award,
  Heart,
  MessageCircle,
  Send,
  Phone
} from 'lucide-react';

const ParentDashboard = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);


  const sidebarItems = [
    { id: 'dashboard', icon: Home, label: 'Dashboard', path: '/parent-dashboard' },
    { id: 'profile', icon: User, label: 'My Child', path: '/child-profile' },
    { id: 'chat', icon: MessageCircle, label: 'Teacher Chat', path: '/teacher-chat' },
    { id: 'settings', icon: Settings, label: 'Settings', path: '/parent-settings' },
    { id: 'logout', icon: LogOut, label: 'Logout', path: '/logout', type: 'logout' }
  ];

  // Sample child data
  const childData = {
    name: "Emma Wilson",
    avatar: "👧",
    age: 10,
    rank: "Apprentice Wizard",
    level: 4,
    progress: 75,
    totalStars: 8,
    completedLevels: 3,
    currentWorld: "Forest Decisions",
    lastActive: "2 hours ago",
    weeklyGoal: 5,
    weeklyProgress: 3,
    streakDays: 7
  };

  const weeklyActivity = [
    { day: 'Mon', completed: true, time: '45 min' },
    { day: 'Tue', completed: true, time: '30 min' },
    { day: 'Wed', completed: true, time: '40 min' },
    { day: 'Thu', completed: false, time: '0 min' },
    { day: 'Fri', completed: false, time: '0 min' },
    { day: 'Sat', completed: false, time: '0 min' },
    { day: 'Sun', completed: false, time: '0 min' }
  ];

  const recentAchievements = [
    { name: "Weather Master", icon: "🌦️", date: "Today", description: "Completed Weather Paths level" },
    { name: "Apple Collector", icon: "🍎", date: "Yesterday", description: "Perfect score in Apple Collection" },
    { name: "Message Wizard", icon: "📨", date: "2 days ago", description: "Delivered all village messages" }
  ];

  const worldProgress = [
    { name: "Village Basics", icon: "🏘️", progress: 100, completed: true },
    { name: "Forest Decisions", icon: "🌲", progress: 33, completed: false },
    { name: "Mountain Challenges", icon: "⛰️", progress: 0, completed: false }
  ];

  // Chat functionality
  const [chatMessage, setChatMessage] = useState('');
  const [chatMessages, setChatMessages] = useState([
    {
      id: 1,
      sender: 'teacher',
      name: 'Ms. Rodriguez',
      message: 'Hello! Emma is doing wonderfully in her coding journey. She completed the Weather Paths level with perfect scores!',
      time: '2 hours ago',
      avatar: '👩‍🏫'
    },
    {
      id: 2,
      sender: 'parent',
      name: 'You',
      message: 'Thank you for the update! She was so excited about learning if-else statements. Any tips for helping her practice at home?',
      time: '1 hour ago',
      avatar: '👨‍👩‍👧'
    },
    {
      id: 3,
      sender: 'teacher',
      name: 'Ms. Rodriguez',
      message: 'I recommend encouraging her to explain her coding decisions out loud. This helps reinforce the logical thinking behind if-else conditions.',
      time: '45 min ago',
      avatar: '👩‍🏫'
    }
  ]);

  const handleSendMessage = () => {
    if (chatMessage.trim()) {
      const newMessage = {
        id: chatMessages.length + 1,
        sender: 'parent',
        name: 'You',
        message: chatMessage,
        time: 'Just now',
        avatar: '👨‍👩‍👧'
      };
      setChatMessages([...chatMessages, newMessage]);
      setChatMessage('');
    }
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

          {/* Parent Profile */}
          {isSidebarOpen && (
            <div className="p-4 border-b border-white/10">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-r from-pink-400 to-purple-500 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold">👨‍👩‍👧</span>
                </div>
                <div>
                  <div className="text-white font-medium">Parent Portal</div>
                  <div className="text-blue-200 text-sm">Wilson Family</div>
                </div>
              </div>
            </div>
          )}

          {/* Navigation Items */}
          <nav className="flex-1 p-4 space-y-2">
            {sidebarItems.slice(0, -1).map((item) => {
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
              <h1 className="text-3xl font-bold text-white">Your Child's Journey</h1>
              <p className="text-blue-200 mt-1">Track {childData.name}'s magical coding adventure</p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="bg-gradient-to-r from-green-400 to-emerald-500 px-4 py-2 rounded-xl">
                <span className="text-white font-bold flex items-center space-x-1">
                  <Heart className="w-4 h-4" />
                  <span>{childData.streakDays} Day Streak</span>
                </span>
              </div>
            </div>
          </div>
        </header>

        {/* Dashboard Content */}
        <main className="p-6">
          {activeTab === 'dashboard' && (
            <div className="space-y-8">
              {/* Child Overview Card */}
              <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-3xl p-8 text-white">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-6">
                    <div className="text-6xl">{childData.avatar}</div>
                    <div>
                      <h2 className="text-3xl font-bold">{childData.name}</h2>
                      <div className="flex items-center space-x-4 mt-2">
                        <span className="flex items-center space-x-1">
                          <Crown className="w-5 h-5" />
                          <span className="font-medium">{childData.rank}</span>
                        </span>
                        <span className="text-purple-200">Level {childData.level}</span>
                        <span className="text-purple-200">Age {childData.age}</span>
                      </div>
                      <div className="text-purple-200 text-sm mt-1">Last active: {childData.lastActive}</div>
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-4xl font-bold">{childData.progress}%</div>
                    <div className="text-purple-200">Overall Progress</div>
                  </div>
                </div>
              </div>

              {/* Quick Stats */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="bg-white/10 backdrop-blur-sm rounded-3xl p-6 border border-white/20 text-center">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-400 to-indigo-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <Target className="w-6 h-6 text-white" />
                  </div>
                  <div className="text-2xl font-bold text-white">{childData.completedLevels}</div>
                  <div className="text-blue-200 text-sm">Levels Complete</div>
                </div>

                <div className="bg-white/10 backdrop-blur-sm rounded-3xl p-6 border border-white/20 text-center">
                  <div className="w-12 h-12 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <Star className="w-6 h-6 text-white" />
                  </div>
                  <div className="text-2xl font-bold text-white">{childData.totalStars}</div>
                  <div className="text-blue-200 text-sm">Stars Earned</div>
                </div>

                <div className="bg-white/10 backdrop-blur-sm rounded-3xl p-6 border border-white/20 text-center">
                  <div className="w-12 h-12 bg-gradient-to-r from-green-400 to-emerald-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <BookOpen className="w-6 h-6 text-white" />
                  </div>
                  <div className="text-2xl font-bold text-white">{childData.currentWorld}</div>
                  <div className="text-blue-200 text-sm">Current World</div>
                </div>

                <div className="bg-white/10 backdrop-blur-sm rounded-3xl p-6 border border-white/20 text-center">
                  <div className="w-12 h-12 bg-gradient-to-r from-purple-400 to-pink-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <TrendingUp className="w-6 h-6 text-white" />
                  </div>
                  <div className="text-2xl font-bold text-white">{childData.weeklyProgress}/{childData.weeklyGoal}</div>
                  <div className="text-blue-200 text-sm">Weekly Goal</div>
                </div>
              </div>

              {/* Weekly Activity */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-white/10 backdrop-blur-sm rounded-3xl p-6 border border-white/20">
                  <h3 className="text-xl font-bold text-white mb-6 flex items-center space-x-2">
                    <Calendar className="w-5 h-5" />
                    <span>This Week's Activity</span>
                  </h3>
                  <div className="grid grid-cols-7 gap-2">
                    {weeklyActivity.map((day, index) => (
                      <div key={index} className="text-center">
                        <div className="text-white text-sm font-medium mb-2">{day.day}</div>
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold ${
                          day.completed 
                            ? 'bg-green-500 text-white' 
                            : 'bg-white/10 text-blue-200'
                        }`}>
                          {day.completed ? '✓' : '-'}
                        </div>
                        <div className="text-xs text-blue-200 mt-1">{day.time}</div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* World Progress */}
                <div className="bg-white/10 backdrop-blur-sm rounded-3xl p-6 border border-white/20">
                  <h3 className="text-xl font-bold text-white mb-6">World Progress</h3>
                  <div className="space-y-4">
                    {worldProgress.map((world, index) => (
                      <div key={index} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <span className="text-xl">{world.icon}</span>
                            <span className="text-white font-medium">{world.name}</span>
                          </div>
                          <span className="text-blue-200 text-sm">{world.progress}%</span>
                        </div>
                        <div className="w-full bg-white/20 rounded-full h-2">
                          <div 
                            className={`h-2 rounded-full transition-all duration-500 ${
                              world.completed ? 'bg-green-500' : 'bg-gradient-to-r from-blue-400 to-purple-500'
                            }`}
                            style={{ width: `${world.progress}%` }}
                          ></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Recent Achievements */}
              <div className="bg-white/10 backdrop-blur-sm rounded-3xl p-6 border border-white/20">
                <h3 className="text-xl font-bold text-white mb-6 flex items-center space-x-2">
                  <Trophy className="w-5 h-5" />
                  <span>Recent Achievements</span>
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {recentAchievements.map((achievement, index) => (
                    <div key={index} className="bg-gradient-to-r from-green-500/20 to-emerald-500/20 border border-green-400/30 rounded-2xl p-4">
                      <div className="text-center">
                        <div className="text-3xl mb-2">{achievement.icon}</div>
                        <h4 className="text-green-300 font-bold mb-1">{achievement.name}</h4>
                        <p className="text-green-200 text-sm mb-2">{achievement.description}</p>
                        <span className="text-green-300 text-xs">{achievement.date}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* My Child Tab */}
          {activeTab === 'profile' && (
            <div className="space-y-8">
              <div className="bg-white/10 backdrop-blur-sm rounded-3xl p-8 border border-white/20">
                <div className="text-center mb-8">
                  <div className="text-8xl mb-4">{childData.avatar}</div>
                  <h2 className="text-3xl font-bold text-white">{childData.name}</h2>
                  <p className="text-blue-200 mt-2">Age {childData.age} • {childData.rank}</p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-4">
                    <h3 className="text-xl font-bold text-white">Learning Progress</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-blue-200">Current Level</span>
                        <span className="text-white font-bold">Level {childData.level}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-blue-200">Overall Progress</span>
                        <span className="text-white font-bold">{childData.progress}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-blue-200">Stars Collected</span>
                        <span className="text-white font-bold">{childData.totalStars} stars</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-blue-200">Learning Streak</span>
                        <span className="text-white font-bold">{childData.streakDays} days</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <h3 className="text-xl font-bold text-white">Current Focus</h3>
                    <div className="bg-white/5 rounded-2xl p-4">
                      <div className="text-blue-200 text-sm">Currently Learning</div>
                      <div className="text-white font-bold text-lg">{childData.currentWorld}</div>
                      <div className="text-blue-300 text-sm mt-1">Conditional Logic & Decision Making</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Teacher Chat Tab */}
          {activeTab === 'chat' && (
            <div className="space-y-6">
              {/* Chat Header */}
              <div className="bg-white/10 backdrop-blur-sm rounded-3xl p-6 border border-white/20">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-2xl">👩‍🏫</span>
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-white">Ms. Rodriguez</h2>
                      <p className="text-blue-200 text-sm">Emma's Teacher • Master Teacher</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button className="p-2 bg-white/10 rounded-full hover:bg-white/20 transition-colors">
                      <Phone className="w-5 h-5 text-white" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Chat Messages */}
              <div className="bg-white/10 backdrop-blur-sm rounded-3xl border border-white/20 h-96 flex flex-col">
                <div className="p-4 border-b border-white/10">
                  <h3 className="text-lg font-bold text-white">Messages</h3>
                </div>
                
                <div className="flex-1 p-4 overflow-y-auto space-y-4">
                  {chatMessages.map((msg) => (
                    <div key={msg.id} className={`flex ${msg.sender === 'parent' ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-xs lg:max-w-md ${msg.sender === 'parent' ? 'order-2' : 'order-1'}`}>
                        <div className={`p-3 rounded-2xl ${
                          msg.sender === 'parent' 
                            ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white' 
                            : 'bg-white/20 text-white'
                        }`}>
                          <p className="text-sm">{msg.message}</p>
                        </div>
                        <div className={`flex items-center space-x-2 mt-1 ${msg.sender === 'parent' ? 'justify-end' : 'justify-start'}`}>
                          <span className="text-xs text-blue-200">{msg.time}</span>
                        </div>
                      </div>
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm ${msg.sender === 'parent' ? 'order-1 ml-2' : 'order-2 mr-2'}`}>
                        {msg.avatar}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Message Input */}
                <div className="p-4 border-t border-white/10">
                  <div className="flex space-x-3">
                    <input
                      type="text"
                      value={chatMessage}
                      onChange={(e) => setChatMessage(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                      placeholder="Type your message to Ms. Rodriguez..."
                      className="flex-1 px-4 py-3 bg-white/5 border border-white/20 rounded-2xl text-white placeholder-blue-200 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent"
                    />
                    <button
                      onClick={handleSendMessage}
                      className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-2xl hover:scale-105 transition-transform flex items-center space-x-2"
                    >
                      <Send className="w-4 h-4" />
                      <span>Send</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <button className="p-4 bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20 hover:bg-white/20 transition-colors text-center">
                  <div className="text-2xl mb-2">📅</div>
                  <div className="text-white font-medium">Schedule Meeting</div>
                  <div className="text-blue-200 text-sm">Book a parent-teacher conference</div>
                </button>
                <button className="p-4 bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20 hover:bg-white/20 transition-colors text-center">
                  <div className="text-2xl mb-2">📊</div>
                  <div className="text-white font-medium">Progress Report</div>
                  <div className="text-blue-200 text-sm">Request detailed progress report</div>
                </button>
                <button className="p-4 bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20 hover:bg-white/20 transition-colors text-center">
                  <div className="text-2xl mb-2">🎯</div>
                  <div className="text-white font-medium">Learning Goals</div>
                  <div className="text-blue-200 text-sm">Discuss learning objectives</div>
                </button>
              </div>
            </div>
          )}

          {/* Settings Tab */}
          {activeTab === 'settings' && (
            <div className="text-center py-20">
              <div className="text-6xl mb-6">⚙️</div>
              <h2 className="text-3xl font-bold text-white mb-4">Parent Settings</h2>
              <p className="text-blue-200 mb-8">Manage notifications and account preferences</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl mx-auto">
                <div className="p-6 bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20">
                  <div className="text-blue-300 text-3xl mb-3">📧</div>
                  <div className="text-white font-bold">Email Notifications</div>
                  <div className="text-blue-200 text-sm">Weekly progress reports</div>
                </div>
                <div className="p-6 bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20">
                  <div className="text-green-300 text-3xl mb-3">⏰</div>
                  <div className="text-white font-bold">Screen Time Limits</div>
                  <div className="text-blue-200 text-sm">Set daily learning goals</div>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default ParentDashboard;