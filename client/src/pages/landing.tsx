import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Navigation from "@/components/Navigation";
import SEO from "@/components/SEO";

import { useTranslation } from 'react-i18next';
import { useEffect, useState } from 'react';
import { trackEvent } from "@/lib/analytics";
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
  BookOpen,
  Award,
  Info,
  Sparkles,
  ArrowRight,
  Calendar,
  ChevronDown,
  ChevronUp,
  FileText,
  Map,
  MessageCircle,
  TrendingUp,
  Briefcase,
  Lightbulb,
  Activity,
  Zap
} from "lucide-react";

// Import founder images - Corrected assignments
import karlisImage from "@assets/1516903840572_1752666110841.jpeg";
import sindyImage from "@assets/1516949856208_1752666110842.jpeg";
import ikigaiCardsImage from "@assets/Ikigain+cards (1)_1752654684985.jpeg";

// Import behind-the-scenes images
import cardsLayoutImage from "@assets/IMG_20220709_104516_1755002413096.jpg";
import firstBatchImage from "@assets/IMG_20220909_135313_1755002413107.jpg";
import amazonListingImage from "@assets/Screenshot_2022-09-29-19-02-48-628_com.amazon.mShop.android.shopping_1755002413107.jpg";
import instructionCardImage from "@assets/IMG_20221228_120113_1755002413108.jpg";
import shippingBoxImage from "@assets/IMG_20240627_134020_1755002413108.jpg";

// Import real customer photos
import customerPhoto1 from "@assets/content-551317 (1)_1755002615665.jpg";
import customerPhoto2 from "@assets/content-543953 (1)_1755002615677.jpg";
import customerPhoto3 from "@assets/content-541970 (1)_1755002615677.jpg";
import customerPhoto4 from "@assets/content-539203 (1)_1755002615678.jpg";
import customerPhoto5 from "@assets/content-538750 (1)_1755002615678.jpg";

