#!/usr/bin/env node

/**
 * CRITICAL CUSTOMER FIX SCRIPT
 * 
 * This script identifies and fixes ALL customers affected by the premium tier
 * assignment bug where they have a premium_tier but has_premium_access = false
 */

import { execSync } from 'child_process';

console.log('🚨 CRITICAL: FIXING ALL AFFECTED CUSTOMERS 🚨\n');

// Get all affected sessions from database
console.log('=== IDENTIFYING AFFECTED CUSTOMERS ===');

try {
  const dbQuery = `
    SELECT id, premium_tier, has_premium_access, email 
    FROM test_sessions 
    WHERE premium_tier IS NOT NULL AND has_premium_access = false
    ORDER BY id;
  `;
  
  const affectedSessions = execSync(`psql "${process.env.DATABASE_URL}" -c "${dbQuery}" --csv`, { 
    encoding: 'utf8' 
  });
  
  console.log('Affected sessions (have tier but no access):');
  console.log(affectedSessions);
  
  // Parse CSV to get session IDs
  const lines = affectedSessions.trim().split('\n');
  const header = lines[0];
  const dataLines = lines.slice(1);
  
  if (dataLines.length === 0) {
    console.log('✅ No affected sessions found');
  } else {
    console.log(`\n🚨 FOUND ${dataLines.length} AFFECTED CUSTOMERS!`);
    
    dataLines.forEach((line, index) => {
      const [id, tier, hasAccess, email] = line.split(',');
      console.log(`  Session ${id}: ${tier} tier, access=${hasAccess}, email=${email || 'none'}`);
    });
    
    console.log('\n=== FIXING ALL AFFECTED CUSTOMERS ===');
    
    // Fix each affected session
    for (const line of dataLines) {
      const [sessionId, tier, hasAccess, email] = line.split(',');
      
      console.log(`Fixing Session ${sessionId} (${tier} tier)...`);
      
      try {
        const fixQuery = `
          UPDATE test_sessions 
          SET has_premium_access = true 
          WHERE id = ${sessionId} AND premium_tier IS NOT NULL;
        `;
        
        execSync(`psql "${process.env.DATABASE_URL}" -c "${fixQuery}"`, { encoding: 'utf8' });
        console.log(`  ✅ Session ${sessionId} fixed - premium access granted`);
        
        // Verify the fix
        const verifyResponse = execSync(`curl -s "http://localhost:5000/api/premium-results/${sessionId}"`, { 
          encoding: 'utf8' 
        });
        const data = JSON.parse(verifyResponse);
        
        const enabledFeatures = Object.entries(data.featureAccess)
          .filter(([key, enabled]) => enabled === true)
          .length;
        
        console.log(`  ✅ Verified: ${enabledFeatures} features now enabled for ${data.premiumTier} tier`);
        
      } catch (error) {
        console.log(`  ❌ Error fixing session ${sessionId}:`, error.message);
      }
    }
  }
  
} catch (error) {
  console.error('❌ Error querying database:', error.message);
}

console.log('\n=== VERIFICATION OF ALL PREMIUM SESSIONS ===');

try {
  const verifyQuery = `
    SELECT id, premium_tier, has_premium_access, 
    CASE 
        WHEN premium_tier IS NOT NULL AND has_premium_access = true THEN 'CORRECT' 
        WHEN premium_tier IS NOT NULL AND has_premium_access = false THEN 'STILL_BROKEN'
        ELSE 'NO_TIER'
    END as status
    FROM test_sessions 
    WHERE premium_tier IS NOT NULL 
    ORDER BY id;
  `;
  
  const finalStatus = execSync(`psql "${process.env.DATABASE_URL}" -c "${verifyQuery}" --csv`, { 
    encoding: 'utf8' 
  });
  
  console.log('Final status of all premium sessions:');
  console.log(finalStatus);
  
  // Check if any are still broken
  if (finalStatus.includes('STILL_BROKEN')) {
    console.log('\n❌ CRITICAL: Some customers still not fixed!');
  } else {
    console.log('\n✅ ALL CUSTOMERS FIXED: All premium sessions now have correct access');
  }
  
} catch (error) {
  console.error('❌ Error verifying fixes:', error.message);
}

console.log('\n🚨 CUSTOMER FIX OPERATION COMPLETE 🚨');