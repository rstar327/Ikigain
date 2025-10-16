import axios from 'axios';

async function testLoginFlow() {
  const baseURL = 'https://71c173e6-c8d5-4818-bcee-058a1a0095a5-00-1wzme5oy4vjex.riker.replit.dev';
  
  try {
    console.log('Testing /api/login flow...');
    
    const response = await axios({
      method: 'GET',
      url: `${baseURL}/api/login`,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
      },
      maxRedirects: 0,
      validateStatus: () => true
    });

    console.log('Login status:', response.status);
    console.log('Login redirect location:', response.headers.location);
    
    if (response.headers.location) {
      console.log('\nFollowing redirect to auth endpoint...');
      
      const authResponse = await axios({
        method: 'GET',
        url: response.headers.location,
        headers: {
          'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        },
        maxRedirects: 0,
        validateStatus: () => true
      });
      
      console.log('Auth status:', authResponse.status);
      console.log('Auth redirect location:', authResponse.headers.location);
      console.log('Auth cookies:', authResponse.headers['set-cookie']);
    }
    
  } catch (error) {
    console.error('Error:', error.message);
  }
}

testLoginFlow();