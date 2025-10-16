import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import Navigation from "@/components/Navigation";
import SEO from "@/components/SEO";

import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import sindyProfileImage from "@assets/1516903840572_1752666110841.jpeg";
import karlisProfileImage from "@assets/1516949856208_1752666110842.jpeg";
import { 
  Heart, 
  Target, 
  Globe, 
  DollarSign, 
  Lightbulb,
  Users,
  Briefcase,
  ArrowRight,
  ExternalLink,
  BookOpen
} from "lucide-react";
import ikigaiCardsImage from "@assets/Ikigain+cards (1)_1752654684985.jpeg";

export default function About() {
  const { t, ready, i18n } = useTranslation('about');
  const language = i18n.language;
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    if (ready && i18n.hasResourceBundle(i18n.language, 'about')) {
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
    "@type": "AboutPage",
    "name": t('title'),
    "description": t('description'),
    "url": "https://www.ikigain.org/about",
    "mainEntity": {
      "@type": "Organization",
      "name": "Ikigain",
      "description": t('structuredData.organizationDescription')
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <SEO
        title={t('title')}
        description={t('description')}
        keywords={t('keywords')}
        canonical={language === 'es' ? `https://www.ikigain.org/es/about` : language === 'fr' ? `https://www.ikigain.org/fr/about` : `https://www.ikigain.org/about`}
        structuredData={structuredData}
      />
      <Navigation />
      
      {/* Hero Section */}
      <header className="relative bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              {t('heroTitle', { 
                defaultValue: "About Ikigain" 
              })}
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              {t('heroDescription', {
                defaultValue: "Learn about our mission to help people discover their life's purpose through the ancient Japanese wisdom of Ikigai."
              })}
            </p>
          </div>
        </div>
      </header>

      {/* Founder's Story Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gray-50 rounded-lg p-8 mb-16">
            <div className="flex flex-col lg:flex-row gap-8 items-center">
              <div className="lg:w-1/3">
                <div className="w-48 h-48 mx-auto">
                  <img 
                    src={ikigaiCardsImage} 
                    alt={t('founder.imageAlt')} 
                    className="w-full h-full object-cover rounded-full shadow-lg"
                  />
                </div>
              </div>
              <div className="lg:w-2/3">
                <h3 className="text-2xl font-bold text-gray-900 mb-4">{t('founder.greeting')}</h3>
                <div className="text-gray-600 space-y-4">
                  {(t('founder.story', { returnObjects: true }) as string[]).map((paragraph, index) => (
                    <p key={index}>{paragraph}</p>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="text-center mb-16">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">{t('missionSection.title')}</h3>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              {t('missionSection.description')}
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardContent className="p-8">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Target className="h-8 w-8 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">{t('approach.evidenceBased.title')}</h3>
                <p className="text-gray-600">
                  {t('approach.evidenceBased.description')}
                </p>
              </CardContent>
            </Card>
            
            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardContent className="p-8">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Users className="h-8 w-8 text-purple-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">{t('approach.personalized.title')}</h3>
                <p className="text-gray-600">
                  {t('approach.personalized.description')}
                </p>
              </CardContent>
            </Card>
            
            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardContent className="p-8">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Lightbulb className="h-8 w-8 text-green-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">{t('approach.comprehensive.title')}</h3>
                <p className="text-gray-600">
                  {t('approach.comprehensive.description')}
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Shop Preview Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">{t('shopPreview.title')}</h2>
            <p className="text-xl text-gray-600 max-w-4xl mx-auto">
              {t('shopPreview.subtitle')}
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
            <div className="space-y-6">
              <div className="bg-white rounded-lg p-8 shadow-lg">
                <p className="text-gray-600 text-lg mb-6">
                  {t('shopPreview.description')}
                </p>
                <ul className="space-y-3 mb-8">
                  {(t('shopPreview.features', { returnObjects: true }) as string[]).map((feature, index) => (
                    <li key={index} className="flex items-center gap-3 text-gray-600">
                      <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                      {feature}
                    </li>
                  ))}
                </ul>
                <div className="flex items-center gap-4 mb-6">
                  <div className="flex items-center gap-2">
                    <span className="text-3xl font-bold text-green-600">{t('shopPreview.price')}</span>
                    <span className="text-xl text-gray-500 line-through">{t('shopPreview.originalPrice')}</span>
                  </div>
                  <span className="bg-red-100 text-red-800 px-4 py-2 rounded-full text-sm font-medium">34% OFF</span>
                </div>
              </div>
            </div>

            <div className="flex justify-center">
              <div className="relative">
                <img 
                  src={ikigaiCardsImage} 
                  alt={t('shopPreview.imageAlt')} 
                  className="w-80 h-80 object-cover rounded-lg shadow-xl"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-lg"></div>
              </div>
            </div>
          </div>

          <div className="text-center">
            <Link href="/shop">
              <Button size="lg" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-4 text-lg font-semibold shadow-lg">
                {t('shopPreview.shopButton')}
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">{t('team.title')}</h2>
            <p className="text-xl text-gray-600 max-w-4xl mx-auto">
              {t('team.subtitle')}
            </p>
          </div>

          <div className="max-w-6xl mx-auto mb-16">
            {/* Story Cards */}
            <div className="grid md:grid-cols-2 gap-8 mb-12">
              {/* Ikigai Discovery Card */}
              <motion.div 
                className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-2xl p-8 border border-purple-100 shadow-lg"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
                whileHover={{ y: -5, boxShadow: "0 20px 40px rgba(0,0,0,0.1)" }}
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-purple-500 rounded-full flex items-center justify-center">
                    <Heart className="h-5 w-5 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900">{t('team.ikigaiJourneyTitle')}</h3>
                </div>
                <p className="text-gray-700 mb-4 leading-relaxed">{t('team.introduction')}</p>
                <p className="text-gray-700 mb-4 leading-relaxed">{t('team.ikigaiPower')}</p>
                <p className="text-gray-700 leading-relaxed">{t('team.discovery')}</p>
              </motion.div>

              {/* Purpose & Mission Card */}
              <motion.div 
                className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-8 border border-green-100 shadow-lg"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                whileHover={{ y: -5, boxShadow: "0 20px 40px rgba(0,0,0,0.1)" }}
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
                    <Target className="h-5 w-5 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900">{t('team.whyCreatedTitle')}</h3>
                </div>
                <p className="text-gray-700 mb-4 leading-relaxed">{t('team.cardsHelp')}</p>
                <p className="text-gray-700 mb-4 leading-relaxed">{t('team.whyDiscovery')}</p>
                <p className="text-gray-700 leading-relaxed">{t('team.conclusion')}</p>
              </motion.div>
            </div>

            {/* Family Story Section */}
            <motion.div 
              className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl p-8 border border-amber-100 shadow-lg mb-12"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              whileHover={{ y: -5, boxShadow: "0 20px 40px rgba(0,0,0,0.1)" }}
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-amber-500 to-orange-500 rounded-full flex items-center justify-center">
                  <Users className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900">{t('team.connectTitle')}</h3>
              </div>
              <div className="grid md:grid-cols-3 gap-6">
                <div className="md:col-span-2">
                  <p className="text-gray-700 mb-4 leading-relaxed">{t('team.familyIntro')}</p>
                  <p className="text-gray-700 mb-4 leading-relaxed">{t('team.daughter')}</p>
                  <p className="text-gray-700 leading-relaxed">{t('team.dedication')}</p>
                </div>
                <div className="flex flex-col items-center justify-center">
                  <div className="w-24 h-24 bg-gradient-to-br from-amber-400 to-orange-400 rounded-full flex items-center justify-center mb-4 shadow-lg">
                    <Globe className="h-12 w-12 text-white" />
                  </div>
                  <p className="text-sm text-gray-600 text-center font-medium">{t('team.worldwideAccess')}</p>
                </div>
              </div>
            </motion.div>

            {/* Team Profiles Section */}
            <div className="text-center">
              <motion.h3 
                className="text-3xl font-bold text-gray-900 mb-4"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.6 }}
              >
                {t('team.connectTitle')}
              </motion.h3>
              <motion.p 
                className="text-lg text-gray-600 mb-12 max-w-2xl mx-auto"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.8 }}
              >
                {t('team.connectDescription')}
              </motion.p>
              
              <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                {/* Sindy Profile Card */}
                <motion.div 
                  className="bg-white rounded-2xl p-8 shadow-xl border border-blue-100"
                  whileHover={{ y: -8, boxShadow: "0 25px 50px rgba(59, 130, 246, 0.2)" }}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 1.0 }}
                >
                  <div className="relative">
                    <div className="absolute -top-4 -right-4 w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center shadow-lg">
                      <Heart className="h-6 w-6 text-white" />
                    </div>
                    
                    <motion.div 
                      className="w-32 h-32 rounded-full mx-auto mb-6 shadow-lg overflow-hidden border-4 border-blue-100"
                      whileHover={{ 
                        scale: 1.1,
                        boxShadow: "0 20px 40px rgba(59, 130, 246, 0.3)"
                      }}
                      transition={{ duration: 0.3 }}
                    >
                      <img 
                        src={karlisProfileImage} 
                        alt={t('team.sindyImageAlt')} 
                        className="w-full h-full object-cover object-center"
                      />
                    </motion.div>
                    
                    <h4 className="text-2xl font-bold text-gray-900 mb-2">Sindy</h4>
                    <div className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-100 to-blue-200 text-blue-800 px-4 py-2 rounded-full text-sm font-semibold mb-6">
                      <Lightbulb className="h-4 w-4" />
                      {t('team.sindyRole')}
                    </div>
                    
                    <motion.a 
                      href="https://www.linkedin.com/in/sindija-vilmane-406b4684/" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white px-8 py-4 rounded-full font-medium shadow-lg hover:shadow-xl transition-all duration-300"
                      whileHover={{ 
                        scale: 1.05,
                        boxShadow: "0 10px 25px rgba(59, 130, 246, 0.4)"
                      }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <motion.svg 
                        className="w-5 h-5" 
                        fill="currentColor" 
                        viewBox="0 0 24 24"
                        whileHover={{ rotate: 360 }}
                        transition={{ duration: 0.5 }}
                      >
                        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                      </motion.svg>
                      {t('team.connectWith')} Sindy
                      <motion.div
                        animate={{ x: [0, 5, 0] }}
                        transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
                      >
                        <ExternalLink className="h-4 w-4" />
                      </motion.div>
                    </motion.a>
                  </div>
                </motion.div>

                {/* Karlis Profile Card */}
                <motion.div 
                  className="bg-white rounded-2xl p-8 shadow-xl border border-green-100"
                  whileHover={{ y: -8, boxShadow: "0 25px 50px rgba(34, 197, 94, 0.2)" }}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 1.2 }}
                >
                  <div className="relative">
                    <div className="absolute -top-4 -right-4 w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center shadow-lg">
                      <Target className="h-6 w-6 text-white" />
                    </div>
                    
                    <motion.div 
                      className="w-32 h-32 rounded-full mx-auto mb-6 shadow-lg overflow-hidden border-4 border-green-100"
                      whileHover={{ 
                        scale: 1.1,
                        boxShadow: "0 20px 40px rgba(34, 197, 94, 0.3)"
                      }}
                      transition={{ duration: 0.3 }}
                    >
                      <img 
                        src={sindyProfileImage} 
                        alt={t('team.karlisImageAlt')} 
                        className="w-full h-full object-cover object-center"
                      />
                    </motion.div>
                    
                    <h4 className="text-2xl font-bold text-gray-900 mb-2">Karlis</h4>
                    <div className="inline-flex items-center gap-2 bg-gradient-to-r from-green-100 to-green-200 text-green-800 px-4 py-2 rounded-full text-sm font-semibold mb-6">
                      <Briefcase className="h-4 w-4" />
                      {t('team.karlisRole')}
                    </div>
                    
                    <motion.a 
                      href="https://www.linkedin.com/in/karlis-vilmanis-a2b38556/" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-3 bg-gradient-to-r from-green-600 to-green-700 text-white px-8 py-4 rounded-full font-medium shadow-lg hover:shadow-xl transition-all duration-300"
                      whileHover={{ 
                        scale: 1.05,
                        boxShadow: "0 10px 25px rgba(34, 197, 94, 0.4)"
                      }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <motion.svg 
                        className="w-5 h-5" 
                        fill="currentColor" 
                        viewBox="0 0 24 24"
                        whileHover={{ rotate: 360 }}
                        transition={{ duration: 0.5 }}
                      >
                        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                      </motion.svg>
                      {t('team.connectWith')} Karlis
                      <motion.div
                        animate={{ x: [0, 5, 0] }}
                        transition={{ repeat: Infinity, duration: 2, ease: "easeInOut", delay: 0.5 }}
                      >
                        <ExternalLink className="h-4 w-4" />
                      </motion.div>
                    </motion.a>
                  </div>
                </motion.div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Personality Types Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">{t('personalityTypes.title')}</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              {t('personalityTypes.description')}
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <Card className="hover:shadow-lg transition-shadow border-l-4 border-l-red-500">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Heart className="h-5 w-5 text-red-500" />
                  <CardTitle className="text-lg">{t('personalityTypes.types.creative.title')}</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">
                  {t('personalityTypes.types.creative.description')}
                </p>
                <div className="flex flex-wrap gap-2">
                  {(t('personalityTypes.types.creative.tags', { returnObjects: true }) as string[]).map((tag, index) => (
                    <Badge key={index} variant="secondary">{tag}</Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
            
            <Card className="hover:shadow-lg transition-shadow border-l-4 border-l-blue-500">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Target className="h-5 w-5 text-blue-500" />
                  <CardTitle className="text-lg">{t('personalityTypes.types.skilled.title')}</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">
                  {t('personalityTypes.types.skilled.description')}
                </p>
                <div className="flex flex-wrap gap-2">
                  {(t('personalityTypes.types.skilled.tags', { returnObjects: true }) as string[]).map((tag, index) => (
                    <Badge key={index} variant="secondary">{tag}</Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
            
            <Card className="hover:shadow-lg transition-shadow border-l-4 border-l-green-500">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Globe className="h-5 w-5 text-green-500" />
                  <CardTitle className="text-lg">{t('personalityTypes.types.purposeDriven.title')}</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">
                  {t('personalityTypes.types.purposeDriven.description')}
                </p>
                <div className="flex flex-wrap gap-2">
                  {(t('personalityTypes.types.purposeDriven.tags', { returnObjects: true }) as string[]).map((tag, index) => (
                    <Badge key={index} variant="secondary">{tag}</Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
            
            <Card className="hover:shadow-lg transition-shadow border-l-4 border-l-yellow-500">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <DollarSign className="h-5 w-5 text-yellow-500" />
                  <CardTitle className="text-lg">{t('personalityTypes.types.careerFocused.title')}</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">
                  {t('personalityTypes.types.careerFocused.description')}
                </p>
                <div className="flex flex-wrap gap-2">
                  {(t('personalityTypes.types.careerFocused.tags', { returnObjects: true }) as string[]).map((tag, index) => (
                    <Badge key={index} variant="secondary">{tag}</Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div className="text-center mt-12">
            <Link href="/test">
              <Button size="lg" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-4 text-lg font-semibold shadow-lg">
                {t('discoverYourType')}
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">{t('howItWorks.title')}</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              {t('howItWorks.description')}
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl font-bold text-blue-600">1</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">{t('howItWorksSteps.step1.title')}</h3>
              <p className="text-gray-600">
                {t('howItWorksSteps.step1.description')}
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl font-bold text-purple-600">2</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">{t('howItWorksSteps.step2.title')}</h3>
              <p className="text-gray-600">
                {t('howItWorksSteps.step2.description')}
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl font-bold text-green-600">3</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">{t('howItWorksSteps.step3.title')}</h3>
              <p className="text-gray-600">
                {t('howItWorksSteps.step3.description')}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* SEO Internal Links Section - Addresses ahrefs.com: No Outgoing Links & Orphan Pages */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Continue Your Ikigai Discovery</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Take the next step in your personal development journey with our comprehensive resources.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Link href="/test" className="group">
              <Card className="hover:shadow-lg transition-shadow border-l-4 border-l-blue-500">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 group-hover:text-blue-600">
                    <Target className="h-5 w-5" />
                    Take Ikigai Test
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">Start your personalized assessment to discover your unique life purpose and career path.</p>
                </CardContent>
              </Card>
            </Link>
            
            <Link href="/blog" className="group">
              <Card className="hover:shadow-lg transition-shadow border-l-4 border-l-purple-500">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 group-hover:text-purple-600">
                    <BookOpen className="h-5 w-5" />
                    Purpose Insights Blog
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">Read expert insights on finding meaning, purpose, and fulfillment in your personal and professional life.</p>
                </CardContent>
              </Card>
            </Link>
            
            <Link href="/what-is-ikigai" className="group">
              <Card className="hover:shadow-lg transition-shadow border-l-4 border-l-green-500">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 group-hover:text-green-600">
                    <Globe className="h-5 w-5" />
                    Japanese Philosophy
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">Learn about the ancient wisdom of Ikigai and how it applies to modern life and career decisions.</p>
                </CardContent>
              </Card>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">{t('readySection.title')}</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto opacity-90">
            {t('readySection.subtitle')}
          </p>
          <Link href="/test">
            <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-4 text-lg font-semibold">
              {t('readySection.startButton')}
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}