import React, { useState, useEffect } from 'react';
import { Sparkles, Play, RotateCcw, CheckCircle, Star, Home, ArrowLeft, Users, Heart, Coins, Wrench } from 'lucide-react';

const LevelSixGame = () => {
  const [draggedBlock, setDraggedBlock] = useState(null);
  const [codeBlocks, setCodeBlocks] = useState([]);
  const [gameState, setGameState] = useState('playing');
  const [isRunning, setIsRunning] = useState(false);
  const [wizardPosition, setWizardPosition] = useState(0);
  const [executionStep, setExecutionStep] = useState(-1);
  const [gameMessage, setGameMessage] = useState('');
  const [variables, setVariables] = useState({});
  const [helpedVillagers, setHelpedVillagers] = useState([]);
  const [currentVillager, setCurrentVillager] = useState(null);

  const villagers = [
    {
      id: 1,
      name: 'Elder Marcus',
      position: 2,
      icon: '👴',
      age: 'old',
      problem: 'health',
      solution: 'healing_potion',
      description: 'Feeling unwell, needs healing',
      helped: false
    },
    {
      id: 2,
      name: 'Merchant Anna',
      position: 4,
      icon: '👩‍💼',
      age: 'adult',
      problem: 'money',
      solution: 'gold_coins',
      description: 'Lost money, needs financial help',
      helped: false
    },
    {
      id: 3,
      name: 'Little Tom',
      position: 6,
      icon: '👦',
      age: 'child',
      problem: 'toy',
      solution: 'magic_toy',
      description: 'Toy is broken, needs a new one',
      helped: false
    }
  ];

  const solutions = {
    healing_potion: { name: 'Healing Potion', icon: '🧪' },
    gold_coins: { name: 'Gold Coins', icon: '💰' },
    magic_toy: { name: 'Magic Toy', icon: '🪀' }
  };

  const totalPositions = 8;

  const availableBlocks = [
    {
      id: 'move-to-villager',
      type: 'movement',
      text: 'Move to Next Villager',
      color: 'from-purple-500 to-purple-600',
      code: 'wizard.moveToVillager()',
      description: 'Moves to the next villager'
    },
    {
      id: 'check-villager',
      type: 'variable',
      text: 'Check Villager Info',
      color: 'from-blue-500 to-blue-600',
      code: 'let villager = getVillagerInfo()',
      description: 'Gets villager age and problem'
    },
    {
      id: 'if-old-age',
      type: 'condition',
      text: 'If Age is Old',
      color: 'from-gray-500 to-gray-600',
      code: 'if (villager.age === "old")',
      description: 'Checks if villager is elderly'
    },
    {
      id: 'if-adult-age',
      type: 'condition',
      text: 'If Age is Adult',
      color: 'from-indigo-500 to-indigo-600',
      code: 'if (villager.age === "adult")',
      description: 'Checks if villager is an adult'
    },
    {
      id: 'if-child-age',
      type: 'condition',
      text: 'If Age is Child',
      color: 'from-yellow-500 to-yellow-600',
      code: 'if (villager.age === "child")',
      description: 'Checks if villager is a child'
    },
    {
      id: 'if-health-problem',
      type: 'nested-condition',
      text: 'If Problem is Health',
      color: 'from-red-500 to-red-600',
      code: 'if (villager.problem === "health")',
      description: 'Nested: Checks for health issues'
    },
    {
      id: 'if-money-problem',
      type: 'nested-condition',
      text: 'If Problem is Money',
      color: 'from-green-500 to-green-600',
      code: 'if (villager.problem === "money")',
      description: 'Nested: Checks for money issues'
    },
    {
      id: 'if-toy-problem',
      type: 'nested-condition',
      text: 'If Problem is Toy',
      color: 'from-pink-500 to-pink-600',
      code: 'if (villager.problem === "toy")',
      description: 'Nested: Checks for toy issues'
    },
    {
      id: 'give-healing-potion',
      type: 'action',
      text: 'Give Healing Potion',
      color: 'from-emerald-500 to-emerald-600',
      code: 'wizard.give("healing_potion")',
      description: 'Gives healing potion to villager'
    },
    {
      id: 'give-gold-coins',
      type: 'action',
      text: 'Give Gold Coins',
      color: 'from-amber-500 to-amber-600',
      code: 'wizard.give("gold_coins")',
      description: 'Gives gold coins to villager'
    },
    {
      id: 'give-magic-toy',
      type: 'action',
      text: 'Give Magic Toy',
      color: 'from-cyan-500 to-cyan-600',
      code: 'wizard.give("magic_toy")',
      description: 'Gives magic toy to villager'
    },
    {
      id: 'else-condition',
      type: 'condition',
      text: 'Else',
      color: 'from-violet-500 to-violet-600',
      code: 'else',
      description: 'Default condition for other cases'
    },
    {
      id: 'celebrate',
      type: 'action',
      text: 'Mission Complete!',
      color: 'from-orange-500 to-orange-600',
      code: 'wizard.celebrate()',
      description: 'Victory celebration'
    }
  ];

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
    setHelpedVillagers([]);
    setCurrentVillager(null);
    setGameState('playing');
    setIsRunning(false);
    setExecutionStep(-1);
    setVariables({});
    setGameMessage('');
  };

  const runCode = async () => {
    if (codeBlocks.length === 0) return;
    
    setIsRunning(true);
    setGameState('playing');
    resetGame();
    
    let currentPosition = 0;
    let currentVariables = {};
    let helped = [];
    let villagerIndex = 0;
    let hasVillagerInfo = false;
    let ageConditionMet = false;
    let problemConditionMet = false;

    for (let i = 0; i < codeBlocks.length; i++) {
      setExecutionStep(i);
      
      const block = codeBlocks[i];
      await new Promise(resolve => setTimeout(resolve, 1200));

      switch (block.type) {
        case 'movement':
          if (block.id.includes('move-to-villager')) {
            if (villagerIndex < villagers.length) {
              const villager = villagers[villagerIndex];
              currentPosition = villager.position;
              setCurrentVillager(villager);
              setWizardPosition(currentPosition);
              setGameMessage(`Moved to ${villager.name} (${villager.age}, ${villager.problem} problem)`);
            } else {
              setGameMessage('All villagers visited!');
            }
          }
          break;
          
        case 'variable':
          if (block.id.includes('check-villager')) {
            if (villagerIndex < villagers.length) {
              const villager = villagers[villagerIndex];
              hasVillagerInfo = true;
              currentVariables.villager = {
                age: villager.age,
                problem: villager.problem,
                name: villager.name
              };
              setVariables({...currentVariables});
              setGameMessage(`Checked ${villager.name}: Age=${villager.age}, Problem=${villager.problem}`);
            } else {
              setGameMessage('No villager at current position!');
            }
          }
          break;
          
        case 'condition':
          if (!hasVillagerInfo) {
            setGameMessage('Error: Check villager info first!');
            setGameState('error');
            setIsRunning(false);
            return;
          }
          
          const currentVillagerData = villagers[villagerIndex];
          
          if (block.id.includes('if-old-age') && currentVillagerData?.age === 'old') {
            ageConditionMet = true;
            setGameMessage('✅ Age condition: Old person found!');
          } else if (block.id.includes('if-adult-age') && currentVillagerData?.age === 'adult') {
            ageConditionMet = true;
            setGameMessage('✅ Age condition: Adult found!');
          } else if (block.id.includes('if-child-age') && currentVillagerData?.age === 'child') {
            ageConditionMet = true;
            setGameMessage('✅ Age condition: Child found!');
          } else if (block.id.includes('else-condition')) {
            ageConditionMet = true;
            setGameMessage('✅ Else condition activated!');
          } else if (block.id.includes('if-')) {
            ageConditionMet = false;
            setGameMessage('❌ Age condition not met, skipping...');
          }
          break;
          
        case 'nested-condition':
          if (!ageConditionMet) {
            setGameMessage('Cannot check problem - age condition not met!');
            problemConditionMet = false;
            break;
          }
          
          const villagerForProblem = villagers[villagerIndex];
          
          if (block.id.includes('if-health-problem') && villagerForProblem?.problem === 'health') {
            problemConditionMet = true;
            setGameMessage('✅ Nested condition: Health problem found!');
          } else if (block.id.includes('if-money-problem') && villagerForProblem?.problem === 'money') {
            problemConditionMet = true;
            setGameMessage('✅ Nested condition: Money problem found!');
          } else if (block.id.includes('if-toy-problem') && villagerForProblem?.problem === 'toy') {
            problemConditionMet = true;
            setGameMessage('✅ Nested condition: Toy problem found!');
          } else {
            problemConditionMet = false;
            setGameMessage('❌ Problem condition not met!');
          }
          break;
          
        case 'action':
          if (block.id.includes('give-') && ageConditionMet && problemConditionMet) {
            const villagerToHelp = villagers[villagerIndex];
            let correctSolution = false;
            
            if (block.id.includes('healing-potion') && villagerToHelp?.solution === 'healing_potion') {
              correctSolution = true;
              setGameMessage(`✅ Gave healing potion to ${villagerToHelp.name}!`);
            } else if (block.id.includes('gold-coins') && villagerToHelp?.solution === 'gold_coins') {
              correctSolution = true;
              setGameMessage(`✅ Gave gold coins to ${villagerToHelp.name}!`);
            } else if (block.id.includes('magic-toy') && villagerToHelp?.solution === 'magic_toy') {
              correctSolution = true;
              setGameMessage(`✅ Gave magic toy to ${villagerToHelp.name}!`);
            } else {
              setGameMessage(`❌ Wrong solution for ${villagerToHelp?.name}!`);
              setGameState('error');
              setIsRunning(false);
              return;
            }
            
            if (correctSolution && !helped.includes(villagerIndex)) {
              helped.push(villagerIndex);
              setHelpedVillagers([...helped]);
              villagerIndex++;
              hasVillagerInfo = false;
              ageConditionMet = false;
              problemConditionMet = false;
              setCurrentVillager(null);
            }
          } else if (block.id.includes('give-')) {
            setGameMessage('Cannot give solution - conditions not met!');
          } else if (block.id.includes('celebrate')) {
            if (helped.length === villagers.length) {
              setGameState('success');
              setGameMessage('🎉 All villagers helped with perfect nested logic!');
            } else {
              setGameMessage(`Only ${helped.length}/${villagers.length} villagers helped!`);
              setGameState('error');
              setIsRunning(false);
              return;
            }
          }
          break;
          
        default:
          break;
      }
    }

    setExecutionStep(-1);
    setIsRunning(false);
    
    if (helped.length === villagers.length) {
      setGameState('success');
    } else {
      setGameState('error');
      setGameMessage(`Mission incomplete: ${helped.length}/${villagers.length} villagers helped`);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-900 via-teal-800 to-green-900 relative overflow-hidden">
      {/* Background Forest Village Elements */}
      <div className="fixed inset-0 z-0">
        {/* Village Ground */}
        <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-green-700 to-green-600 opacity-40" />
        
        {/* Village Buildings */}
        <div className="absolute bottom-16 left-16 w-12 h-16 bg-amber-600 rounded-t-lg opacity-70">
          <div className="w-8 h-8 bg-red-600 rounded-full mx-auto transform -translate-y-2" />
        </div>
        <div className="absolute bottom-16 right-16 w-10 h-14 bg-amber-700 rounded-t-lg opacity-70">
          <div className="w-6 h-6 bg-red-700 rounded-full mx-auto transform -translate-y-1" />
        </div>
        
        {/* Forest Elements */}
        <div className="absolute bottom-20 left-1/4 text-4xl opacity-50">🌳</div>
        <div className="absolute bottom-24 right-1/4 text-3xl opacity-50">🌲</div>
        <div className="absolute bottom-28 left-2/3 text-4xl opacity-50">🌳</div>
        
        {/* Village Atmosphere */}
        <div className="absolute top-32 left-20 text-2xl opacity-60 animate-pulse">🏺</div>
        <div className="absolute top-40 right-24 text-2xl opacity-60 animate-pulse" style={{ animationDelay: '1s' }}>🛠️</div>
        <div className="absolute top-24 left-1/2 text-2xl opacity-60 animate-pulse" style={{ animationDelay: '2s' }}>💝</div>
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
              <span className="text-white font-bold">Forest Decisions - Level 6</span>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="bg-white/20 px-4 py-2 rounded-lg">
              <span className="text-white">Helped: {helpedVillagers.length}/3</span>
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
            <span className="text-3xl">🏘️</span>
            <span>Mission: Villager Problems</span>
          </h2>
          
          <div className="space-y-4 text-white">
            <div className="bg-blue-500/20 p-4 rounded-xl border border-blue-400/30">
              <h3 className="font-bold mb-2">🎯 Goal:</h3>
              <p className="text-sm">Help all villagers by using nested If/Else logic to match the right solution to each villager's age and problem!</p>
            </div>
            
            <div className="bg-purple-500/20 p-4 rounded-xl border border-purple-400/30">
              <h3 className="font-bold mb-2">👥 Villagers & Problems:</h3>
              <div className="space-y-2 text-sm">
                <div className="flex items-center space-x-2">
                  <span>👴</span>
                  <span>Elder Marcus: Old + Health → Healing Potion 🧪</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span>👩‍💼</span>
                  <span>Merchant Anna: Adult + Money → Gold Coins 💰</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span>👦</span>
                  <span>Little Tom: Child + Toy → Magic Toy 🪀</span>
                </div>
              </div>
            </div>
            
            <div className="bg-green-500/20 p-4 rounded-xl border border-green-400/30">
              <h3 className="font-bold mb-2">🧠 Nested Logic Pattern:</h3>
              <ul className="text-sm space-y-1">
                <li>• Move to villager</li>
                <li>• Check villager info</li>
                <li>• If age condition (old/adult/child)</li>
                <li>• &nbsp;&nbsp;→ If problem condition (health/money/toy)</li>
                <li>• &nbsp;&nbsp;&nbsp;&nbsp;→ Give correct solution</li>
                <li>• Repeat for all villagers</li>
              </ul>
            </div>
          </div>

          {/* Block Toolbox */}
          <div className="mt-6">
            <h3 className="text-lg font-bold text-white mb-4">🧰 Code Blocks</h3>
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
            <span className="text-2xl">🏘️</span>
            <span>Forest Village</span>
          </h2>
          
          {/* Game Status Message */}
          {gameMessage && (
            <div className="mb-4 p-3 bg-teal-500/20 rounded-lg border border-teal-400/30">
              <div className="text-white text-sm">{gameMessage}</div>
            </div>
          )}
          
          {/* Game Path */}
          <div className="flex-1 flex flex-col justify-center">
            <div className="grid grid-cols-8 gap-1 mb-6">
              {[...Array(totalPositions)].map((_, index) => {
                const villager = villagers.find(v => v.position === index);
                return (
                  <div key={index} className="relative">
                    {/* Path Tile */}
                    <div className={`w-12 h-12 rounded-lg border-2 transition-all duration-500 ${
                      wizardPosition === index 
                        ? 'bg-yellow-300/30 border-yellow-400 shadow-lg' 
                        : villager 
                        ? helpedVillagers.includes(villagers.indexOf(villager))
                          ? 'bg-green-400/30 border-green-500/70'
                          : 'bg-blue-400/20 border-blue-500/50'
                        : 'bg-emerald-400/20 border-emerald-500/50'
                    }`}>
                      {/* Villager */}
                      {villager && (
                        <div className="absolute inset-0 flex items-center justify-center text-lg">
                          {helpedVillagers.includes(villagers.indexOf(villager)) ? (
                            <div className="relative">
                              <span className="opacity-70">{villager.icon}</span>
                              <div className="absolute -top-1 -right-1 text-green-400 text-lg">✅</div>
                            </div>
                          ) : currentVillager?.id === villager.id ? (
                            <div className="relative animate-pulse">
                              {villager.icon}
                              <div className="absolute -top-1 -right-1 text-blue-400 text-xs">❗</div>
                            </div>
                          ) : (
                            <div className="relative">
                              {villager.icon}
                              <div className="absolute -top-1 -right-1 text-red-400 text-xs">❓</div>
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
            <div className="bg-blue-500/20 p-4 rounded-xl border border-blue-400/30 mb-4">
              <h3 className="text-white font-bold mb-2">📊 Variables:</h3>
              <div className="text-white space-y-1 text-sm">
                {variables.villager ? (
                  <div className="font-mono bg-black/30 px-2 py-1 rounded">
                    villager = {JSON.stringify(variables.villager, null, 2)}
                  </div>
                ) : (
                  <div className="text-white/60">No villager data loaded</div>
                )}
              </div>
            </div>
            
            {/* Villager Status */}
            <div className="bg-green-500/20 p-4 rounded-xl border border-green-400/30 mb-4">
              <h3 className="text-white font-bold mb-2">👥 Villager Status:</h3>
              <div className="space-y-2">
                {villagers.map((villager, index) => (
                  <div key={villager.id} className="flex items-center justify-between text-sm">
                    <div className="flex items-center space-x-2">
                      <span>{villager.icon}</span>
                      <span className="text-white">{villager.name}</span>
                      <span className="text-blue-200">({villager.age}, {villager.problem})</span>
                    </div>
                    <div className="text-right">
                      {helpedVillagers.includes(index) ? (
                        <span className="text-green-300">✅ Helped</span>
                      ) : currentVillager?.id === villager.id ? (
                        <span className="text-yellow-300">🔍 Current</span>
                      ) : (
                        <span className="text-orange-300">⏳ Waiting</span>
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
                <div className="text-white font-bold">Master of Nested Logic!</div>
                <div className="text-green-200 text-sm">All villagers helped with perfect nested conditions!</div>
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
                <div className="text-white font-bold">Logic Error!</div>
                <div className="text-red-200 text-sm">{gameMessage}</div>
              </div>
            )}
          </div>
        </div>

        {/* Code Area */}
        <div className="bg-white/10 backdrop-blur-sm rounded-3xl border border-white/20 p-6 flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-white flex items-center space-x-2">
              <span className="text-2xl">🧩</span>
              <span>Nested Logic</span>
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
                className="px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-lg hover:scale-105 transition-transform disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
              >
                <Play className="w-4 h-4" />
                <span>{isRunning ? 'Helping...' : 'Help Villagers'}</span>
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
                  <div className="text-4xl mb-2">🏘️</div>
                  <div>Drag blocks to create nested logic!</div>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                {codeBlocks.map((block, index) => (
                  <div
                    key={block.uniqueId}
                    className={`p-3 bg-gradient-to-r ${block.color} text-white rounded-xl relative group transition-all duration-300 ${
                      executionStep === index ? 'ring-4 ring-yellow-400 ring-opacity-75 scale-105' : ''
                    } ${
                      block.type === 'nested-condition' ? 'ml-6 border-l-4 border-white/50' : ''
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
                    {block.type === 'nested-condition' && (
                      <div className="absolute -left-6 top-1/2 transform -translate-y-1/2 text-white/60 text-xs">
                        ↳
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
          
          {/* Nested Logic Helper */}
          <div className="mt-4 bg-purple-500/20 p-3 rounded-xl border border-purple-400/30">
            <div className="text-white/80 text-xs mb-2">🧠 Nested Logic Example:</div>
            <div className="text-purple-200 text-sm space-y-1 font-mono">
              <div>if (age === "old") {`{`}</div>
              <div className="ml-4">if (problem === "health") {`{`}</div>
              <div className="ml-8">give("healing_potion")</div>
              <div className="ml-4">{`}`}</div>
              <div>{`}`}</div>
            </div>
          </div>
          
          {/* Code Preview */}
          <div className="mt-4 bg-black/30 p-3 rounded-xl">
            <div className="text-white/60 text-xs mb-2">Generated Code:</div>
            <div className="text-green-300 font-mono text-sm max-h-32 overflow-y-auto">
              {codeBlocks.length === 0 ? (
                <span className="text-white/40">// Your nested logic will appear here</span>
              ) : (
                codeBlocks.map((block, index) => (
                  <div key={index} className={block.type === 'nested-condition' ? 'ml-4' : ''}>
                    {block.code}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LevelSixGame;