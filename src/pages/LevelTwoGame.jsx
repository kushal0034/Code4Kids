import React, { useState, useEffect } from 'react';
import { Sparkles, Play, RotateCcw, CheckCircle, Star, Home, ArrowLeft, MessageCircle, Trophy, Clock } from 'lucide-react';
import { progressService } from '../services/progressService';

const LevelTwoGame = () => {
  const [draggedBlock, setDraggedBlock] = useState(null);
  const [codeBlocks, setCodeBlocks] = useState([]);
  const [gameState, setGameState] = useState('playing'); // 'playing', 'success', 'error'
  const [isRunning, setIsRunning] = useState(false);
  const [wizardPosition, setWizardPosition] = useState(0);
  const [executionStep, setExecutionStep] = useState(-1);
  const [variables, setVariables] = useState({});
  const [deliveredMessages, setDeliveredMessages] = useState([]);
  const [gameMessage, setGameMessage] = useState('');
  const [startTime, setStartTime] = useState(null);
  const [endTime, setEndTime] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [levelResults, setLevelResults] = useState(null);
  const [user, setUser] = useState(null);

  // Get current user on component mount
  useEffect(() => {
    const userData = progressService.getCurrentUser();
    if (!userData) {
      // Redirect to login if no user
      window.location.href = '/login';
    } else {
      setUser(userData);
    }
  }, []);

  const villagers = [
    { id: 1, name: 'Baker Tom', position: 2, icon: '👨‍🍳', message: 'Fresh bread ready!', needsMessage: true },
    { id: 2, name: 'Teacher Sara', position: 4, icon: '👩‍🏫', message: 'Class starts soon!', needsMessage: true },
    { id: 3, name: 'Farmer Joe', position: 6, icon: '👨‍🌾', message: 'Harvest is done!', needsMessage: true }
  ];

  const availableBlocks = [
    {
      id: 'create-variable',
      type: 'variable',
      text: 'Create Message Variable',
      color: 'from-blue-500 to-blue-600',
      code: 'let message = ""',
      description: 'Creates a variable to store messages'
    },
    {
      id: 'store-baker-message',
      type: 'variable',
      text: 'Store Baker Message',
      color: 'from-cyan-500 to-cyan-600',
      code: 'message = "Fresh bread ready!"',
      description: 'Stores the baker\'s message in variable'
    },
    {
      id: 'store-teacher-message',
      type: 'variable',
      text: 'Store Teacher Message',
      color: 'from-cyan-500 to-cyan-600',
      code: 'message = "Class starts soon!"',
      description: 'Stores the teacher\'s message in variable'
    },
    {
      id: 'store-farmer-message',
      type: 'variable',
      text: 'Store Farmer Message',
      color: 'from-cyan-500 to-cyan-600',
      code: 'message = "Harvest is done!"',
      description: 'Stores the farmer\'s message in variable'
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
      id: 'deliver-message',
      type: 'action',
      text: 'Deliver Message',
      color: 'from-green-500 to-green-600',
      code: 'wizard.deliver(message)',
      description: 'Delivers stored message to villager'
    },
    {
      id: 'clear-message',
      type: 'variable',
      text: 'Clear Message',
      color: 'from-orange-500 to-orange-600',
      code: 'message = ""',
      description: 'Clears the message variable'
    },
    {
      id: 'celebrate',
      type: 'action',
      text: 'Mission Complete!',
      color: 'from-pink-500 to-pink-600',
      code: 'wizard.celebrate()',
      description: 'Victory celebration'
    }
  ];

  const totalPositions = 8;

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
    setDeliveredMessages([]);
    setGameState('playing');
    setIsRunning(false);
    setExecutionStep(-1);
    setVariables({});
    setGameMessage('');
    setStartTime(null);
    setEndTime(null);
    setShowResults(false);
    setLevelResults(null);
  };

  const calculateStars = (timeSpent, codeBlockCount, messagesDelivered) => {
    let stars = 1; // Base star for completion
    
    // Time bonus (under 45 seconds = extra star)
    if (timeSpent < 45000) {
      stars++;
    }
    
    // Efficiency bonus (under 12 blocks = extra star)
    if (codeBlockCount <= 11) {
      stars++;
    }
    
    return Math.min(stars, 3);
  };

  const saveProgress = async (success, timeSpent = 0) => {
    if (!user) return;

    setIsLoading(true);
    
    try {
      const stars = success ? calculateStars(timeSpent, codeBlocks.length, deliveredMessages.length) : 0;
      
      const result = await progressService.recordLevelAttempt(
        2, // Level 2
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
          messagesDelivered: deliveredMessages.length,
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
    let currentPosition = 0;
    let currentVariables = {};
    let delivered = [];
    let hasMessageVariable = false;
    setWizardPosition(0);
    setDeliveredMessages([]);
    setVariables({});

    for (let i = 0; i < codeBlocks.length; i++) {
      setExecutionStep(i);
      
      const block = codeBlocks[i];
      await new Promise(resolve => setTimeout(resolve, 1200));

      switch (block.type) {
        case 'variable':
          if (block.id.includes('create-variable')) {
            hasMessageVariable = true;
            currentVariables.message = '';
            setVariables({...currentVariables});
            setGameMessage('Message variable created!');
          } else if (block.id.includes('store-baker-message')) {
            if (hasMessageVariable) {
              currentVariables.message = 'Fresh bread ready!';
              setVariables({...currentVariables});
              setGameMessage('Baker\'s message stored in variable!');
            } else {
              setGameMessage('Error: Create message variable first!');
              setGameState('error');
              setIsRunning(false);
              setExecutionStep(-1);
              await saveProgress(false);
              return;
            }
          } else if (block.id.includes('store-teacher-message')) {
            if (hasMessageVariable) {
              currentVariables.message = 'Class starts soon!';
              setVariables({...currentVariables});
              setGameMessage('Teacher\'s message stored in variable!');
            } else {
              setGameMessage('Error: Create message variable first!');
              setGameState('error');
              setIsRunning(false);
              setExecutionStep(-1);
              await saveProgress(false);
              return;
            }
          } else if (block.id.includes('store-farmer-message')) {
            if (hasMessageVariable) {
              currentVariables.message = 'Harvest is done!';
              setVariables({...currentVariables});
              setGameMessage('Farmer\'s message stored in variable!');
            } else {
              setGameMessage('Error: Create message variable first!');
              setGameState('error');
              setIsRunning(false);
              setExecutionStep(-1);
              await saveProgress(false);
              return;
            }
          } else if (block.id.includes('clear-message')) {
            if (hasMessageVariable) {
              currentVariables.message = '';
              setVariables({...currentVariables});
              setGameMessage('Message variable cleared!');
            }
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
          if (block.id.includes('deliver-message')) {
            const villagerAtPosition = villagers.find(v => v.position === currentPosition);
            if (villagerAtPosition && currentVariables.message) {
              const expectedMessage = villagerAtPosition.message;
              if (currentVariables.message === expectedMessage && !delivered.includes(villagerAtPosition.id)) {
                delivered.push(villagerAtPosition.id);
                setDeliveredMessages([...delivered]);
                setGameMessage(`✅ Delivered to ${villagerAtPosition.name}!`);
              } else if (delivered.includes(villagerAtPosition.id)) {
                setGameMessage(`Already delivered to ${villagerAtPosition.name}!`);
              } else {
                setGameMessage(`❌ Wrong message for ${villagerAtPosition.name}!`);
                setGameState('error');
                setIsRunning(false);
                setExecutionStep(-1);
                await saveProgress(false);
                return;
              }
            } else if (!villagerAtPosition) {
              setGameMessage('No villager here to deliver to!');
            } else {
              setGameMessage('No message to deliver!');
            }
          } else if (block.id.includes('celebrate')) {
            if (delivered.length === 3) {
              const endTime = Date.now();
              setEndTime(endTime);
              const timeSpent = endTime - startTime;
              
              setGameState('success');
              setIsRunning(false);
              setExecutionStep(-1);
              
              // Save progress to database
              await saveProgress(true, timeSpent);
              return;
            } else {
              setGameMessage(`Only ${delivered.length}/3 messages delivered!`);
              setGameState('error');
              setIsRunning(false);
              setExecutionStep(-1);
              await saveProgress(false);
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
    
    if (delivered.length === 3) {
      const endTime = Date.now();
      setEndTime(endTime);
      const timeSpent = endTime - startTime;
      
      setGameState('success');
      await saveProgress(true, timeSpent);
    } else {
      setGameState('error');
      setGameMessage(`Mission incomplete: ${delivered.length}/3 messages delivered`);
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
    <div className="min-h-screen bg-gradient-to-br from-amber-800 via-orange-700 to-yellow-600 relative overflow-hidden">
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
          <div className="bg-gradient-to-br from-orange-600 to-yellow-700 rounded-3xl p-8 max-w-md w-full text-white text-center shadow-2xl">
            <div className="text-6xl mb-4">📮</div>
            <h2 className="text-3xl font-bold mb-4">Messages Delivered!</h2>
            
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

              <div className="bg-blue-500/20 rounded-lg p-3">
                <MessageCircle className="w-6 h-6 mx-auto mb-1 text-blue-300" />
                <div className="font-bold">{levelResults.messagesDelivered}/3</div>
                <div className="opacity-80">Messages Delivered</div>
              </div>

              {levelResults.newAchievements.length > 0 && (
                <div className="bg-yellow-500/20 rounded-lg p-4">
                  <Trophy className="w-6 h-6 mx-auto mb-2 text-yellow-400" />
                  <div className="font-bold mb-2">New Achievements!</div>
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
                className="flex-1 py-3 bg-white/20 rounded-xl hover:bg-white/30 transition-colors"
              >
                Try Again
              </button>
              <Link
                to="/worlds"
                className="flex-1 py-3 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl hover:scale-105 transition-transform text-center"
              >
                Continue Adventure
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Background Village Elements */}
      <div className="fixed inset-0 z-0">
        {/* Village Ground */}
        <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-amber-600 to-amber-500 rounded-t-full transform -translate-y-8" />
        
        {/* Village Buildings */}
        <div className="absolute bottom-16 left-12 w-16 h-20 bg-amber-700 rounded-t-lg">
          <div className="w-12 h-12 bg-red-600 rounded-full mx-auto transform -translate-y-3" />
          <div className="text-center text-xs text-white mt-1">Bakery</div>
        </div>
        <div className="absolute bottom-16 left-1/2 transform -translate-x-1/2 w-18 h-24 bg-blue-700 rounded-t-lg">
          <div className="w-14 h-14 bg-green-600 rounded-full mx-auto transform -translate-y-4" />
          <div className="text-center text-xs text-white mt-1">School</div>
        </div>
        <div className="absolute bottom-16 right-12 w-16 h-20 bg-green-700 rounded-t-lg">
          <div className="w-12 h-12 bg-brown-600 rounded-full mx-auto transform -translate-y-3" />
          <div className="text-center text-xs text-white mt-1">Farm</div>
        </div>
        
        {/* Message Icons */}
        <div className="absolute top-32 left-20 text-2xl animate-bounce">💌</div>
        <div className="absolute top-40 right-24 text-2xl animate-bounce" style={{ animationDelay: '1s' }}>📨</div>
        <div className="absolute top-24 left-1/2 text-2xl animate-bounce" style={{ animationDelay: '2s' }}>📬</div>
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
              <span className="text-white font-bold">Village Basics - Level 2</span>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="bg-white/20 px-4 py-2 rounded-lg">
              <span className="text-white">Messages: {deliveredMessages.length}/3</span>
            </div>
            {user && (
              <div className="bg-white/20 px-4 py-2 rounded-lg">
                <span className="text-white">{user.username}</span>
              </div>
            )}
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
            <span className="text-3xl">📮</span>
            <span>Mission: Message Delivery</span>
          </h2>
          
          <div className="space-y-4 text-white">
            <div className="bg-blue-500/20 p-4 rounded-xl border border-blue-400/30">
              <h3 className="font-bold mb-2">🎯 Goal:</h3>
              <p className="text-sm">Deliver the correct message to each villager using string variables!</p>
            </div>
            
            <div className="bg-purple-500/20 p-4 rounded-xl border border-purple-400/30">
              <h3 className="font-bold mb-2">👥 Villagers:</h3>
              <div className="space-y-2 text-sm">
                <div className="flex items-center space-x-2">
                  <span>👨‍🍳</span>
                  <span>Baker Tom (Pos 2): "Fresh bread ready!"</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span>👩‍🏫</span>
                  <span>Teacher Sara (Pos 4): "Class starts soon!"</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span>👨‍🌾</span>
                  <span>Farmer Joe (Pos 6): "Harvest is done!"</span>
                </div>
              </div>
            </div>
            
            <div className="bg-green-500/20 p-4 rounded-xl border border-green-400/30">
              <h3 className="font-bold mb-2">💡 Strategy:</h3>
              <ul className="text-sm space-y-1">
                <li>• Create a message variable first</li>
                <li>• Store the right message for each villager</li>
                <li>• Move to their position</li>
                <li>• Deliver the message</li>
                <li>• Clear message before next delivery</li>
              </ul>
            </div>

            <div className="bg-yellow-500/20 p-4 rounded-xl border border-yellow-400/30">
              <h3 className="font-bold mb-2">⭐ Star Scoring:</h3>
              <ul className="text-sm space-y-1">
                <li>• 1 ⭐: Complete all deliveries</li>
                <li>• 2 ⭐: Complete in under 45 seconds</li>
                <li>• 3 ⭐: Use 11 or fewer blocks</li>
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
            <span className="text-2xl">🏘️</span>
            <span>Village Square</span>
          </h2>
          
          {/* Game Status Message */}
          {gameMessage && (
            <div className="mb-4 p-3 bg-blue-500/20 rounded-lg border border-blue-400/30">
              <div className="text-white text-sm">{gameMessage}</div>
            </div>
          )}
          
          {/* Game Path */}
          <div className="flex-1 flex flex-col justify-center">
            <div className="grid grid-cols-8 gap-2 mb-6">
              {[...Array(totalPositions)].map((_, index) => {
                const villager = villagers.find(v => v.position === index);
                return (
                  <div key={index} className="relative">
                    {/* Path Tile */}
                    <div className={`w-14 h-14 rounded-lg border-2 transition-all duration-500 ${
                      wizardPosition === index 
                        ? 'bg-yellow-300/30 border-yellow-400 shadow-lg' 
                        : villager 
                        ? 'bg-blue-400/20 border-blue-500/50'
                        : 'bg-amber-400/20 border-amber-500/50'
                    }`}>
                      {/* Villager */}
                      {villager && (
                        <div className="absolute inset-0 flex items-center justify-center text-2xl">
                          {deliveredMessages.includes(villager.id) ? (
                            <div className="relative">
                              <span className="opacity-50">{villager.icon}</span>
                              <div className="absolute -top-2 -right-2 text-green-400 text-lg">✅</div>
                            </div>
                          ) : (
                            <div className="relative">
                              {villager.icon}
                              <div className="absolute -top-1 -right-1 text-red-400 text-xs">❗</div>
                            </div>
                          )}
                        </div>
                      )}
                      
                      {/* Wizard */}
                      {wizardPosition === index && (
                        <div className="absolute inset-0 flex items-center justify-center text-2xl z-10 animate-pulse">
                          🧙‍♂️
                        </div>
                      )}
                    </div>
                    
                    {/* Position Number */}
                    <div className="text-center text-white text-xs mt-1">{index}</div>
                    
                    {/* Villager Name */}
                    {villager && (
                      <div className="text-center text-white text-xs mt-1 truncate w-14">
                        {villager.name.split(' ')[0]}
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
                {variables.message !== undefined ? (
                  <div className="font-mono bg-black/30 px-2 py-1 rounded text-sm">
                    message = "{variables.message}"
                  </div>
                ) : (
                  <div className="text-white/60 text-sm">No message variable created</div>
                )}
              </div>
            </div>

            {/* Timer Display */}
            {startTime && !endTime && (
              <div className="bg-purple-500/20 p-4 rounded-xl border border-purple-400/30 mb-4">
                <div className="flex items-center justify-center space-x-2 text-white">
                  <Clock className="w-5 h-5" />
                  <span className="font-mono">
                    {formatTime(Date.now() - startTime)}
                  </span>
                </div>
              </div>
            )}
            
            {/* Delivery Progress */}
            <div className="bg-green-500/20 p-4 rounded-xl border border-green-400/30 mb-4">
              <h3 className="text-white font-bold mb-2">📬 Delivery Progress:</h3>
              <div className="space-y-2">
                {villagers.map((villager) => (
                  <div key={villager.id} className="flex items-center justify-between text-sm">
                    <div className="flex items-center space-x-2">
                      <span>{villager.icon}</span>
                      <span className="text-white">{villager.name}</span>
                    </div>
                    <div className="text-right">
                      {deliveredMessages.includes(villager.id) ? (
                        <span className="text-green-300">✅ Delivered</span>
                      ) : (
                        <span className="text-orange-300">📭 Waiting</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Game Status */}
            {gameState === 'success' && !showResults && (
              <div className="bg-green-500/20 p-4 rounded-xl border border-green-400/30 text-center">
                <div className="text-4xl mb-2">🎉</div>
                <div className="text-white font-bold">Mission Complete!</div>
                <div className="text-green-200 text-sm">All messages delivered successfully!</div>
                <div className="flex justify-center mt-2">
                  <StarDisplay count={3} />
                </div>
              </div>
            )}
            
            {gameState === 'error' && (
              <div className="bg-red-500/20 p-4 rounded-xl border border-red-400/30 text-center">
                <div className="text-4xl mb-2">❌</div>
                <div className="text-white font-bold">Try Again!</div>
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
            className="flex-1 border-2 border-dashed border-white/30 rounded-xl p-4 min-h-32 overflow-y-auto"
          >
            {codeBlocks.length === 0 ? (
              <div className="flex items-center justify-center h-full text-white/60 text-center">
                <div>
                  <div className="text-4xl mb-2">📮</div>
                  <div>Drag blocks here to deliver messages!</div>
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
                        disabled={isRunning}
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
                <span className="text-white/40">// Your code will appear here</span>
              ) : (
                codeBlocks.map((block, index) => (
                  <div key={index}>{block.code}</div>
                ))
              )}
            </div>
          </div>

          {/* Progress Indicator */}
          <div className="mt-4 bg-purple-500/20 p-3 rounded-xl border border-purple-400/30">
            <div className="flex items-center justify-between text-white text-sm">
              <span>Blocks Used:</span>
              <span className={codeBlocks.length <= 11 ? 'text-green-300' : 'text-yellow-300'}>
                {codeBlocks.length} {codeBlocks.length <= 11 ? '(Efficiency Bonus!)' : ''}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LevelTwoGame;