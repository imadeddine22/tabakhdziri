import mongoose from 'mongoose';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

console.log('🔍 Testing MongoDB Connection...\n');

// Check if MONGODB_URI exists
if (!process.env.MONGODB_URI) {
    console.error('❌ MONGODB_URI is not defined in .env file');
    process.exit(1);
}

// Mask the password in the URI for display
const displayUri = process.env.MONGODB_URI.replace(/:([^:@]+)@/, ':****@');
console.log('📝 Connection String (masked):', displayUri);
console.log('');

// Test connection
const testConnection = async () => {
    try {
        console.log('⏳ Attempting to connect to MongoDB...\n');

        const conn = await mongoose.connect(process.env.MONGODB_URI, {
            serverSelectionTimeoutMS: 10000, // 10 seconds timeout
        });

        console.log('✅ MongoDB Connected Successfully!');
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        console.log(`🌐 Host: ${conn.connection.host}`);
        console.log(`📊 Database: ${conn.connection.name}`);
        console.log(`🔌 Port: ${conn.connection.port}`);
        console.log(`📡 Ready State: ${conn.connection.readyState} (1 = connected)`);
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

        // Test a simple query
        console.log('🧪 Testing database query...');
        const collections = await conn.connection.db.listCollections().toArray();
        console.log(`✅ Found ${collections.length} collections:`);
        collections.forEach(col => {
            console.log(`   - ${col.name}`);
        });

        console.log('\n✅ All tests passed! MongoDB connection is working correctly.\n');

        // Close connection
        await mongoose.connection.close();
        console.log('🔒 Connection closed.');
        process.exit(0);

    } catch (error) {
        console.error('\n❌ MongoDB Connection Failed!');
        console.error('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        console.error('Error Type:', error.name);
        console.error('Error Message:', error.message);

        if (error.name === 'MongoServerError') {
            console.error('\n🔍 Common causes:');
            console.error('   1. Incorrect username or password');
            console.error('   2. Database user not created in MongoDB Atlas');
            console.error('   3. Authentication database mismatch');
        } else if (error.name === 'MongooseServerSelectionError') {
            console.error('\n🔍 Common causes:');
            console.error('   1. IP address not whitelisted in MongoDB Atlas');
            console.error('   2. Network/firewall blocking connection');
            console.error('   3. Incorrect cluster URL');
            console.error('   4. MongoDB Atlas cluster is paused');
        }

        console.error('\n📋 Full Error Details:');
        console.error(error);
        console.error('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

        process.exit(1);
    }
};

testConnection();
