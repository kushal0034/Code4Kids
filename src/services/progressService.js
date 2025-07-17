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
        rarity: 'common',
        earnedAt: new Date()
      });
    }

    // Level 2 completion
    if (levelId === 2 && !existingAchievements.includes('message_master')) {
      newAchievements.push({
        id: 'message_master',
        name: 'Message Master',
        description: 'Successfully deliver all village messages',
        icon: '📮',
        rarity: 'common',
        earnedAt: new Date()
      });
    }

    // Level 3 completion
    if (levelId === 3 && !existingAchievements.includes('potion_brewmaster')) {
      newAchievements.push({
        id: 'potion_brewmaster',
        name: 'Potion Brewmaster',
        description: 'Master the art of magical potion brewing',
        icon: '🧪',
        rarity: 'common',
        earnedAt: new Date()
      });
    }

    // Level 4 completion
    if (levelId === 4 && !existingAchievements.includes('weather_navigator')) {
      newAchievements.push({
        id: 'weather_navigator',
        name: 'Weather Navigator',
        description: 'Navigate through any weather condition',
        icon: '🌤️',
        rarity: 'common',
        earnedAt: new Date()
      });
    }

    // Level 5 completion
    if (levelId === 5 && !existingAchievements.includes('monster_slayer')) {
      newAchievements.push({
        id: 'monster_slayer',
        name: 'Monster Slayer',
        description: 'Defeat all forest monsters with magic',
        icon: '⚔️',
        rarity: 'uncommon',
        earnedAt: new Date()
      });
    }

    // Level 6 completion
    if (levelId === 6 && !existingAchievements.includes('village_helper')) {
      newAchievements.push({
        id: 'village_helper',
        name: 'Village Helper',
        description: 'Help all villagers with their problems',
        icon: '🤝',
        rarity: 'uncommon',
        earnedAt: new Date()
      });
    }

    // Level 7 completion
    if (levelId === 7 && !existingAchievements.includes('bridge_builder')) {
      newAchievements.push({
        id: 'bridge_builder',
        name: 'Bridge Builder',
        description: 'Master the art of bridge crossing',
        icon: '🌉',
        rarity: 'uncommon',
        earnedAt: new Date()
      });
    }

    // Level 8 completion
    if (levelId === 8 && !existingAchievements.includes('rock_crusher')) {
      newAchievements.push({
        id: 'rock_crusher',
        name: 'Rock Crusher',
        description: 'Clear all obstacles from your path',
        icon: '🪨',
        rarity: 'rare',
        earnedAt: new Date()
      });
    }

    // Level 9 completion
    if (levelId === 9 && !existingAchievements.includes('dragon_slayer')) {
      newAchievements.push({
        id: 'dragon_slayer',
        name: 'Dragon Slayer',
        description: 'Defeat the mighty dragon in epic battle',
        icon: '🐉',
        rarity: 'legendary',
        earnedAt: new Date()
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
          rarity: 'rare',
          earnedAt: new Date()
        });
      }

      if (levelId === 2 && !existingAchievements.includes('delivery_expert')) {
        newAchievements.push({
          id: 'delivery_expert',
          name: 'Delivery Expert',
          description: 'Perfect score in Message Delivery',
          icon: '🚀',
          rarity: 'rare',
          earnedAt: new Date()
        });
      }

      if (levelId === 3 && !existingAchievements.includes('perfect_potion')) {
        newAchievements.push({
          id: 'perfect_potion',
          name: 'Perfect Potion',
          description: 'Brew the perfect potion with 3 stars',
          icon: '⭐',
          rarity: 'rare',
          earnedAt: new Date()
        });
      }

      if (levelId === 9 && !existingAchievements.includes('dragon_destroyer')) {
        newAchievements.push({
          id: 'dragon_destroyer',
          name: 'Dragon Destroyer',
          description: 'Defeat the dragon with perfect execution',
          icon: '💥',
          rarity: 'legendary',
          earnedAt: new Date()
        });
      }
    }

    // Streak achievements
    const currentStreak = progressData.currentStreak || 0;
    if (currentStreak >= 3 && !existingAchievements.includes('on_fire')) {
      newAchievements.push({
        id: 'on_fire',
        name: 'On Fire!',
        description: 'Complete 3 levels in a row',
        icon: '🔥',
        rarity: 'uncommon',
        earnedAt: new Date()
      });
    }

    if (currentStreak >= 5 && !existingAchievements.includes('unstoppable')) {
      newAchievements.push({
        id: 'unstoppable',
        name: 'Unstoppable',
        description: 'Complete 5 levels in a row',
        icon: '⚡',
        rarity: 'rare',
        earnedAt: new Date()
      });
    }

    // Level count achievements
    const totalCompleted = progressData.totalLevelsCompleted || 0;
    if (totalCompleted >= 5 && !existingAchievements.includes('problem_solver')) {
      newAchievements.push({
        id: 'problem_solver',
        name: 'Problem Solver',
        description: 'Complete 5 levels',
        icon: '🧩',
        rarity: 'uncommon',
        earnedAt: new Date()
      });
    }

    if (totalCompleted >= 9 && !existingAchievements.includes('code_master')) {
      newAchievements.push({
        id: 'code_master',
        name: 'Code Master',
        description: 'Complete all 9 levels',
        icon: '👑',
        rarity: 'legendary',
        earnedAt: new Date()
      });
    }

    // Star achievements
    const totalStars = progressData.totalStars || 0;
    if (totalStars >= 10 && !existingAchievements.includes('star_collector')) {
      newAchievements.push({
        id: 'star_collector',
        name: 'Star Collector',
        description: 'Earn 10 stars total',
        icon: '⭐',
        rarity: 'common',
        earnedAt: new Date()
      });
    }

    if (totalStars >= 20 && !existingAchievements.includes('star_master')) {
      newAchievements.push({
        id: 'star_master',
        name: 'Star Master',
        description: 'Earn 20 stars total',
        icon: '🌟',
        rarity: 'rare',
        earnedAt: new Date()
      });
    }

    if (totalStars >= 27 && !existingAchievements.includes('perfect_wizard')) {
      newAchievements.push({
        id: 'perfect_wizard',
        name: 'Perfect Wizard',
        description: 'Earn all 27 stars - Perfect score on every level!',
        icon: '🏆',
        rarity: 'legendary',
        earnedAt: new Date()
      });
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
          rarity: 'uncommon',
          earnedAt: new Date()
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
        rarity: 'uncommon',
        earnedAt: new Date()
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
            rarity: 'rare',
            earnedAt: new Date()
          });
        }
        
        if (world === 'forest' && !existingAchievements.includes('decision_maker')) {
          newAchievements.push({
            id: 'decision_maker',
            name: 'Decision Maker',
            description: 'Complete all Forest Decision levels',
            icon: '🌲',
            rarity: 'rare',
            earnedAt: new Date()
          });
        }
        
        if (world === 'mountain' && !existingAchievements.includes('loop_master')) {
          newAchievements.push({
            id: 'loop_master',
            name: 'Loop Master',
            description: 'Conquer all Mountain Challenge levels',
            icon: '⛰️',
            rarity: 'rare',
            earnedAt: new Date()
          });
        }
      }
    }

    return newAchievements;
  }

  // Get all possible achievements
  getAllAchievements() {
    return [
      // Level completion achievements
      { id: 'first_steps', name: 'First Steps', description: 'Complete your first level', icon: '🌟', rarity: 'common' },
      { id: 'message_master', name: 'Message Master', description: 'Successfully deliver all village messages', icon: '📮', rarity: 'common' },
      { id: 'potion_brewmaster', name: 'Potion Brewmaster', description: 'Master the art of magical potion brewing', icon: '🧪', rarity: 'common' },
      { id: 'weather_navigator', name: 'Weather Navigator', description: 'Navigate through any weather condition', icon: '🌤️', rarity: 'common' },
      { id: 'monster_slayer', name: 'Monster Slayer', description: 'Defeat all forest monsters with magic', icon: '⚔️', rarity: 'uncommon' },
      { id: 'village_helper', name: 'Village Helper', description: 'Help all villagers with their problems', icon: '🤝', rarity: 'uncommon' },
      { id: 'bridge_builder', name: 'Bridge Builder', description: 'Master the art of bridge crossing', icon: '🌉', rarity: 'uncommon' },
      { id: 'rock_crusher', name: 'Rock Crusher', description: 'Clear all obstacles from your path', icon: '🪨', rarity: 'rare' },
      { id: 'dragon_slayer', name: 'Dragon Slayer', description: 'Defeat the mighty dragon in epic battle', icon: '🐉', rarity: 'legendary' },
      
      // Perfect score achievements
      { id: 'apple_master', name: 'Apple Master', description: 'Perfect score in Apple Collection', icon: '🍎', rarity: 'rare' },
      { id: 'delivery_expert', name: 'Delivery Expert', description: 'Perfect score in Message Delivery', icon: '🚀', rarity: 'rare' },
      { id: 'perfect_potion', name: 'Perfect Potion', description: 'Brew the perfect potion with 3 stars', icon: '⭐', rarity: 'rare' },
      { id: 'dragon_destroyer', name: 'Dragon Destroyer', description: 'Defeat the dragon with perfect execution', icon: '💥', rarity: 'legendary' },
      
      // Streak achievements
      { id: 'on_fire', name: 'On Fire!', description: 'Complete 3 levels in a row', icon: '🔥', rarity: 'uncommon' },
      { id: 'unstoppable', name: 'Unstoppable', description: 'Complete 5 levels in a row', icon: '⚡', rarity: 'rare' },
      
      // Level count achievements
      { id: 'problem_solver', name: 'Problem Solver', description: 'Complete 5 levels', icon: '🧩', rarity: 'uncommon' },
      { id: 'code_master', name: 'Code Master', description: 'Complete all 9 levels', icon: '👑', rarity: 'legendary' },
      
      // Star achievements
      { id: 'star_collector', name: 'Star Collector', description: 'Earn 10 stars total', icon: '⭐', rarity: 'common' },
      { id: 'star_master', name: 'Star Master', description: 'Earn 20 stars total', icon: '🌟', rarity: 'rare' },
      { id: 'perfect_wizard', name: 'Perfect Wizard', description: 'Earn all 27 stars - Perfect score on every level!', icon: '🏆', rarity: 'legendary' },
      
      // Special achievements
      { id: 'string_wizard', name: 'String Wizard', description: 'Master string variables in Village levels', icon: '🔤', rarity: 'uncommon' },
      { id: 'speedy_messenger', name: 'Speedy Messenger', description: 'Deliver messages in record time', icon: '⚡', rarity: 'uncommon' },
      
      // World completion achievements
      { id: 'variable_wizard', name: 'Variable Wizard', description: 'Master all Variable levels', icon: '🧙‍♂️', rarity: 'rare' },
      { id: 'decision_maker', name: 'Decision Maker', description: 'Complete all Forest Decision levels', icon: '🌲', rarity: 'rare' },
      { id: 'loop_master', name: 'Loop Master', description: 'Conquer all Mountain Challenge levels', icon: '⛰️', rarity: 'rare' }
    ];
  }

  // Get user progress for dashboard
  async getDashboardData(userId) {
    try {
      const progressData = await this.getUserProgress(userId);
      
      if (!progressData) {
        return await this.initializeUserProgress(userId);
      }

      // Migration: Add unlocked property if it doesn't exist
      const needsMigration = this.needsUnlockedMigration(progressData);
      if (needsMigration) {
        console.log('Migrating user progress to add unlocked properties');
        const migratedData = await this.migrateProgressData(userId, progressData);
        return migratedData;
      }

      return progressData;
    } catch (error) {
      console.error('Error getting dashboard data:', error);
      return null;
    }
  }

  // Check if progress data needs migration for unlocked properties
  needsUnlockedMigration(progressData) {
    if (!progressData.worlds) return false;
    
    // Check if any level is missing the unlocked property
    for (const worldKey in progressData.worlds) {
      const world = progressData.worlds[worldKey];
      if (world.levels) {
        for (const levelKey in world.levels) {
          const level = world.levels[levelKey];
          if (level.unlocked === undefined) {
            return true;
          }
        }
      }
    }
    return false;
  }

  // Migrate progress data to add unlocked properties
  async migrateProgressData(userId, progressData) {
    try {
      const updateData = {};
      
      // Add unlocked property to all levels
      if (progressData.worlds) {
        // Village levels
        if (progressData.worlds.village && progressData.worlds.village.levels) {
          const villageLevels = progressData.worlds.village.levels;
          if (villageLevels.level1 && villageLevels.level1.unlocked === undefined) {
            updateData['worlds.village.levels.level1.unlocked'] = true;
          }
          if (villageLevels.level2 && villageLevels.level2.unlocked === undefined) {
            updateData['worlds.village.levels.level2.unlocked'] = villageLevels.level1?.completed || false;
          }
          if (villageLevels.level3 && villageLevels.level3.unlocked === undefined) {
            updateData['worlds.village.levels.level3.unlocked'] = villageLevels.level2?.completed || false;
          }
        }
        
        // Forest levels
        if (progressData.worlds.forest && progressData.worlds.forest.levels) {
          const forestLevels = progressData.worlds.forest.levels;
          if (forestLevels.level4 && forestLevels.level4.unlocked === undefined) {
            updateData['worlds.forest.levels.level4.unlocked'] = progressData.worlds.forest.unlocked || false;
          }
          if (forestLevels.level5 && forestLevels.level5.unlocked === undefined) {
            updateData['worlds.forest.levels.level5.unlocked'] = forestLevels.level4?.completed || false;
          }
          if (forestLevels.level6 && forestLevels.level6.unlocked === undefined) {
            updateData['worlds.forest.levels.level6.unlocked'] = forestLevels.level5?.completed || false;
          }
        }
        
        // Mountain levels
        if (progressData.worlds.mountain && progressData.worlds.mountain.levels) {
          const mountainLevels = progressData.worlds.mountain.levels;
          if (mountainLevels.level7 && mountainLevels.level7.unlocked === undefined) {
            updateData['worlds.mountain.levels.level7.unlocked'] = progressData.worlds.mountain.unlocked || false;
          }
          if (mountainLevels.level8 && mountainLevels.level8.unlocked === undefined) {
            updateData['worlds.mountain.levels.level8.unlocked'] = mountainLevels.level7?.completed || false;
          }
          if (mountainLevels.level9 && mountainLevels.level9.unlocked === undefined) {
            updateData['worlds.mountain.levels.level9.unlocked'] = mountainLevels.level8?.completed || false;
          }
        }
      }
      
      // Update the database
      if (Object.keys(updateData).length > 0) {
        const progressRef = doc(db, 'userProgress', userId);
        await updateDoc(progressRef, updateData);
        console.log('Migration completed, updated data:', updateData);
      }
      
      // Return the updated progress data
      return await this.getUserProgress(userId);
    } catch (error) {
      console.error('Error migrating progress data:', error);
      return progressData;
    }
  }

  // Update user profile
  async updateUserProfile(userId, profileData) {
    try {
      const userRef = doc(db, 'users', userId);
      await updateDoc(userRef, {
        username: profileData.username,
        email: profileData.email,
        parentName: profileData.parentName,
        parentEmail: profileData.parentEmail,
        updatedAt: serverTimestamp()
      });
      
      console.log('Profile updated successfully');
      return { success: true };
    } catch (error) {
      console.error('Error updating user profile:', error);
      throw error;
    }
  }
}

export const progressService = new ProgressService();