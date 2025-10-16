// Test accessing the auth endpoint directly
async function testDirectEndpoint() {
  console.log('Testing direct auth endpoint...');
  
  try {
    // Direct call to auth endpoint without redirects
    const response = await fetch('https://ikigai-compass-karlisvilmanis.replit.app/auth/replit', {
      method: 'GET',
      redirect: 'manual', // Don't follow redirects
      headers: {
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36'
      }
    });
    
    console.log('Direct auth status:', response.status);
    console.log('Direct auth headers:', Object.fromEntries(response.headers.entries()));
    
    if (response.status === 302) {
      console.log('Redirect location:', response.headers.get('location'));
    } else {
      const text = await response.text();
      console.log('Response body preview:', text.substring(0, 500));
    }
    
  } catch (error) {
    console.error('Direct endpoint test error:', error);
  }
}

testDirectEndpoint();