import React, { useState } from 'react';
import QuestionService from '../services/questionService.js';

const DataMigration = () => {
  const [migrationStatus, setMigrationStatus] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const migrateLocalStorageData = async () => {
    setIsLoading(true);
    setMigrationStatus('Starting migration...');

    try {
      // Get data from localStorage
      const localData = localStorage.getItem('interviewQuestions');
      
      if (!localData) {
        setMigrationStatus('No data found in localStorage to migrate.');
        setIsLoading(false);
        return;
      }

      const questions = JSON.parse(localData);
      
      if (!Array.isArray(questions) || questions.length === 0) {
        setMigrationStatus('No valid questions found in localStorage.');
        setIsLoading(false);
        return;
      }

      setMigrationStatus(`Found ${questions.length} questions. Starting migration...`);

      let successful = 0;
      let failed = 0;

      for (const question of questions) {
        try {
          // Clean up the question data for API
          const questionData = {
            round: question.round || 'technical',
            question: question.question,
            answer: question.answer,
            code: question.code || '',
            tags: question.tags || [],
            images: question.images || [],
            favorite: question.favorite || false,
            review: question.review || false,
            hot: question.hot || false,
            difficulty: question.difficulty || 'medium',
            company: question.company || '',
            position: question.position || '',
            notes: question.notes || ''
          };

          await QuestionService.createQuestion(questionData);
          successful++;
          setMigrationStatus(`Migrated ${successful}/${questions.length} questions...`);
        } catch (error) {
          console.error('Error migrating question:', error);
          failed++;
        }
      }

      setMigrationStatus(
        `Migration completed! ${successful} questions migrated successfully, ${failed} failed.`
      );

      if (successful > 0) {
        // Optionally backup and clear localStorage
        localStorage.setItem('interviewQuestions_backup', localData);
        localStorage.removeItem('interviewQuestions');
        setMigrationStatus(prev => 
          prev + '\n\nLocalStorage data has been backed up and cleared.'
        );
      }

    } catch (error) {
      console.error('Migration error:', error);
      setMigrationStatus(`Migration failed: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const exportLocalStorageData = () => {
    const localData = localStorage.getItem('interviewQuestions');
    if (!localData) {
      alert('No data found in localStorage');
      return;
    }

    const blob = new Blob([localData], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `interview-questions-backup-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const clearLocalStorage = () => {
    if (window.confirm('Are you sure you want to clear localStorage data? This cannot be undone.')) {
      localStorage.removeItem('interviewQuestions');
      setMigrationStatus('LocalStorage data cleared.');
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">
        📦 Data Migration Tool
      </h2>
      
      <div className="space-y-4">
        <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
          <h3 className="font-semibold text-blue-800 dark:text-blue-200 mb-2">
            Migrate from LocalStorage to Database
          </h3>
          <p className="text-blue-700 dark:text-blue-300 text-sm mb-4">
            This will transfer all your questions from browser storage to the database.
            Your localStorage data will be backed up before clearing.
          </p>
          <button
            onClick={migrateLocalStorageData}
            disabled={isLoading}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
          >
            {isLoading ? 'Migrating...' : 'Start Migration'}
          </button>
        </div>

        <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg">
          <h3 className="font-semibold text-yellow-800 dark:text-yellow-200 mb-2">
            Backup Options
          </h3>
          <div className="space-x-2">
            <button
              onClick={exportLocalStorageData}
              className="bg-yellow-600 text-white px-4 py-2 rounded-lg hover:bg-yellow-700 transition-colors text-sm"
            >
              Export to JSON
            </button>
            <button
              onClick={clearLocalStorage}
              className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors text-sm"
            >
              Clear LocalStorage
            </button>
          </div>
        </div>

        {migrationStatus && (
          <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
            <h3 className="font-semibold text-gray-800 dark:text-gray-200 mb-2">
              Migration Status
            </h3>
            <pre className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
              {migrationStatus}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
};

export default DataMigration;
