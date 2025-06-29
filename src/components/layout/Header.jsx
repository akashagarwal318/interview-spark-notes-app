
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Plus, Download, Sun, Moon, FileText, FileDown } from 'lucide-react';
import { Button } from '../ui/button';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import { setFormVisible, toggleTheme } from '../../store/slices/uiSlice';
import { resetFilters } from '../../store/slices/questionsSlice';
import { exportToWord, exportToPDF } from '../../utils/exportUtils';

const Header = () => {
  const dispatch = useDispatch();
  const { theme } = useSelector((state) => state.ui);
  const { filteredItems } = useSelector((state) => state.questions);

  const handleAddQuestion = () => {
    dispatch(setFormVisible(true));
  };

  const handleShowAll = () => {
    dispatch(resetFilters());
  };

  const handleToggleTheme = () => {
    dispatch(toggleTheme());
  };

  const handleExportWord = () => {
    if (filteredItems.length === 0) {
      alert('No questions to export');
      return;
    }
    exportToWord(filteredItems);
  };

  const handleExportPDF = () => {
    if (filteredItems.length === 0) {
      alert('No questions to export');
      return;
    }
    exportToPDF(filteredItems);
  };

  return (
    <div className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-10">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <span className="text-2xl">🚀</span>
            <h1 className="text-xl font-bold text-gray-900 dark:text-white">
              Interview Assistant
            </h1>
          </div>
          
          <div className="flex items-center space-x-3">
            <Button
              onClick={handleAddQuestion}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 font-medium"
            >
              <Plus className="h-4 w-4" />
              <span>Add New Question</span>
            </Button>
            
            <Button
              onClick={handleShowAll}
              className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg font-medium"
            >
              All Questions
            </Button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Export
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-50">
                <DropdownMenuItem onClick={handleExportWord} className="flex items-center px-4 py-2 hover:bg-gray-50 dark:hover:bg-gray-700">
                  <FileText className="h-4 w-4 mr-2" />
                  Export as Word
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleExportPDF} className="flex items-center px-4 py-2 hover:bg-gray-50 dark:hover:bg-gray-700">
                  <FileDown className="h-4 w-4 mr-2" />
                  Export as PDF
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            
            <Button
              variant="ghost"
              onClick={handleToggleTheme}
              className="p-2 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              {theme === 'light' ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;
