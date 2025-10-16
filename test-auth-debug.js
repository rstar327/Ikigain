// Quick test script to debug authentication
async function testAuth() {
  console.log('Testing production authentication...');
  
  try {
    const response = await fetch('https://ikigai-compass-karlisvilmanis.replit.app/api/login', {
      method: 'GET',
      redirect: 'manual'  // Don't follow redirects automatically
    });
    
    console.log('Response status:', response.status);
    console.log('Response headers:', Object.fromEntries(response.headers.entries()));
    
    if (response.status === 302) {
      const location = response.headers.get('location');
      console.log('Redirect location:', location);
    }
    
  } catch (error) {
    console.error('Auth test error:', error);
  }
}

testAuth();