import { useQuery } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Navigation from "@/components/Navigation";
import SEO from "@/components/SEO";
import { CheckCircle, BookOpen, Brain, Award } from "lucide-react";
import { getUpgradePrice, getTranslatedTierDisplayName, hasAvailableUpgrades, getNextUpgradeTier, type PremiumTier } from "@shared/access-control";
import { checkoutAnalytics, extractTierFromUrl, getTierAmount } from "@/lib/checkout-analytics";

// Helper function to translate tier features with fallbacks
const getTranslatedTierFeatures = (tier: PremiumTier, t: any): string[] => {
  const safeT = (key: string, fallback: string) => {
    try {
      const translated = t?.(key);
      return translated && translated !== key ? translated : fallback;
    } catch {
      return fallback;
    }
  };

  switch (tier) {
    case 'roadmap':
      return [
        safeT('detailedCareerRoadmaps', 'Detailed Career Roadmaps'),
        safeT('highFitCareerMatches', 'High-Fit Career Matches'), 
        safeT('skillsGapAnalysis', 'Skills Gap Analysis'),
        safeT('stepByStepCareerGuidance', 'Step-by-Step Career Guidance')
      ];
    case 'personality':
      return [
        safeT('completePersonalityProfile', 'Complete Personality Profile'),
        safeT('cognitiveStyleAnalysis', 'Cognitive Style Analysis'),
        safeT('workStyleAssessment', 'Work Style Assessment'),
        safeT('communicationPreferences', 'Communication Preferences'),
        safeT('stressManagementStrategies', 'Stress Management Strategies')
      ];
    case 'blueprint':
      return [
        safeT('personalTransformationPlan', 'Personal Transformation Plan'),
        safeT('dailyHabitsFramework', 'Daily Habits Framework'),
        safeT('confidenceBuildingStrategies', 'Confidence Building Strategies'),
        safeT('interviewPreparation', 'Interview Preparation'),
        safeT('networkingStrategy', 'Networking Strategy'),
        safeT('aiMentorGuidance', 'AI Mentor Guidance'),
        safeT('marketInsights', 'Market Insights'),
        safeT('developmentAreas', 'Development Areas')
      ];
    default:
      return [];
  }
};

// Helper function to translate personality type names with fallbacks
const getTranslatedPersonalityType = (type: string, t: any): string => {
  const safeT = (key: string, fallback: string) => {
    try {
      const translated = t?.(key);
      return translated && translated !== key ? translated : fallback;
    } catch {
      return fallback;
    }
  };

  const typeMap: { [key: string]: string } = {
    'Creative Enthusiast': safeT('creativeEnthusiast', 'Creative Enthusiast'),
    'Skilled Expert': safeT('skilledExpert', 'Skilled Expert'),
    'Purpose-Driven Leader': safeT('purposeDrivenLeader', 'Purpose-Driven Leader'),
    'Career-Focused Achiever': safeT('careerFocusedAchiever', 'Career-Focused Achiever'),
    'Balanced Integrator': safeT('balancedIntegrator', 'Balanced Integrator')
  };
  
  return typeMap[type] || type;
};

// Helper function to translate personality type descriptions with fallbacks
const getTranslatedDescription = (type: string, t: any): string => {
  const safeT = (key: string, fallback: string) => {
    try {
      const translated = t?.(key);
      return translated && translated !== key ? translated : fallback;
    } catch {
      return fallback;
    }
  };

  const descriptionMap: { [key: string]: string } = {
    'Creative Enthusiast': safeT('creativeEnthusiastDescription', 'Creative and passionate individuals who thrive on innovation'),
    'Skilled Expert': safeT('skilledExpertDescription', 'Knowledgeable professionals who excel in their chosen field'),
    'Purpose-Driven Leader': safeT('purposeDrivenLeaderDescription', 'Inspirational leaders focused on meaningful impact'),
    'Career-Focused Achiever': safeT('careerFocusedAchieverDescription', 'Ambitious professionals driven by career success'),
    'Balanced Integrator': safeT('balancedIntegratorDescription', 'Well-rounded individuals who integrate multiple aspects of life')
  };
  
  return descriptionMap[type] || safeT('completeAnalysisForDetailedInsights', 'Complete analysis for detailed insights');
};

