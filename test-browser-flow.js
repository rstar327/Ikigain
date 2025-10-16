// Test the authentication flow exactly like a browser would
async function testBrowserFlow() {
  console.log('Testing browser-like authentication flow...');
  
  try {
    // Step 1: Start login flow
    console.log('\n1. Starting login flow...');
    let response = await fetch('https://ikigai-compass-karlisvilmanis.replit.app/api/login', {
      method: 'GET',
      redirect: 'follow', // Follow redirects like a browser
      credentials: 'include'
    });
    
    console.log('Final login response:', response.status);
    console.log('Final URL:', response.url);
    
    // Check if we ended up on admin page
    if (response.url.includes('/admin')) {
      console.log('✅ Successfully redirected to admin page!');
      
      // Now test if we can access protected endpoints
      const adminResponse = await fetch('https://ikigai-compass-karlisvilmanis.replit.app/api/auth/user', {
        method: 'GET',
        credentials: 'include'
      });
      
      console.log('Admin API status:', adminResponse.status);
      const userData = await adminResponse.json();
      console.log('Admin user data:', userData);
      
    } else {
      console.log('❌ Did not reach admin page');
      console.log('Response text:', await response.text());
    }
    
  } catch (error) {
    console.error('Browser flow test error:', error);
  }
}

testBrowserFlow();