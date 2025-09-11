import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Question from '../models/Question.js';
import Tag from '../models/Tag.js';
import { sampleQuestions } from './seedData.data.js';

dotenv.config();

// Simple logger respecting --silent flag
const args = process.argv.slice(2);
const flags = Object.fromEntries(
  args.filter(a => a.startsWith('--')).map(a => {
    const [k, v] = a.replace(/^--/, '').split('=');
    return [k, v === undefined ? true : v];
  })
);
const silent = !!flags.silent;
const log = (...m) => !silent && console.log(...m);
const error = (...m) => console.error(...m);

function parseLimitFlag(value) {
  if (!value) return null;
  const n = Number(value);
  return Number.isFinite(n) && n > 0 ? n : null;
}

async function connectWithFallback() {
  const provided = process.env.MONGODB_URI;
  const fallbacks = [
    'mongodb://127.0.0.1:27017/interview-assistant',
    'mongodb://localhost:27017/interview-assistant'
  ];
  const tried = [];
  const uris = provided ? [provided, ...fallbacks.filter(f => f !== provided)] : fallbacks;
  for (const uri of uris) {
    try {
      log(`🛰️  Attempting connection: ${uri}`);
      await mongoose.connect(uri, { serverSelectionTimeoutMS: 4000 });
      log(`✅ Connected using: ${uri}`);
      return uri;
    } catch (err) {
      tried.push({ uri, message: err?.message });
      const transient = /ENOTFOUND|ECONNREFUSED|timed out|ServerSelection/gim.test(err?.message || '');
      log(`⚠️  Connection failed for ${uri}${transient ? ' (transient?)' : ''}: ${err.message.split('\n')[0]}`);
    }
  }
  throw new Error(`Unable to connect to any MongoDB URI. Tried: ${tried.map(t => t.uri).join(', ')}`);
}

function buildTagDocs(questions) {
  const tagCounts = {};
  for (const q of questions) {
    (q.tags || []).forEach(t => {
      const tag = (t || '').toLowerCase().trim();
      if (!tag) return;
      tagCounts[tag] = (tagCounts[tag] || 0) + 1;
    });
  }
  return Object.entries(tagCounts).map(([name, count]) => ({ name, count }));
}

async function runSeed() {
  const started = Date.now();
  const limit = parseLimitFlag(flags.limit);
  const skipTags = !!flags['skip-tags'];
  const preview = !!flags.preview;
  const drop = !!flags.drop || !!flags.reset;

  let questions = sampleQuestions;
  if (limit) {
    questions = questions.slice(0, limit);
  }

  log('🔍 Seed starting');
  log(`• Total questions available: ${sampleQuestions.length}`);
  if (limit) log(`• Limiting insert to first ${questions.length} questions (--limit=${limit})`);
  if (preview) log('• Preview mode: no database writes will occur');
  if (skipTags) log('• Tag generation disabled (--skip-tags)');
  if (drop) log('• Will clear collections before insert (--drop)');

  if (preview) {
    const tagDocs = skipTags ? [] : buildTagDocs(questions);
    log('👀 Preview Summary');
    log(`• Questions to insert: ${questions.length}`);
    log(`• Tags to insert: ${tagDocs.length}`);
    log('✅ Preview complete (no DB connection attempted)');
    return; // Do not exit process here; caller handles.
  }

  try {
    await connectWithFallback();

    if (drop) {
      await Question.deleteMany({});
      await Tag.deleteMany({});
      log('🗑️  Cleared collections');
    }

    if (questions.length) {
      await Question.insertMany(questions);
      log(`📝 Inserted ${questions.length} questions`);
    }

    if (!skipTags) {
      const tagDocs = buildTagDocs(questions);
      if (tagDocs.length) {
        // Ensure uniqueness by name (case-insensitive already enforced) – upsert style
        await Tag.deleteMany({}); // keep simple; avoids duplicates
        await Tag.insertMany(tagDocs);
        log(`🏷️  Inserted ${tagDocs.length} tags`);
      } else {
        log('🏷️  No tags generated');
      }
    }

    const ms = Date.now() - started;
    log(`🎉 Seeding complete in ${(ms / 1000).toFixed(2)}s`);
  } catch (err) {
    error('❌ Seeding error:', err.message);
    if (err?.stack && !silent) error(err.stack.split('\n').slice(0, 4).join('\n'));
    process.exitCode = 1;
  } finally {
    if (mongoose.connection.readyState === 1) {
      try {
        await mongoose.disconnect();
        log('🔌 Disconnected');
      } catch (e) {
        error('⚠️  Disconnect error:', e.message);
      }
    }
  // In ESM, detect direct execution via import.meta.url comparison
  const isDirect = process.argv[1] && new URL(import.meta.url).pathname.endsWith('seedData.js');
  if (isDirect) process.exit();
  }
}

// Run automatically if executed directly
if (process.argv[1] && process.argv[1].toLowerCase().endsWith('seeddata.js')) {
  runSeed();
}

export default runSeed;
