import React, { useState, useEffect } from 'react';
import { Sparkles, Play, RotateCcw, CheckCircle, Star, Home, ArrowLeft } from 'lucide-react';

const LevelSevenGame = () => {
  const [draggedBlock, setDraggedBlock] = useState(null);
  const [codeBlocks, setCodeBlocks] = useState([]);
  const [gameState, setGameState] = useState('playing'); // 'playing', 'success', 'error'
  const [isRunning, setIsRunning] = useState(false);
  const [wizardPosition, setWizardPosition] = useState(0);
  const [executionStep, setExecutionStep] = useState(-1);
  const [variables, setVariables] = useState({});
  const [gameMessage, setGameMessage] = useState('');
  const [crossedPlanks, setCrossedPlanks] = useState([]);
  const [bridgeRepaired, setBridgeRepaired] = useState([]);

  const totalPlanks = 10;
  const bridgeStart = 2;
  const bridgeEnd = 12;
  const totalPositions = 15;

  const availableBlocks = [
    {
      id: 'create-counter',
      type: 'variable',
      text: 'Create Step Counter',
      color: 'from-blue-500 to-blue-600',
      code: 'let steps = 0',
      description: 'Creates a counter to track steps taken'
    },
    {
      id: 'create-goal',
      type: 'variable',
      text: 'Set Goal (10 steps)',
      color: 'from-indigo-500 to-indigo-600',
      code: 'let goal = 10',
      description: 'Sets the target number of steps'
    },
    {
      id: 'for-loop-start',
      type: 'loop',
      text: 'For Loop (10 times)',
      color: 'from-purple-500 to-purple-600',
      code: 'for (let i = 0; i < 10; i++)',
      description: 'Repeats code block 10 times'
    },
    {
      id: 'while-loop-start',
      type: 'loop',
      text: 'While (steps < 10)',
      color: 'from-violet-500 to-violet-600',
      code: 'while (steps < 10)',
      description: 'Repeats while condition is true'
    },
    {
      id: 'step-forward',
      type: 'action',
      text: 'Step Forward',
      color: 'from-green-500 to-green-600',
      code: 'wizard.stepForward()',
      description: 'Takes one step across the bridge'
    },
    {
      id: 'repair-plank',
      type: 'action',
      text: 'Repair Bridge Plank',
      color: 'from-orange-500 to-orange-600',
      code: 'wizard.repairPlank()',
      description: 'Fixes a broken plank on the bridge'
    },
    {
      id: 'increment-counter',
      type: 'action',
      text: 'Count Step (steps++)',
      color: 'from-cyan-500 to-cyan-600',
      code: 'steps = steps + 1',
      description: 'Increases step counter by 1'
    },
    {
      id: 'check-progress',
      type: 'condition',
      text: 'Check if steps < goal',
      color: 'from-yellow-500 to-yellow-600',
      code: 'if (steps < goal)',
      description: 'Checks if more steps are needed'
    },
    {
      id: 'loop-end',
      type: 'structure',
      text: 'End Loop Block',
      color: 'from-gray-500 to-gray-600',
      code: '}',
      description: 'Closes the loop block'
    },
    {
      id: 'celebrate',
      type: 'action',
      text: 'Cross Bridge Successfully!',
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
    setCrossedPlanks([]);
    setBridgeRepaired([]);
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
    let stepsTaken = 0;
    let planksRepaired = [];
    let planksCrossed = [];
    let hasCounter = false;
    let hasGoal = false;
    let inLoop = false;
    let loopCount = 0;

    for (let i = 0; i < codeBlocks.length; i++) {
      setExecutionStep(i);
      
      const block = codeBlocks[i];
      await new Promise(resolve => setTimeout(resolve, 800));

      switch (block.type) {
        case 'variable':
          if (block.id.includes('create-counter')) {
            hasCounter = true;
            currentVariables.steps = 0;
            setVariables({...currentVariables});
            setGameMessage('Step counter created!');
          } else if (block.id.includes('create-goal')) {
            hasGoal = true;
            currentVariables.goal = 10;
            setVariables({...currentVariables});
            setGameMessage('Goal set to 10 steps!');
          }
          break;
          
        case 'loop':
          if (block.id.includes('for-loop-start')) {
            inLoop = true;
            loopCount = 0;
            setGameMessage('Starting For Loop - will repeat 10 times!');
            
            // Execute the loop
            while (loopCount < 10) {
              // Find actions inside this loop (simplified approach)
              for (let j = i + 1; j < codeBlocks.length; j++) {
                const loopBlock = codeBlocks[j];
                if (loopBlock.type === 'structure' && loopBlock.id.includes('loop-end')) {
                  break;
                }
                
                await new Promise(resolve => setTimeout(resolve, 600));
                
                if (loopBlock.type === 'action') {
                  if (loopBlock.id.includes('step-forward')) {
                    if (currentPosition < bridgeEnd) {
                      currentPosition++;
                      setWizardPosition(currentPosition);
                      
                      if (currentPosition >= bridgeStart && currentPosition <= bridgeEnd) {
                        const plankIndex = currentPosition - bridgeStart;
                        if (!planksCrossed.includes(plankIndex)) {
                          planksCrossed.push(plankIndex);
                          setCrossedPlanks([...planksCrossed]);
                        }
                      }
                      setGameMessage(`Step ${loopCount + 1}: Moving forward...`);
                    }
                  } else if (loopBlock.id.includes('repair-plank')) {
                    if (currentPosition >= bridgeStart && currentPosition <= bridgeEnd) {
                      const plankIndex = currentPosition - bridgeStart;
                      if (!planksRepaired.includes(plankIndex)) {
                        planksRepaired.push(plankIndex);
                        setBridgeRepaired([...planksRepaired]);
                        setGameMessage(`Repairing plank ${plankIndex + 1}...`);
                      }
                    }
                  } else if (loopBlock.id.includes('increment-counter')) {
                    if (hasCounter) {
                      currentVariables.steps = loopCount + 1;
                      setVariables({...currentVariables});
                    }
                  }
                }
              }
              
              loopCount++;
            }
            
            setGameMessage('For Loop completed - ran 10 times!');
            
          } else if (block.id.includes('while-loop-start')) {
            inLoop = true;
            setGameMessage('Starting While Loop...');
            
            while (stepsTaken < 10) {
              // Find actions inside this loop
              for (let j = i + 1; j < codeBlocks.length; j++) {
                const loopBlock = codeBlocks[j];
                if (loopBlock.type === 'structure' && loopBlock.id.includes('loop-end')) {
                  break;
                }
                
                await new Promise(resolve => setTimeout(resolve, 600));
                
                if (loopBlock.type === 'action') {
                  if (loopBlock.id.includes('step-forward')) {
                    if (currentPosition < bridgeEnd) {
                      currentPosition++;
                      stepsTaken++;
                      setWizardPosition(currentPosition);
                      
                      if (currentPosition >= bridgeStart && currentPosition <= bridgeEnd) {
                        const plankIndex = currentPosition - bridgeStart;
                        if (!planksCrossed.includes(plankIndex)) {
                          planksCrossed.push(plankIndex);
                          setCrossedPlanks([...planksCrossed]);
                        }
                      }
                      
                      if (hasCounter) {
                        currentVariables.steps = stepsTaken;
                        setVariables({...currentVariables});
                      }
                      
                      setGameMessage(`Step ${stepsTaken}: Moving forward...`);
                    }
                  } else if (loopBlock.id.includes('repair-plank')) {
                    if (currentPosition >= bridgeStart && currentPosition <= bridgeEnd) {
                      const plankIndex = currentPosition - bridgeStart;
                      if (!planksRepaired.includes(plankIndex)) {
                        planksRepaired.push(plankIndex);
                        setBridgeRepaired([...planksRepaired]);
                        setGameMessage(`Repairing plank ${plankIndex + 1}...`);
                      }
                    }
                  }
                }
              }
              
              if (stepsTaken >= 10) break;
            }
            
            setGameMessage('While Loop completed!');
          }
          break;
          
        case 'action':
          if (!inLoop) {
            if (block.id.includes('step-forward')) {
              if (currentPosition < totalPositions - 1) {
                currentPosition++;
                setWizardPosition(currentPosition);
                setGameMessage(`Single step forward to position ${currentPosition}`);
              }
            } else if (block.id.includes('celebrate')) {
              if (currentPosition >= bridgeEnd && stepsTaken >= 10) {
                setGameState('success');
                setGameMessage('🎉 Bridge crossed successfully!');
              } else {
                setGameMessage(`Bridge not fully crossed! Position: ${currentPosition}, Steps: ${stepsTaken}`);
                setGameState('error');
                setIsRunning(false);
                return;
              }
            }
          }
          break;
          
        case 'structure':
          if (block.id.includes('loop-end')) {
            inLoop = false;
            setGameMessage('Loop block ended');
          }
          break;
          
        default:
          break;
      }
    }

    setExecutionStep(-1);
    setIsRunning(false);
    
    if (currentPosition >= bridgeEnd && (stepsTaken >= 10 || loopCount >= 10)) {
      setGameState('success');
    } else {
      setGameState('error');
      setGameMessage(`Mission incomplete! Position: ${currentPosition}/${bridgeEnd}, Steps: ${Math.max(stepsTaken, loopCount)}/10`);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-800 via-gray-800 to-blue-900 relative overflow-hidden">
      {/* Background Mountain Elements */}
      <div className="fixed inset-0 z-0">
        {/* Mountain Silhouettes */}
        <div className="absolute bottom-0 left-0 w-full h-64 bg-gradient-to-t from-slate-700 to-slate-600 opacity-40" 
             style={{clipPath: 'polygon(0 100%, 20% 60%, 40% 80%, 60% 40%, 80% 70%, 100% 50%, 100% 100%)'}} />
        <div className="absolute bottom-0 right-0 w-full h-48 bg-gradient-to-t from-slate-600 to-slate-500 opacity-30"
             style={{clipPath: 'polygon(0 80%, 30% 40%, 50% 60%, 70% 30%, 90% 50%, 100% 20%, 100% 100%, 0 100%)'}} />
        
        {/* Floating Clouds */}
        <div className="absolute top-20 left-20 text-4xl opacity-60 animate-bounce" style={{animationDuration: '6s'}}>☁️</div>
        <div className="absolute top-32 right-32 text-3xl opacity-50 animate-bounce" style={{animationDuration: '8s', animationDelay: '2s'}}>☁️</div>
        <div className="absolute top-40 left-1/2 text-3xl opacity-40 animate-bounce" style={{animationDuration: '7s', animationDelay: '4s'}}>☁️</div>
        
        {/* Mystical Elements */}
        <div className="absolute top-60 left-32 text-2xl opacity-30 animate-pulse">✨</div>
        <div className="absolute top-72 right-40 text-2xl opacity-30 animate-pulse" style={{animationDelay: '2s'}}>⭐</div>
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
              <span className="text-white font-bold">Mountain Challenges - Level 7</span>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="bg-white/20 px-4 py-2 rounded-lg">
              <span className="text-white">Bridge Progress: {crossedPlanks.length}/{totalPlanks}</span>
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
            <span className="text-3xl">🌉</span>
            <span>Mission: Bridge Crossing</span>
          </h2>
          
          <div className="space-y-4 text-white">
            <div className="bg-blue-500/20 p-4 rounded-xl border border-blue-400/30">
              <h3 className="font-bold mb-2">🎯 Goal:</h3>
              <p className="text-sm">Help the wizard cross the mountain bridge by taking exactly 10 steps using For Loops!</p>
            </div>
            
            <div className="bg-purple-500/20 p-4 rounded-xl border border-purple-400/30">
              <h3 className="font-bold mb-2">🔄 Loop Concepts:</h3>
              <div className="space-y-2 text-sm">
                <div><strong>For Loop:</strong> Repeats code exactly N times</div>
                <div><strong>While Loop:</strong> Repeats while condition is true</div>
                <div><strong>Counter:</strong> Variable that tracks repetitions</div>
              </div>
            </div>
            
            <div className="bg-orange-500/20 p-4 rounded-xl border border-orange-400/30">
              <h3 className="font-bold mb-2">🌉 Bridge Challenge:</h3>
              <ul className="text-sm space-y-1">
                <li>• Bridge has 10 wooden planks</li>
                <li>• Each step crosses one plank</li>
                <li>• Use loops to repeat stepping</li>
                <li>• Repair planks while crossing</li>
                <li>• Reach the other side safely</li>
              </ul>
            </div>
            
            <div className="bg-green-500/20 p-4 rounded-xl border border-green-400/30">
              <h3 className="font-bold mb-2">💡 Strategy:</h3>
              <ul className="text-sm space-y-1">
                <li>• Create step counter variable</li>
                <li>• Use For Loop (10 times) or While Loop</li>
                <li>• Step forward in each iteration</li>
                <li>• Repair planks as you go</li>
                <li>• Celebrate when bridge is crossed!</li>
              </ul>
            </div>
          </div>

          {/* Block Toolbox */}
          <div className="mt-6">
            <h3 className="text-lg font-bold text-white mb-4">🧰 Code Blocks</h3>
            <div className="space-y-3 max-h-72 overflow-y-auto">
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

        {/* Enhanced Game World Visualization */}
        <div className="bg-white/10 backdrop-blur-sm rounded-3xl border border-white/20 p-6 flex flex-col">
          <h2 className="text-xl font-bold text-white mb-4 flex items-center space-x-2">
            <span className="text-2xl">🏔️</span>
            <span>Mountain Bridge</span>
          </h2>
          
          {/* Game Status Message */}
          {gameMessage && (
            <div className="mb-4 p-3 bg-blue-500/20 rounded-lg border border-blue-400/30">
              <div className="text-white text-sm">{gameMessage}</div>
            </div>
          )}
          
          {/* Enhanced Bridge Visualization */}
          <div className="flex-1 flex flex-col justify-center relative">
            {/* Mountain Cliff - Left Side */}
            <div className="absolute left-0 bottom-0 w-16 h-32 bg-gradient-to-t from-stone-600 to-stone-500 rounded-t-2xl">
              <div className="absolute top-2 left-2 w-2 h-2 bg-stone-400 rounded-full"></div>
              <div className="absolute top-6 right-2 w-1 h-1 bg-stone-300 rounded-full"></div>
              <div className="absolute bottom-4 left-1/2 w-3 h-8 bg-green-600 rounded-t-full"></div>
            </div>
            
            {/* Mountain Cliff - Right Side */}
            <div className="absolute right-0 bottom-0 w-16 h-36 bg-gradient-to-t from-stone-600 to-stone-500 rounded-t-2xl">
              <div className="absolute top-3 left-1 w-2 h-2 bg-stone-400 rounded-full"></div>
              <div className="absolute top-8 right-3 w-1 h-1 bg-stone-300 rounded-full"></div>
              <div className="absolute bottom-6 right-1/2 w-3 h-6 bg-green-600 rounded-t-full"></div>
            </div>
            
            {/* Bridge Structure */}
            <div className="relative mx-16 mb-4">
              {/* Bridge Support Ropes */}
              <div className="absolute -top-8 left-0 w-full h-1 bg-amber-800 rounded-full"></div>
              <div className="absolute -bottom-2 left-0 w-full h-1 bg-amber-800 rounded-full"></div>
              
              {/* Rope Supports */}
              {[...Array(totalPlanks + 1)].map((_, i) => (
                <div 
                  key={i}
                  className="absolute w-0.5 h-12 bg-amber-700"
                  style={{ left: `${(i / totalPlanks) * 100}%`, top: '-32px' }}
                ></div>
              ))}
              
              {/* Bridge Planks */}
              <div className="grid grid-cols-10 gap-1 bg-amber-900/20 p-2 rounded-lg border-2 border-amber-800/50">
                {[...Array(totalPlanks)].map((_, index) => {
                  const isCrossed = crossedPlanks.includes(index);
                  const isRepaired = bridgeRepaired.includes(index);
                  const wizardOnPlank = wizardPosition === bridgeStart + index;
                  
                  return (
                    <div
                      key={index}
                      className={`relative h-16 rounded transition-all duration-500 border-2 ${
                        wizardOnPlank
                          ? 'bg-yellow-300 border-yellow-500 shadow-lg scale-105'
                          : isCrossed
                          ? 'bg-green-300 border-green-500'
                          : isRepaired
                          ? 'bg-blue-300 border-blue-500'
                          : 'bg-amber-200 border-amber-400'
                      }`}
                    >
                      {/* Plank Wood Texture */}
                      <div className="absolute inset-1 rounded bg-gradient-to-b from-amber-100 to-amber-300 opacity-70"></div>
                      
                      {/* Wood Grain Lines */}
                      <div className="absolute top-2 left-1 right-1 h-0.5 bg-amber-600 opacity-30 rounded"></div>
                      <div className="absolute bottom-2 left-1 right-1 h-0.5 bg-amber-600 opacity-30 rounded"></div>
                      
                      {/* Plank Number */}
                      <div className="absolute inset-0 flex items-center justify-center text-xs font-bold text-amber-800">
                        {index + 1}
                      </div>
                      
                      {/* Wizard Character */}
                      {wizardOnPlank && (
                        <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 text-3xl animate-bounce">
                          🧙‍♂️
                        </div>
                      )}
                      
                      {/* Status Indicators */}
                      {isCrossed && !wizardOnPlank && (
                        <div className="absolute -top-2 -right-2 text-green-500 text-sm">✅</div>
                      )}
                      {isRepaired && (
                        <div className="absolute -bottom-2 -right-2 text-blue-500 text-sm">🔧</div>
                      )}
                      
                      {/* Plank Shadow */}
                      <div className="absolute -bottom-1 left-1 right-1 h-1 bg-black/20 rounded blur-sm"></div>
                    </div>
                  );
                })}
              </div>
              
              {/* Bridge Shadow */}
              <div className="absolute -bottom-4 left-2 right-2 h-2 bg-black/30 rounded-full blur-md"></div>
            </div>
            
            {/* River/Chasm Below */}
            <div className="absolute bottom-0 left-16 right-16 h-16 bg-gradient-to-r from-blue-600 via-blue-500 to-blue-600 rounded-lg opacity-60">
              <div className="absolute inset-0 bg-gradient-to-b from-transparent to-blue-800/50 rounded-lg"></div>
              {/* Water Ripples */}
              <div className="absolute top-2 left-4 w-8 h-1 bg-white/30 rounded-full animate-pulse"></div>
              <div className="absolute top-6 right-8 w-6 h-1 bg-white/30 rounded-full animate-pulse" style={{animationDelay: '1s'}}></div>
              <div className="absolute bottom-4 left-1/2 w-10 h-1 bg-white/30 rounded-full animate-pulse" style={{animationDelay: '2s'}}></div>
            </div>
            
            {/* Progress Indicators */}
            <div className="mt-6 grid grid-cols-2 gap-4">
              <div className="bg-blue-500/20 p-3 rounded-xl border border-blue-400/30">
                <h4 className="text-white font-bold text-sm mb-1">Bridge Progress</h4>
                <div className="flex items-center space-x-2">
                  <div className="flex-1 bg-white/20 rounded-full h-2">
                    <div 
                      className="bg-green-500 h-2 rounded-full transition-all duration-500"
                      style={{ width: `${(crossedPlanks.length / totalPlanks) * 100}%` }}
                    ></div>
                  </div>
                  <span className="text-white text-xs">{crossedPlanks.length}/{totalPlanks}</span>
                </div>
              </div>
              
              <div className="bg-orange-500/20 p-3 rounded-xl border border-orange-400/30">
                <h4 className="text-white font-bold text-sm mb-1">Repairs Made</h4>
                <div className="flex items-center space-x-2">
                  <div className="flex-1 bg-white/20 rounded-full h-2">
                    <div 
                      className="bg-blue-500 h-2 rounded-full transition-all duration-500"
                      style={{ width: `${(bridgeRepaired.length / totalPlanks) * 100}%` }}
                    ></div>
                  </div>
                  <span className="text-white text-xs">{bridgeRepaired.length}/{totalPlanks}</span>
                </div>
              </div>
            </div>
          </div>
          
          {/* Variables Display */}
          <div className="mt-4 bg-purple-500/20 p-4 rounded-xl border border-purple-400/30">
            <h3 className="text-white font-bold mb-2">📊 Loop Variables:</h3>
            <div className="text-white space-y-1 text-sm">
              {variables.steps !== undefined ? (
                <div className="font-mono bg-black/30 px-2 py-1 rounded">
                  steps = {variables.steps}
                </div>
              ) : (
                <div className="text-white/60">No step counter</div>
              )}
              {variables.goal !== undefined ? (
                <div className="font-mono bg-black/30 px-2 py-1 rounded">
                  goal = {variables.goal}
                </div>
              ) : (
                <div className="text-white/60">No goal set</div>
              )}
            </div>
          </div>
          
          {/* Game Status */}
          {gameState === 'success' && (
            <div className="mt-4 bg-green-500/20 p-4 rounded-xl border border-green-400/30 text-center">
              <div className="text-4xl mb-2">🎉</div>
              <div className="text-white font-bold">Bridge Crossed Successfully!</div>
              <div className="text-green-200 text-sm">Perfect loop execution - 10 steps taken!</div>
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
              <div className="text-white font-bold">Bridge Crossing Failed!</div>
              <div className="text-red-200 text-sm">{gameMessage}</div>
            </div>
          )}
        </div>

        {/* Code Area */}
        <div className="bg-white/10 backdrop-blur-sm rounded-3xl border border-white/20 p-6 flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-white flex items-center space-x-2">
              <span className="text-2xl">🔄</span>
              <span>Loop Logic</span>
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
                <span>{isRunning ? 'Crossing...' : 'Cross Bridge'}</span>
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
                  <div className="text-4xl mb-2">🌉</div>
                  <div>Drag blocks to create your loop logic!</div>
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
          
          {/* Loop Logic Helper */}
          <div className="mt-4 bg-purple-500/20 p-3 rounded-xl border border-purple-400/30">
            <div className="text-white/80 text-xs mb-2">🔄 Loop Examples:</div>
            <div className="text-purple-200 text-sm space-y-1">
              <div><strong>For Loop:</strong> for (let i = 0; i &lt; 10; i++)</div>
              <div><strong>While Loop:</strong> while (steps &lt; 10)</div>
              <div><strong>Pattern:</strong> Loop → Action → Increment → Repeat</div>
            </div>
          </div>
          
          {/* Code Preview */}
          <div className="mt-4 bg-black/30 p-3 rounded-xl">
            <div className="text-white/60 text-xs mb-2">Generated Code:</div>
            <div className="text-green-300 font-mono text-sm max-h-32 overflow-y-auto">
              {codeBlocks.length === 0 ? (
                <span className="text-white/40">// Your loop code will appear here</span>
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

export default LevelSevenGame;