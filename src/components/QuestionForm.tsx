
import React, { useState } from 'react';

interface QuestionFormProps {
  isVisible: boolean;
  currentRound: string;
  onSubmit: (question: any) => void;
  onCancel: () => void;
}

const QuestionForm: React.FC<QuestionFormProps> = ({
  isVisible,
  currentRound,
  onSubmit,
  onCancel
}) => {
  const [formData, setFormData] = useState({
    round: currentRound,
    question: '',
    answer: '',
    code: '',
    tags: ''
  });
  const [images, setImages] = useState<File[]>([]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.question.trim() || !formData.answer.trim()) {
      alert('Please fill in both question and answer fields.');
      return;
    }

    const processedImages = await Promise.all(
      images.map(file => {
        return new Promise((resolve) => {
          const reader = new FileReader();
          reader.onload = (e) => {
            resolve({
              name: file.name,
              data: e.target?.result,
              size: file.size
            });
          };
          reader.readAsDataURL(file);
        });
      })
    );

    const questionData = {
      ...formData,
      tags: formData.tags ? formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag) : [],
      images: processedImages
    };

    onSubmit(questionData);
    
    // Reset form
    setFormData({
      round: currentRound,
      question: '',
      answer: '',
      code: '',
      tags: ''
    });
    setImages([]);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setImages(files);
  };

  if (!isVisible) return null;

  return (
    <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-6 mb-8 shadow-sm">
      <h3 className="text-xl font-semibold mb-6 text-gray-900 dark:text-white">Add New Question</h3>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Interview Round
          </label>
          <select
            value={formData.round}
            onChange={(e) => setFormData(prev => ({ ...prev, round: e.target.value }))}
            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
          >
            <option value="technical">Technical Round</option>
            <option value="hr">HR Round</option>
            <option value="telephonic">Telephonic Round</option>
            <option value="introduction">Introduction Round</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Question *
          </label>
          <input
            type="text"
            required
            value={formData.question}
            onChange={(e) => setFormData(prev => ({ ...prev, question: e.target.value }))}
            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Answer *
          </label>
          <textarea
            required
            rows={6}
            value={formData.answer}
            onChange={(e) => setFormData(prev => ({ ...prev, answer: e.target.value }))}
            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 font-mono resize-y"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Code Snippet (optional)
          </label>
          <textarea
            rows={8}
            value={formData.code}
            onChange={(e) => setFormData(prev => ({ ...prev, code: e.target.value }))}
            placeholder="// Your code here..."
            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-900 text-green-400 focus:ring-2 focus:ring-blue-500 font-mono text-sm resize-y"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Tags (comma-separated)
          </label>
          <input
            type="text"
            value={formData.tags}
            onChange={(e) => setFormData(prev => ({ ...prev, tags: e.target.value }))}
            placeholder="React, JavaScript, Hooks"
            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Images (optional)
          </label>
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={handleImageChange}
            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="flex gap-4 justify-end">
          <button
            type="button"
            onClick={onCancel}
            className="px-6 py-3 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            💾 Save Question
          </button>
        </div>
      </form>
    </div>
  );
};

export default QuestionForm;
