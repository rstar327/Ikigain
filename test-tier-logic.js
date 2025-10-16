// Test the tier logic with different scenarios
const testScenarios = [
  {
    name: "Basic User (No Premium)",
    sessions: [
      { id: 68, isCompleted: true, premiumTier: null, results: { primaryType: "Skilled Expert" } }
    ]
  },
  {
    name: "Roadmap Tier User",
    sessions: [
      { id: 50, isCompleted: true, premiumTier: "roadmap", results: { primaryType: "Creative Enthusiast" } }
    ]
  },
  {
    name: "Personality Tier User",
    sessions: [
      { id: 69, isCompleted: true, premiumTier: "personality", results: { primaryType: "Skilled Expert" } }
    ]
  },
  {
    name: "Blueprint Tier User (Highest)",
    sessions: [
      { id: 70, isCompleted: true, premiumTier: "blueprint", results: { primaryType: "Purpose-Driven Leader" } }
    ]
  }
];

function getUserState(testSessions) {
  if (!testSessions || testSessions.length === 0) {
    return "new_user";
  }
  
  const completedSessions = testSessions.filter(session => session.isCompleted);
  const recentSession = completedSessions[completedSessions.length - 1];
  
  if (completedSessions.length === 0) {
    return "incomplete_test";
  }
  
  // Check if user has premium access (highest tier they purchased)
  if (recentSession?.premiumTier === 'blueprint') {
    return "premium_user";
  }
  
  if (recentSession?.premiumTier === 'personality' || recentSession?.premiumTier === 'roadmap') {
    return "premium_user";
  }
  
  return "basic_user";
}

function getTierDisplayName(tier) {
  switch (tier) {
    case 'roadmap': return 'Career Roadmap Guide';
    case 'personality': return 'Personality Deep Dive';
    case 'blueprint': return 'Success Blueprint';
    default: return 'Basic';
  }
}

function canUpgrade(tier) {
  return tier !== 'blueprint';
}

// Test each scenario
testScenarios.forEach(scenario => {
  console.log(`\n=== ${scenario.name} ===`);
  const userState = getUserState(scenario.sessions);
  const recentSession = scenario.sessions[scenario.sessions.length - 1];
  const tier = recentSession?.premiumTier || 'basic';
  
  console.log(`User State: ${userState}`);
  console.log(`Premium Tier: ${tier}`);
  console.log(`Tier Display Name: ${getTierDisplayName(tier)}`);
  console.log(`Can Upgrade: ${canUpgrade(tier)}`);
  
  if (userState === 'premium_user') {
    console.log(`Dashboard should show: Premium dashboard with ${getTierDisplayName(tier)} features`);
    console.log(`Premium Results Link: /premium-results/${recentSession.id}`);
    if (canUpgrade(tier)) {
      console.log(`Upgrade Link: /upgrade?session=${recentSession.id}`);
    } else {
      console.log('No upgrade needed - user has highest tier');
    }
  } else if (userState === 'basic_user') {
    console.log(`Dashboard should show: Basic dashboard with upgrade options`);
    console.log(`Basic Results Link: /test-results/${recentSession.id}`);
    console.log(`Upgrade Link: /upgrade?session=${recentSession.id}`);
  }
});

console.log('\n=== Tier Feature Access ===');
console.log('Roadmap tier: 3 tabs (Overview, Career Analysis, Roadmaps)');
console.log('Personality tier: 5 tabs (+ Development, Personality Profile)');
console.log('Blueprint tier: 6 tabs (+ Market Insights)');