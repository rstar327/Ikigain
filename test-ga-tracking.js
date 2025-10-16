// Test Google Analytics tracking
console.log('🧪 Testing Google Analytics Implementation...');

// Check if GA is loaded
if (typeof window !== 'undefined' && window.gtag && window.dataLayer) {
  console.log('✅ Google Analytics loaded successfully');
  console.log('DataLayer events:', window.dataLayer.length);
  
  // Test custom event
  window.gtag('event', 'test_tracking', {
    event_category: 'testing',
    event_label: 'ga_validation',
    value: 1
  });
  
  console.log('✅ Test event sent to GA4');
  
} else {
  console.log('❌ Google Analytics not loaded');
}

// Test page view tracking
if (typeof window !== 'undefined' && window.gtag) {
  window.gtag('event', 'page_view', {
    page_title: 'Test Page View',
    page_location: 'https://ikigain.org/test',
    page_path: '/test'
  });
  console.log('✅ Test page view sent');
}