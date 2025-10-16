import { useTranslation } from 'react-i18next';
import Navigation from '@/components/Navigation';
import SEO from '@/components/SEO';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Heart, Star, Palette, Lightbulb } from 'lucide-react';
import { Link, useLocation } from 'wouter';
import { useEffect } from 'react';

export default function CreativeEnthusiast() {
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
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-pink-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-pink-50">
      <SEO
        title="Creative Enthusiast - Ikigai Personality Type | Ikigain"
        description="Learn about the Creative Enthusiast Ikigai personality type. Discover strengths, challenges, and career paths for passion-driven individuals."
        canonical="https://www.ikigain.org/ikigai-types/creative-enthusiast"
        keywords="creative enthusiast, ikigai personality type, creative careers, passion-driven work, artistic personality"
      />
      
      <Navigation />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-red-500 to-pink-500 rounded-full mb-6">
            <Heart className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">{t('individualTypes.creativeEnthusiast.title')}</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            {t('individualTypes.creativeEnthusiast.subtitle')}
          </p>
        </div>

        {/* Core Description */}
        <Card className="mb-8 border-l-4 border-l-red-500">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-2xl">
              <Palette className="h-6 w-6 text-red-500" />
              {t('individualTypes.creativeEnthusiast.purposeSource')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-lg text-gray-700 leading-relaxed">
              {t('individualTypes.creativeEnthusiast.purposeDescription')}
            </p>
          </CardContent>
        </Card>

        {/* Strengths and Challenges */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          <Card className="border-l-4 border-l-green-500">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Star className="h-5 w-5 text-green-500" />
                {t('individualTypes.creativeEnthusiast.coreStrengths')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                {(t('individualTypes.creativeEnthusiast.strengths', { returnObjects: true }) as any[]).map((strength: string, index: number) => (
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
                <Lightbulb className="h-5 w-5 text-amber-500" />
                {t('individualTypes.creativeEnthusiast.growthAreas')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                {(t('individualTypes.creativeEnthusiast.challenges', { returnObjects: true }) as any[]).map((challenge: string, index: number) => (
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
        <Card className="mb-8 text-center bg-gradient-to-r from-red-500 to-pink-500 text-white">
          <CardContent className="p-8">
            <h3 className="text-2xl font-bold mb-4">{t('individualTypes.creativeEnthusiast.ctaTitle')}</h3>
            <p className="text-lg mb-6 opacity-90">
              {t('individualTypes.creativeEnthusiast.ctaDescription')}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" className="bg-white text-red-600 hover:bg-gray-100">
                <Link href="/test">{t('individualTypes.creativeEnthusiast.takeTest')}</Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-red-600">
                <Link href="/ikigai-type-test">{t('individualTypes.creativeEnthusiast.freeTest')}</Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Career Paths */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-2xl">{t('types:creativeEnthusiast.careerMatches', 'Top Career Matches')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-4 bg-red-50 rounded-lg">
                <div className="flex justify-between items-center mb-2">
                  <h4 className="font-semibold">UX/UI Designer</h4>
                  <Badge variant="secondary">92% match</Badge>
                </div>
                <p className="text-sm text-gray-600 mb-2">$65,000 - $120,000</p>
                <p className="text-sm">Design user experiences that combine creativity and functionality.</p>
              </div>
              <div className="p-4 bg-red-50 rounded-lg">
                <div className="flex justify-between items-center mb-2">
                  <h4 className="font-semibold">Creative Director</h4>
                  <Badge variant="secondary">88% match</Badge>
                </div>
                <p className="text-sm text-gray-600 mb-2">$80,000 - $150,000</p>
                <p className="text-sm">Lead creative teams and shape brand identities.</p>
              </div>
              <div className="p-4 bg-red-50 rounded-lg">
                <div className="flex justify-between items-center mb-2">
                  <h4 className="font-semibold">Art Therapist</h4>
                  <Badge variant="secondary">85% match</Badge>
                </div>
                <p className="text-sm text-gray-600 mb-2">$45,000 - $80,000</p>
                <p className="text-sm">Use creativity to help others heal and grow.</p>
              </div>
              <div className="p-4 bg-red-50 rounded-lg">
                <div className="flex justify-between items-center mb-2">
                  <h4 className="font-semibold">Content Creator</h4>
                  <Badge variant="secondary">83% match</Badge>
                </div>
                <p className="text-sm text-gray-600 mb-2">$40,000 - $100,000+</p>
                <p className="text-sm">Create engaging content across multiple platforms.</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Nurturing Tips */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-2xl">How to Nurture Your Creative Enthusiast Type</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="p-4 bg-white rounded-lg border-l-4 border-red-500">
                <h4 className="font-semibold mb-2">Embrace Your Creative Process</h4>
                <p className="text-gray-600">Allow time for inspiration and don't force creativity. Create a dedicated creative space.</p>
              </div>
              <div className="p-4 bg-white rounded-lg border-l-4 border-red-500">
                <h4 className="font-semibold mb-2">Build Structure Around Creativity</h4>
                <p className="text-gray-600">Use time-blocking and project management tools to balance creative freedom with deadlines.</p>
              </div>
              <div className="p-4 bg-white rounded-lg border-l-4 border-red-500">
                <h4 className="font-semibold mb-2">Seek Collaboration Opportunities</h4>
                <p className="text-gray-600">Partner with others who complement your skills, especially in business and execution.</p>
              </div>
            </div>
          </CardContent>
        </Card>

      </div>
    </div>
  );
}