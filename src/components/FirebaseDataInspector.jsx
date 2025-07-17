// src/components/FirebaseDataInspector.jsx
import React, { useState, useEffect } from 'react';
import { progressService } from '../services/progressService';
import { doc, getDoc, getDocs, collection, query, where, orderBy, limit } from 'firebase/firestore';
import { db } from '../pages/firebase';
import { Database, Search, User, Award, Clock, AlertTriangle, CheckCircle, RefreshCw } from 'lucide-react';

const FirebaseDataInspector = () => {
  const [currentUser, setCurrentUser] = useState(null);
  const [userProgress, setUserProgress] = useState(null);
  const [gameSessions, setGameSessions] = useState([]);
  const [worldProgress, setWorldProgress] = useState({});
  const [levelProgress, setLevelProgress] = useState({});
  const [loading, setLoading] = useState(false);
  const [lastUpdate, setLastUpdate] = useState(null);
  const [issues, setIssues] = useState([]);

  const loadCurrentUserData = async () => {
    setLoading(true);
    setIssues([]);
    
    try {
      // Get current user from session
      const user = progressService.getCurrentUser();
      if (!user) {
        setIssues(prev => [...prev, 'No user currently logged in']);
        return;
      }
      setCurrentUser(user);

      // Get user progress data
      const progressData = await progressService.getUserProgress(user.uid);
      setUserProgress(progressData);

      if (!progressData) {
        setIssues(prev => [...prev, 'No progress data found for user']);
        return;
      }

      // Calculate detailed world progress
      const worldProgressCalc = {};
      const levelProgressCalc = {};
      
      if (progressData.worlds) {
        Object.entries(progressData.worlds).forEach(([worldKey, worldData]) => {
          const levels = Object.values(worldData.levels || {});
          const completedLevels = levels.filter(level => level.completed).length;
          const totalLevels = levels.length;
          const calculatedProgress = totalLevels > 0 ? Math.round((completedLevels / totalLevels) * 100) : 0;
          
          worldProgressCalc[worldKey] = {
            name: worldData.name,
            stored: worldData.progress,
            calculated: calculatedProgress,
            completedLevels,
            totalLevels,
            unlocked: worldData.unlocked,
            matches: worldData.progress === calculatedProgress
          };

          // Check individual levels
          Object.entries(worldData.levels || {}).forEach(([levelKey, levelData]) => {
            const levelId = parseInt(levelKey.replace('level', ''));
            levelProgressCalc[levelId] = {
              ...levelData,
              levelKey,
              worldKey,
              worldName: worldData.name
            };
          });

          // Check for issues
          if (worldData.progress !== calculatedProgress) {
            setIssues(prev => [...prev, 
              `${worldData.name}: Stored progress (${worldData.progress}%) doesn't match calculated progress (${calculatedProgress}%)`
            ]);
          }

          // Check for Level 6 specific issues
          if (worldKey === 'forest' && worldData.levels?.level6) {
            const level6 = worldData.levels.level6;
            if (level6.completed && !level6.unlocked) {
              setIssues(prev => [...prev, 'Level 6 is completed but marked as locked']);
            }
            if (level6.stars > 0 && !level6.completed) {
              setIssues(prev => [...prev, 'Level 6 has stars but not marked as completed']);
            }
          }
        });
      }

      setWorldProgress(worldProgressCalc);
      setLevelProgress(levelProgressCalc);

      // Get recent game sessions for this user
      try {
        const sessionsQuery = query(
          collection(db, 'gameSessions'),
          where('userId', '==', user.uid),
          orderBy('timestamp', 'desc'),
          limit(20)
        );
        const sessionDocs = await getDocs(sessionsQuery);
        const sessions = sessionDocs.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          timestamp: doc.data().timestamp?.toDate?.() || new Date(doc.data().timestamp)
        }));
        setGameSessions(sessions);

        // Check for Level 6 sessions
        const level6Sessions = sessions.filter(s => s.levelId === 6);
        if (level6Sessions.length > 0) {
          const level6SuccessfulSessions = level6Sessions.filter(s => s.success);
          if (level6SuccessfulSessions.length > 0 && !progressData.worlds?.forest?.levels?.level6?.completed) {
            setIssues(prev => [...prev, 
              `Found ${level6SuccessfulSessions.length} successful Level 6 sessions but level not marked as completed`
            ]);
          }
        }
      } catch (error) {
        console.error('Error fetching game sessions:', error);
        setIssues(prev => [...prev, `Failed to fetch game sessions: ${error.message}`]);
      }

      setLastUpdate(new Date());
    } catch (error) {
      console.error('Error loading user data:', error);
      setIssues(prev => [...prev, `Error loading data: ${error.message}`]);
    } finally {
      setLoading(false);
    }
  };

  const fixLevel6Progress = async () => {
    if (!currentUser || !userProgress) return;

    setLoading(true);
    try {
      // Force re-calculate Level 6 completion
      const level6Sessions = gameSessions.filter(s => s.levelId === 6 && s.success);
      if (level6Sessions.length > 0) {
        // Re-record the most recent successful attempt
        const latestSuccess = level6Sessions[0];
        await progressService.recordLevelAttempt(
          6,
          true,
          latestSuccess.stars || 1,
          latestSuccess.timeSpent || 60000,
          latestSuccess.codeBlocks || []
        );
        
        setIssues(prev => [...prev, 'Attempted to fix Level 6 progress by re-recording completion']);
        
        // Reload data
        setTimeout(() => loadCurrentUserData(), 2000);
      } else {
        setIssues(prev => [...prev, 'No successful Level 6 sessions found to fix']);
      }
    } catch (error) {
      setIssues(prev => [...prev, `Error fixing Level 6: ${error.message}`]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCurrentUserData();
  }, []);

  const formatTime = (ms) => {
    if (!ms) return 'N/A';
    const seconds = Math.floor(ms / 1000);
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return minutes > 0 ? `${minutes}m ${remainingSeconds}s` : `${seconds}s`;
  };

  return (
    <div className="fixed top-4 left-4 w-96 max-h-[90vh] overflow-y-auto bg-slate-900/95 backdrop-blur-sm rounded-2xl border border-white/20 p-4 z-50">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <Database className="w-5 h-5 text-blue-400" />
          <h3 className="text-white font-bold">Firebase Data Inspector</h3>
        </div>
        <button
          onClick={loadCurrentUserData}
          disabled={loading}
          className="text-blue-400 hover:text-blue-300 transition-colors"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {/* Current User */}
      {currentUser && (
        <div className="mb-4 p-3 bg-blue-500/10 border border-blue-400/30 rounded-lg">
          <div className="flex items-center space-x-2 mb-2">
            <User className="w-4 h-4 text-blue-300" />
            <span className="text-blue-300 text-sm font-bold">Current User</span>
          </div>
          <div className="text-white text-sm">{currentUser.username}</div>
          <div className="text-white/60 text-xs">ID: {currentUser.uid}</div>
          <div className="text-white/60 text-xs">Role: {currentUser.role}</div>
        </div>
      )}

      {/* Issues */}
      {issues.length > 0 && (
        <div className="mb-4 p-3 bg-red-500/10 border border-red-400/30 rounded-lg">
          <div className="flex items-center space-x-2 mb-2">
            <AlertTriangle className="w-4 h-4 text-red-300" />
            <span className="text-red-300 text-sm font-bold">Issues Found ({issues.length})</span>
          </div>
          <div className="space-y-1 max-h-32 overflow-y-auto">
            {issues.map((issue, index) => (
              <div key={index} className="text-red-200 text-xs">{issue}</div>
            ))}
          </div>
          {issues.some(issue => issue.includes('Level 6')) && (
            <button
              onClick={fixLevel6Progress}
              disabled={loading}
              className="mt-2 px-3 py-1 bg-red-500/20 text-red-300 rounded text-xs hover:bg-red-500/30 transition-colors"
            >
              Fix Level 6 Progress
            </button>
          )}
        </div>
      )}

      {/* Overall Progress */}
      {userProgress && (
        <div className="mb-4 p-3 bg-green-500/10 border border-green-400/30 rounded-lg">
          <div className="flex items-center space-x-2 mb-2">
            <Award className="w-4 h-4 text-green-300" />
            <span className="text-green-300 text-sm font-bold">Overall Progress</span>
          </div>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div>
              <div className="text-white/60">Levels Completed</div>
              <div className="text-white font-bold">{userProgress.totalLevelsCompleted || 0}/9</div>
            </div>
            <div>
              <div className="text-white/60">Total Stars</div>
              <div className="text-white font-bold">{userProgress.totalStars || 0}/27</div>
            </div>
            <div>
              <div className="text-white/60">Current Rank</div>
              <div className="text-white font-bold">{userProgress.rank || 'N/A'}</div>
            </div>
            <div>
              <div className="text-white/60">Achievements</div>
              <div className="text-white font-bold">{userProgress.achievements?.length || 0}</div>
            </div>
          </div>
        </div>
      )}

      {/* World Progress Details */}
      {Object.keys(worldProgress).length > 0 && (
        <div className="mb-4 p-3 bg-purple-500/10 border border-purple-400/30 rounded-lg">
          <div className="flex items-center space-x-2 mb-2">
            <Search className="w-4 h-4 text-purple-300" />
            <span className="text-purple-300 text-sm font-bold">World Progress Analysis</span>
          </div>
          <div className="space-y-2">
            {Object.entries(worldProgress).map(([worldKey, worldData]) => (
              <div key={worldKey} className="text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-white font-medium">{worldData.name}</span>
                  <span className={`px-2 py-1 rounded text-xs ${
                    worldData.matches ? 'bg-green-500/20 text-green-300' : 'bg-red-500/20 text-red-300'
                  }`}>
                    {worldData.matches ? '✓' : '!'}
                  </span>
                </div>
                <div className="text-white/60">
                  Stored: {worldData.stored}% | Calculated: {worldData.calculated}%
                </div>
                <div className="text-white/60">
                  Completed: {worldData.completedLevels}/{worldData.totalLevels} | 
                  Unlocked: {worldData.unlocked ? 'Yes' : 'No'}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Level 6 Specific Analysis */}
      {levelProgress[6] && (
        <div className="mb-4 p-3 bg-orange-500/10 border border-orange-400/30 rounded-lg">
          <div className="flex items-center space-x-2 mb-2">
            <CheckCircle className="w-4 h-4 text-orange-300" />
            <span className="text-orange-300 text-sm font-bold">Level 6 Details</span>
          </div>
          <div className="space-y-1 text-xs">
            <div className="flex justify-between">
              <span className="text-white/60">Completed:</span>
              <span className={levelProgress[6].completed ? 'text-green-300' : 'text-red-300'}>
                {levelProgress[6].completed ? 'Yes' : 'No'}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-white/60">Unlocked:</span>
              <span className={levelProgress[6].unlocked ? 'text-green-300' : 'text-red-300'}>
                {levelProgress[6].unlocked ? 'Yes' : 'No'}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-white/60">Stars:</span>
              <span className="text-white">{levelProgress[6].stars || 0}/3</span>
            </div>
            <div className="flex justify-between">
              <span className="text-white/60">Attempts:</span>
              <span className="text-white">{levelProgress[6].attempts || 0}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-white/60">Best Time:</span>
              <span className="text-white">{formatTime(levelProgress[6].bestTime)}</span>
            </div>
          </div>
        </div>
      )}

      {/* Recent Level 6 Sessions */}
      {gameSessions.filter(s => s.levelId === 6).length > 0 && (
        <div className="mb-4 p-3 bg-cyan-500/10 border border-cyan-400/30 rounded-lg">
          <div className="flex items-center space-x-2 mb-2">
            <Clock className="w-4 h-4 text-cyan-300" />
            <span className="text-cyan-300 text-sm font-bold">Level 6 Sessions</span>
          </div>
          <div className="space-y-1 max-h-32 overflow-y-auto">
            {gameSessions.filter(s => s.levelId === 6).slice(0, 5).map((session, index) => (
              <div key={index} className="text-xs">
                <div className="flex justify-between">
                  <span className={session.success ? 'text-green-300' : 'text-red-300'}>
                    {session.success ? '✓ Success' : '✗ Failed'}
                  </span>
                  <span className="text-white/60">
                    {session.timestamp.toLocaleDateString()} {session.timestamp.toLocaleTimeString()}
                  </span>
                </div>
                <div className="text-white/60">
                  Stars: {session.stars || 0} | Time: {formatTime(session.timeSpent)}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Last Update */}
      {lastUpdate && (
        <div className="text-center text-white/60 text-xs">
          Last updated: {lastUpdate.toLocaleTimeString()}
        </div>
      )}
    </div>
  );
};

export default FirebaseDataInspector;