export default function Landing() {
  const { t, ready, i18n } = useTranslation(['landing', 'common', 'navigation']);
  const [expandedTier, setExpandedTier] = useState<string | null>(null);
  
  // Debug: Force French language detection and reload translations
  useEffect(() => {
    const currentPath = window.location.pathname;
    console.log('Current path:', currentPath);
    console.log('Current i18n language:', i18n.language);
    
    if (currentPath.startsWith('/fr') && i18n.language !== 'fr') {
      console.log('Forcing French language change');
      i18n.changeLanguage('fr').then(() => {
        console.log('French language change completed');
        // Force reload of translation resources
        i18n.reloadResources(['fr'], ['landing', 'common', 'navigation']);
      });
    }
  }, [i18n]);
  
  if (!ready) {
    return (
      <div className="min-h-screen bg-white">
        <Navigation />
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }
  
  const isSpanish = i18n.language === 'es';
  const isFrench = i18n.language === 'fr';
  const baseUrl = isSpanish ? "https://www.ikigain.org/es" : 
                  isFrench ? "https://www.ikigain.org/fr" : 
                  "https://www.ikigain.org";
  
  // Debug logging
  console.log('Landing component - Current language:', i18n.language);
  console.log('Landing component - Is French:', isFrench);
  
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": t('landing:seo.structuredData.name', { 
      fallbackLng: 'en',
      defaultValue: "Ikigai Test - Discover Your Life's Purpose" 
    }),
    "description": t('landing:seo.structuredData.description', {
      fallbackLng: 'en',
      defaultValue: "Take our comprehensive Ikigai assessment to discover your life's purpose. Find the intersection of what you love, what you're good at, what the world needs, and what you can be paid for."
    }),
    "url": baseUrl,
    "applicationCategory": "PersonalityTest",
    "operatingSystem": "Web",
    "inLanguage": isSpanish ? "es" : isFrench ? "fr" : "en",
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
        title={t('landing:seo.title', {
          fallbackLng: 'en',
          defaultValue: "Free Ikigai Test - Discover Your Life's Purpose | What is Ikigai Quiz"
        })}
        description={t('landing:seo.description', {
          fallbackLng: 'en',
          defaultValue: "Take our free Ikigai test to discover what is Ikigai and your life's purpose. Free Ikigai quiz helps you find the intersection of what you love, what you're good at, what the world needs, and what you can be paid for."
        })}
        keywords={t('landing:seo.keywords', {
          fallbackLng: 'en',
          defaultValue: "ikigai test, free ikigai test, ikigai quiz, what is ikigai, ikigai test free, free ikigai quiz, life purpose test, career assessment, personality test"
        })}
        canonical={baseUrl + "/"}
        ogTitle={t('landing:seo.ogTitle', {
          fallbackLng: 'en',
          defaultValue: "Ikigai Test - Discover Your Life's Purpose | Free Assessment"
        })}
        ogDescription={t('landing:seo.ogDescription', {
          fallbackLng: 'en',
          defaultValue: "Take our comprehensive Ikigai assessment to discover your life's purpose. Find the intersection of what you love, what you're good at, what the world needs, and what you can be paid for."
        })}
        language={isSpanish ? 'es' : isFrench ? 'fr' : 'en'}
        structuredData={structuredData}
      />
      <Navigation />
      
      {/* Hero Section */}
      <header className="relative bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              {t('hero.title', { 
                defaultValue: isFrench ? "Découvrez Votre" : "Discover Your" 
              })} <span className="text-primary bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Ikigai</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              {t('hero.description', {
                defaultValue: isFrench 
                  ? "Découvrez le but de votre vie grâce à l'ancien concept japonais d'Ikigai. Passez notre test Ikigai gratuit pour découvrir ce qu'est l'Ikigai et trouvez l'intersection entre ce que vous aimez, ce en quoi vous êtes bon, ce dont le monde a besoin, et ce pour quoi vous pouvez être payé."
                  : "Uncover your life's purpose through the ancient Japanese concept of Ikigai. Take our free Ikigai test to discover what is Ikigai and find the intersection of what you love, what you're good at, what the world needs, and what you can be paid for."
              })}
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
              <Link href="/ikigai-type-test">
                <Button 
                  size="lg" 
                  className="bg-gradient-to-r from-blue-600 via-purple-600 to-blue-700 hover:from-blue-700 hover:via-purple-700 hover:to-blue-800 text-white px-10 py-5 text-lg font-bold shadow-2xl rounded-xl border-0 relative overflow-hidden group hover:scale-105 transition-all duration-300"
                  onClick={() => trackEvent('cta_click', 'landing_page', 'quick_type_test')}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <div className="relative flex items-center gap-3">
                    <Target className="w-5 h-5" />
                    {t('navigation:fiveMinTest')}
                  </div>
                </Button>
              </Link>
              <Link href="/test">
                <Button 
                  size="lg" 
                  variant="outline" 
                  className="px-10 py-5 text-lg font-bold border-3 border-blue-600 bg-white hover:bg-blue-50 text-blue-600 hover:text-blue-700 shadow-xl rounded-xl transition-all duration-300 hover:shadow-2xl hover:scale-105 relative overflow-hidden group"
                  onClick={() => trackEvent('cta_click', 'landing_page', 'full_ikigai_test')}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-50 to-purple-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <div className="relative flex items-center gap-3 text-blue-600 font-bold">
                    <Brain className="w-5 h-5 text-blue-600" />
                    <span className="text-blue-600 font-bold">
                      {t('navigation:completeAnalysis')}
                    </span>
                  </div>
                </Button>
              </Link>
            </div>
            
            <div className="flex items-center gap-4 justify-center mt-4">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Clock className="h-4 w-4" />
                {t('landing:hero.timeRequired')}
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Users className="h-4 w-4" />
                {t('landing:hero.testedUsers')}
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                {t('landing:hero.rating')}
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Founder Introduction Section */}
      <section className="py-16 bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-3xl shadow-xl p-8 md:p-12">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
              <div className="order-2 lg:order-1">
                <div className="flex items-center gap-2 mb-4">
                  <Sparkles className="w-5 h-5 text-purple-600" />
                  <span className="text-purple-600 font-semibold">Meet Your Guide</span>
                </div>
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                  Hi! I'm Sindy 👋
                </h2>
                <div className="space-y-4 text-gray-700 leading-relaxed">
                  <p>
                    I believe you've asked yourself questions like – <em>"What is success to me? How do I find the inner drive for waking up in the mornings? What makes me truly happy?"</em>
                  </p>
                  <p className="font-medium text-purple-700">
                    Actually, I was there… constantly asking myself those questions. I had lost YEARS looking for things that excite me and make me happy.
                  </p>
                  <p>
                    One day I came across Japanese philosophy and a book called "Ikigai" and it consumed me. Not only did I have to tell the world about this amazing Japanese perception – I had to do it in the most interactive way possible.
                  </p>
                  <p>
                    That's why I created this test and the Ikigain Cards – to help you discover your purpose through a playful, meaningful journey, just like I did.
                  </p>
                </div>
                <Button className="mt-6 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold">
                  Start Your Journey <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
              <div className="order-1 lg:order-2">
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-400 to-pink-400 rounded-2xl blur-2xl opacity-30"></div>
                  <img 
                    src={sindyImage} 
                    alt="Sindy - Founder of Ikigain" 
                    className="relative rounded-2xl shadow-lg w-full max-w-md mx-auto"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Family Behind the Brand */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              A Family Mission to Help You Find Your Purpose
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Ikigain isn't just a business – it's our family's passion project to help people discover their life's purpose
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <Card className="text-center hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
              <CardHeader>
                <div className="w-32 h-32 mx-auto mb-4">
                  <img 
                    src={sindyImage} 
                    alt="Sindy - Founder" 
                    className="w-full h-full object-cover rounded-full border-4 border-purple-200"
                  />
                </div>
                <CardTitle className="text-xl font-bold text-gray-900">Sindy</CardTitle>
                <Badge className="mt-2 bg-purple-100 text-purple-700">Founder & Visionary</Badge>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  The heart behind Ikigain. After discovering ikigai transformed my life, I created these tools to help others find their purpose too.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
              <CardHeader>
                <div className="w-32 h-32 mx-auto mb-4">
                  <img 
                    src={karlisImage} 
                    alt="Karlis - eCommerce Expert" 
                    className="w-full h-full object-cover rounded-full border-4 border-blue-200"
                  />
                </div>
                <CardTitle className="text-xl font-bold text-gray-900">Karlis</CardTitle>
                <Badge className="mt-2 bg-blue-100 text-blue-700">eCommerce Expert</Badge>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  The tech wizard making everything work seamlessly. With deep expertise in eCommerce and Amazon, bringing Ikigain to you worldwide.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Journey Timeline */}
      <section className="py-16 bg-gradient-to-br from-blue-50 to-indigo-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              From Personal Struggle to Global Mission
            </h2>
            <p className="text-xl text-gray-600">
              How Ikigain evolved from one person's search for meaning
            </p>
          </div>

          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-1 bg-gradient-to-b from-purple-300 to-blue-300"></div>
            
            {/* Timeline items */}
            <div className="space-y-12">
              <div className="flex items-center justify-center">
                <div className="bg-white rounded-2xl shadow-lg p-6 max-w-md relative">
                  <div className="absolute -left-3 top-1/2 transform -translate-y-1/2 w-6 h-6 bg-purple-500 rounded-full border-4 border-white"></div>
                  <div className="flex items-center gap-2 mb-2">
                    <Calendar className="w-4 h-4 text-purple-600" />
                    <span className="text-sm text-purple-600 font-semibold">The Beginning</span>
                  </div>
                  <h3 className="font-bold text-gray-900 mb-2">Years of Searching</h3>
                  <p className="text-gray-600">Lost years looking for what excites me, constantly questioning my purpose and happiness.</p>
                </div>
              </div>

              <div className="flex items-center justify-center">
                <div className="bg-white rounded-2xl shadow-lg p-6 max-w-md relative">
                  <div className="absolute -left-3 top-1/2 transform -translate-y-1/2 w-6 h-6 bg-blue-500 rounded-full border-4 border-white"></div>
                  <div className="flex items-center gap-2 mb-2">
                    <Sparkles className="w-4 h-4 text-blue-600" />
                    <span className="text-sm text-blue-600 font-semibold">The Discovery</span>
                  </div>
                  <h3 className="font-bold text-gray-900 mb-2">Finding Ikigai</h3>
                  <p className="text-gray-600">Discovered Japanese philosophy and the book "Ikigai" - it completely consumed and transformed me.</p>
                </div>
              </div>

              <div className="flex items-center justify-center">
                <div className="bg-white rounded-2xl shadow-lg p-6 max-w-md relative">
                  <div className="absolute -left-3 top-1/2 transform -translate-y-1/2 w-6 h-6 bg-green-500 rounded-full border-4 border-white"></div>
                  <div className="flex items-center gap-2 mb-2">
                    <Users className="w-4 h-4 text-green-600" />
                    <span className="text-sm text-green-600 font-semibold">The Mission</span>
                  </div>
                  <h3 className="font-bold text-gray-900 mb-2">Creating Ikigain</h3>
                  <p className="text-gray-600">Developed 35 interactive cards and this test to help others discover their purpose through playful self-discovery.</p>
                </div>
              </div>

              <div className="flex items-center justify-center">
                <div className="bg-white rounded-2xl shadow-lg p-6 max-w-md relative">
                  <div className="absolute -left-3 top-1/2 transform -translate-y-1/2 w-6 h-6 bg-orange-500 rounded-full border-4 border-white"></div>
                  <div className="flex items-center gap-2 mb-2">
                    <Globe className="w-4 h-4 text-orange-600" />
                    <span className="text-sm text-orange-600 font-semibold">Today</span>
                  </div>
                  <h3 className="font-bold text-gray-900 mb-2">Global Impact</h3>
                  <p className="text-gray-600">Helping thousands worldwide find their ikigai through our test and physical card deck.</p>
                  <img 
                    src={ikigaiCardsImage} 
                    alt="Ikigai Cards" 
                    className="mt-3 rounded-lg w-full h-auto object-contain"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="text-center mt-12">
            <Link href="/test">
              <Button className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold text-lg px-8 py-4 rounded-full shadow-lg">
                Begin Your Ikigai Journey Today
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Behind the Scenes Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Behind the Scenes: From Idea to Your Hands
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-4">
              Every Ikigain card deck is a labor of love. See how we went from concept to creation.
            </p>
            <p className="text-gray-600 max-w-2xl mx-auto">
              What started as a personal quest for meaning became a mission to help others. Each step - from designing 35 unique cards to packing every order personally - is done with intention and care.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <div className="relative group">
              <img 
                src={cardsLayoutImage} 
                alt="Cards layout and design" 
                className="rounded-lg shadow-lg w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
                <p className="text-white text-sm font-semibold">Designing the 35 cards</p>
                <p className="text-white text-xs opacity-90">Each card carefully crafted</p>
              </div>
            </div>
            
            <div className="relative group">
              <img 
                src={firstBatchImage} 
                alt="First batch of cards" 
                className="rounded-lg shadow-lg w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
                <p className="text-white text-sm font-semibold">First batch arrives!</p>
                <p className="text-white text-xs opacity-90">The excitement was real</p>
              </div>
            </div>
            
            <div className="relative group">
              <img 
                src={amazonListingImage} 
                alt="Listed on Amazon" 
                className="rounded-lg shadow-lg w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
                <p className="text-white text-sm font-semibold">Going live on Amazon</p>
                <p className="text-white text-xs opacity-90">Reaching people worldwide</p>
              </div>
            </div>
            
            <div className="relative group">
              <img 
                src={instructionCardImage} 
                alt="Instruction booklet" 
                className="rounded-lg shadow-lg w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
                <p className="text-white text-sm font-semibold">Creating the guide</p>
                <p className="text-white text-xs opacity-90">Making it easy to use</p>
              </div>
            </div>
            
            <div className="relative group">
              <img 
                src={shippingBoxImage} 
                alt="Ready to ship" 
                className="rounded-lg shadow-lg w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
                <p className="text-white text-sm font-semibold">Packed with love</p>
                <p className="text-white text-xs opacity-90">From our family to yours</p>
              </div>
            </div>
            
            <div className="relative group bg-gradient-to-br from-purple-100 to-pink-100 rounded-lg shadow-lg flex items-center justify-center h-48">
              <div className="text-center p-4">
                <Trophy className="w-12 h-12 text-purple-600 mx-auto mb-2" />
                <p className="font-bold text-gray-900">2+ Years</p>
                <p className="text-sm text-gray-600">Helping people find purpose</p>
              </div>
            </div>
          </div>

          <div className="mt-12 bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl p-8">
            <p className="text-center text-gray-700 mb-6 max-w-3xl mx-auto">
              <em>"When I held the first printed deck in my hands, I knew this was more than just cards - it was a tool that could genuinely help people discover their purpose, just as the concept had helped me."</em>
            </p>
            <p className="text-center text-gray-600 font-semibold">- Sindy, Founder</p>
          </div>

          <div className="mt-8 text-center">
            <Badge className="bg-green-100 text-green-700 px-4 py-2">
              <CheckCircle className="w-4 h-4 inline mr-2" />
              Family-run business • Every order personally checked by Sindy
            </Badge>
          </div>
        </div>
      </section>

      {/* Social Proof Section */}
      <section className="py-16 bg-gradient-to-br from-orange-50 to-yellow-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Real People, Real Transformations
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Join thousands who've discovered their ikigai with our cards
            </p>
          </div>

          {/* Customer Photos Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-12">
            <div className="relative group">
              <img 
                src={customerPhoto1} 
                alt="Happy customer with Ikigai cards" 
                className="w-full h-48 object-cover rounded-lg shadow-lg group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg flex items-end p-3">
                <p className="text-white text-xs">⭐⭐⭐⭐⭐ Verified Buyer</p>
              </div>
            </div>
            
            <div className="relative group">
              <img 
                src={customerPhoto2} 
                alt="Customer showing cards" 
                className="w-full h-48 object-cover rounded-lg shadow-lg group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg flex items-end p-3">
                <p className="text-white text-xs">⭐⭐⭐⭐⭐ Life changing!</p>
              </div>
            </div>
            
            <div className="relative group">
              <img 
                src={customerPhoto3} 
                alt="Customer with card deck" 
                className="w-full h-48 object-cover rounded-lg shadow-lg group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg flex items-end p-3">
                <p className="text-white text-xs">⭐⭐⭐⭐⭐ Best purchase!</p>
              </div>
            </div>
            
            <div className="relative group">
              <img 
                src={customerPhoto4} 
                alt="Happy customer experience" 
                className="w-full h-48 object-cover rounded-lg shadow-lg group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg flex items-end p-3">
                <p className="text-white text-xs">⭐⭐⭐⭐⭐ Highly recommend</p>
              </div>
            </div>
            
            <div className="relative group">
              <img 
                src={customerPhoto5} 
                alt="Customer testimonial" 
                className="w-full h-48 object-cover rounded-lg shadow-lg group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg flex items-end p-3">
                <p className="text-white text-xs">⭐⭐⭐⭐⭐ Amazing quality</p>
              </div>
            </div>
          </div>

          {/* Testimonials Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
            <Card className="hover:shadow-xl transition-shadow duration-300">
              <CardContent className="pt-6">
                <div className="flex items-center mb-3">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-gray-700 italic mb-3">
                  "These cards helped me realize I was in the wrong career. Now I wake up excited about my work! The questions are profound and really make you think about what matters."
                </p>
                <p className="text-sm text-gray-600 font-semibold">- Sarah M., Verified Amazon Buyer</p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-xl transition-shadow duration-300">
              <CardContent className="pt-6">
                <div className="flex items-center mb-3">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-gray-700 italic mb-3">
                  "Beautiful quality and profound questions. I use these in my therapy practice and my clients love them. Perfect for self-reflection and group activities!"
                </p>
                <p className="text-sm text-gray-600 font-semibold">- Dr. Jennifer K., Therapist</p>
              </CardContent>
            </Card>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              <div>
                <p className="text-4xl font-bold text-purple-600">47+</p>
                <p className="text-gray-600 mt-1">Countries Shipped</p>
              </div>
              <div>
                <p className="text-4xl font-bold text-blue-600">5,000+</p>
                <p className="text-gray-600 mt-1">Happy Customers</p>
              </div>
              <div>
                <p className="text-4xl font-bold text-green-600">4.8★</p>
                <p className="text-gray-600 mt-1">Amazon Rating</p>
              </div>
              <div>
                <p className="text-4xl font-bold text-orange-600">35</p>
                <p className="text-gray-600 mt-1">Unique Cards</p>
              </div>
            </div>
          </div>

          <div className="mt-8 text-center">
            <Link href="/shop">
              <Button className="bg-gradient-to-r from-orange-500 to-yellow-500 hover:from-orange-600 hover:to-yellow-600 text-white font-bold text-lg px-8 py-4 rounded-full shadow-lg">
                Get Your Ikigai Cards Today
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

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
                  {t('landing:premiumFeatures.careerAnalysis.title')}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">
                  {t('landing:premiumFeatures.careerAnalysis.description')}
                </p>
                <ul className="space-y-2">
                  {(() => {
                    const features = t('landing:premiumFeatures.careerAnalysis.features', { returnObjects: true });
                    return Array.isArray(features) ? (features as string[]).map((feature: string, index: number) => (
                      <li key={index} className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                        <span className="text-sm text-gray-600">{feature}</span>
                      </li>
                    )) : [];
                  })()}
                </ul>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow duration-300">
              <CardHeader>
                <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-teal-500 rounded-xl flex items-center justify-center mb-4">
                  <Trophy className="w-6 h-6 text-white" />
                </div>
                <CardTitle className="text-xl font-bold text-gray-900">
                  {t('landing:premiumFeatures.careerRoadmap.title')}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">
                  {t('landing:premiumFeatures.careerRoadmap.description')}
                </p>
                <ul className="space-y-2">
                  {(() => {
                    const features = t('landing:premiumFeatures.careerRoadmap.features', { returnObjects: true });
                    return Array.isArray(features) ? (features as string[]).map((feature: string, index: number) => (
                      <li key={index} className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                        <span className="text-sm text-gray-600">{feature}</span>
                      </li>
                    )) : [];
                  })()}
                </ul>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow duration-300">
              <CardHeader>
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center mb-4">
                  <Brain className="w-6 h-6 text-white" />
                </div>
                <CardTitle className="text-xl font-bold text-gray-900">
                  {t('landing:premiumFeatures.personalityDeepDive.title')}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">
                  {t('landing:premiumFeatures.personalityDeepDive.description')}
                </p>
                <ul className="space-y-2">
                  {(() => {
                    const features = t('landing:premiumFeatures.personalityDeepDive.features', { returnObjects: true });
                    return Array.isArray(features) ? (features as string[]).map((feature: string, index: number) => (
                      <li key={index} className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                        <span className="text-sm text-gray-600">{feature}</span>
                      </li>
                    )) : [];
                  })()}
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Premium Tiers Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              {t('landing:premiumTiers.title')}
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              {t('landing:premiumTiers.description')}
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Career Roadmap Guide */}
            <Card className="relative hover:shadow-xl transition-shadow duration-300 border-2 border-blue-200">
              <CardHeader className="text-center pb-4">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Trophy className="w-8 h-8 text-white" />
                </div>
                <CardTitle className="text-2xl font-bold text-gray-900">
                  {t('landing:premiumTiers.careerRoadmapGuide.title')}
                </CardTitle>
                <div className="text-4xl font-bold text-blue-600 mt-2">{t('landing:premiumTiers.careerRoadmapGuide.price')}</div>
              </CardHeader>
              <CardContent className="pt-0">
                <ul className="space-y-3">
                  {(() => {
                    const features = t('landing:premiumTiers.careerRoadmapGuide.features', { returnObjects: true });
                    return Array.isArray(features) ? (features as string[]).map((feature: string, index: number) => (
                      <li key={index} className="flex items-start gap-3">
                        <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-700">{feature}</span>
                      </li>
                    )) : [];
                  })()}
                </ul>
                
                {/* See What's Inside Button */}
                <Button
                  variant="ghost"
                  className="w-full mt-4 text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                  onClick={() => setExpandedTier(expandedTier === 'roadmap' ? null : 'roadmap')}
                >
                  <span className="flex items-center gap-2">
                    {expandedTier === 'roadmap' ? (
                      <>Hide Preview <ChevronUp className="w-4 h-4" /></>
                    ) : (
                      <>See What's Inside <ChevronDown className="w-4 h-4" /></>
                    )}
                  </span>
                </Button>
                
                {/* Expandable Preview Content */}
                {expandedTier === 'roadmap' && (
                  <div className="mt-4 p-4 bg-blue-50 rounded-lg space-y-4 animate-in slide-in-from-top-2">
                    <div className="text-sm font-semibold text-blue-900 mb-2">Sample Preview:</div>
                    
                    <div className="bg-white p-3 rounded border border-blue-200">
                      <div className="flex items-center gap-2 mb-2">
                        <Map className="w-4 h-4 text-blue-600" />
                        <span className="font-semibold text-sm">12-Month Career Timeline</span>
                      </div>
                      <div className="text-xs text-gray-600 space-y-1">
                        <div>• Month 1-3: Foundation & Skills Assessment</div>
                        <div>• Month 4-6: Networking & Portfolio Building</div>
                        <div>• Month 7-9: Active Job Search & Applications</div>
                        <div>• Month 10-12: Career Transition & Growth</div>
                      </div>
                    </div>
                    
                    <div className="bg-white p-3 rounded border border-blue-200">
                      <div className="flex items-center gap-2 mb-2">
                        <Briefcase className="w-4 h-4 text-blue-600" />
                        <span className="font-semibold text-sm">Industry Connections</span>
                      </div>
                      <div className="text-xs text-gray-600">
                        <div>Personalized list of 20+ companies aligned with your values</div>
                        <div>LinkedIn networking templates & outreach strategies</div>
                      </div>
                    </div>
                    
                    <div className="bg-white p-3 rounded border border-blue-200">
                      <div className="flex items-center gap-2 mb-2">
                        <Target className="w-4 h-4 text-blue-600" />
                        <span className="font-semibold text-sm">Weekly Action Items</span>
                      </div>
                      <div className="text-xs text-gray-600">
                        <div>52 specific tasks broken down week-by-week</div>
                        <div>Measurable milestones to track your progress</div>
                      </div>
                    </div>
                  </div>
                )}
                
                <Link href="/test" className="block mt-6">
                  <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl transition-colors duration-300">
                    {t('landing:premiumTiers.getStarted')}
                  </Button>
                </Link>
              </CardContent>
            </Card>

            {/* Personality Deep Dive */}
            <Card className="relative hover:shadow-xl transition-shadow duration-300 border-2 border-purple-200 scale-105">
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                <Badge className="bg-purple-600 text-white px-4 py-1 text-sm font-bold">
                  {t('landing:premiumTiers.mostPopular')}
                </Badge>
              </div>
              <CardHeader className="text-center pb-4">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Brain className="w-8 h-8 text-white" />
                </div>
                <CardTitle className="text-2xl font-bold text-gray-900">
                  {t('landing:premiumTiers.personalityDeepDive.title')}
                </CardTitle>
                <div className="text-4xl font-bold text-purple-600 mt-2">{t('landing:premiumTiers.personalityDeepDive.price')}</div>
              </CardHeader>
              <CardContent className="pt-0">
                <ul className="space-y-3">
                  {(() => {
                    const features = t('landing:premiumTiers.personalityDeepDive.features', { returnObjects: true });
                    return Array.isArray(features) ? (features as string[]).map((feature: string, index: number) => (
                      <li key={index} className="flex items-start gap-3">
                        <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-700">{feature}</span>
                      </li>
                    )) : [];
                  })()}
                </ul>
                
                {/* See What's Inside Button */}
                <Button
                  variant="ghost"
                  className="w-full mt-4 text-purple-600 hover:text-purple-700 hover:bg-purple-50"
                  onClick={() => setExpandedTier(expandedTier === 'personality' ? null : 'personality')}
                >
                  <span className="flex items-center gap-2">
                    {expandedTier === 'personality' ? (
                      <>Hide Preview <ChevronUp className="w-4 h-4" /></>
                    ) : (
                      <>See What's Inside <ChevronDown className="w-4 h-4" /></>
                    )}
                  </span>
                </Button>
                
                {/* Expandable Preview Content */}
                {expandedTier === 'personality' && (
                  <div className="mt-4 p-4 bg-purple-50 rounded-lg space-y-4 animate-in slide-in-from-top-2">
                    <div className="text-sm font-semibold text-purple-900 mb-2">Sample Preview:</div>
                    
                    <div className="bg-white p-3 rounded border border-purple-200">
                      <div className="flex items-center gap-2 mb-2">
                        <Brain className="w-4 h-4 text-purple-600" />
                        <span className="font-semibold text-sm">Complete Personality Profile</span>
                      </div>
                      <div className="text-xs text-gray-600 space-y-1">
                        <div>• Your primary personality type: The Builder</div>
                        <div>• Secondary traits: Creative + Analytical</div>
                        <div>• Work style preferences & ideal environment</div>
                        <div>• Leadership style & team dynamics</div>
                      </div>
                    </div>
                    
                    <div className="bg-white p-3 rounded border border-purple-200">
                      <div className="flex items-center gap-2 mb-2">
                        <MessageCircle className="w-4 h-4 text-purple-600" />
                        <span className="font-semibold text-sm">Communication Guide</span>
                      </div>
                      <div className="text-xs text-gray-600">
                        <div>How you best express ideas & receive feedback</div>
                        <div>Conflict resolution strategies tailored to your style</div>
                      </div>
                    </div>
                    
                    <div className="bg-white p-3 rounded border border-purple-200">
                      <div className="flex items-center gap-2 mb-2">
                        <Lightbulb className="w-4 h-4 text-purple-600" />
                        <span className="font-semibold text-sm">Cognitive Style Analysis</span>
                      </div>
                      <div className="text-xs text-gray-600">
                        <div>How you process information & make decisions</div>
                        <div>Learning preferences & skill development tips</div>
                      </div>
                    </div>
                  </div>
                )}
                
                <Link href="/test" className="block mt-6">
                  <Button className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 rounded-xl transition-colors duration-300">
                    {t('landing:premiumTiers.getStarted')}
                  </Button>
                </Link>
              </CardContent>
            </Card>

            {/* Success Blueprint */}
            <Card className="relative hover:shadow-xl transition-shadow duration-300 border-2 border-green-200">
              <CardHeader className="text-center pb-4">
                <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-teal-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Award className="w-8 h-8 text-white" />
                </div>
                <CardTitle className="text-2xl font-bold text-gray-900">
                  {t('landing:premiumTiers.successBlueprint.title')}
                </CardTitle>
                <div className="text-4xl font-bold text-green-600 mt-2">{t('landing:premiumTiers.successBlueprint.price')}</div>
              </CardHeader>
              <CardContent className="pt-0">
                <ul className="space-y-3">
                  {(() => {
                    const features = t('landing:premiumTiers.successBlueprint.features', { returnObjects: true });
                    return Array.isArray(features) ? (features as string[]).map((feature: string, index: number) => (
                      <li key={index} className="flex items-start gap-3">
                        <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-700">{feature}</span>
                      </li>
                    )) : [];
                  })()}
                </ul>
                
                {/* See What's Inside Button */}
                <Button
                  variant="ghost"
                  className="w-full mt-4 text-green-600 hover:text-green-700 hover:bg-green-50"
                  onClick={() => setExpandedTier(expandedTier === 'blueprint' ? null : 'blueprint')}
                >
                  <span className="flex items-center gap-2">
                    {expandedTier === 'blueprint' ? (
                      <>Hide Preview <ChevronUp className="w-4 h-4" /></>
                    ) : (
                      <>See What's Inside <ChevronDown className="w-4 h-4" /></>
                    )}
                  </span>
                </Button>
                
                {/* Expandable Preview Content */}
                {expandedTier === 'blueprint' && (
                  <div className="mt-4 p-4 bg-green-50 rounded-lg space-y-4 animate-in slide-in-from-top-2">
                    <div className="text-sm font-semibold text-green-900 mb-2">Sample Preview:</div>
                    
                    <div className="bg-white p-3 rounded border border-green-200">
                      <div className="flex items-center gap-2 mb-2">
                        <Calendar className="w-4 h-4 text-green-600" />
                        <span className="font-semibold text-sm">90-Day Transformation Plan</span>
                      </div>
                      <div className="text-xs text-gray-600 space-y-1">
                        <div>• Day 1-30: Foundation - Clarity & Vision Setting</div>
                        <div>• Day 31-60: Execution - Building Momentum</div>
                        <div>• Day 61-90: Acceleration - Scaling Success</div>
                        <div>• Weekly check-ins & progress milestones</div>
                      </div>
                    </div>
                    
                    <div className="bg-white p-3 rounded border border-green-200">
                      <div className="flex items-center gap-2 mb-2">
                        <Activity className="w-4 h-4 text-green-600" />
                        <span className="font-semibold text-sm">Daily Success Habits</span>
                      </div>
                      <div className="text-xs text-gray-600">
                        <div>Morning routine for peak performance</div>
                        <div>Evening reflection & gratitude practice</div>
                        <div>Productivity techniques tailored to your style</div>
                      </div>
                    </div>
                    
                    <div className="bg-white p-3 rounded border border-green-200">
                      <div className="flex items-center gap-2 mb-2">
                        <TrendingUp className="w-4 h-4 text-green-600" />
                        <span className="font-semibold text-sm">Goal Achievement System</span>
                      </div>
                      <div className="text-xs text-gray-600">
                        <div>SMART goal framework customized for you</div>
                        <div>Progress tracking templates & accountability tools</div>
                        <div>Confidence building exercises & mindset shifts</div>
                      </div>
                    </div>
                  </div>
                )}
                
                <Link href="/test" className="block mt-6">
                  <Button className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 rounded-xl transition-colors duration-300">
                    {t('landing:premiumTiers.getStarted')}
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              {t('landing:howItWorks.title')}
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              {t('landing:howItWorks.description')}
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-3xl font-bold text-white">1</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                {t('landing:howItWorks.step1')}
              </h3>
              <p className="text-gray-600">
                {t('landing:howItWorks.step1Desc')}
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-teal-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-3xl font-bold text-white">2</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                {t('landing:howItWorks.step2')}
              </h3>
              <p className="text-gray-600">
                {t('landing:howItWorks.step2Desc')}
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-3xl font-bold text-white">3</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                {t('landing:howItWorks.step3')}
              </h3>
              <p className="text-gray-600">
                {t('landing:howItWorks.step3Desc')}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Proven Results Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              {t('landing:provenResults.title')}
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              {t('landing:provenResults.description')}
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-4xl font-bold text-blue-600 mb-4">10,000+</div>
              <p className="text-gray-600">Tests Completed</p>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-green-600 mb-4">87%</div>
              <p className="text-gray-600">Career Satisfaction Increase</p>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-purple-600 mb-4">5,200+</div>
              <p className="text-gray-600">Career Transitions</p>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-yellow-600 mb-4">4.8/5</div>
              <p className="text-gray-600">Average Rating</p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              {t('landing:testimonials.title')}
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
              {t('landing:testimonials.description')}
            </p>
            
            {/* Amazon Reviews Preview */}
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6 max-w-2xl mx-auto">
              <div className="flex items-center justify-center mb-3">
                <div className="flex items-center">
                  {[1, 2, 3, 4, 5].map((star, index) => (
                    <Star key={star} className={`w-5 h-5 ${index < 4 ? 'fill-yellow-400 text-yellow-400' : index === 4 ? 'fill-yellow-400/60 text-yellow-400' : 'text-gray-300'}`} />
                  ))}
                  <span className="ml-2 font-semibold text-gray-900">4.6/5</span>
                </div>
                <span className="mx-3 text-gray-400">•</span>
