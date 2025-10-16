import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "wouter";
import Navigation from "@/components/Navigation";
import SEO from "@/components/SEO";
import { useTranslation } from 'react-i18next';
import { useLocation } from 'wouter';
import { useEffect, useState } from 'react';
import { 
  Heart, 
  Target, 
  Globe, 
  DollarSign, 
  ArrowRight,
  CheckCircle,
  Award,
} from "lucide-react";

export default function IkigaiTest() {
  const { t, ready, i18n } = useTranslation('ikigai-test');
  const [location] = useLocation();
  const language = location.startsWith('/es') ? 'es' : location.startsWith('/fr') ? 'fr' : 'en';
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    if (ready && i18n.hasResourceBundle(i18n.language, 'ikigai-test')) {
      const timer = setTimeout(() => {
        setIsLoading(false);
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [ready, i18n]);
  
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
  
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "name": "Discover Your Ikigai: Take the Journey to Find Your True Self with the Ikigai Test",
    "description": "Ever ask yourself, 'What truly makes me happy?' or 'What's my purpose?' Take our free Ikigai test to discover your reason for being and find your true purpose.",
    "url": "https://www.ikigain.org/ikigai-test",
    "mainEntity": {
      "@type": "Quiz",
      "name": "Ikigai Test",
      "description": "A comprehensive assessment to help you discover your life's purpose through the Japanese concept of Ikigai",
      "estimatedDuration": "PT10M",
      "author": {
        "@type": "Organization",
        "name": "Ikigain.org",
        "url": "https://www.ikigain.org"
      }
    },
    "breadcrumb": {
      "@type": "BreadcrumbList",
      "itemListElement": [
        {
          "@type": "ListItem",
          "position": 1,
          "name": "Home",
          "item": "https://www.ikigain.org"
        },
        {
          "@type": "ListItem",
          "position": 2,
          "name": "Ikigai Test",
          "item": "https://www.ikigain.org/ikigai-test"
        }
      ]
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <SEO
        title={t('seo.title')}
        description={t('seo.description')}
        keywords={t('seo.keywords')}
        canonical={language === 'es' ? `https://www.ikigain.org/es/ikigai-test` : language === 'fr' ? `https://www.ikigain.org/fr/ikigai-test` : `https://www.ikigain.org/ikigai-test`}
        ogTitle={t('seo.ogTitle')}
        ogDescription={t('seo.ogDescription')}
        structuredData={structuredData}
      />
      <Navigation />
      
      {/* Hero Section */}
      <header className="relative bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              {t('hero.title')}
            </h1>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8">
              {t('hero.subtitle')}
            </h2>
            <p className="text-xl text-gray-600 mb-8 max-w-4xl mx-auto">
              <strong>{t('hero.question1')}</strong>
            </p>
            <p className="text-lg text-gray-600 mb-8 max-w-4xl mx-auto">
              {t('hero.personalStory')} <strong>{t('hero.ikigaiMeaning')}</strong>, {t('hero.ikigaiDefinition')}
            </p>
            <p className="text-lg text-gray-600 mb-8 max-w-4xl mx-auto">
              {t('hero.impact')} <strong>{t('hero.testDescription')}</strong> {t('hero.purpose')} <strong>{t('hero.comprehensiveQuiz')}</strong>.
            </p>
            <Link href={`${language === 'es' ? '/es' : language === 'fr' ? '/fr' : ''}/test`}>
              <Button size="lg" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-4 text-lg font-semibold shadow-lg transform hover:scale-105 transition-transform">
                {t('hero.cta')}
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* What is Ikigai Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">{t('whatIsIkigai.title')}</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              {t('whatIsIkigai.description')}
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
            <Card className="border-l-4 border-l-red-500 hover:shadow-lg transition-shadow group">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-red-600 group-hover:text-red-700">
                  <Heart className="h-5 w-5" />
                  <h3>{t('whatIsIkigai.whatYouLove.title')}</h3>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  {t('whatIsIkigai.whatYouLove.description')}
                </p>
              </CardContent>
            </Card>
            
            <Card className="border-l-4 border-l-green-500 hover:shadow-lg transition-shadow group">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-green-600 group-hover:text-green-700">
                  <Globe className="h-5 w-5" />
                  <h3>{t('whatIsIkigai.whatWorldNeeds.title')}</h3>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  {t('whatIsIkigai.whatWorldNeeds.description')}
                </p>
              </CardContent>
            </Card>
            
            <Card className="border-l-4 border-l-yellow-500 hover:shadow-lg transition-shadow group">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-yellow-600 group-hover:text-yellow-700">
                  <DollarSign className="h-5 w-5" />
                  <h3>{t('whatIsIkigai.whatYouCanBePaidFor.title')}</h3>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  {t('whatIsIkigai.whatYouCanBePaidFor.description')}
                </p>
              </CardContent>
            </Card>
            
            <Card className="border-l-4 border-l-blue-500 hover:shadow-lg transition-shadow group">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-blue-600 group-hover:text-blue-700">
                  <Target className="h-5 w-5" />
                  <h3>{t('whatIsIkigai.whatYouAreGoodAt.title')}</h3>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  {t('whatIsIkigai.whatYouAreGoodAt.description')}
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="bg-blue-50 rounded-lg p-8 mb-16">
            <p className="text-lg text-gray-700 text-center">
              {t('whatIsIkigai.sweetSpot')} {t('whatIsIkigai.ourTest')} {t('whatIsIkigai.searchingText')}
            </p>
          </div>
        </div>
      </section>

      {/* How Does the Test Work Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">{t('howItWorks.title')}</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              {t('howItWorks.description')}
            </p>
          </div>

          <div className="bg-white rounded-lg p-8 mb-16">
            <p className="text-lg text-gray-700 text-center mb-8">
              {t('howItWorks.visualization')} {t('howItWorks.benefits')}
            </p>
            
            <div className="text-center">
              <Link href={`${language === 'es' ? '/es' : language === 'fr' ? '/fr' : ''}/test`}>
                <Button size="lg" className="bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white px-8 py-4 text-lg font-semibold shadow-lg transform hover:scale-105 transition-transform">
                  {t('howItWorks.cta')}
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Do You Need the Test Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">{t('needTest.title')}</h2>
            <p className="text-xl text-gray-600 max-w-4xl mx-auto">
              {t('needTest.description')}
            </p>
          </div>

          <div className="bg-blue-50 rounded-lg p-8">
            <p className="text-lg text-gray-700 text-center">
              {t('needTest.outcome')}
            </p>
          </div>
        </div>
      </section>

      {/* What You'll Discover Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              {t('whatYouDiscover.title')}
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              {t('whatYouDiscover.description')}
            </p>
          </div>

          <div className="space-y-16">
            {/* Core Strengths */}
            <div className="flex flex-col lg:flex-row items-center gap-8">
              <div className="lg:w-1/2">
                <h3 className="text-2xl font-bold text-gray-900 mb-4">{t('whatYouDiscover.coreStrengths.title')}</h3>
                <p className="text-lg text-gray-600 mb-6">
                  {t('whatYouDiscover.coreStrengths.description')}
                </p>
                <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
                  <p className="text-gray-700 italic">
                    "{t('whatYouDiscover.coreStrengths.example')}"
                  </p>
                </div>
              </div>
              <div className="lg:w-1/2">
                <div className="bg-white rounded-lg p-8 shadow-lg">
                  <Award className="h-12 w-12 text-blue-600 mb-4 mx-auto" />
                  <h4 className="text-xl font-semibold text-gray-900 text-center">{t('whatYouDiscover.coreStrengths.cardTitle')}</h4>
                </div>
              </div>
            </div>

            {/* What Drives You */}
            <div className="flex flex-col lg:flex-row-reverse items-center gap-8">
              <div className="lg:w-1/2">
                <h3 className="text-2xl font-bold text-gray-900 mb-4">{t('whatYouDiscover.whatDrivesYou.title')}</h3>
                <p className="text-lg text-gray-600 mb-6">
                  {t('whatYouDiscover.whatDrivesYou.description')}
                </p>
                <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded">
                  <p className="text-gray-700 italic">
                    "{t('whatYouDiscover.whatDrivesYou.example')}"
                  </p>
                </div>
              </div>
              <div className="lg:w-1/2">
                <div className="bg-white rounded-lg p-8 shadow-lg">
                  <Heart className="h-12 w-12 text-red-600 mb-4 mx-auto" />
                  <h4 className="text-xl font-semibold text-gray-900 text-center">{t('whatYouDiscover.whatDrivesYou.cardTitle')}</h4>
                </div>
              </div>
            </div>

            {/* Mission and Purpose */}
            <div className="flex flex-col lg:flex-row items-center gap-8">
              <div className="lg:w-1/2">
                <h3 className="text-2xl font-bold text-gray-900 mb-4">{t('whatYouDiscover.missionPurpose.title')}</h3>
                <p className="text-lg text-gray-600 mb-6">
                  {t('whatYouDiscover.missionPurpose.description')}
                </p>
                <div className="bg-purple-50 border-l-4 border-purple-500 p-4 rounded">
                  <p className="text-gray-700 italic">
                    "{t('whatYouDiscover.missionPurpose.example')}"
                  </p>
                </div>
              </div>
              <div className="lg:w-1/2">
                <div className="bg-white rounded-lg p-8 shadow-lg">
                  <Globe className="h-12 w-12 text-green-600 mb-4 mx-auto" />
                  <h4 className="text-xl font-semibold text-gray-900 text-center">{t('whatYouDiscover.missionPurpose.cardTitle')}</h4>
                </div>
              </div>
            </div>

            {/* Your Vocation */}
            <div className="flex flex-col lg:flex-row-reverse items-center gap-8">
              <div className="lg:w-1/2">
                <h3 className="text-2xl font-bold text-gray-900 mb-4">{t('whatYouDiscover.vocation.title')}</h3>
                <p className="text-lg text-gray-600 mb-6">
                  {t('whatYouDiscover.vocation.description')}
                </p>
                <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 rounded">
                  <p className="text-gray-700 italic">
                    "{t('whatYouDiscover.vocation.example')}"
                  </p>
                </div>
              </div>
              <div className="lg:w-1/2">
                <div className="bg-white rounded-lg p-8 shadow-lg">
                  <Target className="h-12 w-12 text-yellow-600 mb-4 mx-auto" />
                  <h4 className="text-xl font-semibold text-gray-900 text-center">{t('whatYouDiscover.vocation.cardTitle')}</h4>
                </div>
              </div>
            </div>

            {/* Action Plan */}
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg p-8 text-white">
              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold mb-4">{t('actionPlan.title')}</h3>
                <p className="text-lg mb-6">
                  {t('actionPlan.description')}
                </p>
              </div>

              <div className="bg-white/10 rounded-lg p-6">
                <h4 className="text-xl font-semibold mb-4">{t('actionPlan.exampleTitle')}</h4>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 mt-1 flex-shrink-0" />
                    <div>
                      <strong>{t('actionPlan.phase1.title')}</strong> {t('actionPlan.phase1.description')}
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 mt-1 flex-shrink-0" />
                    <div>
                      <strong>{t('actionPlan.phase2.title')}</strong> {t('actionPlan.phase2.description')}
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 mt-1 flex-shrink-0" />
                    <div>
                      <strong>{t('actionPlan.phase3.title')}</strong> {t('actionPlan.phase3.description')}
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 mt-1 flex-shrink-0" />
                    <div>
                      <strong>{t('actionPlan.phase4.title')}</strong> {t('actionPlan.phase4.description')}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">{t('faq.title')}</h2>
          </div>

          <div className="space-y-8">
            <Card>
              <CardHeader>
                <CardTitle className="text-xl">{t('faq.q1')}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  {t('faq.a1')}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-xl">{t('faq.q2')}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  {t('faq.a2')}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-xl">{t('faq.q3')}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  {t('faq.a3')}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-xl">{t('faq.q4')}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  {t('faq.a4')}
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">
            {t('finalCTA.title')}
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            {t('finalCTA.description')}
          </p>
          <Link href={`${language === 'es' ? '/es' : language === 'fr' ? '/fr' : ''}/test`}>
            <Button size="lg" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-4 text-lg font-semibold shadow-lg transform hover:scale-105 transition-transform">
              {t('finalCTA.cta')}
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}