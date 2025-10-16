// Debug the sign-in button by testing if it's responding to clicks
import axios from 'axios';

async function testSignInButton() {
  const baseURL = 'https://71c173e6-c8d5-4818-bcee-058a1a0095a5-00-1wzme5oy4vjex.riker.replit.dev';
  
  try {
    console.log('1. Testing direct window.location.href approach...');
    
    // Test if navigating directly to /api/login works
    const response = await axios({
      method: 'GET',
      url: `${baseURL}/api/login`,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.5',
        'Accept-Encoding': 'gzip, deflate',
        'Connection': 'keep-alive',
        'Upgrade-Insecure-Requests': '1',
      },
      maxRedirects: 0,
      validateStatus: () => true
    });
    
    console.log('Login endpoint status:', response.status);
    console.log('Login redirect location:', response.headers.location);
    
    if (response.status === 302 && response.headers.location) {
      console.log('✅ /api/login endpoint is working correctly');
      console.log('🔄 Redirects to:', response.headers.location);
      
      if (response.headers.location.includes('/auth/replit')) {
        console.log('✅ Authentication flow configured correctly');
      }
    } else {
      console.log('❌ /api/login endpoint issue');
      console.log('Response data:', response.data);
    }
    
  } catch (error) {
    console.error('❌ Error testing login endpoint:', error.message);
  }
  
  // Test if the user authentication endpoint is accessible
  try {
    console.log('\n2. Testing authentication check endpoint...');
    
    const authCheckResponse = await axios({
      method: 'GET',
      url: `${baseURL}/api/auth/user`,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      },
      validateStatus: () => true
    });
    
    console.log('Auth check status:', authCheckResponse.status);
    
    if (authCheckResponse.status === 401) {
      console.log('✅ Authentication check working - user not logged in');
    } else if (authCheckResponse.status === 200) {
      console.log('✅ User is already authenticated:', authCheckResponse.data);
    } else {
      console.log('❌ Unexpected auth check response:', authCheckResponse.status, authCheckResponse.data);
    }
    
  } catch (error) {
    console.error('❌ Error testing auth check:', error.message);
  }
}

testSignInButton();