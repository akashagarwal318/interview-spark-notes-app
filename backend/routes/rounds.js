import express from 'express';
import Round from '../models/Round.js';
import Question from '../models/Question.js';

const router = express.Router();

// Helper: Sync rounds from questions (auto-create missing Round documents)
async function syncRoundsFromQuestions() {
  const questions = await Question.find({ round: { $exists: true, $ne: null, $ne: '' } });
  const roundNames = [...new Set(questions.map(q => q.round?.toLowerCase()).filter(Boolean))];

  let created = 0;
  for (const name of roundNames) {
    const exists = await Round.findOne({ name });
    if (!exists) {
      const label = name.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
      await Round.create({ name, label });
      created++;
      console.log(`✨ Auto-created round: "${name}" → "${label}"`);
    }
  }

  // Ensure 'unnamed' always exists
  const unnamedExists = await Round.findOne({ name: 'unnamed' });
  if (!unnamedExists) {
    await Round.create({ name: 'unnamed', label: 'Unnamed' });
    created++;
    console.log('✨ Auto-created "unnamed" round');
  }

  return created;
}

// Get all rounds (auto-syncs from questions if empty)
router.get('/', async (req, res) => {
  try {
    let rounds = await Round.find().sort({ label: 1 });

    // If no rounds exist, sync from questions
    if (rounds.length === 0) {
      const created = await syncRoundsFromQuestions();
      if (created > 0) {
        rounds = await Round.find().sort({ label: 1 });
        console.log(`📦 Synced ${created} rounds from questions`);
      }
    }

    res.json({ status: 'success', data: { rounds } });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
});

// Sync rounds from questions (manual trigger)
router.post('/sync', async (req, res) => {
  try {
    const created = await syncRoundsFromQuestions();
    const rounds = await Round.find().sort({ label: 1 });
    res.json({ status: 'success', data: { rounds, created } });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
});

// Create round
router.post('/', async (req, res) => {
  try {
    const { name, label } = req.body;
    if (!name || !label) return res.status(400).json({ status: 'error', message: 'Name and label required' });

    // Check if already exists
    const existing = await Round.findOne({ name: name.toLowerCase() });
    if (existing) {
      return res.json({ status: 'success', data: { round: existing } });
    }

    const round = await Round.create({ name: name.toLowerCase(), label });
    res.status(201).json({ status: 'success', data: { round } });
  } catch (err) {
    res.status(400).json({ status: 'error', message: err.message });
  }
});

// Delete round - ALSO updates all questions to 'unnamed'
router.delete('/:name', async (req, res) => {
  try {
    const roundName = req.params.name;

    // Prevent deleting 'unnamed'
    if (roundName === 'unnamed') {
      return res.status(400).json({ status: 'error', message: 'Cannot delete the "unnamed" round' });
    }

    // Update ALL questions with this round to 'unnamed'
    const updateResult = await Question.updateMany(
      { round: roundName },
      { $set: { round: 'unnamed' } }
    );
    console.log(`🔄 Moved ${updateResult.modifiedCount} questions from "${roundName}" to "unnamed"`);

    // Delete the round document
    await Round.deleteOne({ name: roundName });

    // Ensure 'unnamed' round exists
    const unnamedExists = await Round.findOne({ name: 'unnamed' });
    if (!unnamedExists) {
      await Round.create({ name: 'unnamed', label: 'Unnamed' });
      console.log('✨ Auto-created "unnamed" round');
    }

    res.json({ status: 'success', message: 'Round deleted', questionsUpdated: updateResult.modifiedCount });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
});

export default router;