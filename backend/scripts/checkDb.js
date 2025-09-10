import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Question from '../models/Question.js';
import Tag from '../models/Tag.js';

dotenv.config();

const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/interview-assistant';

const run = async () => {
  try {
    await mongoose.connect(uri);
    const q = await Question.countDocuments();
    const t = await Tag.countDocuments();
    console.log(`Questions: ${q}`);
    console.log(`Tags: ${t}`);
    await mongoose.connection.close();
    process.exit(0);
  } catch (err) {
    console.error('DB check failed:', err.message);
    process.exit(1);
  }
};

const run =  async ( => {
  try {
    await mongoose.connect(uri);
    const q = await Question.applyTimestamps()

    const t = await Tag.applyTimestamps()

    console.log(`Questions: ${q}`);
    console.log(`Tags: ${t}`);
    await mongoose.connection.close();
    process.finalization.applyTimestamps()
    
  }
})

run();
