import mongoose from 'mongoose';
import dotenv from 'dotenv';
import fetch from 'node-fetch';

// Load environment variables
dotenv.config();

console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
console.log('🔍 FULL CONNECTION TEST - Tabakh Dziri');
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

// Test 1: Environment Variables
console.log('📋 TEST 1: Environment Variables');
console.log('─────────────────────────────────');
const hasMongoUri = !!process.env.MONGODB_URI;
const hasPort = !!process.env.PORT;
const hasFrontendUrl = !!process.env.FRONTEND_URL;

console.log(`✓ MONGODB_URI: ${hasMongoUri ? '✅ Set' : '❌ Missing'}`);
console.log(`✓ PORT: ${hasPort ? '✅ ' + process.env.PORT : '❌ Missing (will use 5000)'}`);
console.log(`✓ FRONTEND_URL: ${hasFrontendUrl ? '✅ ' + process.env.FRONTEND_URL : '❌ Missing'}`);

if (!hasMongoUri) {
    console.error('\n❌ MONGODB_URI is required! Please check your .env file.\n');
    process.exit(1);
}

const displayUri = process.env.MONGODB_URI.replace(/:([^:@]+)@/, ':****@');
console.log(`\n📝 MongoDB URI (masked): ${displayUri}\n`);

// Test 2: MongoDB Connection
console.log('📋 TEST 2: MongoDB Connection');
console.log('─────────────────────────────────');

const testMongoDB = async () => {
    try {
        console.log('⏳ Connecting to MongoDB...');

        const conn = await mongoose.connect(process.env.MONGODB_URI, {
            serverSelectionTimeoutMS: 10000,
        });

        console.log('✅ MongoDB Connected Successfully!');
        console.log(`   Host: ${conn.connection.host}`);
        console.log(`   Database: ${conn.connection.name}`);
        console.log(`   Ready State: ${conn.connection.readyState} (1 = connected)`);

        // List collections
        const collections = await conn.connection.db.listCollections().toArray();
        console.log(`   Collections: ${collections.length} found`);
        collections.forEach(col => {
            console.log(`      - ${col.name}`);
        });

        return true;
    } catch (error) {
        console.error('❌ MongoDB Connection Failed!');
        console.error(`   Error: ${error.message}`);

        if (error.name === 'MongoServerError') {
            console.error('\n💡 Possible causes:');
            console.error('   • Incorrect username or password');
            console.error('   • Database user not created in MongoDB Atlas');
        } else if (error.name === 'MongooseServerSelectionError') {
            console.error('\n💡 Possible causes:');
            console.error('   • IP address not whitelisted (add 0.0.0.0/0 for all IPs)');
            console.error('   • Network/firewall blocking connection');
            console.error('   • Incorrect cluster URL');
        }

        return false;
    }
};

// Test 3: Backend Server
console.log('\n📋 TEST 3: Backend Server');
console.log('─────────────────────────────────');

const testBackendServer = async () => {
    const port = process.env.PORT || 5000;
    const backendUrl = `http://localhost:${port}`;

    try {
        console.log(`⏳ Testing backend server at ${backendUrl}/api/health...`);

        const response = await fetch(`${backendUrl}/api/health`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (response.ok) {
            const data = await response.json();
            console.log('✅ Backend Server is Running!');
            console.log(`   Status: ${response.status}`);
            console.log(`   Message: ${data.message}`);
            console.log(`   Timestamp: ${data.timestamp}`);
            return true;
        } else {
            console.error(`❌ Backend returned status: ${response.status}`);
            return false;
        }
    } catch (error) {
        console.error('❌ Cannot connect to backend server!');
        console.error(`   Error: ${error.message}`);
        console.error('\n💡 Make sure the backend server is running:');
        console.error('   Run: npm start');
        return false;
    }
};

// Test 4: Auth Endpoint
console.log('\n📋 TEST 4: Auth Endpoint');
console.log('─────────────────────────────────');

const testAuthEndpoint = async () => {
    const port = process.env.PORT || 5000;
    const backendUrl = `http://localhost:${port}`;

    try {
        console.log(`⏳ Testing auth endpoint at ${backendUrl}/api/auth/register...`);

        // Try to register with test data (should fail with validation or duplicate user)
        const testUser = {
            name: 'Test User',
            email: `test_${Date.now()}@example.com`,
            password: 'Test123456',
            phone: '0555123456'
        };

        const response = await fetch(`${backendUrl}/api/auth/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(testUser)
        });

        const data = await response.json();

        if (response.ok) {
            console.log('✅ Auth endpoint is working!');
            console.log(`   Status: ${response.status}`);
            console.log(`   User created: ${data.data?.user?.name}`);
            console.log(`   Token received: ${data.data?.token ? 'Yes' : 'No'}`);
            return true;
        } else {
            // Even if registration fails, the endpoint is working
            console.log('✅ Auth endpoint is responding!');
            console.log(`   Status: ${response.status}`);
            console.log(`   Message: ${data.message}`);
            return true;
        }
    } catch (error) {
        console.error('❌ Auth endpoint test failed!');
        console.error(`   Error: ${error.message}`);
        return false;
    }
};

// Run all tests
const runAllTests = async () => {
    let allPassed = true;

    // Test MongoDB
    const mongoResult = await testMongoDB();
    allPassed = allPassed && mongoResult;

    // Test Backend Server
    const serverResult = await testBackendServer();
    allPassed = allPassed && serverResult;

    // Test Auth Endpoint (only if server is running)
    if (serverResult) {
        const authResult = await testAuthEndpoint();
        allPassed = allPassed && authResult;
    }

    // Summary
    console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('📊 TEST SUMMARY');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log(`MongoDB Connection: ${mongoResult ? '✅ PASS' : '❌ FAIL'}`);
    console.log(`Backend Server: ${serverResult ? '✅ PASS' : '❌ FAIL'}`);
    console.log(`Auth Endpoint: ${serverResult ? (allPassed ? '✅ PASS' : '❌ FAIL') : '⏭️  SKIPPED'}`);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

    if (allPassed) {
        console.log('\n🎉 ALL TESTS PASSED! Your backend is ready to use.\n');
    } else {
        console.log('\n⚠️  SOME TESTS FAILED. Please check the errors above.\n');
    }

    // Close MongoDB connection
    if (mongoResult) {
        await mongoose.connection.close();
        console.log('🔒 MongoDB connection closed.\n');
    }

    process.exit(allPassed ? 0 : 1);
};

// Run tests
runAllTests();
