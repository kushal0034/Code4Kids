import React, { useState, useEffect } from 'react';
import { Sparkles, Play, RotateCcw, CheckCircle, Star, Home, ArrowLeft, Zap, Shield, Sword } from 'lucide-react';

const LevelFiveGame = () => {
  const [draggedBlock, setDraggedBlock] = useState(null);
  const [codeBlocks, setCodeBlocks] = useState([]);
  const [gameState, setGameState] = useState('playing'); // 'playing', 'success', 'error'
  const [isRunning, setIsRunning] = useState(false);
  const [wizardPosition, setWizardPosition] = useState(0);
  const [executionStep, setExecutionStep] = useState(-1);
  const [monsters, setMonsters] = useState([]);
  const [defeatedMonsters, setDefeatedMonsters] = useState([]);
  const [gameMessage, setGameMessage] = useState('');
  const [variables, setVariables] = useState({});
  const [currentMonster, setCurrentMonster] = useState(null);

  const monsterTypes = {
    goblin: { 
      icon: '👺', 
      name: 'Goblin', 
      weakness: 'fire', 
      spell: 'Fire Spell', 
      color: 'from-red-500 to-red-600',
      description: 'Weak to fire magic'
    },
    troll: { 
      icon: '👹', 
      name: 'Troll', 
      weakness: 'ice', 
      spell: 'Ice Spell', 
      color: 'from-blue-500 to-blue-600',
      description: 'Weak to ice magic'
    },
    orc: { 
      icon: '👿', 
      name: 'Orc', 
      weakness: 'lightning', 
      spell: 'Lightning Spell', 
      color: 'from-yellow-500 to-yellow-600',
      description: 'Weak to lightning magic'
    }
  };

  const spells = {
    fire: { icon: '🔥', name: 'Fire Spell', color: 'from-red-500 to-orange-500' },
    ice: { icon: '❄️', name: 'Ice Spell', color: 'from-blue-400 to-cyan-500' },
    lightning: { icon: '⚡', name: 'Lightning Spell', color: 'from-yellow-400 to-yellow-500' }
  };

  const totalPositions = 9;

  const availableBlocks = [
    {
      id: 'scan-monster',
      type: 'variable',
      text: 'Scan Monster',
      color: 'from-purple-500 to-purple-600',
      code: 'let monster = scanMonster()',
      description: 'Identifies the type of monster ahead'
    },
    {
      id: 'if-goblin',
      type: 'condition',
      text: 'If Monster is Goblin',
      color: 'from-red-500 to-red-600',
      code: 'if (monster === "goblin")',
      description: 'Checks if the monster is a goblin'
    },
    {
      id: 'if-troll',
      type: 'condition',
      text: 'If Monster is Troll',
      color: 'from-blue-500 to-blue-600',
      code: 'if (monster === "troll")',
      description: 'Checks if the monster is a troll'
    },
    {
      id: 'if-orc',
      type: 'condition',
      text: 'If Monster is Orc',
      color: 'from-green-500 to-green-600',
      code: 'if (monster === "orc")',
      description: 'Checks if the monster is an orc'
    },
    {
      id: 'else-if-goblin',
      type: 'condition',
      text: 'Else If Goblin',
      color: 'from-red-400 to-red-500',
      code: 'else if (monster === "goblin")',
      description: 'Alternative check for goblin'
    },
    {
      id: 'else-if-troll',
      type: 'condition',
      text: 'Else If Troll',
      color: 'from-blue-400 to-blue-500',
      code: 'else if (monster === "troll")',
      description: 'Alternative check for troll'
    },
    {
      id: 'else-if-orc',
      type: 'condition',
      text: 'Else If Orc',
      color: 'from-green-400 to-green-500',
      code: 'else if (monster === "orc")',
      description: 'Alternative check for orc'
    },
    {
      id: 'else-condition',
      type: 'condition',
      text: 'Else',
      color: 'from-gray-500 to-gray-600',
      code: 'else',
      description: 'Default action if no conditions match'
    },
    {
      id: 'cast-fire',
      type: 'action',
      text: 'Cast Fire Spell',
      color: 'from-red-600 to-orange-600',
      code: 'wizard.castSpell("fire")',
      description: 'Casts fire magic - effective against goblins'
    },
    {
      id: 'cast-ice',
      type: 'action',
      text: 'Cast Ice Spell',
      color: 'from-blue-600 to-cyan-600',
      code: 'wizard.castSpell("ice")',
      description: 'Casts ice magic - effective against trolls'
    },
    {
      id: 'cast-lightning',
      type: 'action',
      text: 'Cast Lightning Spell',
      color: 'from-yellow-600 to-yellow-500',
      code: 'wizard.castSpell("lightning")',
      description: 'Casts lightning magic - effective against orcs'
    },
    {
      id: 'move-forward',
      type: 'movement',
      text: 'Move Forward',
      color: 'from-purple-500 to-purple-600',
      code: 'wizard.move()',
      description: 'Moves wizard to next position'
    },
    {
      id: 'celebrate',
      type: 'action',
      text: 'Victory Celebration!',
      color: 'from-pink-500 to-pink-600',
      code: 'wizard.celebrate()',
      description: 'Celebrates defeating all monsters'
    }
  ];

  // Initialize monsters on component mount
  useEffect(() => {
    const monsterPositions = [2, 4, 6];
    const monsterTypeKeys = Object.keys(monsterTypes);
    const gameMonsters = monsterPositions.map((pos, index) => {
      const randomType = monsterTypeKeys[Math.floor(Math.random() * monsterTypeKeys.length)];
      return {
        id: index + 1,
        position: pos,
        type: randomType,
        defeated: false
      };
    });
    setMonsters(gameMonsters);
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
    setDefeatedMonsters([]);
    setGameState('playing');
    setIsRunning(false);
    setExecutionStep(-1);
    setVariables({});
    setGameMessage('');
    setCurrentMonster(null);
    // Reset monster defeated status
    setMonsters(prev => prev.map(monster => ({ ...monster, defeated: false })));
  };

  const runCode = async () => {
    if (codeBlocks.length === 0) return;
    
    setIsRunning(true);
    setGameState('playing');
    resetGame();
    
    let currentPosition = 0;
    let currentVariables = {};
    let defeated = [];
    let hasScanned = false;
    let conditionMet = false;
    let currentMonsterData = null;

    for (let i = 0; i < codeBlocks.length; i++) {
      setExecutionStep(i);
      
      const block = codeBlocks[i];
      await new Promise(resolve => setTimeout(resolve, 1400));

      switch (block.type) {
        case 'variable':
          if (block.id.includes('scan-monster')) {
            const monsterAtPosition = monsters.find(m => m.position === currentPosition);
            if (monsterAtPosition && !defeated.includes(monsterAtPosition.id)) {
              hasScanned = true;
              currentMonsterData = monsterAtPosition;
              currentVariables.monster = monsterAtPosition.type;
              setVariables({...currentVariables});
              setCurrentMonster(monsterAtPosition);
              setGameMessage(`Scanned: ${monsterTypes[monsterAtPosition.type].name} detected!`);
            } else if (monsterAtPosition && defeated.includes(monsterAtPosition.id)) {
              setGameMessage('No monster here - already defeated!');
              hasScanned = false;
            } else {
              setGameMessage('No monster at this position to scan!');
              hasScanned = false;
            }
          }
          break;
          
        case 'condition':
          if (!hasScanned) {
            setGameMessage('Error: Scan monster first!');
            setGameState('error');
            setIsRunning(false);
            return;
          }
          
          const monsterType = currentVariables.monster;
          if (block.id.includes('if-goblin') || block.id.includes('else-if-goblin')) {
            if (monsterType === 'goblin') {
              conditionMet = true;
              setGameMessage('✅ Goblin condition matched!');
            } else {
              conditionMet = false;
              setGameMessage('❌ Not a goblin, condition failed');
            }
          } else if (block.id.includes('if-troll') || block.id.includes('else-if-troll')) {
            if (monsterType === 'troll') {
              conditionMet = true;
              setGameMessage('✅ Troll condition matched!');
            } else {
              conditionMet = false;
              setGameMessage('❌ Not a troll, condition failed');
            }
          } else if (block.id.includes('if-orc') || block.id.includes('else-if-orc')) {
            if (monsterType === 'orc') {
              conditionMet = true;
              setGameMessage('✅ Orc condition matched!');
            } else {
              conditionMet = false;
              setGameMessage('❌ Not an orc, condition failed');
            }
          } else if (block.id.includes('else-condition')) {
            conditionMet = true;
            setGameMessage('✅ Else condition activated!');
          }
          break;
          
        case 'action':
          if (block.id.includes('cast-') && conditionMet && currentMonsterData) {
            let spellType = '';
            if (block.id.includes('fire')) spellType = 'fire';
            else if (block.id.includes('ice')) spellType = 'ice';
            else if (block.id.includes('lightning')) spellType = 'lightning';
            
            const correctSpell = monsterTypes[currentMonsterData.type].weakness;
            if (spellType === correctSpell) {
              defeated.push(currentMonsterData.id);
              setDefeatedMonsters([...defeated]);
              setGameMessage(`🎉 ${spells[spellType].name} defeated the ${monsterTypes[currentMonsterData.type].name}!`);
              hasScanned = false;
              currentMonsterData = null;
              setCurrentMonster(null);
            } else {
              setGameMessage(`❌ Wrong spell! ${monsterTypes[currentMonsterData.type].name} is not weak to ${spells[spellType].name}`);
              setGameState('error');
              setIsRunning(false);
              return;
            }
          } else if (block.id.includes('cast-') && !conditionMet) {
            setGameMessage('Cannot cast spell - condition not met!');
          } else if (block.id.includes('cast-') && !currentMonsterData) {
            setGameMessage('No monster to cast spell on!');
          } else if (block.id.includes('celebrate')) {
            if (defeated.length === 3) {
              setGameState('success');
              setGameMessage('🎉 All monsters defeated! Master of monster spells!');
            } else {
              setGameMessage(`Only ${defeated.length}/3 monsters defeated!`);
              setGameState('error');
              setIsRunning(false);
              return;
            }
          }
          break;
          
        case 'movement':
          if (currentPosition < totalPositions - 1) {
            currentPosition++;
            setWizardPosition(currentPosition);
            setGameMessage(`Moved to position ${currentPosition}`);
            hasScanned = false;
            currentMonsterData = null;
            setCurrentMonster(null);
          } else {
            setGameMessage('Cannot move further!');
          }
          break;
          
        default:
          break;
      }
    }

    setExecutionStep(-1);
    setIsRunning(false);
    
    if (defeated.length === 3) {
      setGameState('success');
    } else {
      setGameState('error');
      setGameMessage(`Mission incomplete: ${defeated.length}/3 monsters defeated`);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-indigo-800 to-blue-900 relative overflow-hidden">
      {/* Background Mystical Elements */}
      <div className="fixed inset-0 z-0">
        {/* Dark forest atmosphere */}
        <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-purple-800 to-purple-700 opacity-40" />
        
        {/* Mystical elements */}
        <div className="absolute top-20 left-20 text-3xl opacity-50 animate-pulse">🌙</div>
        <div className="absolute top-32 right-32 text-2xl opacity-40 animate-pulse" style={{ animationDelay: '1s' }}>✨</div>
        <div className="absolute bottom-40 left-1/4 text-3xl opacity-50 animate-pulse" style={{ animationDelay: '2s' }}>🔮</div>
        <div className="absolute top-40 left-1/2 text-2xl opacity-40 animate-pulse" style={{ animationDelay: '3s' }}>⭐</div>
        
        {/* Dark trees */}
        <div className="absolute bottom-20 left-10 text-5xl opacity-30">🌲</div>
        <div className="absolute bottom-16 right-20 text-4xl opacity-30">🌳</div>
        <div className="absolute bottom-24 left-2/3 text-4xl opacity-30">🌲</div>
      </div>

      {/* Header */}
      <div className="relative z-10 bg-black/20 backdrop-blur-sm border-b border-white/20 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link to="/worlds" className="flex items-center space-x-2 text-white hover:text-yellow-300 transition-colors">
              <ArrowLeft className="w-5 h-5" />
              <span>Back to Worlds</span>
            </Link>
            <div className="h-6 w-px bg-white/30" />
            <div className="flex items-center space-x-2">
              <span className="text-2xl">🌲</span>
              <span className="text-white font-bold">Forest Decisions - Level 5</span>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="bg-white/20 px-4 py-2 rounded-lg">
              <span className="text-white">Defeated: {defeatedMonsters.length}/3</span>
            </div>
            <Link to="/dashboard" className="text-white hover:text-yellow-300 transition-colors">
              <Home className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </div>

      <div className="relative z-10 p-6 grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-80px)]">
        
        {/* Instructions Panel */}
        <div className="bg-white/10 backdrop-blur-sm rounded-3xl border border-white/20 p-6 overflow-y-auto">
          <h2 className="text-2xl font-bold text-white mb-4 flex items-center space-x-2">
            <span className="text-3xl">⚔️</span>
            <span>Mission: Monster Spells</span>
          </h2>
          
          <div className="space-y-4 text-white">
            <div className="bg-purple-500/20 p-4 rounded-xl border border-purple-400/30">
              <h3 className="font-bold mb-2">🎯 Goal:</h3>
              <p className="text-sm">Defeat all 3 monsters using the correct spells! Each monster has a specific weakness.</p>
            </div>
            
            <div className="bg-red-500/20 p-4 rounded-xl border border-red-400/30">
              <h3 className="font-bold mb-2">👺 Monster Weaknesses:</h3>
              <div className="space-y-2 text-sm">
                <div className="flex items-center justify-between">
                  <span>👺 Goblin</span>
                  <span className="text-orange-300">🔥 Fire Spell</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>👹 Troll</span>
                  <span className="text-cyan-300">❄️ Ice Spell</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>👿 Orc</span>
                  <span className="text-yellow-300">⚡ Lightning Spell</span>
                </div>
              </div>
            </div>
            
            <div className="bg-blue-500/20 p-4 rounded-xl border border-blue-400/30">
              <h3 className="font-bold mb-2">🧙‍♂️ Strategy:</h3>
              <ul className="text-sm space-y-1">
                <li>• Scan monster to identify type</li>
                <li>• Use If/Else If conditions</li>
                <li>• Cast the correct spell</li>
                <li>• Move to next monster</li>
                <li>• Repeat for all 3 monsters</li>
              </ul>
            </div>
            
            <div className="bg-green-500/20 p-4 rounded-xl border border-green-400/30">
              <h3 className="font-bold mb-2">💡 Logic Pattern:</h3>
              <div className="text-sm space-y-1 font-mono">
                <div>if (monster === "goblin")</div>
                <div className="ml-4">cast fire spell</div>
                <div>else if (monster === "troll")</div>
                <div className="ml-4">cast ice spell</div>
                <div>else if (monster === "orc")</div>
                <div className="ml-4">cast lightning spell</div>
              </div>
            </div>
          </div>

          {/* Block Toolbox */}
          <div className="mt-6">
            <h3 className="text-lg font-bold text-white mb-4">🧰 Spell Blocks</h3>
            <div className="space-y-3 max-h-80 overflow-y-auto">
              {availableBlocks.map((block) => (
                <div
                  key={block.id}
                  draggable
                  onDragStart={(e) => handleDragStart(e, block)}
                  className={`p-3 bg-gradient-to-r ${block.color} text-white rounded-xl cursor-grab active:cursor-grabbing hover:scale-105 transition-transform shadow-lg`}
                >
                  <div className="font-bold text-sm">{block.text}</div>
                  <div className="text-xs opacity-80 mt-1">{block.description}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Game World */}
        <div className="bg-white/10 backdrop-blur-sm rounded-3xl border border-white/20 p-6 flex flex-col">
          <h2 className="text-xl font-bold text-white mb-4 flex items-center space-x-2">
            <span className="text-2xl">🌙</span>
            <span>Dark Forest Path</span>
          </h2>
          
          {/* Current Monster Info */}
          {currentMonster && (
            <div className="mb-4 p-4 bg-purple-500/20 rounded-xl border border-purple-400/30">
              <div className="text-center">
                <div className="text-4xl mb-2">{monsterTypes[currentMonster.type].icon}</div>
                <div className="text-white font-bold">Scanned: {monsterTypes[currentMonster.type].name}</div>
                <div className="text-blue-200 text-sm">Weakness: {monsterTypes[currentMonster.type].spell}</div>
              </div>
            </div>
          )}
          
          {/* Game Status Message */}
          {gameMessage && (
            <div className="mb-4 p-3 bg-indigo-500/20 rounded-lg border border-indigo-400/30">
              <div className="text-white text-sm">{gameMessage}</div>
            </div>
          )}
          
          {/* Game Path */}
          <div className="flex-1 flex flex-col justify-center">
            <div className="grid grid-cols-9 gap-1 mb-6">
              {[...Array(totalPositions)].map((_, index) => {
                const monster = monsters.find(m => m.position === index);
                const isDefeated = monster && defeatedMonsters.includes(monster.id);
                return (
                  <div key={index} className="relative">
                    {/* Path Tile */}
                    <div className={`w-10 h-10 rounded-lg border-2 transition-all duration-500 ${
                      wizardPosition === index 
                        ? 'bg-yellow-300/30 border-yellow-400 shadow-lg' 
                        : monster
                        ? isDefeated
                          ? 'bg-green-400/30 border-green-500/70'
                          : 'bg-red-400/30 border-red-500/70'
                        : 'bg-purple-400/20 border-purple-500/50'
                    }`}>
                      {/* Monster */}
                      {monster && (
                        <div className="absolute inset-0 flex items-center justify-center text-lg">
                          {isDefeated ? (
                            <div className="relative">
                              <span className="opacity-30">{monsterTypes[monster.type].icon}</span>
                              <div className="absolute -top-1 -right-1 text-green-400 text-xs">✅</div>
                            </div>
                          ) : (
                            <div className="relative animate-pulse">
                              {monsterTypes[monster.type].icon}
                              {currentMonster && currentMonster.id === monster.id && (
                                <div className="absolute -top-2 -right-2 text-purple-400 text-xs">🔍</div>
                              )}
                            </div>
                          )}
                        </div>
                      )}
                      
                      {/* Wizard */}
                      {wizardPosition === index && (
                        <div className="absolute inset-0 flex items-center justify-center text-lg z-10 animate-pulse">
                          🧙‍♂️
                        </div>
                      )}
                    </div>
                    
                    {/* Position Number */}
                    <div className="text-center text-white text-xs mt-1">{index}</div>
                  </div>
                );
              })}
            </div>
            
            {/* Variables Display */}
            <div className="bg-purple-500/20 p-4 rounded-xl border border-purple-400/30 mb-4">
              <h3 className="text-white font-bold mb-2">🔮 Scan Results:</h3>
              <div className="text-white space-y-1">
                {variables.monster ? (
                  <div className="font-mono bg-black/30 px-2 py-1 rounded text-sm">
                    monster = "{variables.monster}"
                  </div>
                ) : (
                  <div className="text-white/60 text-sm">No monster scanned</div>
                )}
              </div>
            </div>
            
            {/* Monster Status */}
            <div className="bg-red-500/20 p-4 rounded-xl border border-red-400/30 mb-4">
              <h3 className="text-white font-bold mb-2">👾 Monster Status:</h3>
              <div className="space-y-2">
                {monsters.map((monster, index) => (
                  <div key={monster.id} className="flex items-center justify-between text-sm">
                    <div className="flex items-center space-x-2">
                      <span>{monsterTypes[monster.type].icon}</span>
                      <span className="text-white">{monsterTypes[monster.type].name}</span>
                      <span className="text-gray-300">(Pos {monster.position})</span>
                    </div>
                    <div className="text-right">
                      {defeatedMonsters.includes(monster.id) ? (
                        <span className="text-green-300">✅ Defeated</span>
                      ) : (
                        <span className="text-red-300">⚔️ Alive</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Game Status */}
            {gameState === 'success' && (
              <div className="bg-green-500/20 p-4 rounded-xl border border-green-400/30 text-center">
                <div className="text-4xl mb-2">🎉</div>
                <div className="text-white font-bold">Master of Monster Spells!</div>
                <div className="text-green-200 text-sm">All monsters defeated with perfect spell combinations!</div>
                <div className="flex justify-center space-x-1 mt-2">
                  <Star className="w-6 h-6 text-yellow-400 fill-current" />
                  <Star className="w-6 h-6 text-yellow-400 fill-current" />
                  <Star className="w-6 h-6 text-yellow-400 fill-current" />
                </div>
              </div>
            )}
            
            {gameState === 'error' && (
              <div className="bg-red-500/20 p-4 rounded-xl border border-red-400/30 text-center">
                <div className="text-4xl mb-2">❌</div>
                <div className="text-white font-bold">Spell Failed!</div>
                <div className="text-red-200 text-sm">{gameMessage}</div>
              </div>
            )}
          </div>
        </div>

        {/* Code Area */}
        <div className="bg-white/10 backdrop-blur-sm rounded-3xl border border-white/20 p-6 flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-white flex items-center space-x-2">
              <span className="text-2xl">📜</span>
              <span>Spell Logic</span>
            </h2>
            <div className="flex space-x-2">
              <button
                onClick={clearCode}
                className="p-2 bg-red-500/20 text-red-300 rounded-lg hover:bg-red-500/30 transition-colors"
                title="Clear All"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
              <button
                onClick={runCode}
                disabled={isRunning || codeBlocks.length === 0}
                className="px-4 py-2 bg-gradient-to-r from-purple-500 to-indigo-500 text-white rounded-lg hover:scale-105 transition-transform disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
              >
                <Play className="w-4 h-4" />
                <span>{isRunning ? 'Casting...' : 'Cast Spells'}</span>
              </button>
            </div>
          </div>
          
          {/* Drop Zone */}
          <div
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            className="flex-1 border-2 border-dashed border-white/30 rounded-xl p-4 min-h-32 overflow-y-auto"
          >
            {codeBlocks.length === 0 ? (
              <div className="flex items-center justify-center h-full text-white/60 text-center">
                <div>
                  <div className="text-4xl mb-2">⚔️</div>
                  <div>Drag spell blocks to defeat monsters!</div>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                {codeBlocks.map((block, index) => (
                  <div
                    key={block.uniqueId}
                    className={`p-3 bg-gradient-to-r ${block.color} text-white rounded-xl relative group transition-all duration-300 ${
                      executionStep === index ? 'ring-4 ring-yellow-400 ring-opacity-75 scale-105' : ''
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-bold text-sm">{block.text}</div>
                        <div className="text-xs opacity-80 font-mono">{block.code}</div>
                      </div>
                      <button
                        onClick={() => removeBlock(block.uniqueId)}
                        className="opacity-0 group-hover:opacity-100 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs transition-opacity"
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
          
          {/* Code Preview */}
          <div className="mt-4 bg-black/30 p-3 rounded-xl">
            <div className="text-white/60 text-xs mb-2">Generated Code:</div>
            <div className="text-green-300 font-mono text-sm max-h-32 overflow-y-auto">
              {codeBlocks.length === 0 ? (
                <span className="text-white/40">// Your spell logic will appear here</span>
              ) : (
                codeBlocks.map((block, index) => (
                  <div key={index}>{block.code}</div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LevelFiveGame;