import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../models/User.js';
import connectDB from '../config/db.js';

dotenv.config();

const promoteToAdmin = async (email) => {
    try {
        await connectDB();

        const user = await User.findOne({ email });

        if (!user) {
            console.error('User not found');
            process.exit(1);
        }

        user.role = 'admin';
        await user.save();

        console.log(`User ${email} promoted to admin successfully!`);
        process.exit(0);
    } catch (error) {
        console.error('Error promoting user:', error);
        process.exit(1);
    }
};

const email = process.argv[2];

if (!email) {
    console.error('Please provide an email: node scripts/promote-admin.js user@example.com');
    process.exit(1);
}

promoteToAdmin(email);
