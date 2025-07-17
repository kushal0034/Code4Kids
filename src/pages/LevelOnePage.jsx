import React, { useState, useEffect } from 'react';
import { Sparkles, Play, RotateCcw, CheckCircle, Star, Home, ArrowLeft, Trophy, Clock, ChevronDown, ChevronUp, Info, Target, Zap } from 'lucide-react';
import { progressService } from '../services/progressService';

const LevelOnePage = () => {
  const [draggedBlock, setDraggedBlock] = useState(null);
  const [codeBlocks, setCodeBlocks] = useState([]);
  const [appleCount, setAppleCount] = useState(0);
  const [gameState, setGameState] = useState('playing'); // 'playing', 'success', 'error'
  const [isRunning, setIsRunning] = useState(false);
  const [wizardPosition, setWizardPosition] = useState(0);
  const [collectedApples, setCollectedApples] = useState([]);
  const [executionStep, setExecutionStep] = useState(-1);
  const [startTime, setStartTime] = useState(null);
  const [endTime, setEndTime] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [levelResults, setLevelResults] = useState(null);
  const [user, setUser] = useState(null);
  const [showHint, setShowHint] = useState(false);
  const [instructionsCollapsed, setInstructionsCollapsed] = useState(false);
  const [toolboxCollapsed, setToolboxCollapsed] = useState(false);

  // Get current user on component mount
  useEffect(() => {
    const userData = progressService.getCurrentUser();
    if (!userData) {
      window.location.href = '/login';
    } else {
      setUser(userData);
    }
  }, []);

  const availableBlocks = [
    {
      id: 'variable-create',
      type: 'variable',
      text: 'Create Variable',
      color: 'from-blue-500 to-blue-600',
      code: 'let apples = 0',
      description: 'Creates a counter to track apples',
      order: 1
    },
    {
      id: 'move-forward',
      type: 'movement',
      text: 'Move Forward',
      color: 'from-purple-500 to-purple-600',
      code: 'wizard.move()',
      description: 'Moves wizard to next position',
      order: 2
    },
    {
      id: 'collect-apple',
      type: 'action',
      text: 'Collect Apple',
      color: 'from-green-500 to-green-600',
      code: 'apples = apples + 1',
      description: 'Picks up one apple and adds to counter',
      order: 3
    },
    {
      id: 'check-count',
      type: 'condition',
      text: 'Check if apples = 5',
      color: 'from-orange-500 to-orange-600',
      code: 'if (apples === 5)',
      description: 'Checks if we collected exactly 5 apples',
      order: 4
    },
    {
      id: 'celebrate',
      type: 'action',
      text: 'Celebrate!',
      color: 'from-pink-500 to-pink-600',
      code: 'wizard.celebrate()',
      description: 'Victory celebration',
      order: 5
    }
  ];

  const applePositions = [1, 2, 3, 4, 5]; // Positions where apples are located
  const totalPositions = 7;

  const correctOrder = [
    'Create Variable', 
    'Move Forward', 
    'Collect Apple', 
    'Move Forward', 
    'Collect Apple', 
    'Move Forward', 
    'Collect Apple', 
    'Move Forward', 
    'Collect Apple', 
    'Move Forward', 
    'Collect Apple', 
    'Check if apples = 5', 
    'Celebrate!'
  ];

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
    setAppleCount(0);
    setWizardPosition(0);
    setCollectedApples([]);
    setGameState('playing');
    setIsRunning(false);
    setExecutionStep(-1);
    setStartTime(null);
    setEndTime(null);
    setShowResults(false);
    setLevelResults(null);
  };

  const calculateStars = (timeSpent, codeBlockCount) => {
    let stars = 1; // Base star for completion
    
    // Time bonus (under 30 seconds = extra star)
    if (timeSpent < 30000) {
      stars++;
    }
    
    // Efficiency bonus (under 8 blocks = extra star)
    if (codeBlockCount <= 7) {
      stars++;
    }
    
    return Math.min(stars, 3);
  };

  const saveProgress = async (success, timeSpent = 0) => {
    if (!user) return;

    setIsLoading(true);
    
    try {
      const stars = success ? calculateStars(timeSpent, codeBlocks.length) : 0;
      
      const result = await progressService.recordLevelAttempt(
        1, // Level 1
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

  const runCode = async () => {
    if (codeBlocks.length === 0) return;
    
    setIsRunning(true);
    setGameState('playing');
    setStartTime(Date.now());
    
    // Reset game state
    let currentApples = 0;
    let currentPosition = 0;
    let collectedApplesTemp = [];
    setAppleCount(0);
    setWizardPosition(0);
    setCollectedApples([]);

    for (let i = 0; i < codeBlocks.length; i++) {
      setExecutionStep(i);
      
      const block = codeBlocks[i];
      await new Promise(resolve => setTimeout(resolve, 1000));

      switch (block.type) {
        case 'variable':
          currentApples = 0;
          setAppleCount(currentApples);
          break;
          
        case 'movement':
          if (currentPosition < totalPositions - 1) {
            currentPosition++;
            setWizardPosition(currentPosition);
          }
          break;
          
        case 'action':
          if (block.id.includes('collect-apple')) {
            if (applePositions.includes(currentPosition) && !collectedApplesTemp.includes(currentPosition)) {
              currentApples++;
              collectedApplesTemp.push(currentPosition);
              setAppleCount(currentApples);
              setCollectedApples([...collectedApplesTemp]);
            }
          } else if (block.id.includes('celebrate')) {
            if (currentApples === 5) {
              const endTime = Date.now();
              setEndTime(endTime);
              const timeSpent = endTime - startTime;
              
              setGameState('success');
              setIsRunning(false);
              setExecutionStep(-1);
              
              // Save progress to database
              await saveProgress(true, timeSpent);
              return;
            }
          }
          break;
          
        case 'condition':
          if (currentApples !== 5) {
            setGameState('error');
            setIsRunning(false);
            setExecutionStep(-1);
            await saveProgress(false);
            return;
          }
          break;
      }
    }
    
    setIsRunning(false);
    setExecutionStep(-1);
    
    if (currentApples === 5) {
      setGameState('success');
      const endTime = Date.now();
      setEndTime(endTime);
      const timeSpent = endTime - startTime;
      await saveProgress(true, timeSpent);
    } else {
      setGameState('error');
      await saveProgress(false);
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
          className={`${size} ${
            i < count 
              ? 'text-yellow-400 fill-current' 
              : 'text-white/30'
          }`}
        />
      ))}
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-800 via-green-700 to-emerald-800 relative overflow-hidden">
      {/* Animated background particles */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 2}s`,
              animationDuration: `${2 + Math.random() * 2}s`
            }}
          >
            <Sparkles className="w-4 h-4 text-yellow-300/30" />
          </div>
        ))}
      </div>

      {/* Loading Overlay */}
      {isLoading && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center">
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 text-center">
            <div className="w-12 h-12 border-4 border-white border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <div className="text-white font-bold">Saving Progress...</div>
          </div>
        </div>
      )}

      {/* Results Modal */}
      {showResults && levelResults && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-gradient-to-br from-green-600 to-emerald-700 rounded-3xl p-8 max-w-md w-full text-white text-center shadow-2xl">
            <div className="text-6xl mb-4">🎉</div>
            <h2 className="text-3xl font-bold mb-4">Level Complete!</h2>
            
            <div className="space-y-4 mb-6">
              <div className="flex items-center justify-center">
                <StarDisplay count={levelResults.stars} size="w-8 h-8" />
              </div>
              
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="bg-white/10 rounded-lg p-3">
                  <Clock className="w-5 h-5 mx-auto mb-1" />
                  <div className="font-bold">{formatTime(levelResults.timeSpent)}</div>
                  <div className="opacity-80">Time</div>
                </div>
                <div className="bg-white/10 rounded-lg p-3">
                  <div className="text-2xl mb-1">🧩</div>
                  <div className="font-bold">{levelResults.codeBlocks}</div>
                  <div className="opacity-80">Blocks Used</div>
                </div>
              </div>
              
              {levelResults.newAchievements.length > 0 && (
                <div className="bg-yellow-500/20 border border-yellow-400/50 rounded-lg p-3">
                  <div className="font-bold mb-2">🏆 New Achievements!</div>
                  {levelResults.newAchievements.map((achievement, index) => (
                    <div key={index} className="text-sm">
                      {achievement.icon} {achievement.name}
                    </div>
                  ))}
                </div>
              )}
            </div>
            
            <div className="flex space-x-3">
              <button
                onClick={() => setShowResults(false)}
                className="flex-1 bg-white/20 hover:bg-white/30 py-3 rounded-lg transition-colors"
              >
                Continue
              </button>
              <button
                onClick={() => window.location.href = '/worlds'}
                className="flex-1 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 py-3 rounded-lg transition-colors"
              >
                Return to Worlds
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="relative z-10 bg-black/20 backdrop-blur-sm border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => window.location.href = '/worlds'}
                className="text-white/80 hover:text-white transition-colors"
              >
                <ArrowLeft className="w-6 h-6" />
              </button>
              <div>
                <h1 className="text-2xl font-bold text-white">Level 1: Apple Collection</h1>
                <p className="text-green-200">Village Basics • Variables</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="bg-white/10 rounded-lg px-3 py-1">
                <span className="text-white text-sm">🍎 {appleCount}/5</span>
              </div>
              <button
                onClick={() => window.location.href = '/student-dashboard'}
                className="text-white/80 hover:text-white transition-colors"
              >
                <Home className="w-6 h-6" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto p-6 grid grid-cols-1 lg:grid-cols-12 gap-6 h-[calc(100vh-100px)]">
        
        {/* Instructions Panel */}
        <div className="lg:col-span-3 bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20 p-4 flex flex-col max-h-full">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-white flex items-center space-x-2">
              <span className="text-2xl">📚</span>
              <span>Instructions</span>
            </h2>
            <button
              onClick={() => setInstructionsCollapsed(!instructionsCollapsed)}
              className="text-white/80 hover:text-white transition-colors"
            >
              {instructionsCollapsed ? <ChevronDown className="w-5 h-5" /> : <ChevronUp className="w-5 h-5" />}
            </button>
          </div>
          
          <div className={`space-y-3 text-white overflow-y-auto flex-1 pr-2 ${instructionsCollapsed ? 'hidden' : ''}`} style={{ maxHeight: '400px' }}>
            <div className="bg-blue-500/20 p-3 rounded-lg border border-blue-400/30">
              <h3 className="font-bold mb-2 flex items-center space-x-2">
                <Target className="w-4 h-4" />
                <span>Goal</span>
              </h3>
              <p className="text-sm">Help the wizard collect exactly 5 apples using programming blocks!</p>
            </div>
            
            <div className="bg-purple-500/20 p-3 rounded-lg border border-purple-400/30">
              <h3 className="font-bold mb-2 flex items-center space-x-2">
                <Info className="w-4 h-4" />
                <span>How to Play</span>
              </h3>
              <ul className="text-sm space-y-1">
                <li>• Drag blocks from the toolbox</li>
                <li>• Drop them in the code area</li>
                <li>• Arrange blocks in the right order</li>
                <li>• Click "Run Code" to execute</li>
              </ul>
            </div>
            
            <div className="bg-green-500/20 p-3 rounded-lg border border-green-400/30">
              <h3 className="font-bold mb-2 flex items-center space-x-2">
                <Zap className="w-4 h-4" />
                <span>Star Scoring</span>
              </h3>
              <ul className="text-sm space-y-1">
                <li>• 1 ⭐: Complete the level</li>
                <li>• 2 ⭐: Complete in under 30 seconds</li>
                <li>• 3 ⭐: Use 7 or fewer blocks</li>
              </ul>
            </div>

            <button
              onClick={() => setShowHint(!showHint)}
              className="w-full bg-yellow-500/20 p-3 rounded-lg border border-yellow-400/30 hover:bg-yellow-500/30 transition-colors"
            >
              <div className="font-bold text-yellow-300">💡 {showHint ? 'Hide' : 'Show'} Hint</div>
            </button>
            
            {showHint && (
              <div className="bg-yellow-500/20 p-3 rounded-lg border border-yellow-400/30 animate-fadeIn">
                <p className="text-sm text-yellow-200">
                  <strong>Correct Order:</strong><br />
                  {correctOrder.map((step, index) => (
                    <span key={index} className="block text-xs">
                      {index + 1}. {step}
                    </span>
                  ))}
                </p>
              </div>
            )}
          </div>

          {/* Block Toolbox */}
          <div className="mt-4 border-t border-white/20 pt-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-lg font-bold text-white">🧰 Code Blocks</h3>
              <button
                onClick={() => setToolboxCollapsed(!toolboxCollapsed)}
                className="text-white/80 hover:text-white transition-colors"
              >
                {toolboxCollapsed ? <ChevronDown className="w-5 h-5" /> : <ChevronUp className="w-5 h-5" />}
              </button>
            </div>
            
            <div className={`space-y-2 max-h-48 overflow-y-auto pr-2 ${toolboxCollapsed ? 'hidden' : ''}`}>
              {availableBlocks.map((block) => (
                <div
                  key={block.id}
                  draggable
                  onDragStart={(e) => handleDragStart(e, block)}
                  className={`p-3 bg-gradient-to-r ${block.color} text-white rounded-lg cursor-grab active:cursor-grabbing hover:scale-105 transition-transform shadow-lg`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="font-bold text-sm">{block.text}</div>
                      <div className="text-xs opacity-80 mt-1">{block.description}</div>
                    </div>
                    <div className="bg-white/20 rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">
                      {block.order}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Game World */}
        <div className="lg:col-span-5 bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20 p-4 flex flex-col max-h-full">
          <h2 className="text-xl font-bold text-white mb-4 flex items-center space-x-2">
            <span className="text-2xl">🌍</span>
            <span>Village Path</span>
          </h2>
          
          {/* Game Path */}
          <div className="flex-1 flex flex-col justify-center overflow-y-auto pr-2" style={{ maxHeight: '500px' }}>
            <div className="grid grid-cols-7 gap-2 mb-6">
              {[...Array(totalPositions)].map((_, index) => (
                <div key={index} className="relative">
                  {/* Path Tile */}
                  <div className={`w-16 h-16 rounded-lg border-2 transition-all duration-500 ${
                    wizardPosition === index 
                      ? 'bg-yellow-300/30 border-yellow-400 shadow-lg' 
                      : 'bg-green-400/20 border-green-500/50'
                  }`}>
                    {/* Apple */}
                    {applePositions.includes(index) && !collectedApples.includes(index) && (
                      <div className="absolute inset-0 flex items-center justify-center text-2xl animate-bounce">
                        🍎
                      </div>
                    )}
                    
                    {/* Wizard */}
                    {wizardPosition === index && (
                      <div className="absolute inset-0 flex items-center justify-center text-3xl animate-pulse">
                        🧙‍♂️
                      </div>
                    )}
                    
                    {/* Collected Apple Indicator */}
                    {collectedApples.includes(index) && (
                      <div className="absolute inset-0 flex items-center justify-center text-lg opacity-50">
                        ✨
                      </div>
                    )}
                  </div>
                  
                  {/* Position Number */}
                  <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 text-white/60 text-xs">
                    {index}
                  </div>
                </div>
              ))}
            </div>
            
            {/* Game Status */}
            <div className="text-center mb-4">
              <div className={`inline-block px-4 py-2 rounded-full text-sm font-bold ${
                gameState === 'success' 
                  ? 'bg-green-500/20 text-green-300 border border-green-400/50' 
                  : gameState === 'error' 
                  ? 'bg-red-500/20 text-red-300 border border-red-400/50' 
                  : 'bg-blue-500/20 text-blue-300 border border-blue-400/50'
              }`}>
                {gameState === 'success' && '🎉 Success! Well done!'}
                {gameState === 'error' && '❌ Try again!'}
                {gameState === 'playing' && '🎮 Ready to play!'}
              </div>
            </div>
            
            {/* Progress Info */}
            <div className="grid grid-cols-2 gap-4 text-center">
              <div className="bg-white/10 rounded-lg p-3">
                <div className="text-2xl font-bold text-white">{appleCount}</div>
                <div className="text-white/80 text-sm">Apples Collected</div>
              </div>
              <div className="bg-white/10 rounded-lg p-3">
                <div className="text-2xl font-bold text-white">{wizardPosition}</div>
                <div className="text-white/80 text-sm">Current Position</div>
              </div>
            </div>
          </div>
        </div>

        {/* Code Area */}
        <div className="lg:col-span-4 bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20 p-4 flex flex-col max-h-full">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-white flex items-center space-x-2">
              <span className="text-2xl">🧩</span>
              <span>Your Code</span>
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
                disabled={isRunning || codeBlocks.length === 0 || isLoading}
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
            className="flex-1 border-2 border-dashed border-white/30 rounded-xl p-4 min-h-32 max-h-64 overflow-y-auto pr-2"
          >
            {codeBlocks.length === 0 ? (
              <div className="flex items-center justify-center h-full text-white/60 text-center">
                <div>
                  <div className="text-4xl mb-2">🎯</div>
                  <div>Drag blocks here to build your code!</div>
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
                      <div className="flex-1">
                        <div className="font-bold text-sm">{block.text}</div>
                        <div className="text-xs opacity-80 font-mono">{block.code}</div>
                      </div>
                      <button
                        onClick={() => removeBlock(block.uniqueId)}
                        className="opacity-0 group-hover:opacity-100 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs transition-opacity"
                        disabled={isRunning}
                      >
                        ×
                      </button>
                    </div>
                    <div className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-2 w-6 h-6 bg-white rounded-full text-xs flex items-center justify-center text-gray-800 font-bold">
                      {index + 1}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
          
          {/* Code Summary */}
          <div className="mt-4 bg-black/30 p-3 rounded-xl flex-shrink-0">
            <div className="flex items-center justify-between mb-2">
              <span className="text-white/60 text-xs">Code Summary:</span>
              <span className="text-white/60 text-xs">{codeBlocks.length} blocks</span>
            </div>
            <div className="text-green-300 font-mono text-sm max-h-20 overflow-y-auto pr-2">
              {codeBlocks.length === 0 ? (
                <span className="text-white/40">// Your code will appear here...</span>
              ) : (
                codeBlocks.map((block, index) => (
                  <div key={block.uniqueId} className="flex items-center space-x-2">
                    <span className="text-white/60">{index + 1}.</span>
                    <span>{block.code}</span>
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

export default LevelOnePage;

// CSS for smooth animations (add this to your global CSS)
const styles = `
  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translateY(-10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  .animate-fadeIn {
    animation: fadeIn 0.3s ease-out;
  }

  /* Custom scrollbar styling */
  .overflow-y-auto::-webkit-scrollbar {
    width: 8px;
  }

  .overflow-y-auto::-webkit-scrollbar-track {
    background: rgba(255, 255, 255, 0.1);
    border-radius: 4px;
  }

  .overflow-y-auto::-webkit-scrollbar-thumb {
    background: rgba(255, 255, 255, 0.3);
    border-radius: 4px;
  }

  .overflow-y-auto::-webkit-scrollbar-thumb:hover {
    background: rgba(255, 255, 255, 0.5);
  }

  /* Firefox scrollbar */
  .overflow-y-auto {
    scrollbar-width: thin;
    scrollbar-color: rgba(255, 255, 255, 0.3) rgba(255, 255, 255, 0.1);
  }

  /* Smooth scrolling */
  .overflow-y-auto {
    scroll-behavior: smooth;
  }
`;