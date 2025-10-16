// Test production Google Analytics
const testProductionGA = async () => {
  console.log('🧪 Testing Production Google Analytics at ikigain.org...');
  
  try {
    // Test with regular browser user agent
    const response = await fetch('https://ikigain.org/', {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      }
    });
    
    const html = await response.text();
    console.log('Response length:', html.length);
    
    // Check for GA elements
    const hasGtag = html.includes('gtag') || html.includes('G-7LMJGM0MQT');
    const hasDataLayer = html.includes('dataLayer');
    const hasGAScript = html.includes('googletagmanager.com');
    
    console.log('✅ GA Script found:', hasGAScript);
    console.log('✅ Gtag found:', hasGtag);
    console.log('✅ DataLayer found:', hasDataLayer);
    
    if (hasGAScript && hasGtag) {
      console.log('🎉 Google Analytics is properly deployed!');
    } else {
      console.log('⚠️ Google Analytics might not be fully deployed');
    }
    
  } catch (error) {
    console.error('Error testing production GA:', error);
  }
};

if (typeof window === 'undefined') {
  // Node.js environment
  console.log('Use: node -e "eval(require(\'fs\').readFileSync(\'test-production-ga.js\', \'utf8\'))"');
}

testProductionGA();