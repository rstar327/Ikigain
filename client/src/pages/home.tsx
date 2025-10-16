import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/hooks/useAuth";
import { useQuery } from "@tanstack/react-query";
import Navigation from "@/components/Navigation";
import SEO from "@/components/SEO";
import { User, TrendingUp, Award, Clock } from "lucide-react";

export default function Home() {
  const { user } = useAuth();

  const { data: testSessions } = useQuery<any[]>({
    queryKey: ["/api/user/test-sessions"],
  });

  const { data: testResults } = useQuery<any[]>({
    queryKey: ["/api/user/test-results"],
  });

  const completedTests = testSessions?.filter((session: any) => session.isCompleted) || [];
  const latestResult = testResults?.[0];

  return (
    <div className="min-h-screen bg-background">
      <SEO
        title="Home Dashboard - Ikigai Test | Ikigain"
        description="Access your personal Ikigai dashboard with test results, progress tracking, and personalized career insights. Continue your journey to discover your life purpose."
        canonical="https://ikigain.org/home"
        keywords="ikigai dashboard, test results, career insights, life purpose tracking, personal development"
      />
      <Navigation />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Welcome back, {(user as any)?.firstName || "there"}!
              </h1>
              <p className="text-gray-600 mt-2">
                Continue your journey to discover your Ikigai
              </p>
            </div>
            <Link href="/test">
              <Button size="lg" className="bg-primary hover:bg-primary/90">
                Take New Test
              </Button>
            </Link>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Tests Completed</CardTitle>
              <Award className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{completedTests.length}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Latest Ikigai Score</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {latestResult ? `${Math.round(parseFloat(latestResult.overallScore))}%` : 'N/A'}
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Primary Type</CardTitle>
              <User className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {latestResult?.primaryType || 'Unknown'}
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Time Saved</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {completedTests.length * 15}m
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Latest Results */}
        {latestResult && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Your Latest Ikigai Profile</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <div className="space-y-6">
                    <div className="flex items-center">
                      <div className="w-4 h-4 bg-red-500 rounded-full mr-3"></div>
                      <div className="flex-1">
                        <div className="flex justify-between items-center mb-1">
                          <span className="font-medium text-gray-900">Passion</span>
                          <span className="text-sm text-gray-600">
                            {Math.round(parseFloat(latestResult.passionScore))}%
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-red-500 h-2 rounded-full transition-all duration-300" 
                            style={{ width: `${Math.round(parseFloat(latestResult.passionScore))}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center">
                      <div className="w-4 h-4 bg-blue-500 rounded-full mr-3"></div>
                      <div className="flex-1">
                        <div className="flex justify-between items-center mb-1">
                          <span className="font-medium text-gray-900">Mission</span>
                          <span className="text-sm text-gray-600">
                            {Math.round(parseFloat(latestResult.missionScore))}%
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-blue-500 h-2 rounded-full transition-all duration-300" 
                            style={{ width: `${Math.round(parseFloat(latestResult.missionScore))}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center">
                      <div className="w-4 h-4 bg-green-500 rounded-full mr-3"></div>
                      <div className="flex-1">
                        <div className="flex justify-between items-center mb-1">
                          <span className="font-medium text-gray-900">Vocation</span>
                          <span className="text-sm text-gray-600">
                            {Math.round(parseFloat(latestResult.vocationScore))}%
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-green-500 h-2 rounded-full transition-all duration-300" 
                            style={{ width: `${Math.round(parseFloat(latestResult.vocationScore))}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center">
                      <div className="w-4 h-4 bg-yellow-500 rounded-full mr-3"></div>
                      <div className="flex-1">
                        <div className="flex justify-between items-center mb-1">
                          <span className="font-medium text-gray-900">Profession</span>
                          <span className="text-sm text-gray-600">
                            {Math.round(parseFloat(latestResult.professionScore))}%
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-yellow-500 h-2 rounded-full transition-all duration-300" 
                            style={{ width: `${Math.round(parseFloat(latestResult.professionScore))}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center justify-center">
                  <div className="w-64 h-64 bg-gradient-to-br from-primary/10 to-secondary/10 rounded-full flex items-center justify-center">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-primary mb-2">
                        {Math.round(parseFloat(latestResult.overallScore))}%
                      </div>
                      <div className="text-sm text-gray-600">Ikigai Match</div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Quick Actions */}
        <div className="grid md:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Take a New Test</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">
                Discover new insights about your purpose and calling.
              </p>
              <Link href="/test">
                <Button className="w-full">Start Test</Button>
              </Link>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">View History</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">
                Review your past test results and track your progress.
              </p>
              <Link href="/dashboard">
                <Button variant="outline" className="w-full">View Dashboard</Button>
              </Link>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Premium Features</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">
                Get detailed insights and personalized recommendations.
              </p>
              <Button variant="outline" className="w-full">Learn More</Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
