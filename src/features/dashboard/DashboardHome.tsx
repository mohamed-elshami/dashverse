import { useAppStore } from '@/stores/appStore';
import { useFoodStore } from '@/features/food';
import { useTicTacToeStore } from '@/features/games/tictactoe/store';
import { useSnakeStore } from '@/features/games/snake/store';
import { StatCard, QuickLink } from './components';
import { useSEO } from '@/utils/hooks';
import { useTranslation } from '@/utils/i18n';

const DashboardHome = () => {
  const { t } = useTranslation();
  
  // SEO
  useSEO({
    title: t('dashboard.title'),
    description: t('dashboard.subtitle'),
    keywords: 'dashboard, weather, news, games, food, dashverse',
    ogTitle: `${t('dashboard.title')} - Dashverse`,
    ogDescription: t('dashboard.subtitle'),
    ogType: 'website',
  });
  const { theme } = useAppStore();
  const { favorites } = useFoodStore();
  const { score: tictactoeScore } = useTicTacToeStore();
  const { highScore: snakeHighScore } = useSnakeStore();

  const totalWins = tictactoeScore.player1 + tictactoeScore.player2;

  return (
    <main className="p-6 space-y-6">
      {/* Welcome Section */}
      <header className="bg-linear-to-r from-blue-600 to-blue-800 rounded-lg shadow-lg p-8 text-white">
        <h1 className="text-4xl font-bold mb-2">{t('dashboard.welcome')}</h1>
        <p className="text-blue-100 text-lg">
          {t('dashboard.subtitle')}
        </p>
        <div className="mt-4 flex items-center space-x-2">
          <span className="text-sm">{t('dashboard.currentTheme')}:</span>
          <span className="px-3 py-1 bg-white/20 rounded-full text-sm font-medium capitalize" aria-label={`${t('dashboard.currentTheme')}: ${theme}`}>
            {theme}
          </span>
        </div>
      </header>

      {/* Stats Grid */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6" aria-label="Dashboard statistics">
        <StatCard
          title={t('dashboard.favoriteFoods')}
          value={favorites.length}
          icon="🍔"
          description={t('dashboard.savedFavorites')}
        />
        <StatCard
          title={t('dashboard.ticTacToeWins')}
          value={totalWins}
          icon="⭕"
          description={`Player 1: ${tictactoeScore.player1} | Player 2: ${tictactoeScore.player2}`}
        />
        <StatCard
          title={t('dashboard.snakeHighScore')}
          value={snakeHighScore}
          icon="🐍"
          description={t('dashboard.bestScore')}
        />
        <StatCard
          title={t('dashboard.quickLinks')}
          value="5"
          icon="✨"
          description={t('dashboard.exploreFeatures')}
        />
      </section>

      {/* Quick Links */}
      <nav aria-label="Quick navigation links">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">{t('dashboard.quickLinks')}</h2>
        <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" role="list">
          <li>
            <QuickLink
              to="/weather"
              label={t('nav.weather')}
              icon="🌤️"
              description={t('dashboard.viewWeather')}
            />
          </li>
          <li>
            <QuickLink
              to="/news"
              label={t('nav.news')}
              icon="📰"
              description={t('dashboard.readNews')}
            />
          </li>
          <li>
            <QuickLink
              to="/games/tictactoe"
              label="Tic Tac Toe"
              icon="⭕"
              description={t('dashboard.playGames')}
            />
          </li>
          <li>
            <QuickLink
              to="/games/snake"
              label="Snake Game"
              icon="🐍"
              description={t('dashboard.playGames')}
            />
          </li>
          <li>
            <QuickLink
              to="/food"
              label={t('nav.food')}
              icon="🍔"
              description={t('dashboard.browseFood')}
            />
          </li>
        </ul>
      </nav>

      {/* Recent Activity or Info Section */}
      <section className="bg-white dark:bg-gray-800 rounded-lg shadow-md dark:shadow-gray-900 p-6">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Getting Started</h2>
        <ol className="space-y-3 text-gray-600 dark:text-gray-300" role="list">
          <li className="flex items-start space-x-3">
            <span className="text-blue-600 dark:text-blue-400 font-bold">1.</span>
            <p>Navigate through the sidebar to explore different features</p>
          </li>
          <li className="flex items-start space-x-3">
            <span className="text-blue-600 dark:text-blue-400 font-bold">2.</span>
            <p>Your preferences and data are automatically saved</p>
          </li>
          <li className="flex items-start space-x-3">
            <span className="text-blue-600 dark:text-blue-400 font-bold">3.</span>
            <p>Use the theme toggle to switch between light and dark modes</p>
          </li>
        </ol>
      </section>
    </main>
  );
};

export default DashboardHome;

