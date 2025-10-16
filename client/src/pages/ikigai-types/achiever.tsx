import Navigation from "@/components/Navigation";
import SEO from "@/components/SEO";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Target, Zap, AlertTriangle, Sprout, PenTool } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useEffect, useState } from "react";

export default function AchieverType() {
  const { t, ready, i18n } = useTranslation('types');
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    if (ready && i18n.hasResourceBundle(i18n.language, 'types')) {
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
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-green-600"></div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-background">
      <SEO
        title={t('achiever.title')}
        description={t('achiever.description')}
        keywords="ikigai achiever, achiever personality, goal-oriented, progress, mastery, discipline"
        canonical="/ikigai-types/achiever"
      />
      
      <Navigation />
      
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="flex justify-center items-center mb-6">
              <div className="p-4 bg-green-100 rounded-full">
                <Target className="w-12 h-12 text-green-600" />
              </div>
            </div>
            <h1 className="text-4xl font-bold mb-4">{t('achiever.name')}</h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              {t('achiever.description')}
            </p>
          </div>

          {/* Core Description */}
          <Card className="mb-8">
            <CardContent className="p-8">
              <p className="text-lg text-gray-700 leading-relaxed mb-6">
                {t('achiever.coreDescription')}
              </p>
              <div className="bg-green-50 p-6 rounded-lg">
                <h3 className="font-semibold text-green-800 mb-2">{t('achiever.purposeSourceTitle')}</h3>
                <p className="text-green-700">
                  {t('achiever.purposeSourceDescription')}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Call to Action - Prominent Position */}
          <Card className="mb-8 text-center bg-gradient-to-r from-green-600 to-emerald-600 text-white">
            <CardContent className="p-8">
              <h3 className="text-2xl font-bold mb-4">{t('achiever.ctaTitle')}</h3>
              <p className="text-lg mb-6 opacity-90">
                {t('achiever.ctaDescription')}
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" className="bg-white text-green-600 hover:bg-gray-100" onClick={() => window.location.href = '/ikigai-test'}>
                  {t('achiever.takeFullTest')}
                </Button>
                <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-green-600" onClick={() => window.location.href = '/ikigai-type-test'}>
                  {t('achiever.takeQuickTest')}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Core Strengths */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="w-5 h-5 text-green-600" />
                {t('achiever.coreStrengths')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-4">
                {(t('achiever.strengths', { returnObjects: true }) as any[]).map((strength: any, index: number) => (
                  <div key={index} className="flex items-start gap-3 p-4 bg-green-50 rounded-lg">
                    <Zap className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-sm text-gray-600">{strength}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Common Challenges */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-amber-600" />
                {t('achiever.challenges')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {(t('achiever.challengesList', { returnObjects: true }) as any[]).map((challenge: any, index: number) => (
                  <div key={index} className="flex items-start gap-3 p-4 bg-amber-50 rounded-lg">
                    <AlertTriangle className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-sm text-gray-600">{challenge}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* How to Nurture Your Ikigai */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sprout className="w-5 h-5 text-green-600" />
                {t('achiever.nurturing')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {(t('achiever.nurturingTips', { returnObjects: true }) as any[]).map((tip: any, index: number) => (
                  <div key={index} className="flex items-start gap-3 p-4 bg-green-50 rounded-lg">
                    <Sprout className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-sm text-gray-600">{tip}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Journaling Prompts */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <PenTool className="w-5 h-5 text-blue-600" />
                {t('achiever.journaling')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {(t('achiever.journalingPrompts', { returnObjects: true }) as any[]).map((prompt: any, index: number) => (
                  <div key={index} className="p-4 bg-blue-50 rounded-lg">
                    <p className="text-blue-700">{prompt}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

        </div>
      </main>
    </div>
  );
}