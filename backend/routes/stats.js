import express from 'express';
import Question from '../models/Question.js';
import Tag from '../models/Tag.js';

const router = express.Router();

// GET /api/stats - Get comprehensive stats
router.get('/', async (req, res) => {
  try {
    // Basic counts
    const userFilter = { user: req.user?._id };
    const totalQuestions = await Question.countDocuments(userFilter);
    const favoritesCount = await Question.countDocuments({ ...userFilter, favorite: true });
    const reviewCount = await Question.countDocuments({ ...userFilter, review: true });
    const hotCount = await Question.countDocuments({ ...userFilter, hot: true });
    
    // Round statistics
    const roundStats = await Question.aggregate([
      { $match: userFilter },
      {
        $group: {
          _id: '$round',
          count: { $sum: 1 },
          favorites: { $sum: { $cond: ['$favorite', 1, 0] } },
          reviews: { $sum: { $cond: ['$review', 1, 0] } },
          hot: { $sum: { $cond: ['$hot', 1, 0] } }
        }
      },
      { $sort: { count: -1 } }
    ]);
    
    // Difficulty statistics
    const difficultyStats = await Question.aggregate([
      { $match: userFilter },
      {
        $group: {
          _id: '$difficulty',
          count: { $sum: 1 }
        }
      },
      { $sort: { count: -1 } }
    ]);
    
    // Tag statistics
    const tagStats = await Tag.find({ user: req.user?._id, isActive: true, count: { $gt: 0 } })
      .sort({ count: -1 })
      .limit(10);
    
    // Recent activity (questions added in last 7 days)
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    
    const recentQuestions = await Question.countDocuments({
      ...userFilter,
      createdAt: { $gte: oneWeekAgo }
    });
    
    // Monthly statistics (last 12 months)
    const monthlyStats = await Question.aggregate([
      { $match: { ...userFilter, createdAt: { $gte: new Date(new Date().getFullYear(), new Date().getMonth() - 11, 1) } } },
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' }
          },
          count: { $sum: 1 }
        }
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } }
    ]);
    
    // Company and position stats
    const companyStats = await Question.aggregate([
      { $match: { ...userFilter, company: { $ne: '' } } },
      {
        $group: {
          _id: '$company',
          count: { $sum: 1 }
        }
      },
      { $sort: { count: -1 } },
      { $limit: 10 }
    ]);
    
    const positionStats = await Question.aggregate([
      { $match: { ...userFilter, position: { $ne: '' } } },
      {
        $group: {
          _id: '$position',
          count: { $sum: 1 }
        }
      },
      { $sort: { count: -1 } },
      { $limit: 10 }
    ]);
    
    res.json({
      status: 'success',
      data: {
        overview: {
          totalQuestions,
          favoritesCount,
          reviewCount,
          hotCount,
          recentQuestions
        },
        rounds: roundStats,
        difficulty: difficultyStats,
        topTags: tagStats,
        monthly: monthlyStats,
        companies: companyStats,
        positions: positionStats
      }
    });
    
  } catch (error) {
    console.error('Error fetching stats:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to fetch statistics',
      error: error.message
    });
  }
});

// GET /api/stats/dashboard - Get dashboard-specific stats
router.get('/dashboard', async (req, res) => {
  try {
    const userFilter = { user: req.user?._id };
    const totalQuestions = await Question.countDocuments(userFilter);
    const favoritesCount = await Question.countDocuments({ ...userFilter, favorite: true });
    const reviewCount = await Question.countDocuments({ ...userFilter, review: true });
    const hotCount = await Question.countDocuments({ ...userFilter, hot: true });
    
    res.json({
      status: 'success',
      data: {
        totalQuestions,
        favoritesCount,
        reviewCount,
        hotCount
      }
    });
    
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to fetch dashboard statistics',
      error: error.message
    });
  }
});

// GET /api/stats/trends - Get trending data
router.get('/trends', async (req, res) => {
  try {
    const { period = '30' } = req.query;
    const daysAgo = parseInt(period);
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - daysAgo);
    
    // Daily question creation trend
    const dailyTrend = await Question.aggregate([
      {
        $match: {
          user: req.user?._id,
          createdAt: { $gte: startDate }
        }
      },
      {
        $group: {
          _id: {
            $dateToString: {
              format: '%Y-%m-%d',
              date: '$createdAt'
            }
          },
          count: { $sum: 1 }
        }
      },
      { $sort: { '_id': 1 } }
    ]);
    
    // Round trends
    const roundTrends = await Question.aggregate([
      {
        $match: {
          user: req.user?._id,
          createdAt: { $gte: startDate }
        }
      },
      {
        $group: {
          _id: {
            date: {
              $dateToString: {
                format: '%Y-%m-%d',
                date: '$createdAt'
              }
            },
            round: '$round'
          },
          count: { $sum: 1 }
        }
      },
      { $sort: { '_id.date': 1 } }
    ]);
    
    res.json({
      status: 'success',
      data: {
        period: daysAgo,
        daily: dailyTrend,
        rounds: roundTrends
      }
    });
    
  } catch (error) {
    console.error('Error fetching trends:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to fetch trends',
      error: error.message
    });
  }
});

export default router;
