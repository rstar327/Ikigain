import { useState, Suspense } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Star, ShoppingCart, Heart, Zap, Users, CheckCircle, Gift, Truck, Sparkles, Check, Award, Clock, Shield } from 'lucide-react';
import { motion } from 'framer-motion';
import SEO from '@/components/SEO';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import digitalPreviewImage from '@assets/Screenshot 2025-08-13 at 09.44.14_1755068832557.png';

const shopStructuredData = {
  "@context": "https://schema.org",
  "@type": "Product",
  "name": "Ikigai Self-Discovery Cards - 35 Mindfulness Cards Set",
  "image": [
    "https://images.squarespace-cdn.com/content/v1/66c496034d677a50d5c39ae1/c3296428-c862-49f4-8ef4-293d63ec5c57/81wKBy8bd4L._AC_SL1500_.jpg"
  ],
  "description": "35 Japanese-inspired self-discovery cards designed to help you find your Ikigai - your life's purpose. Based on the authentic Japanese concept covering passion, mission, vocation, and profession.",
  "brand": {
    "@type": "Brand",
    "name": "Ikigain"
  },
  "category": "Self-Help Books & Cards",
  "offers": {
    "@type": "Offer",
    "url": "https://ikigain.org/shop",
    "priceCurrency": "USD",
    "price": "34.99",
    "priceValidUntil": "2025-12-31",
    "itemCondition": "https://schema.org/NewCondition",
    "availability": "https://schema.org/InStock"
  },
  "aggregateRating": {
    "@type": "AggregateRating",
    "ratingValue": "4.8",
    "reviewCount": "127"
  },
  "review": [
    {
      "@type": "Review",
      "reviewRating": {
        "@type": "Rating",
        "ratingValue": "5",
        "bestRating": "5"
      },
      "author": {
        "@type": "Person",
        "name": "Olivia Johnson"
      },
      "reviewBody": "I never thought self-discovery could be so fun! These cards have helped me understand my true passions."
    }
  ]
};

const amazonReviews = [
  {
    name: "Samantha Eaton",
    verified: "Verified Purchase",
    rating: 5,
    date: "May 23, 2024",
    title: "So helpful!",
    text: "Ever had those moments where you stop and wonder, 'What am I really doing with my life?' I know the feeling all too well. I was talking to my mom the other day about how I had been feeling lost and a bit stuck lately, so she got me this set of cards from Amazon. It's a workbook-style card set, inspired by the well known book Ikigai, that's filled with thought-provoking, self-discovery questions to help you figure out your strengths, passions, purpose, and more! I've been doing 1 card a day for nearly 2 weeks now and it's been really insightful. I'd highly recommend you check this out if you've been feeling the way I have so you can find clarity and purpose.",
    avatar: "SE"
  },
  {
    name: "Eugenio Garcia",
    verified: "Verified Purchase", 
    rating: 5,
    date: "October 14, 2022",
    title: "Reflection, planning, inspirational, and coach cards with questions and tasks",
    text: "Self-help is a tricky addiction: there are so many self-help \"experts\" out there, usually in book form or in podcasts, webcasts, and in seminars, and it is easy to get paralyzed just seeking some magic workaround, instead of some authentic expertise and self-help goal. I saw promotional material for the Ikigai self-coach cards and was quickly drawn in on the simplicity and \"promise\" of the Japanese \"perception of Ikigai - reason for living\". There are other, similar, Asian philosophies that I follow, especially in martial arts. I like that the 35 cards included in this \"kit\" of reflection cards are thought provoking and gently provocative.",
    avatar: "EG"
  },
  {
    name: "AJ",
    verified: "Verified Purchase",
    rating: 5, 
    date: "October 30, 2022",
    title: "Lovely thought provoking and intriguing reflection cards",
    text: "I study Zen and Buddhism and lately I've been inspired by the I Ching. This card set does remind me of the I Ching a little bit and primarily eastern philosophy. I don't know much about the Japanese perception of Ikigai but, this card set has inspired me to want to explore Ikigai. This card set does inspire and encourage me to be mindful not just throughout my day to day and the things going on around me but also to be mindful of my thoughts and to kind of dive a little deeper into my self. The content has been very engaging and insightful into my self and being more mindful of my self.",
    avatar: "AJ"
  },
  {
    name: "Sally", 
    verified: "Verified Purchase",
    rating: 4,
    date: "February 5, 2023", 
    title: "Thought Provoking Ikigain Self Coach Cards Insightful",
    text: "I was really impressed with this set of cards, which are inspired by the Japanese perception of Ikigai (reason for living). I wouldn't say working this activity has told me what my actual reason for living is but the questions are very thought provoking. Each card has 3 tasks on the back: Think, Write and Act. Some of the questions are very easy such as: How To Get Rid Of Things You Don't Need and then on the back under THINK it says, Think about what are the things or habits you want to or would like to get rid of both mental and physical. A little silly but fun and engaging. I recommend if this is the kind of thing you are into.",
    avatar: "SA"
  }
];

