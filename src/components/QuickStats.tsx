
import React from 'react';
import { Box, Card, CardContent, Typography, Grid2 as Grid } from '@mui/material';

interface Stats {
  total: number;
  favorites: number;
  review: number;
  hot: number;
}

interface QuickStatsProps {
  stats: Stats;
}

const QuickStats: React.FC<QuickStatsProps> = ({ stats }) => {
  const statItems = [
    { label: 'Total Questions', value: stats.total, color: 'primary.main' },
    { label: '⭐ Favorites', value: stats.favorites, color: 'warning.main' },
    { label: '📌 Review', value: stats.review, color: 'success.main' },
    { label: '🔥 Hot List', value: stats.hot, color: 'error.main' },
  ];

  return (
    <Grid container spacing={2} sx={{ mb: 3 }}>
      {statItems.map((item, index) => (
        <Grid xs={6} sm={3} key={index}>
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
