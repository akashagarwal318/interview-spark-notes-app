import ApiService from './api.js';

class StatsService {
  // Get comprehensive statistics
  async getStats() {
    try {
      const response = await ApiService.get('/stats');
      return response.data;
    } catch (error) {
      console.error('Error fetching stats:', error);
      throw error;
    }
  }

  // Get dashboard-specific stats
  async getDashboardStats() {
    try {
      const response = await ApiService.get('/stats/dashboard');
      return response.data;
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
      throw error;
    }
  }

  // Get trends data
  async getTrends(period = '30') {
    try {
      const response = await ApiService.get('/stats/trends', { period });
      return response.data;
    } catch (error) {
      console.error('Error fetching trends:', error);
      throw error;
    }
  }

  // Calculate local stats (for cases when API is unavailable)
  calculateLocalStats(questions) {
    const stats = {
      overview: {
        totalQuestions: questions.length,
        favoritesCount: questions.filter(q => q.favorite).length,
        reviewCount: questions.filter(q => q.review).length,
        hotCount: questions.filter(q => q.hot).length,
        recentQuestions: 0
      },
      rounds: [],
      difficulty: [],
      topTags: [],
      monthly: [],
      companies: [],
      positions: []
    };

    // Calculate recent questions (last 7 days)
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    stats.overview.recentQuestions = questions.filter(q => 
      new Date(q.createdAt) >= oneWeekAgo
    ).length;

    // Calculate round statistics
    const roundCounts = {};
    questions.forEach(q => {
      roundCounts[q.round] = (roundCounts[q.round] || 0) + 1;
    });
    
    stats.rounds = Object.entries(roundCounts).map(([round, count]) => ({
      _id: round,
      count,
      favorites: questions.filter(q => q.round === round && q.favorite).length,
      reviews: questions.filter(q => q.round === round && q.review).length,
      hot: questions.filter(q => q.round === round && q.hot).length
    })).sort((a, b) => b.count - a.count);

    // Calculate difficulty statistics
    const difficultyCounts = {};
    questions.forEach(q => {
      const difficulty = q.difficulty || 'medium';
      difficultyCounts[difficulty] = (difficultyCounts[difficulty] || 0) + 1;
    });
    
    stats.difficulty = Object.entries(difficultyCounts).map(([difficulty, count]) => ({
      _id: difficulty,
      count
    })).sort((a, b) => b.count - a.count);

    // Calculate tag statistics
    const tagCounts = {};
    questions.forEach(q => {
      if (q.tags && Array.isArray(q.tags)) {
        q.tags.forEach(tag => {
          tagCounts[tag] = (tagCounts[tag] || 0) + 1;
        });
      }
    });
    
    stats.topTags = Object.entries(tagCounts)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);

    // Calculate monthly statistics (last 12 months)
    const monthlyData = {};
    const twelveMonthsAgo = new Date();
    twelveMonthsAgo.setMonth(twelveMonthsAgo.getMonth() - 11);
    
    questions
      .filter(q => new Date(q.createdAt) >= twelveMonthsAgo)
      .forEach(q => {
        const date = new Date(q.createdAt);
        const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
        monthlyData[key] = (monthlyData[key] || 0) + 1;
      });
    
    stats.monthly = Object.entries(monthlyData)
      .map(([key, count]) => {
        const [year, month] = key.split('-');
        return {
          _id: { year: parseInt(year), month: parseInt(month) },
          count
        };
      })
      .sort((a, b) => {
        if (a._id.year !== b._id.year) return a._id.year - b._id.year;
        return a._id.month - b._id.month;
      });

    // Calculate company statistics
    const companyCounts = {};
    questions.forEach(q => {
      if (q.company && q.company.trim()) {
        companyCounts[q.company] = (companyCounts[q.company] || 0) + 1;
      }
    });
    
    stats.companies = Object.entries(companyCounts)
      .map(([company, count]) => ({ _id: company, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);

    // Calculate position statistics
    const positionCounts = {};
    questions.forEach(q => {
      if (q.position && q.position.trim()) {
        positionCounts[q.position] = (positionCounts[q.position] || 0) + 1;
      }
    });
    
    stats.positions = Object.entries(positionCounts)
      .map(([position, count]) => ({ _id: position, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);

    return stats;
  }

  // Format stats for display
  formatStatsForDisplay(stats) {
    return {
      cards: [
        {
          title: 'Total Questions',
          value: stats.overview.totalQuestions,
          icon: '📚',
          color: 'blue'
        },
        {
          title: 'Favorites',
          value: stats.overview.favoritesCount,
          icon: '⭐',
          color: 'yellow'
        },
        {
          title: 'Review',
          value: stats.overview.reviewCount,
          icon: '📌',
          color: 'green'
        },
        {
          title: 'Hot',
          value: stats.overview.hotCount,
          icon: '🔥',
          color: 'red'
        }
      ],
      rounds: stats.rounds.map(round => ({
        ...round,
        label: this.formatRoundLabel(round._id),
        percentage: ((round.count / stats.overview.totalQuestions) * 100).toFixed(1)
      })),
      tags: stats.topTags,
      trends: stats.monthly
    };
  }

  formatRoundLabel(round) {
    const labels = {
      technical: '💻 Technical',
      hr: '👥 HR',
      telephonic: '📞 Telephonic',
      introduction: '👋 Introduction',
      behavioral: '🧠 Behavioral',
      'system-design': '🏗️ System Design',
      coding: '⚡ Coding'
    };
    return labels[round] || round;
  }

  // Export stats to different formats
  exportStats(stats, format = 'json') {
    switch (format) {
      case 'csv':
        return this.exportToCsv(stats);
      case 'json':
        return JSON.stringify(stats, null, 2);
      default:
        return stats;
    }
  }

  exportToCsv(stats) {
    const csvData = [];
    
    // Overview stats
    csvData.push('Overview Statistics');
    csvData.push('Metric,Value');
    csvData.push(`Total Questions,${stats.overview.totalQuestions}`);
    csvData.push(`Favorites,${stats.overview.favoritesCount}`);
    csvData.push(`Review,${stats.overview.reviewCount}`);
    csvData.push(`Hot,${stats.overview.hotCount}`);
    csvData.push(`Recent (7 days),${stats.overview.recentQuestions}`);
    csvData.push('');
    
    // Round statistics
    csvData.push('Round Statistics');
    csvData.push('Round,Count,Favorites,Reviews,Hot');
    stats.rounds.forEach(round => {
      csvData.push(`${round._id},${round.count},${round.favorites},${round.reviews},${round.hot}`);
    });
    csvData.push('');
    
    // Tag statistics
    csvData.push('Top Tags');
    csvData.push('Tag,Count');
    stats.topTags.forEach(tag => {
      csvData.push(`${tag.name},${tag.count}`);
    });
    
    return csvData.join('\n');
  }
}

export default new StatsService();
