import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { progressService } from '../services/progressService';
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
  Eye,
  RefreshCw,
  Send,
  Phone,
  Mail
} from 'lucide-react';

const TeacherDashboardPage = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [dashboardData, setDashboardData] = useState(null);
  const [user, setUser] = useState(null);
  const [parents, setParents] = useState([]);
  const [selectedParent, setSelectedParent] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [messageLoading, setMessageLoading] = useState(false);
  const navigate = useNavigate();


  const sidebarItems = [
    { id: 'logo', type: 'logo' },
    { id: 'dashboard', icon: Home, label: 'Dashboard', path: '/teacher-dashboard' },
    { id: 'analytics', icon: BarChart3, label: 'Analytics', path: '/analytics' },
    { id: 'parent-communication', icon: MessageCircle, label: 'Parent Communication', path: '/parent-communication' },
    { id: 'reports', icon: FileText, label: 'Reports', path: '/reports' },
    { id: 'settings', icon: Settings, label: 'Settings', path: '/teacher-settings' },
    { id: 'logout', icon: LogOut, label: 'Logout', path: '/logout', type: 'logout' }
  ];

  // Load dashboard data from Firebase
  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        setLoading(true);
        setError('');
        
        // Check if user is authenticated and has teacher role
        const currentUser = progressService.getCurrentUser();
        if (!currentUser) {
          navigate('/login');
          return;
        }
        
        if (currentUser.role !== 'teacher') {
          navigate('/dashboard');
          return;
        }
        
        setUser(currentUser);
        
        console.log('Loading teacher dashboard data...');
        const data = await progressService.getTeacherDashboardData();
        console.log('Loaded dashboard data:', data);
        
        setDashboardData(data);
      } catch (err) {
        console.error('Error loading dashboard data:', err);
        setError('Failed to load dashboard data. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    
    loadDashboardData();
  }, [navigate]);

  // Load parents for communication
  useEffect(() => {
    const loadParents = async () => {
      if (activeTab === 'parent-communication' && user) {
        try {
          const parentsList = await progressService.getAllParents();
          setParents(parentsList);
        } catch (err) {
          console.error('Error loading parents:', err);
        }
      }
    };

    loadParents();
  }, [activeTab, user]);

  // Load messages when parent is selected
  useEffect(() => {
    let unsubscribe;
    
    if (selectedParent && user) {
      // Subscribe to real-time messages
      unsubscribe = progressService.subscribeToMessages(
        user.email,
        selectedParent.email,
        (messages) => {
          setMessages(messages);
          // Mark messages as read
          progressService.markMessagesAsRead(user.email, selectedParent.email);
        }
      );
    }
    
    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, [selectedParent, user]);

  // Handle logout
  const handleLogout = () => {
    try {
      // Clear all session data
      sessionStorage.clear();
      
      // Reset local state
      setUser(null);
      setDashboardData(null);
      setParents([]);
      setSelectedParent(null);
      setMessages([]);
      setActiveTab('dashboard');
      
      // Navigate to login
      navigate('/login', { replace: true });
      
      console.log('Teacher logged out successfully');
    } catch (error) {
      console.error('Error during logout:', error);
      // Still navigate to login even if there's an error
      navigate('/login', { replace: true });
    }
  };

  // Handle refresh
  const handleRefresh = async () => {
    try {
      setLoading(true);
      setError('');
      
      console.log('Refreshing teacher dashboard data...');
      const data = await progressService.getTeacherDashboardData();
      console.log('Refreshed dashboard data:', data);
      
      setDashboardData(data);
    } catch (err) {
      console.error('Error refreshing dashboard data:', err);
      setError('Failed to refresh dashboard data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Send message to parent
  const handleSendMessage = async (e) => {
    e.preventDefault();
    
    if (!newMessage.trim() || !selectedParent || !user) return;
    
    try {
      setMessageLoading(true);
      
      await progressService.sendMessageToParent(
        user.email,
        selectedParent.email,
        newMessage.trim()
      );
      
      setNewMessage('');
    } catch (err) {
      console.error('Error sending message:', err);
      setError('Failed to send message. Please try again.');
    } finally {
      setMessageLoading(false);
    }
  };

  // Format message time
  const formatMessageTime = (timestamp) => {
    const now = new Date();
    const messageTime = new Date(timestamp);
    const diffMs = now - messageTime;
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    
    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays === 1) return 'Yesterday';
    return messageTime.toLocaleDateString();
  };

  // Get data with fallbacks
  const students = dashboardData?.students || [];
  const classStats = dashboardData?.classStats || {
    totalStudents: 0,
    activeStudents: 0,
    averageProgress: 0,
    totalLevelsCompleted: 0,
    totalStarsEarned: 0,
    topPerformer: null
  };
  const recentActivity = dashboardData?.recentActivity || [];
  const worldProgress = dashboardData?.worldProgress || [];

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-white border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <div className="text-white text-xl">Loading Teacher Dashboard...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-400 text-xl mb-4">⚠️ {error}</div>
          <button 
            onClick={() => window.location.reload()}
            className="px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

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
          {isSidebarOpen && user && (
            <div className="p-4 border-b border-white/10">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-r from-purple-400 to-pink-500 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold">👩‍🏫</span>
                </div>
                <div>
                  <div className="text-white font-medium">{user.username || 'Teacher'}</div>
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
              <h1 className="text-3xl font-bold text-white">Teacher Dashboard</h1>
              <p className="text-blue-200 mt-1">Guide your young wizards through their coding journey</p>
            </div>
            <div className="flex items-center space-x-4">
              <button 
                onClick={handleRefresh}
                disabled={loading}
                className="flex items-center space-x-2 px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-xl transition-colors disabled:opacity-50"
              >
                <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                <span>Refresh</span>
              </button>
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
                    <button 
                      onClick={() => setActiveTab('analytics')}
                      className="text-blue-300 hover:text-white flex items-center space-x-1 text-sm"
                    >
                      <span>View All</span>
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="space-y-4">
                    {students.length > 0 ? (
                      students.slice(0, 4).map((student) => (
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
                      ))
                    ) : (
                      <div className="text-center py-8">
                        <div className="text-4xl mb-4">👨‍🎓</div>
                        <div className="text-white font-medium mb-2">No Students Yet</div>
                        <div className="text-blue-200 text-sm">Students will appear here once they register and start playing.</div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Recent Activity */}
                <div className="bg-white/10 backdrop-blur-sm rounded-3xl p-6 border border-white/20">
                  <h3 className="text-xl font-bold text-white mb-6">Recent Activity</h3>
                  <div className="space-y-4">
                    {recentActivity.length > 0 ? (
                      recentActivity.map((activity, index) => (
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
                      ))
                    ) : (
                      <div className="text-center py-8">
                        <div className="text-4xl mb-4">📊</div>
                        <div className="text-white font-medium mb-2">No Recent Activity</div>
                        <div className="text-blue-200 text-sm">Student activity will appear here as they complete levels.</div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Top Performer Highlight */}
              {classStats.topPerformer ? (
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
              ) : (
                <div className="bg-gradient-to-r from-gray-600 to-gray-700 rounded-3xl p-8 text-white text-center">
                  <h3 className="text-2xl font-bold mb-2">🏆 Top Performer</h3>
                  <p className="text-gray-300">No students have started their coding journey yet.</p>
                  <p className="text-gray-400 text-sm mt-2">Encourage your students to begin playing!</p>
                </div>
              )}
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
                      {students.length > 0 ? (
                        students.map((student) => (
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
                        ))
                      ) : (
                        <tr>
                          <td colSpan="7" className="p-8 text-center">
                            <div className="text-4xl mb-4">👨‍🎓</div>
                            <div className="text-white font-medium mb-2">No Students Registered</div>
                            <div className="text-blue-200 text-sm">Students will appear here once they register for your class.</div>
                          </td>
                        </tr>
                      )}
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

          {/* Parent Communication Tab */}
          {activeTab === 'parent-communication' && (
            <div className="h-[calc(100vh-200px)]">
              <div className="flex h-full bg-white/5 backdrop-blur-sm rounded-3xl border border-white/20 overflow-hidden">
                {/* Parents List */}
                <div className="w-1/3 border-r border-white/10 flex flex-col">
                  <div className="p-4 border-b border-white/10">
                    <h3 className="text-xl font-bold text-white mb-2">Parent Communication</h3>
                    <p className="text-blue-200 text-sm">Connect with parents of your students</p>
                  </div>
                  
                  <div className="flex-1 overflow-y-auto">
                    {parents.length > 0 ? (
                      parents.map((parent) => (
                        <div
                          key={parent.id}
                          onClick={() => setSelectedParent(parent)}
                          className={`p-4 border-b border-white/5 cursor-pointer transition-colors ${
                            selectedParent?.id === parent.id 
                              ? 'bg-purple-500/20 border-purple-500/30' 
                              : 'hover:bg-white/5'
                          }`}
                        >
                          <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-gradient-to-r from-purple-400 to-pink-500 rounded-full flex items-center justify-center">
                              <User className="w-5 h-5 text-white" />
                            </div>
                            <div className="flex-1">
                              <div className="text-white font-medium">{parent.name}</div>
                              <div className="text-blue-200 text-sm">{parent.email}</div>
                              <div className="text-blue-300 text-xs">
                                {parent.students.length} student{parent.students.length !== 1 ? 's' : ''}: {parent.students.map(s => s.name).join(', ')}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="p-8 text-center">
                        <div className="text-4xl mb-4">👨‍👩‍👧‍👦</div>
                        <div className="text-white font-medium mb-2">No Parents Available</div>
                        <div className="text-blue-200 text-sm">Parents will appear here when students add their parent email in profile settings.</div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Chat Area */}
                <div className="flex-1 flex flex-col">
                  {selectedParent ? (
                    <>
                      {/* Chat Header */}
                      <div className="p-4 border-b border-white/10 bg-white/5">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-gradient-to-r from-purple-400 to-pink-500 rounded-full flex items-center justify-center">
                            <User className="w-5 h-5 text-white" />
                          </div>
                          <div>
                            <div className="text-white font-medium">{selectedParent.name}</div>
                            <div className="text-blue-200 text-sm">
                              Parent of: {selectedParent.students.map(s => s.name).join(', ')}
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Messages */}
                      <div className="flex-1 overflow-y-auto p-4 space-y-4">
                        {messages.length > 0 ? (
                          messages.map((message) => (
                            <div
                              key={message.id}
                              className={`flex ${message.senderRole === 'teacher' ? 'justify-end' : 'justify-start'}`}
                            >
                              <div
                                className={`max-w-xs lg:max-w-md px-4 py-2 rounded-2xl ${
                                  message.senderRole === 'teacher'
                                    ? 'bg-purple-500 text-white'
                                    : 'bg-white/10 text-white'
                                }`}
                              >
                                <div className="text-sm">{message.message}</div>
                                <div className={`text-xs mt-1 ${
                                  message.senderRole === 'teacher' ? 'text-purple-200' : 'text-blue-300'
                                }`}>
                                  {formatMessageTime(message.timestamp)}
                                </div>
                              </div>
                            </div>
                          ))
                        ) : (
                          <div className="text-center py-8">
                            <div className="text-4xl mb-4">💬</div>
                            <div className="text-white font-medium mb-2">No messages yet</div>
                            <div className="text-blue-200 text-sm">Start a conversation with {selectedParent.name}</div>
                          </div>
                        )}
                      </div>

                      {/* Message Input */}
                      <div className="p-4 border-t border-white/10 bg-white/5">
                        <form onSubmit={handleSendMessage} className="flex space-x-3">
                          <input
                            type="text"
                            value={newMessage}
                            onChange={(e) => setNewMessage(e.target.value)}
                            placeholder="Type your message..."
                            className="flex-1 px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-blue-200 focus:outline-none focus:ring-2 focus:ring-purple-500"
                            disabled={messageLoading}
                          />
                          <button
                            type="submit"
                            disabled={messageLoading || !newMessage.trim()}
                            className="px-6 py-3 bg-purple-500 hover:bg-purple-600 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-xl transition-colors flex items-center space-x-2"
                          >
                            {messageLoading ? (
                              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                            ) : (
                              <Send className="w-5 h-5" />
                            )}
                          </button>
                        </form>
                      </div>
                    </>
                  ) : (
                    <div className="flex-1 flex items-center justify-center">
                      <div className="text-center">
                        <div className="text-6xl mb-4">💬</div>
                        <div className="text-white font-medium mb-2">Select a Parent</div>
                        <div className="text-blue-200 text-sm">Choose a parent from the list to start messaging</div>
                      </div>
                    </div>
                  )}
                </div>
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