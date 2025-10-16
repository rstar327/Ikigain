// Test API endpoint security
import https from 'https';

const testApiUrls = [
  'https://ikigai-compass-karlisvilmanis.replit.app/api/admin/collected-emails',
  'https://ikigai-compass-karlisvilmanis.replit.app/api/admin/blog/posts',
  'https://ikigai-compass-karlisvilmanis.replit.app/api/admin/questions',
  'https://ikigai-compass-karlisvilmanis.replit.app/api/admin/sessions'
];

console.log('Testing API endpoint security without authentication...');

testApiUrls.forEach((url, index) => {
  const request = https.get(url, (response) => {
    console.log(`\n${index + 1}. ${url}`);
    console.log(`Status: ${response.statusCode}`);
    
    let data = '';
    response.on('data', (chunk) => {
      data += chunk;
    });
    
    response.on('end', () => {
      if (response.statusCode === 401 || response.statusCode === 403) {
        console.log('✅ API Security working - access denied');
      } else if (response.statusCode === 200) {
        console.log('❌ SECURITY ISSUE - API endpoint accessible without auth');
        console.log('Response preview:', data.substring(0, 100) + '...');
      } else {
        console.log(`Response: ${data}`);
      }
    });
  });
  
  request.on('error', (error) => {
    console.log(`Error testing ${url}:`, error.message);
  });
});