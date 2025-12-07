import { useEffect, useRef, useCallback, useState } from 'react';
import type { Position, Direction } from '../logic/gameLogic';
import { useTranslation } from '@/utils/i18n';
import { GRID_SIZE } from '../logic/gameLogic';

interface SnakeGameBoardProps {
  snake: Position[];
  food: Position;
  gameOver: boolean;
  onDirectionChange: (direction: Direction) => void;
  onGameStart: () => void;
}

const GAP_SIZE = 2; // Gap between cells in pixels

// Calculate cell size based on viewport dimensions
const calculateCellSize = (): number => {
  if (typeof window === 'undefined') return 20;
  
  // Account for header, stats, padding, and instructions
  const headerHeight = 120; // Header + stats + instructions
  const padding = 48; // 24px padding on each side
  
  // Calculate available viewport dimensions
  const availableWidth = window.innerWidth - padding;
  const availableHeight = window.innerHeight - headerHeight - padding;
  
  // Account for gaps between cells (GRID_SIZE - 1 gaps in each direction)
  const totalGapWidth = (GRID_SIZE - 1) * GAP_SIZE;
  const totalGapHeight = (GRID_SIZE - 1) * GAP_SIZE;
  
  // Calculate cell size based on both width and height
  // Use the smaller dimension to ensure it fits in viewport
  const cellSizeByWidth = Math.floor((availableWidth - totalGapWidth) / GRID_SIZE);
  const cellSizeByHeight = Math.floor((availableHeight - totalGapHeight) / GRID_SIZE);
  
  // Use the smaller value to ensure it fits in both dimensions
  const calculatedCellSize = Math.min(cellSizeByWidth, cellSizeByHeight);
  
  // Set minimum and maximum cell sizes
  const minCellSize = 10;
  const maxCellSizeLimit = 25;
  
  return Math.max(minCellSize, Math.min(calculatedCellSize, maxCellSizeLimit));
};

