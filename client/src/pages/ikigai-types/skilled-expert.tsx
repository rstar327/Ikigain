import { useTranslation } from 'react-i18next';
import Navigation from '@/components/Navigation';
import SEO from '@/components/SEO';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Target, Star, Wrench, Trophy } from 'lucide-react';
import { Link, useLocation } from 'wouter';
import { useEffect } from 'react';

export default function SkilledExpert() {
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
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
      <SEO
        title="Skilled Expert - Ikigai Personality Type | Ikigain"
        description="Learn about the Skilled Expert Ikigai personality type. Discover strengths, challenges, and career paths for vocation-driven individuals."
        canonical="https://www.ikigain.org/ikigai-types/skilled-expert"
        keywords="skilled expert, ikigai personality type, vocation-driven work, technical expertise, professional mastery"
      />
      
      <Navigation />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full mb-6">
            <Target className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">{t('individualTypes.skilledExpert.title')}</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            {t('individualTypes.skilledExpert.subtitle')}
          </p>
        </div>

        {/* Core Description */}
        <Card className="mb-8 border-l-4 border-l-blue-500">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-2xl">
              <Wrench className="h-6 w-6 text-blue-500" />
              {t('individualTypes.skilledExpert.purposeSource')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-lg text-gray-700 leading-relaxed">
              {t('individualTypes.skilledExpert.purposeDescription')}
            </p>
          </CardContent>
        </Card>

        {/* Strengths and Challenges */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          <Card className="border-l-4 border-l-green-500">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Star className="h-5 w-5 text-green-500" />
                {t('individualTypes.skilledExpert.coreStrengths')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                {(t('individualTypes.skilledExpert.strengths', { returnObjects: true }) as any[]).map((strength: string, index: number) => (
                  <li key={index} className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                    <span>{strength}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-amber-500">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Trophy className="h-5 w-5 text-amber-500" />
                {t('individualTypes.skilledExpert.growthAreas')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                {(t('individualTypes.skilledExpert.challenges', { returnObjects: true }) as any[]).map((challenge: string, index: number) => (
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
        <Card className="mb-8 text-center bg-gradient-to-r from-blue-500 to-indigo-500 text-white">
          <CardContent className="p-8">
            <h3 className="text-2xl font-bold mb-4">{t('individualTypes.skilledExpert.ctaTitle')}</h3>
            <p className="text-lg mb-6 opacity-90">
              {t('individualTypes.skilledExpert.ctaDescription')}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" className="bg-white text-blue-600 hover:bg-gray-100">
                <Link href="/test">{t('individualTypes.skilledExpert.takeTest')}</Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-blue-600">
                <Link href="/ikigai-type-test">{t('individualTypes.skilledExpert.freeTest')}</Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Career Paths */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-2xl">{t('individualTypes.skilledExpert.topCareerMatches')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-4 bg-blue-50 rounded-lg">
                <div className="flex justify-between items-center mb-2">
                  <h4 className="font-semibold">Software Engineer</h4>
                  <Badge variant="secondary">94% match</Badge>
                </div>
                <p className="text-sm text-gray-600 mb-2">$85,000 - $160,000</p>
                <p className="text-sm">Build robust and scalable software systems.</p>
              </div>
              <div className="p-4 bg-blue-50 rounded-lg">
                <div className="flex justify-between items-center mb-2">
                  <h4 className="font-semibold">Data Scientist</h4>
                  <Badge variant="secondary">91% match</Badge>
                </div>
                <p className="text-sm text-gray-600 mb-2">$95,000 - $180,000</p>
                <p className="text-sm">Analyze complex data to discover insights.</p>
              </div>
              <div className="p-4 bg-blue-50 rounded-lg">
                <div className="flex justify-between items-center mb-2">
                  <h4 className="font-semibold">Specialized Consultant</h4>
                  <Badge variant="secondary">87% match</Badge>
                </div>
                <p className="text-sm text-gray-600 mb-2">$75,000 - $150,000</p>
                <p className="text-sm">Provide expert advice in your domain.</p>
              </div>
              <div className="p-4 bg-blue-50 rounded-lg">
                <div className="flex justify-between items-center mb-2">
                  <h4 className="font-semibold">Researcher</h4>
                  <Badge variant="secondary">85% match</Badge>
                </div>
                <p className="text-sm text-gray-600 mb-2">$60,000 - $120,000</p>
                <p className="text-sm">Conduct in-depth research in your specialty.</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Nurturing Tips */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-2xl">{t('individualTypes.skilledExpert.nurturingTitle')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {(t('individualTypes.skilledExpert.nurturingTips', { returnObjects: true }) as any[]).map((tip: any, index: number) => (
                <div key={index} className="p-4 bg-white rounded-lg border-l-4 border-blue-500">
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