// import React, { useState, useEffect } from 'react';
// import { Link, useNavigate } from 'react-router-dom';
// import { 
//   Sparkles, 
//   Home, 
//   User, 
//   Settings, 
//   LogOut,
//   Star,
//   Trophy,
//   Clock,
//   Target,
//   BookOpen,
//   Crown,
//   Calendar,
//   TrendingUp,
//   Award,
//   Heart,
//   MessageCircle,
//   Send,
//   Phone,
//   AlertCircle,
//   RefreshCw
// } from 'lucide-react';
// import { collection, query, where, getDocs, doc, getDoc } from 'firebase/firestore';
// import { db } from './firebase';
// import { progressService } from '../services/progressService';

// const ParentDashboard = () => {
//   const navigate = useNavigate();
//   const [activeTab, setActiveTab] = useState('dashboard');
//   const [isSidebarOpen, setIsSidebarOpen] = useState(true);
//   const [parentData, setParentData] = useState(null);
//   const [studentsData, setStudentsData] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [noStudentsFound, setNoStudentsFound] = useState(false);
//   const [messages, setMessages] = useState([]);
//   const [messageLoading, setMessageLoading] = useState(false);

//   // Load parent data and students on component mount
//   useEffect(() => {
//     loadParentData();
//   }, []);

//   const loadParentData = async () => {
//     try {
//       setLoading(true);
//       setError(null);
      
//       // Get parent data from session storage
//       const parentString = sessionStorage.getItem('user');
//       if (!parentString) {
//         navigate('/login');
//         return;
//       }

//       const parent = JSON.parse(parentString);
      
//       // Verify this is a parent account
//       if (parent.role !== 'parent') {
//         navigate('/login');
//         return;
//       }

//       setParentData(parent);
      
//       // Fetch students whose parentEmail matches this parent's email
//       await fetchStudentsData(parent.email);
      
//       // Load messages for parent
//       await loadMessages(parent.email);
      
//     } catch (err) {
//       console.error('Error loading parent data:', err);
//       setError(`Failed to load data: ${err.message}`);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const fetchStudentsData = async (parentEmail) => {
//     try {
//       // Query users collection for students with matching parentEmail
//       const usersQuery = query(
//         collection(db, 'users'),
//         where('parentEmail', '==', parentEmail),
//         where('role', '==', 'student')
//       );
      
//       const usersSnapshot = await getDocs(usersQuery);
      
//       if (usersSnapshot.empty) {
//         setNoStudentsFound(true);
//         setStudentsData([]);
//         return;
//       }

//       const students = [];
      
//       // For each student, fetch their progress data
//       for (const userDoc of usersSnapshot.docs) {
//         const studentData = userDoc.data();
        
//         // Fetch progress data for this student
//         const progressData = await progressService.getUserProgress(userDoc.id);
        
//         // Get achievements
//         const allAchievements = progressService.getAllAchievements();
//         const earnedAchievements = progressData?.achievements || [];
//         const earnedIds = Array.isArray(earnedAchievements) 
//           ? earnedAchievements.map(achievement => achievement.id || achievement)
//           : [];

//         const achievements = allAchievements.map(achievement => ({
//           ...achievement,
//           earned: earnedIds.includes(achievement.id),
//           earnedAt: earnedAchievements.find(earned => earned.id === achievement.id)?.earnedAt
//         }));

//         // Calculate world progress
//         const worldProgress = [];
//         if (progressData?.worlds) {
//           const worldsData = progressData.worlds;
//           worldProgress.push(
//             {
//               name: "Village Basics",
//               icon: "🏘️",
//               progress: worldsData.village?.progress || 0,
//               completed: worldsData.village?.progress === 100
//             },
//             {
//               name: "Forest Decisions",
//               icon: "🌲",
//               progress: worldsData.forest?.progress || 0,
//               completed: worldsData.forest?.progress === 100
//             },
//             {
//               name: "Mountain Challenges",
//               icon: "⛰️",
//               progress: worldsData.mountain?.progress || 0,
//               completed: worldsData.mountain?.progress === 100
//             }
//           );
//         }

//         // Calculate current world
//         let currentWorld = "Village Basics";
//         if (progressData?.worlds) {
//           if (progressData.worlds.forest?.unlocked) {
//             currentWorld = "Forest Decisions";
//           }
//           if (progressData.worlds.mountain?.unlocked) {
//             currentWorld = "Mountain Challenges";
//           }
//         }

//         // Calculate weekly activity (mock data for now)
//         const weeklyActivity = [
//           { day: 'Mon', completed: Math.random() > 0.5, time: '45 min' },
//           { day: 'Tue', completed: Math.random() > 0.5, time: '30 min' },
//           { day: 'Wed', completed: Math.random() > 0.5, time: '40 min' },
//           { day: 'Thu', completed: Math.random() > 0.5, time: '25 min' },
//           { day: 'Fri', completed: Math.random() > 0.5, time: '35 min' },
//           { day: 'Sat', completed: Math.random() > 0.5, time: '20 min' },
//           { day: 'Sun', completed: Math.random() > 0.5, time: '30 min' }
//         ];

//         const completedThisWeek = weeklyActivity.filter(day => day.completed).length;

//         const studentWithProgress = {
//           id: userDoc.id,
//           name: studentData.username || 'Unknown Student',
//           email: studentData.email,
//           avatar: "👧", // Could be customized based on student data
//           age: studentData.age || 10,
//           rank: progressData?.rank || 'Novice Wizard',
//           level: Math.floor((progressData?.totalLevelsCompleted || 0) / 3) + 1,
//           progress: Math.round(((progressData?.totalLevelsCompleted || 0) / 9) * 100),
//           totalStars: progressData?.totalStars || 0,
//           completedLevels: progressData?.totalLevelsCompleted || 0,
//           currentWorld,
//           lastActive: progressData?.lastPlayed ? new Date(progressData.lastPlayed.seconds * 1000).toLocaleDateString() : 'Never',
//           weeklyGoal: 5,
//           weeklyProgress: completedThisWeek,
//           streakDays: progressData?.currentStreak || 0,
//           achievements: achievements.filter(a => a.earned),
//           worldProgress,
//           weeklyActivity,
//           parentName: studentData.parentName || 'Parent',
//           parentEmail: studentData.parentEmail
//         };

//         students.push(studentWithProgress);
//       }

//       setStudentsData(students);
//       setNoStudentsFound(students.length === 0);
      
//     } catch (err) {
//       console.error('Error fetching students data:', err);
//       setError(`Failed to fetch students: ${err.message}`);
//     }
//   };

//   const loadMessages = async (parentEmail) => {
//     try {
//       console.log('Loading messages for parent email:', parentEmail);
//       setMessageLoading(true);
//       const parentMessages = await progressService.getParentMessages(parentEmail);
//       console.log('Loaded parent messages:', parentMessages);
//       setMessages(parentMessages);
//     } catch (err) {
//       console.error('Error loading messages:', err);
//     } finally {
//       setMessageLoading(false);
//     }
//   };

