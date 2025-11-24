import { useAppStore } from '@/stores/appStore';
import { useFoodStore } from '@/features/food';
import { useTicTacToeStore } from '@/features/games/tictactoe/store';
import { useSnakeStore } from '@/features/games/snake/store';
import { StatCard, QuickLink } from './components';

const DashboardHome = () => {
  const { theme } = useAppStore();
  const { favorites } = useFoodStore();
  const { score: tictactoeScore } = useTicTacToeStore();
  const { highScore: snakeHighScore } = useSnakeStore();

  const totalWins = tictactoeScore.player1 + tictactoeScore.player2;

  return (
    <div className="p-6 space-y-6">
      {/* Welcome Section */}
      <div className="bg-linear-to-r from-blue-600 to-blue-800 rounded-lg shadow-lg p-8 text-white">
        <h1 className="text-4xl font-bold mb-2">Welcome to Dashboard</h1>
        <p className="text-blue-100 text-lg">
          Your central hub for weather, news, games, and more
        </p>
        <div className="mt-4 flex items-center space-x-2">
          <span className="text-sm">Current theme:</span>
          <span className="px-3 py-1 bg-white/20 rounded-full text-sm font-medium capitalize">
            {theme}
          </span>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Favorite Foods"
          value={favorites.length}
          icon="🍔"
          description="Saved favorites"
        />
        <StatCard
          title="Tic Tac Toe Wins"
          value={totalWins}
          icon="⭕"
          description={`Player 1: ${tictactoeScore.player1} | Player 2: ${tictactoeScore.player2}`}
        />
        <StatCard
          title="Snake High Score"
          value={snakeHighScore}
          icon="🐍"
          description="Best score achieved"
        />
        <StatCard
          title="Features"
          value="5"
          icon="✨"
          description="Available modules"
        />
      </div>

      {/* Quick Links */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Quick Links</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <QuickLink
            to="/weather"
            label="Weather"
            icon="🌤️"
            description="Check current weather conditions"
          />
          <QuickLink
            to="/news"
            label="News"
            icon="📰"
            description="Stay updated with latest news"
          />
          <QuickLink
            to="/games/tictactoe"
            label="Tic Tac Toe"
            icon="⭕"
            description="Play a classic game"
          />
          <QuickLink
            to="/games/snake"
            label="Snake Game"
            icon="🐍"
            description="Test your skills"
          />
          <QuickLink
            to="/food"
            label="Food"
            icon="🍔"
            description="Explore food options"
          />
        </div>
      </div>

      {/* Recent Activity or Info Section */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md dark:shadow-gray-900 p-6">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Getting Started</h2>
        <div className="space-y-3 text-gray-600 dark:text-gray-300">
          <div className="flex items-start space-x-3">
            <span className="text-blue-600 dark:text-blue-400 font-bold">1.</span>
            <p>Navigate through the sidebar to explore different features</p>
          </div>
          <div className="flex items-start space-x-3">
            <span className="text-blue-600 dark:text-blue-400 font-bold">2.</span>
            <p>Your preferences and data are automatically saved</p>
          </div>
          <div className="flex items-start space-x-3">
            <span className="text-blue-600 dark:text-blue-400 font-bold">3.</span>
            <p>Use the theme toggle to switch between light and dark modes</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardHome;

