import { Link } from 'react-router-dom';
import type { NavItem } from '../types';

interface NestedNavItemProps {
  item: NavItem;
  isActive: boolean;
  onNavigate: () => void;
}

const NestedNavItem = ({ item, isActive, onNavigate }: NestedNavItemProps) => {
  return (
    <Link
      to={item.path}
      onClick={onNavigate}
      className={`
        flex items-center px-4 py-2.5
        rounded-lg
        transition-all duration-200
        ${
          isActive
            ? 'bg-blue-400 text-white shadow-md'
            : 'text-blue-200 hover:bg-blue-500 hover:text-white'
        }
      `}
    >
      <span className="text-xl mr-3">{item.icon}</span>
      <span className="font-medium text-sm">{item.label}</span>
      {isActive && (
        <span className="ml-auto w-2 h-2 bg-white rounded-full animate-pulse" />
      )}
    </Link>
  );
};

export default NestedNavItem;

