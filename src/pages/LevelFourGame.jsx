import React, { useState, useEffect } from 'react';
import { Sparkles, Play, RotateCcw, CheckCircle, Star, Home, ArrowLeft, Sun, Cloud, CloudRain } from 'lucide-react';

const LevelFourGame = () => {
  const [draggedBlock, setDraggedBlock] = useState(null);
  const [codeBlocks, setCodeBlocks] = useState([]);
  const [gameState, setGameState] = useState('playing'); // 'playing', 'success', 'error'
  const [isRunning, setIsRunning] = useState(false);
  const [wizardPosition, setWizardPosition] = useState(0);
  const [executionStep, setExecutionStep] = useState(-1);
  const [currentWeather, setCurrentWeather] = useState('sunny'); // 'sunny', 'cloudy', 'rainy'
  const [chosenPath, setChosenPath] = useState('');
  const [gameMessage, setGameMessage] = useState('');
  const [variables, setVariables] = useState({});

  const weatherTypes = {
    sunny: { icon: '☀️', name: 'Sunny', color: 'from-yellow-400 to-orange-500', path: 'sunny_path' },
    cloudy: { icon: '☁️', name: 'Cloudy', color: 'from-gray-400 to-gray-600', path: 'cloudy_path' },
    rainy: { icon: '🌧️', name: 'Rainy', color: 'from-blue-500 to-blue-700', path: 'rainy_path' }
  };

  const paths = [
    { id: 'sunny_path', name: 'Sunny Path', position: 2, icon: '🌻', description: 'Bright meadow path' },
    { id: 'cloudy_path', name: 'Cloudy Path', position: 4, icon: '🌫️', description: 'Misty forest trail' },
    { id: 'rainy_path', name: 'Rainy Path', position: 6, icon: '🌧️', description: 'Sheltered cave route' }
  ];

  const totalPositions = 8;

  const availableBlocks = [
    {
      id: 'create-weather',
      type: 'variable',
      text: 'Check Weather',
      color: 'from-blue-500 to-blue-600',
      code: 'let weather = getWeather()',
      description: 'Gets the current weather condition'
    },
    {
      id: 'if-sunny',
      type: 'condition',
      text: 'If Weather is Sunny',
      color: 'from-yellow-500 to-yellow-600',
      code: 'if (weather === "sunny")',
      description: 'Checks if weather is sunny'
    },
    {
      id: 'if-cloudy',
      type: 'condition',
      text: 'If Weather is Cloudy',
      color: 'from-gray-500 to-gray-600',
      code: 'if (weather === "cloudy")',
      description: 'Checks if weather is cloudy'
    },
    {
      id: 'if-rainy',
      type: 'condition',
      text: 'If Weather is Rainy',
      color: 'from-blue-600 to-blue-700',
      code: 'if (weather === "rainy")',
      description: 'Checks if weather is rainy'
    },
    {
      id: 'else-condition',
      type: 'condition',
      text: 'Else',
      color: 'from-purple-500 to-purple-600',
      code: 'else',
      description: 'Default condition if others fail'
    },
    {
      id: 'take-sunny-path',
      type: 'action',
      text: 'Take Sunny Path',
      color: 'from-green-500 to-green-600',
      code: 'wizard.takePath("sunny_path")',
      description: 'Walk through the bright meadow'
    },
    {
      id: 'take-cloudy-path',
      type: 'action',
      text: 'Take Cloudy Path',
      color: 'from-emerald-500 to-emerald-600',
      code: 'wizard.takePath("cloudy_path")',
      description: 'Walk through the misty trail'
    },
    {
      id: 'take-rainy-path',
      type: 'action',
      text: 'Take Rainy Path',
      color: 'from-cyan-500 to-cyan-600',
      code: 'wizard.takePath("rainy_path")',
      description: 'Walk through the sheltered cave'
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
      text: 'Reach Destination!',
      color: 'from-pink-500 to-pink-600',
      code: 'wizard.celebrate()',
      description: 'Victory celebration'
    }
  ];

  // Randomize weather on component mount
  useEffect(() => {
    const weathers = ['sunny', 'cloudy', 'rainy'];
    const randomWeather = weathers[Math.floor(Math.random() * weathers.length)];
    setCurrentWeather(randomWeather);
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
    setChosenPath('');
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
    let pathTaken = '';
    let hasWeatherCheck = false;
    let conditionMet = false;

    for (let i = 0; i < codeBlocks.length; i++) {
      setExecutionStep(i);
      
      const block = codeBlocks[i];
      await new Promise(resolve => setTimeout(resolve, 1200));

      switch (block.type) {
        case 'variable':
          if (block.id.includes('create-weather')) {
            hasWeatherCheck = true;
            currentVariables.weather = currentWeather;
            setVariables({...currentVariables});
            setGameMessage(`Weather checked: ${weatherTypes[currentWeather].name}!`);
          }
          break;
          
        case 'condition':
          if (!hasWeatherCheck) {
            setGameMessage('Error: Check weather first!');
            setGameState('error');
            setIsRunning(false);
            return;
          }
          
          if (block.id.includes('if-sunny') && currentWeather === 'sunny') {
            conditionMet = true;
            setGameMessage('✅ Sunny condition matched!');
          } else if (block.id.includes('if-cloudy') && currentWeather === 'cloudy') {
            conditionMet = true;
            setGameMessage('✅ Cloudy condition matched!');
          } else if (block.id.includes('if-rainy') && currentWeather === 'rainy') {
            conditionMet = true;
            setGameMessage('✅ Rainy condition matched!');
          } else if (block.id.includes('else-condition')) {
            conditionMet = true;
            setGameMessage('✅ Else condition activated!');
          } else if (block.id.includes('if-')) {
            conditionMet = false;
            setGameMessage('❌ Weather condition not met, skipping...');
          }
          break;
          
        case 'action':
          if (block.id.includes('take-') && conditionMet) {
            if (block.id.includes('sunny-path')) {
              pathTaken = 'sunny_path';
              currentPosition = 2;
            } else if (block.id.includes('cloudy-path')) {
              pathTaken = 'cloudy_path';
              currentPosition = 4;
            } else if (block.id.includes('rainy-path')) {
              pathTaken = 'rainy_path';
              currentPosition = 6;
            }
            setChosenPath(pathTaken);
            setWizardPosition(currentPosition);
            setGameMessage(`Wizard chose the ${paths.find(p => p.id === pathTaken)?.name}!`);
          } else if (block.id.includes('take-') && !conditionMet) {
            setGameMessage('Cannot take path - condition not met!');
          } else if (block.id.includes('celebrate')) {
            const correctPath = weatherTypes[currentWeather].path;
            if (pathTaken === correctPath) {
              setGameState('success');
              setGameMessage('🎉 Perfect weather decision!');
            } else {
              setGameMessage(`Wrong path taken! Should have chosen ${paths.find(p => p.id === correctPath)?.name}`);
              setGameState('error');
              setIsRunning(false);
              return;
            }
          }
          break;
          
        case 'movement':
          if (currentPosition < totalPositions - 1 && pathTaken) {
            currentPosition++;
            setWizardPosition(currentPosition);
            setGameMessage(`Moving along the ${paths.find(p => p.id === pathTaken)?.name}...`);
          }
          break;
          
        default:
          break;
      }
    }

    setExecutionStep(-1);
    setIsRunning(false);
    
    const correctPath = weatherTypes[currentWeather].path;
    if (pathTaken === correctPath && currentPosition >= 2) {
      setGameState('success');
    } else if (!pathTaken) {
      setGameState('error');
      setGameMessage('No path was taken!');
    } else {
      setGameState('error');
      setGameMessage(`Wrong path! Weather was ${currentWeather}, should take ${paths.find(p => p.id === correctPath)?.name}`);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-800 via-emerald-700 to-teal-800 relative overflow-hidden">
      {/* Background Forest Elements */}
      <div className="fixed inset-0 z-0">
        {/* Forest Trees */}
        <div className="absolute bottom-0 left-0 w-full h-40 bg-gradient-to-t from-green-700 to-green-600 opacity-30" />
        
        {/* Forest Trees */}
        <div className="absolute bottom-20 left-10 text-6xl opacity-60">🌲</div>
        <div className="absolute bottom-16 right-20 text-5xl opacity-60">🌳</div>
        <div className="absolute bottom-24 left-1/3 text-4xl opacity-60">🌲</div>
        <div className="absolute bottom-20 right-1/3 text-5xl opacity-60">🌳</div>
        <div className="absolute bottom-28 left-2/3 text-4xl opacity-60">🌲</div>
        
        {/* Mystical Elements */}
        <div className="absolute top-32 left-20 text-3xl opacity-50 animate-pulse">✨</div>
        <div className="absolute top-40 right-32 text-2xl opacity-40 animate-pulse" style={{ animationDelay: '1s' }}>🦋</div>
        <div className="absolute top-24 left-1/2 text-3xl opacity-50 animate-pulse" style={{ animationDelay: '2s' }}>🍄</div>
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
              <span className="text-white font-bold">Forest Decisions - Level 4</span>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="bg-white/20 px-4 py-2 rounded-lg flex items-center space-x-2">
              <span className="text-3xl">{weatherTypes[currentWeather].icon}</span>
              <span className="text-white">{weatherTypes[currentWeather].name}</span>
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
            <span className="text-3xl">🌦️</span>
            <span>Mission: Weather Paths</span>
          </h2>
          
          <div className="space-y-4 text-white">
            <div className="bg-blue-500/20 p-4 rounded-xl border border-blue-400/30">
              <h3 className="font-bold mb-2">🎯 Goal:</h3>
              <p className="text-sm">Help the wizard choose the right path based on weather conditions using If/Else logic!</p>
            </div>
            
            <div className="bg-purple-500/20 p-4 rounded-xl border border-purple-400/30">
              <h3 className="font-bold mb-2">🛤️ Three Paths:</h3>
              <div className="space-y-2 text-sm">
                <div className="flex items-center space-x-2">
                  <span>☀️</span>
                  <span>Sunny → Bright Meadow Path</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span>☁️</span>
                  <span>Cloudy → Misty Forest Trail</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span>🌧️</span>
                  <span>Rainy → Sheltered Cave Route</span>
                </div>
              </div>
            </div>
            
            <div className="bg-green-500/20 p-4 rounded-xl border border-green-400/30">
              <h3 className="font-bold mb-2">💡 Logic Pattern:</h3>
              <ul className="text-sm space-y-1">
                <li>• Check the weather first</li>
                <li>• Use If conditions to test weather</li>
                <li>• Take the matching path</li>
                <li>• Move forward to destination</li>
              </ul>
            </div>
          </div>

          {/* Block Toolbox */}
          <div className="mt-6">
            <h3 className="text-lg font-bold text-white mb-4">🧰 Code Blocks</h3>
            <div className="space-y-3 max-h-64 overflow-y-auto">
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
            <span className="text-2xl">🌲</span>
            <span>Forest Crossroads</span>
          </h2>
          
          {/* Current Weather Display */}
          <div className="mb-4 p-4 bg-white/10 rounded-xl border border-white/20">
            <div className="text-center">
              <div className="text-6xl mb-2">{weatherTypes[currentWeather].icon}</div>
              <div className="text-white font-bold text-lg">Current Weather: {weatherTypes[currentWeather].name}</div>
              <div className="text-blue-200 text-sm">Choose the right path for this weather!</div>
            </div>
          </div>
          
          {/* Game Status Message */}
          {gameMessage && (
            <div className="mb-4 p-3 bg-emerald-500/20 rounded-lg border border-emerald-400/30">
              <div className="text-white text-sm">{gameMessage}</div>
            </div>
          )}
          
          {/* Game Path */}
          <div className="flex-1 flex flex-col justify-center">
            <div className="grid grid-cols-8 gap-2 mb-6">
              {[...Array(totalPositions)].map((_, index) => {
                const pathAtPosition = paths.find(p => p.position === index);
                const isChosenPath = pathAtPosition && chosenPath === pathAtPosition.id;
                return (
                  <div key={index} className="relative">
                    {/* Path Tile */}
                    <div className={`w-12 h-12 rounded-lg border-2 transition-all duration-500 ${
                      wizardPosition === index 
                        ? 'bg-yellow-300/30 border-yellow-400 shadow-lg' 
                        : pathAtPosition
                        ? isChosenPath
                          ? 'bg-green-400/30 border-green-500/70'
                          : 'bg-emerald-400/20 border-emerald-500/50'
                        : 'bg-green-400/20 border-green-500/50'
                    }`}>
                      {/* Path Icons */}
                      {pathAtPosition && (
                        <div className="absolute inset-0 flex items-center justify-center text-lg">
                          <div className={`relative ${isChosenPath ? 'animate-pulse' : ''}`}>
                            {pathAtPosition.icon}
                            {isChosenPath && (
                              <div className="absolute -top-1 -right-1 text-green-400 text-xs">✅</div>
                            )}
                          </div>
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
                    
                    {/* Path Name */}
                    {pathAtPosition && (
                      <div className="text-center text-white text-xs mt-1 truncate w-12">
                        {pathAtPosition.name.split(' ')[0]}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
            
            {/* Variables Display */}
            <div className="bg-blue-500/20 p-4 rounded-xl border border-blue-400/30 mb-4">
              <h3 className="text-white font-bold mb-2">📊 Variables:</h3>
              <div className="text-white space-y-1">
                {variables.weather ? (
                  <div className="font-mono bg-black/30 px-2 py-1 rounded text-sm">
                    weather = "{variables.weather}"
                  </div>
                ) : (
                  <div className="text-white/60 text-sm">No weather variable set</div>
                )}
              </div>
            </div>
            
            {/* Path Information */}
            <div className="bg-green-500/20 p-4 rounded-xl border border-green-400/30 mb-4">
              <h3 className="text-white font-bold mb-2">🛤️ Available Paths:</h3>
              <div className="space-y-2">
                {paths.map((path) => (
                  <div key={path.id} className="flex items-center justify-between text-sm">
                    <div className="flex items-center space-x-2">
                      <span>{path.icon}</span>
                      <span className="text-white">{path.name}</span>
                    </div>
                    <div className="text-right">
                      {chosenPath === path.id ? (
                        <span className="text-green-300">✅ Chosen</span>
                      ) : (
                        <span className="text-blue-200">Available</span>
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
                <div className="text-white font-bold">Perfect Weather Logic!</div>
                <div className="text-green-200 text-sm">You chose the right path for {weatherTypes[currentWeather].name} weather!</div>
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
                <div className="text-white font-bold">Weather Logic Error!</div>
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
              <span>Weather Logic</span>
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
                <span>{isRunning ? 'Deciding...' : 'Make Decision'}</span>
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
                  <div className="text-4xl mb-2">🌦️</div>
                  <div>Drag blocks to create weather logic!</div>
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
                <span className="text-white/40">// Your weather logic will appear here</span>
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

export default LevelFourGame;