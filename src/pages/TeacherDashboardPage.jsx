import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Sparkles, 
  Home, 
  Users, 
  BarChart3, 
  FileText, 
  Settings, 
  LogOut,
  MessageCircle,
  HelpCircle,
  User,
  TrendingUp,
  Award,
  Clock,
  Target,
  BookOpen,
  Star,
  Trophy,
  Zap,
  Crown,
  ChevronRight,
  Eye
} from 'lucide-react';

const TeacherDashboardPage = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);


  const sidebarItems = [
    { id: 'logo', type: 'logo' },
    { id: 'dashboard', icon: Home, label: 'Dashboard', path: '/teacher-dashboard' },
    { id: 'analytics', icon: BarChart3, label: 'Analytics', path: '/analytics' },
    { id: 'reports', icon: FileText, label: 'Reports', path: '/reports' },
    { id: 'settings', icon: Settings, label: 'Settings', path: '/teacher-settings' },
    { id: 'logout', icon: LogOut, label: 'Logout', path: '/logout', type: 'logout' }
  ];

  const settingsSubItems = [
    { id: 'parent-communication', icon: MessageCircle, label: 'Parents Communication', path: '/parent-communication' },
    { id: 'support', icon: HelpCircle, label: 'Support Center', path: '/support' }
  ];

  // Sample student data
  const students = [
    {
      id: 1,
      name: "Emma Wilson",
      avatar: "👧",
      rank: "Apprentice Wizard",
      level: 4,
      progress: 75,
      lastActive: "2 hours ago",
      completedLevels: 3,
      totalStars: 8,
      currentWorld: "Forest Decisions",
      status: "active"
    },
    {
      id: 2,
      name: "Alex Johnson",
      avatar: "👦",
      rank: "Novice Wizard",
      level: 2,
      progress: 45,
      lastActive: "1 day ago",
      completedLevels: 2,
      totalStars: 5,
      currentWorld: "Village Basics",
      status: "active"
    },
    {
      id: 3,
      name: "Sofia Martinez",
      avatar: "👧",
      rank: "Master Wizard",
      level: 8,
      progress: 95,
      lastActive: "30 min ago",
      completedLevels: 8,
      totalStars: 22,
      currentWorld: "Mountain Challenges",
      status: "active"
    },
    {
      id: 4,
      name: "James Chen",
      avatar: "👦",
      rank: "Apprentice Wizard",
      level: 3,
      progress: 60,
      lastActive: "3 days ago",
      completedLevels: 3,
      totalStars: 7,
      currentWorld: "Village Basics",
      status: "inactive"
    },
    {
      id: 5,
      name: "Maya Patel",
      avatar: "👧",
      rank: "Novice Wizard",
      level: 1,
      progress: 25,
      lastActive: "5 hours ago",
      completedLevels: 1,
      totalStars: 3,
      currentWorld: "Village Basics",
      status: "active"
    }
  ];

  const classStats = {
    totalStudents: students.length,
    activeStudents: students.filter(s => s.status === 'active').length,
    averageProgress: Math.round(students.reduce((acc, s) => acc + s.progress, 0) / students.length),
    totalLevelsCompleted: students.reduce((acc, s) => acc + s.completedLevels, 0),
    totalStarsEarned: students.reduce((acc, s) => acc + s.totalStars, 0),
    topPerformer: students.reduce((prev, current) => (prev.totalStars > current.totalStars) ? prev : current)
  };

  const recentActivity = [
    { student: "Sofia Martinez", action: "Completed Dragon Battle", time: "30 min ago", type: "completion" },
    { student: "Emma Wilson", action: "Earned Weather Path Master badge", time: "2 hours ago", type: "achievement" },
    { student: "Maya Patel", action: "Started Village Basics", time: "5 hours ago", type: "start" },
    { student: "Alex Johnson", action: "Completed Message Delivery", time: "1 day ago", type: "completion" }
  ];

  const worldProgress = [
    { 
      name: "Village Basics", 
      icon: "🏘️", 
      color: "from-green-400 to-emerald-600",
      studentsCompleted: 2,
      studentsInProgress: 3,
      averageStars: 2.4
    },
    { 
      name: "Forest Decisions", 
      icon: "🌲", 
      color: "from-emerald-500 to-teal-700",
      studentsCompleted: 1,
      studentsInProgress: 1,
      averageStars: 3.0
    },
    { 
      name: "Mountain Challenges", 
      icon: "⛰️", 
      color: "from-blue-500 to-indigo-600",
      studentsCompleted: 1,
      studentsInProgress: 0,
      averageStars: 2.8
    }
  ];

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
          {isSidebarOpen && (
            <div className="p-4 border-b border-white/10">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-r from-purple-400 to-pink-500 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold">👩‍🏫</span>
                </div>
                <div>
                  <div className="text-white font-medium">Ms. Rodriguez</div>
                  <div className="text-blue-200 text-sm">Master Teacher</div>
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
              <h1 className="text-3xl font-bold text-white">Teacher Dashboard</h1>
              <p className="text-blue-200 mt-1">Guide your young wizards through their coding journey</p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="bg-gradient-to-r from-green-400 to-emerald-500 px-4 py-2 rounded-xl">
                <span className="text-white font-bold flex items-center space-x-1">
                  <Users className="w-4 h-4" />
                  <span>{classStats.totalStudents} Students</span>
                </span>
              </div>
              <div className="text-right">
                <div className="text-white font-bold">Class Progress</div>
                <div className="text-blue-200 text-sm">{classStats.averageProgress}% Average</div>
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
                    <div className="w-12 h-12 bg-gradient-to-r from-blue-400 to-indigo-500 rounded-2xl flex items-center justify-center">
                      <Users className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-white">{classStats.totalStudents}</div>
                      <div className="text-blue-200 text-sm">Total Students</div>
                    </div>
                  </div>
                </div>

                <div className="bg-white/10 backdrop-blur-sm rounded-3xl p-6 border border-white/20">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-green-400 to-emerald-500 rounded-2xl flex items-center justify-center">
                      <Target className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-white">{classStats.totalLevelsCompleted}</div>
                      <div className="text-blue-200 text-sm">Levels Completed</div>
                    </div>
                  </div>
                </div>

                <div className="bg-white/10 backdrop-blur-sm rounded-3xl p-6 border border-white/20">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-2xl flex items-center justify-center">
                      <Star className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-white">{classStats.totalStarsEarned}</div>
                      <div className="text-blue-200 text-sm">Stars Earned</div>
                    </div>
                  </div>
                </div>

                <div className="bg-white/10 backdrop-blur-sm rounded-3xl p-6 border border-white/20">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-purple-400 to-pink-500 rounded-2xl flex items-center justify-center">
                      <TrendingUp className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-white">{classStats.averageProgress}%</div>
                      <div className="text-blue-200 text-sm">Avg Progress</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* World Progress Overview */}
              <div>
                <h2 className="text-2xl font-bold text-white mb-6">World Progress Overview</h2>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {worldProgress.map((world, index) => (
                    <div key={index} className={`bg-gradient-to-br ${world.color} rounded-3xl p-6 text-white relative overflow-hidden`}>
                      <div className="relative z-10">
                        <div className="flex items-center space-x-3 mb-4">
                          <span className="text-4xl">{world.icon}</span>
                          <div>
                            <h3 className="text-xl font-bold">{world.name}</h3>
                          </div>
                        </div>
                        
                        <div className="space-y-3">
                          <div className="flex justify-between items-center">
                            <span className="text-sm">Completed</span>
                            <span className="font-bold">{world.studentsCompleted} students</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-sm">In Progress</span>
                            <span className="font-bold">{world.studentsInProgress} students</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-sm">Avg Stars</span>
                            <div className="flex items-center space-x-1">
                              <Star className="w-4 h-4 fill-current" />
                              <span className="font-bold">{world.averageStars}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="absolute -top-4 -right-4 w-24 h-24 bg-white/10 rounded-full"></div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Students Data and Rankings */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Student List */}
                <div className="bg-white/10 backdrop-blur-sm rounded-3xl p-6 border border-white/20">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-bold text-white">Student Progress</h3>
                    <Link to="/analytics" className="text-blue-300 hover:text-white flex items-center space-x-1 text-sm">
                      <span>View All</span>
                      <ChevronRight className="w-4 h-4" />
                    </Link>
                  </div>
                  <div className="space-y-4">
                    {students.slice(0, 4).map((student) => (
                      <div key={student.id} className="flex items-center justify-between p-4 bg-white/5 rounded-2xl hover:bg-white/10 transition-colors">
                        <div className="flex items-center space-x-3">
                          <div className="text-2xl">{student.avatar}</div>
                          <div>
                            <div className="text-white font-medium">{student.name}</div>
                            <div className="text-blue-200 text-sm">{student.currentWorld}</div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-white font-bold">Level {student.level}</div>
                          <div className="text-blue-200 text-sm">{student.progress}% complete</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Recent Activity */}
                <div className="bg-white/10 backdrop-blur-sm rounded-3xl p-6 border border-white/20">
                  <h3 className="text-xl font-bold text-white mb-6">Recent Activity</h3>
                  <div className="space-y-4">
                    {recentActivity.map((activity, index) => (
                      <div key={index} className="flex items-start space-x-3 p-3 bg-white/5 rounded-xl">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm ${
                          activity.type === 'completion' ? 'bg-green-500' :
                          activity.type === 'achievement' ? 'bg-yellow-500' : 'bg-blue-500'
                        }`}>
                          {activity.type === 'completion' ? '✓' : 
                           activity.type === 'achievement' ? '🏆' : '▶'}
                        </div>
                        <div className="flex-1">
                          <div className="text-white font-medium">{activity.student}</div>
                          <div className="text-blue-200 text-sm">{activity.action}</div>
                          <div className="text-blue-300 text-xs">{activity.time}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Top Performer Highlight */}
              <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-3xl p-8 text-white">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-2xl font-bold mb-2">🏆 Top Performer</h3>
                    <div className="flex items-center space-x-4">
                      <div className="text-4xl">{classStats.topPerformer.avatar}</div>
                      <div>
                        <div className="text-xl font-bold">{classStats.topPerformer.name}</div>
                        <div className="text-purple-100">{classStats.topPerformer.rank}</div>
                        <div className="text-purple-200 text-sm">
                          Level {classStats.topPerformer.level} • {classStats.topPerformer.totalStars} stars earned
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold">{classStats.topPerformer.progress}%</div>
                    <div className="text-purple-200">Progress</div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Analytics Tab */}
          {activeTab === 'analytics' && (
            <div className="space-y-8">
              <h2 className="text-3xl font-bold text-white">Detailed Analytics</h2>
              
              {/* Detailed Student Table */}
              <div className="bg-white/10 backdrop-blur-sm rounded-3xl border border-white/20 overflow-hidden">
                <div className="p-6 border-b border-white/10">
                  <h3 className="text-xl font-bold text-white">Student Performance Overview</h3>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-white/5">
                      <tr>
                        <th className="text-left p-4 text-white font-medium">Student</th>
                        <th className="text-left p-4 text-white font-medium">Rank</th>
                        <th className="text-left p-4 text-white font-medium">Level</th>
                        <th className="text-left p-4 text-white font-medium">Progress</th>
                        <th className="text-left p-4 text-white font-medium">Stars</th>
                        <th className="text-left p-4 text-white font-medium">Last Active</th>
                        <th className="text-left p-4 text-white font-medium">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {students.map((student) => (
                        <tr key={student.id} className="border-t border-white/10 hover:bg-white/5">
                          <td className="p-4">
                            <div className="flex items-center space-x-3">
                              <span className="text-2xl">{student.avatar}</span>
                              <span className="text-white font-medium">{student.name}</span>
                            </div>
                          </td>
                          <td className="p-4 text-blue-200">{student.rank}</td>
                          <td className="p-4 text-white font-bold">{student.level}</td>
                          <td className="p-4">
                            <div className="w-24 bg-white/20 rounded-full h-2">
                              <div 
                                className="bg-gradient-to-r from-green-400 to-blue-500 h-2 rounded-full"
                                style={{ width: `${student.progress}%` }}
                              ></div>
                            </div>
                            <span className="text-blue-200 text-sm">{student.progress}%</span>
                          </td>
                          <td className="p-4">
                            <div className="flex items-center space-x-1">
                              <Star className="w-4 h-4 text-yellow-400 fill-current" />
                              <span className="text-white font-bold">{student.totalStars}</span>
                            </div>
                          </td>
                          <td className="p-4 text-blue-200 text-sm">{student.lastActive}</td>
                          <td className="p-4">
                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                              student.status === 'active' 
                                ? 'bg-green-500/20 text-green-300' 
                                : 'bg-red-500/20 text-red-300'
                            }`}>
                              {student.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* Reports Tab */}
          {activeTab === 'reports' && (
            <div className="text-center py-20">
              <div className="text-6xl mb-6">📊</div>
              <h2 className="text-3xl font-bold text-white mb-4">Detailed Reports</h2>
              <p className="text-blue-200 mb-8">Generate comprehensive reports for students and parents</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl mx-auto">
                <button className="p-6 bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20 hover:bg-white/20 transition-colors">
                  <FileText className="w-8 h-8 text-blue-300 mx-auto mb-3" />
                  <div className="text-white font-bold">Progress Reports</div>
                  <div className="text-blue-200 text-sm">Individual student progress</div>
                </button>
                <button className="p-6 bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20 hover:bg-white/20 transition-colors">
                  <BarChart3 className="w-8 h-8 text-green-300 mx-auto mb-3" />
                  <div className="text-white font-bold">Class Analytics</div>
                  <div className="text-blue-200 text-sm">Overall class performance</div>
                </button>
              </div>
            </div>
          )}

          {/* Settings Tab */}
          {activeTab === 'settings' && (
            <div className="text-center py-20">
              <div className="text-6xl mb-6">⚙️</div>
              <h2 className="text-3xl font-bold text-white mb-4">Teacher Settings</h2>
              <p className="text-blue-200">Manage your classroom and communication preferences</p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default TeacherDashboardPage;