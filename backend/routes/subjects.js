import express from 'express';
import Subject from '../models/Subject.js';
import Question from '../models/Question.js';

const router = express.Router();

// Get all subjects
router.get('/', async (req, res) => {
    try {
        const subjects = await Subject.find().sort({ label: 1 });
        res.json({ status: 'success', data: { subjects } });
    } catch (err) {
        res.status(500).json({ status: 'error', message: err.message });
    }
});

// Create subject
router.post('/', async (req, res) => {
    try {
        const { name, label } = req.body;
        if (!name) return res.status(400).json({ status: 'error', message: 'Name is required' });

        // Check if subject already exists
        const existing = await Subject.findOne({ name: name.toLowerCase() });
        if (existing) {
            return res.json({ status: 'success', data: { subject: existing } });
        }

        const subject = await Subject.create({
            name: name.toLowerCase(),
            label: label || name
        });
        res.status(201).json({ status: 'success', data: { subject } });
    } catch (err) {
        res.status(400).json({ status: 'error', message: err.message });
    }
});

// Delete subject - ALSO updates all questions to 'unnamed'
router.delete('/:name', async (req, res) => {
    try {
        const subjectName = req.params.name;

        // Update ALL questions with this subject to 'unnamed'
        const updateResult = await Question.updateMany(
            { subject: subjectName },
            { $set: { subject: 'unnamed' } }
        );
        console.log(`🔄 Moved ${updateResult.modifiedCount} questions from subject "${subjectName}" to "unnamed"`);

        // Delete the subject document
        await Subject.deleteOne({ name: subjectName });

        res.json({ status: 'success', message: 'Subject deleted', questionsUpdated: updateResult.modifiedCount });
    } catch (err) {
        res.status(500).json({ status: 'error', message: err.message });
    }
});

// Sync subjects from questions (compute from existing data)
router.post('/sync', async (req, res) => {
    try {
        const Question = (await import('../models/Question.js')).default;
        const questions = await Question.find({ subject: { $exists: true, $ne: null, $ne: '' } });

        const subjectCounts = {};
        questions.forEach(q => {
            const subj = q.subject?.toLowerCase();
            if (subj) {
                subjectCounts[subj] = (subjectCounts[subj] || 0) + 1;
            }
        });

        // Upsert subjects
        for (const [name, count] of Object.entries(subjectCounts)) {
            await Subject.findOneAndUpdate(
                { name },
                { name, label: name.toUpperCase(), count },
                { upsert: true }
            );
        }

        const subjects = await Subject.find().sort({ label: 1 });
        res.json({ status: 'success', data: { subjects, synced: Object.keys(subjectCounts).length } });
    } catch (err) {
        res.status(500).json({ status: 'error', message: err.message });
    }
});

export default router;
