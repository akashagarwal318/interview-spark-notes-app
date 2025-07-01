
import React from 'react';
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
    <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 border-b border-purple-300 shadow-lg">
      <div className="max-w-6xl mx-auto px-4 py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-10 h-10 bg-gradient-to-br from-white to-purple-100 rounded-xl flex items-center justify-center shadow-md">
              <span className="text-purple-600 font-bold text-lg">IA</span>
            </div>
            <h1 className="text-2xl font-bold text-white drop-shadow-sm">
              Interview Assistant
            </h1>
          </div>
          
          <div className="flex items-center space-x-3">
            <Button
              onClick={handleAddQuestion}
              className="bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white px-6 py-3 rounded-xl flex items-center space-x-2 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 border border-emerald-400"
            >
              <Plus className="h-5 w-5" />
              <span className="font-medium">Add Question</span>
            </Button>
            
            <Button
              variant="ghost"
              onClick={handleToggleTheme}
              className="p-3 rounded-xl text-white hover:bg-white/20 hover:text-white transition-all duration-300 shadow-md hover:shadow-lg"
            >
              {theme === 'light' ? <Moon className="h-6 w-6" /> : <Sun className="h-6 w-6" />}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;
