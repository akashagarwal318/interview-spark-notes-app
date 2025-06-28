
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
import { Avatar } from '../ui/avatar';
import { Separator } from '../ui/separator';
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

  return (
    <Card className="mb-4 overflow-hidden hover:shadow-lg transition-all duration-200">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-2 flex-wrap">
            <Badge className={`${getRoundColor(question.round)} font-medium`}>
              {question.round.replace('-', ' ').toUpperCase()}
            </Badge>
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <Calendar className="h-3 w-3" />
              {new Date(question.createdAt).toLocaleDateString()}
            </div>
          </div>
          
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleEdit}
              className="h-8 w-8 p-0"
            >
              <Edit className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleDelete}
              className="h-8 w-8 p-0 text-destructive hover:text-destructive"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <h3 className="text-lg font-semibold leading-tight line-clamp-2">
          {question.question}
        </h3>

        {/* Action Buttons */}
        <div className="flex items-center justify-between pt-2">
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleToggle('favorite')}
              className={`h-8 w-8 p-0 ${question.favorite ? 'text-yellow-500 hover:text-yellow-600' : 'text-muted-foreground'}`}
            >
              <Star className={`h-4 w-4 ${question.favorite ? 'fill-current' : ''}`} />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleToggle('review')}
              className={`h-8 w-8 p-0 ${question.review ? 'text-green-500 hover:text-green-600' : 'text-muted-foreground'}`}
            >
              <Bookmark className={`h-4 w-4 ${question.review ? 'fill-current' : ''}`} />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleToggle('hot')}
              className={`h-8 w-8 p-0 ${question.hot ? 'text-red-500 hover:text-red-600' : 'text-muted-foreground'}`}
            >
              <Flame className={`h-4 w-4 ${question.hot ? 'fill-current' : ''}`} />
            </Button>
          </div>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => setExpanded(!expanded)}
            className="gap-2"
          >
            {expanded ? 'Show Less' : 'Show More'}
            <ChevronDown className={`h-4 w-4 transition-transform ${expanded ? 'rotate-180' : ''}`} />
          </Button>
        </div>
      </CardHeader>

      {expanded && (
        <CardContent className="pt-0">
          <Separator className="mb-4" />
          
          <div className="space-y-4">
            <div>
              <h4 className="font-medium mb-2">Answer</h4>
              <p className="text-muted-foreground leading-relaxed">
                {question.answer}
              </p>
            </div>

            {question.code && (
              <div>
                <h4 className="font-medium mb-2">Code</h4>
                <CodeBlock code={question.code} />
              </div>
            )}

            {question.images && question.images.length > 0 && (
              <div>
                <h4 className="font-medium mb-2">Images</h4>
                <div className="flex flex-wrap gap-2">
                  {question.images.map((image, index) => (
                    <div
                      key={index}
                      className="w-16 h-16 rounded-lg overflow-hidden cursor-pointer hover:opacity-80 transition-opacity"
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
                  <Tag className="h-4 w-4" />
                  <h4 className="font-medium">Tags</h4>
                </div>
                <div className="flex flex-wrap gap-2">
                  {question.tags.map((tag, index) => (
                    <Badge key={index} variant="outline" className="text-xs">
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
