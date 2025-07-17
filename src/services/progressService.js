// src/services/progressService.js
import { doc, setDoc, getDoc, updateDoc, arrayUnion, serverTimestamp } from 'firebase/firestore';
import { db } from '../pages/firebase';

class ProgressService {
  constructor() {
    this.currentUser = null;
  }

  // Initialize user from session storage
  getCurrentUser() {
    if (!this.currentUser) {
      const userString = sessionStorage.getItem('user');
      if (userString) {
        this.currentUser = JSON.parse(userString);
      }
    }
    return this.currentUser;
  }

  // Get user's progress document
  async getUserProgress(userId) {
    try {
      const progressDoc = await getDoc(doc(db, 'userProgress', userId));
      return progressDoc.exists() ? progressDoc.data() : null;
    } catch (error) {
      console.error('Error getting user progress:', error);
      return null;
    }
  }

  // Initialize user progress document
  async initializeUserProgress(userId) {
    try {
      const initialProgress = {
        userId: userId,
        totalStars: 0,
        totalLevelsCompleted: 0,
        currentStreak: 0,
        rank: 'Novice Wizard',
        worlds: {
          village: {
            name: 'Village Basics',
            progress: 0,
            unlocked: true,
            levels: {
              level1: { completed: false, stars: 0, attempts: 0, bestTime: null, unlocked: true },
              level2: { completed: false, stars: 0, attempts: 0, bestTime: null, unlocked: false },
              level3: { completed: false, stars: 0, attempts: 0, bestTime: null, unlocked: false }
            }
          },
          forest: {
            name: 'Forest Decisions',
            progress: 0,
            unlocked: false,
            levels: {
              level4: { completed: false, stars: 0, attempts: 0, bestTime: null, unlocked: false },
              level5: { completed: false, stars: 0, attempts: 0, bestTime: null, unlocked: false },
              level6: { completed: false, stars: 0, attempts: 0, bestTime: null, unlocked: false }
            }
          },
          mountain: {
            name: 'Mountain Challenges',
            progress: 0,
            unlocked: false,
            levels: {
              level7: { completed: false, stars: 0, attempts: 0, bestTime: null, unlocked: false },
              level8: { completed: false, stars: 0, attempts: 0, bestTime: null, unlocked: false },
              level9: { completed: false, stars: 0, attempts: 0, bestTime: null, unlocked: false }
            }
          }
        },
        achievements: [],
        lastPlayed: serverTimestamp(),
        createdAt: serverTimestamp()
      };

      await setDoc(doc(db, 'userProgress', userId), initialProgress);
      return initialProgress;
    } catch (error) {
      console.error('Error initializing user progress:', error);
      throw error;
    }
  }