const SnakeGameBoard = ({
  snake,
  food,
  gameOver,
  onDirectionChange,
  onGameStart,
}: SnakeGameBoardProps) => {
  const { t } = useTranslation();
  const boardRef = useRef<HTMLDivElement>(null);
  const directionRef = useRef<Direction | null>(null);
  const [cellSize, setCellSize] = useState(calculateCellSize());

  // Update cell size on window resize
  useEffect(() => {
    const handleResize = () => {
      setCellSize(calculateCellSize());
    };

    window.addEventListener('resize', handleResize);
    handleResize(); // Initial calculation

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Handle keyboard input
  const handleKeyPress = useCallback(
    (e: KeyboardEvent) => {
      if (gameOver) {
        if (e.key === ' ' || e.key === 'Enter') {
          onGameStart();
        }
        return;
      }

      let newDirection: Direction | null = null;

      switch (e.key) {
        case 'ArrowUp':
          newDirection = 'UP';
          break;
        case 'ArrowDown':
          newDirection = 'DOWN';
          break;
        case 'ArrowLeft':
          newDirection = 'LEFT';
          break;
        case 'ArrowRight':
          newDirection = 'RIGHT';
          break;
        case 'w':
        case 'W':
          newDirection = 'UP';
          break;
        case 's':
        case 'S':
          newDirection = 'DOWN';
          break;
        case 'a':
        case 'A':
          newDirection = 'LEFT';
          break;
        case 'd':
        case 'D':
          newDirection = 'RIGHT';
          break;
      }

      if (newDirection && newDirection !== directionRef.current) {
        directionRef.current = newDirection;
        onDirectionChange(newDirection);
      }
    },
    [gameOver, onDirectionChange, onGameStart]
  );

  useEffect(() => {
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [handleKeyPress]);

  // Calculate board size including gaps (needed for bounds checking)
  const boardSize = GRID_SIZE * cellSize + (GRID_SIZE - 1) * GAP_SIZE;

  // Render snake segment with 3D effect
  const renderSnakeSegment = (position: Position, index: number, isHead: boolean) => {
    const depth = isHead ? 8 : 4 - Math.min(index * 0.3, 3);
    const scale = isHead ? 1.1 : 1 - Math.min(index * 0.02, 0.1);
    const brightness = isHead ? 100 : 100 - Math.min(index * 3, 30);

    // Calculate position with gaps
    // Ensure position doesn't exceed board bounds
    const maxX = GRID_SIZE - 1;
    const maxY = GRID_SIZE - 1;
    const safeX = Math.min(Math.max(0, position.x), maxX);
    const safeY = Math.min(Math.max(0, position.y), maxY);
    
    // Calculate position ensuring it stays within board bounds
    const left = safeX * (cellSize + GAP_SIZE);
    const top = safeY * (cellSize + GAP_SIZE);
    
    // Calculate maximum allowed position based on board size
    const maxLeft = boardSize - cellSize;
    const maxTop = boardSize - cellSize;
    
    // Clamp position to ensure snake stays within board
    const clampedLeft = Math.min(left, maxLeft);
    const clampedTop = Math.min(top, maxTop);

    return (
      <div
        key={`${position.x}-${position.y}-${index}`}
        className="absolute transition-all duration-100 ease-out"
        style={{
          left: `${Math.max(0, clampedLeft)}px`,
          top: `${Math.max(0, clampedTop)}px`,
          width: `${cellSize}px`,
          height: `${cellSize}px`,
          transform: `translateZ(${depth}px) scale(${scale})`,
          transformStyle: 'preserve-3d',
          maxWidth: `${cellSize}px`, // Prevent overflow
          maxHeight: `${cellSize}px`, // Prevent overflow
        }}
      >
        <div
          className="w-full h-full rounded-lg border-2 transition-all duration-100"
          style={{
            background: `linear-gradient(135deg, 
              hsl(142, ${isHead ? 70 : 60}%, ${brightness}%), 
              hsl(142, ${isHead ? 80 : 70}%, ${brightness - 10}%))`,
            boxShadow: `
              inset 0 2px 4px rgba(255, 255, 255, 0.3),
              inset 0 -2px 4px rgba(0, 0, 0, 0.2),
              0 ${depth}px ${depth * 2}px rgba(0, 0, 0, 0.3),
              0 0 0 1px rgba(0, 0, 0, 0.1)
            `,
            borderColor: isHead
              ? 'rgba(255, 255, 255, 0.5)'
              : 'rgba(255, 255, 255, 0.2)',
          }}
        >
          {/* 3D shine effect */}
          <div
            className="absolute inset-0 rounded-lg opacity-30"
            style={{
              background: 'linear-gradient(135deg, rgba(255,255,255,0.4) 0%, transparent 50%)',
            }}
          />
          {/* Eyes for head */}
          {isHead && (
            <div className="absolute inset-0 flex items-center justify-center gap-2">
              <div className="w-1.5 h-1.5 bg-white rounded-full shadow-lg" />
              <div className="w-1.5 h-1.5 bg-white rounded-full shadow-lg" />
            </div>
          )}
        </div>
      </div>
    );
  };

  // Render food with 3D effect
  const renderFood = () => {
    // Calculate position with gaps
    // Ensure position doesn't exceed board bounds
    const maxX = GRID_SIZE - 1;
    const maxY = GRID_SIZE - 1;
    const safeX = Math.min(Math.max(0, food.x), maxX);
    const safeY = Math.min(Math.max(0, food.y), maxY);
    
    // Calculate position ensuring it stays within board bounds
    const left = safeX * (cellSize + GAP_SIZE);
    const top = safeY * (cellSize + GAP_SIZE);
    
    // Calculate maximum allowed position based on board size
    const maxLeft = boardSize - cellSize;
    const maxTop = boardSize - cellSize;
    
    // Clamp position to ensure food stays within board
    const clampedLeft = Math.min(left, maxLeft);
    const clampedTop = Math.min(top, maxTop);

    return (
      <div
        className="absolute animate-pulse transition-all duration-200"
        style={{
          left: `${Math.max(0, clampedLeft)}px`,
          top: `${Math.max(0, clampedTop)}px`,
          width: `${cellSize}px`,
          height: `${cellSize}px`,
          transform: 'translateZ(10px)',
          transformStyle: 'preserve-3d',
          maxWidth: `${cellSize}px`, // Prevent overflow
          maxHeight: `${cellSize}px`, // Prevent overflow
        }}
      >
        <div
          className="w-full h-full rounded-full border-2"
          style={{
            background: `radial-gradient(circle at 30% 30%, 
              hsl(0, 70%, 60%), 
              hsl(0, 80%, 45%))`,
            boxShadow: `
              inset 0 2px 4px rgba(255, 255, 255, 0.4),
              inset 0 -2px 4px rgba(0, 0, 0, 0.3),
              0 8px 16px rgba(255, 0, 0, 0.4),
              0 0 0 2px rgba(255, 255, 255, 0.2)
            `,
            borderColor: 'rgba(255, 255, 255, 0.5)',
          }}
        >
          {/* Shine effect */}
          <div
            className="absolute inset-0 rounded-full"
            style={{
              background: 'radial-gradient(circle at 30% 30%, rgba(255,255,255,0.6), transparent)',
            }}
          />
        </div>
      </div>
    );
  };

  return (
    <div
      ref={boardRef}
      className="relative mx-auto bg-gradient-to-br from-gray-800 via-gray-900 to-gray-800 rounded-xl border-2 border-gray-700 shadow-2xl"
      style={{
        width: `${boardSize}px`,
        height: `${boardSize}px`,
        maxWidth: 'calc(100vw - 48px)', // Fit within viewport width
        maxHeight: 'calc(100vh - 200px)', // Fit within viewport height
        aspectRatio: '1 / 1', // Maintain square aspect ratio
        perspective: '1000px',
        transformStyle: 'preserve-3d',
        boxShadow: `
          inset 0 0 50px rgba(0, 0, 0, 0.5),
          0 20px 60px rgba(0, 0, 0, 0.4)
        `,
        overflow: 'hidden', // Ensure food doesn't overflow the board
      }}
      tabIndex={0}
    >
      {/* Grid background */}
      <div
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: `
            linear-gradient(rgba(255, 255, 255, 0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255, 255, 255, 0.1) 1px, transparent 1px)
          `,
          backgroundSize: `${cellSize + GAP_SIZE}px ${cellSize + GAP_SIZE}px`,
        }}
      />

      {/* Game content with 3D transform */}
      <div
        className="relative w-full h-full"
        style={{
          transform: 'rotateX(5deg)',
          transformStyle: 'preserve-3d',
          overflow: 'hidden', // Ensure content doesn't overflow
          width: '100%',
          height: '100%',
        }}
      >
        {/* Snake */}
        {snake.map((segment, index) =>
          renderSnakeSegment(segment, index, index === 0)
        )}

        {/* Food */}
        {renderFood()}
      </div>

      {/* Game Over Overlay */}
      {gameOver && (
        <div
          className="absolute inset-0 flex flex-col items-center justify-center bg-black/80 backdrop-blur-sm z-10"
          style={{
            transform: 'translateZ(20px)',
          }}
        >
          <div
            className="text-white text-4xl font-bold mb-4 transform"
            style={{
              textShadow: '0 4px 8px rgba(0, 0, 0, 0.5), 0 0 20px rgba(255, 0, 0, 0.5)',
            }}
          >
            {t('common.error') === 'Error' ? 'Game Over!' : 'انتهت اللعبة!'}
          </div>
          <p className="text-white/80 mb-6">
            {t('common.error') === 'Error' ? 'Press Space or Enter to restart' : 'اضغط Space أو Enter لإعادة التشغيل'}
          </p>
        </div>
      )}
    </div>
  );
};

export default SnakeGameBoard;

