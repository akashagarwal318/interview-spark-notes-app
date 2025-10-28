
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Plus, Sun, Moon } from 'lucide-react';
import { Button } from '../ui/button';
import { setFormVisible, toggleTheme } from '../../store/slices/uiSlice';

const Header = () => {
  const dispatch = useDispatch();
  const { theme } = useSelector((state) => state.ui);

  const handleAddQuestion = () => {
    dispatch(setFormVisible(true));
  };

  const handleToggleTheme = () => {
    dispatch(toggleTheme());
  };

  return (
    <div className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700">
      <div className="max-w-6xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">IA</span>
            </div>
            <h1 className="text-xl font-semibold text-gray-900 dark:text-white">
              Interview Assistant
            </h1>
          </div>
          
          <div className="flex items-center space-x-3">
            <Button
              onClick={handleAddQuestion}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 dark:bg-blue-500 dark:hover:bg-blue-600"
            >
              <Plus className="h-4 w-4" />
              <span>Add Question</span>
            </Button>
            
            <Button
              variant="ghost"
              onClick={handleToggleTheme}
              className="p-2 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
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