//   const formatMessageTime = (timestamp) => {
//     const now = new Date();
//     const messageTime = new Date(timestamp);
//     const diffMs = now - messageTime;
//     const diffMins = Math.floor(diffMs / (1000 * 60));
//     const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
//     const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    
//     if (diffMins < 1) return 'Just now';
//     if (diffMins < 60) return `${diffMins}m ago`;
//     if (diffHours < 24) return `${diffHours}h ago`;
//     if (diffDays === 1) return 'Yesterday';
//     return messageTime.toLocaleDateString();
//   };

//   const handleLogout = () => {
//     sessionStorage.clear();
//     navigate('/login');
//   };

//   const sidebarItems = [
//     { id: 'dashboard', icon: Home, label: 'Dashboard', path: '/parent-dashboard' },
//     { id: 'profile', icon: User, label: 'My Child', path: '/child-profile' },
//     { id: 'chat', icon: MessageCircle, label: 'Teacher Chat', path: '/teacher-chat' },
//     { id: 'settings', icon: Settings, label: 'Settings', path: '/parent-settings' },
//     { id: 'logout', icon: LogOut, label: 'Logout', path: '/logout', type: 'logout' }
//   ];

//   // Sample child data
//   const childData = {
//     name: "Emma Wilson",
//     avatar: "👧",
//     age: 10,
//     rank: "Apprentice Wizard",
//     level: 4,
//     progress: 75,
//     totalStars: 8,
//     completedLevels: 3,
//     currentWorld: "Forest Decisions",
//     lastActive: "2 hours ago",
//     weeklyGoal: 5,
//     weeklyProgress: 3,
//     streakDays: 7
//   };

//   const weeklyActivity = [
//     { day: 'Mon', completed: true, time: '45 min' },
//     { day: 'Tue', completed: true, time: '30 min' },
//     { day: 'Wed', completed: true, time: '40 min' },
//     { day: 'Thu', completed: false, time: '0 min' },
//     { day: 'Fri', completed: false, time: '0 min' },
//     { day: 'Sat', completed: false, time: '0 min' },
//     { day: 'Sun', completed: false, time: '0 min' }
//   ];

//   const recentAchievements = [
//     { name: "Weather Master", icon: "🌦️", date: "Today", description: "Completed Weather Paths level" },
//     { name: "Apple Collector", icon: "🍎", date: "Yesterday", description: "Perfect score in Apple Collection" },
//     { name: "Message Wizard", icon: "📨", date: "2 days ago", description: "Delivered all village messages" }
//   ];

//   const worldProgress = [
//     { name: "Village Basics", icon: "🏘️", progress: 100, completed: true },
//     { name: "Forest Decisions", icon: "🌲", progress: 33, completed: false },
//     { name: "Mountain Challenges", icon: "⛰️", progress: 0, completed: false }
//   ];

//   // Chat functionality
//   const [chatMessage, setChatMessage] = useState('');
//   const [chatMessages, setChatMessages] = useState([]);
//   const [sendingMessage, setSendingMessage] = useState(false);

//   // Update chatMessages when messages state changes
//   useEffect(() => {
//     console.log('Messages state changed:', messages);
//     if (messages.length > 0) {
//       const formattedMessages = messages.map(msg => ({
//         id: msg.id,
//         sender: msg.senderRole,
//         name: msg.senderRole === 'teacher' ? 'Teacher' : 'You',
//         message: msg.message,
//         time: formatMessageTime(msg.timestamp),
//         avatar: msg.senderRole === 'teacher' ? '👩‍🏫' : '👨‍👩‍👧'
//       }));
//       console.log('Formatted messages:', formattedMessages);
//       setChatMessages(formattedMessages);
//     } else {
//       console.log('No messages to display');
//       setChatMessages([]);
//     }
//   }, [messages]);

//   const handleSendMessage = async () => {
//     if (chatMessage.trim() && parentData) {
//       try {
//         setSendingMessage(true);
        
//         // Find the teacher who sent messages to this parent
//         let teacherEmail = 'teacher@code4kids.com'; // Default fallback
//         if (messages.length > 0) {
//           const teacherMessage = messages.find(msg => msg.senderRole === 'teacher');
//           if (teacherMessage) {
//             teacherEmail = teacherMessage.senderId;
//           }
//         }
        
//         await progressService.sendParentReply(parentData.email, teacherEmail, chatMessage.trim());
//         setChatMessage('');
//         // Reload messages to show the new message
//         await loadMessages(parentData.email);
//       } catch (error) {
//         console.error('Error sending message:', error);
//         setError('Failed to send message. Please try again.');
//       } finally {
//         setSendingMessage(false);
//       }
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
//       {/* Sidebar */}
//       <div className={`fixed left-0 top-0 h-full bg-slate-900/90 backdrop-blur-xl border-r border-white/10 transition-all duration-300 z-50 ${
//         isSidebarOpen ? 'w-64' : 'w-16'
//       }`}>
//         <div className="flex flex-col h-full">
//           {/* Logo */}
//           <div className="p-6 border-b border-white/10">
//             <Link to="/" className="flex items-center space-x-3">
//               <div className="w-10 h-10 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-xl flex items-center justify-center">
//                 <Sparkles className="w-6 h-6 text-white" />
//               </div>
//               {isSidebarOpen && (
//                 <span className="text-xl font-bold text-white">Code4Kids</span>
//               )}
//             </Link>
//           </div>

//           {/* Parent Profile */}
//           {isSidebarOpen && parentData && (
//             <div className="p-4 border-b border-white/10">
//               <div className="flex items-center space-x-3">
//                 <div className="w-10 h-10 bg-gradient-to-r from-pink-400 to-purple-500 rounded-full flex items-center justify-center">
//                   <span className="text-white font-bold">👨‍👩‍👧</span>
//                 </div>
//                 <div>
//                   <div className="text-white font-medium">{parentData.username || 'Parent'}</div>
//                   <div className="text-blue-200 text-sm">Parent Portal</div>
//                 </div>
//               </div>
//             </div>
//           )}

//           {/* Navigation Items */}
//           <nav className="flex-1 p-4 space-y-2">
//             {sidebarItems.slice(0, -1).map((item) => {
//               const Icon = item.icon;
//               const isActive = activeTab === item.id;
              
//               return (
//                 <button
//                   key={item.id}
//                   onClick={() => setActiveTab(item.id)}
//                   className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-300 ${
//                     isActive 
//                       ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white transform scale-105' 
//                       : 'text-blue-100 hover:bg-white/10 hover:text-white'
//                   }`}
//                 >
//                   <Icon className="w-5 h-5" />
//                   {isSidebarOpen && <span className="font-medium">{item.label}</span>}
//                 </button>
//               );
//             })}
//           </nav>

