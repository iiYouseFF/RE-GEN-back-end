// This script uses Node's built-in global fetch (requires Node >= 18)
// Run this file with: node test_endpoints.js

const BASE_URL = `http://localhost:${process.env.PORT || 3000}/api`;

const testUser = {
    email: `test_user_${Date.now()}@example.com`,
    password: 'Password123!'
};

let authToken = '';

async function runTests() {
    console.log('--- Starting RE-GEN API Tests ---\n');

    try {
        // 1. Test Unprotected Route: Get Products
        console.log('[1] GET /api/products (Public)');
        const productsRes = await fetch(`${BASE_URL}/products`);
        logResponse(productsRes, await productsRes.json());

        // 2. Test Auth Registration
        console.log(`\n[2] POST /api/auth/register (Testing with ${testUser.email})`);
        const registerRes = await fetch(`${BASE_URL}/auth/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(testUser)
        });
        const registerData = await registerRes.json();
        logResponse(registerRes, registerData);

        // 3. Test Auth Login
        console.log('\n[3] POST /api/auth/login');
        const loginRes = await fetch(`${BASE_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(testUser)
        });
        const loginData = await loginRes.json();
        logResponse(loginRes, loginData);

        if (loginRes.ok && loginData.session) {
            authToken = loginData.session.access_token;
            console.log('   ✅ Successfully acquired Auth Token', authToken);
        } else if (loginData.user && !loginData.session) {
            // Note: Supabase sometimes requires email verification before issuing access tokens.
            console.log('   ⚠️ Registration successful, but email confirmation might be required to get an access token. Auth-dependent tests might fail.');
        }

        // 4. Test Protected Route: Get Profile
        console.log('\n[4] GET /api/users/profile (Protected)');
        const profileRes = await fetch(`${BASE_URL}/users/profile`, {
            headers: { 'Authorization': `Bearer ${authToken}` }
        });
        logResponse(profileRes, await profileRes.json());

        // 5. Test Protected Route: Get Eco-Stats
        console.log('\n[5] GET /api/users/eco-stats (Protected)');
        const ecoStatsRes = await fetch(`${BASE_URL}/users/eco-stats`, {
            headers: { 'Authorization': `Bearer ${authToken}` }
        });
        logResponse(ecoStatsRes, await ecoStatsRes.json());

        console.log('\n--- API Tests Completed ---');
    } catch (err) {
        console.error('\n❌ Unhandled Error during testing:', err.message);
        console.log('Is the backend server running? (npm run start / node server.js)');
    }
}

function logResponse(res, data) {
    if (res.ok) {
        console.log(`   ✅ Success (${res.status}):`, data ? '(Data Received)' : '(Empty)');
    } else {
        console.log(`   ❌ Failed (${res.status}):`, data);
    }
}

runTests();
