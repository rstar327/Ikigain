#!/usr/bin/env node

/**
 * Test script to verify ahrefs.com SEO issues have been resolved
 * Tests the fixes for the following issues reported in ahrefs.com:
 * - Page has no outgoing links (162 pages)
 * - Orphan pages (161 pages) 
 * - Low word count (162 pages)
 * - Meta description too long (1 page)
 */

import https from 'https';
import http from 'http';

const BASE_URL = 'http://localhost:5000';
const TEST_ROUTES = [
  '/',
  '/about',
  '/test',
  '/blog',
  '/what-is-ikigai',
  '/ikigai-types/builder',
  '/ikigai-types/dreamer',
  '/ikigai-types/explorer',
  '/ikigai-types/achiever',
  '/ikigai-types/helper'
];

// Test different crawler user agents that ahrefs.com might use
const TEST_USER_AGENTS = [
  'AhrefsBot/7.0', // Ahrefs crawler
  'Googlebot/2.1', // Google crawler
  'bingbot/2.0',   // Bing crawler
  'Mozilla/5.0'    // Regular browser
];

function makeRequest(url, userAgent) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'localhost',
      port: 5000,
      path: url,
      method: 'GET',
      headers: {
        'User-Agent': userAgent,
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8'
      }
    };

    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => {
        data += chunk;
      });
      res.on('end', () => {
        resolve({
          statusCode: res.statusCode,
          headers: res.headers,
          body: data,
          url: url,
          userAgent: userAgent
        });
      });
    });

    req.on('error', (err) => {
      reject(err);
    });

    req.setTimeout(10000, () => {
      req.destroy();
      reject(new Error('Request timeout'));
    });

    req.end();
  });
}

function analyzeContent(response) {
  const { body, url, userAgent } = response;
  const analysis = {
    url,
    userAgent,
    issues: [],
    fixes: []
  };

  // Check for outgoing links
  const internalLinks = (body.match(/href="[^"]*"/g) || []).filter(link => 
    link.includes('/test') || 
    link.includes('/about') || 
    link.includes('/blog') || 
    link.includes('/what-is-ikigai') || 
    link.includes('/ikigai-types')
  );

  if (internalLinks.length === 0) {
    analysis.issues.push('❌ No outgoing internal links found');
  } else {
    analysis.fixes.push(`✅ Found ${internalLinks.length} internal links (fixes orphan pages)`);
  }

  // Check meta description length
  const metaDescMatch = body.match(/<meta name="description" content="([^"]+)"/);
  if (metaDescMatch) {
    const descLength = metaDescMatch[1].length;
    if (descLength > 160) {
      analysis.issues.push(`❌ Meta description too long: ${descLength} characters`);
    } else {
      analysis.fixes.push(`✅ Meta description optimal: ${descLength} characters`);
    }
  }

  // Check word count (rough estimate)
  const textContent = body.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
  const wordCount = textContent.split(' ').length;
  
  if (wordCount < 300) {
    analysis.issues.push(`❌ Low word count: ${wordCount} words`);
  } else {
    analysis.fixes.push(`✅ Good word count: ${wordCount} words`);
  }

  // Check for canonical URL
  const canonicalMatch = body.match(/<link rel="canonical" href="([^"]+)"/);
  if (canonicalMatch) {
    analysis.fixes.push(`✅ Canonical URL: ${canonicalMatch[1]}`);
  } else {
    analysis.issues.push('❌ Missing canonical URL');
  }

  // Check for Open Graph tags
  const ogTags = (body.match(/<meta property="og:[^"]*" content="[^"]*"/g) || []).length;
  if (ogTags > 0) {
    analysis.fixes.push(`✅ Found ${ogTags} Open Graph tags`);
  } else {
    analysis.issues.push('❌ Missing Open Graph tags');
  }

  return analysis;
}

async function runTests() {
  console.log('🔍 Testing ahrefs.com SEO fixes...\n');

  const results = [];

  for (const route of TEST_ROUTES) {
    console.log(`\n📄 Testing route: ${route}`);
    
    for (const userAgent of TEST_USER_AGENTS) {
      try {
        const response = await makeRequest(route, userAgent);
        const analysis = analyzeContent(response);
        results.push(analysis);

        console.log(`  ${userAgent.includes('AhrefsBot') ? '🤖' : '👤'} ${userAgent}:`);
        
        if (analysis.fixes.length > 0) {
          analysis.fixes.forEach(fix => console.log(`    ${fix}`));
        }
        
        if (analysis.issues.length > 0) {
          analysis.issues.forEach(issue => console.log(`    ${issue}`));
        }

        if (analysis.fixes.length === 0 && analysis.issues.length === 0) {
          console.log('    ⚠️  No specific data detected');
        }

      } catch (error) {
        console.log(`    ❌ Error: ${error.message}`);
      }
    }
  }

  // Summary
  console.log('\n📊 SUMMARY REPORT');
  console.log('==================');

  const totalIssues = results.reduce((sum, r) => sum + r.issues.length, 0);
  const totalFixes = results.reduce((sum, r) => sum + r.fixes.length, 0);

  console.log(`✅ SEO Fixes Applied: ${totalFixes}`);
  console.log(`❌ Remaining Issues: ${totalIssues}`);

  if (totalIssues === 0) {
    console.log('\n🎉 All ahrefs.com SEO issues have been resolved!');
  } else {
    console.log('\n⚠️  Some issues remain to be addressed');
  }

  // Key ahrefs.com specific checks
  const ahrefsResults = results.filter(r => r.userAgent.includes('AhrefsBot'));
  if (ahrefsResults.length > 0) {
    console.log('\n🤖 AhrefsBot Specific Results:');
    const ahrefsIssues = ahrefsResults.reduce((sum, r) => sum + r.issues.length, 0);
    const ahreFixes = ahrefsResults.reduce((sum, r) => sum + r.fixes.length, 0);
    
    console.log(`   ✅ Fixes detected by AhrefsBot: ${ahreFixes}`);
    console.log(`   ❌ Issues detected by AhrefsBot: ${ahrefsIssues}`);
    
    if (ahrefsIssues === 0) {
      console.log('   🎯 AhrefsBot should now see improved SEO!');
    }
  }

  console.log('\n' + '='.repeat(50));
}

// Run the tests
runTests().catch(console.error);