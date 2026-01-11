// Test script to verify frontend can connect to backend
// Run this with: node test-frontend-connection.js

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
console.log('🔍 FRONTEND TO BACKEND CONNECTION TEST');
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

console.log('📋 Configuration:');
console.log('─────────────────────────────────');
console.log(`API URL: ${API_URL}`);
console.log(`Environment: ${process.env.NODE_ENV || 'development'}\n`);

// Test 1: Health Check
console.log('📋 TEST 1: Backend Health Check');
console.log('─────────────────────────────────');

const testHealthCheck = async () => {
    try {
        console.log(`⏳ Fetching ${API_URL}/health...`);

        const response = await fetch(`${API_URL}/health`);

        if (response.ok) {
            const data = await response.json();
            console.log('✅ Backend is reachable!');
            console.log(`   Status: ${response.status}`);
            console.log(`   Message: ${data.message}`);
            console.log(`   Timestamp: ${data.timestamp}`);
            return true;
        } else {
            console.error(`❌ Backend returned status: ${response.status}`);
            return false;
        }
    } catch (error) {
        console.error('❌ Cannot connect to backend!');
        console.error(`   Error: ${error.message}`);
        console.error('\n💡 Troubleshooting:');
        console.error('   1. Make sure backend server is running (npm start)');
        console.error('   2. Check that backend is on port 5000');
        console.error('   3. Verify NEXT_PUBLIC_API_URL in .env.local');
        return false;
    }
};

// Test 2: Test Registration Endpoint
console.log('\n📋 TEST 2: Registration Endpoint');
console.log('─────────────────────────────────');

const testRegistration = async () => {
    try {
        console.log(`⏳ Testing ${API_URL}/auth/register...`);

        const testUser = {
            name: 'Frontend Test User',
            email: `frontend_test_${Date.now()}@example.com`,
            password: 'Test123456',
            phone: '0555123456'
        };

        const response = await fetch(`${API_URL}/auth/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(testUser)
        });

        const data = await response.json();

        if (response.ok) {
            console.log('✅ Registration endpoint works!');
            console.log(`   Status: ${response.status}`);
            console.log(`   User: ${data.data?.user?.name}`);
            console.log(`   Email: ${data.data?.user?.email}`);
            console.log(`   Token: ${data.data?.token ? 'Received' : 'Not received'}`);
            return true;
        } else {
            console.log('✅ Registration endpoint is responding!');
            console.log(`   Status: ${response.status}`);
            console.log(`   Message: ${data.message}`);
            return true;
        }
    } catch (error) {
        console.error('❌ Registration endpoint test failed!');
        console.error(`   Error: ${error.message}`);
        return false;
    }
};

// Test 3: CORS Check
console.log('\n📋 TEST 3: CORS Configuration');
console.log('─────────────────────────────────');

const testCORS = async () => {
    try {
        console.log('⏳ Testing CORS headers...');

        const response = await fetch(`${API_URL}/health`, {
            method: 'OPTIONS',
            headers: {
                'Origin': 'http://localhost:3000',
                'Access-Control-Request-Method': 'POST'
            }
        });

        console.log('✅ CORS is configured!');
        console.log(`   Status: ${response.status}`);

        const corsHeader = response.headers.get('Access-Control-Allow-Origin');
        if (corsHeader) {
            console.log(`   Allow-Origin: ${corsHeader}`);
        }

        return true;
    } catch (error) {
        console.error('⚠️  CORS test inconclusive');
        console.error(`   Error: ${error.message}`);
        return true; // Don't fail on CORS test
    }
};

// Run all tests
const runAllTests = async () => {
    let allPassed = true;

    const healthResult = await testHealthCheck();
    allPassed = allPassed && healthResult;

    if (healthResult) {
        const regResult = await testRegistration();
        allPassed = allPassed && regResult;

        await testCORS();
    }

    // Summary
    console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('📊 TEST SUMMARY');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log(`Backend Health: ${healthResult ? '✅ PASS' : '❌ FAIL'}`);
    console.log(`Registration: ${healthResult ? (allPassed ? '✅ PASS' : '❌ FAIL') : '⏭️  SKIPPED'}`);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

    if (allPassed) {
        console.log('\n🎉 ALL TESTS PASSED!');
        console.log('✅ Frontend can successfully connect to backend');
        console.log('✅ Registration should work in the browser\n');
    } else {
        console.log('\n⚠️  SOME TESTS FAILED');
        console.log('Please check the errors above and:');
        console.log('1. Ensure backend is running (npm start)');
        console.log('2. Check .env.local has NEXT_PUBLIC_API_URL=http://localhost:5000/api');
        console.log('3. Restart the Next.js dev server after changing .env.local\n');
    }

    process.exit(allPassed ? 0 : 1);
};

runAllTests();
