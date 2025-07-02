
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
    <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 border-b-4 border-gradient-to-r from-purple-400 to-pink-400 shadow-2xl relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent"></div>
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400"></div>
      <div className="max-w-6xl mx-auto px-4 py-6 relative z-10">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-gradient-to-br from-white via-purple-100 to-pink-100 rounded-2xl flex items-center justify-center shadow-xl border-2 border-white/30 backdrop-blur-sm transform hover:scale-110 transition-all duration-300">
              <span className="text-purple-600 font-bold text-xl drop-shadow-sm">IA</span>
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white drop-shadow-lg bg-gradient-to-r from-white to-purple-100 bg-clip-text">
                Interview Assistant
              </h1>
              <p className="text-purple-100 text-sm font-medium">Ace your next interview with confidence</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <Button
              onClick={handleAddQuestion}
              className="bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-600 hover:from-emerald-600 hover:via-teal-600 hover:to-cyan-700 text-white px-8 py-4 rounded-2xl flex items-center space-x-3 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 hover:-translate-y-1 border-2 border-emerald-400 hover:border-emerald-300 group"
            >
              <Plus className="h-6 w-6 group-hover:rotate-90 transition-transform duration-300" />
              <span className="font-semibold text-lg">Add Question</span>
            </Button>
            
            <Button
              variant="ghost"
              onClick={handleToggleTheme}
              className="p-4 rounded-2xl text-white hover:bg-gradient-to-br hover:from-white/20 hover:to-white/10 hover:text-white transition-all duration-300 shadow-lg hover:shadow-xl border-2 border-white/20 hover:border-white/40 backdrop-blur-sm transform hover:scale-110"
            >
              {theme === 'light' ? <Moon className="h-7 w-7" /> : <Sun className="h-7 w-7" />}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;
