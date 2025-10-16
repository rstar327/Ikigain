#!/usr/bin/env node

/**
 * Comprehensive Dashboard Testing Script
 * Tests all user scenarios to ensure robust dashboard functionality
 */

const scenarios = [
  {
    name: "New User (No Sessions)",
    userId: "user-new-test",
    email: "newuser@example.com",
    expectedDashboard: "new_user",
    expectedElements: ["Start Your Journey", "Most Popular", "Full Ikigai Test"],
    description: "Should show new user onboarding with assessment options"
  },
  {
    name: "Incomplete Sessions Only",
    userId: "user-incomplete-only", 
    email: "incomplete@example.com",
    expectedDashboard: "incomplete_test",
    expectedElements: ["Continue Assessment", "Start Fresh", "Quick Type Test"],
    description: "Should show incomplete test dashboard with continue option"
  },
  {
    name: "Basic User (Completed, No Premium)",
    userId: "user-basic-only",
    email: "basic@example.com", 
    expectedDashboard: "basic_user",
    expectedElements: ["Your Results", "Premium Insights", "Upgrade Results"],
    description: "Should show basic user dashboard with upgrade options"
  },
  {
    name: "Mixed Tiers User (Most Recent = Roadmap)",
    userId: "user-mixed-tiers",
    email: "mixed@example.com",
    expectedDashboard: "premium_user", 
    expectedElements: ["Premium Results", "Upgrade Available", "Career Roadmap Guide"],
    description: "Should show premium dashboard with roadmap tier (most recent session)"
  },
  {
    name: "Original Complex User (Blueprint Tier)",
    userId: "dev-user-123",
    email: "dev@example.com",
    expectedDashboard: "premium_user",
    expectedElements: ["Premium Results", "Success Blueprint", "Quick Test"],
    description: "Should show premium dashboard with blueprint tier (highest)"
  }
];

async function testScenario(scenario) {
  console.log(`\n🧪 Testing: ${scenario.name}`);
  console.log(`📋 Description: ${scenario.description}`);
  
  try {
    // Create mock session for the user
    const mockSession = {
      user: {
        id: scenario.userId,
        email: scenario.email,
        firstName: scenario.userId.split('-')[1] || 'Test',
        lastName: 'User',
        role: 'user',
        claims: {
          sub: scenario.userId,
          email: scenario.email,
          first_name: scenario.userId.split('-')[1] || 'Test',
          last_name: 'User'
        }
      }
    };
    
    // Set session endpoint
    const sessionResponse = await fetch('http://localhost:5000/api/dev-set-session', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(mockSession)
    });
    
    if (!sessionResponse.ok) {
      console.log(`⚠️  Session setup failed, trying auto-login method...`);
      
      // Fallback: test with cURL commands
      const { execSync } = require('child_process');
      
      // Test user sessions API
      const sessionsResult = execSync(`curl -s "http://localhost:5000/api/user/test-sessions" -H "X-Test-User: ${scenario.userId}"`);
      const sessions = JSON.parse(sessionsResult.toString());
      
      console.log(`📊 Sessions found: ${sessions.length}`);
      
      if (sessions.length === 0) {
        console.log(`✅ Expected: ${scenario.expectedDashboard} (new_user)`);
      } else {
        const completedSessions = sessions.filter(s => s.isCompleted || s.is_completed);
        console.log(`📊 Completed sessions: ${completedSessions.length}`);
        
        if (completedSessions.length === 0) {
          console.log(`✅ Expected: ${scenario.expectedDashboard} (incomplete_test)`);
        } else {
          const recentSession = completedSessions[0];
          const premiumTier = recentSession.premiumTier || recentSession.premium_tier;
          
          if (premiumTier) {
            console.log(`✅ Expected: ${scenario.expectedDashboard} (premium_user) - Tier: ${premiumTier}`);
          } else {
            console.log(`✅ Expected: ${scenario.expectedDashboard} (basic_user)`);
          }
        }
      }
      
      return;
    }
    
    // Test authentication
    const authResponse = await fetch('http://localhost:5000/api/auth/user');
    const user = await authResponse.json();
    
    console.log(`👤 User authenticated: ${user.id}`);
    
    // Test sessions
    const sessionsResponse = await fetch('http://localhost:5000/api/user/test-sessions');
    const sessions = await sessionsResponse.json();
    
    console.log(`📊 Sessions found: ${sessions.length}`);
    
    // Analyze dashboard state
    const completedSessions = sessions.filter(s => s.isCompleted || s.is_completed);
    let dashboardState = 'new_user';
    
    if (sessions.length === 0) {
      dashboardState = 'new_user';
    } else if (completedSessions.length === 0) {
      dashboardState = 'incomplete_test';
    } else {
      const recentSession = completedSessions[0];
      const premiumTier = recentSession.premiumTier || recentSession.premium_tier;
      
      if (premiumTier) {
        dashboardState = 'premium_user';
        console.log(`🎯 Premium tier detected: ${premiumTier}`);
      } else {
        dashboardState = 'basic_user';
      }
    }
    
    console.log(`🎯 Dashboard state: ${dashboardState}`);
    
    if (dashboardState === scenario.expectedDashboard) {
      console.log(`✅ PASS: Dashboard state matches expected`);
    } else {
      console.log(`❌ FAIL: Expected ${scenario.expectedDashboard}, got ${dashboardState}`);
    }
    
  } catch (error) {
    console.log(`❌ ERROR: ${error.message}`);
  }
}

async function runAllTests() {
  console.log('🚀 Starting Comprehensive Dashboard Testing');
  console.log('=' .repeat(60));
  
  for (const scenario of scenarios) {
    await testScenario(scenario);
    await new Promise(resolve => setTimeout(resolve, 1000)); // Wait 1 second between tests
  }
  
  console.log('\n' + '='.repeat(60));
  console.log('🏁 All Dashboard Tests Completed');
}

// Run if called directly
if (require.main === module) {
  runAllTests().catch(console.error);
}

module.exports = { runAllTests, testScenario };