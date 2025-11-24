import { Link } from 'react-router-dom';
import type { NavItem } from '../types';

interface NavLinkProps {
  item: NavItem;
  isActive: boolean;
  onNavigate: () => void;
}

const NavLink = ({ item, isActive, onNavigate }: NavLinkProps) => {
  return (
    <Link
      to={item.path}
      onClick={onNavigate}
      className={`
        flex items-center px-4 py-3
        rounded-lg
        transition-all duration-200
        ${isActive
          ? 'bg-blue-500 text-white shadow-lg transform scale-105'
          : 'text-blue-100 hover:bg-blue-500 hover:text-white hover:shadow-md'
        }
      `}
    >
      <span className="text-2xl mr-3">{item.icon}</span>
      <span className="font-medium">{item.label}</span>
      {isActive && (
        <span className="ml-auto w-2 h-2 bg-white rounded-full animate-pulse" />
      )}
    </Link>
  );
};

export default NavLink;

