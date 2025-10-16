// Test the complete authentication flow
async function testAuthFlow() {
  console.log('Testing authentication flow...');
  
  try {
    // Test 1: Login endpoint
    console.log('\n1. Testing /api/login...');
    const loginResponse = await fetch('https://ikigai-compass-karlisvilmanis.replit.app/api/login', {
      method: 'GET',
      redirect: 'manual'
    });
    
    console.log('Login status:', loginResponse.status);
    console.log('Login location:', loginResponse.headers.get('location'));
    
    // Test 2: Auth endpoint
    console.log('\n2. Testing /auth/replit...');
    const authResponse = await fetch('https://ikigai-compass-karlisvilmanis.replit.app/auth/replit', {
      method: 'GET',
      redirect: 'manual'
    });
    
    console.log('Auth status:', authResponse.status);
    console.log('Auth location:', authResponse.headers.get('location'));
    
    // Test 3: User endpoint
    console.log('\n3. Testing /api/auth/user...');
    const userResponse = await fetch('https://ikigai-compass-karlisvilmanis.replit.app/api/auth/user', {
      method: 'GET'
    });
    
    console.log('User status:', userResponse.status);
    const userData = await userResponse.json();
    console.log('User data:', userData);
    
  } catch (error) {
    console.error('Test error:', error);
  }
}

testAuthFlow();