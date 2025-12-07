import { useTranslation } from '@/utils/i18n';

interface GameStatsProps {
  score: number;
  highScore: number;
  gameOver: boolean;
}

const GameStats = ({ score, highScore, gameOver }: GameStatsProps) => {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col sm:flex-row gap-4 items-center justify-center">
      <div
        className="px-6 py-3 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg shadow-lg border-2 border-blue-400 min-w-[120px] text-center"
        style={{
          boxShadow: '0 4px 8px rgba(0, 0, 0, 0.3), inset 0 2px 4px rgba(255, 255, 255, 0.2)',
        }}
      >
        <div className="text-sm text-blue-100 font-medium mb-1">
          {t('common.error') === 'Error' ? 'Score' : 'النقاط'}
        </div>
        <div className="text-2xl font-bold text-white">{score}</div>
      </div>

      <div
        className="px-6 py-3 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg shadow-lg border-2 border-purple-400 min-w-[120px] text-center"
        style={{
          boxShadow: '0 4px 8px rgba(0, 0, 0, 0.3), inset 0 2px 4px rgba(255, 255, 255, 0.2)',
        }}
      >
        <div className="text-sm text-purple-100 font-medium mb-1">
          {t('common.error') === 'Error' ? 'High Score' : 'أعلى نتيجة'}
        </div>
        <div className="text-2xl font-bold text-white">{highScore}</div>
      </div>

      {gameOver && (
        <div
          className="px-6 py-3 bg-gradient-to-br from-red-500 to-red-600 rounded-lg shadow-lg border-2 border-red-400 animate-pulse"
          style={{
            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.3), inset 0 2px 4px rgba(255, 255, 255, 0.2)',
          }}
        >
          <div className="text-sm text-red-100 font-medium mb-1">
            {t('common.error') === 'Error' ? 'Game Over' : 'انتهت اللعبة'}
          </div>
        </div>
      )}
    </div>
  );
};

export default GameStats;

