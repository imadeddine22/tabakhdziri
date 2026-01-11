// Script to create an admin user
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import User from './models/User.js';

dotenv.config();

const createAdminUser = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('✅ Connected to MongoDB');

        // Check if admin already exists
        const existingAdmin = await User.findOne({ email: 'admin@tabakhdziri.com' });

        if (existingAdmin) {
            console.log('⚠️  Admin user already exists');
            console.log('Email: admin@tabakhdziri.com');
            console.log('You can reset the password if needed');

            // Update to admin role if not already
            if (existingAdmin.role !== 'admin') {
                existingAdmin.role = 'admin';
                await existingAdmin.save();
                console.log('✅ User role updated to admin');
            }
        } else {
            // Create new admin user
            const hashedPassword = await bcrypt.hash('admin123', 10);

            const adminUser = new User({
                name: 'Admin',
                email: 'admin@tabakhdziri.com',
                password: hashedPassword,
                phone: '0555000000',
                role: 'admin'
            });

            await adminUser.save();
            console.log('✅ Admin user created successfully!');
            console.log('Email: admin@tabakhdziri.com');
            console.log('Password: admin123');
        }

        await mongoose.connection.close();
        console.log('✅ Database connection closed');
        process.exit(0);
    } catch (error) {
        console.error('❌ Error:', error);
        process.exit(1);
    }
};

createAdminUser();
