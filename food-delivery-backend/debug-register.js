import fetch from 'node-fetch';

async function testRegister() {
    console.log('Testing registration...');
    try {
        const response = await fetch('http://localhost:5000/api/auth/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                name: 'Test User',
                email: `test${Date.now()}@example.com`,
                password: 'password123',
                phone: '0555555555'
            })
        });

        const data = await response.json();
        console.log('Status:', response.status);
        console.log('Response Body:', JSON.stringify(data, null, 2));
    } catch (err) {
        console.error('Fetch error:', err);
    }
}

testRegister();
