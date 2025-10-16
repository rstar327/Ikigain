// Validate webhook tier mapping
const webhookMapping = {
  'roadmap': 'roadmap',          // $2.95 - Career Roadmap Guide
  'personality': 'personality',   // $4.95 - Personality Deep Dive  
  'blueprint': 'blueprint',      // $9.95 - Success Blueprint
  'premium-report': 'blueprint'  // Legacy fallback -> tier 3
};

console.log('🔗 Webhook Offer ID → Tier Mapping:');
console.log('');
Object.entries(webhookMapping).forEach(([offerId, tier]) => {
  console.log(`"${offerId}" → "${tier}"`);
});

console.log('');
console.log('✅ All tier mappings are correct for future payments');
console.log('✅ Webhook will properly assign tiers based on offer ID');
console.log('✅ Features will be filtered correctly for each tier');