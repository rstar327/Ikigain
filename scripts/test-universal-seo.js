#!/usr/bin/env node

/**
 * Universal SEO Test Script
 * Tests that meta tags are displayed when links are shared anywhere
 */

const testCases = [
  // Social Media Crawlers
  { name: 'Facebook Bot', agent: 'facebookexternalhit/1.1', url: '/' },
  { name: 'Twitter Bot', agent: 'Twitterbot/1.0', url: '/test' },
  { name: 'LinkedIn Bot', agent: 'LinkedInBot/1.0', url: '/blog' },
  { name: 'Pinterest Bot', agent: 'Pinterest/0.2', url: '/about' },
  
  // Messaging Platform Crawlers
  { name: 'WhatsApp', agent: 'WhatsApp/2.21.18.15', url: '/what-is-ikigai' },
  { name: 'Telegram Bot', agent: 'Telegram Bot SDK', url: '/ikigai-types/dreamer' },
  { name: 'Discord Bot', agent: 'Discord-LinkPreview', url: '/ikigai-types/builder' },
  { name: 'Slack Bot', agent: 'Slack-ImgProxy', url: '/ikigai-types/explorer' },
  
  // Search Engine Crawlers
  { name: 'Google Bot', agent: 'Googlebot/2.1', url: '/ikigai-types/achiever' },
  { name: 'Bing Bot', agent: 'bingbot/2.0', url: '/ikigai-types/helper' },
  { name: 'Yahoo Bot', agent: 'Yahoo! Slurp', url: '/' },
  
  // Development Tools & Link Preview Systems
  { name: 'cURL', agent: 'curl/7.68.0', url: '/test' },
  { name: 'Postman', agent: 'PostmanRuntime/7.28.0', url: '/blog' },
  { name: 'HTTPie', agent: 'HTTPie/2.4.0', url: '/about' },
  { name: 'Generic Preview Bot', agent: 'LinkPreviewBot/1.0', url: '/what-is-ikigai' },
  
  // Edge Cases
  { name: 'Web Scraper', agent: 'WebScraper/1.0', url: '/' },
  { name: 'Site Checker', agent: 'SiteChecker Bot', url: '/test' },
  { name: 'SEO Validator', agent: 'SEO-Validator', url: '/blog' }
];

async function testSEOResponse(testCase) {
  const { exec } = require('child_process');
  const { promisify } = require('util');
  const execAsync = promisify(exec);
  
  try {
    const cmd = `curl -s -H "User-Agent: ${testCase.agent}" "http://localhost:5000${testCase.url}"`;
    const { stdout } = await execAsync(cmd);
    
    // Check for essential SEO elements
    const hasTitle = stdout.includes('<title>') && !stdout.includes('<title>Vite App</title>');
    const hasDescription = stdout.includes('<meta name="description"');
    const hasCanonical = stdout.includes('<link rel="canonical"');
    const hasOGTags = stdout.includes('<meta property="og:');
    const hasTwitterTags = stdout.includes('<meta property="twitter:') || stdout.includes('<meta name="twitter:');
    
    const isOptimized = hasTitle && hasDescription && hasCanonical && hasOGTags;
    
    return {
      ...testCase,
      success: isOptimized,
      details: {
        hasTitle,
        hasDescription,
        hasCanonical,
        hasOGTags,
        hasTwitterTags,
        responseLength: stdout.length
      }
    };
  } catch (error) {
    return {
      ...testCase,
      success: false,
      error: error.message
    };
  }
}

async function runAllTests() {
  console.log('🧪 Universal SEO Test Suite');
  console.log('═'.repeat(60));
  console.log('Testing that meta content is displayed when sharing links anywhere...\n');
  
  const results = [];
  let passed = 0;
  let failed = 0;
  
  for (const testCase of testCases) {
    process.stdout.write(`Testing ${testCase.name.padEnd(20)} ... `);
    
    const result = await testSEOResponse(testCase);
    results.push(result);
    
    if (result.success) {
      console.log('✅ PASS');
      passed++;
    } else {
      console.log('❌ FAIL');
      if (result.error) {
        console.log(`    Error: ${result.error}`);
      } else {
        console.log(`    Missing: ${Object.entries(result.details)
          .filter(([key, value]) => key.startsWith('has') && !value)
          .map(([key]) => key.replace('has', ''))
          .join(', ')}`);
      }
      failed++;
    }
  }
  
  console.log('\n' + '═'.repeat(60));
  console.log(`📊 Test Results: ${passed} passed, ${failed} failed`);
  
  if (failed === 0) {
    console.log('🎉 All tests passed! Meta content is displayed when sharing links anywhere.');
  } else {
    console.log('⚠️  Some tests failed. Check server logs and middleware configuration.');
  }
  
  return failed === 0;
}

if (require.main === module) {
  runAllTests().then(success => {
    process.exit(success ? 0 : 1);
  });
}

module.exports = { runAllTests, testCases };