//           {/* Logout */}
//           <div className="p-4 border-t border-white/10">
//             <button
//               onClick={handleLogout}
//               className="w-full flex items-center space-x-3 px-4 py-3 text-red-300 hover:bg-red-500/20 rounded-xl transition-all duration-300"
//             >
//               <LogOut className="w-5 h-5" />
//               {isSidebarOpen && <span className="font-medium">Logout</span>}
//             </button>
//           </div>
//         </div>
//       </div>

//       {/* Main Content */}
//       <div className={`transition-all duration-300 ${isSidebarOpen ? 'ml-64' : 'ml-16'}`}>
//         {/* Header */}
//         <header className="bg-white/5 backdrop-blur-sm border-b border-white/10 p-6">
//           <div className="flex items-center justify-between">
//             <div>
//               <h1 className="text-3xl font-bold text-white">
//                 {loading ? 'Loading...' : studentsData.length > 0 ? 'Your Children\'s Journey' : 'Parent Dashboard'}
//               </h1>
//               <p className="text-blue-200 mt-1">
//                 {loading ? 'Please wait...' : studentsData.length > 0 ? 
//                   `Track ${studentsData.length} student${studentsData.length !== 1 ? 's' : ''} magical coding adventure` : 
//                   'Welcome to your parent dashboard'}
//               </p>
//             </div>
//             <div className="flex items-center space-x-4">
//               <button
//                 onClick={loadParentData}
//                 disabled={loading}
//                 className="flex items-center space-x-2 px-4 py-2 bg-blue-500/20 hover:bg-blue-500/30 text-blue-300 rounded-lg transition-colors disabled:opacity-50"
//               >
//                 <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
//                 <span>Refresh</span>
//               </button>
//               {parentData && (
//                 <div className="bg-gradient-to-r from-purple-400 to-pink-500 px-4 py-2 rounded-xl">
//                   <span className="text-white font-bold flex items-center space-x-1">
//                     <User className="w-4 h-4" />
//                     <span>{parentData.username || 'Parent'}</span>
//                   </span>
//                 </div>
//               )}
//             </div>
//           </div>
//         </header>

//         {/* Dashboard Content */}
//         <main className="p-6">
//           {loading && (
//             <div className="flex items-center justify-center py-20">
//               <div className="text-center">
//                 <div className="w-16 h-16 border-4 border-white border-t-transparent rounded-full animate-spin mb-4"></div>
//                 <div className="text-white text-xl">Loading student data...</div>
//               </div>
//             </div>
//           )}

//           {error && (
//             <div className="flex items-center justify-center py-20">
//               <div className="text-center">
//                 <AlertCircle className="w-16 h-16 text-red-400 mb-4 mx-auto" />
//                 <div className="text-white text-xl mb-2">Error Loading Data</div>
//                 <div className="text-red-300 mb-4">{error}</div>
//                 <button 
//                   onClick={loadParentData}
//                   className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
//                 >
//                   Try Again
//                 </button>
//               </div>
//             </div>
//           )}

//           {!loading && !error && noStudentsFound && (
//             <div className="flex items-center justify-center py-20">
//               <div className="text-center">
//                 <div className="text-8xl mb-6">👨‍👩‍👧‍👦</div>
//                 <div className="text-white text-2xl font-bold mb-4">No Student Information Available</div>
//                 <div className="text-blue-200 mb-6 max-w-md mx-auto">
//                   No students have registered with your email address as their parent contact. 
//                   Please ask your child to update their profile with your email address.
//                 </div>
//                 <button 
//                   onClick={loadParentData}
//                   className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
//                 >
//                   Refresh Data
//                 </button>
//               </div>
//             </div>
//           )}

//           {!loading && !error && !noStudentsFound && activeTab === 'dashboard' && (
//             <div className="space-y-8">
//               {/* Students Overview Cards */}
//               {studentsData.map((student, index) => (
//                 <div key={student.id} className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-3xl p-8 text-white">
//                   <div className="flex items-center justify-between">
//                     <div className="flex items-center space-x-6">
//                       <div className="text-6xl">{student.avatar}</div>
//                       <div>
//                         <h2 className="text-3xl font-bold">{student.name}</h2>
//                         <div className="flex items-center space-x-4 mt-2">
//                           <span className="flex items-center space-x-1">
//                             <Crown className="w-5 h-5" />
//                             <span className="font-medium">{student.rank}</span>
//                           </span>
//                           <span className="text-purple-200">Level {student.level}</span>
//                           <span className="text-purple-200">Age {student.age}</span>
//                         </div>
//                         <div className="text-purple-200 text-sm mt-1">Last active: {student.lastActive}</div>
//                       </div>
//                     </div>
//                     <div className="text-center">
//                       <div className="text-4xl font-bold">{student.progress}%</div>
//                       <div className="text-purple-200">Overall Progress</div>
//                     </div>
//                   </div>
                  
//                   {/* Student Quick Stats */}
//                   <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6">
//                     <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 text-center">
//                       <div className="text-2xl font-bold">{student.completedLevels}</div>
//                       <div className="text-purple-200 text-sm">Levels Complete</div>
//                     </div>
//                     <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 text-center">
//                       <div className="text-2xl font-bold">{student.totalStars}</div>
//                       <div className="text-purple-200 text-sm">Stars Earned</div>
//                     </div>
//                     <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 text-center">
//                       <div className="text-2xl font-bold">{student.currentWorld}</div>
//                       <div className="text-purple-200 text-sm">Current World</div>
//                     </div>
//                     <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 text-center">
//                       <div className="text-2xl font-bold flex items-center justify-center space-x-1">
//                         <Heart className="w-5 h-5" />
//                         <span>{student.streakDays}</span>
//                       </div>
//                       <div className="text-purple-200 text-sm">Day Streak</div>
//                     </div>
//                   </div>
//                 </div>
//               ))}

//               {/* Combined Family Stats */}
//               <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
//                 <div className="bg-white/10 backdrop-blur-sm rounded-3xl p-6 border border-white/20 text-center">
//                   <div className="w-12 h-12 bg-gradient-to-r from-blue-400 to-indigo-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
//                     <Target className="w-6 h-6 text-white" />
//                   </div>
//                   <div className="text-2xl font-bold text-white">
//                     {studentsData.reduce((total, student) => total + student.completedLevels, 0)}
//                   </div>
//                   <div className="text-blue-200 text-sm">Total Levels Complete</div>
//                 </div>

//                 <div className="bg-white/10 backdrop-blur-sm rounded-3xl p-6 border border-white/20 text-center">
//                   <div className="w-12 h-12 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
//                     <Star className="w-6 h-6 text-white" />
//                   </div>
//                   <div className="text-2xl font-bold text-white">
//                     {studentsData.reduce((total, student) => total + student.totalStars, 0)}
//                   </div>
//                   <div className="text-blue-200 text-sm">Total Stars Earned</div>
//                 </div>

