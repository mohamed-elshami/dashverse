import { useEffect } from 'react';
import { navItems } from '@/layouts/constants';
import { useSidebar, useNestedMenus } from '@/layouts/hooks';
import { useAppStore } from '@/stores/appStore';
import { Overlay, Sidebar, TopBar, MainContent } from '@/layouts/components';

const DashboardLayout = () => {
    const { sidebarOpen, setSidebarOpen, handleOverlayClick } = useSidebar();
    const { openNestedMenus, toggleNestedMenu } = useNestedMenus(navItems);
    const { theme } = useAppStore();

    // Apply dark mode to HTML element
    useEffect(() => {
        const html = document.documentElement;
        if (theme === 'dark') {
            html.classList.add('dark');
        } else {
            html.classList.remove('dark');
        }
    }, [theme]);

    return (
        <div className="h-screen w-screen bg-gray-50 dark:bg-gray-900 flex overflow-hidden transition-colors duration-200">
            <Overlay isOpen={sidebarOpen} onClick={handleOverlayClick} />

            <Sidebar
                isOpen={sidebarOpen}
                items={navItems}
                openNestedMenus={openNestedMenus}
                onToggleNested={toggleNestedMenu}
                onClose={() => setSidebarOpen(false)}
            />

            <div className="flex-1 flex flex-col h-screen overflow-hidden">
                <TopBar items={navItems} onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
                <MainContent />
            </div>
        </div>
    );
};

export default DashboardLayout;
