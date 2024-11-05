"use client";

import { useState, useEffect } from 'react';

const GRID_SIZE = 20;
const CELL_SIZE = 24;

const SnakeGame = () => {
  const [snake, setSnake] = useState([[5, 5]]);
  const [direction, setDirection] = useState([0, -1]);
  const [fruit, setFruit] = useState<[number, number] | null>(null);
  const [score, setScore] = useState(0);
  const [isGameOver, setIsGameOver] = useState(false);
  const [isGameStarted, setIsGameStarted] = useState(false);

  useEffect(() => {
    setFruit([Math.floor(Math.random() * GRID_SIZE), Math.floor(Math.random() * GRID_SIZE)]);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      e.preventDefault();
      if (isGameOver) return;

      if (!isGameStarted) setIsGameStarted(true);

      if (e.key === 'ArrowUp' && direction[0] !== 1) setDirection([-1, 0]);
      else if (e.key === 'ArrowDown' && direction[0] !== -1) setDirection([1, 0]);
      else if (e.key === 'ArrowLeft' && direction[1] !== 1) setDirection([0, -1]);
      else if (e.key === 'ArrowRight' && direction[1] !== -1) setDirection([0, 1]);
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [direction, isGameOver, isGameStarted]);

  useEffect(() => {
    if (!isGameStarted || isGameOver) return;
    const interval = setInterval(moveSnake, 200);
    return () => clearInterval(interval);
  }, [snake, direction, isGameStarted, isGameOver]);

  const moveSnake = () => {
    if (!fruit) return;

    const newSnake = [...snake];
    const newHead = [
      newSnake[0][0] + direction[0],
      newSnake[0][1] + direction[1],
    ];

    if (newHead[0] < 0 || newHead[0] >= GRID_SIZE || newHead[1] < 0 || newHead[1] >= GRID_SIZE) {
      handleGameOver();
      return;
    }

    if (newSnake.some(([r, c]) => r === newHead[0] && c === newHead[1])) {
      handleGameOver();
      return;
    }

    if (newHead[0] === fruit[0] && newHead[1] === fruit[1]) {
      setScore(score + 1);
      setFruit([Math.floor(Math.random() * GRID_SIZE), Math.floor(Math.random() * GRID_SIZE)]);
      newSnake.unshift(newHead);
    } else {
      newSnake.pop();
      newSnake.unshift(newHead);
    }

    setSnake(newSnake);
  };

  const handleGameOver = () => {
    setIsGameOver(true);
    setIsGameStarted(false);
  };

  const resetGame = () => {
    setSnake([[5, 5]]);
    setDirection([0, -1]);
    setFruit([Math.floor(Math.random() * GRID_SIZE), Math.floor(Math.random() * GRID_SIZE)]);
    setScore(0);
    setIsGameOver(false);
    setIsGameStarted(false);
  };

  return (
   
    <div className="flex flex-col items-center mt-10">
      <div className="text-2xl font-bold mb-4 fixed top-2 bg-yellow-500 text-black px-4 py-2 rounded-full shadow-md">Score: {score}</div>
      <div
        className="relative grid overflow-hidden justify-center"
        style={{
          gridTemplateColumns: `repeat(${GRID_SIZE}, ${CELL_SIZE}px)`,
          gridTemplateRows: `repeat(${GRID_SIZE}, ${CELL_SIZE}px)`,
          gap: '2px',
          backgroundColor: '#1e1e1e',
          padding: '15px',
          borderRadius: '12px',
          boxShadow: '0px 4px 15px rgba(0, 0, 0, 0.6)',
          width: `${GRID_SIZE * (CELL_SIZE + 2)}px`,
          height: `${GRID_SIZE * (CELL_SIZE + 2)}px`,
        }}
      >
        {Array.from(Array(GRID_SIZE)).map((_, row) =>
          Array.from(Array(GRID_SIZE)).map((_, col) => (
            <div
              key={`${row}-${col}`}
              className={`w-${CELL_SIZE} h-${CELL_SIZE} rounded-md transition-transform duration-150 ${
                snake.some(([r, c]) => r === row && c === col)
                  ? 'bg-gradient-to-br from-green-400 to-green-700 shadow-md'
                  : fruit && fruit[0] === row && fruit[1] === col
                  ? 'bg-gradient-to-br from-red-500 to-red-700 shadow-lg animate-pulse'
                  : 'bg-gray-700'
              }`}
            ></div>
          ))
        )}

        {isGameOver && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black bg-opacity-75 text-white">
            <h2 className="text-4xl font-bold mb-4 text-red-500 drop-shadow-lg">Game Over</h2>
            <p className="text-2xl mb-6">Your Score: <span className="text-yellow-400">{score}</span></p>
            <button
              onClick={resetGame}
              className="px-6 py-3 bg-gradient-to-r from-green-500 to-green-700 text-white font-semibold rounded-lg shadow-md hover:scale-105 transform transition-transform duration-300"
            >
              Try Again
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default SnakeGame;
