import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useLocalizedPath } from "@/hooks/useLocalizedPath";
import { useTranslation } from 'react-i18next';
import { 
  ArrowRight, 
  BookOpen, 
  Target, 
  Info, 
  Brain,
  Heart,
  Compass,
  Star,
  Trophy,
  Lightbulb
} from "lucide-react";

interface NavigationItem {
  title: string;
  description: string;
  href: string;
  icon: React.ReactNode;
  category: 'primary' | 'secondary' | 'personality';
}

export default function InternalNavigation() {
  const { t } = useTranslation(['navigation', 'common']);
  const { getPath } = useLocalizedPath();

  const navigationItems: NavigationItem[] = [
    // Primary navigation
    {
      title: t('navigation:takeTest', 'Take Ikigai Test'),
      description: 'Discover your life purpose through our comprehensive personality assessment',
      href: getPath('/test'),
      icon: <Target className="h-5 w-5" />,
      category: 'primary'
    },
    {
      title: t('navigation:whatIsIkigai', 'What is Ikigai?'),
      description: 'Learn about the Japanese philosophy of finding your reason for being',
      href: getPath('/what-is-ikigai'),
      icon: <BookOpen className="h-5 w-5" />,
      category: 'primary'
    },
    {
      title: t('navigation:aboutUs', 'About Us'),
      description: 'Meet our team and learn about our mission to help you find purpose',
      href: getPath('/about'),
      icon: <Info className="h-5 w-5" />,
      category: 'primary'
    },
    {
      title: t('navigation:blog', 'Ikigai Blog'),
      description: 'Read insights on living with purpose and meaningful personal development',
      href: getPath('/blog'),
      icon: <Lightbulb className="h-5 w-5" />,
      category: 'primary'
    },
    
    // Personality types
    {
      title: 'The Builder',
      description: 'Practical, action-oriented individuals who create tangible value and lasting impact',
      href: getPath('/ikigai-types/builder'),
      icon: <Brain className="h-5 w-5" />,
      category: 'personality'
    },
    {
      title: 'The Dreamer',
      description: 'Visionary souls who find purpose through imagination and inspiring creativity',
      href: getPath('/ikigai-types/dreamer'),
      icon: <Star className="h-5 w-5" />,
      category: 'personality'
    },
    {
      title: 'The Explorer',
      description: 'Curious adventurers who discover purpose through learning and expanding horizons',
      href: getPath('/ikigai-types/explorer'),
      icon: <Compass className="h-5 w-5" />,
      category: 'personality'
    },
    {
      title: 'The Achiever',
      description: 'Goal-driven individuals who find purpose through excellence and accomplishments',
      href: getPath('/ikigai-types/achiever'),
      icon: <Trophy className="h-5 w-5" />,
      category: 'personality'
    },
    {
      title: 'The Helper',
      description: 'Compassionate souls who find purpose through service and supporting others',
      href: getPath('/ikigai-types/helper'),
      icon: <Heart className="h-5 w-5" />,
      category: 'personality'
    }
  ];

  const primaryItems = navigationItems.filter(item => item.category === 'primary');
  const personalityItems = navigationItems.filter(item => item.category === 'personality');

  return (
    <div className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Primary Navigation Section */}
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Explore Your Ikigai Journey
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Navigate through our comprehensive resources to discover your life purpose and find meaningful direction
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {primaryItems.map((item, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow duration-300 group">
              <CardHeader className="pb-4">
                <div className="flex items-center space-x-3 mb-2">
                  <div className="p-2 bg-blue-100 rounded-lg group-hover:bg-blue-200 transition-colors">
                    {item.icon}
                  </div>
                  <CardTitle className="text-lg font-semibold">{item.title}</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <p className="text-gray-600 mb-4 text-sm leading-relaxed">
                  {item.description}
                </p>
                <Link href={item.href}>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="w-full group-hover:bg-blue-50 transition-colors"
                  >
                    Learn More
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Personality Types Section */}
        <div className="text-center mb-12">
          <h3 className="text-2xl font-bold text-gray-900 mb-4">
            Discover Your Ikigai Personality Type
          </h3>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Each personality type represents a unique path to finding purpose and fulfillment
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {personalityItems.map((item, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow duration-300 group">
              <CardHeader className="pb-4">
                <div className="flex items-center space-x-3 mb-2">
                  <div className="p-2 bg-green-100 rounded-lg group-hover:bg-green-200 transition-colors">
                    {item.icon}
                  </div>
                  <CardTitle className="text-lg font-semibold">{item.title}</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <p className="text-gray-600 mb-4 text-sm leading-relaxed">
                  {item.description}
                </p>
                <Link href={item.href}>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="w-full group-hover:bg-green-50 transition-colors"
                  >
                    Explore Type
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Call to Action */}
        <div className="text-center mt-16">
          <Card className="bg-blue-50 border-blue-200">
            <CardContent className="p-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                Ready to Find Your Ikigai?
              </h3>
              <p className="text-lg text-gray-600 mb-6 max-w-2xl mx-auto">
                Take our comprehensive test to discover your unique path to purpose and get personalized insights for your journey
              </p>
              <Link href={getPath('/test')}>
                <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white">
                  Start Your Journey
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}