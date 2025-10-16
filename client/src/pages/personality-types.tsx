import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import Navigation from "@/components/Navigation";
import SEO from "@/components/SEO";
import { useTranslation } from 'react-i18next';
import { useLocalizedPath } from '@/hooks/useLocalizedPath';
import { useEffect, useState } from 'react';
import { 
  Heart, 
  Target, 
  Globe, 
  DollarSign, 
  TrendingUp,
  Lightbulb,
  ArrowRight,
  CheckCircle,
  Star
} from "lucide-react";

export default function PersonalityTypes() {
  const { t, ready, i18n } = useTranslation('types');
  const { getPath } = useLocalizedPath();
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    if (ready && i18n.hasResourceBundle(i18n.language, 'types')) {
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
    "name": "Ikigai Personality Types - Complete Guide",
    "description": "Discover the 4 main Ikigai personality types and their characteristics. Learn how each type approaches passion, mission, vocation, and profession differently.",
    "url": "https://www.ikigain.org/ikigai-personality-types",
    "mainEntity": {
      "@type": "ItemList",
      "itemListElement": [
        {
          "@type": "ListItem",
          "position": 1,
          "name": "Creative Enthusiast",
          "description": "Driven by passion and creativity, thrives in environments that allow artistic expression and innovation."
        },
        {
          "@type": "ListItem", 
          "position": 2,
          "name": "Skilled Specialist",
          "description": "Masters their craft through dedication and expertise, finds fulfillment in excellence and competence."
        },
        {
          "@type": "ListItem",
          "position": 3, 
          "name": "Purpose-Driven Helper",
          "description": "Finds fulfillment in serving others and making a positive impact on the world around them."
        },
        {
          "@type": "ListItem",
          "position": 4,
          "name": "Strategic Achiever", 
          "description": "Finds purpose in building successful ventures and creating economic value through strategic thinking."
        }
      ]
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <SEO
        title={t('mainPageTitle')}
        description={t('mainPageDescription')}
        keywords="ikigai personality types, ikigai types, passion driven, mission driven, vocation driven, profession driven, ikigai test types"
        canonical="https://www.ikigain.org/ikigai-personality-types"
        structuredData={structuredData}
      />
      <Navigation />
      
      {/* Hero Section */}
      <header className="relative bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Ikigai <span className="text-primary bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">{t('mainHeroTitle')}</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              {t('mainHeroSubtitle')}
            </p>
            <Link href={getPath("/test")}>
              <Button size="lg" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-4 text-lg font-semibold shadow-lg transform hover:scale-105 transition-transform">
                {t('discoverYourType')}
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Types Overview */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">{t('understandingTitle')}</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              {t('understandingDescription')}
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
            {[
              { id: 'creative-enthusiast', key: 'creativeEnthusiast', color: 'red', icon: Heart, dominant: 'Passion' },
              { id: 'skilled-practitioner', key: 'skilledPractitioner', color: 'blue', icon: Target, dominant: 'Vocation' },
              { id: 'purpose-driven-helper', key: 'purposeDrivenHelper', color: 'green', icon: Globe, dominant: 'Mission' },
              { id: 'strategic-achiever', key: 'strategicAchiever', color: 'purple', icon: DollarSign, dominant: 'Profession' }
            ].map((type) => {
              const IconComponent = type.icon;
              return (
                <Card key={type.id} className={`hover:shadow-lg transition-shadow border-l-4 border-l-${type.color}-500 group`}>
                  <CardHeader>
                    <div className="flex items-center gap-2">
                      <IconComponent className={`h-5 w-5 text-${type.color}-500`} />
                      <CardTitle className="text-lg">{t(`${type.key}.name`)}</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 mb-4">{t(`${type.key}.description`)}</p>
                    <Badge className={`bg-${type.color}-100 text-${type.color}-800`}>
                      {type.dominant} {t('dominant')}
                    </Badge>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Detailed Type Breakdown */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">{t('detailedBreakdownTitle')}</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              {t('detailedBreakdownDescription')}
            </p>
          </div>

          <div className="space-y-16">
            {[
              { id: 'creative-enthusiast', key: 'creativeEnthusiast', color: 'red', icon: Heart, dominant: 'Passion' },
              { id: 'skilled-practitioner', key: 'skilledPractitioner', color: 'blue', icon: Target, dominant: 'Vocation' },
              { id: 'purpose-driven-helper', key: 'purposeDrivenHelper', color: 'green', icon: Globe, dominant: 'Mission' },
              { id: 'strategic-achiever', key: 'strategicAchiever', color: 'purple', icon: DollarSign, dominant: 'Profession' }
            ].map((type) => {
              const IconComponent = type.icon;
              return (
                <div key={type.id} className="bg-white rounded-lg shadow-lg p-8">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Left Column - Overview */}
                    <div>
                      <div className="flex items-center gap-3 mb-6">
                        <div className={`w-12 h-12 bg-${type.color}-100 rounded-full flex items-center justify-center`}>
                          <IconComponent className={`h-6 w-6 text-${type.color}-600`} />
                        </div>
                        <div>
                          <h3 className="text-2xl font-bold text-gray-900">{t(`${type.key}.name`)}</h3>
                          <p className="text-gray-600">{type.dominant} {t('dominant')}</p>
                        </div>
                      </div>
                      
                      <p className="text-gray-600 mb-6">{t(`${type.key}.description`)}</p>
                      
                      <div className="mb-6">
                        <h4 className="text-lg font-semibold text-gray-900 mb-3">{t('characteristics')}</h4>
                        <ul className="space-y-2">
                          {(t(`${type.key}.characteristics`, { returnObjects: true }) as string[]).map((char, i) => (
                            <li key={i} className="flex items-start gap-2">
                              <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                              <span className="text-gray-600">{char}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <h4 className="text-lg font-semibold text-gray-900 mb-3">{t('strengths')}</h4>
                          <ul className="space-y-2">
                            {(t(`${type.key}.strengths`, { returnObjects: true }) as string[]).map((strength, i) => (
                              <li key={i} className="flex items-start gap-2">
                                <Star className="h-4 w-4 text-yellow-500 mt-0.5 flex-shrink-0" />
                                <span className="text-sm text-gray-600">{strength}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                        
                        <div>
                          <h4 className="text-lg font-semibold text-gray-900 mb-3">{t('challenges')}</h4>
                          <ul className="space-y-2">
                            {(t(`${type.key}.challenges`, { returnObjects: true }) as string[]).map((challenge, i) => (
                              <li key={i} className="flex items-start gap-2">
                                <TrendingUp className="h-4 w-4 text-blue-500 mt-0.5 flex-shrink-0" />
                                <span className="text-sm text-gray-600">{challenge}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                    
                    {/* Right Column - Career & Development */}
                    <div>
                      <div className="mb-6">
                        <h4 className="text-lg font-semibold text-gray-900 mb-3">{t('careerPaths')}</h4>
                        <div className="space-y-3">
                          {(t(`${type.key}.careerPaths`, { returnObjects: true }) as Array<{title: string, match: number, salary: string}>).map((career, i) => (
                            <div key={i} className="bg-gray-50 rounded-lg p-4">
                              <div className="flex items-center justify-between mb-2">
                                <h5 className="font-semibold text-gray-900">{career.title}</h5>
                                <Badge className={`bg-${type.color}-100 text-${type.color}-800`}>
                                  {career.match}% {t('match')}
                                </Badge>
                              </div>
                              <p className="text-sm text-gray-600">{t('salary')}: {career.salary}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                      
                      <div>
                        <h4 className="text-lg font-semibold text-gray-900 mb-3">{t('developmentTips')}</h4>
                        <ul className="space-y-2">
                          {(t(`${type.key}.developmentTips`, { returnObjects: true }) as string[]).map((tip, i) => (
                            <li key={i} className="flex items-start gap-2">
                              <Lightbulb className="h-4 w-4 text-yellow-500 mt-0.5 flex-shrink-0" />
                              <span className="text-sm text-gray-600">{tip}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Mixed Types Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">{t('mixedTypes.title')}</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              {t('mixedTypes.description')}
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Heart className="h-5 w-5 text-red-500" />
                  <Target className="h-5 w-5 text-blue-500" />
                  {t('mixedTypes.creativeExpert.name')}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">
                  {t('mixedTypes.creativeExpert.description')}
                </p>
                <div className="flex flex-wrap gap-2">
                  {(t('mixedTypes.creativeExpert.tags', { returnObjects: true }) as string[]).map((tag, i) => (
                    <Badge key={i} variant="secondary">{tag}</Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
            
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Globe className="h-5 w-5 text-green-500" />
                  <DollarSign className="h-5 w-5 text-yellow-500" />
                  {t('mixedTypes.socialEntrepreneur.name')}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">
                  {t('mixedTypes.socialEntrepreneur.description')}
                </p>
                <div className="flex flex-wrap gap-2">
                  {(t('mixedTypes.socialEntrepreneur.tags', { returnObjects: true }) as string[]).map((tag, i) => (
                    <Badge key={i} variant="secondary">{tag}</Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
            
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5 text-blue-500" />
                  <Globe className="h-5 w-5 text-green-500" />
                  {t('mixedTypes.artisticHelper.name')}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">
                  {t('mixedTypes.artisticHelper.description')}
                </p>
                <div className="flex flex-wrap gap-2">
                  {(t('mixedTypes.artisticHelper.tags', { returnObjects: true }) as string[]).map((tag, i) => (
                    <Badge key={i} variant="secondary">{tag}</Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">{t('callToAction.title')}</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto opacity-90">
            {t('callToAction.description')}
          </p>
          <Link href="/test">
            <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-4 text-lg font-semibold">
              {t('callToAction.takeTest')}
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}