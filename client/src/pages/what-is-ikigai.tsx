import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
  User, 
  Lightbulb,
  Users,
  ArrowRight,
  Clock,
  Brain,
  Shield,
  Coffee,
  BookOpen,
  Smile,
  Activity,
  HelpCircle,
  Search,
  Eye,
  Link2,
  Zap,
  Compass,
  Calendar,
  Palette,
  BarChart3} from "lucide-react";

export default function WhatIsIkigai() {
  const { t, ready, i18n } = useTranslation('whatIsIkigai');
  const { getPath, currentLanguage } = useLocalizedPath();
  const [isLoading, setIsLoading] = useState(true);
  
  // Check if current language is French
  const isFrench = currentLanguage === 'fr' || i18n.language === 'fr';
  
  useEffect(() => {
    if (ready) {
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
    "url": "https://www.ikigain.org/what-is-ikigai",
    "dateModified": "2025-07-28",
    "datePublished": "2024-01-01",
    "author": {
      "@type": "Organization",
      "name": "Ikigain",
      "url": "https://www.ikigain.org"
    },
    "mainEntity": {
      "@type": "Thing",
      "name": "Ikigai",
      "description": "A Japanese concept meaning 'reason for being' or life's purpose, found at the intersection of what you love, what you're good at, what the world needs, and what you can be paid for.",
      "alternateName": ["生き甲斐", "ikigai philosophy", "Japanese life purpose"],
      "sameAs": [
        "https://en.wikipedia.org/wiki/Ikigai",
        "https://www.japan.go.jp/kizuna/2022/03/ikigai_japanese_secret_to_a_joyful_life.html"
      ]
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
          "name": "What is Ikigai",
          "item": "https://www.ikigain.org/what-is-ikigai"
        }
      ]
    },
    "faqPage": {
      "@type": "FAQPage",
      "mainEntity": [
        {
          "@type": "Question",
          "name": "What does Ikigai mean in Japanese?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Ikigai (生き甲斐) combines two Japanese words: 'iki' meaning 'life' and 'gai' meaning 'value' or 'worth.' It literally translates to 'reason for being' or 'life's purpose.' The concept has been central to Japanese culture for over 1,000 years."
          }
        },
        {
          "@type": "Question",
          "name": "How do you pronounce Ikigai?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Ikigai is pronounced 'ee-kee-guy' (ē-kē-gī). The emphasis is placed evenly across all three syllables, with each vowel sound clearly articulated."
          }
        },
        {
          "@type": "Question",
          "name": "What are the 4 pillars of Ikigai?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "The 4 pillars of Ikigai are: What You Love (passion), What You're Good At (skills), What the World Needs (mission), and What You Can Be Paid For (profession). While this framework was popularized in the West, traditional Japanese Ikigai focuses more on what brings joy and meaning to daily life."
          }
        }
      ]
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <SEO
        title={t('seo.title', {
          fallbackLng: 'en',
          defaultValue: t('title')
        })}
        description={t('seo.description', {
          fallbackLng: 'en', 
          defaultValue: t('description')
        })}
        keywords={t('seo.keywords', {
          fallbackLng: 'en',
          defaultValue: "what is ikigai, ikigai meaning, ikigai japanese philosophy, life purpose, ikigai concept, japanese life philosophy"
        })}
        canonical={currentLanguage === 'es' ? `https://www.ikigain.org/es/what-is-ikigai` : currentLanguage === 'fr' ? `https://www.ikigain.org/fr/what-is-ikigai` : `https://www.ikigain.org/what-is-ikigai`}
        ogTitle={t('seo.ogTitle', {
          fallbackLng: 'en',
          defaultValue: "What is Ikigai? - Complete Guide to Japanese Philosophy"
        })}
        ogDescription={t('seo.ogDescription', {
          fallbackLng: 'en',
          defaultValue: "Discover the true meaning of Ikigai, the Japanese philosophy that has helped millions find their life's purpose and well-being."
        })}
        structuredData={structuredData}
        language={currentLanguage}
      />
      <Navigation />
      
      {/* Hero Section */}
      <header className="relative bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 py-24">
        <div className="absolute inset-0 bg-white/10"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-8 leading-tight">
              {t('hero.title', {
                defaultValue: isFrench ? "Qu'est-ce que l'Ikigai?" : "What is Ikigai?"
              })}
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 mb-10 max-w-4xl mx-auto leading-relaxed">
              {t('hero.description', {
                defaultValue: isFrench 
                  ? "L'Ikigai (生き甲斐) est un concept japonais ancien qui signifie 'raison d'être' ou 'but de la vie'. C'est l'intersection magique entre passion, mission, vocation et profession."
                  : "Ikigai (生き甲斐) is an ancient Japanese concept meaning 'reason for being' or 'life's purpose'. It's the magical intersection between passion, mission, vocation, and profession."
              })}
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <Link href={getPath("/test")}>
                <Button size="lg" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-10 py-5 text-lg font-semibold shadow-xl transform hover:scale-105 transition-all duration-300 rounded-full">
                  {isFrench ? "Passer le Test Ikigai" : "Take Ikigai Test"}
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link href={getPath("/ikigai-type-test")}>
                <Button size="lg" variant="outline" className="border-2 border-blue-600 text-blue-600 hover:bg-blue-50 px-10 py-5 text-lg font-semibold rounded-full transition-all duration-300">
                  {isFrench ? "Test de Type Rapide" : "Quick Type Test"}
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Introduction Section */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-12 leading-tight">
              {t('definition.title', {
                defaultValue: isFrench ? "Signification de l'Ikigai: La Vraie Définition" : "Ikigai Meaning: The True Definition"
              })}
            </h2>
            <div className="max-w-5xl mx-auto">
              <p className="text-xl text-gray-600 mb-10 leading-relaxed">
                {t('definition.meaning', {
                  defaultValue: isFrench 
                    ? "En japonais, 'iki' signifie 'vie' et 'gai' signifie 'valeur' ou 'mérite'. Ensemble, l'Ikigai représente ce qui donne de la valeur et du sens à votre existence."
                    : "In Japanese, 'iki' means 'life' and 'gai' means 'value' or 'worth.' Together, Ikigai represents what gives value and meaning to your existence."
                })}
              </p>
              <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-10 mb-12 shadow-sm">
                <p className="text-xl text-gray-700 mb-6 leading-relaxed">
                  {t('definition.philosophy', {
                    defaultValue: isFrench 
                      ? "Plus qu'un simple concept de carrière, l'Ikigai est une philosophie de vie holistique qui englobe votre bien-être émotionnel, votre épanouissement personnel et votre contribution au monde."
                      : "More than just a career concept, Ikigai is a holistic life philosophy that encompasses your emotional well-being, personal fulfillment, and contribution to the world."
                  })}
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left mb-12">
                <Card className="bg-gradient-to-br from-blue-50 to-blue-100 hover:shadow-lg transition-all duration-300 transform hover:scale-105 border-0">
                  <CardContent className="p-8">
                    <Coffee className="h-10 w-10 text-blue-600 mb-6" />
                    <p className="text-gray-700 text-lg leading-relaxed">
                      {isFrench ? "Prendre son temps pour savourer le café du matin" : "Taking time to savor your morning coffee"}
                    </p>
                  </CardContent>
                </Card>
                <Card className="bg-gradient-to-br from-green-50 to-green-100 hover:shadow-lg transition-all duration-300 transform hover:scale-105 border-0">
                  <CardContent className="p-8">
                    <Target className="h-10 w-10 text-green-600 mb-6" />
                    <p className="text-gray-700 text-lg leading-relaxed">
                      {isFrench ? "S'occuper de son jardin avec attention et soin" : "Tending to your garden with care and attention"}
                    </p>
                  </CardContent>
                </Card>
                <Card className="bg-gradient-to-br from-pink-50 to-pink-100 hover:shadow-lg transition-all duration-300 transform hover:scale-105 border-0">
                  <CardContent className="p-8">
                    <Heart className="h-10 w-10 text-pink-600 mb-6" />
                    <p className="text-gray-700 text-lg leading-relaxed">
                      {isFrench ? "Se promener tranquillement dans la nature" : "Taking peaceful walks in nature"}
                    </p>
                  </CardContent>
                </Card>
              </div>
              <p className="text-xl text-gray-600 font-medium">
                {isFrench 
                  ? "Ces petits moments de joie quotidienne représentent l'essence même de l'Ikigai - trouver du sens et du bonheur dans la simplicité de la vie."
                  : "These small moments of daily joy represent the very essence of Ikigai - finding meaning and happiness in life's simplicity."
                }
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Daily Life Section */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-12 leading-tight">
              {isFrench ? "L'Ikigai dans la Vie Quotidienne" : "Ikigai in Daily Life"}
            </h2>
            <div className="max-w-5xl mx-auto">
              <p className="text-xl text-gray-600 mb-12 leading-relaxed">
                {isFrench 
                  ? "Contrairement à l'interprétation occidentale axée sur la carrière, l'Ikigai japonais traditionnel se concentre sur les petits plaisirs et les moments significatifs de la vie quotidienne."
                  : "Unlike the Western career-focused interpretation, traditional Japanese Ikigai focuses on small pleasures and meaningful moments in daily life."
                }
              </p>
              <div className="bg-white rounded-2xl p-12 shadow-lg">
                <p className="text-xl text-gray-700 mb-8 leading-relaxed font-medium">
                  {isFrench 
                    ? "Sur l'île japonaise d'Okinawa, connue pour avoir l'une des plus longues espérances de vie au monde, les habitants décrivent leur Ikigai comme des activités simples : s'occuper de leurs petits-enfants, cultiver leur jardin, ou maintenir des amitiés de longue date."
                    : "On the Japanese island of Okinawa, known for having one of the world's longest life expectancies, residents describe their Ikigai as simple activities: caring for grandchildren, tending gardens, or maintaining lifelong friendships."
                  }
                </p>
                <p className="text-lg text-gray-600 leading-relaxed">
                  {isFrench 
                    ? "Les recherches montrent que les personnes ayant un fort sentiment d'Ikigai vivent plus longtemps, ont un risque réduit de maladie cardiaque et font l'expérience d'un plus grand bonheur au quotidien."
                    : "Research shows that people with a strong sense of Ikigai live longer, have reduced risk of heart disease, and experience greater daily happiness."
                  }
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Western Discovery Section */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-12 leading-tight">
              {isFrench ? "La Découverte Occidentale de l'Ikigai" : "Western Discovery of Ikigai"}
            </h2>
            <div className="max-w-5xl mx-auto">
              <p className="text-xl text-gray-600 mb-12 leading-relaxed">
                {isFrench 
                  ? "L'Occident a découvert l'Ikigai et l'a adapté en un modèle de développement personnel et professionnel. Cette interprétation, bien que différente de l'original japonais, offre des outils précieux pour l'épanouissement moderne."
                  : "The West discovered Ikigai and adapted it into a personal and professional development model. This interpretation, while different from the Japanese original, offers valuable tools for modern fulfillment."
                }
              </p>
              <div className="bg-gradient-to-r from-yellow-50 to-orange-50 border-l-8 border-yellow-400 p-10 rounded-2xl shadow-sm">
                <div className="flex items-start">
                  <Lightbulb className="h-8 w-8 text-yellow-600 mr-6 mt-1 flex-shrink-0" />
                  <div>
                    <p className="text-gray-700 mb-4 text-lg">
                      <strong>{isFrench ? "L'approche occidentale est-elle utile ?" : "Is the Western approach helpful?"}</strong> {isFrench ? "Absolument. Elle fournit un cadre structuré pour l'exploration de carrière et la découverte de soi dans le contexte moderne." : "Absolutely. It provides a structured framework for career exploration and self-discovery in modern contexts."}
                    </p>
                    <p className="text-gray-700 mb-4 text-lg">
                      <strong>{isFrench ? "Et l'approche japonaise traditionnelle ?" : "What about traditional Japanese approach?"}</strong> {isFrench ? "Tout aussi précieuse. Elle nous rappelle que le bonheur peut être trouvé dans les moments simples et les connexions humaines." : "Equally valuable. It reminds us that happiness can be found in simple moments and human connections."}
                    </p>
                    <p className="text-gray-700 text-lg leading-relaxed">
                      {isFrench 
                        ? "Les deux approches se complètent parfaitement, offrant à la fois des outils pratiques pour l'épanouissement professionnel et une sagesse profonde pour l'épanouissement personnel."
                        : "Both approaches complement each other perfectly, offering both practical tools for professional fulfillment and profound wisdom for personal well-being."
                      }
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Four Pillars Section */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-12 leading-tight">
              {t('fourPillars.title', {
                defaultValue: isFrench ? "Les 4 Piliers de l'Ikigai" : "The 4 Pillars of Ikigai"
              })}
            </h2>
            <div className="max-w-5xl mx-auto">
              <p className="text-xl text-gray-600 mb-16 leading-relaxed">
                {t('fourPillars.subtitle', {
                  defaultValue: isFrench 
                    ? "Découvrez l'intersection de ces quatre éléments essentiels"
                    : "Discover the intersection of these four essential elements"
                })}
              </p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <Card className="border-l-8 border-l-red-500 hover:shadow-xl transition-all duration-300 transform hover:scale-105 group bg-gradient-to-br from-red-50 to-red-100 border-0">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-3 text-red-600 group-hover:text-red-700">
                  <Heart className="h-8 w-8" />
                  <h3 className="text-xl font-bold">
                    {t('fourPillars.passion.title', {
                      defaultValue: isFrench ? "Ce que vous AIMEZ" : "What You LOVE"
                    })}
                  </h3>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 leading-relaxed text-lg">
                  {t('fourPillars.passion.description', {
                    defaultValue: isFrench 
                      ? "Vos intérêts profonds, ce qui vous passionne et vous fait perdre la notion du temps. C'est ce qui vous donne de la joie et de l'énergie."
                      : "Your deep interests, what excites you and makes you lose track of time. This is what brings you joy and energy."
                  })}
                </p>
              </CardContent>
            </Card>
            
            <Card className="border-l-8 border-l-blue-500 hover:shadow-xl transition-all duration-300 transform hover:scale-105 group bg-gradient-to-br from-blue-50 to-blue-100 border-0">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-3 text-blue-600 group-hover:text-blue-700">
                  <Target className="h-8 w-8" />
                  <h3 className="text-xl font-bold">
                    {t('fourPillars.vocation.title', {
                      defaultValue: isFrench ? "Ce en quoi vous êtes DOUÉ" : "What You're GOOD AT"
                    })}
                  </h3>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 leading-relaxed text-lg">
                  {t('fourPillars.vocation.description', {
                    defaultValue: isFrench 
                      ? "Vos talents naturels, compétences et forces. Ce sont les domaines où vous excellez naturellement ou pouvez développer une expertise."
                      : "Your natural talents, skills, and strengths. These are areas where you naturally excel or can develop expertise."
                  })}
                </p>
              </CardContent>
            </Card>
            
            <Card className="border-l-8 border-l-green-500 hover:shadow-xl transition-all duration-300 transform hover:scale-105 group bg-gradient-to-br from-green-50 to-green-100 border-0">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-3 text-green-600 group-hover:text-green-700">
                  <Globe className="h-8 w-8" />
                  <h3 className="text-xl font-bold">
                    {t('fourPillars.mission.title', {
                      defaultValue: isFrench ? "Ce dont le monde a BESOIN" : "What the World NEEDS"
                    })}
                  </h3>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 leading-relaxed text-lg">
                  {t('fourPillars.mission.description', {
                    defaultValue: isFrench 
                      ? "Les problèmes que vous voulez résoudre, l'impact que vous voulez avoir. C'est votre façon de contribuer positivement au monde."
                      : "The problems you want to solve, the impact you want to make. This is your way of contributing positively to the world."
                  })}
                </p>
              </CardContent>
            </Card>
            
            <Card className="border-l-8 border-l-purple-500 hover:shadow-xl transition-all duration-300 transform hover:scale-105 group bg-gradient-to-br from-purple-50 to-purple-100 border-0">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-3 text-purple-600 group-hover:text-purple-700">
                  <DollarSign className="h-8 w-8" />
                  <h3 className="text-xl font-bold">
                    {t('fourPillars.profession.title', {
                      defaultValue: isFrench ? "Ce pour quoi vous pouvez être PAYÉ" : "What You Can Be PAID FOR"
                    })}
                  </h3>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 leading-relaxed text-lg">
                  {t('fourPillars.profession.description', {
                    defaultValue: isFrench 
                      ? "Les opportunités économiques viables, les besoins du marché que vous pouvez satisfaire avec vos compétences et passions."
                      : "The viable economic opportunities, market needs you can fulfill with your skills and passions."
                  })}
                </p>
              </CardContent>
            </Card>
          </div>
          
          <div className="text-center mt-16">
            <p className="text-xl text-gray-600 max-w-5xl mx-auto leading-relaxed font-medium">
              {isFrench 
                ? "Quand ces quatre piliers s'alignent - passion, compétence, mission et profession - vous découvrez votre Ikigai occidental : un chemin vers l'épanouissement à la fois personnel et professionnel."
                : "When these four pillars align - passion, skill, mission, and profession - you discover your Western Ikigai: a path to both personal and professional fulfillment."
              }
            </p>
          </div>
        </div>
      </section>

      {/* Why Ikigai Matters Section */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-12 leading-tight">
              {isFrench ? "Pourquoi l'Ikigai est Important" : "Why Ikigai Matters"}
            </h2>
            <p className="text-xl text-gray-600 max-w-5xl mx-auto mb-16 leading-relaxed">
              {isFrench 
                ? "Au-delà de la philosophie, l'Ikigai a des effets mesurables et profonds sur votre santé, votre bonheur et votre longévité. La recherche révèle des avantages remarquables pour ceux qui vivent avec un fort sentiment d'Ikigai."
                : "Beyond philosophy, Ikigai has measurable, profound effects on your health, happiness, and longevity. Research reveals remarkable benefits for those living with a strong sense of Ikigai."
              }
            </p>
          </div>

          {/* Health Benefits Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
            <Card className="bg-gradient-to-br from-blue-50 to-blue-100 hover:shadow-xl transition-all duration-300 transform hover:scale-105 border-0">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-3 text-blue-600">
                  <Smile className="h-8 w-8" />
                  <span className="text-xl font-bold">
                    {isFrench ? "Santé Mentale" : "Mental Health"}
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="flex items-center gap-3">
                    <div className="w-4 h-4 bg-green-500 rounded-full flex-shrink-0"></div>
                    <span className="text-gray-700 text-lg">
                      {isFrench ? "Réduction de 50% des symptômes dépressifs" : "50% reduction in depressive symptoms"}
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-4 h-4 bg-green-500 rounded-full flex-shrink-0"></div>
                    <span className="text-gray-700 text-lg">
                      {isFrench ? "Amélioration significative de l'estime de soi" : "Significant improvement in self-esteem"}
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-4 h-4 bg-green-500 rounded-full flex-shrink-0"></div>
                    <span className="text-gray-700 text-lg">
                      {isFrench ? "Meilleure résilience face au stress" : "Better resilience to stress"}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-green-50 to-green-100 hover:shadow-xl transition-all duration-300 transform hover:scale-105 border-0">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-3 text-green-600">
                  <Shield className="h-8 w-8" />
                  <span className="text-xl font-bold">
                    {isFrench ? "Vieillissement Sain" : "Healthy Aging"}
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="flex items-center gap-3">
                    <div className="w-4 h-4 bg-green-500 rounded-full flex-shrink-0"></div>
                    <span className="text-gray-700 text-lg">
                      {isFrench ? "7 années de vie supplémentaires en moyenne" : "7 years longer life expectancy on average"}
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-4 h-4 bg-green-500 rounded-full flex-shrink-0"></div>
                    <span className="text-gray-700 text-lg">
                      {isFrench ? "Meilleure fonction cognitive avec l'âge" : "Better cognitive function with age"}
                    </span>
                  </div>
                  <div className="text-base text-gray-600 mt-6 font-medium">
                    {isFrench 
                      ? "Étude sur 43,000 adultes japonais pendant 7 ans"
                      : "Study of 43,000 Japanese adults over 7 years"
                    }
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-purple-50 to-purple-100 hover:shadow-xl transition-all duration-300 transform hover:scale-105 border-0">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-3 text-purple-600">
                  <Activity className="h-8 w-8" />
                  <span className="text-xl font-bold">
                    {isFrench ? "Longévité" : "Longevity"}
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="flex items-center gap-3">
                    <div className="w-4 h-4 bg-red-500 rounded-full flex-shrink-0"></div>
                    <span className="text-gray-700 text-lg">
                      {isFrench ? "Réduction de 19% du risque cardiovasculaire" : "19% lower risk of cardiovascular disease"}
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-4 h-4 bg-red-500 rounded-full flex-shrink-0"></div>
                    <span className="text-gray-700 text-lg">
                      {isFrench ? "Réduction de 17% du risque de cancer" : "17% lower risk of cancer"}
                    </span>
                  </div>
                  <div className="text-base text-gray-600 mt-6 font-medium">
                    {isFrench 
                      ? "Recherche publiée dans Psychosomatic Medicine"
                      : "Research published in Psychosomatic Medicine"
                    }
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Detailed Studies Section */}
          <div className="bg-gradient-to-br from-gray-50 to-blue-50 rounded-2xl p-12 mb-20 shadow-lg">
            <div className="text-center mb-16">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-6">
                <Activity className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-3xl font-bold text-gray-900 mb-4">
                {isFrench ? "Résultats de Recherche" : "Research Findings"}
              </h3>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                {isFrench 
                  ? "Des décennies de recherche scientifique révèlent l'impact profond de l'Ikigai sur la santé humaine et le bien-être."
                  : "Decades of scientific research reveal Ikigai's profound impact on human health and well-being."
                }
              </p>
            </div>
            
            {/* Happiness and Life Satisfaction */}
            <div className="mb-16">
              <div className="flex items-center gap-4 mb-8">
                <div className="flex items-center justify-center w-12 h-12 bg-yellow-100 rounded-full">
                  <Smile className="h-6 w-6 text-yellow-600" />
                </div>
                <h4 className="text-2xl font-semibold text-gray-900">
                  {isFrench ? "Bonheur et Satisfaction de Vie" : "Happiness and Life Satisfaction"}
                </h4>
              </div>
              <div className="bg-white rounded-xl p-8 shadow-sm">
                <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                  {isFrench 
                    ? "Une étude longitudinale de l'Université de Rochester avec 9,000 participants a trouvé que les individus avec un fort sentiment d'Ikigai rapportent des niveaux significativement plus élevés de bonheur, de satisfaction de vie et de résilience psychologique."
                    : "A longitudinal study by the University of Rochester with 9,000 participants found that individuals with a strong sense of Ikigai report significantly higher levels of happiness, life satisfaction, and psychological resilience."
                  }
                </p>
                <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                  {isFrench 
                    ? "Les personnes avec un Ikigai clair montrent une réduction de 50% des symptômes de dépression et d'anxiété, même face aux défis de la vie."
                    : "People with clear Ikigai show a 50% reduction in depression and anxiety symptoms, even when facing life challenges."
                  }
                </p>
                <div className="bg-yellow-50 border-l-4 border-yellow-400 p-6 rounded-lg">
                  <p className="text-lg text-gray-700 italic">
                    "{t('researchFindings.happiness.quote')}"
                  </p>
                </div>
              </div>
            </div>

            {/* It may increase the number of health years */}
            <div className="mb-12">
              <h4 className="text-xl font-semibold text-gray-900 mb-4">
                {isFrench ? "Cela peut augmenter le nombre d'années de santé" : "It may increase the number of health years"}
              </h4>
              <p className="text-gray-600 mb-4">
                {isFrench 
                  ? "La recherche montre que l'Ikigai contribue non seulement à une vie plus longue, mais aussi à plus d'années vécues en bonne santé."
                  : "Research shows that Ikigai contributes not just to longer life, but to more years lived in good health."
                }
              </p>
              <p className="text-gray-600 mb-4">
                {isFrench 
                  ? "Une étude de 2008 dans Psychosomatic Medicine a suivi 43,000 adultes japonais pendant 7 ans."
                  : "A 2008 study in Psychosomatic Medicine followed 43,000 Japanese adults for 7 years."
                }
              </p>
              <p className="text-gray-600 mb-4">
                {isFrench 
                  ? "Les participants avec un fort sentiment d'Ikigai avaient significativement :"
                  : "Participants with strong Ikigai had significantly:"
                }
              </p>
              <ul className="space-y-2 text-gray-600 mb-4">
                <li>• {isFrench ? "Moins de maladies cardiovasculaires" : "Lower rates of cardiovascular disease"}</li>
                <li>• {isFrench ? "Meilleure fonction cognitive" : "Better cognitive function"}</li>
              </ul>
              <p className="text-gray-600">
                {isFrench 
                  ? "Cela suggère que l'Ikigai prolonge non seulement la vie, mais maintient aussi la qualité de vie à mesure que nous vieillissons."
                  : "This suggests Ikigai not only extends life but maintains quality of life as we age."
                }
              </p>
            </div>

            {/* Lower mortality risk */}
            <div className="mb-12">
              <h4 className="text-xl font-semibold text-gray-900 mb-4">{t('researchFindings.mortality.title')}</h4>
              <p className="text-gray-600 mb-4">
                {t('researchFindings.mortality.description1')}
              </p>
              <p className="text-gray-600 mb-4">
                {t('researchFindings.mortality.description2')}
              </p>
              <p className="text-gray-600 mb-4">{t('researchFindings.mortality.description3')}</p>
              <ul className="space-y-2 text-gray-600 mb-4">
                <li>• {t('researchFindings.mortality.risks.0')}</li>
                <li>• {t('researchFindings.mortality.risks.1')}</li>
                <li>• {t('researchFindings.mortality.risks.2')}</li>
              </ul>
              <p className="text-gray-600 mb-4">
                {t('researchFindings.mortality.conclusion1')}
              </p>
              <p className="text-gray-600">
                {t('researchFindings.mortality.conclusion2')}
              </p>
            </div>

            {/* Ikigai and the unemployed */}
            <div className="mb-12">
              <h4 className="text-xl font-semibold text-gray-900 mb-4">{t('researchFindings.unemployed.title')}</h4>
              <p className="text-gray-600 mb-4">
                {t('researchFindings.unemployed.description1')}
              </p>
              <p className="text-gray-600 mb-4">
                {t('researchFindings.unemployed.description2')}
              </p>
              <ul className="space-y-2 text-gray-600 mb-4">
                <li>• {t('researchFindings.unemployed.benefits.0')}</li>
                <li>• {t('researchFindings.unemployed.benefits.1')}</li>
              </ul>
              <p className="text-gray-600">
                {t('researchFindings.unemployed.conclusion')}
              </p>
            </div>

            {/* Ikigai and purposeful work */}
            <div className="mb-12">
              <h4 className="text-xl font-semibold text-gray-900 mb-4">{t('researchFindings.purposefulWork.title')}</h4>
              <p className="text-gray-600 mb-4">
                {t('researchFindings.purposefulWork.description1')}
              </p>
              <p className="text-gray-600 mb-4">
                {t('researchFindings.purposefulWork.description2')}
              </p>
              <p className="text-gray-600 mb-4">{t('researchFindings.purposefulWork.description3')}</p>
              <ul className="space-y-2 text-gray-600 mb-4">
                <li>• {t('researchFindings.purposefulWork.genderDifferences.0')}</li>
                <li>• {t('researchFindings.purposefulWork.genderDifferences.1')}</li>
              </ul>
              <p className="text-gray-600">
                {t('researchFindings.purposefulWork.conclusion')}
              </p>
            </div>

            {/* Ikigai may motivate you to lead a healthy life */}
            <div className="mb-8">
              <h4 className="text-xl font-semibold text-gray-900 mb-4">{t('researchFindings.healthyLife.title')}</h4>
              <p className="text-gray-600 mb-4">
                {t('researchFindings.healthyLife.description1')}
              </p>
              <p className="text-gray-600 mb-4">
                {t('researchFindings.healthyLife.description2')}
              </p>
              <p className="text-gray-600 mb-4">
                {t('researchFindings.healthyLife.description3')}
              </p>
              <p className="text-gray-600 mb-4">
                {t('researchFindings.healthyLife.description4')}
              </p>
              <p className="text-gray-600">
                {t('researchFindings.healthyLife.conclusion')}
              </p>
            </div>
          </div>

          <div className="text-center">
            <p className="text-xl text-gray-600 max-w-5xl mx-auto leading-relaxed font-medium">
              {t('researchFindings.conclusion')}
            </p>
          </div>
        </div>
      </section>

      {/* Finding Your Ikigai Section */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-12 leading-tight">
              {isFrench ? "Trouver Votre Ikigai" : "Finding Your Ikigai"}
            </h2>
            <p className="text-xl text-gray-600 max-w-5xl mx-auto mb-16 leading-relaxed">
              {isFrench 
                ? "Découvrir votre Ikigai est un voyage de découverte de soi qui demande une réflexion honnête et une exploration consciente. Notre approche combine la sagesse japonaise traditionnelle avec les outils modernes de développement personnel."
                : "Discovering your Ikigai is a journey of self-discovery that requires honest reflection and mindful exploration. Our approach combines traditional Japanese wisdom with modern personal development tools."
              }
            </p>
          </div>

          <div className="bg-white rounded-2xl p-12 mb-20 shadow-lg">
            <h3 className="text-3xl font-bold text-gray-900 mb-12 text-center">
              {isFrench ? "Questions Fondamentales pour Votre Réflexion" : "Essential Questions for Your Reflection"}
            </h3>
            <p className="text-lg text-gray-600 mb-12 text-center max-w-4xl mx-auto leading-relaxed">
              {isFrench 
                ? "Ces questions vous guideront vers la découverte de votre Ikigai unique. Prenez le temps de les méditer profondément."
                : "These questions will guide you toward discovering your unique Ikigai. Take time to reflect deeply on each one."
              }
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <Card className="border-l-8 border-l-blue-500 hover:shadow-lg transition-all duration-300 transform hover:scale-105 bg-gradient-to-br from-blue-50 to-blue-100 border-0">
                <CardContent className="p-8">
                  <div className="flex items-start gap-4">
                    <Clock className="h-8 w-8 text-blue-600 mt-1 flex-shrink-0" />
                    <div>
                      <h4 className="font-bold text-gray-900 mb-3 text-lg">
                        {isFrench ? "Quelles activités vous font perdre la notion du temps ?" : "What activities make you lose track of time?"}
                      </h4>
                      <p className="text-gray-600 text-base leading-relaxed">
                        {isFrench 
                          ? "Remarquez quand vous êtes complètement absorbé dans ce que vous faites."
                          : "Notice when you're completely absorbed in what you're doing."
                        }
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-l-8 border-l-green-500 hover:shadow-lg transition-all duration-300 transform hover:scale-105 bg-gradient-to-br from-green-50 to-green-100 border-0">
                <CardContent className="p-8">
                  <div className="flex items-start gap-4">
                    <Heart className="h-8 w-8 text-green-600 mt-1 flex-shrink-0" />
                    <div>
                      <h4 className="font-bold text-gray-900 mb-3 text-lg">
                        {isFrench ? "Qu'aimiez-vous faire quand vous étiez enfant ?" : "What did you love doing as a child?"}
                      </h4>
                      <p className="text-gray-600 text-base leading-relaxed">
                        {isFrench 
                          ? "Souvent nos premiers intérêts pointent vers notre vrai moi."
                          : "Often our earliest interests point to our authentic selves."
                        }
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-l-8 border-l-purple-500 hover:shadow-lg transition-all duration-300 transform hover:scale-105 bg-gradient-to-br from-purple-50 to-purple-100 border-0">
                <CardContent className="p-8">
                  <div className="flex items-start gap-4">
                    <User className="h-8 w-8 text-purple-600 mt-1 flex-shrink-0" />
                    <div>
                      <h4 className="font-bold text-gray-900 mb-3 text-lg">
                        {isFrench ? "Que feriez-vous si vous ne vous inquiétiez pas de ce que pensent les autres ?" : "What would you do if you weren't worried about what others think?"}
                      </h4>
                      <p className="text-gray-600 text-base leading-relaxed">
                        {isFrench 
                          ? "Ceci révèle ce qui compte vraiment pour vous, pas ce que vous pensez qui devrait compter."
                          : "This reveals what truly matters to you, not what you think should matter."
                        }
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-l-8 border-l-red-500 hover:shadow-lg transition-all duration-300 transform hover:scale-105 bg-gradient-to-br from-red-50 to-red-100 border-0">
                <CardContent className="p-8">
                  <div className="flex items-start gap-4">
                    <Target className="h-8 w-8 text-red-600 mt-1 flex-shrink-0" />
                    <div>
                      <h4 className="font-bold text-gray-900 mb-3 text-lg">
                        {isFrench ? "Quels problèmes voulez-vous naturellement résoudre ?" : "What problems do you naturally want to solve?"}
                      </h4>
                      <p className="text-gray-600 text-base leading-relaxed">
                        {isFrench 
                          ? "Portez attention à ce qui vous frustre ou vous motive dans le monde."
                          : "Pay attention to what frustrates or motivates you in the world."
                        }
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-l-8 border-l-yellow-500 hover:shadow-lg transition-all duration-300 transform hover:scale-105 bg-gradient-to-br from-yellow-50 to-yellow-100 border-0">
                <CardContent className="p-8">
                  <div className="flex items-start gap-4">
                    <DollarSign className="h-8 w-8 text-yellow-600 mt-1 flex-shrink-0" />
                    <div>
                      <h4 className="font-bold text-gray-900 mb-3 text-lg">
                        {isFrench ? "Que feriez-vous si l'argent n'était pas un problème ?" : "What would you do if money wasn't a concern?"}
                      </h4>
                      <p className="text-gray-600 text-base leading-relaxed">
                        {isFrench 
                          ? "Ceci vous aide à identifier vos vraies motivations au-delà des nécessités financières."
                          : "This helps identify your core motivations beyond financial necessities."
                        }
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-l-8 border-l-indigo-500 hover:shadow-lg transition-all duration-300 transform hover:scale-105 bg-gradient-to-br from-indigo-50 to-indigo-100 border-0">
                <CardContent className="p-8">
                  <div className="flex items-start gap-4">
                    <Users className="h-8 w-8 text-indigo-600 mt-1 flex-shrink-0" />
                    <div>
                      <h4 className="font-bold text-gray-900 mb-3 text-lg">
                        {isFrench ? "Que demandent constamment les gens de votre aide ?" : "What do people consistently ask for your help with?"}
                      </h4>
                      <p className="text-gray-600 text-base leading-relaxed">
                        {isFrench 
                          ? "Vos talents naturels sont souvent évidents pour les autres avant vous."
                          : "Your natural strengths are often obvious to others before they are to you."
                        }
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-l-8 border-l-pink-500 md:col-span-2 hover:shadow-lg transition-all duration-300 transform hover:scale-105 bg-gradient-to-br from-pink-50 to-pink-100 border-0">
                <CardContent className="p-8">
                  <div className="flex items-start gap-4">
                    <HelpCircle className="h-8 w-8 text-pink-600 mt-1 flex-shrink-0" />
                    <div>
                      <h4 className="font-bold text-gray-900 mb-3 text-lg">
                        {isFrench ? "Comment voulez-vous être utile au monde ?" : "How do you want to be useful to the world?"}
                      </h4>
                      <p className="text-gray-600 text-base leading-relaxed">
                        {isFrench 
                          ? "C'est votre façon unique de contribuer et de laisser un impact positif."
                          : "This is your unique way of contributing and making a positive impact."
                        }
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Finding Common Denominators */}
          <div className="bg-white rounded-2xl p-12 mb-20 shadow-lg relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-purple-100 to-pink-100 rounded-full -translate-y-16 translate-x-16 opacity-50"></div>
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full translate-y-12 -translate-x-12 opacity-50"></div>
            
            <div className="text-center mb-12 relative z-10">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-purple-100 rounded-full mb-6">
                <Search className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="text-3xl font-bold text-gray-900 mb-4">
                {isFrench ? "Dénominateurs Communs" : "Common Denominators"}
              </h3>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                {isFrench 
                  ? "Une fois que vous avez réfléchi à ces questions, recherchez les thèmes et les modèles récurrents dans vos réponses."
                  : "Once you've reflected on these questions, look for recurring themes and patterns in your answers."
                }
              </p>
            </div>
            
            <div className="max-w-5xl mx-auto relative z-10">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
                <div className="text-center">
                  <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-100 rounded-full mb-4">
                    <Eye className="h-6 w-6 text-blue-600" />
                  </div>
                  <h4 className="font-semibold text-gray-900 mb-2">
                    {isFrench ? "Observer" : "Observe"}
                  </h4>
                  <p className="text-sm text-gray-600">
                    {isFrench 
                      ? "Remarquez les patterns dans ce qui vous énergise versus ce qui vous épuise."
                      : "Notice patterns in what energizes you versus what drains you."
                    }
                  </p>
                </div>
                <div className="text-center">
                  <div className="inline-flex items-center justify-center w-12 h-12 bg-green-100 rounded-full mb-4">
                    <Link2 className="h-6 w-6 text-green-600" />
                  </div>
                  <h4 className="font-semibold text-gray-900 mb-2">
                    {isFrench ? "Connecter" : "Connect"}
                  </h4>
                  <p className="text-sm text-gray-600">
                    {isFrench 
                      ? "Cherchez des thèmes dans différents domaines de votre vie."
                      : "Look for themes across different areas of your life."
                    }
                  </p>
                </div>
                <div className="text-center">
                  <div className="inline-flex items-center justify-center w-12 h-12 bg-yellow-100 rounded-full mb-4">
                    <Lightbulb className="h-6 w-6 text-yellow-600" />
                  </div>
                  <h4 className="font-semibold text-gray-900 mb-2">
                    {isFrench ? "Découvrir" : "Discover"}
                  </h4>
                  <p className="text-sm text-gray-600">
                    {isFrench 
                      ? "Trouvez les fils communs qui pointent vers votre ikigai unique."
                      : "Find the common threads that point to your unique ikigai."
                    }
                  </p>
                </div>
              </div>
              
              <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-8 mb-8">
                <p className="text-xl text-gray-700 mb-6 leading-relaxed">
                  {isFrench 
                    ? "Cherchez des patterns et des thèmes qui apparaissent constamment dans vos expériences les plus significatives."
                    : "Look for patterns and themes that appear consistently across your most meaningful experiences."
                  }
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-white rounded-lg p-6 shadow-sm">
                    <h5 className="font-semibold text-gray-900 mb-3">
                      {isFrench ? "Enseigner aux Autres" : "Teaching Others"}
                    </h5>
                    <p className="text-gray-600 text-sm">
                      {isFrench 
                        ? "Vous vous illuminez en expliquant des concepts ou en aidant les autres à apprendre."
                        : "You light up when explaining concepts or helping others learn."
                      }
                    </p>
                  </div>
                  <div className="bg-white rounded-lg p-6 shadow-sm">
                    <h5 className="font-semibold text-gray-900 mb-3">
                      {isFrench ? "Organisation et Systèmes" : "Organizing and Systems"}
                    </h5>
                    <p className="text-gray-600 text-sm">
                      {isFrench 
                        ? "Vous créez naturellement de l'ordre et de l'efficacité dans des situations chaotiques."
                        : "You naturally create order and efficiency in chaotic situations."
                      }
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="bg-blue-50 border-l-4 border-blue-400 p-6 rounded-lg">
                <p className="text-lg text-gray-700">
                  <strong>
                    {isFrench ? "Rappelez-vous :" : "Remember:"}
                  </strong> {isFrench 
                    ? "Votre ikigai n'a pas à être grandiose ou révolutionnaire. Il peut être aussi simple que de faire sourire quelqu'un ou de créer quelque chose de beau."
                    : "Your ikigai doesn't have to be grand or world-changing. It can be as simple as making someone smile or creating something beautiful."
                  }
                </p>
              </div>
            </div>
          </div>

          {/* Experimenting and Exploring */}
          <div className="bg-gradient-to-br from-gray-50 to-green-50 rounded-2xl p-12 mb-20 shadow-lg relative overflow-hidden">
            <div className="absolute top-0 left-0 w-40 h-40 bg-gradient-to-br from-green-100 to-blue-100 rounded-full -translate-y-20 -translate-x-20 opacity-30"></div>
            <div className="absolute bottom-0 right-0 w-32 h-32 bg-gradient-to-br from-yellow-100 to-green-100 rounded-full translate-y-16 translate-x-16 opacity-30"></div>
            
            <div className="text-center mb-12 relative z-10">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-6">
                <Compass className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-3xl font-bold text-gray-900 mb-4">
                {isFrench ? "Expérimentation et Exploration" : "Experimenting and Exploration"}
              </h3>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                {isFrench 
                  ? "Le véritable test de votre Ikigai vient de l'action. Commencez petit et expérimentez avec ce qui vous inspire."
                  : "The real test of your Ikigai comes through action. Start small and experiment with what inspires you."
                }
              </p>
            </div>
            
            <div className="max-w-5xl mx-auto relative z-10">
              <div className="bg-white rounded-xl p-8 mb-8 shadow-sm">
                <div className="flex items-center gap-4 mb-6">
                  <div className="flex items-center justify-center w-12 h-12 bg-blue-100 rounded-full">
                    <Zap className="h-6 w-6 text-blue-600" />
                  </div>
                  <h4 className="text-2xl font-semibold text-gray-900">
                    {isFrench ? "La Règle d'Or" : "The Golden Rule"}
                  </h4>
                </div>
                <p className="text-xl text-gray-600 mb-6 leading-relaxed">
                  {isFrench 
                    ? "N'attendez pas d'avoir tout découvert pour commencer à agir. L'Ikigai se révèle à travers l'expérience, pas seulement la réflexion."
                    : "Don't wait until you have it all figured out to start taking action. Ikigai reveals itself through experience, not just reflection."
                  }
                </p>
                <div className="bg-yellow-50 border-l-4 border-yellow-400 p-6 rounded-lg">
                  <p className="text-xl text-gray-700 font-semibold">
                    {isFrench 
                      ? "Commencez petit, mais commencez maintenant."
                      : "Start small, but start now."
                    }
                  </p>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                <div className="bg-white rounded-xl p-6 shadow-sm">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="flex items-center justify-center w-10 h-10 bg-purple-100 rounded-full">
                      <Users className="h-5 w-5 text-purple-600" />
                    </div>
                    <h5 className="font-semibold text-gray-900">
                      {isFrench ? "Exemple d'Enseignement" : "Teaching Example"}
                    </h5>
                  </div>
                  <p className="text-gray-600 leading-relaxed">
                    {isFrench 
                      ? "Si vous pensez que votre Ikigai implique l'enseignement, commencez par aider un ami, donnez un cours ou créez un tutoriel en ligne."
                      : "If you think your Ikigai involves teaching, start by helping a friend, giving a workshop, or creating an online tutorial."
                    }
                  </p>
                </div>
                <div className="bg-white rounded-xl p-6 shadow-sm">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="flex items-center justify-center w-10 h-10 bg-pink-100 rounded-full">
                      <Palette className="h-5 w-5 text-pink-600" />
                    </div>
                    <h5 className="font-semibold text-gray-900">
                      {isFrench ? "Exemple de Créativité" : "Creativity Example"}
                    </h5>
                  </div>
                  <p className="text-gray-600 leading-relaxed">
                    {isFrench 
                      ? "Si l'art fait partie de votre Ikigai, commencez par créer quelque chose de petit chaque jour pendant une semaine."
                      : "If art is part of your Ikigai, start by creating something small each day for a week."
                    }
                  </p>
                </div>
              </div>
              
              <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-xl p-8 mb-8">
                <div className="flex items-center gap-4 mb-6">
                  <div className="flex items-center justify-center w-12 h-12 bg-green-100 rounded-full">
                    <Calendar className="h-6 w-6 text-green-600" />
                  </div>
                  <h4 className="text-xl font-semibold text-gray-900">
                    {isFrench ? "Le Test du Week-end" : "The Weekend Test"}
                  </h4>
                </div>
                <p className="text-lg text-gray-700 mb-6 leading-relaxed">
                  {isFrench 
                    ? "Consacrez un week-end entier à explorer quelque chose qui vous intéresse. Observez votre niveau d'énergie, votre motivation et votre sentiment général."
                    : "Dedicate an entire weekend to exploring something that interests you. Notice your energy levels, motivation, and overall feelings."
                  }
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-white rounded-lg p-4 shadow-sm">
                    <h6 className="font-semibold text-green-600 mb-2">
                      {isFrench ? "Signes Énergisants :" : "Energizing Signs:"}
                    </h6>
                    <ul className="text-sm text-gray-600 space-y-1">
                      <li>• {isFrench ? "Le temps passe rapidement" : "Time flies by"}</li>
                      <li>• {isFrench ? "Vous vous sentez énergisé, pas épuisé" : "You feel energized, not drained"}</li>
                      <li>• {isFrench ? "Vous voulez continuer même quand c'est difficile" : "You want to continue even when it's challenging"}</li>
                    </ul>
                  </div>
                  <div className="bg-white rounded-lg p-4 shadow-sm">
                    <h6 className="font-semibold text-red-600 mb-2">
                      {isFrench ? "Signes Épuisants :" : "Draining Signs:"}
                    </h6>
                    <ul className="text-sm text-gray-600 space-y-1">
                      <li>• {isFrench ? "Vous comptez les heures" : "You're watching the clock"}</li>
                      <li>• {isFrench ? "Vous vous sentez épuisé après peu de temps" : "You feel drained after short periods"}</li>
                      <li>• {isFrench ? "Vous cherchez des distractions" : "You're looking for distractions"}</li>
                    </ul>
                  </div>
                </div>
              </div>
              
              <div className="bg-blue-50 border-l-4 border-blue-400 p-6 rounded-lg">
                <p className="text-lg text-gray-700">
                  <strong>{isFrench ? "Rappel :" : "Remember:"}</strong> {isFrench 
                    ? "L'Ikigai n'est pas statique. Il peut évoluer à mesure que vous grandissez et changez."
                    : "Ikigai isn't static. It can evolve as you grow and change."
                  }
                </p>
              </div>
            </div>
          </div>

          {/* Alignment */}
          <div className="bg-white rounded-2xl p-12 mb-20 shadow-lg relative overflow-hidden">
            <div className="absolute top-0 right-0 w-36 h-36 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full -translate-y-18 translate-x-18 opacity-40"></div>
            <div className="absolute bottom-0 left-0 w-28 h-28 bg-gradient-to-br from-green-100 to-blue-100 rounded-full translate-y-14 -translate-x-14 opacity-40"></div>
            
            <div className="text-center mb-12 relative z-10">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-6">
                <Target className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-3xl font-bold text-gray-900 mb-4">
                {isFrench ? "Alignement" : "Alignment"}
              </h3>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                {isFrench 
                  ? "Le vrai secret de l'Ikigai n'est pas de trouver votre passion parfaite, mais d'aligner progressivement votre vie avec ce qui compte vraiment pour vous."
                  : "The real secret of Ikigai isn't finding your perfect passion, but gradually aligning your life with what truly matters to you."
                }
              </p>
            </div>
            
            <div className="max-w-5xl mx-auto relative z-10">
              <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-8 mb-8">
                <p className="text-xl text-gray-700 mb-6 leading-relaxed">
                  {isFrench 
                    ? "L'alignement avec votre Ikigai peut commencer par de petits ajustements dans votre routine quotidienne ou nécessiter des changements plus importants dans votre carrière ou votre style de vie."
                    : "Alignment with your Ikigai might start with small adjustments in your daily routine or require bigger shifts in your career or lifestyle."
                  }
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                  <div className="bg-white rounded-lg p-6 shadow-sm">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="flex items-center justify-center w-10 h-10 bg-green-100 rounded-full">
                        <ArrowRight className="h-5 w-5 text-green-600" />
                      </div>
                      <h5 className="font-semibold text-gray-900">
                        {isFrench ? "Petits Ajustements" : "Small Adjustments"}
                      </h5>
                    </div>
                    <p className="text-gray-600 leading-relaxed">
                      {isFrench 
                        ? "Changer votre routine matinale, ajouter 15 minutes de créativité à votre journée, ou choisir des projets qui s'alignent mieux avec vos valeurs."
                        : "Changing your morning routine, adding 15 minutes of creativity to your day, or choosing projects that better align with your values."
                      }
                    </p>
                  </div>
                  
                  <div className="bg-white rounded-lg p-6 shadow-sm">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="flex items-center justify-center w-10 h-10 bg-purple-100 rounded-full">
                        <Zap className="h-5 w-5 text-purple-600" />
                      </div>
                      <h5 className="font-semibold text-gray-900">
                        {isFrench ? "Changements Plus Importants" : "Bigger Shifts"}
                      </h5>
                    </div>
                    <p className="text-gray-600 leading-relaxed">
                      {isFrench 
                        ? "Changer de carrière, déménager, ou restructurer radicalement votre style de vie pour mieux refléter qui vous êtes vraiment."
                        : "Changing careers, relocating, or radically restructuring your lifestyle to better reflect who you truly are."
                      }
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-xl p-8 mb-8">
                <div className="flex items-center gap-4 mb-6">
                  <div className="flex items-center justify-center w-12 h-12 bg-yellow-100 rounded-full">
                    <Lightbulb className="h-6 w-6 text-yellow-600" />
                  </div>
                  <h4 className="text-xl font-semibold text-gray-900">
                    {isFrench ? "L'Approche Ikigai" : "The Ikigai Approach"}
                  </h4>
                </div>
                <p className="text-lg text-gray-700 leading-relaxed">
                  {isFrench 
                    ? "Nous vous aidons à trouver votre chemin unique vers un but à travers une évaluation scientifique et des conseils personnalisés."
                    : "We help you find your unique path to purpose through scientific assessment and personalized guidance."
                  }
                </p>
              </div>
              
              <div className="bg-yellow-50 border-l-4 border-yellow-400 p-6 rounded-lg">
                <div className="flex items-center gap-3 mb-4">
                  <div className="flex items-center justify-center w-10 h-10 bg-yellow-100 rounded-full">
                    <BarChart3 className="h-5 w-5 text-yellow-600" />
                  </div>
                  <h5 className="font-semibold text-gray-900">
                    {isFrench ? "Progrès Plutôt Que Perfection" : "Progress Over Perfection"}
                  </h5>
                </div>
                <p className="text-lg text-gray-700 leading-relaxed">
                  {isFrench 
                    ? "Vous n'avez pas besoin d'un alignement parfait pour vivre de manière significative. De petits pas vers ce qui vous semble important peuvent transformer votre expérience quotidienne."
                    : "You don't need perfect alignment to live purposefully. Small steps toward what feels meaningful can transform your daily experience."
                  }
                </p>
              </div>
            </div>
          </div>



          {/* Embracing the Entire Process */}
          <div className="bg-white rounded-2xl p-12 mb-20 shadow-lg relative overflow-hidden">
            <div className="absolute top-0 left-0 w-40 h-40 bg-gradient-to-br from-yellow-100 to-orange-100 rounded-full -translate-y-20 -translate-x-20 opacity-30"></div>
            <div className="absolute bottom-0 right-0 w-36 h-36 bg-gradient-to-br from-purple-100 to-pink-100 rounded-full translate-y-18 translate-x-18 opacity-30"></div>
            
            <div className="text-center mb-12 relative z-10">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-yellow-100 to-orange-100 rounded-full mb-6">
                <Heart className="h-8 w-8 text-orange-600" />
              </div>
              <h3 className="text-3xl font-bold text-gray-900 mb-4">
                {isFrench ? "Embrasser le Processus" : "Embracing the Process"}
              </h3>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                {isFrench 
                  ? "Votre voyage ikigai vous est unique"
                  : "Your ikigai journey is unique to you"
                }
              </p>
            </div>
            
            <div className="max-w-5xl mx-auto relative z-10">
              <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-xl p-8 mb-8">
                <div className="flex items-center gap-4 mb-6">
                  <div className="flex items-center justify-center w-12 h-12 bg-yellow-100 rounded-full">
                    <BookOpen className="h-6 w-6 text-yellow-600" />
                  </div>
                  <h4 className="text-2xl font-semibold text-gray-900">
                    {isFrench ? "Comme Cultiver un Jardin" : "Like Tending a Garden"}
                  </h4>
                </div>
                <p className="text-xl text-gray-700 mb-6 leading-relaxed">
                  {isFrench 
                    ? "Trouver votre ikigai, c'est comme cultiver un jardin. Certains jours, vous vous sentirez parfaitement clair sur votre direction, d'autres jours pourraient sembler flous. Les deux sont normaux et précieux."
                    : "Finding your ikigai is like tending a garden. Some days you'll feel crystal clear about your direction, other days might feel fuzzy. Both are normal and valuable."
                  }
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl p-6 shadow-sm">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="flex items-center justify-center w-10 h-10 bg-blue-100 rounded-full">
                      <Smile className="h-5 w-5 text-blue-600" />
                    </div>
                    <h5 className="font-semibold text-gray-900">
                      {isFrench ? "Jours Cristallins" : "Crystal Clear Days"}
                    </h5>
                  </div>
                  <p className="text-gray-700 leading-relaxed">
                    {isFrench 
                      ? "Ce sont les jours où tout clique. Vous vous sentez énergisé, déterminé et aligné avec vos valeurs."
                      : "These are the days when everything clicks. You feel energized, purposeful, and aligned with your values."
                    }
                  </p>
                </div>
                
                <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-6 shadow-sm">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="flex items-center justify-center w-10 h-10 bg-purple-100 rounded-full">
                      <Brain className="h-5 w-5 text-purple-600" />
                    </div>
                    <h5 className="font-semibold text-gray-900">
                      {isFrench ? "Jours Flous" : "Fuzzy Days"}
                    </h5>
                  </div>
                  <p className="text-gray-700 leading-relaxed">
                    {isFrench 
                      ? "Ces jours se sentent peu clairs ou accablants. Ils sont des opportunités de réflexion et d'exploration douce."
                      : "These days feel unclear or overwhelming. They're opportunities for reflection and gentle exploration."
                    }
                  </p>
                </div>
              </div>
              
              <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-xl p-8 mb-8">
                <div className="flex items-center gap-4 mb-6">
                  <div className="flex items-center justify-center w-12 h-12 bg-green-100 rounded-full">
                    <Users className="h-6 w-6 text-green-600" />
                  </div>
                  <h4 className="text-xl font-semibold text-gray-900">
                    {isFrench ? "Votre Ikigai Authentique" : "Your Authentic Ikigai"}
                  </h4>
                </div>
                <p className="text-lg text-gray-700 leading-relaxed">
                  {isFrench 
                    ? "Votre ikigai n'a pas besoin d'être grandiose ou de changer le monde. Il peut être aussi simple que de faire sourire quelqu'un ou de créer quelque chose de beau."
                    : "Your ikigai doesn't have to be grand or world-changing. It can be as simple as making someone smile or creating something beautiful."
                  }
                </p>
              </div>
              
              <div className="bg-gradient-to-r from-orange-50 to-yellow-50 rounded-xl p-8 border-2 border-orange-200">
                <div className="flex items-center gap-4 mb-6">
                  <div className="flex items-center justify-center w-12 h-12 bg-orange-100 rounded-full">
                    <Lightbulb className="h-6 w-6 text-orange-600" />
                  </div>
                  <h4 className="text-xl font-semibold text-gray-900">
                    {isFrench ? "La Question Continue" : "The Ongoing Question"}
                  </h4>
                </div>
                <p className="text-lg text-gray-700 leading-relaxed italic">
                  "{isFrench 
                    ? "Comment puis-je aligner davantage ma vie sur ce qui compte vraiment pour moi ?"
                    : "How can I align my life more closely with what truly matters to me?"
                  }"
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight">
              {isFrench ? "Questions Fréquemment Posées À Propos d'Ikigai" : "Frequently Asked Questions About Ikigai"}
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              {isFrench 
                ? "Tout ce que vous devez savoir sur la philosophie japonaise du but de la vie"
                : "Everything you need to know about Japanese life purpose philosophy"
              }
            </p>
          </div>
          
          <div className="max-w-4xl mx-auto">
            <div className="grid gap-8">
              {/* FAQ Item 1 */}
              <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-8 shadow-sm">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">
                  {isFrench ? "Que signifie Ikigai en japonais ?" : "What does Ikigai mean in Japanese?"}
                </h3>
                <p className="text-gray-700 leading-relaxed">
                  {isFrench 
                    ? "Ikigai (生き甲斐) combine deux mots japonais : 'iki' signifiant 'vie' et 'gai' signifiant 'valeur' ou 'mérite'. Il se traduit littéralement par 'raison d'être' ou 'but de la vie'. Le concept est central à la culture japonaise depuis plus de 1 000 ans."
                    : "Ikigai (生き甲斐) combines two Japanese words: 'iki' meaning 'life' and 'gai' meaning 'value' or 'worth.' It literally translates to 'reason for being' or 'life's purpose.' The concept has been central to Japanese culture for over 1,000 years."
                  }
                </p>
              </div>
              
              {/* FAQ Item 2 */}
              <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-2xl p-8 shadow-sm">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">
                  {isFrench ? "Comment prononce-t-on Ikigai ?" : "How do you pronounce Ikigai?"}
                </h3>
                <p className="text-gray-700 leading-relaxed">
                  {isFrench 
                    ? "Ikigai se prononce 'ee-kee-guy' (é-ké-gaï). L'emphase est placée de manière égale sur les trois syllabes, chaque son de voyelle étant clairement articulé."
                    : "Ikigai is pronounced 'ee-kee-guy' (é-ké-gaï). The emphasis is placed evenly across all three syllables, with each vowel sound clearly articulated."
                  }
                </p>
              </div>
              
              {/* FAQ Item 3 */}
              <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl p-8 shadow-sm">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">
                  {isFrench ? "L'Ikigai est-il lié à la longévité ?" : "Is Ikigai linked to longevity?"}
                </h3>
                <p className="text-gray-700 leading-relaxed">
                  {isFrench 
                    ? "Oui ! Des recherches sur les habitants d'Okinawa, au Japon, connus pour leur longévité exceptionnelle, montrent une forte corrélation entre avoir un ikigai clair et vivre plus longtemps. Cela peut augmenter le nombre d'années de santé en offrant un but, réduisant le stress et encourageant des habitudes positives."
                    : "Yes! Research on Okinawa residents in Japan, known for their exceptional longevity, shows a strong correlation between having a clear ikigai and living longer. It may increase the number of health years by providing purpose, reducing stress, and encouraging positive habits."
                  }
                </p>
              </div>
              
              {/* FAQ Item 4 */}
              <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-2xl p-8 shadow-sm">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">
                  {isFrench ? "Puis-je avoir plusieurs Ikigai ?" : "Can I have multiple Ikigai?"}
                </h3>
                <p className="text-gray-700 leading-relaxed">
                  {isFrench 
                    ? "Absolument ! Beaucoup de gens trouvent du sens dans plusieurs domaines de leur vie. Votre ikigai peut évoluer avec le temps et les circonstances. Certaines personnes ont un ikigai principal avec des ikigai secondaires qui les nourrissent de différentes manières."
                    : "Absolutely! Many people find meaning in multiple areas of their life. Your ikigai can evolve over time and circumstances. Some people have a primary ikigai with secondary ikigai that nourish them in different ways."
                  }
                </p>
              </div>
              
              {/* FAQ Item 5 */}
              <div className="bg-gradient-to-r from-pink-50 to-purple-50 rounded-2xl p-8 shadow-sm">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">
                  {isFrench ? "Combien de temps faut-il pour trouver son Ikigai ?" : "How long does it take to find your Ikigai?"}
                </h3>
                <p className="text-gray-700 leading-relaxed">
                  {isFrench 
                    ? "Il n'y a pas de calendrier fixe. Certaines personnes ont des insights immédiats, tandis que d'autres explorent pendant des mois ou des années. L'important n'est pas la vitesse mais la direction. Chaque étape de réflexion et d'expérimentation vous rapproche de votre ikigai authentique."
                    : "There's no fixed timeline. Some people have immediate insights, while others explore for months or years. What matters isn't speed but direction. Every step of reflection and experimentation brings you closer to your authentic ikigai."
                  }
                </p>
              </div>
              
              {/* FAQ Item 6 */}
              <div className="bg-gradient-to-r from-indigo-50 to-blue-50 rounded-2xl p-8 shadow-sm">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">
                  {isFrench ? "L'Ikigai doit-il être votre carrière ?" : "Does Ikigai have to be your career?"}
                </h3>
                <p className="text-gray-700 leading-relaxed">
                  {isFrench 
                    ? "Pas du tout ! Bien que certaines personnes alignent leur ikigai avec leur carrière, d'autres le trouvent dans le bénévolat, les loisirs, les relations ou les activités créatives. Votre ikigai peut compléter votre travail, fournir un équilibre, ou même être complètement séparé de votre source de revenus."
                    : "Not at all! While some people align their ikigai with their career, others find it in volunteering, hobbies, relationships, or creative pursuits. Your ikigai can complement your work, provide balance, or even be completely separate from your income source."
                  }
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Your Journey Starts Here */}
      <section className="py-24 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-br from-white to-purple-50 rounded-2xl p-12 shadow-lg relative overflow-hidden">
            <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-purple-100 to-blue-100 rounded-full -translate-y-20 translate-x-20 opacity-20"></div>
            <div className="absolute bottom-0 left-0 w-36 h-36 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full translate-y-18 -translate-x-18 opacity-20"></div>
            
            <div className="text-center relative z-10">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-purple-100 to-blue-100 rounded-full mb-6">
                <Target className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="text-3xl font-bold text-gray-900 mb-8">
                {isFrench ? "Votre Voyage Commence Ici" : "Your Journey Starts Here"}
              </h3>
              
              <div className="max-w-5xl mx-auto mb-12">
                <div className="bg-white rounded-xl p-8 mb-8 shadow-sm">
                  <p className="text-xl text-gray-700 mb-6 leading-relaxed">
                    {isFrench 
                      ? "Découvrir votre ikigai n'est pas une destination unique mais un voyage continu d'auto-découverte. Commencez par comprendre vos patterns et motivations uniques."
                      : "Discovering your ikigai isn't a one-time destination but an ongoing journey of self-discovery. Start by understanding your unique patterns and motivations."
                    }
                  </p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
                  <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl p-8 shadow-sm">
                    <div className="flex items-center gap-4 mb-6">
                      <div className="flex items-center justify-center w-12 h-12 bg-blue-100 rounded-full">
                        <HelpCircle className="h-6 w-6 text-blue-600" />
                      </div>
                      <h4 className="text-xl font-semibold text-gray-900">
                        {isFrench ? "Évaluation Scientifique" : "Scientific Assessment"}
                      </h4>
                    </div>
                    <p className="text-gray-700 leading-relaxed">
                      {isFrench 
                        ? "Notre évaluation complète analyse vos passions, compétences, valeurs et besoins du marché pour révéler votre ikigai unique."
                        : "Our comprehensive assessment analyzes your passions, skills, values, and market needs to reveal your unique ikigai."
                      }
                    </p>
                  </div>
                  
                  <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-8 shadow-sm">
                    <div className="flex items-center gap-4 mb-6">
                      <div className="flex items-center justify-center w-12 h-12 bg-purple-100 rounded-full">
                        <BookOpen className="h-6 w-6 text-purple-600" />
                      </div>
                      <h4 className="text-xl font-semibold text-gray-900">
                        {isFrench ? "Réflexion Quotidienne" : "Daily Reflection"}
                      </h4>
                    </div>
                    <p className="text-gray-700 leading-relaxed">
                      {isFrench 
                        ? "Utilisez des questions de réflexion ciblées et des cartes de découverte pour approfondir votre compréhension de vous-même."
                        : "Use targeted reflection questions and discovery cards to deepen your self-understanding."
                      }
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-6 justify-center mb-12">
                <Link href="/test">
                  <Button size="lg" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-10 py-5 text-lg font-semibold shadow-xl transform hover:scale-105 transition-all duration-300 rounded-full">
                    {isFrench ? "Passer le Test" : "Take the Test"}
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
                <Link href="/shop">
                  <Button size="lg" variant="outline" className="border-2 border-purple-600 text-purple-600 hover:bg-purple-50 px-10 py-5 text-lg font-semibold rounded-full transition-all duration-300">
                    <BookOpen className="mr-2 h-5 w-5" />
                    {isFrench ? "Cartes de Découverte" : "Discovery Cards"}
                  </Button>
                </Link>
              </div>
              
              <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-xl p-8 border-2 border-yellow-200">
                <p className="text-xl text-gray-700 font-semibold italic">
                  {isFrench 
                    ? "Votre ikigai unique vous attend. Êtes-vous prêt à le découvrir ?"
                    : "Your unique ikigai is waiting. Are you ready to discover it?"
                  }
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}