//                 <div className="bg-white/10 backdrop-blur-sm rounded-3xl p-6 border border-white/20 text-center">
//                   <div className="w-12 h-12 bg-gradient-to-r from-green-400 to-emerald-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
//                     <BookOpen className="w-6 h-6 text-white" />
//                   </div>
//                   <div className="text-2xl font-bold text-white">{studentsData.length}</div>
//                   <div className="text-blue-200 text-sm">Active Students</div>
//                 </div>

//                 <div className="bg-white/10 backdrop-blur-sm rounded-3xl p-6 border border-white/20 text-center">
//                   <div className="w-12 h-12 bg-gradient-to-r from-purple-400 to-pink-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
//                     <TrendingUp className="w-6 h-6 text-white" />
//                   </div>
//                   <div className="text-2xl font-bold text-white">
//                     {studentsData.reduce((total, student) => total + student.weeklyProgress, 0)}
//                   </div>
//                   <div className="text-blue-200 text-sm">Weekly Activities</div>
//                 </div>
//               </div>

//               {/* Recent Achievements from all students */}
//               <div className="bg-white/10 backdrop-blur-sm rounded-3xl p-6 border border-white/20">
//                 <h3 className="text-xl font-bold text-white mb-6 flex items-center space-x-2">
//                   <Trophy className="w-5 h-5" />
//                   <span>Recent Achievements</span>
//                 </h3>
//                 <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//                   {studentsData.slice(0, 3).map((student, studentIndex) => (
//                     student.achievements.slice(0, 3).map((achievement, achIndex) => (
//                       <div key={`${studentIndex}-${achIndex}`} className="bg-gradient-to-r from-green-500/20 to-emerald-500/20 border border-green-400/30 rounded-2xl p-4">
//                         <div className="text-center">
//                           <div className="text-3xl mb-2">{achievement.icon}</div>
//                           <h4 className="text-green-300 font-bold mb-1">{achievement.name}</h4>
//                           <p className="text-green-200 text-sm mb-2">{achievement.description}</p>
//                           <span className="text-green-300 text-xs">{student.name}</span>
//                         </div>
//                       </div>
//                     ))
//                   )).flat().slice(0, 6)}
//                   {studentsData.every(student => student.achievements.length === 0) && (
//                     <div className="col-span-full text-center py-8">
//                       <div className="text-4xl mb-4">🏆</div>
//                       <div className="text-white/60">No achievements yet. Keep learning!</div>
//                     </div>
//                   )}
//                 </div>
//               </div>
//             </div>
//           )}

//           {/* My Children Tab */}
//           {!loading && !error && !noStudentsFound && activeTab === 'profile' && (
//             <div className="space-y-8">
//               {studentsData.map((student, index) => (
//                 <div key={student.id} className="bg-white/10 backdrop-blur-sm rounded-3xl p-8 border border-white/20">
//                   <div className="text-center mb-8">
//                     <div className="text-8xl mb-4">{student.avatar}</div>
//                     <h2 className="text-3xl font-bold text-white">{student.name}</h2>
//                     <p className="text-blue-200 mt-2">Age {student.age} • {student.rank}</p>
//                   </div>
                  
//                   <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
//                     <div className="space-y-4">
//                       <h3 className="text-xl font-bold text-white">Learning Progress</h3>
//                       <div className="space-y-3">
//                         <div className="flex justify-between">
//                           <span className="text-blue-200">Current Level</span>
//                           <span className="text-white font-bold">Level {student.level}</span>
//                         </div>
//                         <div className="flex justify-between">
//                           <span className="text-blue-200">Overall Progress</span>
//                           <span className="text-white font-bold">{student.progress}%</span>
//                         </div>
//                         <div className="flex justify-between">
//                           <span className="text-blue-200">Stars Collected</span>
//                           <span className="text-white font-bold">{student.totalStars} stars</span>
//                         </div>
//                         <div className="flex justify-between">
//                           <span className="text-blue-200">Learning Streak</span>
//                           <span className="text-white font-bold">{student.streakDays} days</span>
//                         </div>
//                       </div>
//                     </div>
                    
//                     <div className="space-y-4">
//                       <h3 className="text-xl font-bold text-white">Current Focus</h3>
//                       <div className="bg-white/5 rounded-2xl p-4">
//                         <div className="text-blue-200 text-sm">Currently Learning</div>
//                         <div className="text-white font-bold text-lg">{student.currentWorld}</div>
//                         <div className="text-blue-300 text-sm mt-1">
//                           {student.currentWorld === 'Village Basics' && 'Variables & Basic Programming'}
//                           {student.currentWorld === 'Forest Decisions' && 'Conditional Logic & Decision Making'}
//                           {student.currentWorld === 'Mountain Challenges' && 'Loops & Repetition'}
//                         </div>
//                       </div>
//                     </div>
//                   </div>
                  
//                   {/* World Progress for this student */}
//                   <div className="mt-8">
//                     <h3 className="text-xl font-bold text-white mb-4">World Progress</h3>
//                     <div className="space-y-4">
//                       {student.worldProgress.map((world, worldIndex) => (
//                         <div key={worldIndex} className="space-y-2">
//                           <div className="flex items-center justify-between">
//                             <div className="flex items-center space-x-2">
//                               <span className="text-xl">{world.icon}</span>
//                               <span className="text-white font-medium">{world.name}</span>
//                             </div>
//                             <span className="text-blue-200 text-sm">{world.progress}%</span>
//                           </div>
//                           <div className="w-full bg-white/20 rounded-full h-2">
//                             <div 
//                               className={`h-2 rounded-full transition-all duration-500 ${
//                                 world.completed ? 'bg-green-500' : 'bg-gradient-to-r from-blue-400 to-purple-500'
//                               }`}
//                               style={{ width: `${world.progress}%` }}
//                             ></div>
//                           </div>
//                         </div>
//                       ))}
//                     </div>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           )}

//           {/* Teacher Chat Tab */}
//           {activeTab === 'chat' && (
//             <div className="space-y-6">
//               {/* Chat Header */}
//               <div className="bg-white/10 backdrop-blur-sm rounded-3xl p-6 border border-white/20">
//                 <div className="flex items-center justify-between">
//                   <div className="flex items-center space-x-4">
//                     <div className="w-12 h-12 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full flex items-center justify-center">
//                       <span className="text-white text-2xl">👩‍🏫</span>
//                     </div>
//                     <div>
//                       <h2 className="text-xl font-bold text-white">Ms. Rodriguez</h2>
//                       <p className="text-blue-200 text-sm">Emma's Teacher • Master Teacher</p>
//                     </div>
//                   </div>
//                   <div className="flex items-center space-x-2">
//                     <button className="p-2 bg-white/10 rounded-full hover:bg-white/20 transition-colors">
//                       <Phone className="w-5 h-5 text-white" />
//                     </button>
//                   </div>
//                 </div>
//               </div>

