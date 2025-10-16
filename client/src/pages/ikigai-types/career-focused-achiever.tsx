import { useTranslation } from 'react-i18next';
import Navigation from '@/components/Navigation';
import SEO from '@/components/SEO';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, Star, Target, Award } from 'lucide-react';
import { Link, useLocation } from 'wouter';
import { useEffect } from 'react';

export default function CareerFocusedAchiever() {
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
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-50">
      <SEO
        title="Career-Focused Achiever - Ikigai Personality Type | Ikigain"
        description="Learn about the Career-Focused Achiever Ikigai personality type. Discover strengths, challenges, and career paths for profession-driven individuals."
        canonical="https://www.ikigain.org/ikigai-types/career-focused-achiever"
        keywords="career-focused achiever, ikigai personality type, profession-driven work, career success, achievement motivation"
      />
      
      <Navigation />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full mb-6">
            <TrendingUp className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">{t('individualTypes.careerFocusedAchiever.title')}</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            {t('individualTypes.careerFocusedAchiever.subtitle')}
          </p>
        </div>

        {/* Core Description */}
        <Card className="mb-8 border-l-4 border-l-purple-500">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-2xl">
              <Award className="h-6 w-6 text-purple-500" />
              {t('individualTypes.careerFocusedAchiever.purposeSource')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-lg text-gray-700 leading-relaxed">
              {t('individualTypes.careerFocusedAchiever.purposeDescription')}
            </p>
          </CardContent>
        </Card>

        {/* Strengths and Challenges */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          <Card className="border-l-4 border-l-green-500">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Star className="h-5 w-5 text-green-500" />
                {t('individualTypes.careerFocusedAchiever.coreStrengths')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                {(t('individualTypes.careerFocusedAchiever.strengths', { returnObjects: true }) as any[]).map((strength: string, index: number) => (
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
                <Target className="h-5 w-5 text-amber-500" />
                {t('individualTypes.careerFocusedAchiever.growthAreas')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                {(t('individualTypes.careerFocusedAchiever.challenges', { returnObjects: true }) as any[]).map((challenge: string, index: number) => (
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
        <Card className="mb-8 text-center bg-gradient-to-r from-purple-500 to-indigo-500 text-white">
          <CardContent className="p-8">
            <h3 className="text-2xl font-bold mb-4">{t('individualTypes.careerFocusedAchiever.ctaTitle')}</h3>
            <p className="text-lg mb-6 opacity-90">
              {t('individualTypes.careerFocusedAchiever.ctaDescription')}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" className="bg-white text-purple-600 hover:bg-gray-100">
                <Link href="/test">{t('individualTypes.careerFocusedAchiever.takeTest')}</Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-purple-600">
                <Link href="/ikigai-type-test">{t('individualTypes.careerFocusedAchiever.freeTest')}</Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Career Paths */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-2xl">{t('individualTypes.careerFocusedAchiever.topCareerMatches')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-4 bg-purple-50 rounded-lg">
                <div className="flex justify-between items-center mb-2">
                  <h4 className="font-semibold">Executive Leader</h4>
                  <Badge variant="secondary">95% match</Badge>
                </div>
                <p className="text-sm text-gray-600 mb-2">$150,000 - $500,000+</p>
                <p className="text-sm">Lead organizations toward growth and profitability.</p>
              </div>
              <div className="p-4 bg-purple-50 rounded-lg">
                <div className="flex justify-between items-center mb-2">
                  <h4 className="font-semibold">Sales Director</h4>
                  <Badge variant="secondary">91% match</Badge>
                </div>
                <p className="text-sm text-gray-600 mb-2">$80,000 - $200,000+</p>
                <p className="text-sm">Manage sales teams and achieve revenue targets.</p>
              </div>
              <div className="p-4 bg-purple-50 rounded-lg">
                <div className="flex justify-between items-center mb-2">
                  <h4 className="font-semibold">Investment Banker</h4>
                  <Badge variant="secondary">88% match</Badge>
                </div>
                <p className="text-sm text-gray-600 mb-2">$100,000 - $300,000+</p>
                <p className="text-sm">Facilitate complex financial transactions.</p>
              </div>
              <div className="p-4 bg-purple-50 rounded-lg">
                <div className="flex justify-between items-center mb-2">
                  <h4 className="font-semibold">Entrepreneur</h4>
                  <Badge variant="secondary">86% match</Badge>
                </div>
                <p className="text-sm text-gray-600 mb-2">Variable - Unlimited potential</p>
                <p className="text-sm">Create and grow your own businesses.</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Nurturing Tips */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-2xl">{t('individualTypes.careerFocusedAchiever.nurturingTitle')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {(t('individualTypes.careerFocusedAchiever.nurturingTips', { returnObjects: true }) as any[]).map((tip: any, index: number) => (
                <div key={index} className="p-4 bg-white rounded-lg border-l-4 border-purple-500">
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