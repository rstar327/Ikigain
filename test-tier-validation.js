#!/usr/bin/env node

// Test script to validate tier feature access
const testTiers = async () => {
  const baseUrl = 'http://localhost:5000';
  
  // Test sessions with different tiers
  const testCases = [
    { sessionId: 460, expectedTier: 'roadmap', tierName: 'Tier 1 (Roadmap)' },
    { sessionId: 465, expectedTier: 'personality', tierName: 'Tier 2 (Personality)' },
    { sessionId: 466, expectedTier: 'blueprint', tierName: 'Tier 3 (Blueprint)' }
  ];
  
  console.log('🧪 Testing Premium Tier Feature Access...\n');
  
  for (const testCase of testCases) {
    try {
      const response = await fetch(`${baseUrl}/api/premium-results/${testCase.sessionId}`);
      if (!response.ok) {
        console.log(`❌ ${testCase.tierName}: API Error ${response.status}`);
        continue;
      }
      
      const data = await response.json();
      const { featureAccess, premiumTier } = data;
      
      console.log(`📋 ${testCase.tierName} (Session ${testCase.sessionId}):`);
      console.log(`   Tier: ${premiumTier}`);
      console.log(`   ✅ Enabled Features:`);
      
      Object.entries(featureAccess).forEach(([feature, enabled]) => {
        if (enabled) {
          console.log(`      - ${feature}`);
        }
      });
      
      console.log(`   🔒 Locked Features:`);
      Object.entries(featureAccess).forEach(([feature, enabled]) => {
        if (!enabled) {
          console.log(`      - ${feature}`);
        }
      });
      
      console.log('');
      
    } catch (error) {
      console.log(`❌ ${testCase.tierName}: ${error.message}`);
    }
  }
  
  // Expected feature counts by tier
  console.log('📊 Expected Feature Counts:');
  console.log('   Tier 1 (Roadmap): 3 features');
  console.log('   Tier 2 (Personality): 8 features');  
  console.log('   Tier 3 (Blueprint): 16 features (all)');
};

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  testTiers();
}