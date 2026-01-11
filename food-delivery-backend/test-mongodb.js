// Test MongoDB Connection
import 'dotenv/config';
import mongoose from 'mongoose';

console.log('🔍 Testing MongoDB Connection...\n');
console.log('📋 Configuration:');
console.log('   MONGODB_URI exists:', !!process.env.MONGODB_URI);
console.log('   URI starts with:', process.env.MONGODB_URI?.substring(0, 20) + '...');

async function testConnection() {
    try {
        console.log('\n⏳ Attempting to connect...');

        const conn = await mongoose.connect(process.env.MONGODB_URI, {
            serverSelectionTimeoutMS: 5000, // 5 seconds timeout
        });

        console.log('\n✅ SUCCESS! MongoDB Connected:');
        console.log('   Host:', conn.connection.host);
        console.log('   Database:', conn.connection.name);
        console.log('   Port:', conn.connection.port);
        console.log('   Ready State:', conn.connection.readyState); // 1 = connected

        // Get database stats
        const stats = await mongoose.connection.db.stats();
        console.log('\n📊 Database Stats:');
        console.log('   Collections:', stats.collections);
        console.log('   Objects:', stats.objects);
        console.log('   Data Size:', (stats.dataSize / 1024).toFixed(2), 'KB');

        // List collections
        const collections = await mongoose.connection.db.listCollections().toArray();
        console.log('\n📁 Collections Found:');
        collections.forEach(col => {
            console.log(`   - ${col.name}`);
        });

        console.log('\n✅ Connection test completed successfully!');
        console.log('\n💡 Your MongoDB connection is working fine!');
        console.log('   If Compass is not connecting, the issue is with Compass configuration, not your connection string.\n');

        process.exit(0);
    } catch (error) {
        console.error('\n❌ CONNECTION FAILED!');
        console.error('\n🔴 Error Details:');
        console.error('   Message:', error.message);
        console.error('   Code:', error.code);
        console.error('   Name:', error.name);

        console.log('\n🔧 Troubleshooting Tips:');

        if (error.message.includes('ENOTFOUND')) {
            console.log('   • DNS Error - Check your cluster hostname');
            console.log('   • Verify your internet connection');
        } else if (error.message.includes('authentication failed')) {
            console.log('   • Wrong username or password');
            console.log('   • Check your Database Access in MongoDB Atlas');
        } else if (error.message.includes('IP')) {
            console.log('   • Your IP is not whitelisted');
            console.log('   • Add your IP in Network Access (MongoDB Atlas)');
            console.log('   • Or allow all IPs: 0.0.0.0/0');
        } else if (error.message.includes('timeout')) {
            console.log('   • Connection timeout - possible firewall issue');
            console.log('   • Check your network/firewall settings');
        } else if (error.message.includes('SSL') || error.message.includes('TLS')) {
            console.log('   • SSL/TLS error');
            console.log('   • Update your MongoDB driver');
            console.log('   • Check your system certificates');
        }

        console.log('\n📖 Read MONGODB-COMPASS-DEBUG.md for detailed solutions\n');

        process.exit(1);
    }
}

testConnection();
