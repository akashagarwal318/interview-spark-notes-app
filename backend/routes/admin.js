import express from 'express';
import User from '../models/User.js';
import { authRequired, adminOnly } from '../middleware/auth.js';

const router = express.Router();

router.use(authRequired, adminOnly);

// GET /api/admin/users
router.get('/users', async (req, res) => {
  const users = await User.find().select('-passwordHash').sort({ createdAt: -1 });
  res.json({ status: 'success', data: { users } });
});

// PATCH /api/admin/users/:id/approve
router.patch('/users/:id/approve', async (req, res) => {
  const user = await User.findByIdAndUpdate(req.params.id, { status: 'active' }, { new: true }).select('-passwordHash');
  if (!user) return res.status(404).json({ status: 'error', message: 'User not found' });
  res.json({ status: 'success', data: { user } });
});

// PATCH /api/admin/users/:id/status
router.patch('/users/:id/status', async (req, res) => {
  const { status } = req.body; // pending|active|disabled
  const user = await User.findByIdAndUpdate(req.params.id, { status }, { new: true }).select('-passwordHash');
  if (!user) return res.status(404).json({ status: 'error', message: 'User not found' });
  res.json({ status: 'success', data: { user } });
});

// PATCH /api/admin/users/:id/role
router.patch('/users/:id/role', async (req, res) => {
  const { role } = req.body; // admin|user
  const user = await User.findByIdAndUpdate(req.params.id, { role }, { new: true }).select('-passwordHash');
  if (!user) return res.status(404).json({ status: 'error', message: 'User not found' });
  res.json({ status: 'success', data: { user } });
});

// PATCH /api/admin/users/:id/features
router.patch('/users/:id/features', async (req, res) => {
  const { featureFlags = {} } = req.body;
  const user = await User.findByIdAndUpdate(
    req.params.id,
    { $set: Object.fromEntries(Object.entries(featureFlags).map(([k,v]) => [`featureFlags.${k}`, v])) },
    { new: true }
  ).select('-passwordHash');
  if (!user) return res.status(404).json({ status: 'error', message: 'User not found' });
  res.json({ status: 'success', data: { user } });
});

// DELETE /api/admin/users/:id
router.delete('/users/:id', async (req, res) => {
  const user = await User.findByIdAndDelete(req.params.id);
  if (!user) return res.status(404).json({ status: 'error', message: 'User not found' });
  res.json({ status: 'success', message: 'User deleted' });
});

export default router;
