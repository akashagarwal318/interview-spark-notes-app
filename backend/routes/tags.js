import express from 'express';
import Tag from '../models/Tag.js';
import Question from '../models/Question.js';

const router = express.Router();

// GET /api/tags - Get all tags with optional filtering
router.get('/', async (req, res) => {
  try {
    const {
      search = '',
      category = '',
      sortBy = 'count',
      limit = 100,
      active = 'true'
    } = req.query;

    // Build filter
    const filter = {};
    
    if (active === 'true') {
      filter.isActive = true;
    }
    
    if (category) {
      filter.category = category;
    }
    
    if (search) {
      filter.name = { $regex: search, $options: 'i' };
    }
    
    // Build sort
    let sort = {};
    switch (sortBy) {
      case 'count':
        sort = { count: -1 };
        break;
      case 'name':
        sort = { name: 1 };
        break;
      case 'recent':
        sort = { updatedAt: -1 };
        break;
      default:
        sort = { count: -1 };
    }
    
    const tags = await Tag.find(filter)
      .sort(sort)
      .limit(parseInt(limit));
    
    res.json({
      status: 'success',
      data: { tags }
    });
    
  } catch (error) {
    console.error('Error fetching tags:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to fetch tags',
      error: error.message
    });
  }
});

// GET /api/tags/popular - Get most popular tags
router.get('/popular', async (req, res) => {
  try {
    const { limit = 20 } = req.query;
    
    const tags = await Tag.find({ isActive: true, count: { $gt: 0 } })
      .sort({ count: -1 })
      .limit(parseInt(limit));
    
    res.json({
      status: 'success',
      data: { tags }
    });
    
  } catch (error) {
    console.error('Error fetching popular tags:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to fetch popular tags',
      error: error.message
    });
  }
});

// GET /api/tags/categories - Get tag categories with counts
router.get('/categories', async (req, res) => {
  try {
    const categories = await Tag.aggregate([
      { $match: { isActive: true } },
      {
        $group: {
          _id: '$category',
          count: { $sum: '$count' },
          tagCount: { $sum: 1 }
        }
      },
      { $sort: { count: -1 } }
    ]);
    
    res.json({
      status: 'success',
      data: { categories }
    });
    
  } catch (error) {
    console.error('Error fetching tag categories:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to fetch tag categories',
      error: error.message
    });
  }
});

// GET /api/tags/:name - Get specific tag
router.get('/:name', async (req, res) => {
  try {
    const tag = await Tag.findOne({ name: req.params.name.toLowerCase() });
    
    if (!tag) {
      return res.status(404).json({
        status: 'error',
        message: 'Tag not found'
      });
    }
    
    // Get questions with this tag
    const questions = await Question.find({ tags: tag.name })
      .sort({ createdAt: -1 })
      .limit(10);
    
    res.json({
      status: 'success',
      data: { tag, questions }
    });
    
  } catch (error) {
    console.error('Error fetching tag:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to fetch tag',
      error: error.message
    });
  }
});

// POST /api/tags - Create new tag
router.post('/', async (req, res) => {
  try {
    const { name, category, color, description } = req.body;
    
    if (!name) {
      return res.status(400).json({
        status: 'error',
        message: 'Tag name is required'
      });
    }
    
    const existingTag = await Tag.findOne({ name: name.toLowerCase() });
    
    if (existingTag) {
      return res.status(409).json({
        status: 'error',
        message: 'Tag already exists'
      });
    }
    
    const tag = new Tag({
      name: name.toLowerCase(),
      category,
      color,
      description
    });
    
    await tag.save();
    
    res.status(201).json({
      status: 'success',
      data: { tag },
      message: 'Tag created successfully'
    });
    
  } catch (error) {
    console.error('Error creating tag:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to create tag',
      error: error.message
    });
  }
});

// PUT /api/tags/:name - Update tag
router.put('/:name', async (req, res) => {
  try {
    const { category, color, description, isActive } = req.body;
    
    const tag = await Tag.findOneAndUpdate(
      { name: req.params.name.toLowerCase() },
      { category, color, description, isActive },
      { new: true, runValidators: true }
    );
    
    if (!tag) {
      return res.status(404).json({
        status: 'error',
        message: 'Tag not found'
      });
    }
    
    res.json({
      status: 'success',
      data: { tag },
      message: 'Tag updated successfully'
    });
    
  } catch (error) {
    console.error('Error updating tag:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to update tag',
      error: error.message
    });
  }
});

// DELETE /api/tags/:name - Delete tag
router.delete('/:name', async (req, res) => {
  try {
    const tagName = req.params.name.toLowerCase();
    
    // Check if tag is being used
    const questionsUsingTag = await Question.countDocuments({ tags: tagName });
    
    if (questionsUsingTag > 0) {
      return res.status(400).json({
        status: 'error',
        message: `Cannot delete tag. It is being used by ${questionsUsingTag} question(s)`
      });
    }
    
    const tag = await Tag.findOneAndDelete({ name: tagName });
    
    if (!tag) {
      return res.status(404).json({
        status: 'error',
        message: 'Tag not found'
      });
    }
    
    res.json({
      status: 'success',
      message: 'Tag deleted successfully'
    });
    
  } catch (error) {
    console.error('Error deleting tag:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to delete tag',
      error: error.message
    });
  }
});

// POST /api/tags/sync - Sync tags from questions
router.post('/sync', async (req, res) => {
  try {
    // Get all unique tags from questions
    const allTags = await Question.distinct('tags');
    
    let created = 0;
    let updated = 0;
    
    for (const tagName of allTags) {
      if (!tagName) continue;
      
      const count = await Question.countDocuments({ tags: tagName });
      
      const result = await Tag.findOneAndUpdate(
        { name: tagName },
        { 
          $set: { count },
          $setOnInsert: { name: tagName }
        },
        { upsert: true, new: true }
      );
      
      if (result.count === count && result.createdAt === result.updatedAt) {
        created++;
      } else {
        updated++;
      }
    }
    
    res.json({
      status: 'success',
      message: 'Tags synchronized successfully',
      data: {
        totalTags: allTags.length,
        created,
        updated
      }
    });
    
  } catch (error) {
    console.error('Error syncing tags:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to sync tags',
      error: error.message
    });
  }
});

export default router;
