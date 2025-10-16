// Complete test to verify the full API security flow
import https from 'https';

const baseUrl = 'https://ikigai-compass-karlisvilmanis.replit.app';

const testRoutes = [
  // Working routes (should return 403 JSON)
  { url: '/api/admin/collected-emails', expected: 'JSON_403' },
  { url: '/api/admin/blog/posts', expected: 'JSON_403' },
  { url: '/api/admin/emails', expected: 'JSON_403' },
  
  // Non-working routes (currently returning HTML)
  { url: '/api/admin/questions', expected: 'JSON_403' },
  { url: '/api/admin/sessions', expected: 'JSON_403' },
  
  // Public routes (should work)
  { url: '/api/questions', expected: 'JSON_200' },
  { url: '/api/collected-emails', expected: 'JSON_200' },
  { url: '/health', expected: 'JSON_200' },
  
  // Frontend routes (should return HTML)
  { url: '/', expected: 'HTML_200' },
  { url: '/admin', expected: 'HTML_302' }, // Should redirect to login
];

console.log('Testing complete API security flow...\n');

let testResults = [];

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
      else if (isJSON && response.statusCode === 401) actualResult = 'JSON_401';
      else if (isHTML && response.statusCode === 200) actualResult = 'HTML_200';
      else if (isHTML && response.statusCode === 302) actualResult = 'HTML_302';
      else actualResult = `${isJSON ? 'JSON' : 'HTML'}_${response.statusCode}`;
      
      const status = actualResult === test.expected ? '✅ PASS' : '❌ FAIL';
      
      testResults.push({
        url: test.url,
        expected: test.expected,
        actual: actualResult,
        status: status,
        index: index + 1
      });
      
      console.log(`${index + 1}. ${test.url}`);
      console.log(`   Expected: ${test.expected}, Got: ${actualResult} ${status}`);
      if (actualResult !== test.expected) {
        console.log(`   Content-Type: ${contentType}`);
        console.log(`   Response preview: ${data.substring(0, 100)}...`);
      }
      console.log('');
      
      // If this is the last test, show summary
      if (testResults.length === testRoutes.length) {
        console.log('=== SUMMARY ===');
        const passed = testResults.filter(r => r.status.includes('PASS')).length;
        const failed = testResults.filter(r => r.status.includes('FAIL')).length;
        console.log(`Passed: ${passed}, Failed: ${failed}`);
        
        if (failed > 0) {
          console.log('\nFailed tests:');
          testResults.filter(r => r.status.includes('FAIL')).forEach(r => {
            console.log(`- ${r.url}: expected ${r.expected}, got ${r.actual}`);
          });
        }
      }
    });
  });
  
  request.on('error', (error) => {
    console.log(`Error testing ${test.url}:`, error.message);
  });
});