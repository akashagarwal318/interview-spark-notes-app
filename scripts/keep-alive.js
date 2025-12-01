/**
 * ⏰ CUSTOMIZABLE KEEP-ALIVE SCRIPT FOR RENDER BACKEND
 * 
 * WHY THIS IS NEEDED:
 * - Render free tier puts your backend to sleep after 15 minutes of inactivity
 * - First request after sleep takes 30-50 seconds to wake up
 * - This script keeps your backend awake during your study/peak hours
 * 
 * HOW IT WORKS:
 * - Pings your backend API every X minutes (you choose the interval)
 * - Only runs during your specified active hours
 * - Prevents sleep = zero downtime during your study sessions!
 * 
 * WHERE TO RUN THIS:
 * - On your computer during study hours
 * - OR use a free service like cron-job.org to run it automatically
 */

// ========================================
// 🎛️ CUSTOMIZE YOUR SETTINGS HERE
// ========================================

const CONFIG = {
    // Your deployed backend URL (we'll update this after Render deployment)
    BACKEND_URL: 'http://localhost:5000',  // CHANGE THIS to your Render URL later

    // How often to ping (in minutes)
    // 13 minutes is optimal - Render sleeps after 15 min, so this keeps it awake
    PING_INTERVAL_MINUTES: 10,

    // Active hours when you want ZERO downtime (24-hour format)
    // ✅ Set to 24/7 since your app uses < 750 hours/month (fits free tier!)
    ACTIVE_HOURS: {
        START: 0,   // Midnight (00:00)
        END: 24     // Midnight next day (24:00) = Always active!
    },

    // Days when you want keep-alive active (0 = Sunday, 6 = Saturday)
    // ✅ All days - 24/7 availability for your interview app!
    ACTIVE_DAYS: [0, 1, 2, 3, 4, 5, 6],  // All days

    // Timezone offset (India = +5.5 hours = 330 minutes)
    TIMEZONE_OFFSET_MINUTES: 330  // IST (change for your timezone)
};

// ========================================
// 📊 LOGGING & MONITORING
// ========================================

let pingCount = 0;
let successCount = 0;
let failCount = 0;

function getLocalTime() {
    const now = new Date();
    const utc = now.getTime() + (now.getTimezoneOffset() * 60000);
    const localTime = new Date(utc + (CONFIG.TIMEZONE_OFFSET_MINUTES * 60000));
    return localTime;
}

function isWithinActiveHours() {
    const now = getLocalTime();
    const currentHour = now.getHours();
    const currentDay = now.getDay();

    const isActiveDay = CONFIG.ACTIVE_DAYS.includes(currentDay);
    const isActiveHour = currentHour >= CONFIG.ACTIVE_HOURS.START &&
        currentHour < CONFIG.ACTIVE_HOURS.END;

    return isActiveDay && isActiveHour;
}

function formatTime(date) {
    return date.toLocaleString('en-IN', {
        timeZone: 'Asia/Kolkata',
        hour12: true,
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
    });
}

// ========================================
// 🏓 PING FUNCTION
// ========================================

async function pingBackend() {
    const now = getLocalTime();
    pingCount++;

    console.log(`\n${'='.repeat(60)}`);
    console.log(`🏓 Ping #${pingCount} | ${formatTime(now)}`);
    console.log(`${'='.repeat(60)}`);

    // Check if we should ping now
    if (!isWithinActiveHours()) {
        console.log('⏸️  Outside active hours - skipping ping');
        console.log(`📅 Active: ${CONFIG.ACTIVE_HOURS.START}:00 - ${CONFIG.ACTIVE_HOURS.END}:00`);
        console.log(`📊 Stats: ${successCount} success, ${failCount} failed, ${pingCount} total`);
        return;
    }

    console.log('✅ Within active hours - pinging backend...');

    try {
        const startTime = Date.now();
        const response = await fetch(`${CONFIG.BACKEND_URL}/api/health`, {
            method: 'GET',
            headers: { 'User-Agent': 'KeepAlive-Script' }
        });

        const endTime = Date.now();
        const responseTime = endTime - startTime;

        if (response.ok) {
            const data = await response.json();
            successCount++;

            console.log('✅ SUCCESS!');
            console.log(`⚡ Response time: ${responseTime}ms`);
            console.log(`📡 Status: ${data.status || 'OK'}`);
            console.log(`📊 Stats: ${successCount} success, ${failCount} failed, ${pingCount} total`);

            // Alert if response is slow (might indicate wake-up from sleep)
            if (responseTime > 5000) {
                console.log('⚠️  SLOW RESPONSE - Backend might have been sleeping!');
            }
        } else {
            failCount++;
            console.log(`❌ FAILED - HTTP ${response.status}`);
            console.log(`📊 Stats: ${successCount} success, ${failCount} failed, ${pingCount} total`);
        }
    } catch (error) {
        failCount++;
        console.log('❌ ERROR:', error.message);
        console.log(`📊 Stats: ${successCount} success, ${failCount} failed, ${pingCount} total`);

        if (error.message.includes('ECONNREFUSED')) {
            console.log('💡 TIP: Is your backend running?');
        } else if (error.message.includes('fetch is not defined')) {
            console.log('💡 TIP: Node.js version might be old. Use Node 18+ or install node-fetch');
        }
    }
}

// ========================================
// 🚀 START KEEP-ALIVE SERVICE
// ========================================

console.log('\n' + '🎯'.repeat(30));
console.log('⏰ BACKEND KEEP-ALIVE SERVICE STARTED');
console.log('🎯'.repeat(30) + '\n');

console.log('📋 CONFIGURATION:');
console.log(`   Backend URL: ${CONFIG.BACKEND_URL}`);
console.log(`   Ping Interval: Every ${CONFIG.PING_INTERVAL_MINUTES} minutes`);
console.log(`   Active Hours: ${CONFIG.ACTIVE_HOURS.START}:00 - ${CONFIG.ACTIVE_HOURS.END}:00`);
console.log(`   Active Days: ${CONFIG.ACTIVE_DAYS.join(', ')} (0=Sun, 6=Sat)`);
console.log(`   Timezone: UTC+${CONFIG.TIMEZONE_OFFSET_MINUTES / 60} hours\n`);

console.log('💡 TIP: Keep this terminal window open during your study hours');
console.log('🛑 To stop: Press Ctrl+C\n');

// Ping immediately on start
pingBackend();

// Then ping at regular intervals
const intervalMs = CONFIG.PING_INTERVAL_MINUTES * 60 * 1000;
setInterval(pingBackend, intervalMs);

// Graceful shutdown
process.on('SIGINT', () => {
    console.log('\n\n' + '🛑'.repeat(30));
    console.log('⏹️  KEEP-ALIVE SERVICE STOPPED');
    console.log('🛑'.repeat(30) + '\n');
    console.log(`📊 FINAL STATS:`);
    console.log(`   Total Pings: ${pingCount}`);
    console.log(`   Successful: ${successCount}`);
    console.log(`   Failed: ${failCount}`);
    console.log(`   Success Rate: ${pingCount > 0 ? ((successCount / pingCount) * 100).toFixed(1) : 0}%\n`);
    process.exit(0);
});
