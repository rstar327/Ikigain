// Test script to verify admin security
import https from 'https';

const testUrls = [
  'https://ikigai-compass-karlisvilmanis.replit.app/admin',
  'https://ikigai-compass-karlisvilmanis.replit.app/admin/emails', 
  'https://ikigai-compass-karlisvilmanis.replit.app/admin/blog-enhanced',
  'https://ikigai-compass-karlisvilmanis.replit.app/admin/shop'
];

console.log('Testing admin security without authentication...');

testUrls.forEach((url, index) => {
  const request = https.get(url, (response) => {
    console.log(`\n${index + 1}. ${url}`);
    console.log(`Status: ${response.statusCode}`);
    console.log(`Headers: ${JSON.stringify(response.headers, null, 2)}`);
    
    let data = '';
    response.on('data', (chunk) => {
      data += chunk;
    });
    
    response.on('end', () => {
      if (data.includes('Access Denied') || data.includes('admin_access_denied')) {
        console.log('✅ Security working - access denied for non-admin user');
      } else if (data.includes('Collected Emails') || data.includes('Admin')) {
        console.log('❌ SECURITY ISSUE - Admin content accessible without proper auth');
      } else {
        console.log('Response preview:', data.substring(0, 200) + '...');
      }
    });
  });
  
  request.on('error', (error) => {
    console.log(`Error testing ${url}:`, error.message);
  });
});