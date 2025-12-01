import mongoose from 'mongoose';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: './backend/.env' });

// Connection URIs
const LOCAL_URI = 'mongodb://127.0.0.1:27017/interview-assistant';
const ATLAS_URI = process.env.MONGODB_URI;

console.log('🚀 Starting Data Migration: Local → Atlas\n');

async function migrate() {
  let localConn, atlasConn;

  try {
    // Step 1: Connect to LOCAL
    console.log('📍 Step 1: Connecting to LOCAL MongoDB...');
    console.log(`   URI: ${LOCAL_URI}`);
    localConn = mongoose.createConnection(LOCAL_URI);
    await localConn.asPromise();
    console.log('   ✅ Connected to local database\n');

    // Step 2: Connect to ATLAS
    console.log('📍 Step 2: Connecting to ATLAS MongoDB...');
    console.log(`   URI: ${ATLAS_URI.substring(0, 50)}...`);
    atlasConn = mongoose.createConnection(ATLAS_URI);
    await atlasConn.asPromise();
    console.log('   ✅ Connected to Atlas database\n');

    // Step 3: Migrate Questions
    console.log('📍 Step 3: Migrating QUESTIONS...');
    const localQuestions = await localConn.collection('questions').find().toArray();
    console.log(`   Found ${localQuestions.length} questions in local DB`);

    if (localQuestions.length > 0) {
      await atlasConn.collection('questions').deleteMany({});
      await atlasConn.collection('questions').insertMany(localQuestions);
      console.log(`   ✅ Migrated ${localQuestions.length} questions\n`);
    }

    // Step 4: Migrate Tags
    console.log('📍 Step 4: Migrating TAGS...');
    const localTags = await localConn.collection('tags').find().toArray();
    console.log(`   Found ${localTags.length} tags in local DB`);

    if (localTags.length > 0) {
      await atlasConn.collection('tags').deleteMany({});
      await atlasConn.collection('tags').insertMany(localTags);
      console.log(`   ✅ Migrated ${localTags.length} tags\n`);
    }

    // Step 5: Migrate Rounds
    console.log('📍 Step 5: Migrating ROUNDS...');
    const localRounds = await localConn.collection('rounds').find().toArray();
    console.log(`   Found ${localRounds.length} rounds in local DB`);

    if (localRounds.length > 0) {
      await atlasConn.collection('rounds').deleteMany({});
      await atlasConn.collection('rounds').insertMany(localRounds);
      console.log(`   ✅ Migrated ${localRounds.length} rounds\n`);
    }

    // Summary
    console.log('━'.repeat(60));
    console.log('✅ MIGRATION COMPLETE!');
    console.log('━'.repeat(60));
    console.log(`Questions: ${localQuestions.length}`);
    console.log(`Tags:      ${localTags.length}`);
    console.log(`Rounds:    ${localRounds.length}`);
    console.log('━'.repeat(60));
    console.log('\n🎉 All data successfully migrated to MongoDB Atlas!');
    console.log('   Check your Atlas dashboard to verify.\n');

    // Close connections
    await localConn.close();
    await atlasConn.close();
    process.exit(0);

  } catch (error) {
    console.error('\n❌ Migration FAILED!');
    console.error('━'.repeat(60));
    console.error(`Error: ${error.message}`);
    console.error('Stack:', error.stack);
    console.error('━'.repeat(60));

    if (localConn) await localConn.close();
    if (atlasConn) await atlasConn.close();

    process.exit(1);
  }
}

migrate();
