import { useParams, Link, useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Navigation from "@/components/Navigation";
import IkigaiChart from "@/components/IkigaiChart";
import SEO from "@/components/SEO";
import { CheckCircle, Lock, Download } from "lucide-react";
import { useTranslation } from 'react-i18next';
import { useEffect, useState } from 'react';

// Map primary types to URL paths
const getTypeUrlPath = (primaryType: string) => {
  const typeMap: Record<string, string> = {
    // Quick Type Test results
    "The Builder": "builder",
    "The Explorer": "explorer", 
    "The Dreamer": "dreamer",
    "The Achiever": "achiever",
    "The Helper": "helper",
    "Builder": "builder",
    "Explorer": "explorer",
    "Dreamer": "dreamer", 
    "Achiever": "achiever",
    "Helper": "helper",
    // Main Ikigai Test results - map to their own dedicated pages
    "Creative Enthusiast": "creative-enthusiast",
    "Skilled Expert": "skilled-expert",
    "Purpose-Driven Leader": "purpose-driven-leader",
    "Career-Focused Achiever": "career-focused-achiever",
    "Balanced Explorer": "explorer" // This one can still map to explorer since it's similar
  };
  return typeMap[primaryType] || primaryType.toLowerCase().replace(/\s+/g, '-');
};

export default function Results() {
  const { sessionId } = useParams<{ sessionId: string }>();
  const { t, ready, i18n } = useTranslation(['results', 'common']);
  const [, setLocation] = useLocation();
  const [isLoading, setIsLoading] = useState(true);

  // All hooks must be declared before any conditional returns
  const { data: session } = useQuery<any>({
    queryKey: ["/api/test-sessions", sessionId],
    enabled: !!sessionId,
  });

  const { data: result } = useQuery({
    queryKey: ["/api/test-results", sessionId],
    queryFn: async () => {
      const response = await fetch(`/api/test-results/${sessionId}`);
      if (!response.ok) throw new Error("Failed to fetch test results");
      return response.json();
    },
    enabled: !!sessionId,
  });

  useEffect(() => {
    if (ready && i18n.hasResourceBundle(i18n.language, 'results') && i18n.hasResourceBundle(i18n.language, 'common')) {
      const timer = setTimeout(() => {
        setIsLoading(false);
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [ready, i18n]);

  // Helper function to translate dynamic content
  // Detect language from URL path
  const detectLanguageFromUrl = () => {
    const path = window.location.pathname;
    if (path.startsWith('/fr/')) return 'fr';
    if (path.startsWith('/es/')) return 'es';
    return 'en';
  };
  
  const language = detectLanguageFromUrl();

  if (!ready || isLoading) {
    return (
      <div className="min-h-screen bg-white">
        <Navigation />
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  if (!session || !result) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="flex items-center justify-center h-96">
          <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
        </div>
      </div>
    );
  }

  const scores = {
    passion: Math.round(parseFloat(result.passionScore)),
    mission: Math.round(parseFloat(result.missionScore)),
    vocation: Math.round(parseFloat(result.vocationScore)),
    profession: Math.round(parseFloat(result.professionScore)),
    overall: Math.round(parseFloat(result.overallScore)),
  };

  const hasPremium = session.hasPremiumAccess;

  // Helper function for navigation
  const handleUpgrade = () => {
    const path = language === 'fr' ? '/fr/upsell' : language === 'es' ? '/es/upsell' : '/upsell';
    setLocation(`${path}?sessionId=${sessionId}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <SEO 
        title={`${result.primaryType} - Your Ikigai Test Results | Ikigain`}
        description={`Discover your ${result.primaryType} personality type results. See your passion, mission, vocation, and profession scores with personalized career recommendations.`}
        keywords={`ikigai test results, ${result.primaryType.toLowerCase()}, personality type, career guidance, life purpose`}
        canonical={`/test-results/${sessionId}`}
      />
      <Navigation />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-primary to-secondary rounded-full mb-4">
            <CheckCircle className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">{t('results:title')}</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            {t('results:subtitle')}
          </p>
        </div>

        {/* Personality Type Card */}
        <Card className="mb-8 bg-gradient-to-r from-primary/5 to-secondary/5 border-0 shadow-xl">
          <CardHeader className="text-center pb-4">
            <CardTitle className="text-3xl font-bold text-gray-900">
              {t(`results:personalityTypes.${result.primaryType}`, { defaultValue: result.primaryType })}
            </CardTitle>
            <p className="text-lg text-gray-600">
              {t('results:overview.primaryType')}
            </p>
          </CardHeader>
          <CardContent className="text-center">
            <div className="inline-flex items-center px-4 py-2 bg-white rounded-full shadow-sm mb-4">
              <div className="w-3 h-3 bg-secondary rounded-full mr-2"></div>
              <span className="text-sm font-medium text-gray-700">
                {t('results:overview.secondaryType')}: {t(`results:personalityTypes.${session.results?.secondaryType}`, { defaultValue: session.results?.secondaryType })}
              </span>
            </div>
            <p className="text-gray-700 leading-relaxed max-w-3xl mx-auto mb-6">
              {result.recommendations?.description}
            </p>
            <div className="flex justify-center">
              <Link href={`/ikigai-types/${getTypeUrlPath(result.primaryType)}`}>
                <Button size="lg" className="bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white">
                  {t('results:learnMore', { type: t(`results:personalityTypes.${result.primaryType}`, { defaultValue: result.primaryType }) })}
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Premium Upsell - Prominent Position */}
        {!hasPremium && (
          <Card className="mb-8 bg-gradient-to-r from-primary to-secondary text-white shadow-xl border-0">
            <CardContent className="p-8 text-center">
              <Lock className="w-12 h-12 mx-auto mb-4 opacity-90" />
              <h3 className="text-2xl font-bold mb-2">{t('results:premium.title')}</h3>
              <div className="bg-white/10 rounded-lg p-4 mb-6">
                <div className="text-sm opacity-90 mb-3">🔓 You're missing out on:</div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-sm">
                  <div className="bg-white/20 rounded p-2">📊 Complete Analysis</div>
                  <div className="bg-white/20 rounded p-2">🎯 Career Roadmap</div>
                  <div className="bg-white/20 rounded p-2">📈 Growth Plan</div>
                </div>
              </div>
              <p className="text-lg mb-4 opacity-90">
                {t('results:premium.description')}
              </p>
              <div className="mb-6">
                <span className="text-sm opacity-75">Join 89% of users who unlock their full potential</span>
              </div>
              <Button 
                onClick={handleUpgrade}
                className="bg-white text-primary hover:bg-gray-100 px-8 py-3 rounded-lg font-semibold text-lg"
              >
                {t('common:upgrade')} - Unlock Everything
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Scores and Chart Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Ikigai Chart */}
          <Card className="shadow-xl border-0">
            <CardHeader>
              <CardTitle className="text-2xl font-bold text-center">{t('results:chart.title')}</CardTitle>
            </CardHeader>
            <CardContent>
              <IkigaiChart 
                scores={scores} 
                subcategoryScores={session.results?.subcategoryScores}
                primaryType={result.primaryType}
                secondaryType={session.results?.secondaryType}
                strengths={result.strengths}
                recommendations={result.recommendations}
              />
            </CardContent>
          </Card>

          {/* Score Breakdown */}
          <Card className="shadow-xl border-0">
            <CardHeader>
              <CardTitle className="text-2xl font-bold text-center">{t('results:pillars.title')}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {Object.entries(scores).filter(([key]) => key !== 'overall').map(([key, value]) => (
                <div key={key} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-semibold capitalize text-gray-700">{t(`results:pillars.${key}.title`)}</span>
                    <span className="text-2xl font-bold text-primary">{value}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div 
                      className="bg-gradient-to-r from-primary to-secondary h-3 rounded-full transition-all duration-1000 ease-out"
                      style={{ width: `${(value / 18) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
              <div className="pt-4 border-t">
                <div className="flex justify-between items-center">
                  <span className="text-xl font-bold text-gray-800">{t('results:overview.overallScore')}</span>
                  <span className="text-3xl font-bold text-primary">{scores.overall}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Strengths Section */}
        <Card className="mb-8 shadow-xl border-0">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-center">{t('results:strengths.title')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {result.strengths?.map((strength: any, index: number) => (
                <div key={index} className="bg-gradient-to-br from-primary/5 to-secondary/5 p-6 rounded-lg">
                  <div className="flex items-start space-x-3">
                    <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                      <span className="text-white font-bold text-sm">{index + 1}</span>
                    </div>
                    <p className="text-gray-700 leading-relaxed">{t(`results:strengths.${strength}`, { defaultValue: strength })}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
          
          {/* Premium Teaser - Hidden Strengths */}
          {!hasPremium && (
            <div className="mt-4 p-4 bg-gradient-to-r from-gray-100 to-gray-200 rounded-lg border-2 border-dashed border-gray-300 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-b from-transparent to-white opacity-60"></div>
              <div className="relative">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-semibold text-gray-700 flex items-center">
                    <Lock className="w-4 h-4 mr-2" />
                    3 Hidden Strengths (Premium Only)
                  </h4>
                  <span className="text-xs bg-primary text-white px-2 py-1 rounded-full">UNLOCK</span>
                </div>
                <div className="space-y-2 opacity-50">
                  <div className="h-4 bg-gray-300 rounded w-3/4 animate-pulse"></div>
                  <div className="h-4 bg-gray-300 rounded w-1/2 animate-pulse"></div>
                  <div className="h-4 bg-gray-300 rounded w-5/6 animate-pulse"></div>
                </div>
                <p className="text-xs text-gray-500 mt-2">Premium members discover their complete strength profile...</p>
              </div>
            </div>
          )}
        </Card>

        {/* Recommendations Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Career Recommendations */}
          <Card className="shadow-xl border-0">
            <CardHeader>
              <CardTitle className="text-2xl font-bold text-center">{t('results:careers.title')}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                {result.recommendations?.careers.map((career: any, index: number) => (
                  <div key={index} className="bg-gradient-to-r from-primary/10 to-secondary/10 p-4 rounded-lg text-center">
                    <span className="font-semibold text-gray-800">{t(`results:careers.${career}`, { defaultValue: career })}</span>
                  </div>
                ))}
              </div>
            </CardContent>
            
            {/* Premium Teaser - Additional Careers */}
            {!hasPremium && (
              <div className="mt-4 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border-2 border-dashed border-blue-200 relative">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-semibold text-blue-700 flex items-center">
                    <Lock className="w-4 h-4 mr-2" />
                    7 Additional Career Matches
                  </h4>
                  <span className="text-xs bg-blue-600 text-white px-2 py-1 rounded-full">87% Match</span>
                </div>
                <div className="grid grid-cols-2 gap-2 opacity-60">
                  <div className="bg-white p-2 rounded border">
                    <div className="h-3 bg-blue-300 rounded w-4/5 mb-1"></div>
                    <div className="h-2 bg-gray-200 rounded w-3/5"></div>
                  </div>
                  <div className="bg-white p-2 rounded border">
                    <div className="h-3 bg-blue-300 rounded w-3/4 mb-1"></div>
                    <div className="h-2 bg-gray-200 rounded w-4/5"></div>
                  </div>
                </div>
                <p className="text-xs text-blue-600 mt-2 font-medium">Including high-growth companies actively hiring your type...</p>
              </div>
            )}
          </Card>

          {/* Action Steps */}
          <Card className="shadow-xl border-0">
            <CardHeader>
              <CardTitle className="text-2xl font-bold text-center">{t('results:actions.title')}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {result.recommendations?.actions.map((action: any, index: number) => (
                  <div key={index} className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-secondary rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                      <CheckCircle className="w-4 h-4 text-white" />
                    </div>
                    <p className="text-gray-700">{t(`results:actions.${action}`, { defaultValue: action })}</p>
                  </div>
                ))}
              </div>
            </CardContent>
            
            {/* Premium Teaser - Development Roadmap */}
            {!hasPremium && (
              <div className="mt-4 p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border-2 border-dashed border-green-200 relative">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-semibold text-green-700 flex items-center">
                    <Lock className="w-4 h-4 mr-2" />
                    Personalized 90-Day Development Plan
                  </h4>
                  <span className="text-xs bg-green-600 text-white px-2 py-1 rounded-full">NEW</span>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center opacity-60">
                    <div className="w-6 h-6 bg-green-300 rounded-full mr-3 animate-pulse"></div>
                    <div className="h-3 bg-green-200 rounded w-2/3"></div>
                  </div>
                  <div className="flex items-center opacity-60">
                    <div className="w-6 h-6 bg-green-300 rounded-full mr-3 animate-pulse"></div>
                    <div className="h-3 bg-green-200 rounded w-1/2"></div>
                  </div>
                  <div className="flex items-center opacity-60">
                    <div className="w-6 h-6 bg-green-300 rounded-full mr-3 animate-pulse"></div>
                    <div className="h-3 bg-green-200 rounded w-3/4"></div>
                  </div>
                </div>
                <p className="text-xs text-green-600 mt-2 font-medium">Week-by-week action plan tailored to your Creative Enthusiast type...</p>
              </div>
            )}
          </Card>
        </div>

        {/* Final CTA - Bottom */}
        {!hasPremium && (
          <Card className="mb-8 text-center bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white shadow-2xl border-0">
            <CardContent className="p-10">
              <div className="max-w-2xl mx-auto">
                <h3 className="text-3xl font-bold mb-4">🚀 Ready to Unlock Your Full Potential?</h3>
                <p className="text-xl mb-6 opacity-95 leading-relaxed">
                  You've seen what you're capable of. Now discover the complete roadmap to your ideal career and life purpose.
                </p>
                <div className="bg-white/10 rounded-xl p-6 mb-8">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm mb-4">
                    <div className="bg-white/20 rounded-lg p-4">
                      <div className="text-2xl mb-2">📈</div>
                      <div className="font-semibold">Complete Analysis</div>
                      <div className="opacity-90">Full personality breakdown + hidden strengths</div>
                    </div>
                    <div className="bg-white/20 rounded-lg p-4">
                      <div className="text-2xl mb-2">🎯</div>
                      <div className="font-semibold">Career Roadmap</div>
                      <div className="opacity-90">15+ career matches + salary insights</div>
                    </div>
                    <div className="bg-white/20 rounded-lg p-4">
                      <div className="text-2xl mb-2">📋</div>
                      <div className="font-semibold">Action Plan</div>
                      <div className="opacity-90">90-day step-by-step development plan</div>
                    </div>
                  </div>
                  <div className="text-center">
                    <span className="bg-yellow-400 text-black px-3 py-1 rounded-full font-bold text-sm">
                      ⚡ Limited Time: 50% OFF
                    </span>
                  </div>
                </div>
                <div className="space-y-4">
                  <Button 
                    onClick={handleUpgrade}
                    className="bg-white text-indigo-600 hover:bg-gray-100 px-10 py-4 rounded-xl font-bold text-lg shadow-lg transform hover:scale-105 transition-all duration-200"
                  >
                    🔓 Unlock Premium Results - Just $2.95
                  </Button>
                  <div className="text-sm opacity-75">
                    ✅ 30-day money-back guarantee • ✅ Instant access • ✅ Join 10,000+ users
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Action Buttons */}
        <div className="flex justify-center space-x-4 mt-8">
          <Button asChild variant="outline" className="px-6 py-3">
            <Link href="/test">{t('common:retakeTest')}</Link>
          </Button>
          <Button asChild variant="outline" className="px-6 py-3">
            <Link href={`/dashboard?session=${sessionId}`}>{t('common:dashboard')}</Link>
          </Button>
          <Button className="px-6 py-3 bg-primary hover:bg-primary/90">
            <Download className="w-4 h-4 mr-2" />
            {t('common:downloadReport')}
          </Button>
        </div>
      </div>
    </div>
  );
}