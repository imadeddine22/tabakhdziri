#!/usr/bin/env node

/**
 * 🔍 Render Environment Variables Verification Script
 * 
 * This script helps verify that all required environment variables are set
 * Run this locally to ensure your .env file is complete before deploying
 */

import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

console.log('\n========================================');
console.log('🔍 Environment Variables Check');
console.log('========================================\n');

const requiredVars = [
    'NODE_ENV',
    'PORT',
    'MONGODB_URI',
    'JWT_SECRET',
    'FRONTEND_URL'
];

const optionalVars = [
    'EMAIL_USER',
    'EMAIL_PASSWORD',
    'INSTAGRAM_ACCESS_TOKEN'
];

let allRequired = true;

console.log('📋 Required Variables:\n');
requiredVars.forEach(varName => {
    const value = process.env[varName];
    const status = value ? '✅' : '❌';
    const display = value ? (varName === 'MONGODB_URI' || varName === 'JWT_SECRET' ? '***hidden***' : value) : 'NOT SET';

    console.log(`${status} ${varName}: ${display}`);

    if (!value) {
        allRequired = false;
    }
});

console.log('\n📋 Optional Variables:\n');
optionalVars.forEach(varName => {
    const value = process.env[varName];
    const status = value ? '✅' : '⚠️';
    const display = value ? '***hidden***' : 'NOT SET';

    console.log(`${status} ${varName}: ${display}`);
});

console.log('\n========================================');

if (allRequired) {
    console.log('✅ All required environment variables are set!');
    console.log('👍 You can proceed with deployment to Render');
} else {
    console.log('❌ Some required environment variables are missing!');
    console.log('⚠️ Please add them to your .env file before deploying');
    console.log('\nℹ️  Check .env.example for reference');
}

console.log('========================================\n');

// Additional checks
console.log('🔍 Additional Checks:\n');

// Check MongoDB URI format
if (process.env.MONGODB_URI) {
    const uri = process.env.MONGODB_URI;
    if (uri.includes('mongodb+srv://')) {
        console.log('✅ MongoDB URI uses SRV format (recommended)');
    } else if (uri.includes('mongodb://')) {
        console.log('⚠️  MongoDB URI uses standard format (consider using mongodb+srv://)');
    } else {
        console.log('❌ MongoDB URI format may be invalid');
    }

    if (uri.includes('retryWrites=true')) {
        console.log('✅ MongoDB URI includes retryWrites parameter');
    }
}

// Check JWT Secret length
if (process.env.JWT_SECRET) {
    const secretLength = process.env.JWT_SECRET.length;
    if (secretLength >= 32) {
        console.log(`✅ JWT_SECRET length is adequate (${secretLength} characters)`);
    } else {
        console.log(`⚠️  JWT_SECRET is too short (${secretLength} characters, recommended: 32+)`);
    }
}

// Check Frontend URL format
if (process.env.FRONTEND_URL) {
    const url = process.env.FRONTEND_URL;
    if (url.startsWith('https://')) {
        console.log('✅ FRONTEND_URL uses HTTPS (secure)');
    } else if (url.startsWith('http://localhost')) {
        console.log('⚠️  FRONTEND_URL is localhost (development mode)');
    } else {
        console.log('❌ FRONTEND_URL should use HTTPS in production');
    }
}

console.log('\n========================================\n');
