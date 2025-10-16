import type { Metadata } from 'next'
import Link from 'next/link'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Navigation from "@/components/Navigation"
import { 
  Heart, 
  Target, 
  TrendingUp, 
  DollarSign, 
  Brain, 
  Users, 
  BarChart3, 
  CheckCircle,
  Clock,
  Star,
  ArrowRight,
  Lightbulb,
  Globe,
  Trophy,
  Zap,
  BookOpen,
  Award,
  Shield,
  Compass
} from "lucide-react"

// This will be the canonical URL for SEO
export const metadata: Metadata = {
  title: 'Ikigai Test - Discover Your Life Purpose | Ikigain',
  description: 'Discover your Ikigai with our comprehensive personality test. Find your life purpose through Japanese philosophy and get personalized career insights.',
  keywords: 'ikigai, ikigai test, life purpose, ikigai meaning, what is ikigai, personality test, Japanese philosophy, meaning of life, purpose finder',
  alternates: {
    canonical: 'https://www.ikigain.org/',
    languages: {
      'en': 'https://www.ikigain.org/',
      'es': 'https://www.ikigain.org/es/',
      'fr': 'https://www.ikigain.org/fr/',
    },
  },
  openGraph: {
    title: 'Ikigai Test - Discover Your Life Purpose | Ikigain',
    description: 'Discover your Ikigai with our comprehensive personality test. Find your life purpose through Japanese philosophy and get personalized career insights.',
    url: 'https://www.ikigain.org/',
    siteName: 'Ikigain',
    images: [
      {
        url: 'https://www.ikigain.org/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Ikigai Test - Discover Your Life Purpose',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Ikigai Test - Discover Your Life Purpose | Ikigain',
    description: 'Discover your Ikigai with our comprehensive personality test. Find your life purpose through Japanese philosophy and get personalized career insights.',
    images: ['https://www.ikigain.org/og-image.jpg'],
  },
}

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white">
      <Navigation />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-50 to-purple-50 py-16 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <div className="mb-6">
            <Badge variant="secondary" className="bg-purple-100 text-purple-800 px-6 py-2 text-sm font-semibold">
              ✨ Discover Your Life Purpose
            </Badge>
          </div>
          
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
            Find Your <span className="text-purple-600">Ikigai</span>
            <br />
            <span className="text-3xl md:text-5xl text-gray-700">Your Reason for Being</span>
          </h1>
          
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
            Discover the intersection of what you love, what you're good at, what the world needs, 
            and what you can be paid for. Take our comprehensive personality test and unlock your life's purpose.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
            <Link href="/test">
              <Button size="lg" className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-4 text-lg font-semibold rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200">
                <Target className="mr-2 h-5 w-5" />
                Take Free Ikigai Test
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            
            <Link href="/what-is-ikigai">
              <Button variant="outline" size="lg" className="border-2 border-purple-200 text-purple-700 hover:bg-purple-50 px-8 py-4 text-lg font-semibold rounded-full">
                <Lightbulb className="mr-2 h-5 w-5" />
                What is Ikigai?
              </Button>
            </Link>
          </div>
          
          {/* Trust Indicators */}
          <div className="flex flex-wrap justify-center items-center gap-8 text-sm text-gray-600">
            <div className="flex items-center">
              <Users className="h-4 w-4 mr-2 text-green-600" />
              <span>50,000+ Tests Taken</span>
            </div>
            <div className="flex items-center">
              <Star className="h-4 w-4 mr-2 text-yellow-500" />
              <span>4.9/5 Average Rating</span>
            </div>
            <div className="flex items-center">
              <Shield className="h-4 w-4 mr-2 text-blue-600" />
              <span>100% Privacy Protected</span>
            </div>
            <div className="flex items-center">
              <Globe className="h-4 w-4 mr-2 text-purple-600" />
              <span>Available in 3 Languages</span>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Why Choose Our Ikigai Test?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our comprehensive assessment goes beyond basic personality tests to help you discover 
              your authentic life purpose and career direction.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="border-2 border-blue-100 hover:border-blue-200 transition-colors">
              <CardHeader className="text-center">
                <div className="mx-auto w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                  <Brain className="h-6 w-6 text-blue-600" />
                </div>
                <CardTitle className="text-xl font-semibold text-gray-900">
                  Scientific Approach
                </CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-gray-600">
                  Based on authentic Japanese Ikigai philosophy combined with modern 
                  personality psychology and career development research.
                </p>
              </CardContent>
            </Card>

            <Card className="border-2 border-purple-100 hover:border-purple-200 transition-colors">
              <CardHeader className="text-center">
                <div className="mx-auto w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mb-4">
                  <Target className="h-6 w-6 text-purple-600" />
                </div>
                <CardTitle className="text-xl font-semibold text-gray-900">
                  Personalized Results
                </CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-gray-600">
                  Get detailed insights into your unique personality type, career matches, 
                  and actionable steps to align with your life purpose.
                </p>
              </CardContent>
            </Card>

            <Card className="border-2 border-green-100 hover:border-green-200 transition-colors">
              <CardHeader className="text-center">
                <div className="mx-auto w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-4">
                  <Trophy className="h-6 w-6 text-green-600" />
                </div>
                <CardTitle className="text-xl font-semibold text-gray-900">
                  Career Guidance
                </CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-gray-600">
                  Discover career paths that align with your values, skills, and passions. 
                  Get practical roadmaps for professional development.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-purple-600 to-blue-600 py-16 px-4 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Discover Your Ikigai?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Join thousands who have found clarity and purpose through our comprehensive assessment.
          </p>
          
          <Link href="/test">
            <Button size="lg" className="bg-white text-purple-600 hover:bg-gray-100 px-8 py-4 text-lg font-semibold rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200">
              <Compass className="mr-2 h-5 w-5" />
              Start Your Journey Now
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </section>
    </div>
  )
}