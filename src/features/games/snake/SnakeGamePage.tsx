import { useState, useEffect, useCallback, useRef } from 'react';
import { useSnakeStore } from './store';
import { SnakeGameBoard, GameStats } from './components';
import {
  initGameState,
  moveSnake,
  checkFoodCollision,
  checkCollision,
  growSnake,
  generateFood,
  isValidDirection,
  type GameState,
  type Direction,
} from './logic';
import { useSEO } from '@/utils/hooks';
import { useTranslation } from '@/utils/i18n';
import { gameSounds } from '@/utils/sounds/gameSounds';

const GAME_SPEED = 150; // milliseconds

const SnakeGamePage = () => {
  const { t } = useTranslation();
  const { highScore, setScore, resetScore, updateHighScore } = useSnakeStore();
  const [gameState, setGameState] = useState<GameState>(initGameState());
  const gameLoopRef = useRef<number | null>(null);

  // SEO
  useSEO({
    title: t('nav.games') === 'Games' ? 'Snake Game - Dashverse' : 'لعبة الثعبان - Dashverse',
    description: t('nav.games') === 'Games' 
      ? 'Play the classic Snake game with 3D graphics. Control the snake, eat food, and beat your high score!'
      : 'العب لعبة الثعبان الكلاسيكية مع رسومات ثلاثية الأبعاد. تحكم بالثعبان، كل الطعام، واكسر رقمك القياسي!',
    keywords: 'snake game, 3d snake, classic game, arcade game',
    ogTitle: t('nav.games') === 'Games' ? 'Snake Game - Dashverse' : 'لعبة الثعبان - Dashverse',
    ogDescription: t('nav.games') === 'Games'
      ? 'Play the classic Snake game with 3D graphics'
      : 'العب لعبة الثعبان الكلاسيكية مع رسومات ثلاثية الأبعاد',
    ogType: 'website',
  });

  // Game loop
  const runGameLoop = useCallback(() => {
    setGameState((prevState) => {
      if (prevState.gameOver || !prevState.gameStarted) {
        return prevState;
      }

      // Update direction
      const currentDirection = prevState.nextDirection;
      let newSnake = moveSnake(prevState.snake, currentDirection);
      let newFood = prevState.food;
      let newScore = prevState.score;
      let gameOver = false;

      // Check food collision
      if (checkFoodCollision(newSnake[0], newFood)) {
        newSnake = growSnake(newSnake);
        newFood = generateFood(newSnake);
        newScore = newScore + 10;
        setScore(newScore);
        // Play eating sound
        gameSounds.playEatSound();
      }

      // Check collision
      if (checkCollision(newSnake)) {
        gameOver = true;
        if (newScore > highScore) {
          updateHighScore(newScore);
        }
        // Play game over sound
        gameSounds.playGameOverSound();
      }

      return {
        ...prevState,
        snake: newSnake,
        food: newFood,
        direction: currentDirection,
        score: newScore,
        gameOver,
      };
    });
  }, [setScore, highScore, updateHighScore]);

  // Start game loop
  useEffect(() => {
    if (gameState.gameStarted && !gameState.gameOver) {
      const interval = setInterval(runGameLoop, GAME_SPEED);
      gameLoopRef.current = interval;
      return () => {
        if (interval) clearInterval(interval);
        gameLoopRef.current = null;
      };
    } else {
      if (gameLoopRef.current) {
        clearInterval(gameLoopRef.current);
        gameLoopRef.current = null;
      }
    }
  }, [gameState.gameStarted, gameState.gameOver, runGameLoop]);

  // Handle direction change
  const handleDirectionChange = useCallback(
    (newDirection: Direction) => {
      setGameState((prevState) => {
        // Start game on first direction input
        if (!prevState.gameStarted) {
          return {
            ...prevState,
            gameStarted: true,
            nextDirection: newDirection,
          };
        }

        // Validate direction change
        if (isValidDirection(prevState.direction, newDirection)) {
          return {
            ...prevState,
            nextDirection: newDirection,
          };
        }

        return prevState;
      });
    },
    []
  );

  // Start/Restart game
  const handleGameStart = useCallback(() => {
    resetScore();
    setGameState(initGameState());
  }, [resetScore]);

  // Sync score with store
  useEffect(() => {
    setScore(gameState.score);
  }, [gameState.score, setScore]);

  return (
    <main className="flex flex-col h-screen overflow-hidden p-3 md:p-6">
      {/* Header */}
      <header className="text-center mb-2 md:mb-4 shrink-0">
        <h1 className="text-2xl md:text-4xl font-bold mb-1 md:mb-2 text-gray-900 dark:text-white">
          {t('nav.games') === 'Games' ? 'Snake Game' : 'لعبة الثعبان'}
        </h1>
        <p className="text-xs md:text-sm text-gray-600 dark:text-gray-300">
          {t('nav.games') === 'Games'
            ? 'Use arrow keys (↑↓←→) or WASD to control the snake. Eat the red food to grow!'
            : 'استخدم مفاتيح الأسهم (↑↓←→) أو WASD للتحكم بالثعبان. كل الطعام الأحمر لتنمو!'}
        </p>
      </header>

      {/* Game Stats */}
      <div className="shrink-0 mb-2 md:mb-4">
        <GameStats
          score={gameState.score}
          highScore={highScore}
          gameOver={gameState.gameOver}
        />
      </div>

      {/* Game Board - Takes remaining space */}
      <div className="flex-1 flex items-center justify-center min-h-0">
        <SnakeGameBoard
          snake={gameState.snake}
          food={gameState.food}
          gameOver={gameState.gameOver}
          onDirectionChange={handleDirectionChange}
          onGameStart={handleGameStart}
        />
      </div>

      {/* Instructions */}
      {!gameState.gameStarted && !gameState.gameOver && (
        <div className="text-center text-gray-600 dark:text-gray-400 shrink-0 mt-2">
          <p className="text-sm md:text-lg font-medium">
            {t('common.error') === 'Error' ? 'Press any arrow key to start!' : 'اضغط على أي سهم للبدء!'}
          </p>
        </div>
      )}
    </main>
  );
};

export default SnakeGamePage;
