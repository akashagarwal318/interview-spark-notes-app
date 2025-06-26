
import React, { useState, useEffect } from 'react';
import { questionsManager } from '../utils/questionsManager';
import { Question } from '../data/questions';
import Header from './Header';
import QuickStats from './QuickStats';
import SearchFilters from './SearchFilters';
import QuestionForm from './QuestionForm';
import QuestionCard from './QuestionCard';
import ImageModal from './ImageModal';

const InterviewAssistant: React.FC = () => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [filteredQuestions, setFilteredQuestions] = useState<Question[]>([]);
  const [currentTheme, setCurrentTheme] = useState('light');
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [expandedQuestions, setExpandedQuestions] = useState<Set<number>>(new Set());
  const [editingQuestions, setEditingQuestions] = useState<Set<number>>(new Set());
  
  // Search and filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [searchType, setSearchType] = useState('question');
  const [currentRound, setCurrentRound] = useState('technical');
  const [activeTagFilter, setActiveTagFilter] = useState<string | null>(null);
  const [activeStatusFilter, setActiveStatusFilter] = useState('all');
  
  // Image modal
  const [imageModalOpen, setImageModalOpen] = useState(false);
  const [currentImageSrc, setCurrentImageSrc] = useState('');

  // Initialize questions
  useEffect(() => {
    const loadedQuestions = questionsManager.loadQuestions();
    setQuestions(loadedQuestions);
  }, []);

  // Load theme
  useEffect(() => {
    const savedTheme = localStorage.getItem('interviewAssistantTheme') || 'light';
    setCurrentTheme(savedTheme);
    document.documentElement.classList.toggle('dark', savedTheme === 'dark');
  }, []);

  // Apply filters
  useEffect(() => {
    console.log('Applying filters...');
    console.log('Total questions:', questions.length);
    console.log('Current round:', currentRound);
    console.log('Active status filter:', activeStatusFilter);
    console.log('Active tag filter:', activeTagFilter);
    console.log('Search term:', searchTerm);
    
    let filtered = currentRound === 'all' ? questions : questions.filter(q => q.round === currentRound);
    console.log('After round filter:', filtered.length);

    if (activeStatusFilter !== 'all') {
      filtered = filtered.filter(q => q[activeStatusFilter as keyof Question] === true);
      console.log('After status filter:', filtered.length);
    }

    if (activeTagFilter) {
      filtered = filtered.filter(q => q.tags?.includes(activeTagFilter));
      console.log('After tag filter:', filtered.length);
    }

    if (searchTerm) {
      filtered = filtered.filter(q => {
        switch (searchType) {
          case 'question':
            return q.question.toLowerCase().includes(searchTerm.toLowerCase());
          case 'answer':
            return q.answer.toLowerCase().includes(searchTerm.toLowerCase());
          case 'code':
            return q.code?.toLowerCase().includes(searchTerm.toLowerCase());
          case 'tags':
            return q.tags?.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
          default:
            return false;
        }
      });
      console.log('After search filter:', filtered.length);
    }

    console.log('Final filtered questions:', filtered.length);
    setFilteredQuestions(filtered);
  }, [questions, currentRound, activeStatusFilter, activeTagFilter, searchTerm, searchType]);

  const handleAddQuestion = (questionData: any) => {
    const newQuestion = questionsManager.addQuestion(questionData);
    setQuestions(questionsManager.loadQuestions());
    setIsFormVisible(false);
  };

  const handleToggleExpand = (id: number) => {
    const newExpanded = new Set(expandedQuestions);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedQuestions(newExpanded);
  };

  const handleToggleEdit = (id: number) => {
    const newEditing = new Set(editingQuestions);
    if (newEditing.has(id)) {
      newEditing.delete(id);
    } else {
      newEditing.add(id);
    }
    setEditingQuestions(newEditing);
  };

  const handleToggleStatus = (id: number, status: 'favorite' | 'review' | 'hot') => {
    const question = questions.find(q => q.id === id);
    if (question) {
      questionsManager.updateQuestion(id, { [status]: !question[status] });
      setQuestions(questionsManager.loadQuestions());
    }
  };

  const handleDelete = (id: number) => {
    if (confirm('Are you sure you want to delete this question?')) {
      questionsManager.deleteQuestion(id);
      setQuestions(questionsManager.loadQuestions());
    }
  };

  const handleSave = (id: number, field: string, value: string) => {
    if (field === 'tags') {
      questionsManager.updateQuestion(id, { 
        tags: value.split(',').map(tag => tag.trim()).filter(tag => tag) 
      });
    } else {
      questionsManager.updateQuestion(id, { [field]: value });
    }
    setQuestions(questionsManager.loadQuestions());
  };

  const handleAddImage = (questionId: number, image: { name: string; data: string; size: number }) => {
    questionsManager.addImageToQuestion(questionId, image);
    setQuestions(questionsManager.loadQuestions());
  };

  const handleRemoveImage = (questionId: number, imageIndex: number) => {
    questionsManager.removeImageFromQuestion(questionId, imageIndex);
    setQuestions(questionsManager.loadQuestions());
  };

  const handleThemeToggle = () => {
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    setCurrentTheme(newTheme);
    document.documentElement.classList.toggle('dark', newTheme === 'dark');
    localStorage.setItem('interviewAssistantTheme', newTheme);
  };

  const handleShowAll = () => {
    setSearchTerm('');
    setActiveTagFilter(null);
    setActiveStatusFilter('all');
    setCurrentRound('all');
  };

  const handleImageClick = (imageSrc: string) => {
    setCurrentImageSrc(imageSrc);
    setImageModalOpen(true);
  };

  const getAllTags = () => {
    const allTags = new Set<string>();
    const questionsToCheck = currentRound === 'all' ? questions : questions.filter(q => q.round === currentRound);
    questionsToCheck.forEach(q => {
      q.tags?.forEach(tag => allTags.add(tag));
    });
    return Array.from(allTags).sort();
  };

  const getStats = () => ({
    total: questions.length,
    favorites: questions.filter(q => q.favorite).length,
    review: questions.filter(q => q.review).length,
    hot: questions.filter(q => q.hot).length
  });

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
      <div className="max-w-6xl mx-auto p-6">
        <Header
          onAddQuestion={() => setIsFormVisible(true)}
          onShowAll={handleShowAll}
          onToggleTheme={handleThemeToggle}
          currentTheme={currentTheme}
        />

        <QuickStats stats={getStats()} />

        <SearchFilters
          searchTerm={searchTerm}
          searchType={searchType}
          currentRound={currentRound}
          activeTagFilter={activeTagFilter}
          activeStatusFilter={activeStatusFilter}
          tags={getAllTags()}
          onSearchChange={setSearchTerm}
          onSearchTypeChange={setSearchType}
          onRoundChange={setCurrentRound}
          onTagFilter={setActiveTagFilter}
          onStatusFilter={setActiveStatusFilter}
        />

        <QuestionForm
          isVisible={isFormVisible}
          currentRound={currentRound === 'all' ? 'technical' : currentRound}
          onSubmit={handleAddQuestion}
          onCancel={() => setIsFormVisible(false)}
        />

        <div className="space-y-6">
          {filteredQuestions.length === 0 ? (
            <div className="text-center py-16">
              <div className="text-6xl mb-4 opacity-50">🔍</div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">No questions found</h3>
              <p className="text-gray-600 dark:text-gray-400">Try adjusting your search terms or add a new question.</p>
            </div>
          ) : (
            filteredQuestions.map(question => (
              <QuestionCard
                key={question.id}
                question={question}
                isExpanded={expandedQuestions.has(question.id)}
                isEditing={editingQuestions.has(question.id)}
                onToggleExpand={() => handleToggleExpand(question.id)}
                onToggleEdit={() => handleToggleEdit(question.id)}
                onToggleStatus={(status) => handleToggleStatus(question.id, status)}
                onDelete={() => handleDelete(question.id)}
                onSave={(field, value) => handleSave(question.id, field, value)}
                onImageClick={handleImageClick}
                onRemoveImage={(imageIndex) => handleRemoveImage(question.id, imageIndex)}
                onAddImage={(image) => handleAddImage(question.id, image)}
              />
            ))
          )}
        </div>

        <ImageModal
          isOpen={imageModalOpen}
          imageSrc={currentImageSrc}
          onClose={() => setImageModalOpen(false)}
        />
      </div>
    </div>
  );
};

export default InterviewAssistant;
