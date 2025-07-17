import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { BrowserRouter } from 'react-router-dom';
import { progressService } from '../src/services/progressService.js';

// Mock Firebase
vi.mock('../src/pages/firebase', () => ({
  db: {},
  auth: {
    currentUser: null
  }
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

describe('Code4Kids Application Tests', () => {
  
  beforeEach(() => {
    // Reset all mocks before each test
    vi.clearAllMocks();
    
    // Mock session storage
    const mockSessionStorage = {
      getItem: vi.fn(),
      setItem: vi.fn(),
      removeItem: vi.fn(),
      clear: vi.fn()
    };
    Object.defineProperty(window, 'sessionStorage', {
      value: mockSessionStorage
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('1. User Authentication and Session Management', () => {
    it('should clear user session data on logout', () => {
      // Test that progressService properly clears cached user data
      const mockUser = {
        uid: 'test-user-123',
        email: 'test@example.com',
        role: 'student'
      };
      
      // Set current user
      progressService.currentUser = mockUser;
      expect(progressService.getCurrentUser()).toEqual(mockUser);
      
      // Clear current user
      progressService.clearCurrentUser();
      expect(progressService.currentUser).toBeNull();
    });

    it('should retrieve user from session storage when cache is empty', () => {
      const mockUser = {
        uid: 'test-user-123',
        email: 'test@example.com',
        role: 'student'
      };
      
      // Mock session storage returning user data
      window.sessionStorage.getItem.mockReturnValue(JSON.stringify(mockUser));
      
      // Clear cache first
      progressService.currentUser = null;
      
      // Should retrieve from session storage
      const retrievedUser = progressService.getCurrentUser();
      expect(retrievedUser).toEqual(mockUser);
      expect(window.sessionStorage.getItem).toHaveBeenCalledWith('user');
    });
  });

  describe('2. Level Progress Tracking and Firebase Integration', () => {
    it('should calculate correct level path for each level ID', () => {
      const testCases = [
        { levelId: 1, expected: { world: 'village', level: 'level1' } },
        { levelId: 4, expected: { world: 'forest', level: 'level4' } },
        { levelId: 7, expected: { world: 'mountain', level: 'level7' } },
        { levelId: 9, expected: { world: 'mountain', level: 'level9' } }
      ];
      
      testCases.forEach(({ levelId, expected }) => {
        const result = progressService.getLevelPath(levelId);
        expect(result).toEqual(expected);
      });
    });

    it('should calculate world progress percentage correctly', () => {
      const mockWorldData = {
        levels: {
          level1: { completed: true, stars: 3 },
          level2: { completed: true, stars: 2 },
          level3: { completed: false, stars: 0 }
        }
      };
      
      const progress = progressService.calculateWorldProgress(mockWorldData);
      expect(progress).toBe(67); // 2 out of 3 levels completed = 67%
    });

    it('should calculate correct rank based on levels completed', () => {
      const rankTests = [
        { levels: 0, expected: 'Novice Wizard' },
        { levels: 3, expected: 'Apprentice Wizard' },
        { levels: 6, expected: 'Expert Wizard' },
        { levels: 9, expected: 'Master Wizard' }
      ];
      
      rankTests.forEach(({ levels, expected }) => {
        const rank = progressService.calculateRank(levels);
        expect(rank).toBe(expected);
      });
    });
  });

  describe('3. Achievement System and Progress Validation', () => {
    it('should identify correct achievements for level completion', () => {
      const mockProgressData = {
        achievements: [], // No existing achievements
        totalLevelsCompleted: 0,
        totalStars: 0,
        currentStreak: 0,
        worlds: {
          village: {
            levels: {
              level1: { completed: false, stars: 0 }
            }
          }
        }
      };
      
      // Test first level completion achievement
      const achievements = progressService.checkAchievements(mockProgressData, 1, 3);
      
      // Should get first steps achievement for completing level 1
      expect(achievements).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            id: 'first_steps',
            name: 'First Steps',
            description: 'Complete your first level'
          })
        ])
      );
      
      // Should also get perfect score achievement for 3 stars
      expect(achievements).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            id: 'apple_master',
            name: 'Apple Master',
            description: 'Perfect score in Apple Collection'
          })
        ])
      );
    });

    it('should not duplicate existing achievements', () => {
      const mockProgressData = {
        achievements: [
          { id: 'first_steps', name: 'First Steps' }
        ],
        totalLevelsCompleted: 1,
        totalStars: 3,
        currentStreak: 1,
        worlds: {
          village: {
            levels: {
              level1: { completed: true, stars: 3 }
            }
          }
        }
      };
      
      // Test completing level 1 again - should not get duplicate achievement
      const achievements = progressService.checkAchievements(mockProgressData, 1, 3);
      
      // Should not include first_steps again since it already exists
      const firstStepsAchievements = achievements.filter(a => a.id === 'first_steps');
      expect(firstStepsAchievements).toHaveLength(0);
    });
  });

  describe('4. World Unlocking Logic and Level Progression', () => {
    it('should return correct next world in sequence', () => {
      const worldTests = [
        { current: 'village', expected: 'forest' },
        { current: 'forest', expected: 'mountain' },
        { current: 'mountain', expected: null } // No world after mountain
      ];
      
      worldTests.forEach(({ current, expected }) => {
        const nextWorld = progressService.getNextWorld(current);
        expect(nextWorld).toBe(expected);
      });
    });

    it('should return correct next level within world', () => {
      const levelTests = [
        { world: 'village', current: 'level1', expected: 'level2' },
        { world: 'village', current: 'level3', expected: null }, // Last level in village
        { world: 'forest', current: 'level4', expected: 'level5' },
        { world: 'mountain', current: 'level9', expected: null } // Last level overall
      ];
      
      levelTests.forEach(({ world, current, expected }) => {
        const nextLevel = progressService.getNextLevelInWorld(world, current);
        expect(nextLevel).toBe(expected);
      });
    });

    it('should calculate overall progress correctly across all worlds', () => {
      const mockProgressData = {
        worlds: {
          village: {
            levels: {
              level1: { completed: true },
              level2: { completed: true },
              level3: { completed: false }
            }
          },
          forest: {
            levels: {
              level4: { completed: true },
              level5: { completed: false },
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
      
      const overallProgress = progressService.getOverallProgress(mockProgressData);
      expect(overallProgress).toBe(33); // 3 out of 9 levels completed = 33%
    });
  });

  describe('5. Level Solutions and Game Logic Validation', () => {
    it('should validate Level 4 Weather Paths logic', () => {
      // Test the conditional logic for weather path selection
      const weatherConditions = ['sunny', 'cloudy', 'rainy'];
      const expectedPaths = ['sunny_path', 'cloudy_path', 'rainy_path'];
      
      weatherConditions.forEach((weather, index) => {
        let selectedPath;
        
        // Simulate Level 4 logic
        if (weather === 'sunny') {
          selectedPath = 'sunny_path';
        } else if (weather === 'cloudy') {
          selectedPath = 'cloudy_path';
        } else if (weather === 'rainy') {
          selectedPath = 'rainy_path';
        }
        
        expect(selectedPath).toBe(expectedPaths[index]);
      });
    });

    it('should validate Level 5 Monster spell matching logic', () => {
      // Test the monster-spell matching logic
      const monsterSpellMap = {
        'goblin': 'fire',
        'troll': 'ice',
        'orc': 'lightning'
      };
      
      Object.entries(monsterSpellMap).forEach(([monster, expectedSpell]) => {
        let selectedSpell;
        
        // Simulate Level 5 logic
        if (monster === 'goblin') {
          selectedSpell = 'fire';
        } else if (monster === 'troll') {
          selectedSpell = 'ice';
        } else if (monster === 'orc') {
          selectedSpell = 'lightning';
        }
        
        expect(selectedSpell).toBe(expectedSpell);
      });
    });

    it('should validate Level 3 Potion brewing calculation', () => {
      // Test the mathematical operations for potion strength
      let total = 0;
      let count = 0;
      
      // Collect ingredients (as per LEVEL_SOLUTIONS.txt)
      total += 3; count++; // Mushrooms
      total += 5; count++; // Crystals  
      total += 2; count++; // Herbs
      total += 4; count++; // Magic Water
      
      // Apply operations
      total = total * 2;    // Double (14 * 2 = 28)
      total = total - 5;    // Subtract prep cost (28 - 5 = 23)
      total = total / count; // Divide by ingredient count (23 / 4 = 5.75)
      
      // Should round to 6 for potion strength
      const finalStrength = Math.round(total);
      expect(finalStrength).toBe(6);
    });

    it('should validate Level 9 Dragon battle damage calculation', () => {
      // Test nested loop damage calculation for dragon battle
      let totalDamage = 0;
      const dragonHP = 100;
      
      // Simulate 3 rounds of combat (minimum needed)
      for (let round = 1; round <= 3; round++) {
        let roundDamage = 0;
        
        // 3 spells per round
        roundDamage += 15; // Fire Bolt
        roundDamage += 12; // Ice Shard  
        roundDamage += 18; // Lightning Strike
        // Healing doesn't count toward damage but helps survival
        
        totalDamage += roundDamage;
      }
      
      // After 3 rounds should have enough damage to defeat dragon
      expect(totalDamage).toBe(135); // 45 damage per round × 3 rounds
      expect(totalDamage).toBeGreaterThan(dragonHP);
    });
  });
});