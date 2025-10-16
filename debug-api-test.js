// Debug API test to understand the routing issue
import https from 'https';

const testUrls = [
  'https://ikigai-compass-karlisvilmanis.replit.app/api/admin/questions',
  'https://ikigai-compass-karlisvilmanis.replit.app/api/admin/collected-emails',
  'https://ikigai-compass-karlisvilmanis.replit.app/api/admin/blog/posts',
  'https://ikigai-compass-karlisvilmanis.replit.app/api/questions' // Non-admin route for comparison
];

console.log('Debug: Testing API routing...');

testUrls.forEach((url, index) => {
  const request = https.get(url, (response) => {
    console.log(`\n${index + 1}. ${url}`);
    console.log(`Status: ${response.statusCode}`);
    console.log(`Content-Type: ${response.headers['content-type']}`);
    
    let data = '';
    response.on('data', (chunk) => {
      data += chunk;
    });
    
    response.on('end', () => {
      if (response.headers['content-type']?.includes('application/json')) {
        console.log('✅ Backend API response (JSON)');
        console.log('Response:', data);
      } else if (response.headers['content-type']?.includes('text/html')) {
        console.log('❌ Frontend HTML response - API routing not working');
        console.log('Response preview:', data.substring(0, 100) + '...');
      } else {
        console.log('? Unknown response type');
        console.log('Response:', data.substring(0, 100) + '...');
      }
    });
  });
  
  request.on('error', (error) => {
    console.log(`Error testing ${url}:`, error.message);
  });
});