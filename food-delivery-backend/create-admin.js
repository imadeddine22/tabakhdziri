import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// User Schema (simplified version)
const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    phone: { type: String },
    role: { type: String, enum: ['user', 'admin'], default: 'user' },
    isActive: { type: Boolean, default: true },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

const User = mongoose.model('User', userSchema);

async function createAdminUser() {
    try {
        // Connect to MongoDB
        console.log('Connecting to MongoDB...');
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('✓ Connected to MongoDB');

        // Check if admin already exists
        const existingAdmin = await User.findOne({ email: 'admin@tabakhdziri.com' });

        if (existingAdmin) {
            console.log('⚠ Admin user already exists!');
            console.log('Email:', existingAdmin.email);
            console.log('Name:', existingAdmin.name);

            const readline = await import('readline');
            const rl = readline.createInterface({
                input: process.stdin,
                output: process.stdout
            });

            rl.question('Do you want to reset the password? (yes/no): ', async (answer) => {
                if (answer.toLowerCase() === 'yes' || answer.toLowerCase() === 'y') {
                    const newPassword = 'admin123'; // Change this!
                    const hashedPassword = await bcrypt.hash(newPassword, 10);

                    existingAdmin.password = hashedPassword;
                    existingAdmin.updatedAt = new Date();
                    await existingAdmin.save();

                    console.log('\n✓ Admin password has been reset!');
                    console.log('Email: admin@tabakhdziri.com');
                    console.log('Password: admin123');
                    console.log('\n⚠ IMPORTANT: Change this password after first login!');
                }

                rl.close();
                await mongoose.connection.close();
                process.exit(0);
            });

            return;
        }

        // Create new admin user
        console.log('\nCreating admin user...');

        const adminPassword = 'admin123'; // Change this!
        const hashedPassword = await bcrypt.hash(adminPassword, 10);

        const adminUser = new User({
            name: 'Administrator',
            email: 'admin@tabakhdziri.com',
            password: hashedPassword,
            phone: '+213XXXXXXXXX',
            role: 'admin',
            isActive: true
        });

        await adminUser.save();

        console.log('\n✓ Admin user created successfully!');
        console.log('\n=================================');
        console.log('Admin Credentials:');
        console.log('=================================');
        console.log('Email: admin@tabakhdziri.com');
        console.log('Password: admin123');
        console.log('=================================');
        console.log('\n⚠ IMPORTANT: Change this password after first login!');
        console.log('\nYou can now login at: https://tabakhdziri.com/admin/login');

    } catch (error) {
        console.error('✗ Error creating admin user:', error.message);

        if (error.code === 11000) {
            console.log('\n⚠ An admin user with this email already exists.');
        }
    } finally {
        await mongoose.connection.close();
        console.log('\n✓ Database connection closed');
        process.exit(0);
    }
}

// Run the script
createAdminUser();
