import { useEffect } from "react";
import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Navigation from "@/components/Navigation";
import SEO from "@/components/SEO";
import { useAnalytics } from '@/hooks/use-analytics';
import { 
  CheckCircle, 
  Lock, 
  Star, 
  Target, 
  TrendingUp, 
  Users, 
  Briefcase, 
  ArrowRight, 
  Brain, 
  Zap, 
  ChevronRight, 
  DollarSign, 
  BarChart3, 
  Globe, 
  Trophy, 
  Rocket, 
  Bot,
  CreditCard,
  Sparkles,
  AlertCircle
} from "lucide-react";

export default function Upsell() {
  const { t } = useTranslation();
  const urlParams = new URLSearchParams(window.location.search);
  const sessionId = urlParams.get('sessionId') || urlParams.get('session');
  const { trackEvent } = useAnalytics();

  const { data: session, isLoading: isSessionLoading } = useQuery({
    queryKey: ["/api/test-sessions", sessionId],
    queryFn: async () => {
      const response = await fetch(`/api/test-sessions/${sessionId}`);
      if (!response.ok) throw new Error("Failed to fetch session");
      return response.json();
    },
    enabled: !!sessionId,
  });

  const { data: result, isLoading: isResultLoading } = useQuery({
    queryKey: ["/api/test-results", sessionId],
    queryFn: async () => {
      const response = await fetch(`/api/test-results/${sessionId}`);
      if (!response.ok) throw new Error("Failed to fetch test results");
      return response.json();
    },
    enabled: !!sessionId,
  });

  useEffect(() => {
    // Track upsell page view
    trackEvent('upsell_page_viewed', {
      session_id: sessionId,
      source: 'test_results'
    });
  }, [sessionId, trackEvent]);

  if (!sessionId) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4">{t('premiumAnalysis')}</h2>
            <p className="text-gray-600 mb-4">{t('sessionIdRequired')}</p>
            <Button onClick={() => window.location.href = '/test'}>{t('takeTest')}</Button>
          </div>
        </div>
      </div>
    );
  }

  if (isSessionLoading || isResultLoading || !session || !result) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4" />
            <p className="text-gray-600">{t('loadingPremiumAnalysis') || 'Loading premium analysis...'}</p>
          </div>
        </div>
      </div>
    );
  }

  const scores = {
    passion: Math.round(parseFloat(result.passionScore)),
    mission: Math.round(parseFloat(result.missionScore)),
    vocation: Math.round(parseFloat(result.vocationScore)),
    profession: Math.round(parseFloat(result.professionScore)),
    overall: Math.round(parseFloat(result.overallScore)),
  };

  const premiumFeatures = [
    {
      icon: <Star className="w-6 h-6" />,
      title: t('completeCareerAnalysis'),
      description: t('detailedCareerMatches'),
      preview: t('see15CareerPaths')
    },
    {
      icon: <Target className="w-6 h-6" />,
      title: t('personalizedRoadmaps'),
      description: t('stepByStepCareerDevelopment'),
      preview: t('3MonthActionPlans')
    },
    {
      icon: <Brain className="w-6 h-6" />,
      title: t('personalityDeepDive'),
      description: t('comprehensivePersonalityProfile'),
      preview: t('understandDecisionMaking')
    },
    {
      icon: <TrendingUp className="w-6 h-6" />,
      title: t('marketInsights'),
      description: t('industryTrendsEmergingRoles'),
      preview: t('stayAheadOfMarket')
    },
    {
      icon: <Users className="w-6 h-6" />,
      title: t('networkingStrategy'),
      description: t('targetedNetworkingRecommendations'),
      preview: t('connectWithRightPeople')
    },
    {
      icon: <Bot className="w-6 h-6" />,
      title: t('aiCareerMentor'),
      description: t('weeklyCheckInsPersonalizedTips'),
      preview: t('yourPersonalAICareerCoach')
    }
  ];

  // Mock premium data for demonstration
  const mockPremiumData = {
    careerMatches: [
      {
        title: "UX/UI Designer",
        match: 92,
        salary: "$65,000 - $120,000",
        growth: "13% (Above Average)",
        marketDemand: "High",
        workEnvironment: "Creative, collaborative teams",
        dailyTasks: ["Design user interfaces", "Conduct user research", "Create prototypes"]
      },
      {
        title: "Product Manager",
        match: 88,
        salary: "$80,000 - $140,000",
        growth: "15% (Excellent)",
        marketDemand: "Very High",
        workEnvironment: "Cross-functional leadership",
        dailyTasks: ["Define product strategy", "Coordinate with teams", "Analyze user feedback"]
      },
      {
        title: "Marketing Manager",
        match: 85,
        salary: "$55,000 - $95,000",
        growth: "10% (Average)",
        marketDemand: "High",
        workEnvironment: "Dynamic, results-driven",
        dailyTasks: ["Develop campaigns", "Analyze metrics", "Lead creative projects"]
      }
    ],
    roadmap: {
      career: "UX/UI Designer",
      timeline: "6-12 months",
      difficulty: "Moderate",
      steps: [
        {
          phase: "Foundation (0-2 months)",
          duration: "2 months",
          activities: ["Complete UX certification", "Build portfolio", "Practice design tools"],
          skills: ["Figma", "Adobe XD", "User Research"],
          milestones: ["3 portfolio projects", "UX certification"],
          resources: ["Coursera UX Course", "Figma tutorials", "Design systems"]
        },
        {
          phase: "Skill Building (2-4 months)",
          duration: "2 months",
          activities: ["Real client projects", "Join design communities", "Attend workshops"],
          skills: ["Prototyping", "Usability Testing", "Design Systems"],
          milestones: ["First client project", "Design community membership"],
          resources: ["Dribbble", "Behance", "Local meetups"]
        }
      ]
    },
    developmentAreas: [
      {
        area: "Technical Skills",
        current: 6,
        target: 8,
        priority: "High",
        actions: ["Take advanced design courses", "Learn coding basics", "Practice with design tools"],
        resources: ["Udemy courses", "YouTube tutorials", "Practice projects"],
        timeframe: "3-6 months"
      }
    ],
    personalityProfile: {
      cognitiveStyle: "Holistic thinker with attention to detail",
      workStyle: "Collaborative with independent problem-solving",
      communicationStyle: "Visual and empathetic",
      decisionMaking: "Data-informed with intuitive insights",
      stressManagement: "Seeks balance and creative outlets"
    },
    marketInsights: {
      industryTrends: ["Remote work increasing", "AI integration in design", "Sustainability focus"],
      emergingRoles: ["AI UX Designer", "Voice Interface Designer", "Sustainability Consultant"],
      skillsInDemand: ["Data analysis", "AI tools", "Cross-functional collaboration"],
      salaryTrends: "UX roles showing 15% year-over-year growth"
    }
  };

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": "Premium Ikigai Analysis",
    "description": "Comprehensive career analysis and personalized development roadmap based on your Ikigai assessment results",
    "offers": {
      "@type": "Offer",
      "price": "29.99",
      "priceCurrency": "USD",
      "availability": "https://schema.org/InStock"
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <SEO
        title="Premium Ikigai Analysis - Detailed Career Insights & Roadmap"
        description="Unlock your full potential with comprehensive career analysis, personalized roadmaps, and AI-powered insights based on your Ikigai assessment."
        keywords="premium ikigai analysis, career roadmap, personality analysis, career development, professional growth"
        canonical="https://www.ikigain.org/premium-analysis"
        structuredData={structuredData}
      />
      <Navigation />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full mb-4">
            <Sparkles className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">{t('unlockYourFullPotential')}</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-4">
            {t('getComprehensiveInsights')}
          </p>
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-100 to-pink-100 px-4 py-2 rounded-full">
            <Trophy className="w-5 h-5 text-purple-600" />
            <span className="text-sm font-medium text-purple-800">{t('basedOnYourProfile', { type: result.primaryType })}</span>
          </div>
        </div>

        {/* Premium Features Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {premiumFeatures.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="h-full border-2 border-purple-100 hover:border-purple-200 transition-colors">
                <CardHeader className="pb-3">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg text-white">
                      {feature.icon}
                    </div>
                    <CardTitle className="text-lg">{feature.title}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <p className="text-gray-600 mb-3">{feature.description}</p>
                  <div className="flex items-center gap-2 text-sm text-purple-600">
                    <ChevronRight className="w-4 h-4" />
                    <span>{feature.preview}</span>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Premium Demo Tabs */}
        <Card className="mb-12 border-2 border-purple-200">
          <CardHeader className="bg-gradient-to-r from-purple-50 to-pink-50">
            <CardTitle className="text-2xl font-bold text-center flex items-center justify-center gap-2">
              <Lock className="w-6 h-6" />
              Premium Analysis Preview
            </CardTitle>
            <p className="text-center text-gray-600">Here's what you'll get with your premium report</p>
          </CardHeader>
          <CardContent className="p-6">
            <Tabs defaultValue="overview" className="w-full">
              <TabsList className="grid w-full grid-cols-6 mb-6">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="careers">Careers</TabsTrigger>
                <TabsTrigger value="roadmap">Roadmap</TabsTrigger>
                <TabsTrigger value="development">Development</TabsTrigger>
                <TabsTrigger value="market">Market</TabsTrigger>
                <TabsTrigger value="personality">Personality</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h3 className="text-xl font-semibold flex items-center gap-2">
                      <Target className="w-5 h-5" />
                      Your Ikigai Profile
                    </h3>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Primary Type</span>
                        <Badge variant="secondary">{result.primaryType}</Badge>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Overall Score</span>
                        <span className="text-xl font-bold text-purple-600">{scores.overall}/72</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Career Match Accuracy</span>
                        <span className="text-green-600 font-semibold">92%</span>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <h3 className="text-xl font-semibold flex items-center gap-2">
                      <Zap className="w-5 h-5" />
                      Key Insights
                    </h3>
                    <ul className="space-y-2">
                      <li className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-green-500 mt-1 flex-shrink-0" />
                        <span className="text-sm">Strong creative and analytical blend</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-green-500 mt-1 flex-shrink-0" />
                        <span className="text-sm">High potential for leadership roles</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-green-500 mt-1 flex-shrink-0" />
                        <span className="text-sm">Best suited for collaborative environments</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="careers" className="space-y-6">
                <h3 className="text-xl font-semibold flex items-center gap-2">
                  <Briefcase className="w-5 h-5" />
                  Top Career Matches
                </h3>
                <div className="grid gap-4">
                  {mockPremiumData.careerMatches.map((career, index) => (
                    <div key={index} className="border rounded-lg p-4 bg-gradient-to-r from-gray-50 to-gray-100">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h4 className="font-semibold text-lg">{career.title}</h4>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge variant="outline">{career.match}% Match</Badge>
                            <span className="text-sm text-gray-600">{career.salary}</span>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-sm text-gray-600">Growth Rate</div>
                          <div className="font-semibold text-green-600">{career.growth}</div>
                        </div>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                        <div>
                          <div className="font-medium text-gray-700">Market Demand</div>
                          <div className="text-gray-600">{career.marketDemand}</div>
                        </div>
                        <div>
                          <div className="font-medium text-gray-700">Work Environment</div>
                          <div className="text-gray-600">{career.workEnvironment}</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="roadmap" className="space-y-6">
                <h3 className="text-xl font-semibold flex items-center gap-2">
                  <Rocket className="w-5 h-5" />
                  Career Development Roadmap
                </h3>
                <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-6 rounded-lg">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="text-lg font-semibold">{mockPremiumData.roadmap.career}</div>
                    <Badge variant="outline">{mockPremiumData.roadmap.timeline}</Badge>
                    <Badge variant="secondary">{mockPremiumData.roadmap.difficulty}</Badge>
                  </div>
                  <div className="space-y-6">
                    {mockPremiumData.roadmap.steps.map((step, index) => (
                      <div key={index} className="border-l-4 border-purple-400 pl-4">
                        <div className="flex items-center gap-2 mb-2">
                          <div className="w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
                            {index + 1}
                          </div>
                          <h4 className="font-semibold">{step.phase}</h4>
                          <span className="text-sm text-gray-600">({step.duration})</span>
                        </div>
                        <div className="ml-8 grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                          <div>
                            <div className="font-medium text-gray-700 mb-1">Key Activities</div>
                            <ul className="text-gray-600 space-y-1">
                              {step.activities.map((activity, i) => (
                                <li key={i}>• {activity}</li>
                              ))}
                            </ul>
                          </div>
                          <div>
                            <div className="font-medium text-gray-700 mb-1">Skills to Develop</div>
                            <div className="flex flex-wrap gap-1">
                              {step.skills.map((skill, i) => (
                                <Badge key={i} variant="outline" className="text-xs">{skill}</Badge>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="development" className="space-y-6">
                <h3 className="text-xl font-semibold flex items-center gap-2">
                  <TrendingUp className="w-5 h-5" />
                  Development Areas
                </h3>
                <div className="space-y-4">
                  {mockPremiumData.developmentAreas.map((area, index) => (
                    <div key={index} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="font-semibold">{area.area}</h4>
                        <Badge variant={area.priority === 'High' ? 'destructive' : 'secondary'}>
                          {area.priority} Priority
                        </Badge>
                      </div>
                      <div className="mb-3">
                        <div className="flex justify-between text-sm text-gray-600 mb-1">
                          <span>Current Level</span>
                          <span>Target Level</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Progress value={(area.current / 10) * 100} className="flex-1" />
                          <span className="text-sm text-gray-600">{area.current}/10</span>
                          <ArrowRight className="w-4 h-4 text-gray-400" />
                          <span className="text-sm font-semibold text-green-600">{area.target}/10</span>
                        </div>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                        <div>
                          <div className="font-medium text-gray-700 mb-1">Action Steps</div>
                          <ul className="text-gray-600 space-y-1">
                            {area.actions.map((action, i) => (
                              <li key={i}>• {action}</li>
                            ))}
                          </ul>
                        </div>
                        <div>
                          <div className="font-medium text-gray-700 mb-1">Resources</div>
                          <ul className="text-gray-600 space-y-1">
                            {area.resources.map((resource, i) => (
                              <li key={i}>• {resource}</li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="market" className="space-y-6">
                <h3 className="text-xl font-semibold flex items-center gap-2">
                  <BarChart3 className="w-5 h-5" />
                  Market Insights
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="border rounded-lg p-4">
                      <h4 className="font-semibold mb-2 flex items-center gap-2">
                        <Globe className="w-4 h-4" />
                        Industry Trends
                      </h4>
                      <ul className="space-y-2 text-sm">
                        {mockPremiumData.marketInsights.industryTrends.map((trend, i) => (
                          <li key={i} className="flex items-start gap-2">
                            <TrendingUp className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                            <span>{trend}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="border rounded-lg p-4">
                      <h4 className="font-semibold mb-2 flex items-center gap-2">
                        <Rocket className="w-4 h-4" />
                        Emerging Roles
                      </h4>
                      <div className="space-y-2">
                        {mockPremiumData.marketInsights.emergingRoles.map((role, i) => (
                          <Badge key={i} variant="outline" className="mr-2 mb-2">{role}</Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="border rounded-lg p-4">
                      <h4 className="font-semibold mb-2 flex items-center gap-2">
                        <Zap className="w-4 h-4" />
                        In-Demand Skills
                      </h4>
                      <div className="space-y-2">
                        {mockPremiumData.marketInsights.skillsInDemand.map((skill, i) => (
                          <Badge key={i} variant="secondary" className="mr-2 mb-2">{skill}</Badge>
                        ))}
                      </div>
                    </div>
                    <div className="border rounded-lg p-4">
                      <h4 className="font-semibold mb-2 flex items-center gap-2">
                        <DollarSign className="w-4 h-4" />
                        Salary Trends
                      </h4>
                      <p className="text-sm text-gray-600">{mockPremiumData.marketInsights.salaryTrends}</p>
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="personality" className="space-y-6">
                <h3 className="text-xl font-semibold flex items-center gap-2">
                  <Brain className="w-5 h-5" />
                  Personality Profile
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {Object.entries(mockPremiumData.personalityProfile).map(([key, value]) => (
                    <div key={key} className="border rounded-lg p-4">
                      <h4 className="font-semibold mb-2 capitalize">
                        {key.replace(/([A-Z])/g, ' $1').trim()}
                      </h4>
                      <p className="text-sm text-gray-600">{value}</p>
                    </div>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        {/* Pricing Section */}
        <Card className="bg-gradient-to-r from-purple-600 to-pink-600 text-white mb-8">
          <CardContent className="p-8 text-center">
            <div className="mb-6">
              <h3 className="text-3xl font-bold mb-2">Get Your Premium Analysis</h3>
              <p className="text-xl opacity-90">Complete insights for your career journey</p>
            </div>

            <div className="flex justify-center items-center gap-4 mb-6">
              <div className="text-4xl font-bold">$29.99</div>
              <div className="text-lg opacity-75">
                <div className="line-through">$49.99</div>
                <div className="text-sm">40% OFF</div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8 text-sm">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-300" />
                <span>15+ Career Matches</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-300" />
                <span>Personalized Roadmaps</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-300" />
                <span>AI Career Mentor</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-300" />
                <span>Market Insights</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-300" />
                <span>Personality Analysis</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-300" />
                <span>Downloadable Report</span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href={`/checkout?sessionId=${sessionId}`}>
                <Button 
                  size="lg" 
                  className="bg-white text-purple-600 hover:bg-gray-100 px-8 py-4 text-lg font-semibold"
                >
                  <CreditCard className="w-5 h-5 mr-2" />
                  Get Premium Analysis
                </Button>
              </Link>
              <Link href={`/results/${sessionId}`}>
                <Button 
                  size="lg" 
                  variant="outline" 
                  className="border-white text-white hover:bg-white/10 px-8 py-4 text-lg font-semibold"
                >
                  Back to Basic Results
                </Button>
              </Link>
            </div>

            <div className="mt-6 text-sm opacity-75 flex items-center justify-center gap-2">
              <AlertCircle className="w-4 h-4" />
              <span>30-day money-back guarantee</span>
            </div>
          </CardContent>
        </Card>

        {/* FAQ Section */}
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-center">Frequently Asked Questions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <h4 className="font-semibold">What's included in the Premium Analysis?</h4>
              <p className="text-sm text-gray-600">
                You'll get detailed career matches, personalized roadmaps, personality insights, market analysis, 
                networking strategies, and ongoing AI mentor support.
              </p>
            </div>
            <div className="space-y-2">
              <h4 className="font-semibold">How accurate are the career recommendations?</h4>
              <p className="text-sm text-gray-600">
                Our analysis is based on validated personality frameworks and real market data, 
                with 92% accuracy in career satisfaction predictions.
              </p>
            </div>
            <div className="space-y-2">
              <h4 className="font-semibold">Can I get a refund if I'm not satisfied?</h4>
              <p className="text-sm text-gray-600">
                Yes! We offer a 30-day money-back guarantee. If you're not completely satisfied, 
                we'll provide a full refund.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}