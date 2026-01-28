#!/usr/bin/env node

/**
 * 🔔 Keep-Alive Script for Render Free Tier
 * 
 * This script pings your backend every 10 minutes to prevent it from sleeping.
 * Run this on your local machine or use a free cron service like cron-job.org
 * 
 * Usage:
 *   BACKEND_URL=https://api.tabakhedjazayri.com node keep-alive.js
 * 
 * Or add to package.json:
 *   "scripts": {
 *     "keep-alive": "BACKEND_URL=https://api.tabakhedjazayri.com node keep-alive.js"
 *   }
 */

// Note: This script runs in Node.js, not Next.js
// So we use BACKEND_URL (without NEXT_PUBLIC_ prefix)
const BACKEND_URL = process.env.BACKEND_URL;

// Validation
if (!BACKEND_URL) {
    console.error('❌ BACKEND_URL environment variable is not set');
    console.error('💡 Usage: BACKEND_URL=https://api.tabakhedjazayri.com node keep-alive.js');
    process.exit(1);
}

const PING_INTERVAL = 10 * 60 * 1000; // 10 minutes in milliseconds

console.log('🔔 Keep-Alive Script Started');
console.log(`📡 Backend URL: ${BACKEND_URL}`);
console.log(`⏰ Ping Interval: ${PING_INTERVAL / 1000 / 60} minutes`);
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

async function pingBackend() {
    const timestamp = new Date().toLocaleString('ar-DZ', {
        timeZone: 'Africa/Algiers',
        hour12: false
    });

    try {
        console.log(`[${timestamp}] 📤 Pinging backend...`);

        const startTime = Date.now();
        const response = await fetch(`${BACKEND_URL}/api/health`, {
            method: 'GET',
            headers: {
                'User-Agent': 'Tabakh-Dziri-KeepAlive/1.0'
            }
        });

        const duration = Date.now() - startTime;

        if (response.ok) {
            const data = await response.json();
            console.log(`[${timestamp}] ✅ Backend is alive! (${duration}ms)`);
            console.log(`[${timestamp}] 📊 Status: ${data.status || 'OK'}`);
        } else {
            console.log(`[${timestamp}] ⚠️  Backend responded with status: ${response.status}`);
        }
    } catch (error) {
        console.error(`[${timestamp}] ❌ Failed to ping backend:`, error.message);
    }

    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
}

// Ping immediately on start
pingBackend();

// Then ping every 10 minutes
setInterval(pingBackend, PING_INTERVAL);

// Handle graceful shutdown
process.on('SIGINT', () => {
    console.log('\n\n🛑 Keep-Alive Script Stopped');
    process.exit(0);
});

process.on('SIGTERM', () => {
    console.log('\n\n🛑 Keep-Alive Script Stopped');
    process.exit(0);
});
