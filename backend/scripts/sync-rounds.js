import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables
dotenv.config({ path: path.join(__dirname, '../.env') });

const MONGODB_URI = process.env.MONGODB_URI;

console.log('🔄 Starting Round Synchronization Script\n');
console.log('This script will create Round documents for all unique round names found in questions.\n');

async function syncRounds() {
    try {
        // Connect to MongoDB
        console.log('📍 Connecting to MongoDB Atlas...');
        await mongoose.connect(MONGODB_URI);
        console.log('   ✅ Connected successfully\n');

        const db = mongoose.connection.db;

        // Get all unique round names from questions
        console.log('📍 Fetching unique round names from questions...');
        const uniqueRounds = await db.collection('questions').distinct('round');
        console.log(`   Found ${uniqueRounds.length} unique round names: ${uniqueRounds.join(', ')}\n`);

        // Get existing rounds
        console.log('📍 Fetching existing rounds...');
        const existingRounds = await db.collection('rounds').find().toArray();
        const existingRoundNames = new Set(existingRounds.map(r => r.name));
        console.log(`   Found ${existingRounds.length} existing rounds in collection\n`);

        // Identify missing rounds
        const missingRounds = uniqueRounds.filter(name => !existingRoundNames.has(name));

        if (missingRounds.length === 0) {
            console.log('✅ All rounds are already synced! No action needed.\n');
            await mongoose.disconnect();
            return;
        }

        console.log('📍 Creating missing rounds...');
        console.log(`   Missing rounds: ${missingRounds.join(', ')}\n`);

        let created = 0;
        let skipped = 0;

        for (const roundName of missingRounds) {
            // Validate round name (must match backend regex: lowercase letters, numbers, hyphens, 2-40 chars)
            const isValid = /^[a-z0-9-]{2,40}$/.test(roundName);

            if (!isValid) {
                console.log(`   ⚠️  SKIPPED: "${roundName}" - Invalid format (must be lowercase letters, numbers, hyphens only)`);
                skipped++;
                continue;
            }

            // Generate label from round name
            const label = roundName
                .split('-')
                .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                .join(' ');

            try {
                await db.collection('rounds').insertOne({
                    name: roundName,
                    label: label,
                    createdAt: new Date()
                });
                console.log(`   ✅ Created: "${roundName}" → "${label}"`);
                created++;
            } catch (err) {
                console.log(`   ❌ Failed to create "${roundName}": ${err.message}`);
                skipped++;
            }
        }

        // Summary
        console.log('\n' + '━'.repeat(60));
        console.log('✅ SYNC COMPLETE!');
        console.log('━'.repeat(60));
        console.log(`Total unique rounds in questions: ${uniqueRounds.length}`);
        console.log(`Already existed: ${existingRounds.length}`);
        console.log(`Created: ${created}`);
        console.log(`Skipped (invalid): ${skipped}`);
        console.log('━'.repeat(60));

        if (skipped > 0) {
            console.log('\n⚠️  WARNING: Some rounds were skipped due to invalid names.');
            console.log('   These questions need to be manually updated with valid round names.');
            console.log('   Valid format: lowercase letters, numbers, and hyphens (2-40 chars)\n');
        }

        await mongoose.disconnect();
        console.log('\n✅ Database connection closed.\n');

    } catch (error) {
        console.error('\n❌ Sync FAILED!');
        console.error('━'.repeat(60));
        console.error(`Error: ${error.message}`);
        console.error('Stack:', error.stack);
        console.error('━'.repeat(60));

        if (mongoose.connection.readyState === 1) {
            await mongoose.disconnect();
        }
        process.exit(1);
    }
}

syncRounds();
