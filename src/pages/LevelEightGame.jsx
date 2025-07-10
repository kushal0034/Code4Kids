import React, { useState, useEffect } from 'react';
import { Sparkles, Play, RotateCcw, CheckCircle, Star, Home, ArrowLeft } from 'lucide-react';

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
  const [pathRevealed, setPathRevealed] = useState([]);

  // Initialize rocks on mount
  useEffect(() => {
    const initialRocks = [
      { id: 1, position: 3, size: 'large', health: 3, type: 'boulder' },
      { id: 2, position: 5, size: 'medium', health: 2, type: 'stone' },
      { id: 3, position: 7, size: 'small', health: 1, type: 'pebble' },
      { id: 4, position: 9, size: 'large', health: 3, type: 'boulder' },
      { id: 5, position: 11, size: 'medium', health: 2, type: 'stone' },
      { id: 6, position: 13, size: 'small', health: 1, type: 'pebble' },
      { id: 7, position: 15, size: 'large', health: 3, type: 'boulder' }
    ];
    setRocks(initialRocks);
  }, []);

  const totalPositions = 18;
  const pathStart = 2;
  const pathEnd = 16;

  const availableBlocks = [
    {
      id: 'create-rocks-variable',
      type: 'variable',
      text: 'Check Rocks Ahead',
      color: 'from-blue-500 to-blue-600',
      code: 'let rocksAhead = checkPath()',
      description: 'Scans for rocks blocking the path'
    },
    {
      id: 'while-rocks-exist',
      type: 'loop',
      text: 'While (rocks exist)',
      color: 'from-purple-500 to-purple-600',
      code: 'while (rocksAhead > 0)',
      description: 'Continues while rocks block the path'
    },
    {
      id: 'while-not-clear',
      type: 'loop',
      text: 'While (path not clear)',
      color: 'from-violet-500 to-violet-600',
      code: 'while (!pathClear)',
      description: 'Loops until path is completely clear'
    },
    {
      id: 'check-current-position',
      type: 'condition',
      text: 'If Rock at Position',
      color: 'from-orange-500 to-orange-600',
      code: 'if (rockAtPosition)',
      description: 'Checks if there is a rock at current position'
    },
    {
      id: 'move-forward',
      type: 'action',
      text: 'Move Forward',
      color: 'from-green-500 to-green-600',
      code: 'wizard.moveForward()',
      description: 'Moves wizard to next position'
    },
    {
      id: 'clear-small-rock',
      type: 'action',
      text: 'Clear Small Rock',
      color: 'from-cyan-500 to-cyan-600',
      code: 'wizard.clearRock("small")',
      description: 'Removes small pebbles (1 hit)'
    },
    {
      id: 'clear-medium-rock',
      type: 'action',
      text: 'Clear Medium Rock',
      color: 'from-teal-500 to-teal-600',
      code: 'wizard.clearRock("medium")',
      description: 'Removes medium stones (2 hits)'
    },
    {
      id: 'clear-large-rock',
      type: 'action',
      text: 'Clear Large Rock',
      color: 'from-emerald-500 to-emerald-600',
      code: 'wizard.clearRock("large")',
      description: 'Removes large boulders (3 hits)'
    },
    {
      id: 'use-magic-blast',
      type: 'action',
      text: 'Magic Rock Blast',
      color: 'from-yellow-500 to-yellow-600',
      code: 'wizard.magicBlast()',
      description: 'Destroys any rock instantly'
    },
    {
      id: 'update-rocks-count',
      type: 'action',
      text: 'Update Rocks Count',
      color: 'from-indigo-500 to-indigo-600',
      code: 'rocksAhead = checkPath()',
      description: 'Rechecks remaining rocks'
    },
    {
      id: 'celebrate',
      type: 'action',
      text: 'Path Cleared!',
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
    setClearedRocks([]);
    setPathRevealed([]);
    setGameState('playing');
    setIsRunning(false);
    setExecutionStep(-1);
    setVariables({});
    setGameMessage('');
    // Reset rocks to initial state
    const initialRocks = [
      { id: 1, position: 3, size: 'large', health: 3, type: 'boulder' },
      { id: 2, position: 5, size: 'medium', health: 2, type: 'stone' },
      { id: 3, position: 7, size: 'small', health: 1, type: 'pebble' },
      { id: 4, position: 9, size: 'large', health: 3, type: 'boulder' },
      { id: 5, position: 11, size: 'medium', health: 2, type: 'stone' },
      { id: 6, position: 13, size: 'small', health: 1, type: 'pebble' },
      { id: 7, position: 15, size: 'large', health: 3, type: 'boulder' }
    ];
    setRocks(initialRocks);
  };

  const runCode = async () => {
    if (codeBlocks.length === 0) return;
    
    setIsRunning(true);
    setGameState('playing');
    resetGame();
    
    let currentPosition = 0;
    let currentVariables = {};
    let currentRocks = [...rocks];
    let cleared = [];
    let revealed = [];
    let hasRocksVariable = false;
    let rocksRemaining = currentRocks.length;

    for (let i = 0; i < codeBlocks.length; i++) {
      setExecutionStep(i);
      
      const block = codeBlocks[i];
      await new Promise(resolve => setTimeout(resolve, 1000));

      switch (block.type) {
        case 'variable':
          if (block.id.includes('create-rocks-variable')) {
            hasRocksVariable = true;
            rocksRemaining = currentRocks.filter(rock => !cleared.includes(rock.id)).length;
            currentVariables.rocksAhead = rocksRemaining;
            setVariables({...currentVariables});
            setGameMessage(`Rocks detected: ${rocksRemaining} rocks blocking the path!`);
          }
          break;
          
        case 'loop':
          if (block.id.includes('while-rocks-exist') || block.id.includes('while-not-clear')) {
            setGameMessage('Starting While Loop - clearing rocks until path is clear...');
            
            let maxIterations = 50; // Safety limit
            let iterations = 0;
            
            while (rocksRemaining > 0 && iterations < maxIterations) {
              // Find actions inside this loop
              for (let j = i + 1; j < codeBlocks.length; j++) {
                const loopBlock = codeBlocks[j];
                if (loopBlock.type === 'loop' || loopBlock.id.includes('celebrate')) {
                  break;
                }
                
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
                      
                      setGameMessage(`Moving to position ${currentPosition}`);
                    }
                  } else if (loopBlock.id.includes('clear-') || loopBlock.id.includes('magic-blast')) {
                    const rockAtPosition = currentRocks.find(rock => 
                      rock.position === currentPosition && !cleared.includes(rock.id)
                    );
                    
                    if (rockAtPosition) {
                      let canClear = false;
                      
                      if (loopBlock.id.includes('clear-small-rock') && rockAtPosition.size === 'small') {
                        canClear = true;
                      } else if (loopBlock.id.includes('clear-medium-rock') && rockAtPosition.size === 'medium') {
                        canClear = true;
                      } else if (loopBlock.id.includes('clear-large-rock') && rockAtPosition.size === 'large') {
                        canClear = true;
                      } else if (loopBlock.id.includes('magic-blast')) {
                        canClear = true;
                      }
                      
                      if (canClear) {
                        cleared.push(rockAtPosition.id);
                        setClearedRocks([...cleared]);
                        rocksRemaining = currentRocks.filter(rock => !cleared.includes(rock.id)).length;
                        
                        if (hasRocksVariable) {
                          currentVariables.rocksAhead = rocksRemaining;
                          setVariables({...currentVariables});
                        }
                        
                        setGameMessage(`Cleared ${rockAtPosition.size} ${rockAtPosition.type}! ${rocksRemaining} rocks remaining.`);
                      } else {
                        setGameMessage(`Wrong tool for ${rockAtPosition.size} rock!`);
                      }
                    } else {
                      setGameMessage('No rock at current position to clear.');
                    }
                  } else if (loopBlock.id.includes('update-rocks-count')) {
                    rocksRemaining = currentRocks.filter(rock => !cleared.includes(rock.id)).length;
                    if (hasRocksVariable) {
                      currentVariables.rocksAhead = rocksRemaining;
                      setVariables({...currentVariables});
                    }
                    setGameMessage(`Updated count: ${rocksRemaining} rocks remaining`);
                  }
                }
              }
              
              iterations++;
              if (rocksRemaining === 0) {
                setGameMessage('While Loop completed - all rocks cleared!');
                break;
              }
            }
            
            if (iterations >= maxIterations) {
              setGameMessage('Loop safety limit reached - check your logic!');
              setGameState('error');
              setIsRunning(false);
              return;
            }
            
          }
          break;
          
        case 'action':
          if (block.id.includes('celebrate')) {
            if (rocksRemaining === 0 && currentPosition >= pathEnd) {
              setGameState('success');
              setGameMessage('🎉 Path completely cleared!');
            } else if (rocksRemaining > 0) {
              setGameMessage(`Path not fully cleared! ${rocksRemaining} rocks still remaining.`);
              setGameState('error');
              setIsRunning(false);
              return;
            } else if (currentPosition < pathEnd) {
              setGameMessage(`Reach the end of the path! Current position: ${currentPosition}, need to reach: ${pathEnd}`);
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
    
    if (rocksRemaining === 0 && currentPosition >= pathEnd) {
      setGameState('success');
    } else {
      setGameState('error');
      setGameMessage(`Mission incomplete! Rocks remaining: ${rocksRemaining}, Position: ${currentPosition}/${pathEnd}`);
    }
  };

  const getRockIcon = (rock) => {
    if (rock.size === 'small') return '🪨';
    if (rock.size === 'medium') return '🗿';
    return '🏔️';
  };

  const getRockSize = (rock) => {
    if (rock.size === 'small') return 'w-8 h-8';
    if (rock.size === 'medium') return 'w-12 h-12';
    return 'w-16 h-16';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-stone-800 via-gray-700 to-slate-900 relative overflow-hidden">
      {/* Background Mountain Elements */}
      <div className="fixed inset-0 z-0">
        {/* Rocky Mountain Backdrop */}
        <div className="absolute bottom-0 left-0 w-full h-80 bg-gradient-to-t from-stone-700 to-stone-600 opacity-50" 
             style={{clipPath: 'polygon(0 100%, 15% 40%, 35% 70%, 55% 30%, 75% 60%, 85% 20%, 100% 45%, 100% 100%)'}} />
        <div className="absolute bottom-0 right-0 w-full h-72 bg-gradient-to-t from-stone-600 to-stone-500 opacity-40"
             style={{clipPath: 'polygon(0 70%, 20% 35%, 40% 55%, 60% 25%, 80% 50%, 100% 15%, 100% 100%, 0 100%)'}} />
        
        {/* Rocky Debris */}
        <div className="absolute bottom-20 left-16 text-2xl opacity-30">🪨</div>
        <div className="absolute bottom-32 right-24 text-3xl opacity-25">🗿</div>
        <div className="absolute bottom-28 left-1/3 text-2xl opacity-35">⛰️</div>
        <div className="absolute bottom-24 right-1/3 text-2xl opacity-30">🪨</div>
        
        {/* Dust clouds */}
        <div className="absolute top-40 left-20 text-3xl opacity-40 animate-pulse">💨</div>
        <div className="absolute top-52 right-32 text-2xl opacity-30 animate-pulse" style={{animationDelay: '2s'}}>💨</div>
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
              <span className="text-white">Rocks Cleared: {clearedRocks.length}/{rocks.length}</span>
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
              <h3 className="font-bold mb-2">🎯 Goal:</h3>
              <p className="text-sm">Clear ALL rocks from the mountain path using While Loops until the path is completely clear!</p>
            </div>
            
            <div className="bg-purple-500/20 p-4 rounded-xl border border-purple-400/30">
              <h3 className="font-bold mb-2">🪨 Rock Types:</h3>
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
              <h3 className="font-bold mb-2">🔄 While Loop Logic:</h3>
              <ul className="text-sm space-y-1">
                <li>• <strong>Condition:</strong> Keep going while rocks exist</li>
                <li>• <strong>Check:</strong> Scan for rocks on path</li>
                <li>• <strong>Action:</strong> Move and clear rocks</li>
                <li>• <strong>Update:</strong> Recheck remaining rocks</li>
                <li>• <strong>Repeat:</strong> Until condition is false</li>
              </ul>
            </div>
            
            <div className="bg-green-500/20 p-4 rounded-xl border border-green-400/30">
              <h3 className="font-bold mb-2">💡 Strategy:</h3>
              <ul className="text-sm space-y-1">
                <li>• Start with "Check Rocks Ahead"</li>
                <li>• Use "While (rocks exist)" loop</li>
                <li>• Move forward to find rocks</li>
                <li>• Use correct clearing tool for rock size</li>
                <li>• Update rocks count in loop</li>
                <li>• Continue until path is clear!</li>
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

        {/* Enhanced Game World - Rocky Mountain Path */}
        <div className="bg-white/10 backdrop-blur-sm rounded-3xl border border-white/20 p-6 flex flex-col">
          <h2 className="text-xl font-bold text-white mb-4 flex items-center space-x-2">
            <span className="text-2xl">🏔️</span>
            <span>Mountain Path Clearing</span>
          </h2>
          
          {/* Game Status Message */}
          {gameMessage && (
            <div className="mb-4 p-3 bg-stone-500/20 rounded-lg border border-stone-400/30">
              <div className="text-white text-sm">{gameMessage}</div>
            </div>
          )}
          
          {/* Enhanced Rocky Path Visualization */}
          <div className="flex-1 flex flex-col justify-center relative">
            
            {/* Mountain Path Background */}
            <div className="relative">
              {/* Path Base */}
              <div className="relative h-24 bg-gradient-to-r from-stone-600 via-stone-500 to-stone-600 rounded-lg border-4 border-stone-700 shadow-2xl">
                {/* Path Texture */}
                <div className="absolute inset-1 bg-gradient-to-b from-stone-400 to-stone-600 rounded opacity-60"></div>
                
                {/* Path Stones Texture */}
                <div className="absolute inset-2 rounded">
                  {[...Array(12)].map((_, i) => (
                    <div
                      key={i}
                      className="absolute w-3 h-2 bg-stone-300 rounded opacity-40"
                      style={{
                        left: `${Math.random() * 90}%`,
                        top: `${Math.random() * 80}%`,
                        transform: `rotate(${Math.random() * 360}deg)`
                      }}
                    ></div>
                  ))}
                </div>
                
                {/* Position Grid */}
                <div className="absolute inset-0 grid grid-cols-18 gap-0">
                  {[...Array(totalPositions)].map((_, index) => {
                    const rock = rocks.find(r => r.position === index);
                    const isCleared = rock && clearedRocks.includes(rock.id);
                    const isRevealed = pathRevealed.includes(index);
                    const wizardHere = wizardPosition === index;
                    
                    return (
                      <div key={index} className="relative flex items-center justify-center">
                        {/* Position Marker */}
                        <div className={`w-full h-full border border-stone-400/20 ${
                          wizardHere ? 'bg-yellow-300/30' : 
                          isRevealed ? 'bg-green-300/20' : 
                          'bg-transparent'
                        }`}>
                          
                          {/* Rock Visualization */}
                          {rock && !isCleared && (
                            <div className="absolute inset-0 flex items-center justify-center">
                              <div className={`${getRockSize(rock)} relative`}>
                                {/* Rock Shadow */}
                                <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1 w-full h-2 bg-black/40 rounded-full blur-sm"></div>
                                
                                {/* Rock Body */}
                                <div className={`absolute inset-0 flex items-center justify-center text-2xl ${
                                  rock.size === 'large' ? 'text-4xl' : 
                                  rock.size === 'medium' ? 'text-3xl' : 'text-2xl'
                                } filter drop-shadow-lg`}>
                                  {getRockIcon(rock)}
                                </div>
                                
                                {/* Rock Health Indicator */}
                                <div className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                                  {rock.health}
                                </div>
                                
                                {/* Rock Type Label */}
                                <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 text-xs text-white bg-black/50 px-1 rounded">
                                  {rock.type}
                                </div>
                              </div>
                            </div>
                          )}
                          
                          {/* Cleared Rock Indicator */}
                          {rock && isCleared && (
                            <div className="absolute inset-0 flex items-center justify-center">
                              <div className="text-green-400 text-2xl animate-pulse">✨</div>
                              <div className="absolute -bottom-4 text-xs text-green-300">Cleared!</div>
                            </div>
                          )}
                          
                          {/* Wizard Character */}
                          {wizardHere && (
                            <div className="absolute -top-8 left-1/2 transform -translate-x-1/2">
                              <div className="text-4xl animate-bounce">🧙‍♂️</div>
                              <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 text-xs text-yellow-300 bg-black/50 px-1 rounded">
                                Pos {index}
                              </div>
                            </div>
                          )}
                          
                          {/* Position Number */}
                          <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 text-xs text-white/60">
                            {index}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
                
                {/* Path Borders and Details */}
                <div className="absolute -top-2 left-0 right-0 h-1 bg-stone-800 rounded-full"></div>
                <div className="absolute -bottom-2 left-0 right-0 h-1 bg-stone-800 rounded-full"></div>
              </div>
              
              {/* Path Side Rocks and Debris */}
              <div className="absolute -top-4 left-4 text-lg opacity-40">🪨</div>
              <div className="absolute -top-6 right-8 text-xl opacity-35">⛰️</div>
              <div className="absolute -bottom-4 left-12 text-lg opacity-40">🗿</div>
              <div className="absolute -bottom-6 right-4 text-lg opacity-35">🪨</div>
            </div>
            
            {/* Progress and Status Indicators */}
            <div className="mt-8 grid grid-cols-2 gap-4">
              <div className="bg-red-500/20 p-4 rounded-xl border border-red-400/30">
                <h4 className="text-white font-bold text-sm mb-2">🪨 Rocks Status</h4>
                <div className="space-y-2">
                  {rocks.map((rock) => (
                    <div key={rock.id} className="flex items-center justify-between text-xs">
                      <div className="flex items-center space-x-2">
                        <span>{getRockIcon(rock)}</span>
                        <span className="text-white">{rock.type}</span>
                        <span className="text-gray-300">(Pos {rock.position})</span>
                      </div>
                      <div>
                        {clearedRocks.includes(rock.id) ? (
                          <span className="text-green-400">✅ Cleared</span>
                        ) : (
                          <span className="text-red-400">🚫 Blocking</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="bg-green-500/20 p-4 rounded-xl border border-green-400/30">
                <h4 className="text-white font-bold text-sm mb-2">📊 Progress Tracking</h4>
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
                      <span>Path Explored</span>
                      <span>{pathRevealed.length}/{totalPositions}</span>
                    </div>
                    <div className="w-full bg-white/20 rounded-full h-2">
                      <div 
                        className="bg-blue-500 h-2 rounded-full transition-all duration-500"
                        style={{ width: `${(pathRevealed.length / totalPositions) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Variables Display */}
            <div className="mt-4 bg-purple-500/20 p-4 rounded-xl border border-purple-400/30">
              <h3 className="text-white font-bold mb-2">📊 While Loop Variables:</h3>
              <div className="text-white space-y-1 text-sm">
                {variables.rocksAhead !== undefined ? (
                  <div className="font-mono bg-black/30 px-2 py-1 rounded">
                    rocksAhead = {variables.rocksAhead}
                  </div>
                ) : (
                  <div className="text-white/60">No rocks variable created</div>
                )}
                <div className="font-mono bg-black/30 px-2 py-1 rounded">
                  pathClear = {clearedRocks.length === rocks.length ? 'true' : 'false'}
                </div>
              </div>
            </div>
            
            {/* Game Status */}
            {gameState === 'success' && (
              <div className="mt-4 bg-green-500/20 p-4 rounded-xl border border-green-400/30 text-center">
                <div className="text-4xl mb-2">🎉</div>
                <div className="text-white font-bold">Path Completely Cleared!</div>
                <div className="text-green-200 text-sm">Perfect While Loop execution - all rocks removed!</div>
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
                <div className="text-white font-bold">Path Clearing Failed!</div>
                <div className="text-red-200 text-sm">{gameMessage}</div>
              </div>
            )}
          </div>
        </div>

        {/* Code Area */}
        <div className="bg-white/10 backdrop-blur-sm rounded-3xl border border-white/20 p-6 flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-white flex items-center space-x-2">
              <span className="text-2xl">🔄</span>
              <span>While Loop Logic</span>
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
                <span>{isRunning ? 'Clearing...' : 'Clear Path'}</span>
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
                  <div className="text-4xl mb-2">🪨</div>
                  <div>Drag blocks to create your While Loop!</div>
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
          
          {/* While Loop Logic Helper */}
          <div className="mt-4 bg-purple-500/20 p-3 rounded-xl border border-purple-400/30">
            <div className="text-white/80 text-xs mb-2">🔄 While Loop Pattern:</div>
            <div className="text-purple-200 text-sm space-y-1">
              <div><strong>1. Initialize:</strong> Check rocks ahead</div>
              <div><strong>2. Condition:</strong> while (rocks exist)</div>
              <div><strong>3. Action:</strong> Move, clear rocks</div>
              <div><strong>4. Update:</strong> Recheck condition</div>
              <div><strong>5. Repeat:</strong> Until condition is false</div>
            </div>
          </div>
          
          {/* Code Preview */}
          <div className="mt-4 bg-black/30 p-3 rounded-xl">
            <div className="text-white/60 text-xs mb-2">Generated Code:</div>
            <div className="text-green-300 font-mono text-sm max-h-32 overflow-y-auto">
              {codeBlocks.length === 0 ? (
                <span className="text-white/40">// Your While Loop code will appear here</span>
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

export default LevelEightGame;