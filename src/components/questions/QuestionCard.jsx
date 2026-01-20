
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import ReactMarkdown from 'react-markdown';
import {
  Star,
  Bookmark,
  Flame,
  ChevronDown,
  Edit,
  Trash2,
  MoreVertical
} from 'lucide-react';
import { deleteQuestionAsync, toggleQuestionStatusAsync } from '../../store/slices/questionsSlice';
import { setImageModal, setEditingQuestion, setExpandedQuestionId } from '../../store/slices/uiSlice';
import CodeBlock from '../ui/CodeBlock';
import { extractCodeBlocks } from '../../utils/codeUtils';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';

const QuestionCard = ({ question }) => {
  const dispatch = useDispatch();
  const { expandedQuestionId } = useSelector(state => state.ui);
  const { searchTerm, searchScope } = useSelector(state => state.questions);
  const questionId = question._id || question.id;
  const lowerSearch = searchTerm?.toLowerCase().trim() || '';
  const expanded = expandedQuestionId === questionId;

  const handleToggle = (field) => {
    dispatch(toggleQuestionStatusAsync({ id: questionId, field }));
  };

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this question?')) {
      dispatch(deleteQuestionAsync(questionId));
    }
  };

  const handleEdit = () => {
    dispatch(setEditingQuestion(question));
  };

  const handleImageClick = (imageSrc) => {
    dispatch(setImageModal({ isOpen: true, imageSrc }));
  };

  const handleCardClick = (e) => {
    // Don't expand if clicking on buttons or interactive elements
    if (e.target.closest('button') || e.target.closest('[role="button"]')) {
      return;
    }
    dispatch(setExpandedQuestionId(expanded ? null : questionId));
  };

  const formatDate = (dateString) => {
    try {
      if (!dateString) return 'Recently added';
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return 'Recently added';
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch (error) {
      return 'Recently added';
    }
  };

  // Extract code blocks from answer markdown if they exist
  const codeBlocks = extractCodeBlocks(question.answer || '');

  // Helper to highlight matching text
  const highlightMatches = (text, searchText) => {
    if (!searchText || !text) return text;

    const parts = [];
    let lastIndex = 0;
    const lowerText = text.toLowerCase();

    while (lastIndex < text.length) {
      const indexOf = lowerText.indexOf(searchText, lastIndex);
      if (indexOf === -1) break;
      parts.push(text.substring(lastIndex, indexOf));
      parts.push(<mark key={indexOf} className="bg-yellow-200 dark:bg-yellow-900 rounded-sm px-0.5">{text.substring(indexOf, indexOf + searchText.length)}</mark>);
      lastIndex = indexOf + searchText.length;
    }
    parts.push(text.substring(lastIndex));
    return parts;
  };

  return (
    <div
      className="bg-card border border-border rounded-lg mb-1 transition-all hover:shadow-md hover:border-primary/20 cursor-pointer"
      onClick={handleCardClick}
      data-question-card
      data-expanded={expanded ? 'true' : 'false'}
    >
      {/* Header - Responsive layout */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between px-3 py-2 border-b border-border gap-1 sm:gap-0">
        <div className="flex-1 min-w-0">
          {/* Question title with 2-line clamp on mobile ONLY when collapsed */}
          <h3 className={`text-sm sm:text-lg font-medium text-card-foreground mb-0.5 leading-snug hover:text-primary transition-colors ${!expanded ? 'line-clamp-2 sm:line-clamp-none' : ''}`}>
            {lowerSearch && searchScope !== 'code' && searchScope !== 'answer' ? (
              <>{highlightMatches(question.question, lowerSearch)}</>
            ) : (
              <>{question.question}</>
            )}
          </h3>
          {/* Metadata - stack on mobile */}
          <div className="flex flex-wrap items-center text-[10px] sm:text-sm text-muted-foreground gap-1 sm:gap-3">
            <span className="capitalize">{question.round?.replace('-', ' ') || 'General'}</span>
            {question.subject && (
              <>
                <span className="opacity-40 hidden sm:inline">•</span>
                <span className="capitalize">{question.subject}</span>
              </>
            )}
            <span className="opacity-40 hidden sm:inline">•</span>
            <span className="hidden sm:inline">{formatDate(question.createdAt)}</span>
          </div>
        </div>

        {/* Action buttons - responsive */}
        <div className="flex items-center justify-between sm:justify-end mt-1 sm:mt-0">
          {/* Mobile date */}
          <span className="text-[10px] text-muted-foreground sm:hidden">{formatDate(question.createdAt)}</span>

          {/* Action icons */}
          <div className="flex items-center space-x-0.5 sm:space-x-1 flex-shrink-0">
            <button
              onClick={(e) => { e.stopPropagation(); handleToggle('favorite'); }}
              className={`p-1 sm:p-1.5 rounded-md transition-all hover:scale-110 ${question.favorite
                ? 'text-yellow-600 bg-yellow-50 dark:bg-yellow-900/20'
                : 'text-gray-400 hover:text-yellow-600 hover:bg-yellow-50 dark:hover:bg-yellow-900/20'
                }`}
            >
              <Star className={`h-3 w-3 sm:h-3.5 sm:w-3.5 ${question.favorite ? 'fill-current' : ''}`} />
            </button>

            <button
              onClick={(e) => { e.stopPropagation(); handleToggle('review'); }}
              className={`p-1 sm:p-1.5 rounded-md transition-all hover:scale-110 ${question.review
                ? 'text-green-600 bg-green-50 dark:bg-green-900/20'
                : 'text-gray-400 hover:text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20'
                }`}
            >
              <Bookmark className={`h-3 w-3 sm:h-3.5 sm:w-3.5 ${question.review ? 'fill-current' : ''}`} />
            </button>

            <button
              onClick={(e) => { e.stopPropagation(); handleToggle('hot'); }}
              className={`p-1 sm:p-1.5 rounded-md transition-all hover:scale-110 ${question.hot
                ? 'text-red-600 bg-red-50 dark:bg-red-900/20'
                : 'text-gray-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20'
                }`}
            >
              <Flame className={`h-3 w-3 sm:h-3.5 sm:w-3.5 ${question.hot ? 'fill-current' : ''}`} />
            </button>

            <button
              onClick={(e) => { e.stopPropagation(); handleEdit(); }}
              className="p-1 sm:p-1.5 rounded-md text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all hover:scale-110"
              title="Edit question"
            >
              <Edit className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
            </button>

            <button
              onClick={(e) => { e.stopPropagation(); handleDelete(); }}
              className="p-1 sm:p-1.5 rounded-md text-gray-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all hover:scale-110"
              title="Delete question"
            >
              <Trash2 className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Expanded Content */}
      {expanded && (
        <div className="px-3 py-2 space-y-2 bg-muted/50 animate-accordion-down">
          <div>
            <h4 className="font-medium text-card-foreground mb-1 text-xs sm:text-sm">Answer</h4>
            <div className="text-card-foreground/80 text-xs sm:text-sm leading-relaxed break-words font-sans max-h-60 sm:max-h-96 overflow-y-auto border border-gray-100 dark:border-gray-800 rounded-md p-2 sm:p-3 prose prose-sm dark:prose-invert max-w-none prose-headings:text-card-foreground prose-p:text-card-foreground/80 prose-strong:text-card-foreground prose-ul:text-card-foreground/80 prose-ol:text-card-foreground/80 prose-li:text-card-foreground/80">
              <ReactMarkdown>
                {question.answer}
              </ReactMarkdown>
            </div>
          </div>

          {question.code && (
            <div>
              <h4 className="font-medium text-card-foreground mb-1 text-xs sm:text-sm">Code</h4>
              <div className="overflow-x-auto">
                <CodeBlock
                  code={question.code}
                  language={question.codeLanguage || 'javascript'}
                  isMatch={lowerSearch && (searchScope === 'all' || searchScope === 'code') && question.code.toLowerCase().includes(lowerSearch)}
                />
              </div>
            </div>
          )}


          {question.images && question.images.length > 0 && (
            <div>
              <h4 className="font-medium text-card-foreground mb-1 text-xs sm:text-sm">Images</h4>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                {question.images.map((image, index) => (
                  <div
                    key={index}
                    className="relative group cursor-pointer"
                    onClick={(e) => { e.stopPropagation(); handleImageClick(image.data); }}
                  >
                    <div className="aspect-video rounded-md overflow-hidden border border-border shadow-sm hover:shadow-md transition-all bg-muted">
                      <img
                        src={image.data}
                        alt={image.name}
                        loading="lazy"
                        decoding="async"
                        className="w-full h-full object-contain group-hover:scale-105 transition-transform"
                      />
                    </div>
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors rounded-md flex items-center justify-center">
                      <div className="text-white opacity-0 group-hover:opacity-100 transition-opacity text-xs bg-black/50 px-2 py-1 rounded">
                        Click to enlarge
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {question.tags && question.tags.length > 0 && (
            <div>
              <h4 className="font-medium text-card-foreground mb-1 text-xs sm:text-sm">Tags</h4>
              <div className="flex flex-wrap gap-1">
                {question.tags.map((tag) => (
                  <span
                    key={tag._id || tag.name || tag}
                    className="px-1.5 sm:px-2 py-0.5 sm:py-1 bg-primary/10 text-primary text-[10px] sm:text-xs rounded border border-primary/20"
                    style={tag.color ? { backgroundColor: `${tag.color}20`, borderColor: `${tag.color}40`, color: tag.color } : {}}
                  >
                    {tag.name || tag}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default QuestionCard;