  // Record level attempt
  async recordLevelAttempt(levelId, success, stars = 0, timeSpent = 0, codeBlocks = []) {
    const user = this.getCurrentUser();
    if (!user) {
      throw new Error('User not authenticated');
    }

    console.log(`Recording level attempt: Level ${levelId}, Success: ${success}, Stars: ${stars}`);

    try {
      const progressRef = doc(db, 'userProgress', user.uid);
      let progressData = await this.getUserProgress(user.uid);

      // Initialize progress if it doesn't exist
      if (!progressData) {
        progressData = await this.initializeUserProgress(user.uid);
      }

      // Determine world and level
      const { world, level } = this.getLevelPath(levelId);
      
      if (!progressData.worlds[world] || !progressData.worlds[world].levels[level]) {
        throw new Error(`Invalid level path: ${world}/${level}`);
      }

      const currentLevelData = progressData.worlds[world].levels[level];
      const updatedLevelData = {
        ...currentLevelData,
        attempts: (currentLevelData.attempts || 0) + 1
      };

      // If successful, update completion data
      if (success) {
        updatedLevelData.completed = true;
        
        // Update stars if this is better than previous
        if (stars > (currentLevelData.stars || 0)) {
          updatedLevelData.stars = stars;
        }

        // Update best time if this is better
        if (!currentLevelData.bestTime || timeSpent < currentLevelData.bestTime) {
          updatedLevelData.bestTime = timeSpent;
        }

        // Check for new achievements
        const newAchievements = this.checkAchievements(progressData, levelId, stars);
        
        // Update world progress
        const worldProgress = this.calculateWorldProgress(progressData.worlds[world]);
        
        // Prepare update data
        const updateData = {
          [`worlds.${world}.levels.${level}`]: updatedLevelData,
          [`worlds.${world}.progress`]: worldProgress,
          lastPlayed: serverTimestamp()
        };

        // Update total stats if level was not previously completed
        if (!currentLevelData.completed) {
          updateData.totalLevelsCompleted = (progressData.totalLevelsCompleted || 0) + 1;
          updateData.totalStars = (progressData.totalStars || 0) + stars;
          
          // Update rank based on total levels
          updateData.rank = this.calculateRank(updateData.totalLevelsCompleted);
          
          // Unlock next level in current world
          const nextLevel = this.getNextLevelInWorld(world, level);
          if (nextLevel) {
            updateData[`worlds.${world}.levels.${nextLevel}.unlocked`] = true;
          }

          // Unlock next world if current world is completed
          if (worldProgress === 100) {
            const nextWorld = this.getNextWorld(world);
            if (nextWorld) {
              updateData[`worlds.${nextWorld}.unlocked`] = true;
            }
          }
        } else {
          // Update stars if improved
          const starDifference = stars - currentLevelData.stars;
          if (starDifference > 0) {
            updateData.totalStars = (progressData.totalStars || 0) + starDifference;
          }
        }

        // Add new achievements
        if (newAchievements.length > 0) {
          // Get existing achievements array safely
          const existingAchievements = progressData.achievements || [];
          updateData.achievements = [...existingAchievements, ...newAchievements];
        }

        console.log('Updating progress with data:', updateData);
        await updateDoc(progressRef, updateData);

        // Record detailed session data
        await this.recordGameSession(user.uid, levelId, success, stars, timeSpent, codeBlocks);

        console.log('Progress updated successfully');
        return {
          success: true,
          newAchievements,
          worldProgress,
          newRank: updateData.rank || progressData.rank
        };
      } else {
        // Just record the attempt
        await updateDoc(progressRef, {
          [`worlds.${world}.levels.${level}.attempts`]: updatedLevelData.attempts,
          lastPlayed: serverTimestamp()
        });

        await this.recordGameSession(user.uid, levelId, success, 0, timeSpent, codeBlocks);

        return { success: false };
      }
    } catch (error) {
      console.error('Error recording level attempt:', error);
      throw error;
    }
  }

  // Record detailed game session
  async recordGameSession(userId, levelId, success, stars, timeSpent, codeBlocks) {
    try {
      const sessionData = {
        userId,
        levelId,
        success,
        stars,
        timeSpent,
        codeBlocks: codeBlocks.map(block => ({
          id: block.id,
          type: block.type,
          text: block.text
        })),
        timestamp: serverTimestamp()
      };

      await setDoc(doc(db, 'gameSessions', `${userId}_${Date.now()}`), sessionData);
    } catch (error) {
      console.error('Error recording game session:', error);
    }
  }

  // Helper method to get level path
  getLevelPath(levelId) {
    const levelMap = {
      1: { world: 'village', level: 'level1' },
      2: { world: 'village', level: 'level2' },
      3: { world: 'village', level: 'level3' },
      4: { world: 'forest', level: 'level4' },
      5: { world: 'forest', level: 'level5' },
      6: { world: 'forest', level: 'level6' },
      7: { world: 'mountain', level: 'level7' },
      8: { world: 'mountain', level: 'level8' },
      9: { world: 'mountain', level: 'level9' }
    };
    return levelMap[levelId];
  }

  // Calculate world progress percentage
  calculateWorldProgress(worldData) {
    const levels = Object.values(worldData.levels);
    const completedLevels = levels.filter(level => level.completed).length;
    return Math.round((completedLevels / levels.length) * 100);
  }

  // Calculate rank based on levels completed
  calculateRank(levelsCompleted) {
    if (levelsCompleted >= 9) return 'Master Wizard';
    if (levelsCompleted >= 6) return 'Expert Wizard';
    if (levelsCompleted >= 3) return 'Apprentice Wizard';
    return 'Novice Wizard';
  }

  // Get next world to unlock
  getNextWorld(currentWorld) {
    const worldOrder = ['village', 'forest', 'mountain'];
    const currentIndex = worldOrder.indexOf(currentWorld);
    return currentIndex < worldOrder.length - 1 ? worldOrder[currentIndex + 1] : null;
  }

  // Get next level in current world
  getNextLevelInWorld(world, currentLevel) {
    const levelOrder = {
      village: ['level1', 'level2', 'level3'],
      forest: ['level4', 'level5', 'level6'],
      mountain: ['level7', 'level8', 'level9']
    };
    
    const levelsInWorld = levelOrder[world];
    if (!levelsInWorld) return null;
    
    const currentIndex = levelsInWorld.indexOf(currentLevel);
    return currentIndex < levelsInWorld.length - 1 ? levelsInWorld[currentIndex + 1] : null;
  }

