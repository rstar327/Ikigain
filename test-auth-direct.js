// Test authentication endpoint directly with browser-like headers
import axios from 'axios';

async function testAuthFlow() {
  const baseURL = 'https://71c173e6-c8d5-4818-bcee-058a1a0095a5-00-1wzme5oy4vjex.riker.replit.dev';
  
  try {
    console.log('Testing /auth/replit endpoint with browser headers...');
    
    const response = await axios({
      method: 'GET',
      url: `${baseURL}/auth/replit`,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.5',
        'Accept-Encoding': 'gzip, deflate',
        'DNT': '1',
        'Connection': 'keep-alive',
        'Upgrade-Insecure-Requests': '1'
      },
      maxRedirects: 0, // Don't follow redirects
      validateStatus: () => true // Accept all status codes
    });

    console.log('Status:', response.status);
    console.log('Headers:', response.headers);
    console.log('Data length:', response.data.length);
    console.log('First 200 chars of response:', response.data.substring(0, 200));
    
    if (response.status === 302) {
      console.log('Redirect location:', response.headers.location);
    }
    
  } catch (error) {
    console.error('Error:', error.message);
  }
}

testAuthFlow();