import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Navigation from "@/components/Navigation";
import SEO from "@/components/SEO";
import { useTranslation } from 'react-i18next';
import { 
  Heart, 
  Target, 
  DollarSign, 
  Brain, 
  Users, 
  BarChart3, 
  CheckCircle,
  Clock,
  Star,
  Globe,
  Trophy,
} from "lucide-react";

export default function Landing() {
  const { t } = useTranslation(['landing', 'common']);
  
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "Ikigai Test - Discover Your Life's Purpose",
    "description": "Take our comprehensive Ikigai assessment to discover your life's purpose. Find the intersection of what you love, what you're good at, what the world needs, and what you can be paid for.",
    "url": "https://www.ikigain.org",
    "applicationCategory": "PersonalityTest",
    "operatingSystem": "Web",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD",
      "availability": "https://schema.org/InStock"
    },
    "author": {
      "@type": "Organization",
      "name": "Ikigain.org",
      "url": "https://www.ikigain.org"
    },
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.8",
      "reviewCount": "10000"
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <SEO
        title="Free Ikigai Test - Discover Your Life's Purpose | What is Ikigai Quiz"
        description="Take our free Ikigai test to discover what is Ikigai and your life's purpose. Free Ikigai quiz helps you find the intersection of what you love, what you're good at, what the world needs, and what you can be paid for."
        keywords="ikigai test, free ikigai test, ikigai quiz, what is ikigai, ikigai test free, free ikigai quiz, life purpose test, career assessment, personality test"
        canonical="https://www.ikigain.org/"
        ogTitle="Ikigai Test - Discover Your Life's Purpose | Free Assessment"
        ogDescription="Take our comprehensive Ikigai assessment to discover your life's purpose. Find the intersection of what you love, what you're good at, what the world needs, and what you can be paid for."
        structuredData={structuredData}
      />
      <Navigation />
      
      {/* Hero Section */}
      <header className="relative bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              {t('landing:hero.title')} <span className="text-primary bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Ikigai</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              {t('landing:hero.description')}
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
              <Link href="/ikigai-type-test">
                <Button size="lg" className="bg-gradient-to-r from-blue-600 via-purple-600 to-blue-700 hover:from-blue-700 hover:via-purple-700 hover:to-blue-800 text-white px-10 py-5 text-lg font-bold shadow-2xl rounded-xl border-0 relative overflow-hidden group hover:scale-105 transition-all duration-300">
                  <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <div className="relative flex items-center gap-3">
                    <Target className="w-5 h-5" />
                    {t('landing:assessments.free.cta')}
                  </div>
                </Button>
              </Link>
              <Link href="/test">
                <Button size="lg" variant="outline" className="px-10 py-5 text-lg font-bold border-3 border-blue-600 bg-white hover:bg-blue-50 text-blue-600 hover:text-blue-700 shadow-xl rounded-xl transition-all duration-300 hover:shadow-2xl hover:scale-105 relative overflow-hidden group">
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-50 to-purple-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <div className="relative flex items-center gap-3">
                    <Brain className="w-5 h-5" />
                    {t('landing:assessments.premium.cta')}
                  </div>
                </Button>
              </Link>
            </div>
            
            <div className="flex items-center gap-4 justify-center mt-4">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Clock className="h-4 w-4" />
                {t('landing:assessments.free.time')}
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Users className="h-4 w-4" />
                {t('landing:assessments.free.tested')}
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                {t('landing:assessments.free.rating')}
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* What is Ikigai Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              {t('landing:whatIsIkigai.title')}
            </h2>
            <p className="text-xl text-gray-600 max-w-4xl mx-auto">
              {t('landing:whatIsIkigai.description')}
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <Card className="text-center hover:shadow-lg transition-shadow duration-300">
              <CardHeader>
                <div className="w-16 h-16 bg-gradient-to-br from-red-500 to-pink-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Heart className="w-8 h-8 text-white" />
                </div>
                <CardTitle className="text-xl font-bold text-gray-900">
                  {t('landing:whatIsIkigai.passion')}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  {t('landing:whatIsIkigai.passionDesc')}
                </p>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-lg transition-shadow duration-300">
              <CardHeader>
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Globe className="w-8 h-8 text-white" />
                </div>
                <CardTitle className="text-xl font-bold text-gray-900">
                  {t('landing:whatIsIkigai.mission')}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  {t('landing:whatIsIkigai.missionDesc')}
                </p>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-lg transition-shadow duration-300">
              <CardHeader>
                <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <DollarSign className="w-8 h-8 text-white" />
                </div>
                <CardTitle className="text-xl font-bold text-gray-900">
                  {t('landing:whatIsIkigai.profession')}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  {t('landing:whatIsIkigai.professionDesc')}
                </p>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-lg transition-shadow duration-300">
              <CardHeader>
                <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-violet-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Target className="w-8 h-8 text-white" />
                </div>
                <CardTitle className="text-xl font-bold text-gray-900">
                  {t('landing:whatIsIkigai.vocation')}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  {t('landing:whatIsIkigai.vocationDesc')}
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Premium Features Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              {t('landing:premiumFeatures.title')}
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              {t('landing:premiumFeatures.description')}
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="hover:shadow-lg transition-shadow duration-300">
              <CardHeader>
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl flex items-center justify-center mb-4">
                  <BarChart3 className="w-6 h-6 text-white" />
                </div>
                <CardTitle className="text-xl font-bold text-gray-900">
                  {t('landing:premiumFeatures.careers.title')}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">
                  {t('landing:premiumFeatures.careers.description')}
                </p>
                <ul className="space-y-2">
                  {(t('landing:premiumFeatures.careers.features', { returnObjects: true }) as string[]).map((feature, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                      <span className="text-sm text-gray-600">{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow duration-300">
              <CardHeader>
                <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-teal-500 rounded-xl flex items-center justify-center mb-4">
                  <Trophy className="w-6 h-6 text-white" />
                </div>
                <CardTitle className="text-xl font-bold text-gray-900">
                  {t('landing:premiumFeatures.roadmap.title')}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">
                  {t('landing:premiumFeatures.roadmap.description')}
                </p>
                <ul className="space-y-2">
                  {(t('landing:premiumFeatures.roadmap.features', { returnObjects: true }) as string[]).map((feature, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                      <span className="text-sm text-gray-600">{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow duration-300">
              <CardHeader>
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center mb-4">
                  <Brain className="w-6 h-6 text-white" />
                </div>
                <CardTitle className="text-xl font-bold text-gray-900">
                  {t('landing:premiumFeatures.personality.title')}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">
                  {t('landing:premiumFeatures.personality.description')}
                </p>
                <ul className="space-y-2">
                  {(t('landing:premiumFeatures.personality.features', { returnObjects: true }) as string[]).map((feature, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                      <span className="text-sm text-gray-600">{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            {t('landing:cta.title')}
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            {t('landing:cta.description')}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/ikigai-type-test">
              <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-4 text-lg font-bold rounded-xl shadow-xl hover:shadow-2xl transition-all duration-300">
                {t('landing:cta.free')}
              </Button>
            </Link>
            <Link href="/test">
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-blue-600 px-8 py-4 text-lg font-bold rounded-xl shadow-xl hover:shadow-2xl transition-all duration-300">
                {t('landing:cta.premium')}
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}