//               {/* Chat Messages */}
//               <div className="bg-white/10 backdrop-blur-sm rounded-3xl border border-white/20 h-96 flex flex-col">
//                 <div className="p-4 border-b border-white/10">
//                   <h3 className="text-lg font-bold text-white">Messages</h3>
//                 </div>
                
//                 <div className="flex-1 p-4 overflow-y-auto space-y-4">
//                   {chatMessages.length > 0 ? (
//                     chatMessages.map((msg) => (
//                       <div key={msg.id} className={`flex ${msg.sender === 'parent' ? 'justify-end' : 'justify-start'} mb-4`}>
//                         {msg.sender === 'parent' ? (
//                           // Parent message - right side
//                           <>
//                             <div className="max-w-xs lg:max-w-md">
//                               <div className="p-3 rounded-2xl bg-gradient-to-r from-purple-500 to-pink-500 text-white">
//                                 <p className="text-sm">{msg.message}</p>
//                               </div>
//                               <div className="flex items-center justify-end space-x-2 mt-1">
//                                 <span className="text-xs text-blue-200">{msg.time}</span>
//                               </div>
//                             </div>
//                             <div className="w-8 h-8 rounded-full flex items-center justify-center text-sm ml-2">
//                               {msg.avatar}
//                             </div>
//                           </>
//                         ) : (
//                           // Teacher message - left side
//                           <>
//                             <div className="w-8 h-8 rounded-full flex items-center justify-center text-sm mr-2">
//                               {msg.avatar}
//                             </div>
//                             <div className="max-w-xs lg:max-w-md">
//                               <div className="p-3 rounded-2xl bg-white/20 text-white">
//                                 <p className="text-sm">{msg.message}</p>
//                               </div>
//                               <div className="flex items-center justify-start space-x-2 mt-1">
//                                 <span className="text-xs text-blue-200">{msg.time}</span>
//                               </div>
//                             </div>
//                           </>
//                         )}
//                       </div>
//                     ))
//                   ) : (
//                     <div className="flex items-center justify-center h-full">
//                       <div className="text-center">
//                         <div className="text-4xl mb-4">💬</div>
//                         <div className="text-white font-medium mb-2">No messages yet</div>
//                         <div className="text-blue-200 text-sm">Start a conversation with your child's teacher</div>
//                       </div>
//                     </div>
//                   )}
//                 </div>

//                 {/* Message Input */}
//                 <div className="p-4 border-t border-white/10">
//                   <div className="flex space-x-3">
//                     <input
//                       type="text"
//                       value={chatMessage}
//                       onChange={(e) => setChatMessage(e.target.value)}
//                       onKeyPress={(e) => e.key === 'Enter' && !sendingMessage && handleSendMessage()}
//                       placeholder="Type your message to your child's teacher..."
//                       className="flex-1 px-4 py-3 bg-white/5 border border-white/20 rounded-2xl text-white placeholder-blue-200 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent"
//                       disabled={sendingMessage}
//                     />
//                     <button
//                       onClick={handleSendMessage}
//                       disabled={sendingMessage || !chatMessage.trim()}
//                       className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-2xl hover:scale-105 transition-transform flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
//                     >
//                       {sendingMessage ? (
//                         <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
//                       ) : (
//                         <Send className="w-4 h-4" />
//                       )}
//                       <span>{sendingMessage ? 'Sending...' : 'Send'}</span>
//                     </button>
//                   </div>
//                 </div>
//               </div>

//               {/* Quick Actions */}
//               <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//                 <button className="p-4 bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20 hover:bg-white/20 transition-colors text-center">
//                   <div className="text-2xl mb-2">📅</div>
//                   <div className="text-white font-medium">Schedule Meeting</div>
//                   <div className="text-blue-200 text-sm">Book a parent-teacher conference</div>
//                 </button>
//                 <button className="p-4 bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20 hover:bg-white/20 transition-colors text-center">
//                   <div className="text-2xl mb-2">📊</div>
//                   <div className="text-white font-medium">Progress Report</div>
//                   <div className="text-blue-200 text-sm">Request detailed progress report</div>
//                 </button>
//                 <button className="p-4 bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20 hover:bg-white/20 transition-colors text-center">
//                   <div className="text-2xl mb-2">🎯</div>
//                   <div className="text-white font-medium">Learning Goals</div>
//                   <div className="text-blue-200 text-sm">Discuss learning objectives</div>
//                 </button>
//               </div>
//             </div>
//           )}

//           {/* Settings Tab */}
//           {activeTab === 'settings' && (
//             <div className="text-center py-20">
//               <div className="text-6xl mb-6">⚙️</div>
//               <h2 className="text-3xl font-bold text-white mb-4">Parent Settings</h2>
//               <p className="text-blue-200 mb-8">Manage notifications and account preferences</p>
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl mx-auto">
//                 <div className="p-6 bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20">
//                   <div className="text-blue-300 text-3xl mb-3">📧</div>
//                   <div className="text-white font-bold">Email Notifications</div>
//                   <div className="text-blue-200 text-sm">Weekly progress reports</div>
//                 </div>
//                 <div className="p-6 bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20">
//                   <div className="text-green-300 text-3xl mb-3">⏰</div>
//                   <div className="text-white font-bold">Screen Time Limits</div>
//                   <div className="text-blue-200 text-sm">Set daily learning goals</div>
//                 </div>
//               </div>
//             </div>
//           )}
//         </main>
//       </div>
//     </div>
//   );
// };

// export default ParentDashboard;





import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
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
  Phone,
  AlertCircle,
  RefreshCw,
  ChevronRight
} from 'lucide-react';
import { collection, query, where, getDocs, doc, getDoc } from 'firebase/firestore';
import { db } from './firebase';
import { progressService } from '../services/progressService';

const ParentDashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [parentData, setParentData] = useState(null);
  const [studentsData, setStudentsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [noStudentsFound, setNoStudentsFound] = useState(false);
  const [messages, setMessages] = useState([]);
  const [messageLoading, setMessageLoading] = useState(false);
  
  // Teacher communication states
  const [teachers, setTeachers] = useState([]);
  const [selectedTeacher, setSelectedTeacher] = useState(null);
  const [teacherMessages, setTeacherMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [sendingMessage, setSendingMessage] = useState(false);

  // Load parent data and students on component mount
  useEffect(() => {
    loadParentData();
  }, []);

  // Load teachers when chat tab is active
  useEffect(() => {
    if (activeTab === 'chat') {
      loadTeachers();
    }
  }, [activeTab]);

  // Subscribe to messages when a teacher is selected
  useEffect(() => {
    let unsubscribe;
    
    if (selectedTeacher && parentData) {
      // Subscribe to real-time messages
      unsubscribe = progressService.subscribeToMessages(
        parentData.email,
        selectedTeacher.email,
        (messages) => {
          setTeacherMessages(messages);
          // Mark messages as read
          progressService.markMessagesAsRead(parentData.email, selectedTeacher.email);
        }
      );
    }
    
    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, [selectedTeacher, parentData]);

  const loadParentData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Get parent data from session storage
      const parentString = sessionStorage.getItem('user');
      if (!parentString) {
        navigate('/login');
        return;
      }

      const parent = JSON.parse(parentString);
      
      // Verify this is a parent account
      if (parent.role !== 'parent') {
        navigate('/login');
        return;
      }

      setParentData(parent);
      
      // Fetch students whose parentEmail matches this parent's email
      await fetchStudentsData(parent.email);
      
    } catch (err) {
      console.error('Error loading parent data:', err);
      setError(`Failed to load data: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const loadTeachers = async () => {
    try {
      console.log('Loading teachers...');
      // Query users collection for all teachers
      const teachersQuery = query(
        collection(db, 'users'),
        where('role', '==', 'teacher')
      );
      
      const teachersSnapshot = await getDocs(teachersQuery);
      
      const teachersList = [];
      teachersSnapshot.forEach((doc) => {
        const teacherData = doc.data();
        teachersList.push({
          id: doc.id,
          email: teacherData.email,
          name: teacherData.username || 'Teacher',
          avatar: '👩‍🏫',
          title: 'Master Teacher',
          subjects: ['Coding Basics', 'Problem Solving'], // Could be extended with actual data
          students: teacherData.students || 0
        });
      });
      
      console.log('Loaded teachers:', teachersList);
      setTeachers(teachersList);
      
      // If there's only one teacher, auto-select them
      if (teachersList.length === 1) {
        setSelectedTeacher(teachersList[0]);
      }
    } catch (err) {
      console.error('Error loading teachers:', err);
      setError('Failed to load teachers. Please try again.');
    }
  };

  const fetchStudentsData = async (parentEmail) => {
    try {
      // Query users collection for students with matching parentEmail
      const usersQuery = query(
        collection(db, 'users'),
        where('parentEmail', '==', parentEmail),
        where('role', '==', 'student')
      );
      
      const usersSnapshot = await getDocs(usersQuery);
      
      if (usersSnapshot.empty) {
        setNoStudentsFound(true);
        setStudentsData([]);
        return;
      }

      const students = [];
      
      // For each student, fetch their progress data
      for (const userDoc of usersSnapshot.docs) {
        const studentData = userDoc.data();
        
        // Fetch progress data for this student
        const progressData = await progressService.getUserProgress(userDoc.id);
        
        // Get achievements
        const allAchievements = progressService.getAllAchievements();
        const earnedAchievements = progressData?.achievements || [];
        const earnedIds = Array.isArray(earnedAchievements) 
          ? earnedAchievements.map(achievement => achievement.id || achievement)
          : [];

        const achievements = allAchievements.map(achievement => ({
          ...achievement,
          earned: earnedIds.includes(achievement.id),
          earnedAt: earnedAchievements.find(earned => earned.id === achievement.id)?.earnedAt
        }));

        // Calculate world progress
        const worldProgress = [];
        if (progressData?.worlds) {
          const worldsData = progressData.worlds;
          worldProgress.push(
            {
              name: "Village Basics",
              icon: "🏘️",
              progress: worldsData.village?.progress || 0,
              completed: worldsData.village?.progress === 100
            },
            {
              name: "Forest Decisions",
              icon: "🌲",
              progress: worldsData.forest?.progress || 0,
              completed: worldsData.forest?.progress === 100
            },
            {
              name: "Mountain Challenges",
              icon: "⛰️",
              progress: worldsData.mountain?.progress || 0,
              completed: worldsData.mountain?.progress === 100
            }
          );
        }

        // Calculate current world
        let currentWorld = "Village Basics";
        if (progressData?.worlds) {
          if (progressData.worlds.forest?.unlocked) {
            currentWorld = "Forest Decisions";
          }
          if (progressData.worlds.mountain?.unlocked) {
            currentWorld = "Mountain Challenges";
          }
        }

        // Calculate weekly activity (mock data for now)
        const weeklyActivity = [
          { day: 'Mon', completed: Math.random() > 0.5, time: '45 min' },
          { day: 'Tue', completed: Math.random() > 0.5, time: '30 min' },
          { day: 'Wed', completed: Math.random() > 0.5, time: '40 min' },
          { day: 'Thu', completed: Math.random() > 0.5, time: '25 min' },
          { day: 'Fri', completed: Math.random() > 0.5, time: '35 min' },
          { day: 'Sat', completed: Math.random() > 0.5, time: '20 min' },
          { day: 'Sun', completed: Math.random() > 0.5, time: '30 min' }
        ];

        const completedThisWeek = weeklyActivity.filter(day => day.completed).length;

        const studentWithProgress = {
          id: userDoc.id,
          name: studentData.username || 'Unknown Student',
          email: studentData.email,
          avatar: "👧", // Could be customized based on student data
          age: studentData.age || 10,
          rank: progressData?.rank || 'Novice Wizard',
          level: Math.floor((progressData?.totalLevelsCompleted || 0) / 3) + 1,
          progress: Math.round(((progressData?.totalLevelsCompleted || 0) / 9) * 100),
          totalStars: progressData?.totalStars || 0,
          completedLevels: progressData?.totalLevelsCompleted || 0,
          currentWorld,
          lastActive: progressData?.lastPlayed ? new Date(progressData.lastPlayed.seconds * 1000).toLocaleDateString() : 'Never',
          weeklyGoal: 5,
          weeklyProgress: completedThisWeek,
          streakDays: progressData?.currentStreak || 0,
          achievements: achievements.filter(a => a.earned),
          worldProgress,
          weeklyActivity,
          parentName: studentData.parentName || 'Parent',
          parentEmail: studentData.parentEmail
        };

        students.push(studentWithProgress);
      }

      setStudentsData(students);
      setNoStudentsFound(students.length === 0);
      
    } catch (err) {
      console.error('Error fetching students data:', err);
      setError(`Failed to fetch students: ${err.message}`);
    }
  };

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

  const handleLogout = () => {
    sessionStorage.clear();
    navigate('/login');
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    
    if (!newMessage.trim() || !selectedTeacher || !parentData) return;
    
    try {
      setSendingMessage(true);
      
      await progressService.sendParentReply(
        parentData.email,
        selectedTeacher.email,
        newMessage.trim()
      );
      
      setNewMessage('');
    } catch (err) {
      console.error('Error sending message:', err);
      setError('Failed to send message. Please try again.');
    } finally {
      setSendingMessage(false);
    }
  };

  const sidebarItems = [
    { id: 'dashboard', icon: Home, label: 'Dashboard', path: '/parent-dashboard' },
    { id: 'profile', icon: User, label: 'My Children', path: '/child-profile' },
    { id: 'chat', icon: MessageCircle, label: 'Teacher Chat', path: '/teacher-chat' },
    { id: 'settings', icon: Settings, label: 'Settings', path: '/parent-settings' },
    { id: 'logout', icon: LogOut, label: 'Logout', path: '/logout', type: 'logout' }
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

          {/* Parent Profile */}
          {isSidebarOpen && parentData && (
            <div className="p-4 border-b border-white/10">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-r from-pink-400 to-purple-500 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold">👨‍👩‍👧</span>
                </div>
                <div>
                  <div className="text-white font-medium">{parentData.username || 'Parent'}</div>
                  <div className="text-blue-200 text-sm">Parent Portal</div>
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
                {loading ? 'Loading...' : studentsData.length > 0 ? 'Your Children\'s Journey' : 'Parent Dashboard'}
              </h1>
              <p className="text-blue-200 mt-1">
                {loading ? 'Please wait...' : studentsData.length > 0 ? 
                  `Track ${studentsData.length} student${studentsData.length !== 1 ? 's' : ''} magical coding adventure` : 
                  'Welcome to your parent dashboard'}
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={loadParentData}
                disabled={loading}
                className="flex items-center space-x-2 px-4 py-2 bg-blue-500/20 hover:bg-blue-500/30 text-blue-300 rounded-lg transition-colors disabled:opacity-50"
              >
                <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                <span>Refresh</span>
              </button>
              {parentData && (
                <div className="bg-gradient-to-r from-purple-400 to-pink-500 px-4 py-2 rounded-xl">
                  <span className="text-white font-bold flex items-center space-x-1">
                    <User className="w-4 h-4" />
                    <span>{parentData.username || 'Parent'}</span>
                  </span>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Dashboard Content */}
        <main className="p-6">
          {loading && (
            <div className="flex items-center justify-center py-20">
              <div className="text-center">
                <div className="w-16 h-16 border-4 border-white border-t-transparent rounded-full animate-spin mb-4"></div>
                <div className="text-white text-xl">Loading student data...</div>
              </div>
            </div>
          )}

          {error && (
            <div className="flex items-center justify-center py-20">
              <div className="text-center">
                <AlertCircle className="w-16 h-16 text-red-400 mb-4 mx-auto" />
                <div className="text-white text-xl mb-2">Error Loading Data</div>
                <div className="text-red-300 mb-4">{error}</div>
                <button 
                  onClick={loadParentData}
                  className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                >
                  Try Again
                </button>
              </div>
            </div>
          )}

          {!loading && !error && noStudentsFound && (
            <div className="flex items-center justify-center py-20">
              <div className="text-center">
                <div className="text-8xl mb-6">👨‍👩‍👧‍👦</div>
                <div className="text-white text-2xl font-bold mb-4">No Student Information Available</div>
                <div className="text-blue-200 mb-6 max-w-md mx-auto">
                  No students have registered with your email address as their parent contact. 
                  Please ask your child to update their profile with your email address.
                </div>
                <button 
                  onClick={loadParentData}
                  className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                >
                  Refresh Data
                </button>
              </div>
            </div>
          )}

          {!loading && !error && !noStudentsFound && activeTab === 'dashboard' && (
            <div className="space-y-8">
              {/* Students Overview Cards */}
              {studentsData.map((student, index) => (
                <div key={student.id} className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-3xl p-8 text-white">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-6">
                      <div className="text-6xl">{student.avatar}</div>
                      <div>
                        <h2 className="text-3xl font-bold">{student.name}</h2>
                        <div className="flex items-center space-x-4 mt-2">
                          <span className="flex items-center space-x-1">
                            <Crown className="w-5 h-5" />
                            <span className="font-medium">{student.rank}</span>
                          </span>
                          <span className="text-purple-200">Level {student.level}</span>
                          <span className="text-purple-200">Age {student.age}</span>
                        </div>
                        <div className="text-purple-200 text-sm mt-1">Last active: {student.lastActive}</div>
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-4xl font-bold">{student.progress}%</div>
                      <div className="text-purple-200">Overall Progress</div>
                    </div>
                  </div>
                  
                  {/* Student Quick Stats */}
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6">
                    <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 text-center">
                      <div className="text-2xl font-bold">{student.completedLevels}</div>
                      <div className="text-purple-200 text-sm">Levels Complete</div>
                    </div>
                    <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 text-center">
                      <div className="text-2xl font-bold">{student.totalStars}</div>
                      <div className="text-purple-200 text-sm">Stars Earned</div>
                    </div>
                    <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 text-center">
                      <div className="text-2xl font-bold">{student.currentWorld}</div>
                      <div className="text-purple-200 text-sm">Current World</div>
                    </div>
                    <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 text-center">
                      <div className="text-2xl font-bold flex items-center justify-center space-x-1">
                        <Heart className="w-5 h-5" />
                        <span>{student.streakDays}</span>
                      </div>
                      <div className="text-purple-200 text-sm">Day Streak</div>
                    </div>
                  </div>
                </div>
              ))}

              {/* Combined Family Stats */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="bg-white/10 backdrop-blur-sm rounded-3xl p-6 border border-white/20 text-center">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-400 to-indigo-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <Target className="w-6 h-6 text-white" />
                  </div>
                  <div className="text-2xl font-bold text-white">
                    {studentsData.reduce((total, student) => total + student.completedLevels, 0)}
                  </div>
                  <div className="text-blue-200 text-sm">Total Levels Complete</div>
                </div>

                <div className="bg-white/10 backdrop-blur-sm rounded-3xl p-6 border border-white/20 text-center">
                  <div className="w-12 h-12 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <Star className="w-6 h-6 text-white" />
                  </div>
                  <div className="text-2xl font-bold text-white">
                    {studentsData.reduce((total, student) => total + student.totalStars, 0)}
                  </div>
                  <div className="text-blue-200 text-sm">Total Stars Earned</div>
                </div>

                <div className="bg-white/10 backdrop-blur-sm rounded-3xl p-6 border border-white/20 text-center">
                  <div className="w-12 h-12 bg-gradient-to-r from-green-400 to-emerald-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <BookOpen className="w-6 h-6 text-white" />
                  </div>
                  <div className="text-2xl font-bold text-white">{studentsData.length}</div>
                  <div className="text-blue-200 text-sm">Active Students</div>
                </div>

                <div className="bg-white/10 backdrop-blur-sm rounded-3xl p-6 border border-white/20 text-center">
                  <div className="w-12 h-12 bg-gradient-to-r from-purple-400 to-pink-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <TrendingUp className="w-6 h-6 text-white" />
                  </div>
                  <div className="text-2xl font-bold text-white">
                    {studentsData.reduce((total, student) => total + student.weeklyProgress, 0)}
                  </div>
                  <div className="text-blue-200 text-sm">Weekly Activities</div>
                </div>
              </div>

              {/* Recent Achievements from all students */}
              <div className="bg-white/10 backdrop-blur-sm rounded-3xl p-6 border border-white/20">
                <h3 className="text-xl font-bold text-white mb-6 flex items-center space-x-2">
                  <Trophy className="w-5 h-5" />
                  <span>Recent Achievements</span>
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {studentsData.slice(0, 3).map((student, studentIndex) => (
                    student.achievements.slice(0, 3).map((achievement, achIndex) => (
                      <div key={`${studentIndex}-${achIndex}`} className="bg-gradient-to-r from-green-500/20 to-emerald-500/20 border border-green-400/30 rounded-2xl p-4">
                        <div className="text-center">
                          <div className="text-3xl mb-2">{achievement.icon}</div>
                          <h4 className="text-green-300 font-bold mb-1">{achievement.name}</h4>
                          <p className="text-green-200 text-sm mb-2">{achievement.description}</p>
                          <span className="text-green-300 text-xs">{student.name}</span>
                        </div>
                      </div>
                    ))
                  )).flat().slice(0, 6)}
                  {studentsData.every(student => student.achievements.length === 0) && (
                    <div className="col-span-full text-center py-8">
                      <div className="text-4xl mb-4">🏆</div>
                      <div className="text-white/60">No achievements yet. Keep learning!</div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* My Children Tab */}
          {!loading && !error && !noStudentsFound && activeTab === 'profile' && (
            <div className="space-y-8">
              {studentsData.map((student, index) => (
                <div key={student.id} className="bg-white/10 backdrop-blur-sm rounded-3xl p-8 border border-white/20">
                  <div className="text-center mb-8">
                    <div className="text-8xl mb-4">{student.avatar}</div>
                    <h2 className="text-3xl font-bold text-white">{student.name}</h2>
                    <p className="text-blue-200 mt-2">Age {student.age} • {student.rank}</p>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-4">
                      <h3 className="text-xl font-bold text-white">Learning Progress</h3>
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span className="text-blue-200">Current Level</span>
                          <span className="text-white font-bold">Level {student.level}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-blue-200">Overall Progress</span>
                          <span className="text-white font-bold">{student.progress}%</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-blue-200">Stars Collected</span>
                          <span className="text-white font-bold">{student.totalStars} stars</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-blue-200">Learning Streak</span>
                          <span className="text-white font-bold">{student.streakDays} days</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      <h3 className="text-xl font-bold text-white">Current Focus</h3>
                      <div className="bg-white/5 rounded-2xl p-4">
                        <div className="text-blue-200 text-sm">Currently Learning</div>
                        <div className="text-white font-bold text-lg">{student.currentWorld}</div>
                        <div className="text-blue-300 text-sm mt-1">
                          {student.currentWorld === 'Village Basics' && 'Variables & Basic Programming'}
                          {student.currentWorld === 'Forest Decisions' && 'Conditional Logic & Decision Making'}
                          {student.currentWorld === 'Mountain Challenges' && 'Loops & Repetition'}
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* World Progress for this student */}
                  <div className="mt-8">
                    <h3 className="text-xl font-bold text-white mb-4">World Progress</h3>
                    <div className="space-y-4">
                      {student.worldProgress.map((world, worldIndex) => (
                        <div key={worldIndex} className="space-y-2">
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
              ))}
            </div>
          )}

          {/* Teacher Chat Tab */}
          {activeTab === 'chat' && (
            <div className="h-[calc(100vh-200px)]">
              <div className="flex h-full bg-white/5 backdrop-blur-sm rounded-3xl border border-white/20 overflow-hidden">
                {/* Teachers List */}
                <div className="w-1/3 border-r border-white/10 flex flex-col">
                  <div className="p-4 border-b border-white/10">
                    <h3 className="text-xl font-bold text-white mb-2">Available Teachers</h3>
                    <p className="text-blue-200 text-sm">Select a teacher to communicate</p>
                  </div>
                  
                  <div className="flex-1 overflow-y-auto">
                    {teachers.length > 0 ? (
                      teachers.map((teacher) => (
                        <div
                          key={teacher.id}
                          onClick={() => setSelectedTeacher(teacher)}
                          className={`p-4 border-b border-white/5 cursor-pointer transition-colors ${
                            selectedTeacher?.id === teacher.id 
                              ? 'bg-purple-500/20 border-purple-500/30' 
                              : 'hover:bg-white/5'
                          }`}
                        >
                          <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full flex items-center justify-center">
                              <span className="text-2xl">{teacher.avatar}</span>
                            </div>
                            <div className="flex-1">
                              <div className="text-white font-medium">{teacher.name}</div>
                              <div className="text-blue-200 text-sm">{teacher.title}</div>
                              <div className="text-blue-300 text-xs">{teacher.email}</div>
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="p-8 text-center">
                        <div className="text-4xl mb-4">👩‍🏫</div>
                        <div className="text-white font-medium mb-2">No Teachers Available</div>
                        <div className="text-blue-200 text-sm">Teachers will appear here once they register.</div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Chat Area */}
                <div className="flex-1 flex flex-col">
                  {selectedTeacher ? (
                    <>
                      {/* Chat Header */}
                      <div className="p-4 border-b border-white/10 bg-white/5">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full flex items-center justify-center">
                              <span className="text-2xl">{selectedTeacher.avatar}</span>
                            </div>
                            <div>
                              <div className="text-white font-medium">{selectedTeacher.name}</div>
                              <div className="text-blue-200 text-sm">{selectedTeacher.title}</div>
                            </div>
                          </div>
                          <button className="p-2 bg-white/10 rounded-full hover:bg-white/20 transition-colors">
                            <Phone className="w-5 h-5 text-white" />
                          </button>
                        </div>
                      </div>

                      {/* Messages */}
                      <div className="flex-1 overflow-y-auto p-4 space-y-4">
                        {teacherMessages.length > 0 ? (
                          teacherMessages.map((message) => (
                            <div
                              key={message.id}
                              className={`flex ${message.senderRole === 'parent' ? 'justify-end' : 'justify-start'}`}
                            >
                              <div
                                className={`max-w-xs lg:max-w-md px-4 py-2 rounded-2xl ${
                                  message.senderRole === 'parent'
                                    ? 'bg-purple-500 text-white'
                                    : 'bg-white/10 text-white'
                                }`}
                              >
                                <div className="text-sm">{message.message}</div>
                                <div className={`text-xs mt-1 ${
                                  message.senderRole === 'parent' ? 'text-purple-200' : 'text-blue-300'
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
                            <div className="text-blue-200 text-sm">Start a conversation with {selectedTeacher.name}</div>
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
                            placeholder={`Type your message to ${selectedTeacher.name}...`}
                            className="flex-1 px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-blue-200 focus:outline-none focus:ring-2 focus:ring-purple-500"
                            disabled={sendingMessage}
                          />
                          <button
                            type="submit"
                            disabled={sendingMessage || !newMessage.trim()}
                            className="px-6 py-3 bg-purple-500 hover:bg-purple-600 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-xl transition-colors flex items-center space-x-2"
                          >
                            {sendingMessage ? (
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
                        <div className="text-white font-medium mb-2">Select a Teacher</div>
                        <div className="text-blue-200 text-sm">Choose a teacher from the list to start messaging</div>
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