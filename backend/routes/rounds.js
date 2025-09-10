import express from 'express';
import Round from '../models/Round.js';

const router = express.Router();

// Get all rounds
router.get('/', async (req, res) => {
  try {
    const rounds = await Round.find().sort({ label: 1 });
    res.json({ status: 'success', data: { rounds } });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
});

// Create round
router.post('/', async (req, res) => {
  try {
    const { name, label } = req.body;
    if (!name || !label) return res.status(400).json({ status: 'error', message: 'Name and label required' });
    const round = await Round.create({ name: name.toLowerCase(), label });
    res.status(201).json({ status: 'success', data: { round } });
  } catch (err) {
    res.status(400).json({ status: 'error', message: err.message });
  }
});

// Delete round
router.delete('/:name', async (req, res) => {
  try {
    const protectedRounds = ['technical','hr','telephonic','introduction','behavioral','system-design','coding'];
    if (protectedRounds.includes(req.params.name)) {
      return res.status(400).json({ status: 'error', message: 'Cannot delete default round' });
    }
    await Round.deleteOne({ name: req.params.name });
    res.json({ status: 'success', message: 'Round deleted' });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
});

export default router;