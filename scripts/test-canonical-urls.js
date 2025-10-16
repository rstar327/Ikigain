#!/usr/bin/env node

/**
 * Canonical URL Test Script
 * Tests canonical URL consistency to resolve ahrefs.com crawling issues
 */

const testUrls = [
  '/',
  '/test',
  '/blog',
  '/about',
  '/what-is-ikigai',
  '/ikigai-types/builder',
  '/ikigai-types/dreamer',
  '/ikigai-types/explorer',
  '/ikigai-types/achiever',
  '/ikigai-types/helper'
];

const userAgents = [
  'Googlebot/2.1 (+http://www.google.com/bot.html)',
  'Mozilla/5.0 (compatible; bingbot/2.0; +http://www.bing.com/bingbot.htm)',
  'Mozilla/5.0 (compatible; AhrefsBot/7.0; +http://ahrefs.com/robot/)',
  'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
  'facebookexternalhit/1.1 (+http://www.facebook.com/externalhit_uatext.php)'
];

async function testCanonicalURL(url, userAgent) {
  const { exec } = require('child_process');
  const { promisify } = require('util');
  const execAsync = promisify(exec);
  
  try {
    const cmd = `curl -s -H "User-Agent: ${userAgent}" "http://localhost:5000${url}"`;
    const { stdout } = await execAsync(cmd);
    
    // Extract canonical URL
    const canonicalMatch = stdout.match(/<link rel="canonical" href="([^"]+)"/);
    const canonicalUrl = canonicalMatch ? canonicalMatch[1] : 'NOT_FOUND';
    
    // Check for other SEO elements
    const hasTitle = stdout.includes('<title>') && !stdout.includes('<title>Vite App</title>');
    const hasDescription = stdout.includes('<meta name="description"');
    const hasOGUrl = stdout.includes('<meta property="og:url"');
    
    return {
      url,
      userAgent: userAgent.split('/')[0],
      canonicalUrl,
      hasTitle,
      hasDescription,
      hasOGUrl,
      isConsistent: canonicalUrl === `https://www.ikigain.org${url === '/' ? '/' : url}`,
      responseLength: stdout.length
    };
  } catch (error) {
    return {
      url,
      userAgent: userAgent.split('/')[0],
      canonicalUrl: 'ERROR',
      error: error.message
    };
  }
}

async function runCanonicalTests() {
  console.log('🔗 Canonical URL Test Suite');
  console.log('═'.repeat(80));
  console.log('Testing canonical URL consistency to resolve ahrefs.com crawling issues...\n');
  
  const results = [];
  let passed = 0;
  let failed = 0;
  
  for (const url of testUrls) {
    console.log(`\n📄 Testing URL: ${url}`);
    console.log('─'.repeat(50));
    
    for (const userAgent of userAgents) {
      const result = await testCanonicalURL(url, userAgent);
      results.push(result);
      
      const status = result.isConsistent ? '✅' : '❌';
      const canonical = result.canonicalUrl.length > 50 ? 
        result.canonicalUrl.substring(0, 47) + '...' : 
        result.canonicalUrl;
      
      console.log(`${status} ${result.userAgent.padEnd(15)} → ${canonical}`);
      
      if (result.isConsistent) {
        passed++;
      } else {
        failed++;
        if (result.error) {
          console.log(`    Error: ${result.error}`);
        }
      }
    }
  }
  
  console.log('\n' + '═'.repeat(80));
  console.log(`📊 Canonical URL Test Results: ${passed} passed, ${failed} failed`);
  
  // Check for consistency issues
  const inconsistentUrls = results.filter(r => !r.isConsistent && !r.error);
  if (inconsistentUrls.length > 0) {
    console.log('\n⚠️  Inconsistent canonical URLs detected:');
    inconsistentUrls.forEach(r => {
      console.log(`   ${r.url} (${r.userAgent}): Expected https://www.ikigain.org${r.url === '/' ? '/' : r.url}, Got ${r.canonicalUrl}`);
    });
  }
  
  // Check for ahrefs-specific issues
  const ahrefsBot = results.filter(r => r.userAgent.includes('Ahrefs'));
  if (ahrefsBot.length > 0) {
    const ahrefsIssues = ahrefsBot.filter(r => !r.isConsistent);
    if (ahrefsIssues.length === 0) {
      console.log('\n🎉 AhrefsBot canonical URLs are consistent!');
    } else {
      console.log('\n❌ AhrefsBot detected canonical URL issues:');
      ahrefsIssues.forEach(r => {
        console.log(`   ${r.url}: ${r.canonicalUrl}`);
      });
    }
  }
  
  if (failed === 0) {
    console.log('\n🎉 All canonical URLs are consistent! This should resolve ahrefs.com crawling issues.');
  } else {
    console.log('\n⚠️  Some canonical URL issues detected. Review server middleware configuration.');
  }
  
  return failed === 0;
}

if (require.main === module) {
  runCanonicalTests().then(success => {
    process.exit(success ? 0 : 1);
  });
}

module.exports = { runCanonicalTests };