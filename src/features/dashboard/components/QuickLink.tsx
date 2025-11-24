import { Link } from 'react-router-dom';
import { HiArrowRight } from 'react-icons/hi';

interface QuickLinkProps {
  to: string;
  label: string;
  icon: string;
  description?: string;
}

const QuickLink = ({ to, label, icon, description }: QuickLinkProps) => {
  return (
    <Link
      to={to}
      className="bg-white dark:bg-gray-800 rounded-lg shadow-md dark:shadow-gray-900 p-6 hover:shadow-lg transition-all hover:scale-105 flex items-center space-x-4 group"
    >
      <div className="text-4xl group-hover:scale-110 transition-transform">{icon}</div>
      <div className="flex-1">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
          {label}
        </h3>
        {description && <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{description}</p>}
      </div>
      <HiArrowRight className="w-5 h-5 text-gray-400 dark:text-gray-500 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors" />
    </Link>
  );
};

export default QuickLink;

