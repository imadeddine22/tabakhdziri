import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const cleanupUsers = async () => {
    try {
        console.log('⏳ Connecting to MongoDB for cleanup...');
        await mongoose.connect(process.env.MONGODB_URI);

        console.log('🔍 Finding test users...');

        // Define users to remove
        const patterns = [
            /^test_.*@example\.com$/,
            /^frontend_test_.*@example\.com$/,
            /test@example\.com/
        ];

        const result = await mongoose.connection.collection('users').deleteMany({
            email: { $in: patterns.map(p => new RegExp(p)) }
        });

        console.log(`✅ Cleanup complete! Removed ${result.deletedCount} test users.`);
        process.exit(0);
    } catch (error) {
        console.error('❌ Cleanup failed:', error);
        process.exit(1);
    }
};

cleanupUsers();
