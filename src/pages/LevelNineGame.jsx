import React, { useState, useEffect } from 'react';
import { Sparkles, Play, RotateCcw, CheckCircle, Star, Home, ArrowLeft, Flame, Zap, Shield, Heart, Trophy, Clock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { progressService } from '../services/progressService';

const LevelNineGame = () => {
  const navigate = useNavigate();
  const [draggedBlock, setDraggedBlock] = useState(null);
  const [codeBlocks, setCodeBlocks] = useState([]);
  const [gameState, setGameState] = useState('playing'); // 'playing', 'success', 'error'
  const [isRunning, setIsRunning] = useState(false);
  const [executionStep, setExecutionStep] = useState(-1);
  const [variables, setVariables] = useState({});
  const [gameMessage, setGameMessage] = useState('');
  const [dragonHealth, setDragonHealth] = useState(100);
  const [wizardHealth, setWizardHealth] = useState(100);
  const [battleRound, setBattleRound] = useState(0);
  const [spellCount, setSpellCount] = useState(0);
  const [totalDamage, setTotalDamage] = useState(0);
  const [activeSpells, setActiveSpells] = useState([]);
  const [dragonAttacking, setDragonAttacking] = useState(false);
  const [currentAction, setCurrentAction] = useState('');
  const [battleLog, setBattleLog] = useState([]);
  const [startTime, setStartTime] = useState(null);
  const [endTime, setEndTime] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [levelResults, setLevelResults] = useState(null);
  const [user, setUser] = useState(null);

  const spellTypes = {
    'fire-bolt': { name: 'Fire Bolt', damage: 15, color: 'text-red-400', icon: '🔥', effect: 'burn' },
    'ice-shard': { name: 'Ice Shard', damage: 12, color: 'text-blue-400', icon: '❄️', effect: 'freeze' },
    'lightning': { name: 'Lightning Strike', damage: 18, color: 'text-yellow-400', icon: '⚡', effect: 'shock' },
    'heal': { name: 'Healing Light', damage: -20, color: 'text-green-400', icon: '💚', effect: 'heal' }
  };

  const dragonAttacks = [
    { name: 'Fire Breath', damage: 15, icon: '🔥' },
    { name: 'Claw Strike', damage: 20, icon: '🐾' },
    { name: 'Wing Blast', damage: 12, icon: '💨' },
    { name: 'Tail Whip', damage: 18, icon: '🪃' }
  ];

  const availableBlocks = [
    {
      id: 'init-variables',
      type: 'variable',
      text: 'Initialize Battle Variables',
      color: 'from-blue-500 to-blue-600',
      code: 'let damage = 0; let totalDamage = 0;',
      description: 'Set up damage tracking variables',
      icon: '📊'
    },
    {
      id: 'outer-loop',
      type: 'loop',
      text: 'Battle Rounds (5 times)',
      color: 'from-red-600 to-red-700',
      code: 'for (let round = 1; round <= 5; round++)',
      description: 'Main battle loop - 5 epic rounds',
      icon: '🔄'
    },
    {
      id: 'inner-loop',
      type: 'loop',
      text: 'Cast Spells (3 times)',
      color: 'from-purple-500 to-purple-600',
      code: 'for (let spell = 1; spell <= 3; spell++)',
      description: 'Inner loop - cast 3 spells per round',
      icon: '✨'
    },
    {
      id: 'cast-fire-bolt',
      type: 'action',
      text: 'Cast Fire Bolt',
      color: 'from-red-500 to-orange-600',
      code: 'wizard.castSpell("fireBolt", 15)',
      description: 'Devastating fire spell - 15 damage',
      icon: '🔥'
    },
    {
      id: 'cast-ice-shard',
      type: 'action',
      text: 'Cast Ice Shard',
      color: 'from-cyan-400 to-blue-600',
      code: 'wizard.castSpell("iceShard", 12)',
      description: 'Freezing ice spell - 12 damage',
      icon: '❄️'
    },
    {
      id: 'cast-lightning',
      type: 'action',
      text: 'Cast Lightning Strike',
      color: 'from-yellow-400 to-purple-600',
      code: 'wizard.castSpell("lightning", 18)',
      description: 'Electric shock spell - 18 damage',
      icon: '⚡'
    },
    {
      id: 'cast-heal',
      type: 'action',
      text: 'Cast Healing Light',
      color: 'from-green-400 to-emerald-600',
      code: 'wizard.castSpell("heal", 20)',
      description: 'Restore wizard health - +20 HP',
      icon: '💚'
    },
    {
      id: 'dragon-attack',
      type: 'action',
      text: 'Dragon Counter-Attack',
      color: 'from-red-700 to-orange-800',
      code: 'dragon.attack(wizard)',
      description: 'Dragon retaliates with fury',
      icon: '🐉'
    },
    {
      id: 'update-damage',
      type: 'action',
      text: 'Update Total Damage',
      color: 'from-indigo-500 to-purple-600',
      code: 'totalDamage += damage',
      description: 'Track cumulative damage dealt',
      icon: '🎯'
    },
    {
      id: 'check-victory',
      type: 'condition',
      text: 'Check Dragon Defeated',
      color: 'from-yellow-500 to-orange-600',
      code: 'if (dragon.health <= 0)',
      description: 'Victory condition check',
      icon: '🏆'
    },
    {
      id: 'victory-celebration',
      type: 'action',
      text: 'Victory Celebration!',
      color: 'from-gold-400 to-yellow-600',
      code: 'wizard.celebrate()',
      description: 'Epic victory celebration',
      icon: '🎉'
    }
  ];

  // Battle effects animation
  useEffect(() => {
    if (activeSpells.length > 0) {
      const timer = setTimeout(() => {
        setActiveSpells(prev => prev.slice(1));
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [activeSpells]);

  // Dragon attack animation
  useEffect(() => {
    if (dragonAttacking) {
      const timer = setTimeout(() => {
        setDragonAttacking(false);
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [dragonAttacking]);

  // Get current user on component mount
  useEffect(() => {
    const userData = progressService.getCurrentUser();
    if (!userData) {
      navigate('/login');
    } else {
      setUser(userData);
    }
  }, [navigate]);

  // Calculate stars based on time and code efficiency
  const calculateStars = (timeSpent, codeBlockCount) => {
    let stars = 1; // Base star for completion
    
    // Time bonus (under 180 seconds = extra star)
    if (timeSpent < 180000) {
      stars++;
    }
    
    // Efficiency bonus (under 12 blocks = extra star)
    if (codeBlockCount <= 11) {
      stars++;
    }
    
    return Math.min(stars, 3);
  };

  // Save progress to database
  const saveProgress = async (success, timeSpent = 0) => {
    if (!user) return;

    setIsLoading(true);
    
    try {
      const stars = success ? calculateStars(timeSpent, codeBlocks.length) : 0;
      
      const result = await progressService.recordLevelAttempt(
        9, // Level 9 - Final level!
        success,
        stars,
        timeSpent,
        codeBlocks
      );

      if (success) {
        setLevelResults({
          stars,
          timeSpent,
          codeBlocks: codeBlocks.length,
          newAchievements: result.newAchievements || [],
          newRank: result.newRank
        });
        setShowResults(true);
      }
    } catch (error) {
      console.error('Error saving progress:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Format time display
  const formatTime = (ms) => {
    const seconds = Math.floor(ms / 1000);
    return `${seconds}s`;
  };

  // Star display component
  const StarDisplay = ({ count, size = "w-6 h-6" }) => (
    <div className="flex items-center space-x-1">
      {[...Array(3)].map((_, i) => (
        <Star
          key={i}
          className={`${size} ${i < count ? 'text-yellow-400 fill-current' : 'text-gray-400'}`}
        />
      ))}
    </div>
  );

  const Link = ({ to, children, className }) => (
    <a href={to} className={className}>
      {children}
    </a>
  );

  const handleDragStart = (e, block) => {
    setDraggedBlock(block);
    e.dataTransfer.effectAllowed = 'copy';
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'copy';
  };

  const handleDrop = (e) => {
    e.preventDefault();
    if (draggedBlock) {
      const newBlock = {
        ...draggedBlock,
        id: `${draggedBlock.id}-${Date.now()}`,
        uniqueId: Date.now()
      };
      setCodeBlocks([...codeBlocks, newBlock]);
      setDraggedBlock(null);
    }
  };

  const removeBlock = (uniqueId) => {
    setCodeBlocks(codeBlocks.filter(block => block.uniqueId !== uniqueId));
  };

  const clearCode = () => {
    setCodeBlocks([]);
    resetGame();
  };

  const resetGame = () => {
    setDragonHealth(100);
    setWizardHealth(100);
    setBattleRound(0);
    setSpellCount(0);
    setTotalDamage(0);
    setActiveSpells([]);
    setBattleLog([]);
    setGameState('playing');
    setIsRunning(false);
    setExecutionStep(-1);
    setVariables({});
    setGameMessage('Ready for the ultimate dragon battle!');
    setCurrentAction('');
    setDragonAttacking(false);
  };

  const addBattleLog = (message, type = 'info') => {
    setBattleLog(prev => [...prev.slice(-4), { message, type, timestamp: Date.now() }]);
  };

  const addSpellEffect = (spellKey, damage) => {
    const spell = spellTypes[spellKey];
    if (spell) {
      setActiveSpells(prev => [...prev, {
        id: Date.now(),
        ...spell,
        actualDamage: damage,
        timestamp: Date.now()
      }]);
    }
  };

  const runCode = async () => {
    if (codeBlocks.length === 0) {
      setGameMessage('Add some code blocks to start the epic battle!');
      return;
    }

    // Start timing
    const startTime = Date.now();
    setStartTime(startTime);
    
    setIsRunning(true);
    setGameState('playing');
    resetGame();
    
    let currentDragonHealth = 100;
    let currentWizardHealth = 100;
    let currentVariables = {};
    let currentTotalDamage = 0;
    let currentRound = 0;
    let currentSpellCount = 0;
    let hasVariables = false;

    addBattleLog('🏴 Battle begins! Prepare for epic combat!', 'battle');

    for (let i = 0; i < codeBlocks.length; i++) {
      setExecutionStep(i);
      setCurrentAction(codeBlocks[i].text);
      
      const block = codeBlocks[i];
      await new Promise(resolve => setTimeout(resolve, 1200));

      switch (block.type) {
        case 'variable':
          if (block.id.includes('init-variables')) {
            hasVariables = true;
            currentVariables.damage = 0;
            currentVariables.totalDamage = 0;
            setVariables({...currentVariables});
            setGameMessage('⚡ Battle variables initialized! Ready for combat!');
            addBattleLog('📊 Damage tracking systems online', 'system');
          }
          break;
          
        case 'loop':
          if (block.id.includes('outer-loop')) {
            setGameMessage('🔥 Beginning 5-round epic dragon battle!');
            addBattleLog('🔄 Entering main battle sequence', 'battle');
            
            // Outer loop - 5 battle rounds
            for (let round = 1; round <= 5 && currentDragonHealth > 0 && currentWizardHealth > 0; round++) {
              currentRound = round;
              setBattleRound(round);
              await new Promise(resolve => setTimeout(resolve, 800));
              setGameMessage(`⚔️ ROUND ${round} - Dragon roars with fury!`);
              addBattleLog(`⚔️ Round ${round} begins!`, 'battle');
              
              // Find and execute inner loop
              for (let j = i + 1; j < codeBlocks.length; j++) {
                const innerBlock = codeBlocks[j];
                
                if (innerBlock.id.includes('inner-loop')) {
                  setGameMessage(`✨ Preparing spell barrage for Round ${round}!`);
                  
                  // Inner loop - 3 spells per round
                  for (let spell = 1; spell <= 3 && currentDragonHealth > 0; spell++) {
                    currentSpellCount++;
                    setSpellCount(currentSpellCount);
                    await new Promise(resolve => setTimeout(resolve, 600));
                    
                    // Execute spell actions within inner loop
                    for (let k = j + 1; k < codeBlocks.length; k++) {
                      const spellBlock = codeBlocks[k];
                      
                      // Stop at end of inner loop or next major block
                      if (spellBlock.id.includes('dragon-attack') || 
                          spellBlock.id.includes('outer-loop') ||
                          spellBlock.id.includes('victory')) {
                        break;
                      }
                      
                      if (spellBlock.type === 'action' && spellBlock.id.includes('cast-')) {
                        let spellDamage = 0;
                        let spellKey = '';
                        
                        if (spellBlock.id.includes('fire-bolt')) {
                          spellDamage = 15;
                          spellKey = 'fire-bolt';
                          currentDragonHealth = Math.max(0, currentDragonHealth - spellDamage);
                          addSpellEffect(spellKey, spellDamage);
                          setGameMessage(`🔥 Fire Bolt erupts! Dragon takes ${spellDamage} damage!`);
                          addBattleLog(`🔥 Fire Bolt deals ${spellDamage} damage`, 'spell');
                        } else if (spellBlock.id.includes('ice-shard')) {
                          spellDamage = 12;
                          spellKey = 'ice-shard';
                          currentDragonHealth = Math.max(0, currentDragonHealth - spellDamage);
                          addSpellEffect(spellKey, spellDamage);
                          setGameMessage(`❄️ Ice Shard freezes! Dragon takes ${spellDamage} damage!`);
                          addBattleLog(`❄️ Ice Shard deals ${spellDamage} damage`, 'spell');
                        } else if (spellBlock.id.includes('lightning')) {
                          spellDamage = 18;
                          spellKey = 'lightning';
                          currentDragonHealth = Math.max(0, currentDragonHealth - spellDamage);
                          addSpellEffect(spellKey, spellDamage);
                          setGameMessage(`⚡ Lightning strikes! Dragon takes ${spellDamage} damage!`);
                          addBattleLog(`⚡ Lightning deals ${spellDamage} damage`, 'spell');
                        } else if (spellBlock.id.includes('heal')) {
                          currentWizardHealth = Math.min(100, currentWizardHealth + 20);
                          addSpellEffect('heal', 20);
                          setGameMessage(`💚 Healing light restores 20 HP!`);
                          addBattleLog(`💚 Wizard heals for 20 HP`, 'heal');
                        }
                        
                        if (spellDamage > 0) {
                          currentTotalDamage += spellDamage;
                          setTotalDamage(currentTotalDamage);
                          
                          if (hasVariables) {
                            currentVariables.damage = spellDamage;
                            currentVariables.totalDamage = currentTotalDamage;
                            setVariables({...currentVariables});
                          }
                        }
                        
                        setDragonHealth(currentDragonHealth);
                        setWizardHealth(currentWizardHealth);
                        await new Promise(resolve => setTimeout(resolve, 400));
                        
                        if (currentDragonHealth <= 0) {
                          setGameMessage('🎉 Dragon defeated! Victory achieved!');
                          addBattleLog('🏆 DRAGON DEFEATED!', 'victory');
                          break;
                        }
                      }
                    }
                    
                    if (currentDragonHealth <= 0) break;
                  }
                  break; // Exit inner loop search
                }
              }
              
              // Dragon counter-attack after spell barrage
              if (currentDragonHealth > 0 && codeBlocks.some(b => b.id.includes('dragon-attack'))) {
                setDragonAttacking(true);
                const attack = dragonAttacks[Math.floor(Math.random() * dragonAttacks.length)];
                currentWizardHealth = Math.max(0, currentWizardHealth - attack.damage);
                setWizardHealth(currentWizardHealth);
                setGameMessage(`🐉 Dragon retaliates with ${attack.name}! ${attack.damage} damage!`);
                addBattleLog(`🐉 ${attack.name} deals ${attack.damage} damage`, 'dragon');
                await new Promise(resolve => setTimeout(resolve, 800));
                
                if (currentWizardHealth <= 0) {
                  setGameMessage('💀 Wizard defeated! The dragon wins!');
                  setGameState('error');
                  setIsRunning(false);
                  setCurrentAction('');
                  return;
                }
              }
              
              if (currentDragonHealth <= 0) {
                addBattleLog(`🏆 Victory in Round ${round}!`, 'victory');
                break;
              }
            }
          }
          break;
          
        case 'action':
          if (block.id.includes('victory-celebration')) {
            if (currentDragonHealth <= 0) {
              const endTime = Date.now();
              setEndTime(endTime);
              const timeSpent = endTime - startTime;
              
              setGameState('success');
              setGameMessage('🏆 LEGENDARY VICTORY! The ancient dragon has been vanquished!');
              addBattleLog('🎉 EPIC VICTORY ACHIEVED!', 'victory');
              
              // Save progress to database
              await saveProgress(true, timeSpent);
              return;
            } else {
              setGameMessage(`❌ Dragon still lives with ${currentDragonHealth} HP! Battle continues!`);
              setGameState('error');
              await saveProgress(false);
              return;
            }
          }
          break;
          
        case 'condition':
          if (block.id.includes('check-victory')) {
            if (currentDragonHealth <= 0) {
              setGameMessage('✅ Victory condition met - Dragon has been defeated!');
              addBattleLog('✅ Victory condition verified', 'system');
            } else {
              setGameMessage(`⚠️ Dragon still alive with ${currentDragonHealth} HP!`);
              addBattleLog(`⚠️ Dragon health: ${currentDragonHealth}/100`, 'system');
            }
          }
          break;
      }
      
      if (currentDragonHealth <= 0 || currentWizardHealth <= 0) {
        break;
      }
    }

    setExecutionStep(-1);
    setIsRunning(false);
    setCurrentAction('');
    
    if (currentDragonHealth <= 0) {
      const endTime = Date.now();
      setEndTime(endTime);
      const timeSpent = endTime - startTime;
      
      setGameState('success');
      addBattleLog('🏆 ULTIMATE VICTORY!', 'victory');
      await saveProgress(true, timeSpent);
    } else if (currentWizardHealth <= 0) {
      setGameState('error');
      addBattleLog('💀 Wizard defeated...', 'defeat');
      await saveProgress(false);
    } else {
      setGameState('error');
      setGameMessage(`Battle incomplete! Dragon: ${currentDragonHealth}/100 HP, Wizard: ${currentWizardHealth}/100 HP`);
      await saveProgress(false);
    }
  };

  const getHealthBarColor = (health, isWizard = false) => {
    if (health > 70) return isWizard ? 'from-blue-500 to-blue-400' : 'from-red-500 to-red-400';
    if (health > 30) return isWizard ? 'from-yellow-500 to-yellow-400' : 'from-orange-500 to-orange-400';
    return isWizard ? 'from-red-500 to-red-400' : 'from-gray-500 to-gray-400';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-900 via-orange-800 to-yellow-700 relative overflow-hidden">
      {/* Enhanced Animated Background */}
      <div className="fixed inset-0 z-0">
        {/* Volcanic mountains with better gradients */}
        <div className="absolute bottom-0 left-0 w-full h-80 bg-gradient-to-t from-red-800/80 to-orange-700/60" 
             style={{clipPath: 'polygon(0 100%, 15% 30%, 35% 60%, 55% 20%, 75% 50%, 95% 25%, 100% 100%)'}} />
        <div className="absolute bottom-0 right-0 w-full h-72 bg-gradient-to-t from-orange-800/70 to-red-700/50"
             style={{clipPath: 'polygon(0 70%, 20% 25%, 40% 55%, 60% 15%, 80% 45%, 100% 10%, 100% 100%, 0 100%)'}} />
        
        {/* Animated lava flows */}
        <div className="absolute bottom-0 left-0 w-full h-16 bg-gradient-to-r from-red-600 via-orange-500 to-red-600 opacity-90">
          <div className="absolute inset-0 bg-gradient-to-t from-red-900/80 to-transparent animate-pulse"></div>
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-yellow-500/30 to-transparent animate-pulse" style={{animationDelay: '1s'}}></div>
        </div>
        
        {/* Floating embers and particles */}
        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            className="absolute text-orange-400 animate-bounce opacity-60"
            style={{
              left: `${10 + i * 12}%`,
              top: `${20 + (i % 3) * 20}%`,
              animationDelay: `${i * 0.5}s`,
              animationDuration: `${2 + i * 0.3}s`
            }}
          >
            {i % 3 === 0 ? '🔥' : i % 3 === 1 ? '✨' : '💫'}
          </div>
        ))}
        
        {/* Mystical atmosphere */}
        <div className="absolute top-1/4 left-1/4 text-6xl opacity-20 animate-pulse">💨</div>
        <div className="absolute top-1/3 right-1/3 text-4xl opacity-25 animate-pulse" style={{animationDelay: '2s'}}>🌟</div>
      </div>

      {/* Header */}
      <div className="relative z-10 bg-black/30 backdrop-blur-sm border-b border-red-500/30 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link to="/worlds" className="flex items-center space-x-2 text-white hover:text-yellow-300 transition-colors">
              <ArrowLeft className="w-5 h-5" />
              <span>Back to Worlds</span>
            </Link>
            <div className="h-6 w-px bg-white/30" />
            <div className="flex items-center space-x-2">
              <span className="text-2xl">🐉</span>
              <span className="text-white font-bold">Mountain Challenges - Level 9: Dragon's Lair</span>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="bg-red-600/30 px-4 py-2 rounded-lg border border-red-500/50">
              <span className="text-white">Round: {battleRound}/5 | Spells: {spellCount}</span>
            </div>
            <Link to="/student-dashboard" className="text-white hover:text-yellow-300 transition-colors">
              <Home className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </div>

      <div className="relative z-10 p-6 grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-80px)]">
        
        {/* Enhanced Instructions Panel */}
        <div className="bg-black/20 backdrop-blur-sm rounded-3xl border border-red-500/30 p-6 overflow-y-auto">
          <h2 className="text-2xl font-bold text-white mb-4 flex items-center space-x-2">
            <span className="text-3xl">🐉</span>
            <span>Epic Dragon Battle</span>
          </h2>
          
          <div className="space-y-4 text-white">
            <div className="bg-red-600/20 p-4 rounded-xl border border-red-500/30">
              <h3 className="font-bold mb-2 text-red-200 flex items-center space-x-2">
                <span>🎯</span>
                <span>Ultimate Mission:</span>
              </h3>
              <p className="text-sm">Defeat the ancient dragon using nested loops! Master the art of repeated spell casting across multiple battle rounds.</p>
            </div>
            
            <div className="bg-purple-600/20 p-4 rounded-xl border border-purple-500/30">
              <h3 className="font-bold mb-2 text-purple-200 flex items-center space-x-2">
                <span>🔄</span>
                <span>Nested Loop Strategy:</span>
              </h3>
              <div className="space-y-2 text-sm">
                <div className="flex items-center space-x-2">
                  <span className="text-red-300">🔥</span>
                  <span><strong>Outer Loop:</strong> 5 Battle Rounds</span>
                </div>
                <div className="flex items-center space-x-2 ml-4">
                  <span className="text-purple-300">✨</span>
                  <span><strong>Inner Loop:</strong> 3 Spells per Round</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-yellow-300">⚡</span>
                  <span><strong>Total Power:</strong> Up to 15 spell casts!</span>
                </div>
              </div>
            </div>
            
            <div className="bg-orange-600/20 p-4 rounded-xl border border-orange-500/30">
              <h3 className="font-bold mb-2 text-orange-200 flex items-center space-x-2">
                <span>⚔️</span>
                <span>Combat System:</span>
              </h3>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div className="space-y-1">
                  <div className="flex items-center space-x-1">
                    <span>🔥</span>
                    <span><strong>Fire Bolt:</strong> 15 dmg</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <span>❄️</span>
                    <span><strong>Ice Shard:</strong> 12 dmg</span>
                  </div>
                </div>
                <div className="space-y-1">
                  <div className="flex items-center space-x-1">
                    <span>⚡</span>
                    <span><strong>Lightning:</strong> 18 dmg</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <span>💚</span>
                    <span><strong>Heal:</strong> +20 HP</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-green-600/20 p-4 rounded-xl border border-green-500/30">
              <h3 className="font-bold mb-2 text-green-200 flex items-center space-x-2">
                <span>💡</span>
                <span>Winning Strategy:</span>
              </h3>
              <ul className="text-sm space-y-1">
                <li>• Initialize damage tracking variables</li>
                <li>• Use nested loops (outer: rounds, inner: spells)</li>
                <li>• Cast powerful spells strategically</li>
                <li>• Include healing to survive dragon attacks</li>
                <li>• Track total damage for victory condition</li>
                <li>• Dragon has 100 HP - plan accordingly!</li>
              </ul>
            </div>
          </div>

          {/* Enhanced Block Toolbox */}
          <div className="mt-6">
            <h3 className="text-lg font-bold text-white mb-4 flex items-center space-x-2">
              <span>🧰</span>
              <span>Legendary Arsenal</span>
            </h3>
            <div className="space-y-3 max-h-80 overflow-y-auto">
              {availableBlocks.map((block) => (
                <div
                  key={block.id}
                  draggable
                  onDragStart={(e) => handleDragStart(e, block)}
                  className={`p-3 bg-gradient-to-r ${block.color} text-white rounded-xl cursor-grab active:cursor-grabbing hover:scale-105 transition-all duration-200 shadow-lg border border-white/20`}
                >
                  <div className="flex items-center space-x-2 mb-1">
                    <span className="text-lg">{block.icon}</span>
                    <div className="font-bold text-sm">{block.text}</div>
                  </div>
                  <div className="text-xs opacity-80 ml-6">{block.description}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Enhanced Epic Battle Arena */}
        <div className="bg-black/20 backdrop-blur-sm rounded-3xl border border-red-500/30 p-6 flex flex-col relative overflow-hidden">
          <h2 className="text-xl font-bold text-white mb-4 flex items-center space-x-2">
            <span className="text-2xl">🏟️</span>
            <span>Dragon's Volcanic Lair</span>
            {isRunning && (
              <div className="ml-4 flex items-center space-x-2 text-yellow-300">
                <div className="animate-spin w-4 h-4 border-2 border-yellow-300 border-t-transparent rounded-full"></div>
                <span className="text-sm">Battling...</span>
              </div>
            )}
          </h2>
          
          {/* Current Action Display */}
          {currentAction && (
            <div className="mb-4 p-3 bg-gradient-to-r from-purple-500/20 to-blue-500/20 rounded-lg border border-purple-400/30">
              <div className="text-white text-sm font-semibold flex items-center space-x-2">
                <Zap className="w-4 h-4 text-yellow-400" />
                <span>Current Action: {currentAction}</span>
              </div>
            </div>
          )}
          
          {/* Game Status Message */}
          {gameMessage && (
            <div className="mb-4 p-3 bg-red-600/20 rounded-lg border border-red-500/30 backdrop-blur-sm">
              <div className="text-white text-sm font-medium">{gameMessage}</div>
            </div>
          )}
          
          {/* Epic Battle Arena */}
          <div className="flex-1 relative bg-gradient-to-b from-red-900/30 to-orange-800/30 rounded-xl border border-red-500/20 overflow-hidden">
            
            {/* Dragon Side - Enhanced */}
            <div className="absolute top-6 right-6 w-56 h-40">
              <div className="relative">
                {/* Dragon with attack animation */}
                <div className={`text-9xl filter drop-shadow-2xl transition-all duration-500 ${
                  dragonAttacking ? 'animate-pulse scale-110 text-red-400' : 'animate-pulse'
                }`} style={{animationDuration: dragonAttacking ? '0.3s' : '3s'}}>
                  🐉
                </div>
                
                {/* Dragon effects */}
                {dragonHealth > 70 && (
                  <div className="absolute -left-16 top-10 text-5xl animate-bounce opacity-80">
                    🔥
                  </div>
                )}
                {dragonHealth <= 30 && (
                  <div className="absolute -right-8 top-12 text-3xl animate-pulse opacity-70">
                    💀
                  </div>
                )}
                
                {/* Enhanced Dragon Health Bar */}
                <div className="absolute -bottom-12 left-0 right-0">
                  <div className="flex items-center justify-between text-white text-sm mb-2">
                    <span className="font-bold">🐉 Ancient Dragon</span>
                    <span className="font-mono">{dragonHealth}/100 HP</span>
                  </div>
                  <div className="relative w-full bg-black/50 rounded-full h-4 border-2 border-red-500/50">
                    <div 
                      className={`bg-gradient-to-r ${getHealthBarColor(dragonHealth)} h-full rounded-full transition-all duration-700 shadow-lg relative overflow-hidden`}
                      style={{ width: `${dragonHealth}%` }}
                    >
                      <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-pulse"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Wizard Side - Enhanced */}
            <div className="absolute bottom-6 left-6 w-40 h-40">
              <div className="relative">
                {/* Wizard with spell casting animation */}
                <div className={`text-7xl filter drop-shadow-xl transition-all duration-300 ${
                  activeSpells.length > 0 ? 'animate-bounce scale-110' : 'animate-bounce'
                }`} style={{animationDuration: activeSpells.length > 0 ? '0.5s' : '2s'}}>
                  🧙‍♂️
                </div>
                
                {/* Wizard magical aura */}
                {wizardHealth > 70 && (
                  <div className="absolute inset-0 text-5xl animate-spin opacity-50" style={{animationDuration: '4s'}}>
                    ✨
                  </div>
                )}
                {wizardHealth <= 30 && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 text-2xl animate-pulse text-red-400">
                    💔
                  </div>
                )}
                
                {/* Enhanced Wizard Health Bar */}
                <div className="absolute -bottom-12 left-0 right-0">
                  <div className="flex items-center justify-between text-white text-sm mb-2">
                    <span className="font-bold">🧙‍♂️ Battle Mage</span>
                    <span className="font-mono">{wizardHealth}/100 HP</span>
                  </div>
                  <div className="relative w-full bg-black/50 rounded-full h-4 border-2 border-blue-500/50">
                    <div 
                      className={`bg-gradient-to-r ${getHealthBarColor(wizardHealth, true)} h-full rounded-full transition-all duration-700 shadow-lg relative overflow-hidden`}
                      style={{ width: `${wizardHealth}%` }}
                    >
                      <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-pulse"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Enhanced Battle Effects Center Stage */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="relative w-80 h-48">
                
                {/* Dynamic Battle Ground */}
                <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-r from-red-800 via-orange-700 to-red-800 rounded-lg border border-red-600/50">
                  <div className="absolute inset-0 bg-gradient-to-t from-red-900/80 to-transparent rounded-lg"></div>
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-yellow-500/30 to-transparent animate-pulse"></div>
                  {/* Lava bubbles */}
                  {[...Array(5)].map((_, i) => (
                    <div
                      key={i}
                      className="absolute w-2 h-2 bg-orange-400 rounded-full animate-bounce opacity-70"
                      style={{
                        left: `${20 + i * 15}%`,
                        bottom: '2px',
                        animationDelay: `${i * 0.3}s`,
                        animationDuration: `${1 + i * 0.2}s`
                      }}
                    ></div>
                  ))}
                </div>
                
                {/* Active Spell Effects - Much Enhanced */}
                <div className="absolute inset-0">
                  {activeSpells.slice(-4).map((spell, index) => (
                    <div
                      key={spell.id}
                      className={`absolute transition-all duration-1000 ${
                        spell.effect === 'burn' ? 'animate-pulse' :
                        spell.effect === 'freeze' ? 'animate-bounce' :
                        spell.effect === 'shock' ? 'animate-ping' :
                        'animate-pulse'
                      }`}
                      style={{
                        left: `${30 + index * 25}%`,
                        top: `${20 + index * 15}%`,
                        animationDuration: spell.effect === 'shock' ? '0.3s' : '1s'
                      }}
                    >
                      <div className={`text-5xl ${spell.color} filter drop-shadow-lg`}>
                        {spell.icon}
                      </div>
                      <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 text-xs text-white bg-black/60 px-2 py-1 rounded">
                        {spell.actualDamage > 0 ? `-${spell.actualDamage}` : `+${Math.abs(spell.actualDamage)}`}
                      </div>
                    </div>
                  ))}
                </div>
                
                {/* Special Effect Overlays */}
                {activeSpells.some(s => s.effect === 'shock') && (
                  <div className="absolute inset-0 pointer-events-none">
                    <div className="absolute top-0 left-1/2 w-1 h-full bg-yellow-400 opacity-90 animate-pulse transform -translate-x-0.5"></div>
                    <div className="absolute top-1/3 left-1/3 w-0.5 h-2/3 bg-purple-400 opacity-70 animate-pulse transform rotate-12"></div>
                    <div className="absolute top-1/4 right-1/3 w-0.5 h-1/2 bg-blue-400 opacity-60 animate-pulse transform -rotate-12"></div>
                  </div>
                )}
                
                {activeSpells.some(s => s.effect === 'freeze') && (
                  <div className="absolute bottom-12 left-1/2 transform -translate-x-1/2">
                    <div className="text-4xl opacity-90 animate-pulse">❄️</div>
                    <div className="text-3xl opacity-70 animate-pulse absolute -left-4 -top-2">🧊</div>
                    <div className="text-2xl opacity-50 animate-pulse absolute -right-2 -top-1">❄️</div>
                  </div>
                )}
                
                {activeSpells.some(s => s.effect === 'burn') && (
                  <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                    <div className="text-6xl opacity-90 animate-bounce">💥</div>
                    <div className="absolute inset-0 text-4xl opacity-60 animate-ping">🔥</div>
                  </div>
                )}
                
                {activeSpells.some(s => s.effect === 'heal') && (
                  <div className="absolute top-1/4 left-6">
                    <div className="text-4xl opacity-90 animate-pulse text-green-400">✨</div>
                    <div className="text-3xl opacity-70 animate-bounce text-green-300 absolute -right-2 -top-1">💚</div>
                  </div>
                )}
              </div>
            </div>

            {/* Enhanced Battle Statistics */}
            <div className="absolute top-4 left-4 bg-black/50 backdrop-blur-sm rounded-xl p-4 border border-yellow-500/30">
              <h4 className="text-yellow-300 font-bold text-sm mb-3 flex items-center space-x-2">
                <span>⚔️</span>
                <span>Battle Stats</span>
              </h4>
              <div className="space-y-2 text-xs text-white">
                <div className="flex items-center justify-between">
                  <span>Round:</span>
                  <span className="font-mono text-red-300">{battleRound}/5</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Spells Cast:</span>
                  <span className="font-mono text-purple-300">{spellCount}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Total Damage:</span>
                  <span className="font-mono text-orange-300">{totalDamage}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Dragon HP:</span>
                  <span className={`font-mono ${dragonHealth <= 30 ? 'text-red-400' : 'text-red-300'}`}>
                    {dragonHealth}/100
                  </span>
                </div>
              </div>
            </div>

            {/* Enhanced Battle Log */}
            <div className="absolute bottom-4 right-4 bg-black/50 backdrop-blur-sm rounded-xl p-3 border border-purple-500/30 w-64">
              <h4 className="text-purple-300 font-bold text-sm mb-2 flex items-center space-x-2">
                <span>📜</span>
                <span>Battle Log</span>
              </h4>
              <div className="space-y-1 max-h-24 overflow-y-auto">
                {battleLog.slice(-4).map((log, index) => (
                  <div key={log.timestamp} className={`text-xs flex items-center space-x-2 ${
                    log.type === 'victory' ? 'text-yellow-300' :
                    log.type === 'battle' ? 'text-red-300' :
                    log.type === 'spell' ? 'text-purple-300' :
                    log.type === 'dragon' ? 'text-orange-300' :
                    log.type === 'heal' ? 'text-green-300' :
                    'text-white'
                  }`}>
                    <span>{log.message}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Enhanced Victory/Defeat Overlays */}
            {gameState === 'success' && (
              <div className="absolute inset-0 bg-gradient-to-br from-yellow-900/90 via-orange-800/80 to-red-900/90 backdrop-blur-sm flex items-center justify-center rounded-xl">
                <div className="text-center">
                  <div className="text-9xl mb-6 animate-bounce">🏆</div>
                  <div className="text-5xl font-bold text-yellow-300 mb-4 animate-pulse">LEGENDARY VICTORY!</div>
                  <div className="text-2xl text-white mb-6">The Ancient Dragon Falls!</div>
                  <div className="flex justify-center space-x-2 mb-4">
                    <Star className="w-10 h-10 text-yellow-400 fill-current animate-pulse" />
                    <Star className="w-10 h-10 text-yellow-400 fill-current animate-pulse" style={{animationDelay: '0.2s'}} />
                    <Star className="w-10 h-10 text-yellow-400 fill-current animate-pulse" style={{animationDelay: '0.4s'}} />
                  </div>
                  <div className="text-lg text-yellow-200">
                    Total Damage: {totalDamage} | Rounds: {battleRound} | Spells: {spellCount}
                  </div>
                </div>
              </div>
            )}

            {gameState === 'error' && (
              <div className="absolute inset-0 bg-gradient-to-br from-red-900/90 via-gray-800/80 to-black/90 backdrop-blur-sm flex items-center justify-center rounded-xl">
                <div className="text-center">
                  <div className="text-7xl mb-4">💀</div>
                  <div className="text-3xl font-bold text-red-300 mb-3">Battle Failed!</div>
                  <div className="text-white text-sm mb-2">{gameMessage}</div>
                  <div className="text-gray-300 text-xs">
                    {wizardHealth <= 0 ? 'The wizard has fallen...' : 'Strategy needs refinement'}
                  </div>
                </div>
              </div>
            )}
          </div>
          
          {/* Enhanced Variables Display */}
          <div className="mt-4 bg-purple-600/20 p-4 rounded-xl border border-purple-500/30">
            <h3 className="text-purple-200 font-bold mb-3 flex items-center space-x-2">
              <span>📊</span>
              <span>Loop Variables</span>
            </h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-white/80">damage:</span>
                  <span className="text-red-300 font-mono">
                    {variables.damage !== undefined ? variables.damage : 'undefined'}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-white/80">totalDamage:</span>
                  <span className="text-orange-300 font-mono">
                    {variables.totalDamage !== undefined ? variables.totalDamage : 'undefined'}
                  </span>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-white/80">round:</span>
                  <span className="text-blue-300 font-mono">{battleRound}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-white/80">spellCount:</span>
                  <span className="text-purple-300 font-mono">{spellCount}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Code Area */}
        <div className="bg-black/20 backdrop-blur-sm rounded-3xl border border-red-500/30 p-6 flex flex-col max-h-full overflow-hidden">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-white flex items-center space-x-2">
              <span className="text-2xl">🔥</span>
              <span>Dragon Battle Code</span>
            </h2>
            <div className="flex space-x-2">
              <button
                onClick={clearCode}
                className="p-2 bg-red-500/20 text-red-300 rounded-lg hover:bg-red-500/30 transition-colors border border-red-500/50"
                title="Clear All"
                disabled={isRunning}
              >
                <RotateCcw className="w-4 h-4" />
              </button>
              <button
                onClick={runCode}
                disabled={isRunning || codeBlocks.length === 0}
                className="px-4 py-2 bg-gradient-to-r from-red-600 to-orange-600 text-white rounded-lg hover:scale-105 transition-transform disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2 border border-red-500/50"
              >
                <Flame className="w-4 h-4" />
                <span>{isRunning ? 'Battling...' : 'Begin Epic Battle'}</span>
              </button>
            </div>
          </div>
          
          {/* Execution Status */}
          {isRunning && (
            <div className="mb-4 p-3 bg-yellow-500/20 rounded-lg border border-yellow-400/30">
              <div className="flex items-center space-x-2 text-yellow-300">
                <div className="animate-spin w-4 h-4 border-2 border-yellow-300 border-t-transparent rounded-full"></div>
                <span className="text-sm">Executing step {executionStep + 1} of {codeBlocks.length}</span>
              </div>
            </div>
          )}
          
          {/* Enhanced Drop Zone */}
          <div
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            className="flex-1 border-2 border-dashed border-red-500/30 rounded-xl p-4 min-h-32 max-h-96 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-white/30 scrollbar-track-white/10 bg-black/10"
          >
            {codeBlocks.length === 0 ? (
              <div className="flex items-center justify-center h-32 text-white/60 text-center">
                <div>
                  <div className="text-4xl mb-4">🐉</div>
                  <div className="text-lg mb-2">Drag blocks to build your battle strategy!</div>
                  <div className="text-sm opacity-80">Start with "Initialize Variables" → "Battle Rounds" → "Cast Spells"</div>
                </div>
              </div>
            ) : (
              <div className="space-y-3 pb-2">
                {codeBlocks.map((block, index) => (
                  <div
                    key={block.uniqueId}
                    className={`p-3 bg-gradient-to-r ${block.color} text-white rounded-xl relative group transition-all duration-300 border border-white/20 ${
                      executionStep === index ? 'ring-4 ring-yellow-400 ring-opacity-75 scale-105 shadow-2xl' : ''
                    } ${isRunning && executionStep > index ? 'opacity-70' : ''}`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <span className="text-lg">{block.icon}</span>
                        <div>
                          <div className="font-bold text-sm">{block.text}</div>
                          <div className="text-xs opacity-80 font-mono">{block.code}</div>
                        </div>
                      </div>
                      <button
                        onClick={() => removeBlock(block.uniqueId)}
                        className="opacity-0 group-hover:opacity-100 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs transition-opacity hover:bg-red-600"
                        disabled={isRunning}
                      >
                        ×
                      </button>
                    </div>
                    
                    {/* Enhanced Step Indicator */}
                    <div className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-3 w-6 h-6 bg-white rounded-full text-xs flex items-center justify-center text-gray-800 font-bold border-2 border-gray-300">
                      {index + 1}
                    </div>
                    
                    {/* Execution Indicators */}
                    {executionStep === index && (
                      <div className="absolute -top-2 -right-2 w-4 h-4 bg-yellow-400 rounded-full animate-pulse"></div>
                    )}
                    
                    {isRunning && executionStep > index && (
                      <div className="absolute -top-2 -right-2 w-4 h-4 bg-green-400 rounded-full flex items-center justify-center">
                        <CheckCircle className="w-3 h-3 text-white" />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
          
          {/* Enhanced Strategy Guide */}
          <div className="mt-4 bg-red-600/20 p-3 rounded-xl border border-red-500/30">
            <div className="text-red-200 text-xs mb-2 flex items-center space-x-2">
              <span>🔥</span>
              <span>Nested Loop Battle Pattern:</span>
            </div>
            <div className="text-red-100 text-sm space-y-1 font-mono">
              <div><strong>1.</strong> Initialize Variables</div>
              <div><strong>2.</strong> Outer: for (round = 1; round ≤ 5; round++)</div>
              <div className="ml-4"><strong>3.</strong> Inner: for (spell = 1; spell ≤ 3; spell++)</div>
              <div className="ml-8"><strong>4.</strong> Cast Spells (Fire/Ice/Lightning/Heal)</div>
              <div className="ml-8"><strong>5.</strong> Update Damage</div>
              <div className="ml-4"><strong>6.</strong> Dragon Counter-Attack</div>
              <div><strong>7.</strong> Check Victory & Celebrate</div>
            </div>
          </div>
          
          {/* Enhanced Code Preview */}
          <div className="mt-4 bg-black/50 p-3 rounded-xl border border-yellow-500/30">
            <div className="flex items-center justify-between mb-2">
              <div className="text-yellow-300 text-xs flex items-center space-x-2">
                <span>⚡</span>
                <span>Generated Battle Code:</span>
              </div>
              <div className="text-xs text-white/40">
                {codeBlocks.length} blocks | {codeBlocks.filter(b => b.type === 'loop').length} loops
              </div>
            </div>
            <div className="text-green-300 font-mono text-sm max-h-32 overflow-y-auto">
              {codeBlocks.length === 0 ? (
                <span className="text-white/40">// Your epic dragon battle code will appear here</span>
              ) : (
                codeBlocks.map((block, index) => (
                  <div key={index} className={`${
                    executionStep === index ? 'bg-yellow-500/20 px-1 rounded text-yellow-300 font-bold' : ''
                  }`}>
                    {block.code}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Results Modal */}
      {showResults && levelResults && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-gradient-to-br from-red-900 to-orange-900 rounded-3xl p-8 max-w-md w-full border-2 border-yellow-400/50 shadow-2xl">
            <div className="text-center">
              <div className="text-6xl mb-4">🏆</div>
              <h2 className="text-3xl font-bold text-white mb-2">LEGENDARY VICTORY!</h2>
              <p className="text-orange-200 mb-6">Dragon Slayer - Master Wizard!</p>
              
              {/* Stars */}
              <div className="mb-6">
                <div className="text-white font-bold mb-2">Epic Performance:</div>
                <StarDisplay count={levelResults.stars} size="w-8 h-8" />
              </div>
              
              {/* Stats */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-white/10 rounded-xl p-4">
                  <div className="flex items-center justify-center space-x-2 text-blue-300">
                    <Clock className="w-4 h-4" />
                    <span className="text-sm">Battle Time</span>
                  </div>
                  <div className="text-white font-bold">{formatTime(levelResults.timeSpent)}</div>
                </div>
                <div className="bg-white/10 rounded-xl p-4">
                  <div className="flex items-center justify-center space-x-2 text-purple-300">
                    <Sparkles className="w-4 h-4" />
                    <span className="text-sm">Code Blocks</span>
                  </div>
                  <div className="text-white font-bold">{levelResults.codeBlocks}</div>
                </div>
              </div>
              
              {/* Achievements */}
              {levelResults.newAchievements && levelResults.newAchievements.length > 0 && (
                <div className="mb-6">
                  <div className="text-white font-bold mb-2">🏆 New Achievements:</div>
                  <div className="space-y-2">
                    {levelResults.newAchievements.map((achievement, index) => (
                      <div key={index} className="bg-yellow-500/20 p-3 rounded-xl border border-yellow-400/30">
                        <div className="text-yellow-300 font-bold text-sm">{achievement.name}</div>
                        <div className="text-yellow-200 text-xs">{achievement.description}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              {/* Rank Up */}
              {levelResults.newRank && (
                <div className="mb-6">
                  <div className="bg-purple-500/20 p-4 rounded-xl border border-purple-400/30">
                    <div className="flex items-center justify-center space-x-2 text-purple-300 mb-2">
                      <Trophy className="w-5 h-5" />
                      <span className="font-bold">FINAL RANK ACHIEVED!</span>
                    </div>
                    <div className="text-white font-bold text-lg">{levelResults.newRank}</div>
                  </div>
                </div>
              )}

              {/* Final Level Completion Message */}
              <div className="mb-6 p-4 bg-gradient-to-r from-gold-500/20 to-yellow-500/20 rounded-xl border border-yellow-400/30">
                <div className="text-yellow-300 font-bold text-lg mb-2">🎓 CODING JOURNEY COMPLETE!</div>
                <div className="text-yellow-200 text-sm">
                  Congratulations! You've mastered all programming concepts from variables to nested loops!
                </div>
              </div>
              
              {/* Buttons */}
              <div className="flex space-x-4">
                <button
                  onClick={() => {
                    setShowResults(false);
                    resetGame();
                  }}
                  className="flex-1 py-3 bg-gradient-to-r from-red-500 to-orange-500 text-white rounded-xl font-bold hover:scale-105 transition-transform"
                >
                  Battle Again
                </button>
                <button
                  onClick={() => navigate('/worlds')}
                  className="flex-1 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl font-bold hover:scale-105 transition-transform"
                >
                  View Journey
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Loading Overlay */}
      {isLoading && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 text-center">
            <div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <div className="text-white">Saving legendary victory...</div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LevelNineGame;