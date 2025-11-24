import { HiX } from 'react-icons/hi';

interface SidebarHeaderProps {
  onClose: () => void;
}

const SidebarHeader = ({ onClose }: SidebarHeaderProps) => {
  return (
    <div className="flex items-center justify-between h-16 px-6 border-b border-blue-500 shrink-0">
      <h1 className="text-white text-xl font-bold tracking-wide">Dashboard</h1>
      <button
        onClick={onClose}
        className="lg:hidden text-white hover:text-blue-200 cursor-pointer transition-colors"
        aria-label="Close sidebar"
      >
        <HiX className="w-6 h-6" />
      </button>
    </div>
  );
};

export default SidebarHeader;

