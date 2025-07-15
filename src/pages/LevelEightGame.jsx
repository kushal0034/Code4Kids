import React, { useState, useEffect } from 'react';
import { Sparkles, Play, RotateCcw, CheckCircle, Star, Home, ArrowLeft, Zap } from 'lucide-react';

const LevelEightGame = () => {
  const [draggedBlock, setDraggedBlock] = useState(null);
  const [codeBlocks, setCodeBlocks] = useState([]);
  const [gameState, setGameState] = useState('playing'); // 'playing', 'success', 'error'
  const [isRunning, setIsRunning] = useState(false);
  const [wizardPosition, setWizardPosition] = useState(0);
  const [executionStep, setExecutionStep] = useState(-1);
  const [variables, setVariables] = useState({});
  const [gameMessage, setGameMessage] = useState('');
  const [rocks, setRocks] = useState([]);
  const [clearedRocks, setClearedRocks] = useState([]);
  const [pathRevealed, setPathRevealed] = useState([0]); // Start position revealed
  const [currentAction, setCurrentAction] = useState('');
  const [loopIterations, setLoopIterations] = useState(0);

  // Initialize rocks on mount
  useEffect(() => {
    const initialRocks = [
      { id: 1, position: 3, size: 'small', health: 1, type: 'pebble', originalHealth: 1 },
      { id: 2, position: 5, size: 'medium', health: 2, type: 'stone', originalHealth: 2 },
      { id: 3, position: 7, size: 'large', health: 3, type: 'boulder', originalHealth: 3 },
      { id: 4, position: 9, size: 'medium', health: 2, type: 'stone', originalHealth: 2 },
      { id: 5, position: 11, size: 'small', health: 1, type: 'pebble', originalHealth: 1 },
      { id: 6, position: 13, size: 'large', health: 3, type: 'boulder', originalHealth: 3 },
      { id: 7, position: 15, size: 'medium', health: 2, type: 'stone', originalHealth: 2 }
    ];
    setRocks(initialRocks);
  }, []);

  const totalPositions = 18;
  const pathStart = 0;
  const pathEnd = 17;

  const availableBlocks = [
    {
      id: 'create-rocks-variable',
      type: 'variable',
      text: 'Check Rocks Ahead',
      color: 'from-blue-500 to-blue-600',
      code: 'let rocksAhead = checkPath()',
      description: 'Scans for rocks blocking the path',
      icon: '🔍'
    },
    {
      id: 'while-rocks-exist',
      type: 'loop',
      text: 'While (rocks exist)',
      color: 'from-purple-500 to-purple-600',
      code: 'while (rocksAhead > 0)',
      description: 'Continues while rocks block the path',
      icon: '🔄'
    },
    {
      id: 'move-forward',
      type: 'action',
      text: 'Move Forward',
      color: 'from-green-500 to-green-600',
      code: 'wizard.moveForward()',
      description: 'Moves wizard to next position',
      icon: '➡️'
    },
    {
      id: 'check-current-position',
      type: 'condition',
      text: 'If Rock at Position',
      color: 'from-orange-500 to-orange-600',
      code: 'if (rockAtPosition)',
      description: 'Checks if there is a rock at current position',
      icon: '❓'
    },
    {
      id: 'clear-small-rock',
      type: 'action',
      text: 'Clear Small Rock',
      color: 'from-cyan-500 to-cyan-600',
      code: 'wizard.clearRock("small")',
      description: 'Removes small pebbles (1 hit)',
      icon: '🔨'
    },
    {
      id: 'clear-medium-rock',
      type: 'action',
      text: 'Clear Medium Rock',
      color: 'from-teal-500 to-teal-600',
      code: 'wizard.clearRock("medium")',
      description: 'Removes medium stones (2 hits)',
      icon: '⚒️'
    },
    {
      id: 'clear-large-rock',
      type: 'action',
      text: 'Clear Large Rock',
      color: 'from-emerald-500 to-emerald-600',
      code: 'wizard.clearRock("large")',
      description: 'Removes large boulders (3 hits)',
      icon: '🔧'
    },
    {
      id: 'use-magic-blast',
      type: 'action',
      text: 'Magic Rock Blast',
      color: 'from-yellow-500 to-yellow-600',
      code: 'wizard.magicBlast()',
      description: 'Destroys any rock instantly',
      icon: '⚡'
    },
    {
      id: 'update-rocks-count',
      type: 'action',
      text: 'Update Rocks Count',
      color: 'from-indigo-500 to-indigo-600',
      code: 'rocksAhead = checkPath()',
      description: 'Rechecks remaining rocks',
      icon: '🔄'
    },
    {
      id: 'celebrate',
      type: 'action',
      text: 'Path Cleared!',
      color: 'from-pink-500 to-pink-600',
      code: 'wizard.celebrate()',
      description: 'Victory celebration',
      icon: '🎉'
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
    setClearedRocks([]);
    setPathRevealed([0]);
    setGameState('playing');
    setIsRunning(false);
    setExecutionStep(-1);
    setVariables({});
    setGameMessage('Ready to clear the mountain path!');
    setCurrentAction('');
    setLoopIterations(0);
    
    // Reset rocks to initial state
    const initialRocks = [
      { id: 1, position: 3, size: 'small', health: 1, type: 'pebble', originalHealth: 1 },
      { id: 2, position: 5, size: 'medium', health: 2, type: 'stone', originalHealth: 2 },
      { id: 3, position: 7, size: 'large', health: 3, type: 'boulder', originalHealth: 3 },
      { id: 4, position: 9, size: 'medium', health: 2, type: 'stone', originalHealth: 2 },
      { id: 5, position: 11, size: 'small', health: 1, type: 'pebble', originalHealth: 1 },
      { id: 6, position: 13, size: 'large', health: 3, type: 'boulder', originalHealth: 3 },
      { id: 7, position: 15, size: 'medium', health: 2, type: 'stone', originalHealth: 2 }
    ];
    setRocks(initialRocks);
  };

  const runCode = async () => {
    if (codeBlocks.length === 0) {
      setGameMessage('Please add some code blocks first!');
      return;
    }
    
    setIsRunning(true);
    setGameState('playing');
    resetGame();
    
    let currentPosition = 0;
    let currentVariables = {};
    let currentRocks = [...rocks];
    let cleared = [];
    let revealed = [0];
    let hasRocksVariable = false;
    let rocksRemaining = currentRocks.length;
    let iterations = 0;

    for (let i = 0; i < codeBlocks.length; i++) {
      setExecutionStep(i);
      setCurrentAction(codeBlocks[i].text);
      
      const block = codeBlocks[i];
      await new Promise(resolve => setTimeout(resolve, 1200));

      switch (block.type) {
        case 'variable':
          if (block.id.includes('create-rocks-variable')) {
            hasRocksVariable = true;
            rocksRemaining = currentRocks.filter(rock => !cleared.includes(rock.id)).length;
            currentVariables.rocksAhead = rocksRemaining;
            setVariables({...currentVariables});
            setGameMessage(`🔍 Scanning path... Found ${rocksRemaining} rocks blocking the way!`);
          }
          break;
          
        case 'loop':
          if (block.id.includes('while-rocks-exist')) {
            setGameMessage('🔄 Starting While Loop - clearing rocks until path is clear...');
            
            let maxIterations = 25; // Safety limit
            iterations = 0;
            
            while (rocksRemaining > 0 && iterations < maxIterations) {
              iterations++;
              setLoopIterations(iterations);
              setGameMessage(`🔄 Loop iteration ${iterations} - ${rocksRemaining} rocks remaining`);
              
              // Execute actions inside the loop
              for (let j = i + 1; j < codeBlocks.length; j++) {
                const loopBlock = codeBlocks[j];
                if (loopBlock.type === 'loop' || loopBlock.id.includes('celebrate')) {
                  break;
                }
                
                setCurrentAction(loopBlock.text);
                await new Promise(resolve => setTimeout(resolve, 800));
                
                if (loopBlock.type === 'action') {
                  if (loopBlock.id.includes('move-forward')) {
                    if (currentPosition < totalPositions - 1) {
                      currentPosition++;
                      setWizardPosition(currentPosition);
                      
                      if (!revealed.includes(currentPosition)) {
                        revealed.push(currentPosition);
                        setPathRevealed([...revealed]);
                      }
                      
                      setGameMessage(`🚶‍♂️ Moving to position ${currentPosition}`);
                    } else {
                      setGameMessage('🚫 Already at the end of the path!');
                    }
                  } else if (loopBlock.id.includes('clear-') || loopBlock.id.includes('magic-blast')) {
                    const rockAtPosition = currentRocks.find(rock => 
                      rock.position === currentPosition && !cleared.includes(rock.id)
                    );
                    
                    if (rockAtPosition) {
                      let canClear = false;
                      let clearMessage = '';
                      
                      if (loopBlock.id.includes('clear-small-rock') && rockAtPosition.size === 'small') {
                        canClear = true;
                        clearMessage = `🔨 Clearing small ${rockAtPosition.type}...`;
                      } else if (loopBlock.id.includes('clear-medium-rock') && rockAtPosition.size === 'medium') {
                        canClear = true;
                        clearMessage = `⚒️ Clearing medium ${rockAtPosition.type}...`;
                      } else if (loopBlock.id.includes('clear-large-rock') && rockAtPosition.size === 'large') {
                        canClear = true;
                        clearMessage = `🔧 Clearing large ${rockAtPosition.type}...`;
                      } else if (loopBlock.id.includes('magic-blast')) {
                        canClear = true;
                        clearMessage = `⚡ Magic blast destroying ${rockAtPosition.type}!`;
                      }
                      
                      if (canClear) {
                        cleared.push(rockAtPosition.id);
                        setClearedRocks([...cleared]);
                        rocksRemaining = currentRocks.filter(rock => !cleared.includes(rock.id)).length;
                        
                        if (hasRocksVariable) {
                          currentVariables.rocksAhead = rocksRemaining;
                          setVariables({...currentVariables});
                        }
                        
                        setGameMessage(`${clearMessage} ✅ Cleared! ${rocksRemaining} rocks remaining.`);
                      } else {
                        setGameMessage(`❌ Wrong tool for ${rockAtPosition.size} ${rockAtPosition.type}!`);
                      }
                    } else {
                      setGameMessage('ℹ️ No rock at current position to clear.');
                    }
                  } else if (loopBlock.id.includes('update-rocks-count')) {
                    rocksRemaining = currentRocks.filter(rock => !cleared.includes(rock.id)).length;
                    if (hasRocksVariable) {
                      currentVariables.rocksAhead = rocksRemaining;
                      setVariables({...currentVariables});
                    }
                    setGameMessage(`🔄 Updated count: ${rocksRemaining} rocks remaining`);
                  }
                }
              }
              
              if (rocksRemaining === 0) {
                setGameMessage('✅ While Loop completed - all rocks cleared!');
                break;
              }
            }
            
            if (iterations >= maxIterations) {
              setGameMessage('⚠️ Loop safety limit reached - check your logic!');
              setGameState('error');
              setIsRunning(false);
              setCurrentAction('');
              return;
            }
          }
          break;
          
        case 'action':
          if (block.id.includes('celebrate')) {
            if (rocksRemaining === 0 && currentPosition >= pathEnd) {
              setGameState('success');
              setGameMessage('🎉 Path completely cleared and reached the end!');
            } else if (rocksRemaining > 0) {
              setGameMessage(`❌ Path not fully cleared! ${rocksRemaining} rocks still remaining.`);
              setGameState('error');
            } else if (currentPosition < pathEnd) {
              setGameMessage(`❌ Haven't reached the end! Position: ${currentPosition}/${pathEnd}`);
              setGameState('error');
            }
          }
          break;
      }
    }

    setExecutionStep(-1);
    setIsRunning(false);
    setCurrentAction('');
    
    if (rocksRemaining === 0 && currentPosition >= pathEnd) {
      setGameState('success');
    } else if (gameState !== 'error') {
      setGameState('error');
      setGameMessage(`❌ Mission incomplete! Rocks: ${rocksRemaining}, Position: ${currentPosition}/${pathEnd}`);
    }
  };

  const getRockIcon = (rock) => {
    if (rock.size === 'small') return '🪨';
    if (rock.size === 'medium') return '🗿';
    return '🏔️';
  };

  const getRockSize = (rock) => {
    if (rock.size === 'small') return 'text-2xl';
    if (rock.size === 'medium') return 'text-3xl';
    return 'text-4xl';
  };

  const getPositionColor = (index) => {
    const rock = rocks.find(r => r.position === index);
    const isCleared = rock && clearedRocks.includes(rock.id);
    const isRevealed = pathRevealed.includes(index);
    const wizardHere = wizardPosition === index;
    
    if (wizardHere) return 'bg-yellow-400/40 border-yellow-400';
    if (isCleared) return 'bg-green-400/30 border-green-400';
    if (rock && !isCleared) return 'bg-red-400/30 border-red-400';
    if (isRevealed) return 'bg-blue-400/20 border-blue-400';
    return 'bg-stone-600/30 border-stone-500';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-stone-800 via-gray-700 to-slate-900 relative overflow-hidden">
      {/* Enhanced Background */}
      <div className="fixed inset-0 z-0">
        <div className="absolute bottom-0 left-0 w-full h-80 bg-gradient-to-t from-stone-700/60 to-transparent" 
             style={{clipPath: 'polygon(0 100%, 15% 40%, 35% 70%, 55% 30%, 75% 60%, 85% 20%, 100% 45%, 100% 100%)'}} />
        <div className="absolute bottom-0 right-0 w-full h-72 bg-gradient-to-t from-stone-600/50 to-transparent"
             style={{clipPath: 'polygon(0 70%, 20% 35%, 40% 55%, 60% 25%, 80% 50%, 100% 15%, 100% 100%, 0 100%)'}} />
        
        {/* Animated background elements */}
        <div className="absolute bottom-20 left-16 text-2xl opacity-30 animate-pulse">🪨</div>
        <div className="absolute bottom-32 right-24 text-3xl opacity-25 animate-bounce" style={{animationDelay: '1s'}}>🗿</div>
        <div className="absolute bottom-28 left-1/3 text-2xl opacity-35 animate-pulse" style={{animationDelay: '2s'}}>⛰️</div>
        <div className="absolute top-40 left-20 text-3xl opacity-40 animate-pulse" style={{animationDelay: '3s'}}>💨</div>
        <div className="absolute top-52 right-32 text-2xl opacity-30 animate-pulse" style={{animationDelay: '4s'}}>💨</div>
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
              <span className="text-2xl">⛰️</span>
              <span className="text-white font-bold">Mountain Challenges - Level 8</span>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="bg-white/20 px-4 py-2 rounded-lg">
              <span className="text-white">Progress: {clearedRocks.length}/{rocks.length} rocks cleared</span>
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
            <span className="text-3xl">🪨</span>
            <span>Mission: Rock Clearing</span>
          </h2>
          
          <div className="space-y-4 text-white">
            <div className="bg-blue-500/20 p-4 rounded-xl border border-blue-400/30">
              <h3 className="font-bold mb-2 flex items-center space-x-2">
                <span>🎯</span>
                <span>Goal:</span>
              </h3>
              <p className="text-sm">Clear ALL rocks from the mountain path using While Loops and reach the end of the path!</p>
            </div>
            
            <div className="bg-purple-500/20 p-4 rounded-xl border border-purple-400/30">
              <h3 className="font-bold mb-2 flex items-center space-x-2">
                <span>🪨</span>
                <span>Rock Types:</span>
              </h3>
              <div className="space-y-2 text-sm">
                <div className="flex items-center space-x-2">
                  <span className="text-lg">🪨</span>
                  <span><strong>Small Pebbles:</strong> 1 hit to clear</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-lg">🗿</span>
                  <span><strong>Medium Stones:</strong> 2 hits to clear</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-lg">🏔️</span>
                  <span><strong>Large Boulders:</strong> 3 hits to clear</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-lg">⚡</span>
                  <span><strong>Magic Blast:</strong> Destroys any rock!</span>
                </div>
              </div>
            </div>
            
            <div className="bg-orange-500/20 p-4 rounded-xl border border-orange-400/30">
              <h3 className="font-bold mb-2 flex items-center space-x-2">
                <span>🔄</span>
                <span>While Loop Strategy:</span>
              </h3>
              <ul className="text-sm space-y-1">
                <li>• <strong>1. Check:</strong> Scan for rocks ahead</li>
                <li>• <strong>2. Loop:</strong> While rocks exist</li>
                <li>• <strong>3. Move:</strong> Forward to next position</li>
                <li>• <strong>4. Clear:</strong> Use correct tool for rock size</li>
                <li>• <strong>5. Update:</strong> Recheck rocks count</li>
                <li>• <strong>6. Repeat:</strong> Until all rocks cleared</li>
              </ul>
            </div>
          </div>

          {/* Enhanced Block Toolbox */}
          <div className="mt-6">
            <h3 className="text-lg font-bold text-white mb-4 flex items-center space-x-2">
              <span>🧰</span>
              <span>Code Blocks</span>
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

        {/* Enhanced Game World - Rocky Mountain Path */}
        <div className="bg-white/10 backdrop-blur-sm rounded-3xl border border-white/20 p-6 flex flex-col">
          <h2 className="text-xl font-bold text-white mb-4 flex items-center space-x-2">
            <span className="text-2xl">🏔️</span>
            <span>Mountain Path</span>
            {isRunning && (
              <div className="ml-4 flex items-center space-x-2 text-yellow-300">
                <div className="animate-spin w-4 h-4 border-2 border-yellow-300 border-t-transparent rounded-full"></div>
                <span className="text-sm">Running...</span>
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
            <div className="mb-4 p-3 bg-stone-500/20 rounded-lg border border-stone-400/30">
              <div className="text-white text-sm">{gameMessage}</div>
            </div>
          )}
          
          {/* Enhanced Path Visualization */}
          <div className="flex-1 flex flex-col justify-center">
            
            {/* Path Legend */}
            <div className="mb-4 grid grid-cols-2 gap-2 text-xs">
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 bg-yellow-400/40 border border-yellow-400 rounded"></div>
                <span className="text-white">Wizard Position</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 bg-red-400/30 border border-red-400 rounded"></div>
                <span className="text-white">Rock Blocking</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 bg-green-400/30 border border-green-400 rounded"></div>
                <span className="text-white">Rock Cleared</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 bg-blue-400/20 border border-blue-400 rounded"></div>
                <span className="text-white">Path Explored</span>
              </div>
            </div>
            
            {/* Mountain Path */}
            <div className="relative bg-gradient-to-r from-stone-700 via-stone-600 to-stone-700 rounded-xl border-4 border-stone-800 shadow-2xl p-4">
              {/* Path Grid */}
              <div className="grid grid-cols-9 gap-2 mb-4">
                {[...Array(9)].map((_, index) => {
                  const position = index;
                  const rock = rocks.find(r => r.position === position);
                  const isCleared = rock && clearedRocks.includes(rock.id);
                  const wizardHere = wizardPosition === position;
                  
                  return (
                    <div
                      key={position}
                      className={`relative aspect-square rounded-lg border-2 transition-all duration-300 ${getPositionColor(position)} flex items-center justify-center`}
                    >
                      {/* Position Number */}
                      <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 text-xs text-white/60">
                        {position}
                      </div>
                      
                      {/* Rock Display */}
                      {rock && !isCleared && (
                        <div className="relative">
                          <div className={`${getRockSize(rock)} filter drop-shadow-lg`}>
                            {getRockIcon(rock)}
                          </div>
                          <div className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                            {rock.health}
                          </div>
                        </div>
                      )}
                      
                      {/* Cleared Rock Effect */}
                      {rock && isCleared && (
                        <div className="text-green-400 text-2xl animate-pulse">✨</div>
                      )}
                      
                      {/* Wizard */}
                      {wizardHere && (
                        <div className="absolute -top-8 left-1/2 transform -translate-x-1/2">
                          <div className="text-3xl animate-bounce">🧙‍♂️</div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
              
              {/* Second Row */}
              <div className="grid grid-cols-9 gap-2">
                {[...Array(9)].map((_, index) => {
                  const position = index + 9;
                  const rock = rocks.find(r => r.position === position);
                  const isCleared = rock && clearedRocks.includes(rock.id);
                  const wizardHere = wizardPosition === position;
                  
                  return (
                    <div
                      key={position}
                      className={`relative aspect-square rounded-lg border-2 transition-all duration-300 ${getPositionColor(position)} flex items-center justify-center`}
                    >
                      {/* Position Number */}
                      <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 text-xs text-white/60">
                        {position}
                      </div>
                      
                      {/* Rock Display */}
                      {rock && !isCleared && (
                        <div className="relative">
                          <div className={`${getRockSize(rock)} filter drop-shadow-lg`}>
                            {getRockIcon(rock)}
                          </div>
                          <div className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                            {rock.health}
                          </div>
                        </div>
                      )}
                      
                      {/* Cleared Rock Effect */}
                      {rock && isCleared && (
                        <div className="text-green-400 text-2xl animate-pulse">✨</div>
                      )}
                      
                      {/* Wizard */}
                      {wizardHere && (
                        <div className="absolute -top-8 left-1/2 transform -translate-x-1/2">
                          <div className="text-3xl animate-bounce">🧙‍♂️</div>
                        </div>
                      )}
                      
                      {/* End Goal Marker */}
                      {position === pathEnd && (
                        <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 text-yellow-400 text-sm font-bold">
                          🏁 GOAL
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
              
              {/* Path Direction Arrows */}
              <div className="absolute top-1/2 -left-6 transform -translate-y-1/2">
                <div className="text-white text-2xl">▶️</div>
                <div className="text-xs text-white/60 mt-1">START</div>
              </div>
              <div className="absolute top-1/2 -right-6 transform -translate-y-1/2">
                <div className="text-white text-2xl">🏁</div>
                <div className="text-xs text-white/60 mt-1">END</div>
              </div>
            </div>
            
            {/* Enhanced Status Panels */}
            <div className="mt-6 grid grid-cols-2 gap-4">
              {/* Variables Display */}
              <div className="bg-purple-500/20 p-4 rounded-xl border border-purple-400/30">
                <h4 className="text-white font-bold text-sm mb-3 flex items-center space-x-2">
                  <span>📊</span>
                  <span>Loop Variables</span>
                </h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between items-center">
                    <span className="text-white/80">rocksAhead:</span>
                    <span className="text-yellow-300 font-mono">
                      {variables.rocksAhead !== undefined ? variables.rocksAhead : 'undefined'}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-white/80">pathClear:</span>
                    <span className="text-green-300 font-mono">
                      {clearedRocks.length === rocks.length ? 'true' : 'false'}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-white/80">iterations:</span>
                    <span className="text-blue-300 font-mono">{loopIterations}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-white/80">position:</span>
                    <span className="text-cyan-300 font-mono">{wizardPosition}</span>
                  </div>
                </div>
              </div>
              
              {/* Progress Tracking */}
              <div className="bg-green-500/20 p-4 rounded-xl border border-green-400/30">
                <h4 className="text-white font-bold text-sm mb-3 flex items-center space-x-2">
                  <span>📈</span>
                  <span>Progress</span>
                </h4>
                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between text-xs text-white mb-1">
                      <span>Rocks Cleared</span>
                      <span>{clearedRocks.length}/{rocks.length}</span>
                    </div>
                    <div className="w-full bg-white/20 rounded-full h-2">
                      <div 
                        className="bg-green-500 h-2 rounded-full transition-all duration-500"
                        style={{ width: `${(clearedRocks.length / rocks.length) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex justify-between text-xs text-white mb-1">
                      <span>Path Progress</span>
                      <span>{wizardPosition}/{pathEnd}</span>
                    </div>
                    <div className="w-full bg-white/20 rounded-full h-2">
                      <div 
                        className="bg-blue-500 h-2 rounded-full transition-all duration-500"
                        style={{ width: `${(wizardPosition / pathEnd) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Rock Status List */}
            <div className="mt-4 bg-red-500/20 p-4 rounded-xl border border-red-400/30">
              <h4 className="text-white font-bold text-sm mb-3 flex items-center space-x-2">
                <span>🪨</span>
                <span>Rock Status</span>
              </h4>
              <div className="grid grid-cols-1 gap-1 max-h-32 overflow-y-auto">
                {rocks.map((rock) => (
                  <div key={rock.id} className="flex items-center justify-between text-xs py-1">
                    <div className="flex items-center space-x-2">
                      <span className={getRockSize(rock).replace('text-', 'text-')}>{getRockIcon(rock)}</span>
                      <span className="text-white">{rock.type}</span>
                      <span className="text-gray-300">(Pos {rock.position})</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      {clearedRocks.includes(rock.id) ? (
                        <span className="text-green-400 text-xs">✅ Cleared</span>
                      ) : (
                        <div className="flex items-center space-x-1">
                          <span className="text-red-400 text-xs">❤️ {rock.health}</span>
                          <span className="text-orange-400 text-xs">🚫 Blocking</span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Game Status */}
            {gameState === 'success' && (
              <div className="mt-4 bg-green-500/20 p-4 rounded-xl border border-green-400/30 text-center">
                <div className="text-4xl mb-2">🎉</div>
                <div className="text-white font-bold">Mission Accomplished!</div>
                <div className="text-green-200 text-sm">Perfect execution - all rocks cleared and goal reached!</div>
                <div className="flex justify-center space-x-1 mt-2">
                  <Star className="w-6 h-6 text-yellow-400 fill-current" />
                  <Star className="w-6 h-6 text-yellow-400 fill-current" />
                  <Star className="w-6 h-6 text-yellow-400 fill-current" />
                </div>
              </div>
            )}
            
            {gameState === 'error' && (
              <div className="mt-4 bg-red-500/20 p-4 rounded-xl border border-red-400/30 text-center">
                <div className="text-4xl mb-2">❌</div>
                <div className="text-white font-bold">Mission Failed!</div>
                <div className="text-red-200 text-sm">{gameMessage}</div>
                <div className="text-xs text-red-300 mt-2">
                  Try adjusting your while loop logic or clearing strategy.
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Enhanced Code Area */}
        <div className="bg-white/10 backdrop-blur-sm rounded-3xl border border-white/20 p-6 flex flex-col max-h-full overflow-hidden">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-white flex items-center space-x-2">
              <span className="text-2xl">🔄</span>
              <span>While Loop Logic</span>
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
                className="px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-lg hover:scale-105 transition-transform disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2 border border-green-500/50"
              >
                <Play className="w-4 h-4" />
                <span>{isRunning ? 'Clearing...' : 'Clear Path'}</span>
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
            className="flex-1 border-2 border-dashed border-white/30 rounded-xl p-4 min-h-32 max-h-64 overflow-y-auto bg-black/10"
          >
            {codeBlocks.length === 0 ? (
              <div className="flex items-center justify-center h-full text-white/60 text-center">
                <div>
                  <div className="text-4xl mb-2">🪨</div>
                  <div className="text-lg mb-2">Drag blocks here!</div>
                  <div className="text-sm">Start with "Check Rocks Ahead" then add a "While Loop"</div>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                {codeBlocks.map((block, index) => (
                  <div
                    key={block.uniqueId}
                    className={`p-3 bg-gradient-to-r ${block.color} text-white rounded-xl relative group transition-all duration-300 ${
                      executionStep === index ? 'ring-4 ring-yellow-400 ring-opacity-75 scale-105 shadow-2xl' : ''
                    } ${isRunning && executionStep > index ? 'opacity-60' : ''}`}
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
                    
                    {/* Step Number */}
                    <div className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-3 w-6 h-6 bg-white rounded-full text-xs flex items-center justify-center text-gray-800 font-bold border-2 border-gray-300">
                      {index + 1}
                    </div>
                    
                    {/* Execution Indicator */}
                    {executionStep === index && (
                      <div className="absolute -top-2 -right-2 w-4 h-4 bg-yellow-400 rounded-full animate-pulse"></div>
                    )}
                    
                    {/* Completed Indicator */}
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
          <div className="mt-4 bg-purple-500/20 p-3 rounded-xl border border-purple-400/30">
            <div className="text-white/80 text-xs mb-2 flex items-center space-x-2">
              <span>💡</span>
              <span>Optimal Strategy:</span>
            </div>
            <div className="text-purple-200 text-sm space-y-1">
              <div><strong>1.</strong> Check Rocks Ahead (initialize variable)</div>
              <div><strong>2.</strong> While (rocks exist) - start loop</div>
              <div><strong>3.</strong> Move Forward</div>
              <div><strong>4.</strong> If Rock at Position</div>
              <div><strong>5.</strong> Clear Rock (use correct size tool)</div>
              <div><strong>6.</strong> Update Rocks Count</div>
              <div><strong>7.</strong> Path Cleared! (celebrate)</div>
            </div>
          </div>
          
          {/* Enhanced Code Preview */}
          <div className="mt-4 bg-black/40 p-3 rounded-xl border border-gray-600">
            <div className="flex items-center justify-between mb-2">
              <div className="text-white/60 text-xs flex items-center space-x-2">
                <span>⚡</span>
                <span>Generated Code:</span>
              </div>
              <div className="text-xs text-white/40">
                {codeBlocks.length} blocks | {codeBlocks.filter(b => b.type === 'loop').length} loops
              </div>
            </div>
            <div className="text-green-300 font-mono text-sm max-h-32 overflow-y-auto">
              {codeBlocks.length === 0 ? (
                <span className="text-white/40">// Your While Loop code will appear here</span>
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
    </div>
  );
};

export default LevelEightGame;