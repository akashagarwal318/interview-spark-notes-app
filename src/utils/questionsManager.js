
import { defaultQuestions } from '../data/questions';

const STORAGE_KEY = 'interviewQuestions';
const SETTINGS_KEY = 'appSettings';

export const questionsManager = {
  // Load questions from localStorage or return defaults
  loadQuestions: () => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        console.log('Loaded questions from localStorage:', parsed.length);
        // If we have stored questions but they're empty or less than expected, merge with defaults
        if (parsed.length === 0) {
          console.log('No stored questions found, loading defaults');
          const questions = [...defaultQuestions];
          questionsManager.saveQuestions(questions);
          return questions;
        }
        return parsed;
      }
    } catch (error) {
      console.error('Error loading questions from localStorage:', error);
    }
    
    console.log('Using default questions');
    const questions = [...defaultQuestions];
    questionsManager.saveQuestions(questions);
    return questions;
  },

  // Force reload default questions (for testing)
  loadDefaultQuestions: () => {
    console.log('Force loading default questions');
    const questions = [...defaultQuestions];
    questionsManager.saveQuestions(questions);
    return questions;
  },

  // Save questions to localStorage
  saveQuestions: (questions) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(questions));
      console.log('Saved questions to localStorage:', questions.length);
    } catch (error) {
      console.error('Error saving questions to localStorage:', error);
    }
  },

  // Load app settings
  loadSettings: () => {
    try {
      const stored = localStorage.getItem(SETTINGS_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (error) {
      console.error('Error loading settings from localStorage:', error);
    }
    return {};
  },

  // Save app settings
  saveSettings: (settings) => {
    try {
      localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
    } catch (error) {
      console.error('Error saving settings to localStorage:', error);
    }
  },

  // Add a new question
  addQuestion: (questionData) => {
    const questions = questionsManager.loadQuestions();
    const newQuestion = {
      id: Date.now(),
      ...questionData,
      favorite: false,
      review: false,
      hot: false
    };
    
    const updatedQuestions = [newQuestion, ...questions];
    questionsManager.saveQuestions(updatedQuestions);
    return newQuestion;
  },

  // Update a question
  updateQuestion: (id, updates) => {
    const questions = questionsManager.loadQuestions();
    const updatedQuestions = questions.map(q => 
      q.id === id ? { ...q, ...updates } : q
    );
    questionsManager.saveQuestions(updatedQuestions);
    return updatedQuestions;
  },

  // Delete a question
  deleteQuestion: (id) => {
    const questions = questionsManager.loadQuestions();
    const updatedQuestions = questions.filter(q => q.id !== id);
    questionsManager.saveQuestions(updatedQuestions);
    return updatedQuestions;
  },

  // Add image to a question
  addImageToQuestion: (id, image) => {
    const questions = questionsManager.loadQuestions();
    const updatedQuestions = questions.map(q => {
      if (q.id === id) {
        const existingImages = q.images || [];
        return { ...q, images: [...existingImages, image] };
      }
      return q;
    });
    questionsManager.saveQuestions(updatedQuestions);
    return updatedQuestions;
  },

  // Remove image from a question
  removeImageFromQuestion: (id, imageIndex) => {
    const questions = questionsManager.loadQuestions();
    const updatedQuestions = questions.map(q => {
      if (q.id === id && q.images) {
        const newImages = [...q.images];
        newImages.splice(imageIndex, 1);
        return { ...q, images: newImages };
      }
      return q;
    });
    questionsManager.saveQuestions(updatedQuestions);
    return updatedQuestions;
  },

  // Clear all questions and reload defaults
  resetToDefaults: () => {
    localStorage.removeItem(STORAGE_KEY);
    return questionsManager.loadDefaultQuestions();
  },

  // Export questions to JSON file
  exportQuestions: () => {
    const questions = questionsManager.loadQuestions();
    const dataStr = JSON.stringify(questions, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    
    const link = document.createElement('a');
    link.href = URL.createObjectURL(dataBlob);
    link.download = `interview-questions-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
  },

  // Import questions from JSON file
  importQuestions: (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const importedQuestions = JSON.parse(event.target.result);
          if (Array.isArray(importedQuestions)) {
            questionsManager.saveQuestions(importedQuestions);
            resolve(importedQuestions);
          } else {
            reject(new Error('Invalid file format'));
          }
        } catch (error) {
          reject(error);
        }
      };
      reader.readAsText(file);
    });
  }
};
