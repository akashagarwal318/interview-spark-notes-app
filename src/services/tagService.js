import ApiService from './api.js';

class TagService {
  // Get all tags
  async getTags(params = {}) {
    try {
      const response = await ApiService.get('/tags', params);
      return response.data.tags;
    } catch (error) {
      console.error('Error fetching tags:', error);
      throw error;
    }
  }

  // Get popular tags
  async getPopularTags(limit = 20) {
    try {
      const response = await ApiService.get('/tags/popular', { limit });
      return response.data.tags;
    } catch (error) {
      console.error('Error fetching popular tags:', error);
      throw error;
    }
  }

  // Get tag categories
  async getTagCategories() {
    try {
      const response = await ApiService.get('/tags/categories');
      return response.data.categories;
    } catch (error) {
      console.error('Error fetching tag categories:', error);
      throw error;
    }
  }

  // Get specific tag with associated questions
  async getTag(name) {
    try {
      const response = await ApiService.get(`/tags/${name}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching tag:', error);
      throw error;
    }
  }

  // Create a new tag
  async createTag(tagData) {
    try {
      const response = await ApiService.post('/tags', tagData);
      return response.data.tag;
    } catch (error) {
      console.error('Error creating tag:', error);
      throw error;
    }
  }

  // Update a tag
  async updateTag(name, tagData) {
    try {
      const response = await ApiService.put(`/tags/${name}`, tagData);
      return response.data.tag;
    } catch (error) {
      console.error('Error updating tag:', error);
      throw error;
    }
  }

  // Delete a tag
  async deleteTag(name) {
    try {
      const response = await ApiService.delete(`/tags/${name}`);
      return response;
    } catch (error) {
      console.error('Error deleting tag:', error);
      throw error;
    }
  }

  // Sync tags from questions
  async syncTags() {
    try {
      const response = await ApiService.post('/tags/sync');
      return response.data;
    } catch (error) {
      console.error('Error syncing tags:', error);
      throw error;
    }
  }

  // Search tags
  async searchTags(searchTerm, category = '') {
    try {
      const params = {
        search: searchTerm,
        ...(category && { category })
      };
      return this.getTags(params);
    } catch (error) {
      console.error('Error searching tags:', error);
      throw error;
    }
  }

  // Get tags by category
  async getTagsByCategory(category, params = {}) {
    try {
      const allParams = {
        category,
        ...params
      };
      return this.getTags(allParams);
    } catch (error) {
      console.error('Error fetching tags by category:', error);
      throw error;
    }
  }

  // Get tag suggestions based on question content
  async getTagSuggestions(questionText, answerText = '') {
    try {
      // This could be enhanced with AI/ML suggestions in the future
      const allTags = await this.getPopularTags(100);
      const text = `${questionText} ${answerText}`.toLowerCase();
      
      const suggestions = allTags.filter(tag => {
        const tagName = tag.name.toLowerCase();
        return text.includes(tagName) || tagName.includes(text.split(' ')[0]);
      });

      return suggestions.slice(0, 10); // Return top 10 suggestions
    } catch (error) {
      console.error('Error getting tag suggestions:', error);
      return [];
    }
  }

  // Validate tag name
  validateTagName(name) {
    const errors = [];
    
    if (!name || name.trim().length === 0) {
      errors.push('Tag name is required');
    }
    
    if (name.length > 50) {
      errors.push('Tag name must be 50 characters or less');
    }
    
    if (!/^[a-zA-Z0-9\-_\s]+$/.test(name)) {
      errors.push('Tag name can only contain letters, numbers, hyphens, underscores, and spaces');
    }
    
    return {
      isValid: errors.length === 0,
      errors
    };
  }

  // Format tag name (normalize)
  formatTagName(name) {
    return name.trim().toLowerCase().replace(/\s+/g, '-');
  }
}

export default new TagService();