<span className="text-gray-600">Verified Amazon customers</span>
              </div>
              <p className="text-gray-700 mb-4">
                "Ever had those moments where you wonder, 'What am I really doing with my life?' These cards have been really insightful."
              </p>
              <Link href="/shop" className="inline-flex items-center text-blue-600 hover:text-blue-700 font-medium">
                See authentic customer reviews <ArrowRight className="w-4 h-4 ml-1" />
              </Link>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="p-6 hover:shadow-lg transition-shadow duration-300">
              <CardContent className="p-0">
                <div className="flex items-center mb-4">
                  <div className="flex text-yellow-400">
                    <Star className="w-5 h-5 fill-current" />
                    <Star className="w-5 h-5 fill-current" />
                    <Star className="w-5 h-5 fill-current" />
                    <Star className="w-5 h-5 fill-current" />
                    <Star className="w-5 h-5 fill-current" />
                  </div>
                </div>
                <p className="text-gray-700 mb-4 italic">
                  "The Ikigai test helped me realize that my true passion was in sustainable design. I've never been happier in my career."
                </p>
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center mr-3">
                    <span className="text-white font-bold">S</span>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">Sarah Johnson</p>
                    <p className="text-sm text-gray-600">UX Designer</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="p-6 hover:shadow-lg transition-shadow duration-300">
              <CardContent className="p-0">
                <div className="flex items-center mb-4">
                  <div className="flex text-yellow-400">
                    <Star className="w-5 h-5 fill-current" />
                    <Star className="w-5 h-5 fill-current" />
                    <Star className="w-5 h-5 fill-current" />
                    <Star className="w-5 h-5 fill-current" />
                    <Star className="w-5 h-5 fill-current" />
                  </div>
                </div>
                <p className="text-gray-700 mb-4 italic">
                  "I was stuck in corporate consulting for years. This test showed me my calling was in education and social impact."
                </p>
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-teal-500 rounded-full flex items-center justify-center mr-3">
                    <span className="text-white font-bold">D</span>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">David Chen</p>
                    <p className="text-sm text-gray-600">Social Impact Consultant</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="p-6 hover:shadow-lg transition-shadow duration-300">
              <CardContent className="p-0">
                <div className="flex items-center mb-4">
                  <div className="flex text-yellow-400">
                    <Star className="w-5 h-5 fill-current" />
                    <Star className="w-5 h-5 fill-current" />
                    <Star className="w-5 h-5 fill-current" />
                    <Star className="w-5 h-5 fill-current" />
                    <Star className="w-5 h-5 fill-current" />
                  </div>
                </div>
                <p className="text-gray-700 mb-4 italic">
                  "After 15 years in marketing, I discovered my Ikigai in food sustainability. Now I run my own consultancy."
                </p>
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center mr-3">
                    <span className="text-white font-bold">M</span>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">Maria Rodriguez</p>
                    <p className="text-sm text-gray-600">Sustainability Consultant</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              {t('landing:faq.title')}
            </h2>
            <p className="text-xl text-gray-600">
              {t('landing:faq.description')}
            </p>
          </div>
          
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">{t('landing:faq.q1')}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  {t('landing:faq.a1')}
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">{t('landing:faq.q2')}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  {t('landing:faq.a2')}
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">{t('landing:faq.q3')}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  {t('landing:faq.a3')}
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">{t('landing:faq.q4')}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  {t('landing:faq.a4')}
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* SEO Internal Links Section - Addresses ahrefs.com: No Outgoing Links & Orphan Pages */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Explore Your Ikigai Journey</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Discover comprehensive resources to help you find your life's purpose through Japanese philosophy.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Link href="/test" className="group">
              <Card className="hover:shadow-lg transition-shadow border-l-4 border-l-blue-500">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 group-hover:text-blue-600">
                    <Target className="h-5 w-5" />
                    Complete Ikigai Assessment
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">Take our comprehensive personality test to discover your life purpose through Japanese philosophy.</p>
                </CardContent>
              </Card>
            </Link>
            
            <Link href="/about" className="group">
              <Card className="hover:shadow-lg transition-shadow border-l-4 border-l-purple-500">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 group-hover:text-purple-600">
                    <Info className="h-5 w-5" />
                    About Our Mission
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">Learn about our founder's journey and mission to help people discover their Ikigai.</p>
                </CardContent>
              </Card>
            </Link>
            
            <Link href="/what-is-ikigai" className="group">
              <Card className="hover:shadow-lg transition-shadow border-l-4 border-l-green-500">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 group-hover:text-green-600">
                    <BookOpen className="h-5 w-5" />
                    What is Ikigai?
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">Explore the ancient Japanese concept of finding your reason for being and life purpose.</p>
                </CardContent>
              </Card>
            </Link>
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
            {t('landing:cta.subtitle')}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/ikigai-type-test" title="Start Free Type Test">
              <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-4 text-lg font-bold rounded-xl shadow-xl hover:shadow-2xl transition-all duration-300" title="Start Free Type Test">
                {t('navigation:fiveMinTest')}
              </Button>
            </Link>
            <Link href="/test" title="Take Full Ikigai Assessment">
              <Button size="lg" className="border-2 border-white bg-transparent text-white hover:bg-white hover:text-blue-600 px-8 py-4 text-lg font-bold rounded-xl shadow-xl hover:shadow-2xl transition-all duration-300" title="Take Full Ikigai Assessment">
                {t('navigation:completeAnalysis')}
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}