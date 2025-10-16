#!/usr/bin/env node

// Test script to verify each tier shows correct information
const tiers = ['roadmap', 'personality', 'blueprint'];

async function testTier(tier) {
  console.log(`\n=== Testing ${tier.toUpperCase()} Tier ===`);
  
  // Update session tier
  const updateResponse = await fetch('http://localhost:5000/api/test-sessions/25', {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ premiumTier: tier })
  });
  
  if (!updateResponse.ok) {
    console.error(`Failed to update session to ${tier} tier`);
    return;
  }
  
  // Get premium results
  const resultsResponse = await fetch('http://localhost:5000/api/premium-results/25');
  const results = await resultsResponse.json();
  
  console.log(`Feature Access for ${tier}:`);
  console.log('- careerRoadmap:', results.featureAccess.careerRoadmap);
  console.log('- careerMatches:', results.featureAccess.careerMatches);
  console.log('- skillGaps:', results.featureAccess.skillGaps);
  console.log('- personalityProfile:', results.featureAccess.personalityProfile);
  console.log('- cognitiveStyle:', results.featureAccess.cognitiveStyle);
  console.log('- workStyleAnalysis:', results.featureAccess.workStyleAnalysis);
  console.log('- communicationGuide:', results.featureAccess.communicationGuide);
  console.log('- stressManagement:', results.featureAccess.stressManagement);
  console.log('- transformationPlan:', results.featureAccess.transformationPlan);
  console.log('- dailyHabits:', results.featureAccess.dailyHabits);
  console.log('- confidenceBuilding:', results.featureAccess.confidenceBuilding);
  console.log('- interviewPrep:', results.featureAccess.interviewPrep);
  console.log('- networkingStrategy:', results.featureAccess.networkingStrategy);
  console.log('- aiMentor:', results.featureAccess.aiMentor);
  console.log('- marketInsights:', results.featureAccess.marketInsights);
  console.log('- developmentAreas:', results.featureAccess.developmentAreas);
  
  console.log(`\nData Available for ${tier}:`);
  console.log('- personalityInsights:', !!results.detailedAnalysis.personalityInsights);
  console.log('- careerFit:', !!results.detailedAnalysis.careerFit);
  console.log('- roadmaps:', !!results.detailedAnalysis.roadmaps);
  console.log('- developmentAreas:', !!results.detailedAnalysis.developmentAreas);
  console.log('- marketInsights:', !!results.detailedAnalysis.marketInsights);
  console.log('- personalityProfile:', !!results.detailedAnalysis.personalityProfile);
  console.log('- networkingStrategy:', !!results.detailedAnalysis.networkingStrategy);
  console.log('- aiMentor:', !!results.detailedAnalysis.aiMentor);
  console.log('- interviewPreparation:', !!results.detailedAnalysis.interviewPreparation);
  console.log('- successBlueprint:', !!results.detailedAnalysis.successBlueprint);
}

async function main() {
  console.log('Testing Premium Tier Access Control...');
  
  for (const tier of tiers) {
    await testTier(tier);
  }
  
  console.log('\n=== Test Complete ===');
}

main().catch(console.error);