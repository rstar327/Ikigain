const { execSync } = require('child_process');

console.log('=== COMPREHENSIVE PREMIUM TIER ACCESS CONTROL TEST ===\n');

// Test each tier's API responses
const tiers = [
  { name: 'ROADMAP', sessionId: 73, expectedFeatures: 3 },
  { name: 'PERSONALITY', sessionId: 171, expectedFeatures: 8 }, 
  { name: 'BLUEPRINT', sessionId: 170, expectedFeatures: 16 }
];

tiers.forEach(tier => {
  try {
    console.log(`--- ${tier.name} TIER (Session ${tier.sessionId}) ---`);
    
    const response = execSync(`curl -s "http://localhost:5000/api/premium-results/${tier.sessionId}"`, { encoding: 'utf8' });
    const data = JSON.parse(response);
    
    console.log(`Premium Tier: ${data.premiumTier}`);
    console.log(`Session ID: ${data.sessionId}`);
    
    // Count granted features
    const grantedFeatures = Object.values(data.featureAccess).filter(access => access === true).length;
    const lockedFeatures = Object.values(data.featureAccess).filter(access => access === false).length;
    
    console.log(`Features Granted: ${grantedFeatures}/${Object.keys(data.featureAccess).length}`);
    console.log(`Features Locked: ${lockedFeatures}`);
    
    // Verify expected feature count
    if (grantedFeatures === tier.expectedFeatures) {
      console.log(`✅ CORRECT: Expected ${tier.expectedFeatures} features, got ${grantedFeatures}`);
    } else {
      console.log(`❌ ERROR: Expected ${tier.expectedFeatures} features, got ${grantedFeatures}`);
    }
    
    // Show specific feature access
    console.log('Key Features:');
    console.log(`  Career Roadmap: ${data.featureAccess.careerRoadmap ? '✅' : '❌'}`);
    console.log(`  Personality Profile: ${data.featureAccess.personalityProfile ? '✅' : '❌'}`);
    console.log(`  Transformation Plan: ${data.featureAccess.transformationPlan ? '✅' : '❌'}`);
    
  } catch (error) {
    console.log(`❌ ERROR testing ${tier.name}: ${error.message}`);
  }
  
  console.log('');
});

console.log('=== ACCESS CONTROL LOGIC VERIFICATION ===');
console.log('Roadmap Tier ($2.95): Should have 3 features (career roadmap, matches, skill gaps)');
console.log('Personality Tier ($4.95): Should have 8 features (roadmap + personality analysis)'); 
console.log('Blueprint Tier ($9.95): Should have all 16 features (complete access)');
