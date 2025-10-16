// Premium tier access control
export type PremiumTier = 'roadmap' | 'personality' | 'blueprint' | null;

export interface PremiumFeatures {
  // Career Roadmap Guide ($2.95)
  careerRoadmap: boolean;
  careerMatches: boolean;
  skillGaps: boolean;
  
  // Personality Deep Dive ($4.95) - includes roadmap features
  personalityProfile: boolean;
  cognitiveStyle: boolean;
  workStyleAnalysis: boolean;
  communicationGuide: boolean;
  stressManagement: boolean;
  
  // Success Blueprint ($9.95) - includes all features
  transformationPlan: boolean;
  dailyHabits: boolean;
  confidenceBuilding: boolean;
  interviewPrep: boolean;
  networkingStrategy: boolean;
  aiMentor: boolean;
  marketInsights: boolean;
  developmentAreas: boolean;
}

export function getFeatureAccess(tier: PremiumTier): PremiumFeatures {
  const baseFeatures: PremiumFeatures = {
    careerRoadmap: false,
    careerMatches: false,
    skillGaps: false,
    personalityProfile: false,
    cognitiveStyle: false,
    workStyleAnalysis: false,
    communicationGuide: false,
    stressManagement: false,
    transformationPlan: false,
    dailyHabits: false,
    confidenceBuilding: false,
    interviewPrep: false,
    networkingStrategy: false,
    aiMentor: false,
    marketInsights: false,
    developmentAreas: false,
  };

  switch (tier) {
    case 'roadmap':
      return {
        ...baseFeatures,
        careerRoadmap: true,
        careerMatches: true,
        skillGaps: true,
      };
    
    case 'personality':
      return {
        ...baseFeatures,
        // Roadmap features
        careerRoadmap: true,
        careerMatches: true,
        skillGaps: true,
        // Personality features
        personalityProfile: true,
        cognitiveStyle: true,
        workStyleAnalysis: true,
        communicationGuide: true,
        stressManagement: true,
      };
    
    case 'blueprint':
      return {
        ...baseFeatures,
        // All features enabled
        careerRoadmap: true,
        careerMatches: true,
        skillGaps: true,
        personalityProfile: true,
        cognitiveStyle: true,
        workStyleAnalysis: true,
        communicationGuide: true,
        stressManagement: true,
        transformationPlan: true,
        dailyHabits: true,
        confidenceBuilding: true,
        interviewPrep: true,
        networkingStrategy: true,
        aiMentor: true,
        marketInsights: true,
        developmentAreas: true,
      };
    
    default:
      return baseFeatures;
  }
}

export function getTierDisplayName(tier: PremiumTier): string {
  switch (tier) {
    case 'roadmap':
      return 'Career Roadmap Guide';
    case 'personality':
      return 'Personality Deep Dive';
    case 'blueprint':
      return 'Success Blueprint';
    default:
      return 'Basic';
  }
}

// Translated version that accepts a translation function  
export function getTranslatedTierDisplayName(tier: PremiumTier, t?: any): string {
  const safeT = (key: string, fallback: string) => {
    try {
      const translated = t?.(key);
      return translated && translated !== key && translated !== undefined ? translated : fallback;
    } catch {
      return fallback;
    }
  };

  switch (tier) {
    case 'roadmap':
      return safeT('careerRoadmapGuide', 'Career Roadmap Guide');
    case 'personality':
      return safeT('personalityDeepDive', 'Personality Deep Dive');
    case 'blueprint':
      return safeT('successBlueprint', 'Success Blueprint');
    default:
      return safeT('basic', 'Basic');
  }
}

export function getTierPrice(tier: PremiumTier): string {
  switch (tier) {
    case 'roadmap':
      return '$2.95';
    case 'personality':
      return '$4.95';
    case 'blueprint':
      return '$9.95';
    default:
      return 'Free';
  }
}

export function getTierColor(tier: PremiumTier): string {
  switch (tier) {
    case 'roadmap':
      return 'blue';
    case 'personality':
      return 'purple';
    case 'blueprint':
      return 'green';
    default:
      return 'gray';
  }
}

export function getUpgradeOptions(currentTier: PremiumTier): PremiumTier[] {
  const tiers: PremiumTier[] = ['roadmap', 'personality', 'blueprint'];
  const currentIndex = tiers.indexOf(currentTier);
  return tiers.slice(currentIndex + 1);
}

export function hasAvailableUpgrades(currentTier: PremiumTier): boolean {
  return getUpgradeOptions(currentTier).length > 0;
}

export function getNextUpgradeTier(currentTier: PremiumTier): PremiumTier | null {
  const upgradeOptions = getUpgradeOptions(currentTier);
  return upgradeOptions.length > 0 ? upgradeOptions[0] : null;
}

export function getUpgradePrice(currentTier: PremiumTier, targetTier: PremiumTier): string {
  const prices = {
    roadmap: 2.95,
    personality: 4.95,
    blueprint: 9.95
  };
  
  if (!currentTier) return getTierPrice(targetTier);
  
  const currentPrice = (currentTier && prices[currentTier]) || 0;
  const targetPrice = (targetTier && prices[targetTier]) || 0;
  const difference = targetPrice - currentPrice;
  
  return `$${difference.toFixed(2)}`;
}

export function getTierFeatures(tier: PremiumTier): string[] {
  switch (tier) {
    case 'roadmap':
      return [
        'Detailed career roadmaps',
        'High-fit career matches',
        'Skills gap analysis',
        'Step-by-step career guidance'
      ];
    case 'personality':
      return [
        'Complete personality profile',
        'Cognitive style analysis',
        'Work style assessment',
        'Communication preferences',
        'Stress management strategies'
      ];
    case 'blueprint':
      return [
        'Personal transformation plan',
        'Daily habits framework',
        'Confidence building strategies',
        'Interview preparation',
        'Networking strategy',
        'AI mentor guidance',
        'Market insights',
        'Development areas'
      ];
    default:
      return [];
  }
}