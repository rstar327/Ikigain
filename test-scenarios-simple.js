#!/usr/bin/env node

// Simple test script to validate dashboard scenarios
import { execSync } from 'child_process';

console.log('🧪 Testing Dashboard Scenarios - Simple Version');
console.log('=' .repeat(60));

// Test Scenario 1: New User (No Sessions)
console.log('\n1️⃣ Testing New User (No Sessions)');
try {
  const result = execSync('curl -s "http://localhost:5000/api/user/test-sessions" -H "X-Test-User: user-new-test"', { encoding: 'utf8' });
  const sessions = JSON.parse(result);
  console.log(`   Sessions found: ${sessions.length}`);
  console.log(sessions.length === 0 ? '   ✅ PASS: New user dashboard expected' : '   ❌ FAIL: Should be new user');
} catch (e) {
  console.log(`   ❌ ERROR: ${e.message}`);
}

// Test Scenario 2: Incomplete Sessions Only
console.log('\n2️⃣ Testing Incomplete Sessions Only');
try {
  const result = execSync('curl -s "http://localhost:5000/api/user/test-sessions" -H "X-Test-User: user-incomplete-only"', { encoding: 'utf8' });
  const sessions = JSON.parse(result);
  const completedSessions = sessions.filter(s => s.isCompleted === true);
  console.log(`   Total sessions: ${sessions.length}, Completed: ${completedSessions.length}`);
  console.log(completedSessions.length === 0 ? '   ✅ PASS: Incomplete test dashboard expected' : '   ❌ FAIL: Should be incomplete test');
} catch (e) {
  console.log(`   ❌ ERROR: ${e.message}`);
}

// Test Scenario 3: Basic User (Completed, No Premium)
console.log('\n3️⃣ Testing Basic User (Completed, No Premium)');
try {
  const result = execSync('curl -s "http://localhost:5000/api/user/test-sessions" -H "X-Test-User: user-basic-only"', { encoding: 'utf8' });
  const sessions = JSON.parse(result);
  const completedSessions = sessions.filter(s => s.isCompleted === true);
  const premiumTier = completedSessions.length > 0 ? completedSessions[0].premiumTier : null;
  console.log(`   Completed sessions: ${completedSessions.length}, Premium tier: ${premiumTier || 'null'}`);
  console.log(!premiumTier ? '   ✅ PASS: Basic user dashboard expected' : '   ❌ FAIL: Should be basic user');
} catch (e) {
  console.log(`   ❌ ERROR: ${e.message}`);
}

// Test Scenario 4: Mixed Tiers User (Most Recent = Roadmap)
console.log('\n4️⃣ Testing Mixed Tiers User (Most Recent = Roadmap)');
try {
  const result = execSync('curl -s "http://localhost:5000/api/user/test-sessions" -H "X-Test-User: user-mixed-tiers"', { encoding: 'utf8' });
  const sessions = JSON.parse(result);
  const completedSessions = sessions.filter(s => s.isCompleted === true);
  const recentTier = completedSessions.length > 0 ? completedSessions[0].premiumTier : null;
  console.log(`   Completed sessions: ${completedSessions.length}, Most recent tier: ${recentTier || 'null'}`);
  console.log(recentTier === 'roadmap' ? '   ✅ PASS: Premium dashboard with roadmap tier expected' : '   ❌ FAIL: Should be roadmap tier');
} catch (e) {
  console.log(`   ❌ ERROR: ${e.message}`);
}

// Test Scenario 5: Original Complex User (Blueprint)
console.log('\n5️⃣ Testing Original Complex User (Blueprint)');
try {
  const result = execSync('curl -s "http://localhost:5000/api/user/test-sessions" -H "X-Test-User: dev-user-123"', { encoding: 'utf8' });
  const sessions = JSON.parse(result);
  const completedSessions = sessions.filter(s => s.isCompleted === true);
  const recentTier = completedSessions.length > 0 ? completedSessions[0].premiumTier : null;
  console.log(`   Completed sessions: ${completedSessions.length}, Most recent tier: ${recentTier || 'null'}`);
  console.log(recentTier === 'blueprint' ? '   ✅ PASS: Premium dashboard with blueprint tier expected' : '   ❌ FAIL: Should be blueprint tier');
} catch (e) {
  console.log(`   ❌ ERROR: ${e.message}`);
}

// Test Dashboard State Logic
console.log('\n📊 Testing Dashboard State Logic');
const testUsers = [
  { id: 'user-new-test', expected: 'new_user' },
  { id: 'user-incomplete-only', expected: 'incomplete_test' },
  { id: 'user-basic-only', expected: 'basic_user' },
  { id: 'user-mixed-tiers', expected: 'premium_user' },
  { id: 'dev-user-123', expected: 'premium_user' }
];

testUsers.forEach((user, index) => {
  try {
    const result = execSync(`curl -s "http://localhost:5000/api/user/test-sessions" -H "X-Test-User: ${user.id}"`, { encoding: 'utf8' });
    const sessions = JSON.parse(result);
    
    let dashboardState = 'new_user';
    if (sessions.length === 0) {
      dashboardState = 'new_user';
    } else {
      const completedSessions = sessions.filter(s => s.isCompleted === true);
      if (completedSessions.length === 0) {
        dashboardState = 'incomplete_test';
      } else {
        const recentSession = completedSessions[0];
        const premiumTier = recentSession.premiumTier;
        dashboardState = premiumTier ? 'premium_user' : 'basic_user';
      }
    }
    
    console.log(`   ${index + 1}. ${user.id}: ${dashboardState} ${dashboardState === user.expected ? '✅' : '❌'}`);
  } catch (e) {
    console.log(`   ${index + 1}. ${user.id}: ERROR - ${e.message}`);
  }
});

console.log('\n' + '='.repeat(60));
console.log('🏁 Dashboard Testing Complete');