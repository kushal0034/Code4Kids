// src/components/DatabaseTest.jsx
import React, { useState, useEffect } from 'react';
import { progressService } from '../services/progressService';
import { CheckCircle, XCircle, AlertCircle, RefreshCw } from 'lucide-react';

const DatabaseTest = () => {
  const [status, setStatus] = useState('testing');
  const [testResults, setTestResults] = useState({});
  const [user, setUser] = useState(null);

  useEffect(() => {
    runDatabaseTests();
  }, []);

  const runDatabaseTests = async () => {
    setStatus('testing');
    const results = {};

    try {
      // Test 1: User authentication
      const currentUser = progressService.getCurrentUser();
      results.userAuth = {
        status: currentUser ? 'success' : 'warning',
        message: currentUser ? `User authenticated: ${currentUser.username}` : 'No user logged in',
        user: currentUser
      };
      setUser(currentUser);

      if (currentUser) {
        // Test 2: Database connection
        try {
          const progressData = await progressService.getUserProgress(currentUser.uid);
          results.dbConnection = {
            status: 'success',
            message: 'Database connection successful',
            data: progressData ? 'User progress found' : 'No progress data yet'
          };

          // Test 3: Initialize progress if needed
          if (!progressData) {
            await progressService.initializeUserProgress(currentUser.uid);
            results.initialization = {
              status: 'success',
              message: 'User progress initialized successfully'
            };
          } else {
            results.initialization = {
              status: 'success',
              message: 'User progress already exists'
            };
          }

          // Test 4: Test level attempt recording
          try {
            await progressService.recordLevelAttempt(1, false, 0, 5000, [
              { id: 'test-block', type: 'test', text: 'Test Block' }
            ]);
            results.recordAttempt = {
              status: 'success',
              message: 'Level attempt recording works'
            };
          } catch (error) {
            results.recordAttempt = {
              status: 'error',
              message: `Recording failed: ${error.message}`
            };
          }

          // Test 5: Dashboard data retrieval
          try {
            const dashboardData = await progressService.getDashboardData(currentUser.uid);
            results.dashboardData = {
              status: 'success',
              message: 'Dashboard data retrieved successfully',
              data: `Levels completed: ${dashboardData.totalLevelsCompleted || 0}`
            };
          } catch (error) {
            results.dashboardData = {
              status: 'error',
              message: `Dashboard data failed: ${error.message}`
            };
          }

        } catch (error) {
          results.dbConnection = {
            status: 'error',
            message: `Database connection failed: ${error.message}`
          };
        }
      }

      setTestResults(results);
      
      // Determine overall status
      const hasErrors = Object.values(results).some(result => result.status === 'error');
      const hasWarnings = Object.values(results).some(result => result.status === 'warning');
      
      if (hasErrors) {
        setStatus('error');
      } else if (hasWarnings) {
        setStatus('warning');
      } else {
        setStatus('success');
      }

    } catch (error) {
      setStatus('error');
      setTestResults({
        general: {
          status: 'error',
          message: `General error: ${error.message}`
        }
      });
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'success':
        return <CheckCircle className="w-5 h-5 text-green-400" />;
      case 'warning':
        return <AlertCircle className="w-5 h-5 text-yellow-400" />;
      case 'error':
        return <XCircle className="w-5 h-5 text-red-400" />;
      default:
        return <RefreshCw className="w-5 h-5 text-blue-400 animate-spin" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'success':
        return 'border-green-400/30 bg-green-500/10';
      case 'warning':
        return 'border-yellow-400/30 bg-yellow-500/10';
      case 'error':
        return 'border-red-400/30 bg-red-500/10';
      default:
        return 'border-blue-400/30 bg-blue-500/10';
    }
  };

  return (
    <div className="fixed bottom-4 right-4 w-96 max-h-96 overflow-y-auto bg-slate-900/95 backdrop-blur-sm rounded-2xl border border-white/20 p-4 z-50">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-white font-bold flex items-center space-x-2">
          {getStatusIcon(status)}
          <span>Database Status</span>
        </h3>
        <button
          onClick={runDatabaseTests}
          className="text-blue-400 hover:text-blue-300 transition-colors"
          disabled={status === 'testing'}
        >
          <RefreshCw className={`w-4 h-4 ${status === 'testing' ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {user && (
        <div className="mb-4 p-3 bg-blue-500/10 border border-blue-400/30 rounded-lg">
          <div className="text-blue-300 text-sm font-medium">Current User</div>
          <div className="text-white text-sm">{user.username} ({user.role})</div>
        </div>
      )}

      <div className="space-y-3">
        {Object.entries(testResults).map(([testName, result]) => (
          <div key={testName} className={`p-3 rounded-lg border ${getStatusColor(result.status)}`}>
            <div className="flex items-center space-x-2 mb-1">
              {getStatusIcon(result.status)}
              <div className="text-white font-medium text-sm capitalize">
                {testName.replace(/([A-Z])/g, ' $1').trim()}
              </div>
            </div>
            <div className="text-white/80 text-xs">{result.message}</div>
            {result.data && (
              <div className="text-white/60 text-xs mt-1">{result.data}</div>
            )}
          </div>
        ))}
      </div>

      {status === 'success' && (
        <div className="mt-4 p-3 bg-green-500/10 border border-green-400/30 rounded-lg">
          <div className="text-green-300 text-sm font-medium">All Systems Ready!</div>
          <div className="text-green-200 text-xs">Database integration is working correctly</div>
        </div>
      )}

      {status === 'error' && (
        <div className="mt-4 p-3 bg-red-500/10 border border-red-400/30 rounded-lg">
          <div className="text-red-300 text-sm font-medium">Issues Detected</div>
          <div className="text-red-200 text-xs">Please check your Firebase configuration</div>
        </div>
      )}
    </div>
  );
};

export default DatabaseTest;