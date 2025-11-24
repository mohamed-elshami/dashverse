import type { NavItem } from '../types';
import NestedNavItem from './NestedNavItem';

interface NestedNavMenuProps {
  items: NavItem[];
  isOpen: boolean;
  isActive: (path: string) => boolean;
  onNavigate: () => void;
}

const NestedNavMenu = ({ items, isOpen, isActive, onNavigate }: NestedNavMenuProps) => {
  return (
    <ul
      className={`
        mt-2 ml-4 space-y-1
        overflow-hidden transition-all duration-300 ease-in-out
        ${isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}
      `}
    >
      {items.map((item) => (
        <li key={item.path}>
          <NestedNavItem
            item={item}
            isActive={isActive(item.path)}
            onNavigate={onNavigate}
          />
        </li>
      ))}
    </ul>
  );
};

export default NestedNavMenu;

