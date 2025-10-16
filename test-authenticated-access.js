import axios from 'axios';

async function testAuthenticatedAccess() {
  const baseURL = 'https://71c173e6-c8d5-4818-bcee-058a1a0095a5-00-1wzme5oy4vjex.riker.replit.dev';
  
  try {
    console.log('Step 1: Login and get session cookie...');
    
    // Step 1: Login
    const loginResponse = await axios({
      method: 'GET',
      url: `${baseURL}/api/login`,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
      },
      maxRedirects: 0,
      validateStatus: () => true
    });

    // Step 2: Follow redirect to auth endpoint
    console.log('Step 2: Authenticating...');
    const authResponse = await axios({
      method: 'GET',
      url: loginResponse.headers.location,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
      },
      maxRedirects: 0,
      validateStatus: () => true
    });
    
    const cookies = authResponse.headers['set-cookie'];
    console.log('Got auth cookies:', cookies ? 'YES' : 'NO');
    
    if (!cookies) {
      console.log('No cookies received, cannot test authenticated access');
      return;
    }
    
    // Step 3: Test protected endpoint with cookies
    console.log('Step 3: Testing protected endpoint access...');
    const protectedResponse = await axios({
      method: 'GET',
      url: `${baseURL}/api/auth/user`,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
        'Cookie': cookies[0] // Use the session cookie
      },
      validateStatus: () => true
    });
    
    console.log('Protected endpoint status:', protectedResponse.status);
    console.log('Protected endpoint response:', protectedResponse.data);
    
    // Step 4: Test admin endpoint
    console.log('Step 4: Testing admin endpoint access...');
    const adminResponse = await axios({
      method: 'GET',
      url: `${baseURL}/api/admin/users`,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
        'Cookie': cookies[0]
      },
      validateStatus: () => true
    });
    
    console.log('Admin endpoint status:', adminResponse.status);
    console.log('Admin endpoint response length:', adminResponse.data?.length || 'N/A');
    
  } catch (error) {
    console.error('Error:', error.message);
  }
}

testAuthenticatedAccess();