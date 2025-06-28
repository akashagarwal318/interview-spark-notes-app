
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Plus, List, Sun, Moon, Download } from 'lucide-react';
import { Button } from '../ui/button';
import { setFormVisible, toggleTheme } from '../../store/slices/uiSlice';
import { resetFilters } from '../../store/slices/questionsSlice';
import { useIsMobile } from '../../hooks/use-mobile';

const Header = () => {
  const dispatch = useDispatch();
  const { theme } = useSelector((state) => state.ui);
  const isMobile = useIsMobile();

  const handleAddQuestion = () => {
    dispatch(setFormVisible(true));
  };

  const handleShowAll = () => {
    dispatch(resetFilters());
  };

  const handleToggleTheme = () => {
    dispatch(toggleTheme());
  };

  const handleExport = () => {
    // TODO: Implement export functionality
    console.log('Export functionality to be implemented');
  };

  return (
    <div className="sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b">
      <div className="container flex h-14 items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            🚀 Interview Assistant
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          {!isMobile && (
            <>
              <Button
                variant="default"
                size="sm"
                onClick={handleAddQuestion}
                className="gap-2"
              >
                <Plus className="h-4 w-4" />
                Add Question
              </Button>
              
              <Button
                variant="outline"
                size="sm"
                onClick={handleShowAll}
                className="gap-2"
              >
                <List className="h-4 w-4" />
                All Questions
              </Button>

              <Button
                variant="outline"
                size="sm"
                onClick={handleExport}
                className="gap-2"
              >
                <Download className="h-4 w-4" />
                Export
              </Button>
            </>
          )}
          
          <Button
            variant="ghost"
            size="sm"
            onClick={handleToggleTheme}
            className="px-2"
          >
            {theme === 'light' ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
          </Button>

          {isMobile && (
            <Button
              variant="default"
              size="sm"
              onClick={handleAddQuestion}
              className="px-2"
            >
              <Plus className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Header;
