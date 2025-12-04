import { useLocation } from 'react-router-dom';
import { HiMenu, HiMoon, HiSun } from 'react-icons/hi';
import { useAppStore } from '@/stores/appStore';
import LanguageSelector from '@/components/LanguageSelector';
import type { NavItem } from '@/layouts/types';

interface TopBarProps {
  items: NavItem[];
  onToggleSidebar: () => void;
}

const TopBar = ({ items, onToggleSidebar }: TopBarProps) => {
  const location = useLocation();
  const { theme, toggleTheme } = useAppStore();

  const isActive = (path: string) => location.pathname === path;

  const getActiveLabel = (): string => {
    for (const item of items) {
      if (isActive(item.path)) return item.label;
      if (item.nested) {
        const nestedItem = item.nested.find((n) => isActive(n.path));
        if (nestedItem) return nestedItem.label;
      }
    }
    return 'Dashboard';
  };

  const getActiveIcon = (): string => {
    for (const item of items) {
      if (isActive(item.path)) return item.icon;
      if (item.nested) {
        const nestedItem = item.nested.find((n) => isActive(n.path));
        if (nestedItem) return nestedItem.icon;
      }
    }
    return '🏠'; // Default Dashboard icon
  };

  return (
    <header className="bg-white dark:bg-gray-800 shadow-sm dark:shadow-gray-900 h-16 flex items-center justify-between px-6 shrink-0 z-30 select-none transition-colors duration-200">
      <div className="flex items-center">
        <button
          onClick={onToggleSidebar}
          className="lg:hidden text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white mr-4 cursor-pointer transition-colors"
          aria-label="Toggle sidebar"
        >
          <HiMenu className="w-6 h-6" />
        </button>
        <div className="flex items-center space-x-3">
          <span className="text-2xl">{getActiveIcon()}</span>
          <h2 className="text-2xl tracking-wide font-bold text-blue-600 dark:text-blue-400">{getActiveLabel()}</h2>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <LanguageSelector />
        <button
          onClick={toggleTheme}
          className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white cursor-pointer transition-colors p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
          aria-label="Toggle theme"
          title={theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode'}
        >
          {theme === 'light' ? (
            <HiMoon className="w-5 h-5" />
          ) : (
            <HiSun className="w-5 h-5" />
          )}
        </button>
      </div>
    </header>
  );
};

export default TopBar;

