import React, { useState, useEffect } from 'react';
import { Sparkles, Play, RotateCcw, CheckCircle, Star, Home, ArrowLeft, Flame, Zap } from 'lucide-react';

const LevelNineGame = () => {
  const [draggedBlock, setDraggedBlock] = useState(null);
  const [codeBlocks, setCodeBlocks] = useState([]);
  const [gameState, setGameState] = useState('playing'); // 'playing', 'success', 'error'
  const [isRunning, setIsRunning] = useState(false);
  const [wizardPosition, setWizardPosition] = useState(0);
  const [executionStep, setExecutionStep] = useState(-1);
  const [variables, setVariables] = useState({});
  const [gameMessage, setGameMessage] = useState('');
  const [dragonHealth, setDragonHealth] = useState(100);
  const [spellsCast, setSpellsCast] = useState([]);
  const [fireEffects, setFireEffects] = useState([]);
  const [wizardShield, setWizardShield] = useState(100);
  const [battleRound, setBattleRound] = useState(0);

  const dragonAttacks = [
    { name: 'Fire Breath', damage: 15, pattern: 'horizontal' },
    { name: 'Claw Strike', damage: 20, pattern: 'single' },
    { name: 'Wing Blast', damage: 10, pattern: 'area' },
    { name: 'Tail Whip', damage: 25, pattern: 'sweep' }
  ];

  const spellTypes = [
    { name: 'Fire Bolt', damage: 15, color: 'from-red-500 to-orange-600', icon: '🔥' },
    { name: 'Ice Shard', damage: 12, color: 'from-blue-500 to-cyan-600', icon: '❄️' },
    { name: 'Lightning', damage: 18, color: 'from-yellow-500 to-purple-600', icon: '⚡' },
    { name: 'Heal', damage: -20, color: 'from-green-500 to-emerald-600', icon: '💚' }
  ];

  const availableBlocks = [
    {
      id: 'create-outer-loop',
      type: 'loop',
      text: 'Battle Rounds (5 times)',
      color: 'from-red-600 to-red-700',
      code: 'for (let round = 0; round < 5; round++)',
      description: 'Main battle loop - 5 rounds of combat'
    },
    {
      id: 'create-spell-loop',
      type: 'loop',
      text: 'Cast Spells (3 times)',
      color: 'from-purple-600 to-purple-700',
      code: 'for (let spell = 0; spell < 3; spell++)',
      description: 'Inner loop - cast 3 spells per round'
    },
    {
      id: 'create-variables',
      type: 'variable',
      text: 'Initialize Battle Variables',
      color: 'from-blue-500 to-blue-600',
      code: 'let damage = 0; let totalDamage = 0',
      description: 'Creates damage tracking variables'
    },
    {
      id: 'cast-fire-bolt',
      type: 'action',
      text: 'Cast Fire Bolt',
      color: 'from-orange-500 to-red-600',
      code: 'wizard.castSpell("fireBolt", 15)',
      description: 'Powerful fire spell - 15 damage'
    },
    {
      id: 'cast-ice-shard',
      type: 'action',
      text: 'Cast Ice Shard',
      color: 'from-cyan-500 to-blue-600',
      code: 'wizard.castSpell("iceShard", 12)',
      description: 'Freezing ice spell - 12 damage'
    },
    {
      id: 'cast-lightning',
      type: 'action',
      text: 'Cast Lightning',
      color: 'from-yellow-500 to-purple-600',
      code: 'wizard.castSpell("lightning", 18)',
      description: 'Electric shock spell - 18 damage'
    },
    {
      id: 'cast-heal',
      type: 'action',
      text: 'Cast Healing Spell',
      color: 'from-green-500 to-emerald-600',
      code: 'wizard.castSpell("heal", 20)',
      description: 'Restore wizard health - +20 HP'
    },
    {
      id: 'dragon-attack',
      type: 'action',
      text: 'Dragon Attacks',
      color: 'from-red-700 to-orange-700',
      code: 'dragon.attack(wizard)',
      description: 'Dragon retaliates with random attack'
    },
    {
      id: 'update-damage',
      type: 'action',
      text: 'Update Damage Counter',
      color: 'from-purple-500 to-purple-600',
      code: 'totalDamage = totalDamage + damage',
      description: 'Adds spell damage to total'
    },
    {
      id: 'check-victory',
      type: 'condition',
      text: 'Check if Dragon Defeated',
      color: 'from-yellow-500 to-orange-600',
      code: 'if (dragon.health <= 0)',
      description: 'Victory condition check'
    },
    {
      id: 'inner-loop-end',
      type: 'structure',
      text: 'End Spell Loop',
      color: 'from-gray-500 to-gray-600',
      code: '}',
      description: 'Closes inner spell casting loop'
    },
    {
      id: 'outer-loop-end',
      type: 'structure',
      text: 'End Battle Round',
      color: 'from-gray-600 to-gray-700',
      code: '}',
      description: 'Closes outer battle round loop'
    },
    {
      id: 'victory-celebration',
      type: 'action',
      text: 'Victory Celebration!',
      color: 'from-gold-500 to-yellow-600',
      code: 'wizard.celebrate()',
      description: 'Epic victory celebration'
    }
  ];

  // Fire effects animation
  useEffect(() => {
    const interval = setInterval(() => {
      setFireEffects(prev => {
        const newEffects = [];
        for (let i = 0; i < 3; i++) {
          newEffects.push({
            id: Date.now() + i,
            x: Math.random() * 100,
            y: Math.random() * 100,
            size: Math.random() * 20 + 10,
            opacity: Math.random() * 0.8 + 0.2
          });
        }
        return newEffects;
      });
    }, 500);

    return () => clearInterval(interval);
  }, []);

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
    setWizardPosition(0);
    setDragonHealth(100);
    setWizardShield(100);
    setSpellsCast([]);
    setBattleRound(0);
    setGameState('playing');
    setIsRunning(false);
    setExecutionStep(-1);
    setVariables({});
    setGameMessage('');
  };

  const addSpellEffect = (spellType, damage) => {
    const spell = spellTypes.find(s => s.name.toLowerCase().includes(spellType.toLowerCase()));
    if (spell) {
      setSpellsCast(prev => [...prev, {
        id: Date.now(),
        ...spell,
        damage: damage,
        timestamp: Date.now()
      }]);
    }
  };

  const runCode = async () => {
    if (codeBlocks.length === 0) return;
    
    setIsRunning(true);
    setGameState('playing');
    resetGame();
    
    let currentDragonHealth = 100;
    let currentWizardHealth = 100;
    let currentVariables = {};
    let totalDamageDealt = 0;
    let currentRound = 0;
    let hasVariables = false;

    for (let i = 0; i < codeBlocks.length; i++) {
      setExecutionStep(i);
      
      const block = codeBlocks[i];
      await new Promise(resolve => setTimeout(resolve, 1000));

      switch (block.type) {
        case 'variable':
          if (block.id.includes('create-variables')) {
            hasVariables = true;
            currentVariables.damage = 0;
            currentVariables.totalDamage = 0;
            setVariables({...currentVariables});
            setGameMessage('Battle variables initialized!');
          }
          break;
          
        case 'loop':
          if (block.id.includes('create-outer-loop')) {
            setGameMessage('🔥 Starting epic 5-round dragon battle!');
            
            // Outer loop - 5 battle rounds
            for (let round = 0; round < 5 && currentDragonHealth > 0; round++) {
              setBattleRound(round + 1);
              currentRound = round + 1;
              await new Promise(resolve => setTimeout(resolve, 800));
              setGameMessage(`⚔️ Battle Round ${round + 1}!`);
              
              // Find inner spell loop
              for (let j = i + 1; j < codeBlocks.length; j++) {
                const innerBlock = codeBlocks[j];
                if (innerBlock.type === 'structure' && innerBlock.id.includes('outer-loop-end')) {
                  break;
                }
                
                if (innerBlock.id.includes('create-spell-loop')) {
                  setGameMessage('✨ Casting multiple spells!');
                  
                  // Inner loop - 3 spells per round
                  for (let spell = 0; spell < 3 && currentDragonHealth > 0; spell++) {
                    await new Promise(resolve => setTimeout(resolve, 600));
                    
                    // Find spell actions in inner loop
                    for (let k = j + 1; k < codeBlocks.length; k++) {
                      const spellBlock = codeBlocks[k];
                      if (spellBlock.type === 'structure' && spellBlock.id.includes('inner-loop-end')) {
                        break;
                      }
                      
                      if (spellBlock.type === 'action' && spellBlock.id.includes('cast-')) {
                        let spellDamage = 0;
                        let spellName = '';
                        
                        if (spellBlock.id.includes('fire-bolt')) {
                          spellDamage = 15;
                          spellName = 'fire';
                          addSpellEffect('fire', spellDamage);
                          setGameMessage(`🔥 Fire Bolt hits dragon for ${spellDamage} damage!`);
                        } else if (spellBlock.id.includes('ice-shard')) {
                          spellDamage = 12;
                          spellName = 'ice';
                          addSpellEffect('ice', spellDamage);
                          setGameMessage(`❄️ Ice Shard freezes dragon for ${spellDamage} damage!`);
                        } else if (spellBlock.id.includes('lightning')) {
                          spellDamage = 18;
                          spellName = 'lightning';
                          addSpellEffect('lightning', spellDamage);
                          setGameMessage(`⚡ Lightning strikes for ${spellDamage} damage!`);
                        } else if (spellBlock.id.includes('heal')) {
                          currentWizardHealth = Math.min(100, currentWizardHealth + 20);
                          setWizardShield(currentWizardHealth);
                          addSpellEffect('heal', 20);
                          setGameMessage(`💚 Wizard heals for 20 HP!`);
                        }
                        
                        if (spellDamage > 0) {
                          currentDragonHealth = Math.max(0, currentDragonHealth - spellDamage);
                          totalDamageDealt += spellDamage;
                          setDragonHealth(currentDragonHealth);
                          
                          if (hasVariables) {
                            currentVariables.damage = spellDamage;
                            currentVariables.totalDamage = totalDamageDealt;
                            setVariables({...currentVariables});
                          }
                        }
                        
                        await new Promise(resolve => setTimeout(resolve, 400));
                      }
                    }
                  }
                }
                
                // Dragon counter-attack
                if (innerBlock.id.includes('dragon-attack') && currentDragonHealth > 0) {
                  const attack = dragonAttacks[Math.floor(Math.random() * dragonAttacks.length)];
                  currentWizardHealth = Math.max(0, currentWizardHealth - attack.damage);
                  setWizardShield(currentWizardHealth);
                  setGameMessage(`🐉 Dragon uses ${attack.name} for ${attack.damage} damage!`);
                  await new Promise(resolve => setTimeout(resolve, 600));
                }
              }
              
              if (currentDragonHealth <= 0) {
                setGameMessage('🎉 Dragon defeated!');
                break;
              }
            }
            
          }
          break;
          
        case 'action':
          if (block.id.includes('victory-celebration')) {
            if (currentDragonHealth <= 0) {
              setGameState('success');
              setGameMessage('🏆 LEGENDARY VICTORY! Dragon vanquished!');
            } else {
              setGameMessage(`Dragon still has ${currentDragonHealth} HP! Continue fighting!`);
              setGameState('error');
              setIsRunning(false);
              return;
            }
          }
          break;
          
        case 'condition':
          if (block.id.includes('check-victory')) {
            if (currentDragonHealth <= 0) {
              setGameMessage('✅ Victory condition met - Dragon defeated!');
            } else {
              setGameMessage(`❌ Dragon still alive with ${currentDragonHealth} HP!`);
            }
          }
          break;
          
        default:
          break;
      }
    }

    setExecutionStep(-1);
    setIsRunning(false);
    
    if (currentDragonHealth <= 0) {
      setGameState('success');
    } else {
      setGameState('error');
      setGameMessage(`Battle incomplete! Dragon health: ${currentDragonHealth}/100, Rounds: ${currentRound}/5`);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-900 via-orange-800 to-yellow-700 relative overflow-hidden">
      {/* Animated Fire Background */}
      <div className="fixed inset-0 z-0">
        {/* Volcanic mountains */}
        <div className="absolute bottom-0 left-0 w-full h-80 bg-gradient-to-t from-red-800 to-orange-700 opacity-60" 
             style={{clipPath: 'polygon(0 100%, 15% 40%, 35% 60%, 55% 20%, 75% 50%, 95% 30%, 100% 100%)'}} />
        
        {/* Lava flows */}
        <div className="absolute bottom-0 left-0 w-full h-20 bg-gradient-to-r from-red-600 via-orange-500 to-red-600 opacity-80">
          <div className="absolute inset-0 bg-gradient-to-t from-red-800 to-transparent animate-pulse"></div>
        </div>
        
        {/* Floating fire effects */}
        {fireEffects.map((effect) => (
          <div
            key={effect.id}
            className="absolute text-red-500 animate-ping"
            style={{
              left: `${effect.x}%`,
              top: `${effect.y}%`,
              fontSize: `${effect.size}px`,
              opacity: effect.opacity,
              animationDuration: '2s'
            }}
          >
            🔥
          </div>
        ))}
        
        {/* Smoke and embers */}
        <div className="absolute top-1/4 left-1/4 text-6xl opacity-20 animate-bounce">💨</div>
        <div className="absolute top-1/3 right-1/3 text-4xl opacity-30 animate-pulse">✨</div>
        <div className="absolute top-1/2 left-1/2 text-5xl opacity-25 animate-bounce" style={{animationDelay: '1s'}}>⭐</div>
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
              <span className="text-2xl">⛰️</span>
              <span className="text-white font-bold">Mountain Challenges - Level 9</span>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="bg-red-600/30 px-4 py-2 rounded-lg border border-red-500/50">
              <span className="text-white">Battle Round: {battleRound}/5</span>
            </div>
            <Link to="/dashboard" className="text-white hover:text-yellow-300 transition-colors">
              <Home className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </div>

      <div className="relative z-10 p-6 grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-80px)]">
        
        {/* Instructions Panel */}
        <div className="bg-black/20 backdrop-blur-sm rounded-3xl border border-red-500/30 p-6 overflow-y-auto">
          <h2 className="text-2xl font-bold text-white mb-4 flex items-center space-x-2">
            <span className="text-3xl">🐉</span>
            <span>Final Mission: Dragon Battle</span>
          </h2>
          
          <div className="space-y-4 text-white">
            <div className="bg-red-600/20 p-4 rounded-xl border border-red-500/30">
              <h3 className="font-bold mb-2 text-red-200">🎯 Ultimate Goal:</h3>
              <p className="text-sm">Defeat the ancient dragon using nested loops! Cast multiple spells across several battle rounds.</p>
            </div>
            
            <div className="bg-purple-600/20 p-4 rounded-xl border border-purple-500/30">
              <h3 className="font-bold mb-2 text-purple-200">🔄 Nested Loop Strategy:</h3>
              <div className="space-y-2 text-sm">
                <div><strong className="text-orange-300">Outer Loop:</strong> 5 Battle Rounds</div>
                <div><strong className="text-purple-300">Inner Loop:</strong> 3 Spells per Round</div>
                <div><strong className="text-yellow-300">Total:</strong> 15 spell casts maximum</div>
              </div>
            </div>
            
            <div className="bg-orange-600/20 p-4 rounded-xl border border-orange-500/30">
              <h3 className="font-bold mb-2 text-orange-200">⚔️ Combat Mechanics:</h3>
              <ul className="text-sm space-y-1">
                <li>🔥 <strong>Fire Bolt:</strong> 15 damage</li>
                <li>❄️ <strong>Ice Shard:</strong> 12 damage</li>
                <li>⚡ <strong>Lightning:</strong> 18 damage</li>
                <li>💚 <strong>Heal:</strong> +20 wizard HP</li>
                <li>🐉 <strong>Dragon:</strong> Counter-attacks each round</li>
              </ul>
            </div>
            
            <div className="bg-green-600/20 p-4 rounded-xl border border-green-500/30">
              <h3 className="font-bold mb-2 text-green-200">💡 Master Strategy:</h3>
              <ul className="text-sm space-y-1">
                <li>• Create damage tracking variables</li>
                <li>• Use outer loop for battle rounds</li>
                <li>• Use inner loop for spell casting</li>
                <li>• Mix attack and heal spells wisely</li>
                <li>• Track total damage dealt</li>
                <li>• Victory when dragon HP ≤ 0</li>
              </ul>
            </div>
          </div>

          {/* Block Toolbox */}
          <div className="mt-6">
            <h3 className="text-lg font-bold text-white mb-4">🧰 Legendary Code Blocks</h3>
            <div className="space-y-3 max-h-80 overflow-y-auto">
              {availableBlocks.map((block) => (
                <div
                  key={block.id}
                  draggable
                  onDragStart={(e) => handleDragStart(e, block)}
                  className={`p-3 bg-gradient-to-r ${block.color} text-white rounded-xl cursor-grab active:cursor-grabbing hover:scale-105 transition-transform shadow-lg border border-white/20`}
                >
                  <div className="font-bold text-sm">{block.text}</div>
                  <div className="text-xs opacity-80 mt-1">{block.description}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Epic Dragon Battle Arena */}
        <div className="bg-black/20 backdrop-blur-sm rounded-3xl border border-red-500/30 p-6 flex flex-col relative overflow-hidden">
          {/* Arena Title */}
          <h2 className="text-xl font-bold text-white mb-4 flex items-center space-x-2">
            <span className="text-2xl">🏟️</span>
            <span>Dragon's Lair Battle Arena</span>
          </h2>
          
          {/* Game Status Message */}
          {gameMessage && (
            <div className="mb-4 p-3 bg-red-600/20 rounded-lg border border-red-500/30 backdrop-blur-sm">
              <div className="text-white text-sm font-medium">{gameMessage}</div>
            </div>
          )}
          
          {/* Epic Battle Visualization */}
          <div className="flex-1 relative">
            {/* Dragon Side - Right */}
            <div className="absolute top-4 right-4 w-48 h-32">
              {/* Dragon */}
              <div className="relative">
                <div className="text-8xl filter drop-shadow-2xl animate-pulse" style={{animationDuration: '3s'}}>
                  🐉
                </div>
                {/* Dragon fire breath effect */}
                {dragonHealth > 50 && (
                  <div className="absolute -left-12 top-8 text-4xl animate-bounce opacity-70">
                    🔥
                  </div>
                )}
                {/* Dragon health bar */}
                <div className="absolute -bottom-8 left-0 right-0">
                  <div className="text-white text-xs mb-1">Dragon Health</div>
                  <div className="w-full bg-black/40 rounded-full h-3 border border-red-500/50">
                    <div 
                      className="bg-gradient-to-r from-red-600 to-red-400 h-3 rounded-full transition-all duration-500 shadow-lg"
                      style={{ width: `${dragonHealth}%` }}
                    >
                      <div className="w-full h-full bg-gradient-to-t from-red-800/50 to-transparent rounded-full"></div>
                    </div>
                  </div>
                  <div className="text-white text-xs mt-1 text-center">{dragonHealth}/100 HP</div>
                </div>
              </div>
            </div>

            {/* Wizard Side - Left */}
            <div className="absolute bottom-8 left-4 w-32 h-32">
              <div className="relative">
                <div className="text-6xl filter drop-shadow-xl animate-bounce" style={{animationDuration: '2s'}}>
                  🧙‍♂️
                </div>
                {/* Wizard shield effect */}
                {wizardShield > 70 && (
                  <div className="absolute inset-0 text-4xl animate-spin opacity-60" style={{animationDuration: '4s'}}>
                    ✨
                  </div>
                )}
                {/* Wizard health bar */}
                <div className="absolute -bottom-8 left-0 right-0">
                  <div className="text-white text-xs mb-1">Wizard Health</div>
                  <div className="w-full bg-black/40 rounded-full h-3 border border-blue-500/50">
                    <div 
                      className="bg-gradient-to-r from-blue-600 to-blue-400 h-3 rounded-full transition-all duration-500 shadow-lg"
                      style={{ width: `${wizardShield}%` }}
                    >
                      <div className="w-full h-full bg-gradient-to-t from-blue-800/50 to-transparent rounded-full"></div>
                    </div>
                  </div>
                  <div className="text-white text-xs mt-1 text-center">{wizardShield}/100 HP</div>
                </div>
              </div>
            </div>

            {/* Spell Effects Center Stage */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="relative w-64 h-40">
                {/* Battle ground */}
                <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-r from-red-800 via-orange-700 to-red-800 rounded-lg opacity-60">
                  <div className="absolute inset-0 bg-gradient-to-t from-red-900/80 to-transparent rounded-lg animate-pulse"></div>
                </div>
                
                {/* Active spell effects */}
                {spellsCast.slice(-3).map((spell, index) => (
                  <div
                    key={spell.id}
                    className={`absolute text-4xl animate-ping transition-all duration-1000`}
                    style={{
                      left: `${20 + index * 30}%`,
                      top: `${30 + index * 20}%`,
                      animationDuration: '1s',
                      animationIterationCount: '3'
                    }}
                  >
                    {spell.icon}
                  </div>
                ))}
                
                {/* Lightning effects */}
                {spellsCast.some(s => s.name.includes('Lightning')) && (
                  <div className="absolute inset-0 pointer-events-none">
                    <div className="absolute top-0 left-1/2 w-1 h-full bg-yellow-400 opacity-80 animate-pulse transform -translate-x-0.5"></div>
                    <div className="absolute top-1/3 left-1/3 w-0.5 h-2/3 bg-purple-400 opacity-60 animate-pulse transform rotate-12"></div>
                  </div>
                )}
                
                {/* Ice effects */}
                {spellsCast.some(s => s.name.includes('Ice')) && (
                  <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
                    <div className="text-3xl opacity-80 animate-pulse">❄️</div>
                    <div className="text-2xl opacity-60 animate-pulse" style={{animationDelay: '0.5s'}}>🧊</div>
                  </div>
                )}
                
                {/* Fire explosion effects */}
                {spellsCast.some(s => s.name.includes('Fire')) && (
                  <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                    <div className="text-5xl opacity-90 animate-bounce">💥</div>
                  </div>
                )}
              </div>
            </div>

            {/* Battle Statistics */}
            <div className="absolute top-4 left-4 bg-black/40 backdrop-blur-sm rounded-xl p-4 border border-yellow-500/30">
              <h4 className="text-yellow-300 font-bold text-sm mb-2">⚔️ Battle Stats</h4>
              <div className="space-y-1 text-xs text-white">
                <div>Round: {battleRound}/5</div>
                <div>Spells Cast: {spellsCast.length}</div>
                <div>Dragon HP: {dragonHealth}/100</div>
                <div>Wizard HP: {wizardShield}/100</div>
              </div>
            </div>

            {/* Recent Spells Display */}
            <div className="absolute bottom-4 right-4 bg-black/40 backdrop-blur-sm rounded-xl p-3 border border-purple-500/30 max-w-48">
              <h4 className="text-purple-300 font-bold text-sm mb-2">✨ Recent Spells</h4>
              <div className="space-y-1 max-h-20 overflow-y-auto">
                {spellsCast.slice(-4).map((spell, index) => (
                  <div key={spell.id} className="text-xs text-white flex items-center space-x-2">
                    <span>{spell.icon}</span>
                    <span>{spell.name}</span>
                    <span className={spell.damage > 0 ? "text-red-300" : "text-green-300"}>
                      {spell.damage > 0 ? `-${spell.damage}` : `+${Math.abs(spell.damage)}`}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Victory/Defeat Overlay */}
            {gameState === 'success' && (
              <div className="absolute inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center rounded-xl">
                <div className="text-center">
                  <div className="text-8xl mb-4 animate-bounce">🏆</div>
                  <div className="text-4xl font-bold text-yellow-300 mb-2">LEGENDARY VICTORY!</div>
                  <div className="text-xl text-white mb-4">Dragon Vanquished!</div>
                  <div className="flex justify-center space-x-1">
                    <Star className="w-8 h-8 text-yellow-400 fill-current animate-pulse" />
                    <Star className="w-8 h-8 text-yellow-400 fill-current animate-pulse" style={{animationDelay: '0.2s'}} />
                    <Star className="w-8 h-8 text-yellow-400 fill-current animate-pulse" style={{animationDelay: '0.4s'}} />
                  </div>
                </div>
              </div>
            )}

            {gameState === 'error' && (
              <div className="absolute inset-0 bg-red-900/70 backdrop-blur-sm flex items-center justify-center rounded-xl">
                <div className="text-center">
                  <div className="text-6xl mb-4">💀</div>
                  <div className="text-2xl font-bold text-red-300 mb-2">Battle Failed!</div>
                  <div className="text-white text-sm">{gameMessage}</div>
                </div>
              </div>
            )}
          </div>
          
          {/* Variables Display */}
          <div className="mt-4 bg-purple-600/20 p-4 rounded-xl border border-purple-500/30">
            <h3 className="text-purple-200 font-bold mb-2">📊 Loop Variables:</h3>
            <div className="text-white space-y-1 text-sm">
              {variables.damage !== undefined ? (
                <div className="font-mono bg-black/30 px-2 py-1 rounded">
                  damage = {variables.damage}
                </div>
              ) : (
                <div className="text-white/60">No damage variable</div>
              )}
              {variables.totalDamage !== undefined ? (
                <div className="font-mono bg-black/30 px-2 py-1 rounded">
                  totalDamage = {variables.totalDamage}
                </div>
              ) : (
                <div className="text-white/60">No total damage tracking</div>
              )}
            </div>
          </div>
        </div>

        {/* Code Area */}
        <div className="bg-black/20 backdrop-blur-sm rounded-3xl border border-red-500/30 p-6 flex flex-col">
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
              >
                <RotateCcw className="w-4 h-4" />
              </button>
              <button
                onClick={runCode}
                disabled={isRunning || codeBlocks.length === 0}
                className="px-4 py-2 bg-gradient-to-r from-red-600 to-orange-600 text-white rounded-lg hover:scale-105 transition-transform disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2 border border-red-500/50"
              >
                <Flame className="w-4 h-4" />
                <span>{isRunning ? 'Battling...' : 'Begin Battle'}</span>
              </button>
            </div>
          </div>
          
          {/* Drop Zone */}
          <div
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            className="flex-1 border-2 border-dashed border-red-500/30 rounded-xl p-4 min-h-32 overflow-y-auto bg-black/10"
          >
            {codeBlocks.length === 0 ? (
              <div className="flex items-center justify-center h-full text-white/60 text-center">
                <div>
                  <div className="text-4xl mb-2">🐉</div>
                  <div>Drag blocks to create your dragon battle strategy!</div>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                {codeBlocks.map((block, index) => (
                  <div
                    key={block.uniqueId}
                    className={`p-3 bg-gradient-to-r ${block.color} text-white rounded-xl relative group transition-all duration-300 border border-white/20 ${
                      executionStep === index ? 'ring-4 ring-yellow-400 ring-opacity-75 scale-105 shadow-2xl' : ''
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-bold text-sm">{block.text}</div>
                        <div className="text-xs opacity-80 font-mono">{block.code}</div>
                      </div>
                      <button
                        onClick={() => removeBlock(block.uniqueId)}
                        className="opacity-0 group-hover:opacity-100 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs transition-opacity hover:bg-red-600"
                      >
                        ×
                      </button>
                    </div>
                    <div className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-2 w-4 h-4 bg-white rounded-full text-xs flex items-center justify-center text-gray-800 font-bold">
                      {index + 1}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
          
          {/* Nested Loop Helper */}
          <div className="mt-4 bg-red-600/20 p-3 rounded-xl border border-red-500/30">
            <div className="text-red-200 text-xs mb-2">🔥 Nested Loop Pattern:</div>
            <div className="text-red-100 text-sm space-y-1">
              <div><strong>Outer:</strong> for (round = 0; round &lt; 5; round++)</div>
              <div className="ml-4"><strong>Inner:</strong> for (spell = 0; spell &lt; 3; spell++)</div>
              <div className="ml-8"><strong>Actions:</strong> Cast Spells, Attack Dragon</div>
              <div className="ml-4"><strong>End Inner:</strong> </div>
              <div><strong>End Outer:</strong> </div>
            </div>
          </div>
          
          {/* Code Preview */}
          <div className="mt-4 bg-black/50 p-3 rounded-xl border border-yellow-500/30">
            <div className="text-yellow-300 text-xs mb-2">Generated Battle Code:</div>
            <div className="text-green-300 font-mono text-sm max-h-32 overflow-y-auto">
              {codeBlocks.length === 0 ? (
                <span className="text-white/40">// Your epic dragon battle code will appear here</span>
              ) : (
                codeBlocks.map((block, index) => (
                  <div key={index} className={executionStep === index ? "text-yellow-300 font-bold" : ""}>
                    {block.code}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
      
      {/* Additional CSS for fire effects */}
      <style jsx>{`
        @keyframes dragonBreath {
          0%, 100% { transform: scale(1) rotate(0deg); }
          50% { transform: scale(1.2) rotate(5deg); }
        }
        
        @keyframes spellCast {
          0% { transform: scale(0) rotate(0deg); opacity: 0; }
          50% { transform: scale(1.2) rotate(180deg); opacity: 1; }
          100% { transform: scale(0) rotate(360deg); opacity: 0; }
        }
        
        @keyframes fireGlow {
          0%, 100% { box-shadow: 0 0 10px rgba(255, 100, 0, 0.5); }
          50% { box-shadow: 0 0 20px rgba(255, 200, 0, 0.8); }
        }
        
        .dragon-breath {
          animation: dragonBreath 2s ease-in-out infinite;
        }
        
        .spell-effect {
          animation: spellCast 1.5s ease-in-out;
        }
        
        .fire-glow {
          animation: fireGlow 2s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default LevelNineGame;