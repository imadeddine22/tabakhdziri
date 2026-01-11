// Quick test script to verify backend connectivity
const axios = require('axios');

const API_URL = 'http://localhost:5000/api';

async function testBackend() {
    console.log('🔍 Testing backend connection...\n');

    // Test 1: Health check
    try {
        console.log('1️⃣ Testing health endpoint...');
        const healthResponse = await axios.get('http://localhost:5000/api/health');
        console.log('✅ Health check passed:', healthResponse.data);
    } catch (error) {
        console.error('❌ Health check failed:', error.message);
        console.log('\n⚠️  Backend server is NOT running on port 5000!');
        console.log('📝 Please start the backend server first:\n');
        console.log('   cd food-delivery-backend');
        console.log('   npm start\n');
        return;
    }

    // Test 2: Register endpoint structure
    try {
        console.log('\n2️⃣ Testing register endpoint (should fail with validation error)...');
        const registerResponse = await axios.post(`${API_URL}/auth/register`, {});
        console.log('Response:', registerResponse.data);
    } catch (error) {
        if (error.response) {
            console.log('✅ Register endpoint exists (validation error expected):', error.response.data);
        } else {
            console.error('❌ Register endpoint error:', error.message);
        }
    }

    console.log('\n✨ Backend connectivity test complete!');
}

testBackend();
