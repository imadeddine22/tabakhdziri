import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Category from '../models/Category.js';
import connectDB from '../config/db.js';

dotenv.config();

const getCategories = async () => {
    try {
        await connectDB();

        const categories = await Category.find();

        console.log('\n📋 الفئات الموجودة:\n');
        categories.forEach(cat => {
            console.log(`📌 ${cat.name}`);
            console.log(`   ID: ${cat._id}`);
            console.log(`   الوصف: ${cat.description || 'لا يوجد'}`);
            console.log('');
        });

        if (categories.length > 0) {
            console.log(`\n✅ استخدم هذا المعرف للاختبار: ${categories[0]._id}\n`);
        }

        process.exit(0);
    } catch (error) {
        console.error('❌ خطأ:', error);
        process.exit(1);
    }
};

getCategories();
