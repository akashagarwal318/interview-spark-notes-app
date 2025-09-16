import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { authRequired } from '../middleware/auth.js';

const router = express.Router();

const signToken = (user) => {
  const payload = { sub: user._id.toString(), role: user.role };
  const secret = process.env.JWT_SECRET || 'dev-secret';
  const expiresIn = process.env.JWT_EXPIRES || '7d';
  return jwt.sign(payload, secret, { expiresIn });
};

// POST /api/auth/signup
router.post('/signup', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!email || !password) return res.status(400).json({ status: 'error', message: 'Email and password required' });
    const existing = await User.findOne({ email: email.toLowerCase() });
    if (existing) return res.status(409).json({ status: 'error', message: 'Email already registered' });
    const passwordHash = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email: email.toLowerCase(), passwordHash, role: 'user', status: 'pending' });
    return res.status(201).json({ status: 'success', data: { user: { id: user._id, email: user.email, status: user.status } }, message: 'Signup successful. Await admin approval.' });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
});

// POST /api/auth/login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email: (email||'').toLowerCase() });
    if (!user) return res.status(401).json({ status: 'error', message: 'Invalid credentials' });
    const ok = await bcrypt.compare(password || '', user.passwordHash);
    if (!ok) return res.status(401).json({ status: 'error', message: 'Invalid credentials' });
    if (user.status !== 'active') return res.status(403).json({ status: 'error', message: 'Account not active' });
    const token = signToken(user);
    res.json({ status: 'success', data: { token, user: { id: user._id, email: user.email, role: user.role, featureFlags: user.featureFlags } } });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
});

// GET /api/auth/me
router.get('/me', authRequired, async (req, res) => {
  const user = req.user;
  res.json({ status: 'success', data: { user: { id: user._id, email: user.email, role: user.role, featureFlags: user.featureFlags } } });
});

export default router;
