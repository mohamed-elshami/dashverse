import type { NavItem } from '../types';
import SidebarHeader from './SidebarHeader';
import SidebarFooter from './SidebarFooter';
import Navigation from './Navigation';

interface SidebarProps {
  isOpen: boolean;
  items: NavItem[];
  openNestedMenus: Record<string, boolean>;
  onToggleNested: (path: string) => void;
  onClose: () => void;
}

const Sidebar = ({
  isOpen,
  items,
  openNestedMenus,
  onToggleNested,
  onClose,
}: SidebarProps) => {
  return (
    <aside
      className={`
        fixed lg:static
        top-0 left-0
        h-screen
        w-64
        bg-linear-to-b from-blue-600 to-blue-800
        shadow-2xl
        z-50
        select-none
        flex flex-col
        transform transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}
    >
      <SidebarHeader onClose={onClose} />
      <Navigation
        items={items}
        openNestedMenus={openNestedMenus}
        onToggleNested={onToggleNested}
        onCloseSidebar={onClose}
      />
      <SidebarFooter />
    </aside>
  );
};

export default Sidebar;

