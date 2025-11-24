import { useLocation } from 'react-router-dom';
import type { NavItem } from '../types';
import NavLink from './NavLink';
import NavItemButton from './NavItemButton';

interface NavigationProps {
  items: NavItem[];
  openNestedMenus: Record<string, boolean>;
  onToggleNested: (path: string) => void;
  onCloseSidebar: () => void;
}

const Navigation = ({
  items,
  openNestedMenus,
  onToggleNested,
  onCloseSidebar,
}: NavigationProps) => {
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  const isPathActive = (item: NavItem): boolean => {
    if (isActive(item.path)) return true;
    if (item.nested) {
      return item.nested.some((nestedItem) => isActive(nestedItem.path));
    }
    return false;
  };

  const handleNavigate = () => {
    if (window.innerWidth < 1024) {
      onCloseSidebar();
    }
  };

  return (
    <nav className="flex-1 overflow-y-auto mt-6 px-3 pb-4">
      <ul className="space-y-2">
        {items.map((item) => {
          const active = isPathActive(item);
          const hasNested = item.nested && item.nested.length > 0;
          const nestedOpen = hasNested ? (openNestedMenus[item.path] ?? false) : false;

          return (
            <li key={item.path}>
              {hasNested ? (
                <NavItemButton
                  item={item}
                  isActive={active}
                  isOpen={nestedOpen}
                  onToggle={() => onToggleNested(item.path)}
                  isActivePath={isActive}
                  onNavigate={handleNavigate}
                />
              ) : (
                <NavLink
                  item={item}
                  isActive={active}
                  onNavigate={handleNavigate}
                />
              )}
            </li>
          );
        })}
      </ul>
    </nav>
  );
};

export default Navigation;

