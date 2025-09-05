"use client";

import React, { useState, useEffect, useCallback } from 'react';
import GameRunner from './gameplay.js';
import AI from './ai.js';

// Import constants from AI
const MAX_PLAYER = 0;
const CHANCE_PLAYER = 1;

// Node class for AI
class Node {
    constructor(state, playerType) {
        this.state = [state[0], state[1]]; // [board, score]
        this.children = []; // Array of (direction, node) tuples
        this.playerType = playerType;
    }

    // Returns whether this is a terminal state (no children)
    isTerminal() {
        return this.children.length === 0;
    }
}

// Color mapping for tiles
const getTileColor = (value) => {
  const colorMap = {
    0: 'bg-slate-700',
    2: 'bg-red-500',
    4: 'bg-orange-500',
    8: 'bg-yellow-500',
    16: 'bg-lime-500',
    32: 'bg-green-500',
    64: 'bg-emerald-500',
    128: 'bg-cyan-500',
    256: 'bg-blue-500',
    512: 'bg-indigo-500',
    1024: 'bg-purple-500',
    2048: 'bg-black',
    4096: 'bg-white text-black',
    8192: 'bg-white text-gray-500',
    16384: 'bg-white text-gray-400',
    32768: 'bg-white text-gray-300',
    65536: 'bg-white text-gray-200',
  };
  return colorMap[value] || 'bg-gray-800';
};

const getTextColor = (value) => {
  if (value === 4096) return 'text-black';
  if (value >= 2048) return 'text-white';
  return 'text-white';
};

