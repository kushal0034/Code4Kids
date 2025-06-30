import React, { useState, useEffect } from 'react';
import { Sparkles, Play, RotateCcw, CheckCircle, Star, Home, ArrowLeft } from 'lucide-react';

const LevelOnePage = () => {
  const [draggedBlock, setDraggedBlock] = useState(null);
  const [codeBlocks, setCodeBlocks] = useState([]);
  const [appleCount, setAppleCount] = useState(0);
  const [gameState, setGameState] = useState('playing'); // 'playing', 'success', 'error'
  const [isRunning, setIsRunning] = useState(false);
  const [wizardPosition, setWizardPosition] = useState(0);
  const [collectedApples, setCollectedApples] = useState([]);
  const [executionStep, setExecutionStep] = useState(-1);

  const availableBlocks = [
    {
      id: 'variable-create',
      type: 'variable',
      text: 'Create Variable',
      color: 'from-blue-500 to-blue-600',
      code: 'let apples = 0',
      description: 'Creates a counter to track apples'
    },
    {
      id: 'collect-apple',
      type: 'action',
      text: 'Collect Apple',
      color: 'from-green-500 to-green-600',
      code: 'apples = apples + 1',
      description: 'Picks up one apple and adds to counter'
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
      id: 'check-count',
      type: 'condition',
      text: 'Check if apples = 5',
      color: 'from-orange-500 to-orange-600',
      code: 'if (apples === 5)',
      description: 'Checks if we collected exactly 5 apples'
    },
    {
      id: 'celebrate',
      type: 'action',
      text: 'Celebrate!',
      color: 'from-pink-500 to-pink-600',
      code: 'wizard.celebrate()',
      description: 'Victory celebration'
    }
  ];

  const applePositions = [1, 2, 3, 4, 5]; // Positions where apples are located
  const totalPositions = 7;

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
    setAppleCount(0);
    setWizardPosition(0);
    setCollectedApples([]);
    setGameState('playing');
    setIsRunning(false);
    setExecutionStep(-1);
  };

  const runCode = async () => {
    if (codeBlocks.length === 0) return;
    
    setIsRunning(true);
    setGameState('playing');
    resetGame();
    
    let currentApples = 0;
    let currentPosition = 0;
    let collectedApplesTemp = [];

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
              setGameState('success');
            }
          }
          break;
          
        case 'condition':
          if (currentApples === 5) {
            // Condition is true, continue
          } else {
            // Condition failed
            setGameState('error');
            setIsRunning(false);
            return;
          }
          break;
          
        default:
          break;
      }
    }

    setExecutionStep(-1);
    setIsRunning(false);
    
    if (currentApples === 5 && collectedApplesTemp.length === 5) {
      setGameState('success');
    } else if (currentApples !== 5) {
      setGameState('error');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-800 via-green-700 to-emerald-800 relative overflow-hidden">
      {/* Background Village Elements */}
      <div className="fixed inset-0 z-0">
        {/* Hills */}
        <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-green-600 to-green-500 rounded-t-full transform -translate-y-8" />
        <div className="absolute bottom-0 right-0 w-3/4 h-24 bg-gradient-to-t from-green-700 to-green-600 rounded-tl-full" />
        
        {/* Village Houses */}
        <div className="absolute bottom-16 left-20 w-12 h-16 bg-amber-600 rounded-t-lg">
          <div className="w-8 h-8 bg-red-600 rounded-full mx-auto transform -translate-y-2" />
        </div>
        <div className="absolute bottom-16 right-32 w-10 h-12 bg-amber-700 rounded-t-lg">
          <div className="w-6 h-6 bg-red-700 rounded-full mx-auto transform -translate-y-1" />
        </div>
        
        {/* Trees */}
        <div className="absolute bottom-20 left-1/3 text-4xl">🌳</div>
        <div className="absolute bottom-24 right-1/4 text-3xl">🌲</div>
        
        {/* Clouds */}
        <div className="absolute top-20 left-10 text-3xl opacity-70 animate-pulse">☁️</div>
        <div className="absolute top-32 right-20 text-2xl opacity-60 animate-pulse">☁️</div>
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
              <span className="text-white font-bold">Village Basics - Level 1</span>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="bg-white/20 px-4 py-2 rounded-lg">
              <span className="text-white">Apples: {appleCount}/5</span>
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
            <span className="text-3xl">📚</span>
            <span>Mission: Apple Collection</span>
          </h2>
          
          <div className="space-y-4 text-white">
            <div className="bg-blue-500/20 p-4 rounded-xl border border-blue-400/30">
              <h3 className="font-bold mb-2">🎯 Goal:</h3>
              <p className="text-sm">Help the wizard collect exactly 5 apples using programming blocks!</p>
            </div>
            
            <div className="bg-purple-500/20 p-4 rounded-xl border border-purple-400/30">
              <h3 className="font-bold mb-2">🧩 How to Play:</h3>
              <ul className="text-sm space-y-1">
                <li>• Drag blocks from the toolbox</li>
                <li>• Drop them in the code area</li>
                <li>• Arrange blocks in the right order</li>
                <li>• Click "Run Code" to execute</li>
              </ul>
            </div>
            
            <div className="bg-green-500/20 p-4 rounded-xl border border-green-400/30">
              <h3 className="font-bold mb-2">💡 Hint:</h3>
              <p className="text-sm">Start by creating a variable to count apples, then move and collect!</p>
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
            <span className="text-2xl">🌍</span>
            <span>Village Path</span>
          </h2>
          
          {/* Game Path */}
          <div className="flex-1 flex flex-col justify-center">
            <div className="grid grid-cols-7 gap-2 mb-8">
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
                  <div className="text-center text-white text-xs mt-1">{index}</div>
                </div>
              ))}
            </div>
            
            {/* Variable Display */}
            <div className="bg-blue-500/20 p-4 rounded-xl border border-blue-400/30 mb-4">
              <h3 className="text-white font-bold mb-2">📊 Variables:</h3>
              <div className="text-white">
                <span className="font-mono bg-black/30 px-2 py-1 rounded">apples = {appleCount}</span>
              </div>
            </div>
            
            {/* Game Status */}
            {gameState === 'success' && (
              <div className="bg-green-500/20 p-4 rounded-xl border border-green-400/30 text-center">
                <div className="text-4xl mb-2">🎉</div>
                <div className="text-white font-bold">Mission Complete!</div>
                <div className="text-green-200 text-sm">You collected exactly 5 apples!</div>
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
                <div className="text-white font-bold">Try Again!</div>
                <div className="text-red-200 text-sm">
                  {appleCount !== 5 ? `You have ${appleCount} apples, need exactly 5!` : 'Check your code logic!'}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Code Area */}
        <div className="bg-white/10 backdrop-blur-sm rounded-3xl border border-white/20 p-6 flex flex-col">
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
            className="flex-1 border-2 border-dashed border-white/30 rounded-xl p-4 min-h-32"
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
            <div className="text-green-300 font-mono text-sm">
              {codeBlocks.length === 0 ? (
                <span className="text-white/40">// Your code will appear here</span>
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

export default LevelOnePage;