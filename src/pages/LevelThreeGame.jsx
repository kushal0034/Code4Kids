import React, { useState, useEffect } from 'react';
import { Sparkles, Play, RotateCcw, CheckCircle, Star, Home, ArrowLeft, Plus, Minus, X, DivideIcon } from 'lucide-react';

const LevelThreeGame = () => {
  const [draggedBlock, setDraggedBlock] = useState(null);
  const [codeBlocks, setCodeBlocks] = useState([]);
  const [gameState, setGameState] = useState('playing'); // 'playing', 'success', 'error'
  const [isRunning, setIsRunning] = useState(false);
  const [wizardPosition, setWizardPosition] = useState(0);
  const [executionStep, setExecutionStep] = useState(-1);
  const [variables, setVariables] = useState({});
  const [collectedIngredients, setCollectedIngredients] = useState([]);
  const [gameMessage, setGameMessage] = useState('');
  const [potionBrewed, setPotionBrewed] = useState(false);

  const ingredients = [
    { id: 1, name: 'Mushrooms', position: 1, icon: '🍄', value: 3, type: 'ingredient' },
    { id: 2, name: 'Crystals', position: 3, icon: '💎', value: 5, type: 'ingredient' },
    { id: 3, name: 'Herbs', position: 5, icon: '🌿', value: 2, type: 'ingredient' },
    { id: 4, name: 'Magic Water', position: 7, icon: '💧', value: 4, type: 'ingredient' }
  ];

  const cauldronPosition = 9;
  const totalPositions = 11;

  const availableBlocks = [
    {
      id: 'create-total',
      type: 'variable',
      text: 'Create Total Variable',
      color: 'from-blue-500 to-blue-600',
      code: 'let total = 0',
      description: 'Creates a variable to track total ingredient value'
    },
    {
      id: 'create-count',
      type: 'variable',
      text: 'Create Count Variable',
      color: 'from-indigo-500 to-indigo-600',
      code: 'let count = 0',
      description: 'Creates a variable to count ingredients collected'
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
      id: 'collect-mushroom',
      type: 'action',
      text: 'Collect Mushrooms',
      color: 'from-green-500 to-green-600',
      code: 'total = total + 3; count = count + 1',
      description: 'Collects mushrooms (value: 3)'
    },
    {
      id: 'collect-crystal',
      type: 'action',
      text: 'Collect Crystals',
      color: 'from-cyan-500 to-cyan-600',
      code: 'total = total + 5; count = count + 1',
      description: 'Collects crystals (value: 5)'
    },
    {
      id: 'collect-herbs',
      type: 'action',
      text: 'Collect Herbs',
      color: 'from-emerald-500 to-emerald-600',
      code: 'total = total + 2; count = count + 1',
      description: 'Collects herbs (value: 2)'
    },
    {
      id: 'collect-water',
      type: 'action',
      text: 'Collect Magic Water',
      color: 'from-blue-400 to-blue-500',
      code: 'total = total + 4; count = count + 1',
      description: 'Collects magic water (value: 4)'
    },
    {
      id: 'double-total',
      type: 'math',
      text: 'Double Total Value',
      color: 'from-orange-500 to-orange-600',
      code: 'total = total * 2',
      description: 'Multiplies total value by 2'
    },
    {
      id: 'subtract-preparation',
      type: 'math',
      text: 'Subtract Preparation Cost',
      color: 'from-red-500 to-red-600',
      code: 'total = total - 5',
      description: 'Subtracts 5 for preparation cost'
    },
    {
      id: 'divide-by-ingredients',
      type: 'math',
      text: 'Divide by Ingredient Count',
      color: 'from-pink-500 to-pink-600',
      code: 'total = total / count',
      description: 'Divides total by number of ingredients'
    },
    {
      id: 'check-potion-strength',
      type: 'condition',
      text: 'Check if Total = 7',
      color: 'from-amber-500 to-amber-600',
      code: 'if (total === 7)',
      description: 'Checks if potion strength equals 7'
    },
    {
      id: 'brew-potion',
      type: 'action',
      text: 'Brew Potion!',
      color: 'from-violet-500 to-violet-600',
      code: 'wizard.brewPotion()',
      description: 'Brews the magical potion'
    },
    {
      id: 'celebrate',
      type: 'action',
      text: 'Potion Complete!',
      color: 'from-pink-500 to-pink-600',
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
    setCollectedIngredients([]);
    setGameState('playing');
    setIsRunning(false);
    setExecutionStep(-1);
    setVariables({});
    setGameMessage('');
    setPotionBrewed(false);
  };

  const runCode = async () => {
    if (codeBlocks.length === 0) return;
    
    setIsRunning(true);
    setGameState('playing');
    resetGame();
    
    let currentPosition = 0;
    let currentVariables = {};
    let collected = [];
    let hasTotal = false;
    let hasCount = false;

    for (let i = 0; i < codeBlocks.length; i++) {
      setExecutionStep(i);
      
      const block = codeBlocks[i];
      await new Promise(resolve => setTimeout(resolve, 1200));

      switch (block.type) {
        case 'variable':
          if (block.id.includes('create-total')) {
            hasTotal = true;
            currentVariables.total = 0;
            setVariables({...currentVariables});
            setGameMessage('Total variable created!');
          } else if (block.id.includes('create-count')) {
            hasCount = true;
            currentVariables.count = 0;
            setVariables({...currentVariables});
            setGameMessage('Count variable created!');
          }
          break;
          
        case 'movement':
          if (currentPosition < totalPositions - 1) {
            currentPosition++;
            setWizardPosition(currentPosition);
            setGameMessage(`Moved to position ${currentPosition}`);
          } else {
            setGameMessage('Cannot move further!');
          }
          break;
          
        case 'action':
          if (block.id.includes('collect-')) {
            const ingredient = ingredients.find(ing => 
              currentPosition === ing.position && 
              block.id.includes(ing.name.toLowerCase().replace(' ', '-'))
            );
            
            if (ingredient && !collected.includes(ingredient.id)) {
              if (hasTotal && hasCount) {
                currentVariables.total += ingredient.value;
                currentVariables.count += 1;
                collected.push(ingredient.id);
                setCollectedIngredients([...collected]);
                setVariables({...currentVariables});
                setGameMessage(`✅ Collected ${ingredient.name}! (+${ingredient.value})`);
              } else {
                setGameMessage('Error: Create total and count variables first!');
                setGameState('error');
                setIsRunning(false);
                return;
              }
            } else if (!ingredient) {
              setGameMessage('No matching ingredient here!');
            } else {
              setGameMessage('Already collected this ingredient!');
            }
          } else if (block.id.includes('brew-potion')) {
            if (currentPosition === cauldronPosition && currentVariables.total === 7) {
              setPotionBrewed(true);
              setGameMessage('🧪 Potion brewed successfully!');
            } else if (currentPosition !== cauldronPosition) {
              setGameMessage('Must be at the cauldron to brew!');
              setGameState('error');
              setIsRunning(false);
              return;
            } else {
              setGameMessage(`Potion strength is ${currentVariables.total}, need exactly 7!`);
              setGameState('error');
              setIsRunning(false);
              return;
            }
          } else if (block.id.includes('celebrate')) {
            if (potionBrewed || (currentVariables.total === 7 && currentPosition === cauldronPosition)) {
              setGameState('success');
              setGameMessage('🎉 Master Alchemist!');
            } else {
              setGameMessage('Potion not ready yet!');
              setGameState('error');
              setIsRunning(false);
              return;
            }
          }
          break;
          
        case 'math':
          if (!hasTotal) {
            setGameMessage('Error: Create total variable first!');
            setGameState('error');
            setIsRunning(false);
            return;
          }
          
          if (block.id.includes('double-total')) {
            currentVariables.total *= 2;
            setVariables({...currentVariables});
            setGameMessage(`Doubled total! Now: ${currentVariables.total}`);
          } else if (block.id.includes('subtract-preparation')) {
            currentVariables.total -= 5;
            setVariables({...currentVariables});
            setGameMessage(`Subtracted preparation cost! Now: ${currentVariables.total}`);
          } else if (block.id.includes('divide-by-ingredients')) {
            if (currentVariables.count > 0) {
              currentVariables.total = Math.round(currentVariables.total / currentVariables.count);
              setVariables({...currentVariables});
              setGameMessage(`Divided by ingredient count! Now: ${currentVariables.total}`);
            } else {
              setGameMessage('Cannot divide by zero ingredients!');
              setGameState('error');
              setIsRunning(false);
              return;
            }
          }
          break;
          
        case 'condition':
          if (block.id.includes('check-potion-strength')) {
            if (currentVariables.total === 7) {
              setGameMessage('✅ Perfect potion strength!');
            } else {
              setGameMessage(`❌ Potion strength is ${currentVariables.total}, need 7!`);
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
    
    if (currentVariables.total === 7 && collected.length === 4) {
      setGameState('success');
    } else {
      setGameState('error');
      setGameMessage(`Potion incomplete. Strength: ${currentVariables.total}/7, Ingredients: ${collected.length}/4`);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-900 via-purple-800 to-indigo-900 relative overflow-hidden">
      {/* Background Magical Elements */}
      <div className="fixed inset-0 z-0">
        {/* Magical particles */}
        {[...Array(15)].map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 bg-purple-300 rounded-full opacity-60 animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${2 + Math.random() * 2}s`
            }}
          />
        ))}
        
        {/* Floating magical symbols */}
        <div className="absolute top-20 left-20 text-3xl opacity-30 animate-bounce">✨</div>
        <div className="absolute top-40 right-32 text-2xl opacity-40 animate-bounce" style={{ animationDelay: '1s' }}>🔮</div>
        <div className="absolute bottom-40 left-1/4 text-3xl opacity-30 animate-bounce" style={{ animationDelay: '2s' }}>⚗️</div>
        
        {/* Magic laboratory ground */}
        <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-purple-700 to-purple-600 rounded-t-full transform -translate-y-8" />
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
              <span className="text-2xl">🏘️</span>
              <span className="text-white font-bold">Village Basics - Level 3</span>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="bg-white/20 px-4 py-2 rounded-lg">
              <span className="text-white">Ingredients: {collectedIngredients.length}/4</span>
            </div>
            <Link to="/student-dashboard" className="text-white hover:text-yellow-300 transition-colors">
              <Home className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </div>

      <div className="relative z-10 p-6 grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-80px)]">
        
        {/* Instructions Panel */}
        <div className="bg-white/10 backdrop-blur-sm rounded-3xl border border-white/20 p-6 overflow-y-auto">
          <h2 className="text-2xl font-bold text-white mb-4 flex items-center space-x-2">
            <span className="text-3xl">⚗️</span>
            <span>Mission: Potion Brewing</span>
          </h2>
          
          <div className="space-y-4 text-white">
            <div className="bg-blue-500/20 p-4 rounded-xl border border-blue-400/30">
              <h3 className="font-bold mb-2">🎯 Goal:</h3>
              <p className="text-sm">Create a potion with exactly strength 7 using math operations!</p>
            </div>
            
            <div className="bg-purple-500/20 p-4 rounded-xl border border-purple-400/30">
              <h3 className="font-bold mb-2">🧪 Ingredients:</h3>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span>🍄 Mushrooms (Pos 1)</span>
                  <span className="text-green-300">+3</span>
                </div>
                <div className="flex justify-between">
                  <span>💎 Crystals (Pos 3)</span>
                  <span className="text-cyan-300">+5</span>
                </div>
                <div className="flex justify-between">
                  <span>🌿 Herbs (Pos 5)</span>
                  <span className="text-emerald-300">+2</span>
                </div>
                <div className="flex justify-between">
                  <span>💧 Magic Water (Pos 7)</span>
                  <span className="text-blue-300">+4</span>
                </div>
              </div>
            </div>
            
            <div className="bg-orange-500/20 p-4 rounded-xl border border-orange-400/30">
              <h3 className="font-bold mb-2">🧮 Math Operations:</h3>
              <div className="space-y-1 text-sm">
                <div className="flex items-center space-x-2">
                  <X className="w-3 h-3" />
                  <span>Double (×2)</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Minus className="w-3 h-3" />
                  <span>Subtract 5 (preparation cost)</span>
                </div>
                <div className="flex items-center space-x-2">
                  <DivideIcon className="w-3 h-3" />
                  <span>Divide by ingredient count</span>
                </div>
              </div>
            </div>
            
            <div className="bg-green-500/20 p-4 rounded-xl border border-green-400/30">
              <h3 className="font-bold mb-2">💡 Recipe Hint:</h3>
              <p className="text-sm">
                All ingredients (3+5+2+4=14) → Double (×2=28) → Subtract 5 (=23) → Divide by 4 ingredients (≈6) 
                Need to adjust for exactly 7!
              </p>
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
            <span className="text-2xl">🧙‍♂️</span>
            <span>Magical Laboratory</span>
          </h2>
          
          {/* Game Status Message */}
          {gameMessage && (
            <div className="mb-4 p-3 bg-purple-500/20 rounded-lg border border-purple-400/30">
              <div className="text-white text-sm">{gameMessage}</div>
            </div>
          )}
          
          {/* Game Path */}
          <div className="flex-1 flex flex-col justify-center">
            <div className="grid grid-cols-11 gap-1 mb-6">
              {[...Array(totalPositions)].map((_, index) => {
                const ingredient = ingredients.find(ing => ing.position === index);
                const isCauldron = index === cauldronPosition;
                return (
                  <div key={index} className="relative">
                    {/* Path Tile */}
                    <div className={`w-12 h-12 rounded-lg border-2 transition-all duration-500 ${
                      wizardPosition === index 
                        ? 'bg-yellow-300/30 border-yellow-400 shadow-lg' 
                        : isCauldron
                        ? 'bg-purple-400/30 border-purple-500/70'
                        : ingredient 
                        ? 'bg-green-400/20 border-green-500/50'
                        : 'bg-violet-400/20 border-violet-500/50'
                    }`}>
                      {/* Ingredient */}
                      {ingredient && (
                        <div className="absolute inset-0 flex items-center justify-center text-lg">
                          {collectedIngredients.includes(ingredient.id) ? (
                            <div className="relative">
                              <span className="opacity-30">{ingredient.icon}</span>
                              <div className="absolute -top-1 -right-1 text-green-400 text-xs">✅</div>
                            </div>
                          ) : (
                            <div className="relative animate-bounce">
                              {ingredient.icon}
                              <div className="absolute -bottom-1 -right-1 bg-blue-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                                {ingredient.value}
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                      
                      {/* Cauldron */}
                      {isCauldron && (
                        <div className="absolute inset-0 flex items-center justify-center text-lg">
                          {potionBrewed ? (
                            <div className="relative">
                              <span className="animate-pulse">🧪</span>
                              <div className="absolute -top-1 -right-1 text-green-400">✨</div>
                            </div>
                          ) : (
                            <span className="animate-pulse">🔥</span>
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
                {variables.total !== undefined ? (
                  <div className="font-mono bg-black/30 px-2 py-1 rounded">
                    total = {variables.total}
                  </div>
                ) : (
                  <div className="text-white/60">No total variable</div>
                )}
                {variables.count !== undefined ? (
                  <div className="font-mono bg-black/30 px-2 py-1 rounded">
                    count = {variables.count}
                  </div>
                ) : (
                  <div className="text-white/60">No count variable</div>
                )}
              </div>
            </div>
            
            {/* Ingredient Collection Status */}
            <div className="bg-green-500/20 p-4 rounded-xl border border-green-400/30 mb-4">
              <h3 className="text-white font-bold mb-2">🧪 Ingredient Status:</h3>
              <div className="grid grid-cols-2 gap-2 text-sm">
                {ingredients.map((ingredient) => (
                  <div key={ingredient.id} className="flex items-center justify-between">
                    <div className="flex items-center space-x-1">
                      <span>{ingredient.icon}</span>
                      <span className="text-white">{ingredient.name}</span>
                    </div>
                    <div className="text-right">
                      {collectedIngredients.includes(ingredient.id) ? (
                        <span className="text-green-300">✅ +{ingredient.value}</span>
                      ) : (
                        <span className="text-orange-300">⏳ +{ingredient.value}</span>
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
                <div className="text-white font-bold">Master Alchemist!</div>
                <div className="text-green-200 text-sm">Perfect potion brewed with strength 7!</div>
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
                <div className="text-white font-bold">Potion Failed!</div>
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
              <span>Potion Recipe</span>
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
                <span>{isRunning ? 'Brewing...' : 'Brew Potion'}</span>
              </button>
            </div>
          </div>
          
          {/* Drop Zone */}
          <div
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            className="flex-1 border-2 border-dashed border-white/30 rounded-xl p-4 min-h-32 max-h-96 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-white/30 scrollbar-track-white/10"
          >
            {codeBlocks.length === 0 ? (
              <div className="flex items-center justify-center h-full text-white/60 text-center">
                <div>
                  <div className="text-4xl mb-2">⚗️</div>
                  <div>Drag blocks to create your potion recipe!</div>
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
          
          {/* Math Calculation Helper */}
          <div className="mt-4 bg-purple-500/20 p-3 rounded-xl border border-purple-400/30">
            <div className="text-white/80 text-xs mb-2">🧮 Quick Calculator:</div>
            <div className="text-purple-200 text-sm space-y-1">
              <div>All ingredients: 3 + 5 + 2 + 4 = 14</div>
              <div>Doubled: 14 × 2 = 28</div>
              <div>After prep cost: 28 - 5 = 23</div>
              <div>Divided by 4: 23 ÷ 4 = 5.75 ≈ 6</div>
              <div className="text-yellow-300 font-bold">Target: 7 (experiment with different combinations!)</div>
            </div>
          </div>
          
          {/* Code Preview */}
          <div className="mt-4 bg-black/30 p-3 rounded-xl">
            <div className="text-white/60 text-xs mb-2">Generated Code:</div>
            <div className="text-green-300 font-mono text-sm max-h-32 overflow-y-auto">
              {codeBlocks.length === 0 ? (
                <span className="text-white/40">// Your potion recipe will appear here</span>
              ) : (
                codeBlocks.map((block, index) => (
                  <div key={index}>{block.code}</div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
      
      <style jsx>{`
        @keyframes brew {
          0%, 100% { transform: scale(1) rotate(0deg); }
          50% { transform: scale(1.1) rotate(2deg); }
        }
        
        .brewing {
          animation: brew 2s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default LevelThreeGame;