export default function UpsellSimple() {
  const { t, ready, i18n } = useTranslation(['common', 'landing'], { useSuspense: false });
  const urlParams = new URLSearchParams(window.location.search);
  const sessionId = urlParams.get('sessionId') || urlParams.get('session');
  const tier = urlParams.get('tier') || 'blueprint';
  const [isLoading, setIsLoading] = useState(true);
  
  // Detect language from URL path
  const detectLanguageFromUrl = () => {
    const path = window.location.pathname;
    if (path.startsWith('/fr/')) return 'fr';
    if (path.startsWith('/es/')) return 'es';
    return 'en';
  };
  
  const language = detectLanguageFromUrl();
  
  // Change language when component mounts if URL language is different
  useEffect(() => {
    if (ready && i18n.language !== language) {
      i18n.changeLanguage(language);
    }
  }, [language, ready, i18n]);
  
  // Always call useQuery hooks at the top level - NEVER after conditional returns
  const { data: result } = useQuery({
    queryKey: ["/api/test-results", sessionId],
    queryFn: async () => {
      const response = await fetch(`/api/test-results/${sessionId}`);
      if (!response.ok) throw new Error("Failed to fetch test results");
      return response.json();
    },
    enabled: !!sessionId,
  });

  const { data: session } = useQuery({
    queryKey: ["/api/test-sessions", sessionId],
    queryFn: async () => {
      const response = await fetch(`/api/test-sessions/${sessionId}`);
      if (!response.ok) throw new Error("Failed to fetch test session");
      return response.json();
    },
    enabled: !!sessionId,
  });
  
  useEffect(() => {
    // Much faster loading for production
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 200);
    
    return () => clearTimeout(timer);
  }, []);

  // Track upsell view for analytics
  useEffect(() => {
    if (sessionId && result && session) {
      const currentTier = extractTierFromUrl() || tier;
      const amount = getTierAmount(currentTier as 'roadmap' | 'personality' | 'blueprint');
      
      checkoutAnalytics.trackUpsellView({
        sessionId,
        userId: session.userId,
        email: session.email,
        productType: 'premium_tier',
        productId: currentTier,
        tier: currentTier as 'roadmap' | 'personality' | 'blueprint',
        amount,
        currency: 'USD'
      });
    }
  }, [sessionId, result, session, tier]);
  
  if (isLoading) {
    return (
      <div className="min-h-screen bg-white">
        <Navigation />
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Initializing...</p>
          </div>
        </div>
      </div>
    );
  }


  if (!sessionId) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4">Premium Analysis</h2>
            <p className="text-gray-600 mb-4">Session ID required to continue</p>
            <Button onClick={() => window.location.href = '/test'}>Take Test</Button>
          </div>
        </div>
      </div>
    );
  }

  // Debug logging for production
  console.log('UpsellSimple Debug:', { sessionId, result: !!result, session: !!session, isLoading });

  if (!result || !session) {
    return (
      <div className="min-h-screen bg-white">
        <Navigation />
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <div className="animate-spin w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full mx-auto mb-4" />
            <p className="text-gray-600">Loading Premium Analysis...</p>
            {sessionId && (
              <p className="text-sm text-gray-500 mt-2">Session: {sessionId}</p>
            )}
            <div className="mt-4 text-xs text-gray-400">
              <p>Result: {result ? 'Loaded' : 'Loading...'}</p>
              <p>Session: {session ? 'Loaded' : 'Loading...'}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Get current tier and calculate upgrade pricing
  const currentTier: PremiumTier = session?.premiumTier || null;
  const hasUpgrades = hasAvailableUpgrades(currentTier);
  const nextTier = getNextUpgradeTier(currentTier);
  // Use the tier parameter from URL if provided, otherwise use next tier
  const targetTier: PremiumTier = (tier as PremiumTier) || nextTier || 'blueprint';
  const upgradePrice = getUpgradePrice(currentTier, targetTier);
  const targetTierName = getTranslatedTierDisplayName(targetTier, t);

  return (
    <div className="min-h-screen bg-background">
      <SEO
        title="Premium Ikigai Analysis - Upgrade Your Results | Ikigain"
        description="Unlock your complete Ikigai potential with premium career analysis, roadmaps, and personality insights. Choose from three comprehensive upgrade tiers."
        canonical={`https://ikigain.org/upsell?sessionId=${sessionId}`}
        keywords="premium ikigai analysis, career roadmap, personality insights, ikigai upgrade, life purpose guidance"
      />
      <Navigation />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              {t('upsell.hero.title', { defaultValue: 'Unlock Your Full Ikigai Potential' })}
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              {t('upsell.hero.subtitle', { defaultValue: 'Get comprehensive career insights and personalized guidance' })}
            </p>
          </div>

          <Card className="mb-8 shadow-xl border-0">
            <CardHeader className="bg-gradient-to-r from-primary to-secondary text-white">
              <CardTitle className="text-2xl font-bold text-center">
                {t('title', { defaultValue: 'Your Current Results' })}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="text-center">
                <h3 className="text-xl font-semibold mb-2">{t('personalityType', { defaultValue: 'Primary Type' })}: {getTranslatedPersonalityType(result.primaryType, t)}</h3>
                <p className="text-gray-600 mb-4">
                  {getTranslatedDescription(result.primaryType, t)}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Three-Tier Pricing */}
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              {!hasUpgrades && currentTier === 'blueprint' ? t('allFeaturesUnlocked', { defaultValue: 'You Have The Highest Tier' }) : 
               currentTier ? `${t('upgradeFor', { defaultValue: 'Upgrade to' })} ${targetTierName}` : t('chooseYourAnalysisLevel', { defaultValue: 'Choose Your Analysis Level' })}
            </h2>
            <p className="text-lg text-gray-600">
              {!hasUpgrades && currentTier === 'blueprint' ? t('allFeaturesUnlocked', { defaultValue: 'All premium features are unlocked for you' }) :
               currentTier ? `${t('unlockAdditionalFeatures', { defaultValue: 'Unlock additional features for only' })} ${upgradePrice}` : t('selectPackageBestFits', { defaultValue: 'Select the package that best fits your needs' })}
            </p>
          </div>

          {/* Show upgrade-specific pricing for existing users */}
          {currentTier && hasUpgrades && (
            <div className={`mx-auto mb-8 ${currentTier === 'roadmap' ? 'max-w-4xl' : 'max-w-lg'}`}>
              <div className={`${currentTier === 'roadmap' ? 'grid grid-cols-1 md:grid-cols-2 gap-6' : ''}`}>
                {/* Personality Tier Upgrade Card (for roadmap users) */}
                {currentTier === 'roadmap' && (
                  <Card className="shadow-xl border-2 border-purple-200 hover:border-purple-300 transition-colors">
                    <CardHeader className="text-center">
                      <CardTitle className="text-xl font-bold flex items-center justify-center gap-2">
                        <Brain className="h-6 w-6 text-purple-600" />
                        {getTranslatedTierDisplayName('personality', t)}
                      </CardTitle>
                      <div className="text-3xl font-bold text-purple-600">
                        {getUpgradePrice(currentTier, 'personality')} <span className="text-sm text-gray-500">upgrade</span>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="text-center mb-4">
                        <p className="text-sm text-gray-600">{t('newFeaturesYoullUnlock', { defaultValue: 'New features you\'ll unlock:' })}</p>
                      </div>
                      <ul className="space-y-2">
                        {getTranslatedTierFeatures('personality', t).map((feature, index) => (
                          <li key={index} className="flex items-center gap-2">
                            <CheckCircle className="h-4 w-4 text-green-600 flex-shrink-0" />
                            <span className="text-sm">{feature}</span>
                          </li>
                        ))}
                      </ul>
                      <Button 
                        onClick={() => {
                          const priceNumber = parseFloat(getUpgradePrice(currentTier, 'personality').replace('$', ''));
                          window.location.href = `/checkout?sessionId=${sessionId}&offer=personality&price=${priceNumber}`;
                        }}
                        className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2 mt-4"
                      >
                        {t('upsell.buttons.upgrade', { defaultValue: 'Upgrade Now' })}
                      </Button>
                    </CardContent>
                  </Card>
                )}

                {/* Blueprint Tier Upgrade Card (for roadmap and personality users) */}
                <Card className="shadow-xl border-2 border-green-200 hover:border-green-300 transition-colors">
                  <CardHeader className="text-center">
                    <CardTitle className="text-xl font-bold flex items-center justify-center gap-2">
                      <Award className="h-6 w-6 text-green-600" />
                      {getTranslatedTierDisplayName('blueprint', t)}
                    </CardTitle>
                    <div className="text-3xl font-bold text-green-600">
                      {getUpgradePrice(currentTier, 'blueprint')} <span className="text-sm text-gray-500">upgrade</span>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="text-center mb-4">
                      <p className="text-sm text-gray-600">{t('newFeaturesYoullUnlock', { defaultValue: 'New features you\'ll unlock:' })}</p>
                    </div>
                    <ul className="space-y-2">
                      {getTranslatedTierFeatures('blueprint', t).map((feature, index) => (
                        <li key={index} className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-green-600 flex-shrink-0" />
                          <span className="text-sm">{feature}</span>
                        </li>
                      ))}
                    </ul>
                    <Button 
                      onClick={() => {
                        const priceNumber = parseFloat(getUpgradePrice(currentTier, 'blueprint').replace('$', ''));
                        window.location.href = `/checkout?sessionId=${sessionId}&offer=blueprint&price=${priceNumber}`;
                      }}
                      className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-2 mt-4"
                    >
                      {t('upsell.buttons.upgrade', { defaultValue: 'Upgrade Now' })}
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}

          {/* Show completion message for users who already have the highest tier */}
          {currentTier === 'blueprint' && (
            <div className="max-w-lg mx-auto mb-8">
              <Card className="shadow-xl border-2 border-green-200 bg-green-50">
                <CardHeader className="text-center">
                  <CardTitle className="text-xl font-bold flex items-center justify-center gap-2 text-green-800">
                    <Award className="h-6 w-6 text-green-600" />
                    {t('allFeaturesUnlocked', { defaultValue: 'You Have The Highest Tier' })}
                  </CardTitle>
                  <p className="text-green-700 mt-2">{t('allFeaturesUnlocked', { defaultValue: 'All premium features are unlocked' })}</p>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="text-center mb-4">
                    <p className="text-sm text-green-700">{t('enjoyAllPremiumFeatures', { defaultValue: 'Enjoy all premium features:' })}</p>
                  </div>
                  <ul className="space-y-2">
                    {getTranslatedTierFeatures('blueprint', t).map((feature, index) => (
                      <li key={index} className="flex items-start">
                        <CheckCircle className="w-4 h-4 text-green-500 mr-2 mt-0.5" />
                        <span className="text-sm text-green-800">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Button 
                    onClick={() => window.location.href = `/premium-results/${sessionId}`}
                    className="w-full mt-4 bg-green-600 hover:bg-green-700 text-white font-semibold"
                  >
                    {t('backToResults', { defaultValue: 'Back to Results' })}
                  </Button>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Show full pricing for new users */}
          {!currentTier && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              {/* Career Roadmap Guide */}
              <Card className="shadow-lg border-2 border-blue-200 hover:border-blue-300 transition-colors">
                <CardHeader className="text-center">
                  <CardTitle className="text-xl font-bold flex items-center justify-center gap-2">
                    <BookOpen className="h-6 w-6 text-blue-600" />
                    {t('careerRoadmapGuide')}
                  </CardTitle>
                  <div className="text-3xl font-bold text-blue-600">$2.95</div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <ul className="space-y-2">
                    <li className="flex items-start">
                      <CheckCircle className="w-4 h-4 text-green-500 mr-2 mt-0.5" />
                      <span className="text-sm">{t('monthCareerRoadmap')}</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="w-4 h-4 text-green-500 mr-2 mt-0.5" />
                      <span className="text-sm">{t('stepByStepActionPlan')}</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="w-4 h-4 text-green-500 mr-2 mt-0.5" />
                      <span className="text-sm">{t('industrySpecificNetworking')}</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="w-4 h-4 text-green-500 mr-2 mt-0.5" />
                      <span className="text-sm">{t('interviewPreparation')}</span>
                    </li>
                  </ul>
                  <Button 
                    onClick={() => window.location.href = `/checkout?sessionId=${sessionId}&offer=roadmap&price=2.95`}
                    className="w-full mt-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold min-h-[3rem] py-3 px-4 text-center leading-tight"
                  >
                    <span className="whitespace-normal break-words">
                      {t('getCareerRoadmap')}
                    </span>
                  </Button>
                </CardContent>
              </Card>

              {/* Personality Deep Dive */}
              <Card className="shadow-xl border-2 border-purple-200 hover:border-purple-300 transition-colors relative">
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 z-10">
                  <span className="bg-purple-600 text-white px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap shadow-lg">
                    {t('mostPopular')}
                  </span>
                </div>
                <CardHeader className="text-center">
                  <CardTitle className="text-xl font-bold flex items-center justify-center gap-2">
                    <Brain className="h-6 w-6 text-purple-600" />
                    {t('personalityDeepDive')}
                  </CardTitle>
                  <div className="text-3xl font-bold text-purple-600">$4.95</div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <ul className="space-y-2">
                    <li className="flex items-start">
                      <CheckCircle className="w-4 h-4 text-green-500 mr-2 mt-0.5" />
                      <span className="text-sm">{t('completePersonalityProfile')}</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="w-4 h-4 text-green-500 mr-2 mt-0.5" />
                      <span className="text-sm">{t('cognitiveStyleAnalysis')}</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="w-4 h-4 text-green-500 mr-2 mt-0.5" />
                      <span className="text-sm">{t('communicationPreferences')}</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="w-4 h-4 text-green-500 mr-2 mt-0.5" />
                      <span className="text-sm">{t('stressManagementStrategies')}</span>
                    </li>
                  </ul>
                  <Button 
                    onClick={() => window.location.href = `/checkout?sessionId=${sessionId}&offer=personality&price=4.95`}
                    className="w-full mt-4 bg-purple-600 hover:bg-purple-700 text-white font-semibold min-h-[3rem] py-3 px-4 text-center leading-tight"
                  >
                    <span className="whitespace-normal break-words">
                      {t('getPersonalityDeepDive')}
                    </span>
                  </Button>
                </CardContent>
              </Card>

              {/* Success Blueprint */}
              <Card className="shadow-lg border-2 border-green-200 hover:border-green-300 transition-colors">
                <CardHeader className="text-center">
                  <CardTitle className="text-xl font-bold flex items-center justify-center gap-2">
                    <Award className="h-6 w-6 text-green-600" />
                    {t('successBlueprint')}
                  </CardTitle>
                  <div className="text-3xl font-bold text-green-600">$9.95</div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <ul className="space-y-2">
                    <li className="flex items-start">
                      <CheckCircle className="w-4 h-4 text-green-500 mr-2 mt-0.5" />
                      <span className="text-sm">{t('personalTransformationPlan')}</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="w-4 h-4 text-green-500 mr-2 mt-0.5" />
                      <span className="text-sm">{t('dailyHabitsFramework')}</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="w-4 h-4 text-green-500 mr-2 mt-0.5" />
                      <span className="text-sm">{t('confidenceBuildingStrategies')}</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="w-4 h-4 text-green-500 mr-2 mt-0.5" />
                      <span className="text-sm">{t('networkingStrategy')}</span>
                    </li>
                  </ul>
                  <Button 
                    onClick={() => window.location.href = `/checkout?sessionId=${sessionId}&offer=blueprint&price=9.95`}
                    className="w-full mt-4 bg-green-600 hover:bg-green-700 text-white font-semibold min-h-[3rem] py-3 px-4 text-center leading-tight"
                  >
                    <span className="whitespace-normal break-words">
                      {t('getSuccessBlueprint')}
                    </span>
                  </Button>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Dashboard Option */}
          <div className="text-center">
            <p className="text-gray-600 mb-4">{t('skipToDashboardDescription')}</p>
            <Button 
              onClick={() => window.location.href = `/dashboard?session=${sessionId}`}
              variant="outline"
              className="px-8 py-3 text-lg font-semibold hover:bg-gray-100"
            >
              {t('skipToDashboard')}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}