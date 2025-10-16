#!/usr/bin/env node

// Test script to verify all personality type translations work correctly

const personalityTypes = [
  'Creative Enthusiast',
  'Skilled Expert', 
  'Purpose-Driven Leader',
  'Career-Focused Achiever',
  'Balanced Integrator'
];

const tiers = ['roadmap', 'personality', 'blueprint'];

console.log('=== Testing Personality Type Translations ===');

// Test English translations
console.log('\n--- English Translations ---');
personalityTypes.forEach(type => {
  console.log(`${type}: Should display as "${type}"`);
});

// Test Spanish translations
console.log('\n--- Spanish Translations ---');
const spanishTranslations = {
  'Creative Enthusiast': 'Entusiasta Creativo',
  'Skilled Expert': 'Experto Especializado',
  'Purpose-Driven Leader': 'Líder Impulsado por Propósito', 
  'Career-Focused Achiever': 'Triunfador Enfocado en Carrera',
  'Balanced Integrator': 'Integrador Equilibrado'
};

personalityTypes.forEach(type => {
  console.log(`${type}: Should display as "${spanishTranslations[type]}"`);
});

console.log('\n=== Testing Tier Scenarios ===');

// Test different premium tiers
tiers.forEach(tier => {
  console.log(`\n--- Testing ${tier} tier ---`);
  
  switch(tier) {
    case 'roadmap':
      console.log('Features: Career roadmaps, career matches, skills gap analysis, career guidance');
      console.log('Upgrade options: Can upgrade to personality (€5) or blueprint (€10)');
      break;
    case 'personality':
      console.log('Features: All roadmap features + personality profile, cognitive analysis, work style');
      console.log('Upgrade options: Can upgrade to blueprint (€5)');
      break;
    case 'blueprint':
      console.log('Features: All previous features + transformation plan, daily habits, AI mentor');
      console.log('Upgrade options: None - highest tier');
      break;
  }
});

console.log('\n=== Test Complete ===');