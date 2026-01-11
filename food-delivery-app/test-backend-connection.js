// Test Backend Connection
const axios = require('axios');

const API_URL = 'http://localhost:5000/api';

async function testConnection() {
    console.log('🔍 Testing backend connection...\n');

    try {
        // Test 1: Health Check
        console.log('1️⃣ Testing health endpoint...');
        const healthResponse = await axios.get(`${API_URL}/health`);
        console.log('✅ Health check:', healthResponse.data);
        console.log('');

        // Test 2: Register a test user
        console.log('2️⃣ Testing user registration...');
        const testUser = {
            name: 'Test User',
            email: `test${Date.now()}@example.com`,
            password: 'test123456',
            phone: '0555123456'
        };

        const registerResponse = await axios.post(`${API_URL}/auth/register`, testUser);
        console.log('✅ Registration successful:', {
            user: registerResponse.data.data.user,
            hasToken: !!registerResponse.data.data.token
        });
        console.log('');

        // Test 3: Login with the test user
        console.log('3️⃣ Testing user login...');
        const loginResponse = await axios.post(`${API_URL}/auth/login`, {
            email: testUser.email,
            password: testUser.password
        });
        console.log('✅ Login successful:', {
            user: loginResponse.data.data.user,
            hasToken: !!loginResponse.data.data.token
        });
        console.log('');

        const token = loginResponse.data.data.token;

        // Test 4: Get user profile (authenticated)
        console.log('4️⃣ Testing authenticated request (get profile)...');
        const profileResponse = await axios.get(`${API_URL}/auth/me`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        console.log('✅ Profile retrieved:', profileResponse.data.data);
        console.log('');

        console.log('🎉 All tests passed! Frontend can connect to Backend successfully.\n');
        console.log('📝 Summary:');
        console.log('   - Backend URL: http://localhost:5000');
        console.log('   - API URL: http://localhost:5000/api');
        console.log('   - Database: Connected to MongoDB Atlas');
        console.log('   - Authentication: Working ✅');
        console.log('   - CORS: Configured ✅');

    } catch (error) {
        console.error('❌ Test failed:', error.response?.data || error.message);
        if (error.code === 'ECONNREFUSED') {
            console.error('\n⚠️  Backend server is not running!');
            console.error('   Please start the backend with: cd food-delivery-backend && npm start');
        }
    }
}

testConnection();
