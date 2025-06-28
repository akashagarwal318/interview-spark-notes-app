
import React from 'react';
import { useSelector } from 'react-redux';
import { Grid, Card, CardContent, Typography } from '@mui/material';

const QuickStats = () => {
  const { items } = useSelector((state) => state.questions);

  const stats = {
    total: items.length,
    favorites: items.filter(q => q.favorite).length,
    review: items.filter(q => q.review).length,
    hot: items.filter(q => q.hot).length
  };

  const statItems = [
    { label: 'Total Questions', value: stats.total, color: 'primary.main' },
    { label: '⭐ Favorites', value: stats.favorites, color: 'warning.main' },
    { label: '📌 Review', value: stats.review, color: 'success.main' },
    { label: '🔥 Hot List', value: stats.hot, color: 'error.main' },
  ];

  return (
    <Grid container spacing={2} sx={{ mb: 3 }}>
      {statItems.map((item, index) => (
        <Grid item xs={6} sm={3} key={index}>
          <Card elevation={1}>
            <CardContent sx={{ textAlign: 'center', py: 2 }}>
              <Typography 
                variant="h4" 
                component="div" 
                fontWeight="bold"
                sx={{ color: item.color, mb: 0.5 }}
              >
                {item.value}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {item.label}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
};

export default QuickStats;
