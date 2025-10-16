import { useTranslation } from 'react-i18next';
import Navigation from '@/components/Navigation';
import SEO from '@/components/SEO';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Users, Star, Heart, Compass } from 'lucide-react';
import { Link, useLocation } from 'wouter';
import { useEffect } from 'react';

export default function PurposeDrivenLeader() {
  const { t, ready, i18n } = useTranslation(['results', 'common']);
  const [location] = useLocation();

  // Detect language from URL
  const detectLanguageFromUrl = () => {
    if (location.startsWith('/es/')) return 'es';
    if (location.startsWith('/fr/')) return 'fr';
    return 'en';
  };

  // Set language based on URL
  useEffect(() => {
    const urlLanguage = detectLanguageFromUrl();
    if (i18n.language !== urlLanguage) {
      i18n.changeLanguage(urlLanguage);
    }
  }, [location, i18n]);

  if (!ready) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50">
      <SEO
        title="Purpose-Driven Leader - Ikigai Personality Type | Ikigain"
        description="Learn about the Purpose-Driven Leader Ikigai personality type. Discover strengths, challenges, and career paths for mission-driven individuals."
        canonical="https://www.ikigain.org/ikigai-types/purpose-driven-leader"
        keywords="purpose-driven leader, ikigai personality type, mission-driven work, leadership purpose, social impact careers"
      />
      
      <Navigation />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full mb-6">
            <Users className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">{t('individualTypes.purposeDrivenLeader.title')}</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            {t('individualTypes.purposeDrivenLeader.subtitle')}
          </p>
        </div>

        {/* Core Description */}
        <Card className="mb-8 border-l-4 border-l-green-500">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-2xl">
              <Compass className="h-6 w-6 text-green-500" />
              {t('individualTypes.purposeDrivenLeader.purposeSource')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-lg text-gray-700 leading-relaxed">
              {t('individualTypes.purposeDrivenLeader.purposeDescription')}
            </p>
          </CardContent>
        </Card>

        {/* Strengths and Challenges */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          <Card className="border-l-4 border-l-emerald-500">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Star className="h-5 w-5 text-emerald-500" />
                {t('individualTypes.purposeDrivenLeader.coreStrengths')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                {(t('individualTypes.purposeDrivenLeader.strengths', { returnObjects: true }) as any[]).map((strength: string, index: number) => (
                  <li key={index} className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-emerald-500 rounded-full mt-2 flex-shrink-0"></div>
                    <span>{strength}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-amber-500">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Heart className="h-5 w-5 text-amber-500" />
                {t('individualTypes.purposeDrivenLeader.growthAreas')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                {(t('individualTypes.purposeDrivenLeader.challenges', { returnObjects: true }) as any[]).map((challenge: string, index: number) => (
                  <li key={index} className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-amber-500 rounded-full mt-2 flex-shrink-0"></div>
                    <span>{challenge}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>

        {/* Call to Action - Prominent Position */}
        <Card className="mb-8 text-center bg-gradient-to-r from-green-500 to-emerald-500 text-white">
          <CardContent className="p-8">
            <h3 className="text-2xl font-bold mb-4">{t('individualTypes.purposeDrivenLeader.ctaTitle')}</h3>
            <p className="text-lg mb-6 opacity-90">
              {t('individualTypes.purposeDrivenLeader.ctaDescription')}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" className="bg-white text-green-600 hover:bg-gray-100">
                <Link href="/test">{t('individualTypes.purposeDrivenLeader.takeTest')}</Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-green-600">
                <Link href="/ikigai-type-test">{t('individualTypes.purposeDrivenLeader.freeTest')}</Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Career Paths */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-2xl">{t('individualTypes.purposeDrivenLeader.topCareerMatches')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-4 bg-green-50 rounded-lg">
                <div className="flex justify-between items-center mb-2">
                  <h4 className="font-semibold">NGO Director</h4>
                  <Badge variant="secondary">96% match</Badge>
                </div>
                <p className="text-sm text-gray-600 mb-2">$65,000 - $120,000</p>
                <p className="text-sm">Lead nonprofit organizations toward social impact.</p>
              </div>
              <div className="p-4 bg-green-50 rounded-lg">
                <div className="flex justify-between items-center mb-2">
                  <h4 className="font-semibold">Social Worker</h4>
                  <Badge variant="secondary">89% match</Badge>
                </div>
                <p className="text-sm text-gray-600 mb-2">$45,000 - $75,000</p>
                <p className="text-sm">Help individuals and communities overcome challenges.</p>
              </div>
              <div className="p-4 bg-green-50 rounded-lg">
                <div className="flex justify-between items-center mb-2">
                  <h4 className="font-semibold">Sustainability Consultant</h4>
                  <Badge variant="secondary">87% match</Badge>
                </div>
                <p className="text-sm text-gray-600 mb-2">$70,000 - $130,000</p>
                <p className="text-sm">Guide organizations toward sustainable practices.</p>
              </div>
              <div className="p-4 bg-green-50 rounded-lg">
                <div className="flex justify-between items-center mb-2">
                  <h4 className="font-semibold">Educator/Trainer</h4>
                  <Badge variant="secondary">84% match</Badge>
                </div>
                <p className="text-sm text-gray-600 mb-2">$50,000 - $90,000</p>
                <p className="text-sm">Teach and develop future leaders.</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Nurturing Tips */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-2xl">{t('individualTypes.purposeDrivenLeader.nurturingTitle')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {(t('individualTypes.purposeDrivenLeader.nurturingTips', { returnObjects: true }) as any[]).map((tip: any, index: number) => (
                <div key={index} className="p-4 bg-white rounded-lg border-l-4 border-green-500">
                  <h4 className="font-semibold mb-2">{tip.title}</h4>
                  <p className="text-gray-600">{tip.description}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

      </div>
    </div>
  );
}