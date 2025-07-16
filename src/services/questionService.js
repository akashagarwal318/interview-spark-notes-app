import ApiService from './api.js';

class QuestionService {
  // Get all questions with filtering and pagination
  async getQuestions(params = {}) {
    try {
      const response = await ApiService.get('/questions', params);
      return response.data;
    } catch (error) {
      console.error('Error fetching questions:', error);
      throw error;
    }
  }

  // Get a specific question by ID
  async getQuestion(id) {
    try {
      const response = await ApiService.get(`/questions/${id}`);
      return response.data.question;
    } catch (error) {
      console.error('Error fetching question:', error);
      throw error;
    }
  }

  // Create a new question
  async createQuestion(questionData) {
    try {
      const response = await ApiService.post('/questions', questionData);
      return response.data.question;
    } catch (error) {
      console.error('Error creating question:', error);
      throw error;
    }
  }

  // Update an existing question
  async updateQuestion(id, questionData) {
    try {
      const response = await ApiService.put(`/questions/${id}`, questionData);
      return response.data.question;
    } catch (error) {
      console.error('Error updating question:', error);
      throw error;
    }
  }

  // Delete a question
  async deleteQuestion(id) {
    try {
      const response = await ApiService.delete(`/questions/${id}`);
      return response;
    } catch (error) {
      console.error('Error deleting question:', error);
      throw error;
    }
  }

  // Toggle question status (favorite, review, hot)
  async toggleQuestionStatus(id, field) {
    try {
      const response = await ApiService.patch(`/questions/${id}/toggle/${field}`);
      return response.data.question;
    } catch (error) {
      console.error(`Error toggling ${field}:`, error);
      throw error;
    }
  }

  // Search questions
  async searchQuestions(searchTerm, filters = {}) {
    try {
      const params = {
        search: searchTerm,
        ...filters
      };
      return this.getQuestions(params);
    } catch (error) {
      console.error('Error searching questions:', error);
      throw error;
    }
  }

  // Get questions by round
  async getQuestionsByRound(round, params = {}) {
    try {
      const allParams = {
        round,
        ...params
      };
      return this.getQuestions(allParams);
    } catch (error) {
      console.error('Error fetching questions by round:', error);
      throw error;
    }
  }

  // Get questions by tags
  async getQuestionsByTags(tags, params = {}) {
    try {
      const allParams = {
        tags: Array.isArray(tags) ? tags.join(',') : tags,
        ...params
      };
      return this.getQuestions(allParams);
    } catch (error) {
      console.error('Error fetching questions by tags:', error);
      throw error;
    }
  }

  // Get favorite questions
  async getFavoriteQuestions(params = {}) {
    try {
      return this.getQuestions({ favorite: 'true', ...params });
    } catch (error) {
      console.error('Error fetching favorite questions:', error);
      throw error;
    }
  }

  // Get review questions
  async getReviewQuestions(params = {}) {
    try {
      return this.getQuestions({ review: 'true', ...params });
    } catch (error) {
      console.error('Error fetching review questions:', error);
      throw error;
    }
  }

  // Get hot questions
  async getHotQuestions(params = {}) {
    try {
      return this.getQuestions({ hot: 'true', ...params });
    } catch (error) {
      console.error('Error fetching hot questions:', error);
      throw error;
    }
  }

  // Bulk operations
  async bulkUpdateQuestions(updates) {
    try {
      const promises = updates.map(({ id, data }) => 
        this.updateQuestion(id, data)
      );
      return await Promise.all(promises);
    } catch (error) {
      console.error('Error bulk updating questions:', error);
      throw error;
    }
  }

  async bulkDeleteQuestions(ids) {
    try {
      const promises = ids.map(id => this.deleteQuestion(id));
      return await Promise.all(promises);
    } catch (error) {
      console.error('Error bulk deleting questions:', error);
      throw error;
    }
  }
}

export default new QuestionService();
