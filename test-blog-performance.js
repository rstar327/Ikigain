// Test blog performance and functionality
const https = require('https');

const baseUrl = 'https://ikigai-compass-karlisvilmanis.replit.app';

console.log('Testing blog performance...\n');

const testEndpoints = [
  '/api/blog/posts',
  '/blog',
  '/api/blog/posts/finding-life-s-purpose-my-journey-with-ikigai'
];

async function testEndpoint(endpoint) {
  return new Promise((resolve) => {
    const startTime = Date.now();
    
    const request = https.get(baseUrl + endpoint, (response) => {
      let data = '';
      
      response.on('data', (chunk) => data += chunk);
      
      response.on('end', () => {
        const endTime = Date.now();
        const responseTime = endTime - startTime;
        const contentType = response.headers['content-type'] || '';
        
        console.log(`${endpoint}`);
        console.log(`  Status: ${response.statusCode}`);
        console.log(`  Response Time: ${responseTime}ms`);
        console.log(`  Content-Type: ${contentType}`);
        console.log(`  Size: ${data.length} bytes`);
        
        if (endpoint === '/api/blog/posts' && response.statusCode === 200) {
          try {
            const posts = JSON.parse(data);
            console.log(`  Blog Posts: ${posts.length} found`);
            console.log(`  First post: ${posts[0]?.title || 'None'}`);
            console.log(`  Content removed: ${posts[0]?.content === undefined ? 'Yes' : 'No'}`);
          } catch (err) {
            console.log(`  JSON Parse Error: ${err.message}`);
          }
        }
        
        if (responseTime > 3000) {
          console.log(`  ⚠️  SLOW: Response time over 3 seconds`);
        } else if (responseTime > 1000) {
          console.log(`  ⚠️  MODERATE: Response time over 1 second`);
        } else {
          console.log(`  ✅ FAST: Response time under 1 second`);
        }
        
        console.log('');
        resolve();
      });
    });
    
    request.on('error', (error) => {
      console.log(`Error testing ${endpoint}:`, error.message);
      resolve();
    });
    
    request.setTimeout(10000, () => {
      console.log(`Timeout testing ${endpoint}`);
      request.destroy();
      resolve();
    });
  });
}

async function runTests() {
  for (const endpoint of testEndpoints) {
    await testEndpoint(endpoint);
  }
}

runTests().then(() => {
  console.log('Blog performance test completed!');
}).catch(console.error);