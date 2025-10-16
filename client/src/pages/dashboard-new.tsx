import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Link } from "wouter";
import { useAuth } from "@/hooks/useAuth";
import Navigation from "@/components/Navigation";
import { 
  Clock, 
  Star, 
  Target, 
  Sparkles, 
  BarChart3, 
  TestTube, 
  Eye, 
  BookOpen, 
  ArrowRight,
  CheckCircle,
  TrendingUp,
  Calendar,
} from "lucide-react";

export default function Dashboard() {
  const { user, isAuthenticated } = useAuth();
  
  const { data: testSessions, isLoading: sessionsLoading } = useQuery<any[]>({
    queryKey: ["/api/test-sessions"],
    enabled: isAuthenticated,
    retry: false,
  });

  const firstName = (user as any)?.firstName || "Explorer";
  const greeting = getGreeting();

  function getGreeting() {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 17) return "Good afternoon";
    return "Good evening";
  }

  // Determine user state based on test sessions
  const getUserState = () => {
    if (!testSessions || testSessions.length === 0) {
      return "new_user"; // Never taken any test
    }
    
    const completedSessions = testSessions.filter((session: any) => session.isCompleted);
    const recentSession = completedSessions[completedSessions.length - 1];
    
    if (completedSessions.length === 0) {
      return "incomplete_test"; // Started but never completed
    }
    
    if (recentSession?.hasPremiumAccess) {
      return "premium_user"; // Has premium access
    }
    
    return "basic_user"; // Completed test, has basic results
  };

  const userState = getUserState();

  // Define the render function that determines which dashboard to show
  function renderDashboardContent() {
    switch (userState) {
      case "new_user":
        return renderNewUserDashboard();
      case "incomplete_test":
        return renderIncompleteTestDashboard();
      case "basic_user":
        return renderBasicUserDashboard();
      case "premium_user":
        return renderPremiumUserDashboard();
      default:
        return renderNewUserDashboard();
    }
  }

  // Render different dashboard states based on user journey
  const renderNewUserDashboard = () => (
    <div className="space-y-8">
      {/* Welcome Section for New Users */}
      <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl p-8 mb-8 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full -mr-20 -mt-20"></div>
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/5 rounded-full -ml-16 -mb-16"></div>
        <div className="relative z-10">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold mb-2">
                {greeting}, {firstName}! 
                <Sparkles className="inline-block w-8 h-8 ml-2 text-yellow-300 animate-pulse" />
              </h1>
              <p className="text-xl text-purple-100 mb-4">
                Ready to discover your life's purpose?
              </p>
              <p className="text-purple-200 text-lg mb-6">
                Your Ikigai journey starts here – let's find what makes you come alive.
              </p>
              <div className="flex items-center space-x-4">
                <div className="flex items-center text-purple-100">
                  <Clock className="w-4 h-4 mr-2" />
                  <span className="text-sm">Just 15 minutes to life-changing insights</span>
                </div>
                <div className="flex items-center text-purple-100">
                  <Star className="w-4 h-4 mr-2" />
                  <span className="text-sm">Join 10,000+ purpose seekers</span>
                </div>
              </div>
            </div>
            <div className="hidden md:block">
              <div className="w-32 h-32 bg-white/20 rounded-full flex items-center justify-center animate-pulse">
                <Target className="w-16 h-16 text-white" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Social Proof for New Users */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <Card className="bg-gradient-to-r from-green-500 to-emerald-600 text-white border-0 shadow-lg">
          <CardContent className="p-6 text-center">
            <div className="text-3xl font-bold mb-2">10,000+</div>
            <p className="text-green-100 text-sm">People discovered their purpose</p>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-r from-blue-500 to-cyan-600 text-white border-0 shadow-lg">
          <CardContent className="p-6 text-center">
            <div className="text-3xl font-bold mb-2">87%</div>
            <p className="text-blue-100 text-sm">Report increased life satisfaction</p>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-r from-purple-500 to-pink-600 text-white border-0 shadow-lg">
          <CardContent className="p-6 text-center">
            <div className="text-3xl font-bold mb-2">15 min</div>
            <p className="text-purple-100 text-sm">Average time to breakthrough</p>
          </CardContent>
        </Card>
      </div>

      {/* Assessment Options for New Users */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card className="bg-gradient-to-br from-blue-600 to-purple-700 text-white border-0 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <div>
                <Badge className="bg-white/20 text-white border-0 mb-3">Most Popular</Badge>
                <CardTitle className="text-2xl font-bold text-white">Full Ikigai Test</CardTitle>
              </div>
              <BarChart3 className="w-12 h-12 text-blue-200" />
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-blue-100 mb-6">
              Comprehensive analysis of your passions, talents, values, and purpose with detailed career guidance and actionable insights.
            </p>
            <div className="space-y-2 mb-6">
              <div className="flex items-center">
                <Clock className="w-4 h-4 mr-2 text-blue-200" />
                <span className="text-sm text-blue-100">18 thought-provoking questions</span>
              </div>
              <div className="flex items-center">
                <Eye className="w-4 h-4 mr-2 text-blue-200" />
                <span className="text-sm text-blue-100">Detailed personality insights</span>
              </div>
              <div className="flex items-center">
                <Target className="w-4 h-4 mr-2 text-blue-200" />
                <span className="text-sm text-blue-100">Personalized career recommendations</span>
              </div>
            </div>
            <Link href="/ikigai-test">
              <Button className="w-full bg-white text-blue-600 hover:bg-blue-50 font-semibold py-3 transform hover:scale-105 transition-all duration-200">
                Start Your Journey
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-emerald-500 to-teal-600 text-white border-0 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <div>
                <Badge className="bg-white/20 text-white border-0 mb-3">Quick Start</Badge>
                <CardTitle className="text-2xl font-bold text-white">Free Ikigai Type Test</CardTitle>
              </div>
              <TestTube className="w-12 h-12 text-emerald-200" />
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-emerald-100 mb-6">
              Quick personality assessment to identify your primary Ikigai type and get started on your purpose-driven path.
            </p>
            <div className="space-y-2 mb-6">
              <div className="flex items-center">
                <Clock className="w-4 h-4 mr-2 text-emerald-200" />
                <span className="text-sm text-emerald-100">12 quick questions</span>
              </div>
              <div className="flex items-center">
                <Eye className="w-4 h-4 mr-2 text-emerald-200" />
                <span className="text-sm text-emerald-100">Instant personality type</span>
              </div>
              <div className="flex items-center">
                <BookOpen className="w-4 h-4 mr-2 text-emerald-200" />
                <span className="text-sm text-emerald-100">Free insights & tips</span>
              </div>
            </div>
            <Link href="/ikigai-type-test">
              <Button className="w-full bg-white text-emerald-600 hover:bg-emerald-50 font-semibold py-3 transform hover:scale-105 transition-all duration-200">
                Quick Discovery
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );

  const renderIncompleteTestDashboard = () => {
    const incompleteSession = testSessions?.find((session: any) => !session.isCompleted);
    return (
      <div className="space-y-8">
        {/* Header for Incomplete Test */}
        <div className="bg-gradient-to-r from-amber-500 to-orange-600 rounded-2xl p-8 mb-8 text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full -mr-20 -mt-20"></div>
          <div className="relative z-10">
            <h1 className="text-4xl font-bold mb-2">
              Welcome back, {firstName}! 
              <Clock className="inline-block w-8 h-8 ml-2 text-yellow-300" />
            </h1>
            <p className="text-xl text-amber-100 mb-4">
              Let's continue your Ikigai journey where you left off
            </p>
            <p className="text-amber-200 text-lg">
              You were {incompleteSession?.currentQuestionIndex || 0} questions in – just a few more to discover your purpose!
            </p>
          </div>
        </div>

        {/* Continue Test Card */}
        <Card className="bg-gradient-to-r from-orange-500 to-red-600 text-white border-0 shadow-xl">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-2xl font-bold">Continue Your Assessment</CardTitle>
                <p className="text-orange-100 mt-2">Pick up where you left off</p>
              </div>
              <Target className="w-12 h-12 text-orange-200" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="mb-6">
              <div className="flex justify-between text-sm text-orange-200 mb-2">
                <span>Progress</span>
                <span>{incompleteSession?.currentQuestionIndex || 0} of 18 questions</span>
              </div>
              <Progress 
                value={((incompleteSession?.currentQuestionIndex || 0) / 18) * 100} 
                className="h-2 bg-orange-300/30"
              />
            </div>
            <Link href={`/test-session/${incompleteSession?.id}`}>
              <Button className="w-full bg-white text-orange-600 hover:bg-orange-50 font-semibold py-3">
                Continue Assessment
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </CardContent>
        </Card>

        {/* Alternative Options */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <TestTube className="w-5 h-5 mr-2 text-emerald-600" />
                Start Fresh
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">Want to begin a new assessment? Start over with a fresh perspective.</p>
              <Link href="/ikigai-test">
                <Button variant="outline" className="w-full">
                  New Assessment
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <BookOpen className="w-5 h-5 mr-2 text-blue-600" />
                Quick Type Test
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">Try our quick 12-question type test while you decide.</p>
              <Link href="/ikigai-type-test">
                <Button variant="outline" className="w-full">
                  Quick Test
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  };

  const renderBasicUserDashboard = () => {
    const completedSessions = testSessions?.filter((session: any) => session.isCompleted) || [];
    const latestSession = completedSessions[completedSessions.length - 1];

    return (
      <div className="space-y-8">
        {/* Header for Basic User */}
        <div className="bg-gradient-to-r from-emerald-500 to-teal-600 rounded-2xl p-8 mb-8 text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full -mr-20 -mt-20"></div>
          <div className="relative z-10">
            <h1 className="text-4xl font-bold mb-2">
              Great work, {firstName}! 
              <CheckCircle className="inline-block w-8 h-8 ml-2 text-green-300" />
            </h1>
            <p className="text-xl text-emerald-100 mb-4">
              You've completed your Ikigai assessment
            </p>
            <p className="text-emerald-200 text-lg">
              Ready to dive deeper into your purpose and unlock your full potential?
            </p>
          </div>
        </div>

        {/* Results and Upgrade Options */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Card className="bg-gradient-to-br from-blue-50 to-indigo-100 border-blue-200 shadow-lg">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-2xl font-bold text-blue-900">Your Results</CardTitle>
                  <p className="text-blue-700 mt-2">Access your Ikigai insights</p>
                </div>
                <Eye className="w-12 h-12 text-blue-600" />
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-blue-800 mb-6">
                View your basic Ikigai results and discover your primary personality type.
              </p>
              <Link href={`/test-results/${latestSession?.id}`}>
                <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3">
                  View Results
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-50 to-pink-100 border-purple-200 shadow-lg">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-2xl font-bold text-purple-900">Premium Insights</CardTitle>
                  <p className="text-purple-700 mt-2">Unlock your full potential</p>
                </div>
                <TrendingUp className="w-12 h-12 text-purple-600" />
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-purple-800 mb-6">
                Get detailed career guidance, development roadmaps, and personalized action plans.
              </p>
              <Link href={`/upgrade?session=${latestSession?.id}`}>
                <Button className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3">
                  Upgrade Results
                  <Sparkles className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>

        {/* Test History */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Calendar className="w-5 h-5 mr-2 text-gray-600" />
              Your Assessment History
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {completedSessions.map((session: any, index: number) => (
                <div key={session.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-semibold text-gray-900">
                      Assessment #{completedSessions.length - index}
                    </p>
                    <p className="text-sm text-gray-600">
                      Completed on {new Date(session.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex items-center space-x-3">
                    {session.hasPremiumAccess && (
                      <Badge className="bg-purple-100 text-purple-800 border-purple-300">
                        Premium
                      </Badge>
                    )}
                    <Link href={`/test-results/${session.id}`}>
                      <Button variant="outline" size="sm">
                        View Results
                      </Button>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  };

  const renderPremiumUserDashboard = () => {
    const premiumSessions = testSessions?.filter((session: any) => session.hasPremiumAccess) || [];
    const latestSession = premiumSessions[premiumSessions.length - 1];

    return (
      <div className="space-y-8">
        {/* Header for Premium User */}
        <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl p-8 mb-8 text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full -mr-20 -mt-20"></div>
          <div className="relative z-10">
            <h1 className="text-4xl font-bold mb-2">
              Welcome back, {firstName}! 
              <Sparkles className="inline-block w-8 h-8 ml-2 text-yellow-300 animate-pulse" />
            </h1>
            <p className="text-xl text-purple-100 mb-4">
              Your premium insights are ready
            </p>
            <p className="text-purple-200 text-lg">
              Dive into your comprehensive career guidance and development roadmap.
            </p>
          </div>
        </div>

        {/* Premium Features */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="bg-gradient-to-br from-indigo-50 to-blue-100 border-indigo-200 shadow-lg">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-lg font-bold text-indigo-900">Premium Results</CardTitle>
                </div>
                <BarChart3 className="w-8 h-8 text-indigo-600" />
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-indigo-800 mb-4 text-sm">
                Access your complete analysis with career matching and development plans.
              </p>
              <Link href={`/premium-results/${latestSession?.id}`}>
                <Button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 text-sm">
                  View Premium Results
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-emerald-50 to-green-100 border-emerald-200 shadow-lg">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-lg font-bold text-emerald-900">New Assessment</CardTitle>
                </div>
                <TestTube className="w-8 h-8 text-emerald-600" />
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-emerald-800 mb-4 text-sm">
                Take another assessment to track your growth and evolution.
              </p>
              <Link href="/ikigai-test">
                <Button className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-2 text-sm">
                  New Assessment
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-amber-50 to-yellow-100 border-amber-200 shadow-lg">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-lg font-bold text-amber-900">Quick Type Test</CardTitle>
                </div>
                <Target className="w-8 h-8 text-amber-600" />
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-amber-800 mb-4 text-sm">
                Take our quick personality type test for instant insights.
              </p>
              <Link href="/ikigai-type-test">
                <Button className="w-full bg-amber-600 hover:bg-amber-700 text-white font-semibold py-2 text-sm">
                  Quick Test
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>

        {/* Premium Test History */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Calendar className="w-5 h-5 mr-2 text-gray-600" />
              Your Premium Assessments
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {premiumSessions.map((session: any, index: number) => (
                <div key={session.id} className="flex items-center justify-between p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg border border-purple-200">
                  <div>
                    <p className="font-semibold text-purple-900">
                      Premium Assessment #{premiumSessions.length - index}
                    </p>
                    <p className="text-sm text-purple-700">
                      Completed on {new Date(session.createdAt).toLocaleDateString()}
                    </p>
                    <div className="flex items-center mt-2">
                      <Badge className="bg-purple-100 text-purple-800 border-purple-300 mr-2">
                        {session.premiumTier || 'Premium'}
                      </Badge>
                      <span className="text-xs text-purple-600">
                        Full insights unlocked
                      </span>
                    </div>
                  </div>
                  <Link href={`/premium-results/${session.id}`}>
                    <Button className="bg-purple-600 hover:bg-purple-700 text-white">
                      View Results
                    </Button>
                  </Link>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  };

  if (sessionsLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <Navigation />
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
            <div className="h-32 bg-gray-200 rounded mb-6"></div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="h-24 bg-gray-200 rounded"></div>
              <div className="h-24 bg-gray-200 rounded"></div>
              <div className="h-24 bg-gray-200 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <Navigation />
      
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {renderDashboardContent()}
        
        {/* Testimonials - Show for all users */}
        <Card className="bg-gradient-to-r from-slate-800 to-gray-900 text-white border-0 shadow-lg mb-8">
          <CardContent className="p-8">
            <div className="text-center">
              <div className="flex justify-center mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-6 h-6 text-yellow-400 fill-current" />
                ))}
              </div>
              <blockquote className="text-xl italic text-gray-200 mb-4">
                "This Ikigai test was the turning point in my career. It helped me discover my true purpose and guided me to a fulfilling path I never knew existed."
              </blockquote>
              <p className="text-gray-300 font-semibold">— Sarah M., Marketing Director</p>
            </div>
          </CardContent>
        </Card>

        {/* Japanese Wisdom - Show for all users */}
        <Card className="bg-gradient-to-r from-indigo-100 to-purple-100 border-indigo-200 shadow-lg">
          <CardContent className="p-8">
            <div className="text-center">
              <div className="text-4xl mb-4">🌸</div>
              <blockquote className="text-xl italic text-indigo-900 mb-4">
                "生きがい - The happiness of always being busy"
              </blockquote>
              <p className="text-indigo-700 font-semibold">
                Ancient Japanese wisdom that guides us to find our reason for being
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}