  // Check for new achievements
  checkAchievements(progressData, levelId, stars) {
    const newAchievements = [];
    const existingAchievements = progressData.achievements?.map(a => a.id) || [];

    // First level completion
    if (levelId === 1 && !existingAchievements.includes('first_steps')) {
      newAchievements.push({
        id: 'first_steps',
        name: 'First Steps',
        description: 'Complete your first level',
        icon: '🌟',
        earnedAt: serverTimestamp()
      });
    }

    // Level 2 completion
    if (levelId === 2 && !existingAchievements.includes('message_master')) {
      newAchievements.push({
        id: 'message_master',
        name: 'Message Master',
        description: 'Successfully deliver all village messages',
        icon: '📮',
        earnedAt: serverTimestamp()
      });
    }

    // Perfect score achievements
    if (stars === 3) {
      if (levelId === 1 && !existingAchievements.includes('apple_master')) {
        newAchievements.push({
          id: 'apple_master',
          name: 'Apple Master',
          description: 'Perfect score in Apple Collection',
          icon: '🍎',
          earnedAt: serverTimestamp()
        });
      }

      if (levelId === 2 && !existingAchievements.includes('delivery_expert')) {
        newAchievements.push({
          id: 'delivery_expert',
          name: 'Delivery Expert',
          description: 'Perfect score in Message Delivery',
          icon: '🚀',
          earnedAt: serverTimestamp()
        });
      }
    }

    // String variable mastery (complete both Level 1 and 2)
    if ((levelId === 1 || levelId === 2) && !existingAchievements.includes('string_wizard')) {
      const level1Complete = progressData.worlds?.village?.levels?.level1?.completed;
      const level2Complete = progressData.worlds?.village?.levels?.level2?.completed;
      
      if (level1Complete && level2Complete) {
        newAchievements.push({
          id: 'string_wizard',
          name: 'String Wizard',
          description: 'Master string variables in Village levels',
          icon: '🔤',
          earnedAt: serverTimestamp()
        });
      }
    }

    // Speed achievements
    if (levelId === 2 && stars >= 2 && !existingAchievements.includes('speedy_messenger')) {
      newAchievements.push({
        id: 'speedy_messenger',
        name: 'Speedy Messenger',
        description: 'Deliver messages in record time',
        icon: '⚡',
        earnedAt: serverTimestamp()
      });
    }

    // World completion achievements
    const { world } = this.getLevelPath(levelId);
    
    // Check if this completion completes the world
    if (progressData.worlds && progressData.worlds[world]) {
      const updatedWorldData = { ...progressData.worlds[world] };
      if (levelId === 1) updatedWorldData.levels.level1 = { completed: true, stars };
      if (levelId === 2) updatedWorldData.levels.level2 = { completed: true, stars };
      if (levelId === 3) updatedWorldData.levels.level3 = { completed: true, stars };
      
      const worldProgress = this.calculateWorldProgress(updatedWorldData);
      
      if (worldProgress === 100) {
        if (world === 'village' && !existingAchievements.includes('variable_wizard')) {
          newAchievements.push({
            id: 'variable_wizard',
            name: 'Variable Wizard',
            description: 'Master all Variable levels',
            icon: '🧙‍♂️',
            earnedAt: serverTimestamp()
          });
        }
        
        if (world === 'forest' && !existingAchievements.includes('decision_maker')) {
          newAchievements.push({
            id: 'decision_maker',
            name: 'Decision Maker',
            description: 'Complete all Forest Decision levels',
            icon: '🌲',
            earnedAt: serverTimestamp()
          });
        }
        
        if (world === 'mountain' && !existingAchievements.includes('loop_master')) {
          newAchievements.push({
            id: 'loop_master',
            name: 'Loop Master',
            description: 'Conquer all Mountain Challenge levels',
            icon: '⛰️',
            earnedAt: serverTimestamp()
          });
        }
      }
    }

    return newAchievements;
  }

  // Get user progress for dashboard
  async getDashboardData(userId) {
    try {
      const progressData = await this.getUserProgress(userId);
      
      if (!progressData) {
        return await this.initializeUserProgress(userId);
      }

      return progressData;
    } catch (error) {
      console.error('Error getting dashboard data:', error);
      return null;
    }
  }
}

export const progressService = new ProgressService();