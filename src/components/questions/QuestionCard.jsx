
import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { 
  Star, 
  Bookmark, 
  Flame, 
  ChevronDown, 
  Edit, 
  Trash2, 
  Image as ImageIcon,
  Calendar,
  Tag
} from 'lucide-react';
import { Card, CardContent, CardHeader } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { updateQuestion, deleteQuestion } from '../../store/slices/questionsSlice';
import { setImageModal, setEditingQuestion } from '../../store/slices/uiSlice';
import CodeBlock from '../ui/CodeBlock';

const QuestionCard = ({ question }) => {
  const dispatch = useDispatch();
  const [expanded, setExpanded] = useState(false);

  const handleToggle = (field) => {
    dispatch(updateQuestion({
      id: question.id,
      [field]: !question[field]
    }));
  };

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this question?')) {
      dispatch(deleteQuestion(question.id));
    }
  };

  const handleEdit = () => {
    dispatch(setEditingQuestion(question));
  };

  const handleImageClick = (imageSrc) => {
    dispatch(setImageModal({ isOpen: true, imageSrc }));
  };

  const getRoundColor = (round) => {
    const colors = {
      'technical': 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
      'hr': 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300',
      'telephonic': 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
      'introduction': 'bg-cyan-100 text-cyan-800 dark:bg-cyan-900 dark:text-cyan-300',
      'behavioral': 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300',
      'system-design': 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
      'coding': 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300'
    };
    return colors[round] || 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
  };

  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) {
        return 'Recently added';
      }
      return date.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric' 
      });
    } catch (error) {
      return 'Recently added';
    }
  };

  return (
    <Card className="mb-3 overflow-hidden hover:shadow-md transition-all duration-200 border-l-4 border-l-blue-500">
      <CardHeader className="pb-3 px-4 pt-4">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-2 flex-wrap">
            <Badge variant="secondary" className={`${getRoundColor(question.round)} font-medium text-xs`}>
              {question.round?.replace('-', ' ').toUpperCase() || 'GENERAL'}
            </Badge>
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <Calendar className="h-3 w-3" />
              {formatDate(question.createdAt)}
            </div>
          </div>
          
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleEdit}
              className="h-7 w-7 p-0 hover:bg-blue-50"
            >
              <Edit className="h-3 w-3" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleDelete}
              className="h-7 w-7 p-0 text-destructive hover:text-destructive hover:bg-red-50"
            >
              <Trash2 className="h-3 w-3" />
            </Button>
          </div>
        </div>

        <h3 className="text-base font-semibold leading-tight line-clamp-2 mt-2">
          {question.question}
        </h3>

        {/* Action Buttons */}
        <div className="flex items-center justify-between pt-2">
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleToggle('favorite')}
              className={`h-7 w-7 p-0 ${question.favorite ? 'text-yellow-500 hover:text-yellow-600' : 'text-muted-foreground'}`}
            >
              <Star className={`h-4 w-4 ${question.favorite ? 'fill-current' : ''}`} />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleToggle('review')}
              className={`h-7 w-7 p-0 ${question.review ? 'text-green-500 hover:text-green-600' : 'text-muted-foreground'}`}
            >
              <Bookmark className={`h-4 w-4 ${question.review ? 'fill-current' : ''}`} />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleToggle('hot')}
              className={`h-7 w-7 p-0 ${question.hot ? 'text-red-500 hover:text-red-600' : 'text-muted-foreground'}`}
            >
              <Flame className={`h-4 w-4 ${question.hot ? 'fill-current' : ''}`} />
            </Button>
          </div>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => setExpanded(!expanded)}
            className="gap-2 text-xs"
          >
            {expanded ? 'Less' : 'More'}
            <ChevronDown className={`h-3 w-3 transition-transform ${expanded ? 'rotate-180' : ''}`} />
          </Button>
        </div>
      </CardHeader>

      {expanded && (
        <CardContent className="pt-0 px-4 pb-4">
          <div className="space-y-3">
            <div>
              <h4 className="font-medium mb-2 text-sm">Answer</h4>
              <p className="text-muted-foreground leading-relaxed text-sm">
                {question.answer}
              </p>
            </div>

            {question.code && (
              <div>
                <h4 className="font-medium mb-2 text-sm">Code</h4>
                <CodeBlock code={question.code} />
              </div>
            )}

            {question.images && question.images.length > 0 && (
              <div>
                <h4 className="font-medium mb-2 text-sm">Images</h4>
                <div className="flex flex-wrap gap-2">
                  {question.images.map((image, index) => (
                    <div
                      key={index}
                      className="w-14 h-14 rounded-lg overflow-hidden cursor-pointer hover:opacity-80 transition-opacity"
                      onClick={() => handleImageClick(image.data)}
                    >
                      <img
                        src={image.data}
                        alt={image.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {question.tags && question.tags.length > 0 && (
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Tag className="h-3 w-3" />
                  <h4 className="font-medium text-sm">Tags</h4>
                </div>
                <div className="flex flex-wrap gap-1">
                  {question.tags.map((tag, index) => (
                    <Badge key={index} variant="outline" className="text-xs px-2 py-1">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </div>
        </CardContent>
      )}
    </Card>
  );
};

export default QuestionCard;
