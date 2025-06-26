
import React from 'react';
import { Edit } from 'lucide-react';

interface HeaderProps {
  onAddQuestion: () => void;
  onShowAll: () => void;
  onToggleTheme: () => void;
  currentTheme: string;
}

const Header: React.FC<HeaderProps> = ({ 
  onAddQuestion, 
  onShowAll, 
  onToggleTheme, 
  currentTheme 
}) => {
  return (
    <header className="flex justify-between items-center mb-8 flex-wrap gap-4">
      <h1 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-white">
        🚀 Interview Assistant
      </h1>
      <div className="flex gap-3 items-center flex-wrap">
        <button 
          onClick={onAddQuestion}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Edit size={16} />
          Add New Question
        </button>
        <button 
          onClick={onShowAll}
          className="flex items-center gap-2 bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
        >
          📋 All Questions
        </button>
        <button 
          onClick={onToggleTheme}
          className="w-11 h-11 bg-gray-200 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg flex items-center justify-center hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
          title="Toggle theme"
        >
          {currentTheme === 'light' ? '🌙' : '☀️'}
        </button>
      </div>
    </header>
  );
};

export default Header;
