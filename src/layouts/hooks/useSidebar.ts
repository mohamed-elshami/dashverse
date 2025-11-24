import { useEffect } from 'react';
import { useAppStore } from '@/stores/appStore';

export const useSidebar = () => {
  const { sidebarOpen, setSidebarOpen } = useAppStore();

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setSidebarOpen(true);
      } else {
        setSidebarOpen(false);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [setSidebarOpen]);

  const handleOverlayClick = () => {
    if (window.innerWidth < 1024) {
      setSidebarOpen(false);
    }
  };

  return {
    sidebarOpen,
    setSidebarOpen,
    handleOverlayClick,
  };
};

