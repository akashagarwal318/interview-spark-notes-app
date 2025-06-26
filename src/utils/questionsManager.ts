
import { Question, defaultQuestions } from '../data/questions';

const STORAGE_KEY = 'interviewQuestions';

export const questionsManager = {
  // Load questions from localStorage or return defaults
  loadQuestions: (): Question[] => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        console.log('Loaded questions from localStorage:', parsed.length);
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

  // Save questions to localStorage
  saveQuestions: (questions: Question[]): void => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(questions));
      console.log('Saved questions to localStorage:', questions.length);
    } catch (error) {
      console.error('Error saving questions to localStorage:', error);
    }
  },

  // Add a new question
  addQuestion: (questionData: Omit<Question, 'id' | 'favorite' | 'review' | 'hot'>): Question => {
    const questions = questionsManager.loadQuestions();
    const newQuestion: Question = {
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
  updateQuestion: (id: number, updates: Partial<Question>): Question[] => {
    const questions = questionsManager.loadQuestions();
    const updatedQuestions = questions.map(q => 
      q.id === id ? { ...q, ...updates } : q
    );
    questionsManager.saveQuestions(updatedQuestions);
    return updatedQuestions;
  },

  // Delete a question
  deleteQuestion: (id: number): Question[] => {
    const questions = questionsManager.loadQuestions();
    const updatedQuestions = questions.filter(q => q.id !== id);
    questionsManager.saveQuestions(updatedQuestions);
    return updatedQuestions;
  },

  // Add image to a question
  addImageToQuestion: (id: number, image: { name: string; data: string; size: number }): Question[] => {
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
  removeImageFromQuestion: (id: number, imageIndex: number): Question[] => {
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
  }
};