const TwentyFortyEight = () => {
  // Game state
  const [game, setGame] = useState(null);
  const [board, setBoard] = useState([[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0]]);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [hasWon, setHasWon] = useState(false);
  const [aiEnabled, setAiEnabled] = useState(false);
  const [ai, setAi] = useState(null);
  const [aiThinking, setAiThinking] = useState(false);

  // Initialize game
  useEffect(() => {
    const newGame = new GameRunner();
    const newAi = new AI(newGame.currentState(), 3);
    newAi.setSimulator(newGame);
    
    console.log('Game initialized:', newGame);
    console.log('AI initialized:', newAi);
    console.log('Initial board:', newGame.getBoard());
    console.log('Initial score:', newGame.score);
    console.log('Redo function available:', typeof newGame.redo === 'function');
    
    setGame(newGame);
    setAi(newAi);
    setBoard(newGame.getBoard());
    setScore(newGame.score);
  }, []);

  // Make a move
  const makeMove = useCallback((direction) => {
    if (!game) {
      console.log('No game instance available');
      return;
    }

    // Prevent moves during AI thinking to avoid race conditions
    if (aiThinking) {
      console.log('Move blocked: AI is thinking');
      return;
    }

    console.log('Making move in direction:', direction);
    const moved = game.moveAndPlace(direction);
    console.log('Move successful:', moved);
    
    if (moved) {
      const newBoard = game.getBoard();
      const newScore = game.score;
      console.log('New board:', newBoard);
      console.log('New score:', newScore);
      
      setBoard(newBoard);
      setScore(newScore);
      
      // Check if player has won (reached 2048 tile)
      const hasWonGame = newBoard.some(row => row.some(tile => tile === 2048));
      if (hasWonGame && !hasWon) {
        console.log('You won! Reached 2048!');
        setHasWon(true);
      }
      
      if (game.gameOver()) {
        console.log('Game over!');
        setGameOver(true);
        setAiEnabled(false); // Disable AI when game is over
      }
    }
  }, [game, aiThinking, hasWon]);

  // Handle keyboard input
  const handleKeyPress = useCallback((event) => {
    if (!game || gameOver || aiThinking) return;

    let direction = -1;
    switch(event.key) {
      case 'ArrowUp':
        direction = 1;
        break;
      case 'ArrowRight':
        direction = 2;
        break;
      case 'ArrowDown':
        direction = 3;
        break;
      case 'ArrowLeft':
        direction = 0;
        break;
      default:
        return;
    }

    event.preventDefault();
    makeMove(direction);
  }, [game, gameOver, aiThinking, makeMove]);

  // Reset game
  const resetGame = useCallback(() => {
    if (!game) return;
    
    game.reset();
    setBoard(game.getBoard());
    setScore(game.score);
    setGameOver(false);
    setHasWon(false);
    setAiEnabled(false);
    setAiThinking(false);
  }, [game]);

  // AI move function
  const makeAIMove = useCallback(async () => {
    if (!game || !ai || gameOver || aiThinking) {
      return;
    }

    // Check if game is already over before AI tries to move
    if (game.gameOver()) {
      setGameOver(true);
      setAiEnabled(false);
      return;
    }

    setAiThinking(true);
    
    try {
      // Update AI with current game state
      const currentState = game.currentState();
      ai.root = new Node(currentState, MAX_PLAYER);
      ai.setSimulator(game);
      
      // Compute AI decision
      const direction = ai.computeDecision();
      console.log('AI decided on direction:', direction);
      
      if (direction !== null && direction !== undefined) {
        makeMove(direction);
      } else {
        // No valid moves found - game over
        setGameOver(true);
        setAiEnabled(false);
      }
    } catch (error) {
      console.error('AI move error:', error);
      setAiEnabled(false); // Disable AI on error
    } finally {
      setAiThinking(false);
    }
  }, [game, ai, gameOver, aiThinking, makeMove]);

  // Toggle AI
  const toggleAI = useCallback(() => {
    setAiEnabled(!aiEnabled);
  }, [aiEnabled]);

  // AI auto-play effect
  useEffect(() => {
    if (aiEnabled && !gameOver && !aiThinking) {
      const timer = setTimeout(() => {
        makeAIMove();
      }, 10);

      return () => clearTimeout(timer);
    }
  }, [aiEnabled, gameOver, aiThinking, makeAIMove, board]); // Include board to trigger when game state changes

  // Prevent AI from running when user is manually playing
  const [userInteracting, setUserInteracting] = useState(false);
  
  // Track user interaction
  useEffect(() => {
    const handleUserInput = () => {
      setUserInteracting(true);
      setAiEnabled(false); // Disable AI when user interacts
      
      // Re-enable AI after a delay if it was previously enabled
      const timer = setTimeout(() => {
        setUserInteracting(false);
      }, 2000); // 2 second delay
      
      return () => clearTimeout(timer);
    };

    // Only listen for arrow key presses and game board interactions
    window.addEventListener('keydown', (event) => {
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(event.key)) {
        handleUserInput();
      }
    });

    return () => {
      window.removeEventListener('keydown', handleUserInput);
    };
  }, []);

  // Touch/swipe handling
  const [touchStart, setTouchStart] = useState({ x: 0, y: 0 });
  const [touchEnd, setTouchEnd] = useState({ x: 0, y: 0 });

  // Minimum distance for a swipe
  const minSwipeDistance = 50;

  const onTouchStart = (e) => {
    const touch = e.targetTouches[0];
    setTouchStart({ x: touch.clientX, y: touch.clientY });
    setTouchEnd({ x: touch.clientX, y: touch.clientY });
  };

  const onTouchMove = (e) => {
    const touch = e.targetTouches[0];
    setTouchEnd({ x: touch.clientX, y: touch.clientY });
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    
    const deltaX = touchStart.x - touchEnd.x;
    const deltaY = touchStart.y - touchEnd.y;
    
    const absDeltaX = Math.abs(deltaX);
    const absDeltaY = Math.abs(deltaY);
    
    // Determine if it's a horizontal or vertical swipe
    if (absDeltaX > absDeltaY) {
      // Horizontal swipe
      if (absDeltaX > minSwipeDistance) {
        // Disable AI when user swipes
        setAiEnabled(false);
        if (deltaX > 0) {
          makeMove(0); // Left swipe
        } else {
          makeMove(2); // Right swipe
        }
      }
    } else {
      // Vertical swipe
      if (absDeltaY > minSwipeDistance) {
        // Disable AI when user swipes
        setAiEnabled(false);
        if (deltaY > 0) {
          makeMove(1); // Up swipe
        } else {
          makeMove(3); // Down swipe
        }
      }
    }
  };

  // Add keyboard event listener
  useEffect(() => {
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [handleKeyPress]);

    return (
    <div className="flex flex-col items-center justify-start pt-4 pb-4 px-4">
      {/* Header */}
      <div className="text-center mb-6">
        <h1 className="text-4xl font-bold text-[#FFFAEC] mb-2 mt-2">
          {hasWon ? "You Won!" : "2048 Game + AI Demo"}
        </h1>
        {gameOver && (
          <p className="text-red-400 text-lg mt-2">Game Over! Press Reset to play again.</p>
        )}
        {hasWon && !gameOver && (
          <p className="text-green-400 text-lg mt-2">Congratulations! You reached 2048!</p>
        )}
      </div>

      {/* Game Container with Left and Right Panels */}
      <div className="flex flex-col lg:flex-row gap-6 w-full max-w-6xl mb-8 items-center justify-center">
        {/* Left Panel - AI/Score/Reset */}
        <div className="w-full lg:w-64">
          <div className="bg-slate-800 rounded-lg p-4 border border-gray-600 flex flex-col gap-4">
            {/* Score Display */}
            <div className="bg-slate-700 rounded-md px-4 py-3 flex items-center justify-center">
              <div className="text-[#FFFAEC] text-xl font-semibold">
                Score: <span className="text-[#F5ECD5]">{score}</span>
              </div>
            </div>
            
            {/* AI and Reset Buttons */}
            <div className="flex gap-3">
              {/* AI Button */}
              <button
                onClick={toggleAI}
                disabled={aiThinking}
                className={`w-1/2 h-12 rounded-md font-medium transition-all duration-200 text-white flex items-center justify-center ${
                  aiEnabled 
                    ? aiThinking
                      ? 'bg-yellow-600 cursor-not-allowed'
                      : 'bg-green-600 hover:bg-green-700'
                    : 'bg-red-600 hover:bg-red-700'
                }`}
              >
                {aiThinking ? '🤔' : 'AI'}
              </button>
              
              {/* Reset Button */}
              <button
                onClick={resetGame}
                className="w-1/2 h-12 rounded-md font-medium transition-all duration-200 bg-red-600 hover:bg-red-700 text-white flex items-center justify-center"
              >
                Reset
              </button>
            </div>
          </div>
        </div>

        {/* Game Board */}
        <div className="w-full max-w-[500px] aspect-square flex-shrink-0">
          <div 
            className="grid grid-cols-4 gap-3 bg-slate-800 p-4 rounded-xl border border-gray-600 shadow-lg h-full select-none"
            onTouchStart={onTouchStart}
            onTouchMove={onTouchMove}
            onTouchEnd={onTouchEnd}
            style={{ touchAction: 'none' }}
          >
            {board.map((row, i) =>
              row.map((tile, j) => (
                <div
                  key={`${i}-${j}`}
                  className={`aspect-square rounded-lg flex items-center justify-center text-lg font-bold transition-all duration-200 ${getTileColor(tile)} ${getTextColor(tile)}`}
                >
                  {tile || ''}
                </div>
              ))
            )}
          </div>
        </div>

        {/* Right Panel - Arrow Controls */}
        <div className="w-full lg:w-64">
          <div className="bg-slate-800 rounded-lg p-4 border border-gray-600 flex flex-col items-center justify-center gap-4">
            {/* Top Row: Undo, Up, Redo */}
            <div className="flex gap-3 items-center">
              {/* Undo Button */}
              <button
                onClick={() => {
                  if (game && game.undo()) {
                    setBoard(game.getBoard());
                    setScore(game.score);
                    setGameOver(false);
                  }
                }}
                disabled={gameOver}
                className="w-16 h-16 rounded-md font-medium transition-all duration-200 bg-purple-600 hover:bg-purple-700 text-white disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
              >
                ↶
              </button>
              
              {/* Up Arrow */}
              <button
                onClick={() => {
                  setAiEnabled(false);
                  makeMove(1);
                }}
                disabled={gameOver}
                className="w-16 h-16 rounded-md font-medium transition-all duration-200 bg-[#F5ECD5] text-gray-900 shadow-lg hover:bg-[#E6D4B8] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center text-lg"
              >
                ↑
              </button>
              
              {/* Redo Button */}
              <button
                onClick={() => {
                  if (game && typeof game.redo === 'function' && game.redo()) {
                    setBoard(game.getBoard());
                    setScore(game.score);
                    setGameOver(false);
                  } else {
                    console.log('Redo not available - game instance may be outdated');
                  }
                }}
                disabled={gameOver}
                className="w-16 h-16 rounded-md font-medium transition-all duration-200 bg-blue-600 hover:bg-blue-700 text-white disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
              >
                ↷
              </button>
            </div>
            
            {/* Bottom Row: Left, Down, Right */}
            <div className="flex gap-3 items-center">
              {/* Left Arrow */}
              <button
                onClick={() => {
                  setAiEnabled(false);
                  makeMove(0);
                }}
                disabled={gameOver}
                className="w-16 h-16 rounded-md font-medium transition-all duration-200 bg-[#F5ECD5] text-gray-900 shadow-lg hover:bg-[#E6D4B8] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center text-lg"
              >
                ←
              </button>
              
              {/* Down Arrow */}
              <button
                onClick={() => {
                  setAiEnabled(false);
                  makeMove(3);
                }}
                disabled={gameOver}
                className="w-16 h-16 rounded-md font-medium transition-all duration-200 bg-[#F5ECD5] text-gray-900 shadow-lg hover:bg-[#E6D4B8] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center text-lg"
              >
                ↓
              </button>
              
              {/* Right Arrow */}
              <button
                onClick={() => {
                  setAiEnabled(false);
                  makeMove(2);
                }}
                disabled={gameOver}
                className="w-16 h-16 rounded-md font-medium transition-all duration-200 bg-[#F5ECD5] text-gray-900 shadow-lg hover:bg-[#E6D4B8] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center text-lg"
              >
                →
              </button>
            </div>
          </div>
        </div>
      </div>


      {/* Instructions */}
      <div className="mt-2 text-center text-sm text-[#FFFAEC]/60 max-w-[500px]">
        <p className="mb-2">Use arrow keys, swipe on the game board, or click buttons to move tiles</p>
        <p>Combine tiles with the same number to reach 2048!</p>
      </div>
    </div>
  );
};

export default TwentyFortyEight;