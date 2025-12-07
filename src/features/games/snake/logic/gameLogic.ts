export interface Position {
  x: number;
  y: number;
}

export type Direction = 'UP' | 'DOWN' | 'LEFT' | 'RIGHT';

export interface GameState {
  snake: Position[];
  food: Position;
  direction: Direction;
  nextDirection: Direction;
  score: number;
  gameOver: boolean;
  gameStarted: boolean;
}

export const GRID_SIZE = 30;
export const CELL_SIZE = 20;

/**
 * Initialize game state
 */
export const initGameState = (): GameState => {
  const initialSnake: Position[] = [
    { x: 15, y: 15 },
    { x: 15, y: 16 },
    { x: 15, y: 17 },
  ];

  return {
    snake: initialSnake,
    food: generateFood(initialSnake),
    direction: 'UP',
    nextDirection: 'UP',
    score: 0,
    gameOver: false,
    gameStarted: false,
  };
};

/**
 * Generate random food position that doesn't overlap with snake
 */
export const generateFood = (snake: Position[]): Position => {
  let food: Position;
  do {
    food = {
      x: Math.floor(Math.random() * GRID_SIZE),
      y: Math.floor(Math.random() * GRID_SIZE),
    };
  } while (snake.some((segment) => segment.x === food.x && segment.y === food.y));
  return food;
};

/**
 * Check if direction change is valid (can't reverse into itself)
 */
export const isValidDirection = (current: Direction, newDir: Direction): boolean => {
  const opposites: Record<Direction, Direction> = {
    UP: 'DOWN',
    DOWN: 'UP',
    LEFT: 'RIGHT',
    RIGHT: 'LEFT',
  };
  return newDir !== opposites[current];
};

/**
 * Move snake based on current direction
 */
export const moveSnake = (snake: Position[], direction: Direction): Position[] => {
  const head = { ...snake[0] };

  switch (direction) {
    case 'UP':
      head.y -= 1;
      break;
    case 'DOWN':
      head.y += 1;
      break;
    case 'LEFT':
      head.x -= 1;
      break;
    case 'RIGHT':
      head.x += 1;
      break;
  }

  return [head, ...snake.slice(0, -1)];
};

/**
 * Check if snake has eaten food
 */
export const checkFoodCollision = (head: Position, food: Position): boolean => {
  return head.x === food.x && head.y === food.y;
};

/**
 * Check if snake has collided with walls or itself
 */
export const checkCollision = (snake: Position[]): boolean => {
  const head = snake[0];

  // Check wall collision
  if (head.x < 0 || head.x >= GRID_SIZE || head.y < 0 || head.y >= GRID_SIZE) {
    return true;
  }

  // Check self collision
  for (let i = 1; i < snake.length; i++) {
    if (snake[i].x === head.x && snake[i].y === head.y) {
      return true;
    }
  }

  return false;
};

/**
 * Grow snake by adding a new segment
 */
export const growSnake = (snake: Position[]): Position[] => {
  const tail = snake[snake.length - 1];
  return [...snake, { ...tail }];
};