const testimonials = [
  {
    name: "Sarah M.",
    rating: 5,
    text: "These cards changed my perspective on life. I finally understand what drives me every morning.",
    avatar: "SM"
  },
  {
    name: "Michael R.",
    rating: 5,
    text: "Perfect for couples therapy sessions. My wife and I discovered so much about each other.",
    avatar: "MR"
  },
  {
    name: "Emily Chen",
    rating: 5,
    text: "The quality is amazing and the prompts are thoughtful. Highly recommend for anyone seeking clarity.",
    avatar: "EC"
  },
  {
    name: "David K.",
    rating: 5,
    text: "Used these during my career transition. They helped me identify my true calling.",
    avatar: "DK"
  }
];

const features = [
  {
    icon: Heart,
    key: "findPurpose"
  },
  {
    icon: Zap,
    key: "dailyMindfulness"
  },
  {
    icon: Users,
    key: "shareWithLovedOnes"
  },
  {
    icon: Gift,
    key: "beautifulDesign"
  }
];

function ShopContent() {
  const { t, ready } = useTranslation(['common', 'navigation', 'shop']);
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);

  // Loading state for translations
  if (!ready) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="text-lg text-gray-600">Loading shop...</p>
        </div>
      </div>
    );
  }

  // Static product data to avoid runtime suspension issues
  const product = {
    id: 1,
    name: "Ikigai Self-Discovery Cards",
    price: 19.90,
    originalPrice: 29.95,
    description: "35 Japanese-inspired mindfulness cards to help you discover your Ikigai - your reason for being. Perfect for personal growth and self-discovery.",
    benefits: [
      t('shop:product.features.0'),
      t('shop:product.features.1'),
      t('shop:product.features.2'),
      t('shop:product.features.3'),
      t('shop:product.features.4'),
      t('shop:product.features.5'),
      t('shop:product.features.6'),
      t('shop:product.features.7')
    ],
    images: [
      "https://images.squarespace-cdn.com/content/v1/66c496034d677a50d5c39ae1/c3296428-c862-49f4-8ef4-293d63ec5c57/81wKBy8bd4L._AC_SL1500_.jpg",
      "https://images.squarespace-cdn.com/content/v1/66c496034d677a50d5c39ae1/2b087e11-24c7-46d5-926b-f3ef3e4f73cc/4th+Picture.png",
      "https://images.squarespace-cdn.com/content/v1/66c496034d677a50d5c39ae1/9de03d07-f402-43cc-a68d-4127f34c9dea/3rd+Picture.png",
      "https://images.squarespace-cdn.com/content/v1/66c496034d677a50d5c39ae1/f1d069cf-9b69-41d9-9785-40594f54b294/2nd+Picture.png"
    ],
    inStock: true,
    category: "Self-Help & Personal Development",
    stockCount: 47,
    rating: 4.8,
    reviewCount: 127
  };

  const productImages = product.images;

  const handleAddToCart = () => {
    // Redirect to shop checkout with product information
    const params = new URLSearchParams({
      productId: 'ikigai-cards',
      quantity: quantity.toString(),
      amount: product.price.toString(),
      productName: product.name
    });
    
    window.location.href = `/shop/checkout?${params.toString()}`;
  };

  return (
    <>
      <SEO
        title={t('shop:pageTitle')}
        description={t('shop:pageDescription')}
        keywords="ikigai cards, self discovery cards, mindfulness cards, personal growth, japanese culture, life purpose, ikigai concept, meditation cards, self help cards, mindfulness gifts"
        structuredData={shopStructuredData}
      />
      
      <Navigation />
      
      <main className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
        {/* Product Details Section */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Tabs defaultValue="physical" className="w-full">
            {/* Product Tabs */}
            <div className="flex justify-center mb-8">
              <TabsList className="grid w-full max-w-md grid-cols-2 bg-gray-100 p-1 rounded-lg">
                <TabsTrigger 
                  value="physical" 
                  className="text-base font-semibold data-[state=active]:bg-white data-[state=active]:text-purple-600 data-[state=active]:shadow-sm rounded-md transition-all"
                >
                  Physical Cards
                </TabsTrigger>
                <TabsTrigger 
                  value="digital" 
                  className="text-base font-semibold data-[state=active]:bg-white data-[state=active]:text-blue-600 data-[state=active]:shadow-sm rounded-md transition-all"
                >
                  Digital Edition
                </TabsTrigger>
              </TabsList>
            </div>

            {/* Physical Cards Tab */}
            <TabsContent value="physical" className="space-y-8">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Product Gallery */}
                <div className="space-y-6">
                  <motion.div
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8 }}
                    className="relative"
                  >
                    <div className="aspect-square rounded-3xl overflow-hidden bg-gradient-to-br from-white to-gray-100 shadow-2xl">
                      <img
                        src={productImages[selectedImage]}
                        alt="Ikigai Self-Discovery Cards"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="absolute -top-4 -right-4 bg-gradient-to-r from-red-500 to-orange-500 text-white px-4 py-2 rounded-full font-bold shadow-lg">
                      {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}% OFF
                    </div>
                  </motion.div>
                  
                  <div className="grid grid-cols-4 gap-3">
                    {productImages.map((image, index) => (
                      <motion.button
                        key={index}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setSelectedImage(index)}
                        className={`aspect-square rounded-xl overflow-hidden border-3 transition-all ${
                          selectedImage === index 
                            ? 'border-indigo-500 shadow-lg' 
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <img
                          src={image}
                          alt={`Product view ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </motion.button>
                    ))}
                  </div>

              {/* Product Demo Video */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.3 }}
                className="bg-white rounded-2xl shadow-lg p-4 border border-gray-200"
              >
                <div className="flex items-center mb-3">
                  <span className="w-3 h-3 bg-red-500 rounded-full mr-2 animate-pulse"></span>
                  <span className="text-sm font-medium text-gray-900">See the Cards in Action</span>
                </div>
                <div className="relative rounded-xl overflow-hidden bg-gray-100 shadow-lg video-container">
                  <video
                    className="w-full aspect-video object-cover cursor-pointer"
                    controls
                    preload="metadata"
                    onError={(e) => console.error('Video error:', e)}
                    onLoadStart={() => console.log('Video load started')}
                    onLoadedData={() => console.log('Video data loaded')}
                  >
                    <source src="/attached_assets/ikigai-video.mp4" type="video/mp4" />
                    <source src="/attached_assets/copy_35BCA6A1-A184-47E3-99C9-676ACFBFCCB2%20(2)_1755069471810.mov" type="video/quicktime" />
                    Your browser does not support the video tag.
                  </video>
                  <div className="absolute top-4 left-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-3 py-1 rounded-full text-xs font-medium">
                    Product Demo
                  </div>
                </div>
                <p className="text-xs text-gray-600 mt-2">
                  Watch how our customers use the Ikigai cards for daily self-discovery and mindfulness practice.
                </p>
              </motion.div>
            </div>

            {/* Product Information for Physical Cards */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="space-y-6"
            >
              <div>
                <Badge className="mb-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white">
                  <Sparkles className="w-4 h-4 mr-1" />
                  {t('shop:product.badge')}
                </Badge>
                <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
                  {t('shop:product.title')}
                </h1>
                <p className="text-lg text-gray-600 mb-4">
                  {t('shop:product.subtitle')}
                </p>
                
                {/* Trust Indicators */}
                <div className="grid grid-cols-3 gap-4 mb-4">
                  <div className="text-center p-4 bg-gradient-to-b from-green-50 to-green-100 rounded-lg">
                    <Star className="w-8 h-8 fill-yellow-400 text-yellow-400 mx-auto mb-2" />
                    <div className="font-bold text-lg">{product.rating}</div>
                    <div className="text-sm text-gray-600">{product.reviewCount} {t('shop:product.rating')}</div>
                  </div>
                  <div className="text-center p-4 bg-gradient-to-b from-blue-50 to-blue-100 rounded-lg">
                    <Users className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                    <div className="font-bold text-lg">12K+</div>
                    <div className="text-sm text-gray-600">{t('shop:product.customers')}</div>
                  </div>
                  <div className="text-center p-4 bg-gradient-to-b from-purple-50 to-purple-100 rounded-lg">
                    <CheckCircle className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                    <div className="font-bold text-lg">100%</div>
                    <div className="text-sm text-gray-600">{t('shop:product.guarantee')}</div>
                  </div>
                </div>

                {/* Product Benefits */}
                <div className="space-y-4 mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">What's Included:</h3>
                  <div className="space-y-3">
                    <div className="flex items-center">
                      <Check className="w-5 h-5 text-green-600 mr-3 flex-shrink-0" />
                      <span className="text-gray-700">35 beautifully designed cards with premium finish</span>
                    </div>
                    <div className="flex items-center">
                      <Check className="w-5 h-5 text-green-600 mr-3 flex-shrink-0" />
                      <span className="text-gray-700">Based on authentic Japanese Ikigai concept</span>
                    </div>
                    <div className="flex items-center">
                      <Check className="w-5 h-5 text-green-600 mr-3 flex-shrink-0" />
                      <span className="text-gray-700">Perfect for couples and group activities</span>
                    </div>
                    <div className="flex items-center">
                      <Check className="w-5 h-5 text-green-600 mr-3 flex-shrink-0" />
                      <span className="text-gray-700">Premium quality card stock with UV coating</span>
                    </div>
                    <div className="flex items-center">
                      <Check className="w-5 h-5 text-green-600 mr-3 flex-shrink-0" />
                      <span className="text-gray-700">5-minute daily practices for personal growth</span>
                    </div>
                    <div className="flex items-center">
                      <Check className="w-5 h-5 text-green-600 mr-3 flex-shrink-0" />
                      <span className="text-gray-700">Guided self-reflection questions</span>
                    </div>
                    <div className="flex items-center">
                      <Check className="w-5 h-5 text-green-600 mr-3 flex-shrink-0" />
                      <span className="text-gray-700">Beautiful Japanese-inspired artwork</span>
                    </div>
                    <div className="flex items-center">
                      <Check className="w-5 h-5 text-green-600 mr-3 flex-shrink-0" />
                      <span className="text-gray-700">Suitable for all ages and backgrounds</span>
                    </div>
                  </div>
                </div>

                {/* Physical Product Pricing and Purchase */}
                <div className="bg-white rounded-2xl p-6 border-2 border-dashed border-gray-200">
                  <div className="flex items-baseline space-x-2 mb-4">
                    <span className="text-3xl font-bold text-gray-900">${product.price}</span>
                    <span className="text-lg text-gray-500 line-through">${product.originalPrice}</span>
                    <Badge variant="outline" className="bg-red-50 text-red-700">
                      {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}% OFF
                    </Badge>
                  </div>
                  
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center text-sm text-gray-600">
                      <Truck className="w-4 h-4 mr-2" />
                      Free shipping worldwide
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <Shield className="w-4 h-4 mr-2" />
                      30-day money back guarantee
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <Clock className="w-4 h-4 mr-2" />
                      Only 47 left in stock
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <Button
                      size="lg"
                      className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white py-4 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
                      onClick={handleAddToCart}
                    >
                      <ShoppingCart className="w-5 h-5 mr-2" />
                      Add to Cart - ${product.price}
                    </Button>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </TabsContent>

        {/* Digital Edition Tab */}
        <TabsContent value="digital" className="space-y-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Digital Product Preview */}
            <div className="space-y-6">
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
                className="relative"
              >
                <div className="aspect-square rounded-3xl overflow-hidden bg-white shadow-2xl p-4">
                  <img
                    src={digitalPreviewImage}
                    alt="Ikigai Cards Digital Preview"
                    className="w-full h-full object-contain"
                    onError={(e) => {
                      // Fallback if image fails to load
                      const target = e.target as HTMLImageElement;
                      target.style.display = 'none';
                      target.parentElement!.innerHTML = `
                        <div class="w-full h-full flex items-center justify-center">
                          <div class="text-center space-y-4">
                            <div class="w-24 h-24 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl mx-auto flex items-center justify-center shadow-lg">
                              <svg class="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                              </svg>
                            </div>
                            <div>
                              <h3 class="text-2xl font-bold text-gray-900">Ikigai Cards</h3>
                              <p class="text-gray-600">Digital Edition Preview</p>
                            </div>
                          </div>
                        </div>
                      `;
                    }}
                  />
                </div>
                <div className="absolute -top-4 -right-4 bg-gradient-to-r from-green-500 to-blue-500 text-white px-4 py-2 rounded-full font-bold shadow-lg">
                  33% OFF
                </div>
              </motion.div>

              {/* Digital Preview Card */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100"
              >
                <div className="text-center space-y-4">
                  <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl mx-auto flex items-center justify-center shadow-lg">
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">Digital PDF</h3>
                    <p className="text-gray-600">3.5 MB • 35 Cards</p>
                    <p className="text-sm text-gray-500 mt-1">Instant Download</p>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Digital Product Information */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="space-y-6"
            >
              <div>
                <Badge className="mb-4 bg-gradient-to-r from-blue-500 to-green-500 text-white">
                  <Zap className="w-4 h-4 mr-1" />
                  {t('shop:digital.badge', 'Instant Digital Download')}
                </Badge>
                <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
                  Ikigai Cards - Digital Edition
                </h1>
                <p className="text-lg text-gray-600 mb-4">
                  Get immediate access to all 35 self-discovery cards in a high-quality digital format. Perfect for printing at home or using on your device.
                </p>
                
                {/* Digital Product Features */}
                <div className="space-y-3">
                  <div className="flex items-center">
                    <Check className="w-5 h-5 text-green-600 mr-2" />
                    <span className="text-gray-700">Instant download after purchase</span>
                  </div>
                  <div className="flex items-center">
                    <Check className="w-5 h-5 text-green-600 mr-2" />
                    <span className="text-gray-700">High-resolution PDF (300 DPI)</span>
                  </div>
                  <div className="flex items-center">
                    <Check className="w-5 h-5 text-green-600 mr-2" />
                    <span className="text-gray-700">Print-ready format</span>
                  </div>
                  <div className="flex items-center">
                    <Check className="w-5 h-5 text-green-600 mr-2" />
                    <span className="text-gray-700">Lifetime access</span>
                  </div>
                </div>

                {/* Digital Product Pricing */}
                <div className="bg-white rounded-2xl p-6 border-2 border-dashed border-gray-200 mt-6">
                  <div className="flex items-baseline space-x-2 mb-4">
                    <span className="text-3xl font-bold text-gray-900">$9.99</span>
                    <span className="text-lg text-gray-500 line-through">$14.99</span>
                    <Badge variant="outline" className="bg-green-50 text-green-700">
                      33% OFF
                    </Badge>
                  </div>
                  
                  <div className="space-y-4">
                    <Button
                      size="lg"
                      className="w-full bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 text-white py-4 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
                      onClick={() => {
                        const params = new URLSearchParams({
                          productId: 'ikigai-cards-digital',
                          quantity: '1',
                          amount: '9.99',
                          productName: 'Ikigai Cards - Digital Edition'
                        });
                        window.location.href = `/shop/checkout?${params.toString()}`;
                      }}
                    >
                      <Zap className="w-5 h-5 mr-2" />
                      Get Instant Access - $9.99
                    </Button>
                    
                    <div className="text-center text-sm text-gray-500">
                      <Shield className="w-4 h-4 inline mr-1" />
                      Instant download • 30-day guarantee • Secure checkout
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </TabsContent>
      </Tabs>
    </section>

    {/* Features Section */}
    <section className="py-16 bg-white/50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
            Why Choose Our Ikigai Cards?
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Experience the authentic Japanese concept of Ikigai with our carefully crafted self-discovery system.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0 * 0.1 }}
            className="text-center group"
          >
            <div className="w-16 h-16 bg-gradient-to-br from-purple-100 to-pink-100 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
              <Heart className="w-8 h-8 text-purple-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Find Your Purpose
            </h3>
            <p className="text-gray-600 text-sm">
              Discover what truly matters to you through guided self-reflection
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1 * 0.1 }}
            className="text-center group"
          >
            <div className="w-16 h-16 bg-gradient-to-br from-purple-100 to-pink-100 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
              <Zap className="w-8 h-8 text-purple-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Daily Mindfulness
            </h3>
            <p className="text-gray-600 text-sm">
              5-minute daily practices for personal growth and clarity
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 2 * 0.1 }}
            className="text-center group"
          >
            <div className="w-16 h-16 bg-gradient-to-br from-purple-100 to-pink-100 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
              <Users className="w-8 h-8 text-purple-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Share with Loved Ones
            </h3>
            <p className="text-gray-600 text-sm">
              Perfect for couples, families, and friends to discover together
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 3 * 0.1 }}
            className="text-center group"
          >
            <div className="w-16 h-16 bg-gradient-to-br from-purple-100 to-pink-100 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
              <Gift className="w-8 h-8 text-purple-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Beautiful Design
            </h3>
            <p className="text-gray-600 text-sm">
              Premium quality cards with inspiring Japanese-inspired artwork
            </p>
          </motion.div>
        </div>
      </div>
    </section>

    {/* Video Testimonials Section */}
    <section className="py-16 bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">What Our Customers Say</h2>
          <p className="text-lg text-gray-600">
            Join thousands of people who have transformed their lives with our Ikigai cards
          </p>
        </motion.div>

        {/* Featured Video Testimonial */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="max-w-2xl mx-auto mb-12"
        >
          <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-3xl p-8 shadow-xl">
            <div className="relative">
              <Badge className="absolute -top-2 left-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white z-10">
                Customer Stories
              </Badge>
              <div className="relative rounded-2xl overflow-hidden bg-gray-100 shadow-lg testimonial-video-container">
                <video
                  className="w-full aspect-video object-cover"
                  controls
                  preload="metadata"
                  onError={(e) => console.error('Video error:', e)}
                  onLoadStart={() => console.log('Video load started')}
                  onLoadedData={() => console.log('Video data loaded')}
                >
                  <source src="/attached_assets/ikigai-video.mp4" type="video/mp4" />
                  <source src="/attached_assets/copy_35BCA6A1-A184-47E3-99C9-676ACFBFCCB2%20(2)_1755069471810.mov" type="video/quicktime" />
                  Your browser does not support the video tag.
                </video>
              </div>
            </div>
            <div className="mt-6 text-center">
              <div className="flex justify-center mb-2">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                ))}
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Real People, Real Transformations</h3>
              <p className="text-gray-600">
                Watch directly from our customers about how the Ikigai cards have helped them discover their purpose and transform their lives.
              </p>
            </div>
          </div>
        </motion.div>

        {/* Amazon Reviews Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0 * 0.1 }}
            className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-300 border border-gray-100"
          >
            <div className="flex justify-center mb-3">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
              ))}
            </div>
            <p className="text-gray-700 text-sm mb-4 italic">"These cards have revolutionized how I approach self-discovery. The quality and thoughtfulness in each card is incredible."</p>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                  SJ
                </div>
                <div className="ml-3">
                  <h4 className="font-semibold text-gray-900 text-sm">Sarah Johnson</h4>
                  <p className="text-gray-500 text-xs">Life Coach</p>
                </div>
              </div>
              <div className="text-xs text-gray-400">
                <svg className="w-4 h-4 inline mr-1" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M.045 18.02c.072-.116.187-.124.348-.022 3.636 2.11 8.347 2.11 11.983 0 .161-.102.276-.094.348.022.072.116.064.234-.022.35-2.129 2.867-6.14 2.867-8.269 0-.086-.116-.094-.234-.022-.35zm11.473-9.48c-.072.116-.187.124-.348.022-3.636-2.11-8.347-2.11-11.983 0-.161.102-.276.094-.348-.022-.072-.116-.064-.234.022-.35 2.129-2.867 6.14-2.867 8.269 0 .086.116.094.234.022.35z"/>
                </svg>
                Amazon
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1 * 0.1 }}
            className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-300 border border-gray-100"
          >
            <div className="flex justify-center mb-3">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
              ))}
            </div>
            <p className="text-gray-700 text-sm mb-4 italic">"Found my true calling through these cards. The Japanese wisdom combined with practical exercises is perfect."</p>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                  MC
                </div>
                <div className="ml-3">
                  <h4 className="font-semibold text-gray-900 text-sm">Michael Chen</h4>
                  <p className="text-gray-500 text-xs">Entrepreneur</p>
                </div>
              </div>
              <div className="text-xs text-gray-400">
                <svg className="w-4 h-4 inline mr-1" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M.045 18.02c.072-.116.187-.124.348-.022 3.636 2.11 8.347 2.11 11.983 0 .161-.102.276-.094.348.022.072.116.064.234-.022.35-2.129 2.867-6.14 2.867-8.269 0-.086-.116-.094-.234-.022-.35zm11.473-9.48c-.072.116-.187.124-.348.022-3.636-2.11-8.347-2.11-11.983 0-.161.102-.276.094-.348-.022-.072-.116-.064-.234.022-.35 2.129-2.867 6.14-2.867 8.269 0 .086.116.094.234.022.35z"/>
                </svg>
                Amazon
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 2 * 0.1 }}
            className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-300 border border-gray-100"
          >
            <div className="flex justify-center mb-3">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
              ))}
            </div>
            <p className="text-gray-700 text-sm mb-4 italic">"I use these with my clients regularly. The insights they provide are profound and life-changing."</p>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-10 h-10 bg-gradient-to-r from-pink-500 to-red-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                  ER
                </div>
                <div className="ml-3">
                  <h4 className="font-semibold text-gray-900 text-sm">Emily Rodriguez</h4>
                  <p className="text-gray-500 text-xs">Therapist</p>
                </div>
              </div>
              <div className="text-xs text-gray-400">
                <svg className="w-4 h-4 inline mr-1" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M.045 18.02c.072-.116.187-.124.348-.022 3.636 2.11 8.347 2.11 11.983 0 .161-.102.276-.094.348.022.072.116.064.234-.022.35-2.129 2.867-6.14 2.867-8.269 0-.086-.116-.094-.234-.022-.35zm11.473-9.48c-.072.116-.187.124-.348.022-3.636-2.11-8.347-2.11-11.983 0-.161.102-.276.094-.348-.022-.072-.116-.064-.234.022-.35 2.129-2.867 6.14-2.867 8.269 0 .086.116.094.234.022.35z"/>
                </svg>
                Amazon
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>

    {/* Amazon Reviews Section */}
    <section className="py-16 bg-white/50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4 flex items-center justify-center">
            <Award className="w-8 h-8 text-orange-500 mr-3" />
            Real Amazon Reviews
          </h2>
          <p className="text-lg text-gray-600">
            Authentic feedback from verified customers on Amazon
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {amazonReviews.map((review, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="bg-white rounded-2xl p-6 shadow-lg border border-orange-100"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-gradient-to-r from-orange-400 to-red-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                    {review.avatar}
                  </div>
                  <div className="ml-3">
                    <h4 className="font-semibold text-gray-900">{review.name}</h4>
                    <div className="flex items-center space-x-2">
                      <div className="flex">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star
                            key={i}
                            className={`w-4 h-4 ${
                              i < review.rating
                                ? 'text-yellow-400 fill-current'
                                : 'text-gray-300'
                            }`}
                          />
                        ))}
                      </div>
                      <span className="text-sm text-gray-500">{review.date}</span>
                    </div>
                  </div>
                </div>
                <Badge variant="outline" className="bg-green-50 text-green-700">
                  {review.verified}
                </Badge>
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">{review.title}</h4>
              <p className="text-gray-600 text-sm leading-relaxed">{review.text}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>

    {/* Call to Action */}
    <section className="py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-3xl p-8 shadow-2xl"
        >
          <h2 className="text-3xl font-bold mb-4">Ready to Discover Your Ikigai?</h2>
          <p className="text-xl mb-6 opacity-90">
            Join thousands who have found clarity and purpose with our proven self-discovery system.
          </p>
          <Button
            size="lg"
            className="bg-white text-purple-600 hover:bg-gray-100 px-8 py-4 text-lg font-semibold shadow-lg"
            onClick={handleAddToCart}
          >
            <Gift className="w-5 h-5 mr-2" />
            Start Your Journey Today
          </Button>
        </motion.div>
      </div>
    </section>
  </main>

  <Footer />
</>
  );
}

export default function Shop() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="text-lg text-gray-600">Loading shop...</p>
        </div>
      </div>
    }>
      <ShopContent />
    </Suspense>
  );
}
