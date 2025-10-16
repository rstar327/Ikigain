// Test the renamed admin routes
import https from 'https';

const baseUrl = 'https://ikigai-compass-karlisvilmanis.replit.app';

const testRoutes = [
  // Original problematic routes (should still fail)
  { url: '/api/admin/questions', expected: 'HTML_200' },
  { url: '/api/admin/sessions', expected: 'HTML_200' },
  
  // Renamed routes (should work)
  { url: '/api/admin/all-questions', expected: 'JSON_403' },
  { url: '/api/admin/all-sessions', expected: 'JSON_403' },
  
  // Working routes (control)
  { url: '/api/admin/collected-emails', expected: 'JSON_403' },
  { url: '/api/admin/blog/posts', expected: 'JSON_403' },
];

console.log('Testing renamed admin routes...\n');

testRoutes.forEach((test, index) => {
  const fullUrl = baseUrl + test.url;
  
  const request = https.get(fullUrl, (response) => {
    let data = '';
    response.on('data', (chunk) => data += chunk);
    
    response.on('end', () => {
      const contentType = response.headers['content-type'] || '';
      const isJSON = contentType.includes('application/json');
      const isHTML = contentType.includes('text/html');
      
      let actualResult = '';
      if (isJSON && response.statusCode === 200) actualResult = 'JSON_200';
      else if (isJSON && response.statusCode === 403) actualResult = 'JSON_403';
      else if (isHTML && response.statusCode === 200) actualResult = 'HTML_200';
      else actualResult = `${isJSON ? 'JSON' : 'HTML'}_${response.statusCode}`;
      
      const status = actualResult === test.expected ? '✅ PASS' : '❌ FAIL';
      
      console.log(`${index + 1}. ${test.url}`);
      console.log(`   Expected: ${test.expected}, Got: ${actualResult} ${status}`);
      console.log('');
    });
  });
  
  request.on('error', (error) => {
    console.log(`Error testing ${test.url}:`, error.message);
  });
});