import express from 'express';
import mongoose from 'mongoose';
import Question from '../models/Question.js';
import Tag from '../models/Tag.js';
import Round from '../models/Round.js';
import { validateQuestion, validateQuestionUpdate } from '../middleware/validation.js';

const router = express.Router();

// Helper function to ensure round exists
async function ensureRoundExists(roundName) {
  try {
    // Check if round already exists
    const existingRound = await Round.findOne({ name: roundName });
    if (existingRound) return;

    // Create label from round name
    const label = roundName
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');

    // Create new round
    await Round.create({ name: roundName, label });
    console.log(`✨ Auto-created round: "${roundName}" → "${label}"`);
  } catch (error) {
    console.error(`Failed to auto-create round "${roundName}":`, error.message);
    // Don't throw - question should still be created even if round creation fails
  }
}

// GET /api/questions - Get all questions with filtering, sorting, and pagination
router.get('/', async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      round = 'all',
      search = '',
      sortBy = 'newest',
      favorite,
      review,
      hot,
      tags,
      difficulty,
      company,
      position
    } = req.query;

    // Build filter object
    const filter = {};

    if (round !== 'all') {
      filter.round = round;
    }

    if (favorite === 'true') {
      filter.favorite = true;
    }

    if (review === 'true') {
      filter.review = true;
    }

    if (hot === 'true') {
      filter.hot = true;
    }

    if (difficulty) {
      filter.difficulty = difficulty;
    }

    if (company) {
      filter.company = { $regex: company, $options: 'i' };
    }

    if (position) {
      filter.position = { $regex: position, $options: 'i' };
    }

    if (tags) {
      const tagArray = Array.isArray(tags) ? tags : tags.split(',');
      const objectIdTags = tagArray.map(id => {
        try {
          return new mongoose.Types.ObjectId(id);
        } catch {
          return id;
        }
      });
      filter.tags = { $in: objectIdTags };
    }

    // Text search
    if (search) {
      filter.$text = { $search: search };
    }

    // Build sort object
    let sort = {};
    switch (sortBy) {
      case 'newest':
        sort = { createdAt: -1 };
        break;
      case 'oldest':
        sort = { createdAt: 1 };
        break;
      case 'alphabetical':
        sort = { question: 1 };
        break;
      case 'relevance':
        if (search) {
          sort = { score: { $meta: 'textScore' } };
        } else {
          sort = { createdAt: -1 };
        }
        break;
      default:
        sort = { createdAt: -1 };
    }

    // Calculate pagination
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    // Execute query
    const questions = await Question.find(filter)
      .populate('tags', 'name color')
      .sort(sort)
      .skip(skip)
      .limit(limitNum);

    // Get total count for pagination
    const total = await Question.countDocuments(filter);

    res.json({
      status: 'success',
      data: {
        questions,
        pagination: {
          currentPage: pageNum,
          totalPages: Math.ceil(total / limitNum),
          totalQuestions: total,
          hasNext: pageNum < Math.ceil(total / limitNum),
          hasPrev: pageNum > 1
        }
      }
    });

  } catch (error) {
    console.error('Error fetching questions:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to fetch questions',
      error: error.message
    });
  }
});

// GET /api/questions/:id - Get specific question
router.get('/:id', async (req, res) => {
  try {
    const question = await Question.findById(req.params.id).populate('tags', 'name color');

    if (!question) {
      return res.status(404).json({
        status: 'error',
        message: 'Question not found'
      });
    }

    res.json({
      status: 'success',
      data: { question }
    });

  } catch (error) {
    console.error('Error fetching question:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to fetch question',
      error: error.message
    });
  }
});

// POST /api/questions - Create new question
router.post('/', validateQuestion, async (req, res) => {
  try {
    // Auto-create round if it doesn't exist
    if (req.body.round) {
      await ensureRoundExists(req.body.round);
    }

    const question = new Question(req.body);
    await question.save();

    // Update tag counts
    if (question.tags && question.tags.length > 0) {
      await updateTagCounts(question.tags, 1);
    }

    res.status(201).json({
      status: 'success',
      data: { question },
      message: 'Question created successfully'
    });

  } catch (error) {
    console.error('Error creating question:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to create question',
      error: error.message
    });
  }
});

// PUT /api/questions/:id - Update question
router.put('/:id', validateQuestionUpdate, async (req, res) => {
  try {
    const oldQuestion = await Question.findById(req.params.id);

    if (!oldQuestion) {
      return res.status(404).json({
        status: 'error',
        message: 'Question not found'
      });
    }

    // Auto-create round if it doesn't exist
    if (req.body.round) {
      await ensureRoundExists(req.body.round);
    }

    const oldTags = oldQuestion.tags || [];
    const newTags = req.body.tags || [];

    // Normalize images to ensure mimeType present (findByIdAndUpdate skips pre-save middleware)
    if (Array.isArray(req.body.images)) {
      req.body.images = req.body.images.map(img => {
        if (!img) return img;
        if (!img.mimeType && typeof img.data === 'string') {
          const m = img.data.match(/^data:(image\/[^;]+);base64,/);
          return { ...img, mimeType: m?.[1] || 'image/png' };
        }
        return img;
      });
    }

    const question = await Question.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    // Update tag counts
    await updateTagCountsOnEdit(oldTags, newTags);

    res.json({
      status: 'success',
      data: { question },
      message: 'Question updated successfully'
    });

  } catch (error) {
    console.error('Error updating question:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to update question',
      error: error.message
    });
  }
});

// DELETE /api/questions/:id - Delete question
router.delete('/:id', async (req, res) => {
  try {
    const question = await Question.findById(req.params.id);

    if (!question) {
      return res.status(404).json({
        status: 'error',
        message: 'Question not found'
      });
    }

    const tags = question.tags || [];
    await Question.findByIdAndDelete(req.params.id);

    // Update tag counts
    if (tags.length > 0) {
      await updateTagCounts(tags, -1);
    }

    res.json({
      status: 'success',
      message: 'Question deleted successfully'
    });

  } catch (error) {
    console.error('Error deleting question:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to delete question',
      error: error.message
    });
  }
});

// PATCH /api/questions/:id/toggle/:field - Toggle favorite/review/hot status
router.patch('/:id/toggle/:field', async (req, res) => {
  try {
    const { id, field } = req.params;

    if (!['favorite', 'review', 'hot'].includes(field)) {
      return res.status(400).json({
        status: 'error',
        message: 'Invalid field. Must be favorite, review, or hot'
      });
    }

    const question = await Question.findById(id);

    if (!question) {
      return res.status(404).json({
        status: 'error',
        message: 'Question not found'
      });
    }

    question[field] = !question[field];
    await question.save();

    res.json({
      status: 'success',
      data: { question },
      message: `Question ${field} status toggled successfully`
    });

  } catch (error) {
    console.error('Error toggling field:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to toggle field',
      error: error.message
    });
  }
});

// Helper function to update tag counts
async function updateTagCounts(tags, increment) {
  for (const tagName of tags) {
    await Tag.findOneAndUpdate(
      { name: tagName },
      {
        $inc: { count: increment },
        $setOnInsert: { name: tagName }
      },
      { upsert: true }
    );
  }
}

// Helper function to update tag counts when editing
async function updateTagCountsOnEdit(oldTags, newTags) {
  const addedTags = newTags.filter(tag => !oldTags.includes(tag));
  const removedTags = oldTags.filter(tag => !newTags.includes(tag));

  if (addedTags.length > 0) {
    await updateTagCounts(addedTags, 1);
  }

  if (removedTags.length > 0) {
    await updateTagCounts(removedTags, -1);
  }
}

export default router;
