import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '..', '.env') });

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/interview-assistant';
const ADMIN_EMAIL = (process.env.ADMIN_EMAIL || 'admin@example.com').toLowerCase();
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin123';

async function run() {
  const { default: User } = await import('../models/User.js');
  await mongoose.connect(MONGODB_URI);
  try {
    let user = await User.findOne({ email: ADMIN_EMAIL });
    const passwordHash = await bcrypt.hash(ADMIN_PASSWORD, 10);
    if (!user) {
      user = await User.create({
        name: 'Admin',
        email: ADMIN_EMAIL,
        passwordHash,
        role: 'admin',
        status: 'active',
      });
      console.log(`Created admin -> ${ADMIN_EMAIL}`);
    } else {
      user.passwordHash = passwordHash;
      user.role = 'admin';
      user.status = 'active';
      await user.save();
      console.log(`Updated admin password/status -> ${ADMIN_EMAIL}`);
    }
    console.log('Done.');
  } catch (e) {
    console.error('Reset admin failed:', e.message);
    process.exitCode = 1;
  } finally {
    await mongoose.disconnect();
  }
}

run();
