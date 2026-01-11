import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Product from './models/Product.js';
import Category from './models/Category.js';

dotenv.config();

async function checkProducts() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('✅ Connected to MongoDB');

        const productCount = await Product.countDocuments();
        const categoryCount = await Category.countDocuments();

        console.log('\n📊 Database Status:');
        console.log('  Products:', productCount);
        console.log('  Categories:', categoryCount);

        if (productCount > 0) {
            console.log('\n📦 Sample Products:');
            const products = await Product.find().limit(3).populate('category');
            products.forEach(p => {
                console.log(`  - ${p.name} (${p.price} DZD) - Category: ${p.category?.name || 'N/A'}`);
            });
        } else {
            console.log('\n⚠️  No products found in database!');
            console.log('   Run the seed script to populate data.');
        }

        if (categoryCount > 0) {
            console.log('\n📂 Categories:');
            const categories = await Category.find();
            categories.forEach(c => {
                console.log(`  - ${c.name}`);
            });
        }

        process.exit(0);
    } catch (error) {
        console.error('❌ Error:', error.message);
        process.exit(1);
    }
}

checkProducts();
