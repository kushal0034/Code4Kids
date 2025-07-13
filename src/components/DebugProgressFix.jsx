// src/components/DebugProgressFix.jsx
import React, { useState } from 'react';
import { progressService } from '../services/progressService';
import { RefreshCw, Database, CheckCircle, AlertTriangle } from 'lucide-react';

const DebugProgressFix = () => {
  const [status, setStatus] = useState('');
  const [isFixing, setIsFixing] = useState(false);
  const [progressData, setProgressData] = useState(null);

  const user = progressService.getCurrentUser();

  const checkProgress = async () => {
    if (!user) {
      setStatus('No user logged in');
      return;
    }

    try {
      const data = await progressService.getUserProgress(user.uid);
      setProgressData(data);
      setStatus('Progress data loaded successfully');
      console.log('Current progress data:', data);
    } catch (error) {
      setStatus(`Error loading progress: ${error.message}`);
      console.error('Progress loading error:', error);
    }
  };

  const fixProgressStructure = async () => {
    if (!user) {
      setStatus('No user logged in');
      return;
    }

    setIsFixing(true);
    try {
      // Initialize or fix progress structure
      const fixedProgress = await progressService.initializeUserProgress(user.uid);
      setProgressData(fixedProgress);
      setStatus('Progress structure fixed and initialized');
      console.log('Fixed progress data:', fixedProgress);
    } catch (error) {
      setStatus(`Error fixing progress: ${error.message}`);
      console.error('Progress fix error:', error);
    } finally {
      setIsFixing(false);
    }
  };

  const resetProgress = async () => {
    if (!user) {
      setStatus('No user logged in');
      return;
    }

    if (!window.confirm('Are you sure you want to reset all progress? This cannot be undone.')) {
      return;
    }

    setIsFixing(true);
    try {
      // Delete existing progress and recreate
      await progressService.initializeUserProgress(user.uid);
      setStatus('Progress reset successfully');
      setProgressData(null);
    } catch (error) {
      setStatus(`Error resetting progress: ${error.message}`);
    } finally {
      setIsFixing(false);
    }
  };

  const fixAchievementsArray = async () => {
    if (!user || !progressData) {
      setStatus('No user or progress data available');
      return;
    }

    setIsFixing(true);
    try {
      const { doc, updateDoc } = await import('firebase/firestore');
      const { db } = await import('../pages/firebase');
      
      // Ensure achievements is always an array
      const updateData = {
        achievements: Array.isArray(progressData.achievements) ? progressData.achievements : []
      };

      await updateDoc(doc(db, 'userProgress', user.uid), updateData);
      setStatus('Achievements array structure fixed');
      
      // Reload data
      await checkProgress();
    } catch (error) {
      setStatus(`Error fixing achievements: ${error.message}`);
    } finally {
      setIsFixing(false);
    }
  };

  return (
    <div className="fixed top-4 right-4 w-80 max-h-96 overflow-y-auto bg-slate-900/95 backdrop-blur-sm rounded-2xl border border-white/20 p-4 z-50">
      <div className="flex items-center space-x-2 mb-4">
        <Database className="w-5 h-5 text-blue-400" />
        <h3 className="text-white font-bold">Debug Progress Fix</h3>
      </div>

      {user && (
        <div className="mb-4 p-3 bg-blue-500/10 border border-blue-400/30 rounded-lg">
          <div className="text-blue-300 text-sm">User: {user.username}</div>
          <div className="text-white text-xs">ID: {user.uid}</div>
        </div>
      )}

      <div className="space-y-3">
        <button
          onClick={checkProgress}
          className="w-full flex items-center space-x-2 p-3 bg-blue-500/20 border border-blue-400/30 rounded-lg hover:bg-blue-500/30 transition-colors text-white"
        >
          <RefreshCw className="w-4 h-4" />
          <span>Check Progress Data</span>
        </button>

        <button
          onClick={fixProgressStructure}
          disabled={isFixing}
          className="w-full flex items-center space-x-2 p-3 bg-green-500/20 border border-green-400/30 rounded-lg hover:bg-green-500/30 transition-colors text-white disabled:opacity-50"
        >
          <CheckCircle className="w-4 h-4" />
          <span>{isFixing ? 'Fixing...' : 'Fix/Initialize Progress'}</span>
        </button>

        <button
          onClick={fixAchievementsArray}
          disabled={isFixing || !progressData}
          className="w-full flex items-center space-x-2 p-3 bg-yellow-500/20 border border-yellow-400/30 rounded-lg hover:bg-yellow-500/30 transition-colors text-white disabled:opacity-50"
        >
          <AlertTriangle className="w-4 h-4" />
          <span>Fix Achievements Array</span>
        </button>

        <button
          onClick={resetProgress}
          disabled={isFixing}
          className="w-full flex items-center space-x-2 p-3 bg-red-500/20 border border-red-400/30 rounded-lg hover:bg-red-500/30 transition-colors text-white disabled:opacity-50"
        >
          <RefreshCw className="w-4 h-4" />
          <span>Reset All Progress</span>
        </button>
      </div>

      {status && (
        <div className="mt-4 p-3 bg-gray-500/20 border border-gray-400/30 rounded-lg">
          <div className="text-white text-sm">{status}</div>
        </div>
      )}

      {progressData && (
        <div className="mt-4 p-3 bg-purple-500/20 border border-purple-400/30 rounded-lg">
          <div className="text-purple-300 text-sm font-bold mb-2">Current Data Structure:</div>
          <div className="text-white text-xs space-y-1">
            <div>Levels: {progressData.totalLevelsCompleted || 0}</div>
            <div>Stars: {progressData.totalStars || 0}</div>
            <div>Achievements: {Array.isArray(progressData.achievements) ? progressData.achievements.length : 'Invalid'}</div>
            <div>Achievements Type: {typeof progressData.achievements}</div>
          </div>
        </div>
      )}

      <div className="mt-4 text-center">
        <button
          onClick={() => {
            const debugElement = document.querySelector('[data-debug-fix]');
            if (debugElement) debugElement.style.display = 'none';
          }}
          className="text-gray-400 hover:text-white text-sm"
        >
          Hide Debug Panel
        </button>
      </div>
    </div>
  );
};

export default DebugProgressFix;