import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Category from '../models/Category.js';
import Product from '../models/Product.js';
import connectDB from '../config/db.js';

dotenv.config();

const categories = [
    {
        name: 'Plats Traditionnels',
        description: 'Découvrez nos plats traditionnels algériens préparés avec amour',
        image: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=800',
        isActive: true
    },
    {
        name: 'Grillades',
        description: 'Viandes grillées à la perfection pour vos événements',
        image: 'https://images.unsplash.com/photo-1529692236671-f1f6cf9683ba?w=800',
        isActive: true
    },
    {
        name: 'Pâtisserie Orientale',
        description: 'Délicieuses pâtisseries orientales faites maison',
        image: 'https://images.unsplash.com/photo-1587241321921-91a834d82ffc?w=800',
        isActive: true
    },
    {
        name: 'Salades & Entrées',
        description: 'Entrées fraîches et salades variées',
        image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800',
        isActive: true
    }
];

const seedData = async () => {
    try {
        await connectDB();

        // Clear existing data
        await Category.deleteMany({});
        await Product.deleteMany({});

        console.log('🗑️  Données existantes supprimées');

        // Create categories
        const createdCategories = await Category.insertMany(categories);
        console.log('✅ Catégories créées:', createdCategories.length);

        // Create products for each category
        const products = [];

        // Plats Traditionnels
        const traditionalCategory = createdCategories.find(c => c.name === 'Plats Traditionnels');
        products.push(
            {
                name: 'Couscous Royal',
                description: 'Couscous traditionnel avec viande d\'agneau, poulet et merguez. Servi avec légumes et bouillon savoureux.',
                price: 1500,
                category: traditionalCategory._id,
                stock: 100,
                image: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=800',
                isAvailable: true
            },
            {
                name: 'Tajine Zitoune',
                description: 'Tajine d\'agneau aux olives et citron confit, un classique de la cuisine algérienne.',
                price: 1800,
                category: traditionalCategory._id,
                stock: 100,
                image: 'https://images.unsplash.com/photo-1547592166-23ac45744acd?w=800',
                isAvailable: true
            },
            {
                name: 'Rechta',
                description: 'Pâtes fraîches maison avec sauce blanche et poulet, spécialité algéroise.',
                price: 1200,
                category: traditionalCategory._id,
                stock: 100,
                image: 'https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?w=800',
                isAvailable: true
            }
        );

        // Grillades
        const grilladesCategory = createdCategories.find(c => c.name === 'Grillades');
        products.push(
            {
                name: 'Méchoui',
                description: 'Agneau entier rôti à la broche, tendre et savoureux. Parfait pour les grandes occasions.',
                price: 25000,
                category: grilladesCategory._id,
                stock: 50,
                image: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=800',
                isAvailable: true
            },
            {
                name: 'Brochettes Mixtes',
                description: 'Assortiment de brochettes d\'agneau, poulet et kefta marinées aux épices.',
                price: 800,
                category: grilladesCategory._id,
                stock: 200,
                image: 'https://images.unsplash.com/photo-1603360946369-dc9bb6258143?w=800',
                isAvailable: true
            },
            {
                name: 'Poulet Grillé',
                description: 'Poulet fermier mariné et grillé au feu de bois.',
                price: 1000,
                category: grilladesCategory._id,
                stock: 150,
                image: 'https://images.unsplash.com/photo-1598103442097-8b74394b95c6?w=800',
                isAvailable: true
            }
        );

        // Pâtisserie
        const patisserieCategory = createdCategories.find(c => c.name === 'Pâtisserie Orientale');
        products.push(
            {
                name: 'Assortiment Baklawa',
                description: 'Plateau de baklawa variés au miel et fruits secs (1kg).',
                price: 2500,
                category: patisserieCategory._id,
                stock: 100,
                image: 'https://images.unsplash.com/photo-1519676867240-f03562e64548?w=800',
                isAvailable: true
            },
            {
                name: 'Makrout',
                description: 'Gâteaux traditionnels aux dattes et miel (1kg).',
                price: 1800,
                category: patisserieCategory._id,
                stock: 100,
                image: 'https://images.unsplash.com/photo-1587241321921-91a834d82ffc?w=800',
                isAvailable: true
            },
            {
                name: 'Dziriettes',
                description: 'Petits fours algériens assortis (1kg).',
                price: 2000,
                category: patisserieCategory._id,
                stock: 100,
                image: 'https://images.unsplash.com/photo-1486427944299-d1955d23e34d?w=800',
                isAvailable: true
            }
        );

        // Salades & Entrées
        const saladesCategory = createdCategories.find(c => c.name === 'Salades & Entrées');
        products.push(
            {
                name: 'Salade Méchouia',
                description: 'Salade de poivrons et tomates grillés, assaisonnée à l\'huile d\'olive.',
                price: 500,
                category: saladesCategory._id,
                stock: 200,
                image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800',
                isAvailable: true
            },
            {
                name: 'Bourek',
                description: 'Feuilletés croustillants farcis à la viande hachée et fromage.',
                price: 600,
                category: saladesCategory._id,
                stock: 200,
                image: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=800',
                isAvailable: true
            },
            {
                name: 'Chorba',
                description: 'Soupe traditionnelle algérienne aux vermicelles et légumes.',
                price: 400,
                category: saladesCategory._id,
                stock: 200,
                image: 'https://images.unsplash.com/photo-1547592166-23ac45744acd?w=800',
                isAvailable: true
            }
        );

        const createdProducts = await Product.insertMany(products);
        console.log('✅ Produits créés:', createdProducts.length);

        console.log('\n🎉 Données de démonstration créées avec succès!');
        console.log(`📊 ${createdCategories.length} catégories`);
        console.log(`🍽️  ${createdProducts.length} produits`);

        process.exit(0);
    } catch (error) {
        console.error('❌ Erreur:', error);
        process.exit(1);
    }
};

seedData();
