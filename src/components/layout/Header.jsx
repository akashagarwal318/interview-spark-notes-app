
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Plus, Sun, Moon, Download, Settings } from 'lucide-react';
import { Button } from '../ui/button';
import { setFormVisible, toggleTheme } from '../../store/slices/uiSlice';
import ExportBuilder from '../modals/ExportBuilder.jsx';
import { useDispatch as useReduxDispatch } from 'react-redux';
import { logout } from '../../store/slices/authSlice.js';
import { useNavigate } from 'react-router-dom';

const Header = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { theme } = useSelector((state) => state.ui);

  const handleAddQuestion = () => {
    dispatch(setFormVisible(true));
  };

  const handleToggleTheme = () => {
    dispatch(toggleTheme());
  };

  const [exportOpen,setExportOpen]=useState(false);
  const { user } = useSelector(s=>s.auth);
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
              onClick={()=>setExportOpen(true)}
              className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 dark:bg-emerald-500 dark:hover:bg-emerald-600"
            >
              <Download className="h-4 w-4" />
              <span>Export</span>
            </Button>
            
            {user?.role === 'admin' && (
              <Button
                onClick={() => navigate('/admin')}
                className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 dark:bg-purple-500 dark:hover:bg-purple-600"
              >
                <Settings className="h-4 w-4" />
                <span>Admin</span>
              </Button>
            )}
            
            <Button
              variant="ghost"
              onClick={handleToggleTheme}
              className="p-2 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              {theme === 'light' ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
            </Button>
            {user && (
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600 dark:text-gray-300 hidden sm:inline">{user.email}</span>
                <Button onClick={()=>dispatch(logout())} className="bg-gray-200 dark:bg-gray-800 text-gray-800 dark:text-gray-100 hover:bg-gray-300 dark:hover:bg-gray-700 px-3 py-2 rounded-lg">Logout</Button>
              </div>
            )}
          </div>
        </div>
      </div>
      <ExportBuilder open={exportOpen} onClose={()=>setExportOpen(false)} />
    </div>
  );
};

export default Header;
