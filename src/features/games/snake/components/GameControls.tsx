import { HiArrowUp, HiArrowDown, HiArrowLeft, HiArrowRight } from 'react-icons/hi';
import { useTranslation } from '@/utils/i18n';
import type { Direction } from '../logic/gameLogic';

interface GameControlsProps {
  onDirectionChange: (direction: Direction) => void;
  disabled?: boolean;
}

const GameControls = ({ onDirectionChange, disabled = false }: GameControlsProps) => {
  const { t } = useTranslation();

  const handleDirection = (direction: Direction) => {
    if (!disabled) {
      onDirectionChange(direction);
    }
  };

  return (
    <div className="flex flex-col items-center gap-2">
      <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
        {t('common.error') === 'Error' ? 'Use arrow keys or buttons' : 'استخدم الأسهم أو الأزرار'}
      </p>
      <div className="grid grid-cols-3 gap-2">
        {/* Empty cell */}
        <div />
        
        {/* Up */}
        <button
          onClick={() => handleDirection('UP')}
          disabled={disabled}
          className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95 transition-all duration-200 flex items-center justify-center text-white border-2 border-blue-400"
          style={{
            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.3), inset 0 2px 4px rgba(255, 255, 255, 0.2)',
          }}
          aria-label="Move up"
        >
          <HiArrowUp className="w-6 h-6" />
        </button>
        
        {/* Empty cell */}
        <div />

        {/* Left */}
        <button
          onClick={() => handleDirection('LEFT')}
          disabled={disabled}
          className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95 transition-all duration-200 flex items-center justify-center text-white border-2 border-blue-400"
          style={{
            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.3), inset 0 2px 4px rgba(255, 255, 255, 0.2)',
          }}
          aria-label="Move left"
        >
          <HiArrowLeft className="w-6 h-6" />
        </button>

        {/* Center (empty) */}
        <div className="w-16 h-16" />

        {/* Right */}
        <button
          onClick={() => handleDirection('RIGHT')}
          disabled={disabled}
          className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95 transition-all duration-200 flex items-center justify-center text-white border-2 border-blue-400"
          style={{
            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.3), inset 0 2px 4px rgba(255, 255, 255, 0.2)',
          }}
          aria-label="Move right"
        >
          <HiArrowRight className="w-6 h-6" />
        </button>

        {/* Empty cell */}
        <div />

        {/* Down */}
        <button
          onClick={() => handleDirection('DOWN')}
          disabled={disabled}
          className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95 transition-all duration-200 flex items-center justify-center text-white border-2 border-blue-400"
          style={{
            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.3), inset 0 2px 4px rgba(255, 255, 255, 0.2)',
          }}
          aria-label="Move down"
        >
          <HiArrowDown className="w-6 h-6" />
        </button>

        {/* Empty cell */}
        <div />
      </div>
    </div>
  );
};

export default GameControls;

