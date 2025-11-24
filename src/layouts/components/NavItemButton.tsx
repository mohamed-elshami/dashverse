import { HiChevronDown } from 'react-icons/hi';
import type { NavItem } from '../types';
import NestedNavMenu from './NestedNavMenu';

interface NavItemButtonProps {
  item: NavItem;
  isActive: boolean;
  isOpen: boolean;
  onToggle: () => void;
  isActivePath: (path: string) => boolean;
  onNavigate: () => void;
}

const NavItemButton = ({
  item,
  isActive,
  isOpen,
  onToggle,
  isActivePath,
  onNavigate,
}: NavItemButtonProps) => {
  if (!item.nested || item.nested.length === 0) {
    return null;
  }

  return (
    <>
      <button
        onClick={onToggle}
        className={`
          w-full flex items-center justify-between px-4 py-3
          rounded-lg
          transition-all duration-200
          ${isActive
            ? 'bg-blue-500 text-white shadow-lg'
            : 'text-blue-100 hover:bg-blue-500 hover:text-white hover:shadow-md'
          }
        `}
      >
        <div className="flex items-center">
          <span className="text-2xl mr-3">{item.icon}</span>
          <span className="font-medium">{item.label}</span>
        </div>
        <HiChevronDown
          className={`w-5 h-5 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>
      <NestedNavMenu
        items={item.nested}
        isOpen={isOpen}
        isActive={isActivePath}
        onNavigate={onNavigate}
      />
    </>
  );
};

export default NavItemButton;

