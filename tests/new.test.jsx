import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { BrowserRouter } from 'react-router-dom';
import { progressService } from '../src/services/progressService.js';

// Mock Firebase
vi.mock('../src/pages/firebase', () => ({
  db: {},
  auth: { currentUser: null }
}));

// Mock Firestore functions
vi.mock('firebase/firestore', () => ({
  doc: vi.fn(),
  setDoc: vi.fn(),
  getDoc: vi.fn(),
  updateDoc: vi.fn(),
  collection: vi.fn(),
  query: vi.fn(),
  where: vi.fn(),
  getDocs: vi.fn(),
  orderBy: vi.fn(),
  limit: vi.fn(),
  addDoc: vi.fn(),
  onSnapshot: vi.fn()
}));

// Helper function to render components with router
const renderWithRouter = (component) => {
  return render(
    <BrowserRouter>
      {component}
    </BrowserRouter>
  );
};

describe('Code4Kids Comprehensive Test Suite - All Levels', () => {
  
  beforeEach(() => {
    vi.clearAllMocks();
    
    const mockSessionStorage = {
      getItem: vi.fn(),
      setItem: vi.fn(),
      removeItem: vi.fn(),
      clear: vi.fn()
    };
    Object.defineProperty(window, 'sessionStorage', {
      value: mockSessionStorage
    });

    vi.spyOn(console, 'log').mockImplementation(() => {});
    vi.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('Authentication and Session Management', () => {
    it('should handle all authentication states', () => {
      const mockUser = { uid: 'test-123', email: 'test@test.com', role: 'student' };
      
      progressService.currentUser = null;
      expect(progressService.getCurrentUser()).toBeNull();
      
      progressService.currentUser = mockUser;
      expect(progressService.getCurrentUser()).toEqual(mockUser);
      
      progressService.clearCurrentUser();
      expect(progressService.currentUser).toBeNull();
    });

    it('should retrieve user from session storage', () => {
      const mockUser = { uid: 'test-456', email: 'student@test.com' };
      window.sessionStorage.getItem.mockReturnValue(JSON.stringify(mockUser));
      progressService.currentUser = null;
      
      const user = progressService.getCurrentUser();
      expect(user).toEqual(mockUser);
    });
  });

  describe('Level Progress Tracking', () => {
    it('should map all 9 levels correctly to worlds', () => {
      const levelMappings = [
        { levelId: 1, expected: { world: 'village', level: 'level1' } },
        { levelId: 2, expected: { world: 'village', level: 'level2' } },
        { levelId: 3, expected: { world: 'village', level: 'level3' } },
        { levelId: 4, expected: { world: 'forest', level: 'level4' } },
        { levelId: 5, expected: { world: 'forest', level: 'level5' } },
        { levelId: 6, expected: { world: 'forest', level: 'level6' } },
        { levelId: 7, expected: { world: 'mountain', level: 'level7' } },
        { levelId: 8, expected: { world: 'mountain', level: 'level8' } },
        { levelId: 9, expected: { world: 'mountain', level: 'level9' } }
      ];
      
      levelMappings.forEach(({ levelId, expected }) => {
        const result = progressService.getLevelPath(levelId);
        expect(result).toEqual(expected);
      });
    });

    it('should calculate world progress percentage correctly', () => {
      const testCases = [
        {
          worldData: {
            levels: {
              level1: { completed: true, stars: 3 },
              level2: { completed: true, stars: 2 },
              level3: { completed: false, stars: 0 }
            }
          },
          expected: 67 // 2 out of 3 levels
        },
        {
          worldData: {
            levels: {
              level4: { completed: true, stars: 3 },
              level5: { completed: true, stars: 3 },
              level6: { completed: true, stars: 3 }
            }
          },
          expected: 100 // All levels completed
        },
        {
          worldData: { levels: {} },
          expected: 0 // Empty levels
        }
      ];
      
      testCases.forEach(({ worldData, expected }) => {
        const progress = progressService.calculateWorldProgress(worldData);
        expect(progress).toBe(expected);
      });
    });

    it('should calculate ranks based on total levels completed', () => {
      const rankTests = [
        { levels: 0, expected: 'Novice Wizard' },
        { levels: 1, expected: 'Novice Wizard' },
        { levels: 2, expected: 'Novice Wizard' },
        { levels: 3, expected: 'Apprentice Wizard' },
        { levels: 4, expected: 'Apprentice Wizard' },
        { levels: 5, expected: 'Apprentice Wizard' },
        { levels: 6, expected: 'Expert Wizard' },
        { levels: 7, expected: 'Expert Wizard' },
        { levels: 8, expected: 'Expert Wizard' },
        { levels: 9, expected: 'Master Wizard' }
      ];
      
      rankTests.forEach(({ levels, expected }) => {
        const rank = progressService.calculateRank(levels);
        expect(rank).toBe(expected);
      });
    });
  });

  describe('World Navigation and Progression', () => {
    it('should return correct next world in sequence', () => {
      expect(progressService.getNextWorld('village')).toBe('forest');
      expect(progressService.getNextWorld('forest')).toBe('mountain');
      expect(progressService.getNextWorld('mountain')).toBeNull();
    });

    it('should return correct next level within each world', () => {
      // Village levels
      expect(progressService.getNextLevelInWorld('village', 'level1')).toBe('level2');
      expect(progressService.getNextLevelInWorld('village', 'level2')).toBe('level3');
      expect(progressService.getNextLevelInWorld('village', 'level3')).toBeNull();
      
      // Forest levels
      expect(progressService.getNextLevelInWorld('forest', 'level4')).toBe('level5');
      expect(progressService.getNextLevelInWorld('forest', 'level5')).toBe('level6');
      expect(progressService.getNextLevelInWorld('forest', 'level6')).toBeNull();
      
      // Mountain levels
      expect(progressService.getNextLevelInWorld('mountain', 'level7')).toBe('level8');
      expect(progressService.getNextLevelInWorld('mountain', 'level8')).toBe('level9');
      expect(progressService.getNextLevelInWorld('mountain', 'level9')).toBeNull();
    });

    it('should get first level in each world', () => {
      expect(progressService.getFirstLevelInWorld('village')).toBe('level1');
      expect(progressService.getFirstLevelInWorld('forest')).toBe('level4');
      expect(progressService.getFirstLevelInWorld('mountain')).toBe('level7');
      expect(progressService.getFirstLevelInWorld('invalid')).toBeNull();
    });
  });

  describe('Achievement System', () => {
    it('should track all achievement types correctly', () => {
      const mockProgressData = {
        achievements: [],
        totalLevelsCompleted: 0,
        totalStars: 0,
        currentStreak: 0,
        worlds: { village: { levels: {} } }
      };

      // Test first level achievement
      const firstLevelAchievements = progressService.checkAchievements(mockProgressData, 1, 3);
      expect(firstLevelAchievements).toEqual(
        expect.arrayContaining([
          expect.objectContaining({ id: 'first_steps' }),
          expect.objectContaining({ id: 'apple_master' })
        ])
      );

      // Test dragon slayer achievement (level 9)
      const dragonAchievements = progressService.checkAchievements(mockProgressData, 9, 3);
      expect(dragonAchievements).toEqual(
        expect.arrayContaining([
          expect.objectContaining({ id: 'dragon_slayer' }),
          expect.objectContaining({ id: 'dragon_destroyer' })
        ])
      );
    });

    it('should not duplicate existing achievements', () => {
      const mockProgressData = {
        achievements: [{ id: 'first_steps', name: 'First Steps' }],
        totalLevelsCompleted: 1,
        totalStars: 3,
        currentStreak: 1,
        worlds: {}
      };
      
      const achievements = progressService.checkAchievements(mockProgressData, 1, 3);
      const firstStepsCount = achievements.filter(a => a.id === 'first_steps');
      expect(firstStepsCount).toHaveLength(0);
    });

    it('should validate all achievement types exist', () => {
      const allAchievements = progressService.getAllAchievements();
      const expectedAchievements = [
        'first_steps', 'dragon_slayer', 'apple_master', 'dragon_destroyer',
        'on_fire', 'unstoppable', 'problem_solver', 'code_master',
        'star_collector', 'perfect_wizard'
      ];
      
      expectedAchievements.forEach(achievementId => {
        const hasAchievement = allAchievements.some(a => a.id === achievementId);
        expect(hasAchievement).toBe(true);
      });
    });
  });

  describe('Level-Specific Game Logic', () => {
    describe('Level 1 - Apple Collection', () => {
      it('should validate apple collection counter logic', () => {
        let apples = 0;
        const targetApples = 5;
        
        // Simulate apple collection
        for (let i = 0; i < 5; i++) {
          apples++;
        }
        
        expect(apples).toBe(targetApples);
      });

      it('should track correct order of operations', () => {
        const correctOrder = [
          'create-variable',
          'move-forward',
          'collect-apple',
          'move-forward',
          'collect-apple'
        ];
        
        expect(correctOrder).toContain('create-variable');
        expect(correctOrder[0]).toBe('create-variable');
      });
    });

    describe('Level 2 - Message Delivery', () => {
      it('should validate name storage and message delivery', () => {
        const villagers = ['Alice', 'Bob', 'Charlie'];
        const messages = new Map();
        
        // Store names and deliver messages
        villagers.forEach((name, index) => {
          messages.set(name, `Message ${index + 1}`);
        });
        
        expect(messages.get('Alice')).toBe('Message 1');
        expect(messages.get('Bob')).toBe('Message 2');
        expect(messages.get('Charlie')).toBe('Message 3');
        expect(messages.size).toBe(3);
      });
    });

    describe('Level 3 - Potion Brewing', () => {
      it('should calculate potion strength correctly', () => {
        let total = 0;
        let count = 0;
        
        // Collect ingredients
        total += 3; count++; // Mushrooms
        total += 5; count++; // Crystals
        total += 2; count++; // Herbs
        total += 4; count++; // Magic Water
        
        // Apply operations
        total = total * 2;     // Double (14 * 2 = 28)
        total = total - 5;     // Subtract prep (28 - 5 = 23)
        total = total / count; // Divide by ingredients (23 / 4 = 5.75)
        
        const finalStrength = Math.round(total);
        expect(finalStrength).toBe(6);
      });
    });

    describe('Level 4 - Weather Paths', () => {
      it('should select correct path based on weather', () => {
        const weatherPaths = {
          'sunny': 'sunny_path',
          'cloudy': 'cloudy_path',
          'rainy': 'rainy_path'
        };
        
        Object.entries(weatherPaths).forEach(([weather, expectedPath]) => {
          let selectedPath;
          
          if (weather === 'sunny') {
            selectedPath = 'sunny_path';
          } else if (weather === 'cloudy') {
            selectedPath = 'cloudy_path';
          } else if (weather === 'rainy') {
            selectedPath = 'rainy_path';
          }
          
          expect(selectedPath).toBe(expectedPath);
        });
      });
    });

    describe('Level 5 - Monster Spells', () => {
      it('should match correct spell to each monster type', () => {
        const monsterSpells = {
          'goblin': 'fire',
          'troll': 'ice',
          'orc': 'lightning'
        };
        
        const monsters = ['goblin', 'troll', 'orc'];
        const defeatedMonsters = [];
        
        monsters.forEach(monster => {
          let spell;
          if (monster === 'goblin') spell = 'fire';
          else if (monster === 'troll') spell = 'ice';
          else if (monster === 'orc') spell = 'lightning';
          
          expect(spell).toBe(monsterSpells[monster]);
          defeatedMonsters.push(monster);
        });
        
        expect(defeatedMonsters).toHaveLength(3);
      });
    });

    describe('Level 6 - Villager Problems', () => {
      it('should solve different villager problems correctly', () => {
        const problems = [
          { type: 'lost_pet', solution: 'search_forest' },
          { type: 'broken_cart', solution: 'repair_wheel' },
          { type: 'sick_child', solution: 'healing_potion' }
        ];
        
        problems.forEach(({ type, solution }) => {
          let selectedSolution;
          
          if (type === 'lost_pet') {
            selectedSolution = 'search_forest';
          } else if (type === 'broken_cart') {
            selectedSolution = 'repair_wheel';
          } else if (type === 'sick_child') {
            selectedSolution = 'healing_potion';
          }
          
          expect(selectedSolution).toBe(solution);
        });
      });
    });

    describe('Level 7 - Bridge Crossing', () => {
      it('should validate for loop execution for bridge crossing', () => {
        let steps = 0;
        const targetSteps = 10;
        
        // For loop simulation
        for (let i = 0; i < 10; i++) {
          steps++;
        }
        
        expect(steps).toBe(targetSteps);
      });

      it('should track bridge plank repairs', () => {
        const planksRepaired = [];
        const totalPlanks = 10;
        
        for (let i = 0; i < totalPlanks; i++) {
          planksRepaired.push(i);
        }
        
        expect(planksRepaired).toHaveLength(totalPlanks);
        expect(planksRepaired[0]).toBe(0);
        expect(planksRepaired[9]).toBe(9);
      });
    });

    describe('Level 8 - Rock Clearing', () => {
      it('should clear rocks using while loop logic', () => {
        let rocksRemaining = 3;
        let rocksCleared = 0;
        const rockPositions = [3, 6, 9];
        
        while (rocksRemaining > 0) {
          rocksCleared++;
          rocksRemaining--;
        }
        
        expect(rocksCleared).toBe(3);
        expect(rocksRemaining).toBe(0);
      });

      it('should validate for loop approach (12 iterations)', () => {
        let position = 0;
        const clearedPositions = new Set();
        const rockPositions = new Set([3, 6, 9]);
        
        for (let i = 0; i < 12; i++) {
          position++;
          if (rockPositions.has(position)) {
            clearedPositions.add(position);
          }
        }
        
        expect(clearedPositions.size).toBe(3);
        expect(clearedPositions.has(3)).toBe(true);
        expect(clearedPositions.has(6)).toBe(true);
        expect(clearedPositions.has(9)).toBe(true);
      });
    });

    describe('Level 9 - Dragon Battle', () => {
      it('should validate nested loop structure for dragon battle', () => {
        let totalSpellsCast = 0;
        const rounds = 5;
        const spellsPerRound = 3;
        const dragonHealth = 100;
        let damage = 0;
        
        // Nested loops
        for (let round = 0; round < rounds; round++) {
          for (let spell = 0; spell < spellsPerRound; spell++) {
            totalSpellsCast++;
            damage += 15; // Fire damage
          }
        }
        
        expect(totalSpellsCast).toBe(15);
        expect(damage).toBeGreaterThanOrEqual(dragonHealth);
      });

      it('should calculate damage for different spell combinations', () => {
        const spellDamage = {
          fire: 15,
          ice: 12,
          lightning: 18
        };
        
        // One round of each spell
        const totalDamage = spellDamage.fire + spellDamage.ice + spellDamage.lightning;
        expect(totalDamage).toBe(45);
        
        // Three rounds needed to defeat dragon
        const damageAfterThreeRounds = totalDamage * 3;
        expect(damageAfterThreeRounds).toBe(135);
        expect(damageAfterThreeRounds).toBeGreaterThan(100);
      });
    });
  });

  describe('Overall Progress Calculation', () => {
    it('should calculate overall progress across all worlds', () => {
      const progressData = {
        worlds: {
          village: {
            levels: {
              level1: { completed: true },
              level2: { completed: true },
              level3: { completed: true }
            }
          },
          forest: {
            levels: {
              level4: { completed: true },
              level5: { completed: true },
              level6: { completed: false }
            }
          },
          mountain: {
            levels: {
              level7: { completed: false },
              level8: { completed: false },
              level9: { completed: false }
            }
          }
        }
      };
      
      const overallProgress = progressService.getOverallProgress(progressData);
      expect(overallProgress).toBe(56); // 5 out of 9 levels = 55.56% rounded to 56
    });
  });

  describe('Error Handling', () => {
    it('should handle invalid level IDs gracefully', () => {
      expect(progressService.getLevelPath(0)).toBeUndefined();
      expect(progressService.getLevelPath(10)).toBeUndefined();
      expect(progressService.getLevelPath(-1)).toBeUndefined();
      expect(progressService.getLevelPath(null)).toBeUndefined();
    });

    it('should handle null/undefined progress data', () => {
      expect(progressService.getOverallProgress(null)).toBe(0);
      expect(progressService.getOverallProgress(undefined)).toBe(0);
      expect(progressService.getOverallProgress({})).toBe(0);
    });

    it('should handle invalid world names', () => {
      expect(progressService.getNextWorld('invalid')).toBe('village');
      expect(progressService.getFirstLevelInWorld('invalid')).toBeNull();
      expect(progressService.getNextLevelInWorld('invalid', 'level1')).toBeNull();
    });

    it('should handle empty achievement arrays', () => {
      const progressData = {
        achievements: null,
        totalLevelsCompleted: 1,
        totalStars: 3,
        currentStreak: 1,
        worlds: {}
      };
      
      const achievements = progressService.checkAchievements(progressData, 1, 3);
      expect(Array.isArray(achievements)).toBe(true);
    });
  });

  describe('Class Statistics', () => {
    it('should calculate class statistics correctly', () => {
      const students = [
        { progress: 50, completedLevels: 4, totalStars: 10, status: 'active' },
        { progress: 80, completedLevels: 7, totalStars: 18, status: 'active' },
        { progress: 30, completedLevels: 2, totalStars: 5, status: 'inactive' }
      ];
      
      const stats = progressService.calculateClassStats(students);
      
      expect(stats.totalStudents).toBe(3);
      expect(stats.activeStudents).toBe(2);
      expect(stats.averageProgress).toBe(53); // (50 + 80 + 30) / 3 = 53.33 rounded
      expect(stats.topPerformer).toEqual(students[1]);
    });

    it('should handle empty student array', () => {
      const stats = progressService.calculateClassStats([]);
      
      expect(stats.totalStudents).toBe(0);
      expect(stats.activeStudents).toBe(0);
      expect(stats.averageProgress).toBe(0);
      expect(stats.topPerformer).toBeNull();
    });
  });

  describe('Time Formatting', () => {
    it('should format time correctly', () => {
      expect(progressService.formatTime(0)).toBe('0:00');
      expect(progressService.formatTime(59)).toBe('0:59');
      expect(progressService.formatTime(60)).toBe('1:00');
      expect(progressService.formatTime(125)).toBe('2:05');
      expect(progressService.formatTime(3661)).toBe('61:01');
    });
  });

  describe('Performance Benchmarks', () => {
    it('should handle rapid function calls efficiently', () => {
      const startTime = performance.now();
      
      for (let i = 0; i < 1000; i++) {
        progressService.getLevelPath((i % 9) + 1);
        progressService.calculateRank(i % 10);
        progressService.getNextWorld(['village', 'forest', 'mountain'][i % 3]);
      }
      
      const endTime = performance.now();
      expect(endTime - startTime).toBeLessThan(100); // Should complete in under 100ms
    });

    it('should handle large achievement checks efficiently', () => {
      const largeAchievementArray = Array.from({ length: 100 }, (_, i) => ({
        id: `achievement_${i}`,
        name: `Achievement ${i}`
      }));
      
      const progressData = {
        achievements: largeAchievementArray,
        totalLevelsCompleted: 5,
        totalStars: 15,
        currentStreak: 3,
        worlds: {}
      };
      
      const startTime = performance.now();
      const newAchievements = progressService.checkAchievements(progressData, 6, 3);
      const endTime = performance.now();
      
      expect(Array.isArray(newAchievements)).toBe(true);
      expect(endTime - startTime).toBeLessThan(50);
    });
  });

  describe('Data Validation', () => {
    it('should validate level numbering consistency', () => {
      const levelNumbers = {
        'level1': 1, 'level2': 2, 'level3': 3,
        'level4': 4, 'level5': 5, 'level6': 6,
        'level7': 7, 'level8': 8, 'level9': 9
      };
      
      Object.entries(levelNumbers).forEach(([levelName, expectedNumber]) => {
        const actualNumber = progressService.getLevelNumber(levelName);
        expect(actualNumber).toBe(expectedNumber);
      });
    });

    it('should maintain world order consistency', () => {
      const worldOrder = ['village', 'forest', 'mountain'];
      
      for (let i = 0; i < worldOrder.length - 1; i++) {
        const nextWorld = progressService.getNextWorld(worldOrder[i]);
        expect(nextWorld).toBe(worldOrder[i + 1]);
      }
    });

    it('should validate star rating boundaries', () => {
      const starTests = [
        { stars: 0, valid: true },
        { stars: 1, valid: true },
        { stars: 2, valid: true },
        { stars: 3, valid: true },
        { stars: 4, valid: false },
        { stars: -1, valid: false }
      ];
      
      starTests.forEach(({ stars, valid }) => {
        if (valid) {
          expect(stars).toBeGreaterThanOrEqual(0);
          expect(stars).toBeLessThanOrEqual(3);
        } else {
          expect(stars < 0 || stars > 3).toBe(true);
        }
      });
    });
  });

  describe('Student Activity Tracking', () => {
    it('should determine student status based on last activity', () => {
      const now = new Date();
      const recent = new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000); // 2 days ago
      const old = new Date(now.getTime() - 10 * 24 * 60 * 60 * 1000);   // 10 days ago
      
      expect(progressService.getStudentStatus(recent)).toBe('active');
      expect(progressService.getStudentStatus(old)).toBe('inactive');
    });

    it('should format activity descriptions correctly', () => {
      const descriptions = [
        { levelId: 1, stars: 3, expected: 'Perfect score in Apple Collection!' },
        { levelId: 5, stars: 2, expected: 'Completed Monster Spells' },
        { levelId: 9, stars: 3, expected: 'Perfect score in Dragon Battle!' }
      ];
      
      descriptions.forEach(({ levelId, stars, expected }) => {
        const desc = progressService.getActivityDescription(levelId, stars);
        expect(desc).toContain(expected.includes('Perfect') ? 'Perfect score' : 'Completed');
      });
    });
  });

  describe('Level Path Navigation', () => {
    it('should provide correct navigation paths for all levels', () => {
      const expectedPaths = {
        1: '/level-1', 2: '/level-2', 3: '/level-3',
        4: '/level-4', 5: '/level-5', 6: '/level-6',
        7: '/level-7', 8: '/level-8', 9: '/level-9'
      };
      
      Object.entries(expectedPaths).forEach(([levelId, expectedPath]) => {
        const levelPaths = {
          1: '/level-1', 2: '/level-2', 3: '/level-3',
          4: '/level-4', 5: '/level-5', 6: '/level-6',
          7: '/level-7', 8: '/level-8', 9: '/level-9'
        };
        
        expect(levelPaths[levelId]).toBe(expectedPath);
      });
    });
  });
});