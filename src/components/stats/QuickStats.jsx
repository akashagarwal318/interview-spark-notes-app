
import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Star, Bookmark, Flame, FileText } from 'lucide-react';
import { Card, CardContent } from '../ui/card';
import { setFilters, resetFilters } from '../../store/slices/questionsSlice';

const QuickStats = () => {
  const dispatch = useDispatch();
  const { items, filters } = useSelector((state) => state.questions);

  const stats = {
    total: items.length,
    favorites: items.filter(q => q.favorite).length,
    review: items.filter(q => q.review).length,
    hot: items.filter(q => q.hot).length
  };

  const handleStatClick = (filterType) => {
    if (filterType === 'total') {
      dispatch(resetFilters());
    } else {
      dispatch(resetFilters());
      dispatch(setFilters({ [filterType === 'favorites' ? 'favorite' : filterType]: true }));
    }
  };

  const statItems = [
    { 
      label: 'Total', 
      value: stats.total, 
      icon: FileText, 
      color: 'text-blue-600 dark:text-blue-400',
      bgColor: 'bg-blue-50 dark:bg-blue-950',
      filterType: 'total'
    },
    { 
      label: 'Favorites', 
      value: stats.favorites, 
      icon: Star, 
      color: 'text-yellow-600 dark:text-yellow-400',
      bgColor: 'bg-yellow-50 dark:bg-yellow-950',
      filterType: 'favorites'
    },
    { 
      label: 'Review', 
      value: stats.review, 
      icon: Bookmark, 
      color: 'text-green-600 dark:text-green-400',
      bgColor: 'bg-green-50 dark:bg-green-950',
      filterType: 'review'
    },
    { 
      label: 'Hot', 
      value: stats.hot, 
      icon: Flame, 
      color: 'text-red-600 dark:text-red-400',
      bgColor: 'bg-red-50 dark:bg-red-950',
      filterType: 'hot'
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
      {statItems.map((item, index) => {
        const Icon = item.icon;
        return (
          <Card 
            key={index} 
            className={`cursor-pointer transition-all duration-200 hover:shadow-md hover:scale-105 ${item.bgColor} border-0`}
            onClick={() => handleStatClick(item.filterType)}
          >
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <div className={`p-2 rounded-full ${item.bgColor}`}>
                  <Icon className={`h-4 w-4 ${item.color}`} />
                </div>
                <div>
                  <div className={`text-2xl font-bold ${item.color}`}>
                    {item.value}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {item.label}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};

export default QuickStats;
