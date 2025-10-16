// Test the working alternative routes
import https from 'https';

const baseUrl = 'https://ikigai-compass-karlisvilmanis.replit.app';

console.log('Testing working alternative admin routes...\n');

// Test the new routes that should work
const testRoutes = [
  '/api/admin/all-questions',
  '/api/admin/all-sessions',
];

testRoutes.forEach((route, index) => {
  const fullUrl = baseUrl + route;
  
  const request = https.get(fullUrl, (response) => {
    let data = '';
    response.on('data', (chunk) => data += chunk);
    
    response.on('end', () => {
      const contentType = response.headers['content-type'] || '';
      const isJSON = contentType.includes('application/json');
      
      console.log(`${index + 1}. ${route}`);
      console.log(`   Status: ${response.statusCode}`);
      console.log(`   Content-Type: ${contentType}`);
      
      if (isJSON) {
        if (response.statusCode === 403) {
          console.log(`   ✅ WORKING: Returns 403 JSON (admin access restricted)`);
        } else {
          console.log(`   ⚠️ Unexpected JSON response: ${response.statusCode}`);
        }
      } else {
        console.log(`   ❌ BROKEN: Returns HTML instead of JSON`);
      }
      
      console.log(`   Response preview: ${data.substring(0, 100)}...`);
      console.log('');
    });
  });
  
  request.on('error', (error) => {
    console.log(`Error testing ${route}:`, error.message);
  });
});