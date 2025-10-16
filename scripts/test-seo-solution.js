#!/usr/bin/env node

import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

const testCrawlers = [
  { name: 'Facebook', userAgent: 'facebookexternalhit/1.1', path: '/' },
  { name: 'Twitter', userAgent: 'Twitterbot/1.0', path: '/test' },
  { name: 'LinkedIn', userAgent: 'LinkedInBot/1.0', path: '/blog' },
  { name: 'WhatsApp', userAgent: 'WhatsApp/2.0', path: '/about' },
  { name: 'Discord', userAgent: 'Mozilla/5.0 (compatible; Discordbot/2.0)', path: '/ikigai-types/builder' }
];

const normalUser = { name: 'Normal User', userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36', path: '/' };

async function testCrawler(crawler) {
  try {
    const command = `curl -s -H "User-Agent: ${crawler.userAgent}" "http://localhost:5000${crawler.path}"`;
    const { stdout } = await execAsync(command);
    
    const hasOpenGraph = stdout.includes('property="og:title"');
    const hasTwitterCard = stdout.includes('property="twitter:card"');
    const hasProperTitle = stdout.includes('<title>') && !stdout.includes('script type="module"');
    const hasCanonical = stdout.includes('rel="canonical"');
    
    console.log(`\n🤖 ${crawler.name} Test (${crawler.path}):`);
    console.log(`   ✅ Open Graph tags: ${hasOpenGraph ? 'Present' : '❌ Missing'}`);
    console.log(`   ✅ Twitter Card tags: ${hasTwitterCard ? 'Present' : '❌ Missing'}`);
    console.log(`   ✅ SEO-optimized title: ${hasProperTitle ? 'Present' : '❌ Missing'}`);
    console.log(`   ✅ Canonical URL: ${hasCanonical ? 'Present' : '❌ Missing'}`);
    
    // Extract and display the title
    const titleMatch = stdout.match(/<title>(.*?)<\/title>/);
    if (titleMatch) {
      console.log(`   📄 Title: "${titleMatch[1]}"`);
    }
    
    return hasOpenGraph && hasTwitterCard && hasProperTitle && hasCanonical;
  } catch (error) {
    console.log(`❌ ${crawler.name} Test failed:`, error.message);
    return false;
  }
}

async function testNormalUser() {
  try {
    const command = `curl -s -H "User-Agent: ${normalUser.userAgent}" "http://localhost:5000${normalUser.path}"`;
    const { stdout } = await execAsync(command);
    
    const isReactApp = stdout.includes('vite/client') || stdout.includes('script type="module"');
    const hasViteHMR = stdout.includes('createHotContext');
    
    console.log(`\n👤 ${normalUser.name} Test:`);
    console.log(`   ✅ React App served: ${isReactApp ? 'Yes' : '❌ No'}`);
    console.log(`   ✅ Vite HMR active: ${hasViteHMR ? 'Yes' : '❌ No'}`);
    
    return isReactApp;
  } catch (error) {
    console.log(`❌ ${normalUser.name} Test failed:`, error.message);
    return false;
  }
}

async function runAllTests() {
  console.log('🧪 Testing SEO Social Media Sharing Solution');
  console.log('='.repeat(50));
  
  const crawlerResults = [];
  
  // Test all crawlers
  for (const crawler of testCrawlers) {
    const result = await testCrawler(crawler);
    crawlerResults.push(result);
    
    // Small delay between tests
    await new Promise(resolve => setTimeout(resolve, 100));
  }
  
  // Test normal user
  const normalUserResult = await testNormalUser();
  
  // Summary
  const allCrawlersPassed = crawlerResults.every(result => result);
  const allTestsPassed = allCrawlersPassed && normalUserResult;
  
  console.log('\n' + '='.repeat(50));
  console.log('📊 Test Summary:');
  console.log(`   🤖 Crawler tests: ${allCrawlersPassed ? '✅ All passed' : '❌ Some failed'} (${crawlerResults.filter(r => r).length}/${crawlerResults.length})`);
  console.log(`   👤 User test: ${normalUserResult ? '✅ Passed' : '❌ Failed'}`);
  console.log(`   🎯 Overall: ${allTestsPassed ? '✅ SUCCESS' : '❌ FAILED'}`);
  
  if (allTestsPassed) {
    console.log('\n🎉 SEO Social Media Sharing solution is working perfectly!');
    console.log('   • Social media crawlers receive SEO-optimized HTML');
    console.log('   • Regular users receive the React application');
    console.log('   • All meta tags are properly configured');
  } else {
    console.log('\n⚠️  Some tests failed. Check the server logs and ensure:');
    console.log('   • Server is running on port 5000');
    console.log('   • SEO middleware is properly configured');
    console.log('   • Static SEO files exist in /public/seo/');
  }
  
  return allTestsPassed;
}

// Run tests
if (import.meta.url === `file://${process.argv[1]}`) {
  runAllTests()
    .then(success => process.exit(success ? 0 : 1))
    .catch(error => {
      console.error('Test runner failed:', error);
      process.exit(1);
    });
}

export { runAllTests };