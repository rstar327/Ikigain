const fetch = require('node-fetch');
const baseUrl = 'http://localhost:5000';

// Test different scenarios
async function testDashboard() {
  console.log('Testing Dashboard Tiers...\n');
  
  // Test 1: Basic user (no premium tier)
  console.log('=== Test 1: Basic User (Session 68) ===');
  const basicResponse = await fetch(`${baseUrl}/api/test-sessions`);
  console.log('Status:', basicResponse.status);
  
  // Test 2: Roadmap tier user
  console.log('\n=== Test 2: Roadmap Tier User (Session 50) ===');
  const roadmapResponse = await fetch(`${baseUrl}/api/test-sessions/50`);
  console.log('Status:', roadmapResponse.status);
  
  // Test 3: Personality tier user
  console.log('\n=== Test 3: Personality Tier User (Session 69) ===');
  const personalityResponse = await fetch(`${baseUrl}/api/test-sessions/69`);
  console.log('Status:', personalityResponse.status);
  
  // Test 4: Blueprint tier user (highest tier)
  console.log('\n=== Test 4: Blueprint Tier User (Session 70) ===');
  const blueprintResponse = await fetch(`${baseUrl}/api/test-sessions/70`);
  console.log('Status:', blueprintResponse.status);
  
  // Test premium results access
  console.log('\n=== Testing Premium Results Access ===');
  
  // Test roadmap tier access
  console.log('\nRoadmap tier accessing premium results...');
  const roadmapPremiumResponse = await fetch(`${baseUrl}/api/premium-results/50`);
  console.log('Status:', roadmapPremiumResponse.status);
  
  // Test personality tier access
  console.log('\nPersonality tier accessing premium results...');
  const personalityPremiumResponse = await fetch(`${baseUrl}/api/premium-results/69`);
  console.log('Status:', personalityPremiumResponse.status);
  
  // Test blueprint tier access
  console.log('\nBlueprint tier accessing premium results...');
  const blueprintPremiumResponse = await fetch(`${baseUrl}/api/premium-results/70`);
  console.log('Status:', blueprintPremiumResponse.status);
  
  console.log('\n=== Dashboard Test Complete ===');
}

// Run the test
testDashboard().catch(console.error);