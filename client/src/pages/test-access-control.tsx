import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { getFeatureAccess, getTierDisplayName, getTierPrice, type PremiumTier } from "@shared/access-control";
import { Lock, CheckCircle } from "lucide-react";

export default function TestAccessControl() {
  const [selectedTier, setSelectedTier] = useState<PremiumTier>('roadmap');
  
  const tiers: PremiumTier[] = ['roadmap', 'personality', 'blueprint'];
  
  const features = getFeatureAccess(selectedTier);
  
  const featureList = [
    { key: 'careerRoadmap', name: 'Career Roadmap', tier: 'roadmap' },
    { key: 'careerMatches', name: 'Career Matches', tier: 'roadmap' },
    { key: 'skillGaps', name: 'Skill Gap Analysis', tier: 'roadmap' },
    { key: 'personalityProfile', name: 'Personality Profile', tier: 'personality' },
    { key: 'cognitiveStyle', name: 'Cognitive Style', tier: 'personality' },
    { key: 'workStyleAnalysis', name: 'Work Style Analysis', tier: 'personality' },
    { key: 'communicationGuide', name: 'Communication Guide', tier: 'personality' },
    { key: 'stressManagement', name: 'Stress Management', tier: 'personality' },
    { key: 'transformationPlan', name: '90-Day Transformation Plan', tier: 'blueprint' },
    { key: 'dailyHabits', name: 'Daily Habit Tracker', tier: 'blueprint' },
    { key: 'confidenceBuilding', name: 'Confidence Building', tier: 'blueprint' },
    { key: 'interviewPrep', name: 'Interview Preparation', tier: 'blueprint' },
    { key: 'networkingStrategy', name: 'Networking Strategy', tier: 'blueprint' },
    { key: 'aiMentor', name: 'AI Career Mentor', tier: 'blueprint' },
    { key: 'marketInsights', name: 'Market Insights', tier: 'blueprint' },
    { key: 'developmentAreas', name: 'Development Areas', tier: 'blueprint' },
  ];

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-gray-900">Access Control Test</h1>
        
        {/* Instructions */}
        <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <h3 className="font-semibold text-blue-900 mb-2">How to Test Tiers:</h3>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• <strong>Career Roadmap Guide ($2.95):</strong> Basic career features only</li>
            <li>• <strong>Personality Deep Dive ($4.95):</strong> Includes personality analysis</li>
            <li>• <strong>Success Blueprint ($9.95):</strong> Full access to all features</li>
            <li>• Green checkmarks = unlocked features, Gray locks = requires upgrade</li>
          </ul>
        </div>
        
        {/* Tier Selection */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Select Premium Tier:</h2>
          <div className="flex gap-4">
            {tiers.map((tier) => (
              <Button
                key={tier}
                variant={selectedTier === tier ? "default" : "outline"}
                onClick={() => setSelectedTier(tier)}
                className="flex-1"
              >
                {getTierDisplayName(tier)} - {getTierPrice(tier)}
              </Button>
            ))}
          </div>
        </div>

        {/* Feature Access Display */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              Current Package: {getTierDisplayName(selectedTier)}
              <Badge variant="secondary">{getTierPrice(selectedTier)}</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {featureList.map((feature) => {
                const hasAccess = features[feature.key as keyof typeof features];
                return (
                  <div
                    key={feature.key}
                    className={`p-4 rounded-lg border-2 flex items-center gap-3 ${
                      hasAccess 
                        ? 'border-green-200 bg-green-50' 
                        : 'border-gray-200 bg-gray-50'
                    }`}
                  >
                    {hasAccess ? (
                      <CheckCircle className="h-5 w-5 text-green-600" />
                    ) : (
                      <Lock className="h-5 w-5 text-gray-400" />
                    )}
                    <div className="flex-1">
                      <h4 className={`font-medium ${hasAccess ? 'text-green-800' : 'text-gray-600'}`}>
                        {feature.name}
                      </h4>
                      <p className="text-sm text-gray-500">
                        Requires: {getTierDisplayName(feature.tier as PremiumTier)}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}