import { Outlet } from 'react-router-dom';

const MainContent = () => {
  return (
    <main className="flex-1 overflow-y-auto bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
      <Outlet />
    </main>
  );
};

export default MainContent;

