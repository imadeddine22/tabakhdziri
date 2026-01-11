// Test with CORRECT password
import mongoose from 'mongoose';

const MONGODB_URI = 'mongodb+srv://tabakh:tabakh0000@cluster0.n42xfsy.mongodb.net/food_delivery?retryWrites=true&w=majority';

console.log('🔍 Testing MongoDB with CORRECT password...\n');

async function testConnection() {
    try {
        console.log('⏳ Connecting to MongoDB...');

        const conn = await mongoose.connect(MONGODB_URI, {
            serverSelectionTimeoutMS: 10000,
        });

        console.log('\n✅✅✅ SUCCESS! MongoDB Connected! ✅✅✅');
        console.log('   Host:', conn.connection.host);
        console.log('   Database:', conn.connection.name);
        console.log('   Ready State:', conn.connection.readyState);

        const stats = await mongoose.connection.db.stats();
        console.log('\n📊 Database Stats:');
        console.log('   Collections:', stats.collections);
        console.log('   Objects:', stats.objects);

        await mongoose.connection.close();
        console.log('\n✅ Connection test completed successfully!');
        console.log('🎉 Your backend will work now!\n');
        process.exit(0);
    } catch (error) {
        console.error('\n❌ CONNECTION FAILED!');
        console.error('Error:', error.message);
        console.error('Code:', error.code);
        process.exit(1);
    }
}

testConnection();
