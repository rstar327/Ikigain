// Test session creation by accessing auth endpoint directly
async function testSessionCreation() {
  console.log('Testing session creation...');
  
  try {
    // Test with a proper cookie jar to maintain session
    const response = await fetch('https://ikigai-compass-karlisvilmanis.replit.app/auth/replit', {
      method: 'GET',
      credentials: 'include' // Include cookies
    });
    
    console.log('Auth response status:', response.status);
    console.log('Response headers:', Object.fromEntries(response.headers.entries()));
    
    // Check if we get a session cookie
    const cookies = response.headers.get('set-cookie');
    console.log('Cookies set:', cookies);
    
    // Test user endpoint after visiting auth
    const userResponse = await fetch('https://ikigai-compass-karlisvilmanis.replit.app/api/auth/user', {
      method: 'GET',
      credentials: 'include'
    });
    
    console.log('User endpoint status:', userResponse.status);
    const userData = await userResponse.json();
    console.log('User data:', userData);
    
  } catch (error) {
    console.error('Session test error:', error);
  }
}

testSessionCreation();