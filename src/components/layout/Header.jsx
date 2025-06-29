
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Plus, List, Sun, Moon, Download, FileText, FileDown } from 'lucide-react';
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
import { useIsMobile } from '../../hooks/use-mobile';

const Header = () => {
  const dispatch = useDispatch();
  const { theme } = useSelector((state) => state.ui);
  const { filteredItems } = useSelector((state) => state.questions);
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
    <div className="sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b">
      <div className="container flex h-12 items-center justify-between px-4">
        <div className="flex items-center space-x-2">
          <div className="text-lg font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            🚀 Interview Assistant
          </div>
        </div>
        
        <div className="flex items-center space-x-1">
          {!isMobile && (
            <>
              <Button
                variant="default"
                size="sm"
                onClick={handleAddQuestion}
                className="gap-2 h-8 px-3"
              >
                <Plus className="h-3 w-3" />
                Add
              </Button>
              
              <Button
                variant="outline"
                size="sm"
                onClick={handleShowAll}
                className="gap-2 h-8 px-3"
              >
                <List className="h-3 w-3" />
                All
              </Button>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    className="gap-2 h-8 px-3"
                  >
                    <Download className="h-3 w-3" />
                    Export
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={handleExportWord}>
                    <FileText className="h-4 w-4 mr-2" />
                    Export as Word
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleExportPDF}>
                    <FileDown className="h-4 w-4 mr-2" />
                    Export as PDF
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          )}
          
          <Button
            variant="ghost"
            size="sm"
            onClick={handleToggleTheme}
            className="h-8 w-8 p-0"
          >
            {theme === 'light' ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
          </Button>

          {isMobile && (
            <>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-8 w-8 p-0"
                  >
                    <Download className="h-3 w-3" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={handleExportWord}>
                    <FileText className="h-4 w-4 mr-2" />
                    Word
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleExportPDF}>
                    <FileDown className="h-4 w-4 mr-2" />
                    PDF
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              
              <Button
                variant="default"
                size="sm"
                onClick={handleAddQuestion}
                className="h-8 w-8 p-0"
              >
                <Plus className="h-3 w-3" />
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Header;
