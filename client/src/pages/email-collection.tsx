import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { useMutation, useQuery } from "@tanstack/react-query";
import Navigation from "@/components/Navigation";
import SEO from "@/components/SEO";
import { Mail, ArrowRight, Shield, Gift } from "lucide-react";
import { useTranslation } from 'react-i18next';

interface EmailCollectionProps {
  sessionId: string;
}

export default function EmailCollection({ sessionId }: EmailCollectionProps) {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const { t } = useTranslation(['emailCollection', 'common']);
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  console.log('EmailCollection sessionId:', sessionId, 'parsed:', parseInt(sessionId));

  const { data: session } = useQuery<any>({
    queryKey: ["/api/test-sessions", parseInt(sessionId)],
    enabled: !!sessionId,
  });

  const submitEmailMutation = useMutation({
    mutationFn: async ({ sessionId, email }: { sessionId: number; email: string }) => {
      const response = await apiRequest("PUT", `/api/test-sessions/${sessionId}`, { email });
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: t('toasts.emailSaved.title'),
        description: t('toasts.emailSaved.description'),
      });
      setLocation(`/test-results/${sessionId}`);
    },
    onError: () => {
      toast({
        title: t('toasts.error.title'),
        description: t('toasts.error.description'),
        variant: "destructive",
      });
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !email.includes('@')) {
      toast({
        title: t('toasts.invalidEmail.title'),
        description: t('toasts.invalidEmail.description'),
        variant: "destructive",
      });
      return;
    }

    const sessionIdNum = parseInt(sessionId);
    if (isNaN(sessionIdNum)) {
      toast({
        title: t('toasts.invalidSession.title'),
        description: t('toasts.invalidSession.description'),
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    await submitEmailMutation.mutateAsync({ sessionId: sessionIdNum, email });
    setIsSubmitting(false);
  };

  const handleSkip = () => {
    setLocation(`/results/${sessionId}`);
  };

  // If session already has email, redirect to results
  useEffect(() => {
    if (session?.email) {
      setLocation(`/results/${sessionId}`);
    }
  }, [session, sessionId, setLocation]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      <SEO
        title="Email Collection - Ikigai Test Results | Ikigain"
        description="Get your personalized Ikigai test results and career insights delivered to your email. Secure collection for accessing your comprehensive personality analysis."
        canonical={`https://ikigain.org/email-collection/${sessionId}`}
        keywords="ikigai test results, email delivery, personality analysis, career insights, secure email collection"
      />
      <Navigation />
      
      <div className="max-w-2xl mx-auto px-4 py-20">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Mail className="h-8 w-8 text-blue-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            {t('title')}
          </h1>
          <p className="text-lg text-gray-600 max-w-xl mx-auto">
            {t('subtitle')}
          </p>
        </div>

        <Card className="bg-white shadow-xl border-0">
          <CardHeader className="text-center pb-4">
            <CardTitle className="text-xl text-gray-800">
              {t('formTitle')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium text-gray-700">
                  {t('emailLabel')}
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder={t('emailPlaceholder')}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>

              <div className="bg-blue-50 p-4 rounded-lg">
                <h3 className="font-semibold text-blue-900 mb-2 flex items-center">
                  <Gift className="h-5 w-5 mr-2" />
                  {t('whatYouGet')}
                </h3>
                <ul className="text-sm text-blue-800 space-y-1">
                  <li>• {t('benefits.analysis')}</li>
                  <li>• {t('benefits.recommendations')}</li>
                  <li>• {t('benefits.report')}</li>
                  <li>• {t('benefits.tips')}</li>
                </ul>
              </div>

              <div className="flex items-center text-sm text-gray-600">
                <Shield className="h-4 w-4 mr-2" />
                <span>{t('privacy')}</span>
              </div>

              <div className="flex gap-3">
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-3 rounded-lg font-semibold transition-all duration-300 hover:shadow-lg"
                >
                  {isSubmitting ? t('buttons.submitting') : t('buttons.submit')}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleSkip}
                  className="px-6 py-3 border-gray-300 text-gray-600 hover:bg-gray-50"
                >
                  {t('buttons.skip')}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        <div className="text-center mt-8">
          <p className="text-sm text-gray-500">
            {t('legal')}{" "}
            <a href="/privacy" className="text-blue-600 hover:underline">
              {t('privacyPolicy')}
            </a>{" "}
            {t('and')}{" "}
            <a href="/terms" className="text-blue-600 hover:underline">
              {t('termsOfService')}
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}