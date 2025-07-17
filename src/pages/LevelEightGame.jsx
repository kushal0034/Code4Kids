import { useState, useEffect } from 'react';
import { Sparkles, Play, RotateCcw, CheckCircle, Star, Home, ArrowLeft, Zap, Trophy, Clock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { progressService } from '../services/progressService';

const LevelEightGame = () => {
  const navigate = useNavigate();
  const [draggedBlock, setDraggedBlock] = useState(null);
  const [codeBlocks, setCodeBlocks] = useState([]);
  const [gameState, setGameState] = useState('playing');
  const [isRunning, setIsRunning] = useState(false);
  const [wizardPosition, setWizardPosition] = useState(0);
  const [executionStep, setExecutionStep] = useState(-1);
  const [gameMessage, setGameMessage] = useState('');
  const [rocks, setRocks] = useState([]);
  const [clearedRocks, setClearedRocks] = useState([]);
  const [currentAction, setCurrentAction] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [levelResults, setLevelResults] = useState(null);
  const [user, setUser] = useState(null);

  // Simple path: positions 0-12, rocks at 3, 6, 9
  const pathEnd = 12;
  
  useEffect(() => {
    const initialRocks = [
      { id: 1, position: 3, type: 'rock' },
      { id: 2, position: 6, type: 'rock' },
      { id: 3, position: 9, type: 'rock' }
    ];
    setRocks(initialRocks);
  }, []);

  const availableBlocks = [
    {
      id: 'for-loop-start',
      type: 'loop',
      text: 'For Loop (12 times)',
      color: 'from-purple-500 to-purple-600',
      code: 'for (let i = 0; i < 12; i++)',
      description: 'Repeat actions 12 times',
      icon: '🔄'
    },
    {
      id: 'move-forward',
      type: 'action',
      text: 'Move Forward',
      color: 'from-green-500 to-green-600',
      code: 'wizard.moveForward()',
      description: 'Move to next position',
      icon: '➡️'
    },
    {
      id: 'check-rock',
      type: 'condition',
      text: 'If Rock Here',
      color: 'from-orange-500 to-orange-600',
      code: 'if (rockHere)',
      description: 'Check if rock at current position',
      icon: '❓'
    },
    {
      id: 'blast-rock',
      type: 'action',
      text: 'Blast Rock',
      color: 'from-red-500 to-red-600',
      code: 'wizard.blastRock()',
      description: 'Destroy rock at current position',
      icon: '💥'
    },
    {
      id: 'end-for-loop',
      type: 'loop-end',
      text: 'End For Loop',
      color: 'from-purple-600 to-purple-700',
      code: '}',
      description: 'Closes the for loop',
      icon: '🔚'
    },
    {
      id: 'celebrate',
      type: 'action',
      text: 'Celebrate!',
      color: 'from-pink-500 to-pink-600',
      code: 'wizard.celebrate()',
      description: 'Victory celebration',
      icon: '🎉'
    }
  ];

  useEffect(() => {
    const userData = progressService.getCurrentUser();
    if (!userData) {
      navigate('/login');
    } else {
      setUser(userData);
    }
  }, [navigate]);

  const calculateStars = (timeSpent, codeBlockCount) => {
    let stars = 1;
    if (timeSpent < 60000) stars++;
    if (codeBlockCount <= 15) stars++;
    return Math.min(stars, 3);
  };

  const saveProgress = async (success, timeSpent = 0) => {
    if (!user) return;
    setIsLoading(true);
    
    try {
      const stars = success ? calculateStars(timeSpent, codeBlocks.length) : 0;
      const result = await progressService.recordLevelAttempt(8, success, stars, timeSpent, codeBlocks);

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

  const formatTime = (ms) => {
    const seconds = Math.floor(ms / 1000);
    return `${seconds}s`;
  };

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
    setWizardPosition(0);
    setClearedRocks([]);
    setGameState('playing');
    setIsRunning(false);
    setExecutionStep(-1);
    setGameMessage('Ready to clear the path!');
    setCurrentAction('');
    
    const initialRocks = [
      { id: 1, position: 3, type: 'rock' },
      { id: 2, position: 6, type: 'rock' },
      { id: 3, position: 9, type: 'rock' }
    ];
    setRocks(initialRocks);
  };

  const runCode = async () => {
    if (codeBlocks.length === 0) {
      setGameMessage('Please add some code blocks first!');
      return;
    }

    const startTime = Date.now();
    setIsRunning(true);
    setGameState('playing');
    resetGame();
    
    let currentPosition = 0;
    let cleared = [];

    for (let i = 0; i < codeBlocks.length; i++) {
      setExecutionStep(i);
      setCurrentAction(codeBlocks[i].text);
      
      const block = codeBlocks[i];
      await new Promise(resolve => setTimeout(resolve, 800));

      if (block.id.includes('for-loop-start')) {
        setGameMessage('🔄 Starting For Loop - will repeat 12 times...');
        
        // Execute the for loop 12 times
        for (let loopCount = 0; loopCount < 12; loopCount++) {
          setGameMessage(`🔄 For Loop iteration ${loopCount + 1}/12`);
          
          // Execute all blocks inside the loop
          for (let j = i + 1; j < codeBlocks.length; j++) {
            const loopBlock = codeBlocks[j];
            
            // Stop if we hit End For Loop or celebration
            if (loopBlock.id.includes('end-for-loop') || loopBlock.id.includes('celebrate')) {
              break;
            }
            
            setCurrentAction(loopBlock.text);
            await new Promise(resolve => setTimeout(resolve, 600));
            
            if (loopBlock.id.includes('move-forward')) {
              if (currentPosition < pathEnd) {
                currentPosition++;
                setWizardPosition(currentPosition);
                setGameMessage(`🚶‍♂️ Moving to position ${currentPosition} (Loop ${loopCount + 1}/12)`);
              } else {
                setGameMessage('🚫 Already at the end!');
              }
            } 
            else if (loopBlock.id.includes('check-rock')) {
              const rockHere = rocks.find(rock => 
                rock.position === currentPosition && !cleared.includes(rock.id)
              );
              setGameMessage(`❓ Checking position ${currentPosition}... ${rockHere ? 'Rock found! 🪨' : 'No rock here ✅'}`);
            }
            else if (loopBlock.id.includes('blast-rock')) {
              const rockHere = rocks.find(rock => 
                rock.position === currentPosition && !cleared.includes(rock.id)
              );
              
              if (rockHere) {
                cleared.push(rockHere.id);
                setClearedRocks([...cleared]);
                setGameMessage(`💥 BOOM! Rock destroyed at position ${currentPosition}!`);
              } else {
                setGameMessage('💥 Blast missed - no rock here!');
              }
            }
          }
        }
        
        setGameMessage('✅ For Loop completed - 12 iterations done!');
        
        // Skip to after the end-for-loop block
        while (i < codeBlocks.length && !codeBlocks[i].id.includes('end-for-loop')) {
          i++;
        }
      }
      else if (block.id.includes('celebrate')) {
        const allRocksCleared = cleared.length === rocks.length;
        const atEnd = currentPosition >= pathEnd;
        
        if (allRocksCleared && atEnd) {
          const endTime = Date.now();
          const timeSpent = endTime - startTime;
          
          setGameState('success');
          setGameMessage('🎉 Perfect! All rocks cleared and reached the end!');
          
          setExecutionStep(-1);
          setIsRunning(false);
          setCurrentAction('');
          await saveProgress(true, timeSpent);
          return;
        } else {
          setGameMessage(`❌ Not ready to celebrate! Rocks cleared: ${cleared.length}/${rocks.length}, Position: ${currentPosition}/${pathEnd}`);
        }
      }
    }

    setExecutionStep(-1);
    setIsRunning(false);
    setCurrentAction('');
    
    const allRocksCleared = cleared.length === rocks.length;
    const atEnd = currentPosition >= pathEnd;
    
    if (allRocksCleared && atEnd) {
      const endTime = Date.now();
      const timeSpent = endTime - startTime;
      setGameState('success');
      await saveProgress(true, timeSpent);
    } else {
      setGameState('error');
      setGameMessage(`❌ Mission incomplete! Rocks: ${cleared.length}/${rocks.length}, Position: ${currentPosition}/${pathEnd}`);
      await saveProgress(false);
    }
  };

  const getPositionColor = (index) => {
    const rock = rocks.find(r => r.position === index);
    const isCleared = rock && clearedRocks.includes(rock.id);
    const wizardHere = wizardPosition === index;
    
    if (wizardHere) return 'bg-yellow-400/40 border-yellow-400';
    if (isCleared) return 'bg-green-400/30 border-green-400';
    if (rock && !isCleared) return 'bg-red-400/30 border-red-400';
    if (index === pathEnd) return 'bg-purple-400/30 border-purple-400';
    return 'bg-blue-400/20 border-blue-400';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-stone-800 via-gray-700 to-slate-900 relative overflow-hidden">
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
              <span className="text-white font-bold">Mountain Path - Level 8</span>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="bg-white/20 px-4 py-2 rounded-lg">
              <span className="text-white">Progress: {clearedRocks.length}/{rocks.length} rocks cleared</span>
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
            <span className="text-3xl">🎯</span>
            <span>Mission: Simple Path</span>
          </h2>
          
          <div className="space-y-4 text-white">
            <div className="bg-blue-500/20 p-4 rounded-xl border border-blue-400/30">
              <h3 className="font-bold mb-2">🎯 Goal:</h3>
              <p className="text-sm">Move through the path, blast the 3 rocks, and reach position 12!</p>
            </div>
            
            <div className="bg-green-500/20 p-4 rounded-xl border border-green-400/30">
              <h3 className="font-bold mb-2">📋 For Loop Strategy:</h3>
              <ul className="text-sm space-y-1">
                <li>• Use "For Loop (12 times)" to repeat</li>
                <li>• Inside loop: Move Forward</li>
                <li>• Inside loop: If Rock Here, then Blast Rock</li>
                <li>• Close with "End For Loop"</li>
                <li>• Finish with "Celebrate!"</li>
              </ul>
            </div>
          </div>

          {/* Block Toolbox */}
          <div className="mt-6">
            <h3 className="text-lg font-bold text-white mb-4">🧰 Code Blocks</h3>
            <div className="space-y-3">
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

        {/* Game World */}
        <div className="bg-white/10 backdrop-blur-sm rounded-3xl border border-white/20 p-6 flex flex-col">
          <h2 className="text-xl font-bold text-white mb-4 flex items-center space-x-2">
            <span className="text-2xl">🛤️</span>
            <span>Mountain Path</span>
            {isRunning && (
              <div className="ml-4 flex items-center space-x-2 text-yellow-300">
                <div className="animate-spin w-4 h-4 border-2 border-yellow-300 border-t-transparent rounded-full"></div>
                <span className="text-sm">Running...</span>
              </div>
            )}
          </h2>
          
          {/* Current Action */}
          {currentAction && (
            <div className="mb-4 p-3 bg-gradient-to-r from-purple-500/20 to-blue-500/20 rounded-lg border border-purple-400/30">
              <div className="text-white text-sm font-semibold flex items-center space-x-2">
                <Zap className="w-4 h-4 text-yellow-400" />
                <span>Action: {currentAction}</span>
              </div>
            </div>
          )}
          
          {/* Game Message */}
          {gameMessage && (
            <div className="mb-4 p-3 bg-stone-500/20 rounded-lg border border-stone-400/30">
              <div className="text-white text-sm">{gameMessage}</div>
            </div>
          )}
          
          {/* Path Grid */}
          <div className="flex-1 flex flex-col justify-center">
            <div className="bg-gradient-to-r from-stone-700 via-stone-600 to-stone-700 rounded-xl border-4 border-stone-800 shadow-2xl p-4">
              <div className="grid grid-cols-7 gap-2 mb-4">
                {[...Array(7)].map((_, index) => {
                  const position = index;
                  const rock = rocks.find(r => r.position === position);
                  const isCleared = rock && clearedRocks.includes(rock.id);
                  const wizardHere = wizardPosition === position;
                  
                  return (
                    <div
                      key={position}
                      className={`relative aspect-square rounded-lg border-2 transition-all duration-300 ${getPositionColor(position)} flex items-center justify-center`}
                    >
                      <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 text-xs text-white/60">
                        {position}
                      </div>
                      
                      {rock && !isCleared && <div className="text-2xl">🪨</div>}
                      {rock && isCleared && <div className="text-green-400 text-2xl">✨</div>}
                      {wizardHere && (
                        <div className="absolute -top-8 left-1/2 transform -translate-x-1/2">
                          <div className="text-3xl animate-bounce">🧙‍♂️</div>
                        </div>
                      )}
                      {position === 0 && !wizardHere && (
                        <div className="text-green-400 text-sm">START</div>
                      )}
                    </div>
                  );
                })}
              </div>
              
              <div className="grid grid-cols-6 gap-2">
                {[...Array(6)].map((_, index) => {
                  const position = index + 7;
                  const rock = rocks.find(r => r.position === position);
                  const isCleared = rock && clearedRocks.includes(rock.id);
                  const wizardHere = wizardPosition === position;
                  
                  return (
                    <div
                      key={position}
                      className={`relative aspect-square rounded-lg border-2 transition-all duration-300 ${getPositionColor(position)} flex items-center justify-center`}
                    >
                      <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 text-xs text-white/60">
                        {position}
                      </div>
                      
                      {rock && !isCleared && <div className="text-2xl">🪨</div>}
                      {rock && isCleared && <div className="text-green-400 text-2xl">✨</div>}
                      {wizardHere && (
                        <div className="absolute -top-8 left-1/2 transform -translate-x-1/2">
                          <div className="text-3xl animate-bounce">🧙‍♂️</div>
                        </div>
                      )}
                      {position === pathEnd && (
                        <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 text-yellow-400 text-xs font-bold">
                          🏁 GOAL
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
            
            {/* Status */}
            <div className="mt-4 grid grid-cols-2 gap-4">
              <div className="bg-blue-500/20 p-3 rounded-xl border border-blue-400/30">
                <div className="text-white font-bold text-sm mb-2">📍 Position</div>
                <div className="text-blue-300 text-xl font-mono">{wizardPosition}/{pathEnd}</div>
              </div>
              <div className="bg-red-500/20 p-3 rounded-xl border border-red-400/30">
                <div className="text-white font-bold text-sm mb-2">🪨 Rocks</div>
                <div className="text-red-300 text-xl font-mono">{clearedRocks.length}/{rocks.length}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Code Area */}
        <div className="bg-white/10 backdrop-blur-sm rounded-3xl border border-white/20 p-6 flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-white flex items-center space-x-2">
              <span className="text-2xl">📝</span>
              <span>Your Code</span>
            </h2>
            <div className="flex space-x-2">
              <button
                onClick={clearCode}
                className="p-2 bg-red-500/20 text-red-300 rounded-lg hover:bg-red-500/30 transition-colors border border-red-500/50"
                disabled={isRunning}
              >
                <RotateCcw className="w-4 h-4" />
              </button>
              <button
                onClick={runCode}
                disabled={isRunning || codeBlocks.length === 0}
                className="px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-lg hover:scale-105 transition-transform disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
              >
                <Play className="w-4 h-4" />
                <span>{isRunning ? 'Running...' : 'Run Code'}</span>
              </button>
            </div>
          </div>
          
          {/* Drop Zone */}
          <div
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            className="flex-1 border-2 border-dashed border-white/30 rounded-xl p-4 min-h-32 overflow-y-auto bg-black/10"
          >
            {codeBlocks.length === 0 ? (
              <div className="flex items-center justify-center h-full text-white/60 text-center">
                <div>
                  <div className="text-4xl mb-2">🎯</div>
                  <div className="text-lg mb-2">Drag blocks here!</div>
                  <div className="text-sm">Build your path-clearing sequence</div>
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
                      <div className="flex items-center space-x-2">
                        <span className="text-lg">{block.icon}</span>
                        <div>
                          <div className="font-bold text-sm">{block.text}</div>
                          <div className="text-xs opacity-80 font-mono">{block.code}</div>
                        </div>
                      </div>
                      <button
                        onClick={() => removeBlock(block.uniqueId)}
                        className="opacity-0 group-hover:opacity-100 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs transition-opacity"
                        disabled={isRunning}
                      >
                        ×
                      </button>
                    </div>
                    
                    <div className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-3 w-6 h-6 bg-white rounded-full text-xs flex items-center justify-center text-gray-800 font-bold">
                      {index + 1}
                    </div>
                    
                    {executionStep === index && (
                      <div className="absolute -top-2 -right-2 w-4 h-4 bg-yellow-400 rounded-full animate-pulse"></div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
          
          {/* Hint */}
          <div className="mt-4 bg-yellow-500/20 p-3 rounded-xl border border-yellow-400/30">
            <div className="text-yellow-200 text-sm">
              <strong>💡 Winning sequence:</strong><br/>
              1. For Loop (12 times)<br/>
              2. Move Forward<br/>
              3. If Rock Here<br/>
              4. Blast Rock<br/>
              5. End For Loop<br/>
              6. Celebrate!
            </div>
          </div>
        </div>
      </div>

      {/* Results Modal */}
      {showResults && levelResults && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-gradient-to-br from-slate-900 to-gray-900 rounded-3xl p-8 max-w-md w-full border-2 border-yellow-400/50 shadow-2xl">
            <div className="text-center">
              <div className="text-6xl mb-4">🎉</div>
              <h2 className="text-3xl font-bold text-white mb-2">Level 8 Complete!</h2>
              <p className="text-gray-200 mb-6">Path cleared successfully!</p>
              
              <div className="mb-6">
                <div className="text-white font-bold mb-2">Performance:</div>
                <StarDisplay count={levelResults.stars} size="w-8 h-8" />
              </div>
              
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-white/10 rounded-xl p-4">
                  <div className="flex items-center justify-center space-x-2 text-blue-300">
                    <Clock className="w-4 h-4" />
                    <span className="text-sm">Time</span>
                  </div>
                  <div className="text-white font-bold">{formatTime(levelResults.timeSpent)}</div>
                </div>
                <div className="bg-white/10 rounded-xl p-4">
                  <div className="flex items-center justify-center space-x-2 text-purple-300">
                    <Sparkles className="w-4 h-4" />
                    <span className="text-sm">Blocks</span>
                  </div>
                  <div className="text-white font-bold">{levelResults.codeBlocks}</div>
                </div>
              </div>
              
              <div className="flex space-x-4">
                <button
                  onClick={() => {
                    setShowResults(false);
                    resetGame();
                  }}
                  className="flex-1 py-3 bg-gradient-to-r from-slate-500 to-gray-500 text-white rounded-xl font-bold hover:scale-105 transition-transform"
                >
                  Play Again
                </button>
                <button
                  onClick={() => navigate('/worlds')}
                  className="flex-1 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl font-bold hover:scale-105 transition-transform"
                >
                  Continue Journey
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Loading */}
      {isLoading && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 text-center">
            <div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <div className="text-white">Saving progress...</div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LevelEightGame;