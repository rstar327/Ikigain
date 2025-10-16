import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import ProgressBar from "@/components/ProgressBar";
import TestQuestion from "@/components/TestQuestion";
import Navigation from "@/components/Navigation";
import SEO from "@/components/SEO";
import { ArrowLeft } from "lucide-react";
import { useTranslation } from 'react-i18next';
import { trackEvent } from "@/lib/analytics";

export default function Test() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const { t } = useTranslation(['test', 'common']);
  const queryClient = useQueryClient();
  const [currentSessionId, setCurrentSessionId] = useState<number | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [isAdvancing, setIsAdvancing] = useState(false);

  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const { data: questions, isLoading: questionsLoading } = useQuery<any[]>({
    queryKey: ["/api/questions"],
  });

  const { data: session } = useQuery<{
    currentQuestionIndex?: number
    answers: Record<string, any>
  }>({
    queryKey: ["/api/test-sessions", currentSessionId],
    enabled: !!currentSessionId,
  });

  const createSessionMutation = useMutation({
    mutationFn: async () => {
      const response = await fetch("/api/test-sessions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({})
      });
      if (!response.ok) throw new Error("Failed to create session");
      return response.json();
    },
    onSuccess: (data) => {
      setCurrentSessionId(data.id);
      queryClient.invalidateQueries({ queryKey: ["/api/test-sessions", data.id] });
      
      // Track test start
      trackEvent('test_start', 'ikigai_test', 'full_assessment');
    },
    onError: () => {
      toast({
        title: t('common:error'),
        description: t('test:errors.startSession'),
        variant: "destructive",
      });
    },
  });

  const updateSessionMutation = useMutation({
    mutationFn: async ({ sessionId, updates }: { sessionId: number; updates: any }) => {
      const response = await fetch(`/api/test-sessions/${sessionId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(updates)
      });
      if (!response.ok) throw new Error("Failed to update session");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/test-sessions", currentSessionId] });
    },
  });

  const completeTestMutation = useMutation({
    mutationFn: async (sessionId: number) => {
      const response = await fetch(`/api/test-sessions/${sessionId}/complete`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include"
      });
      if (!response.ok) throw new Error("Failed to complete test");
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: t('test:completion.title'),
        description: t('test:completion.description'),
      });
      
      // Track test completion
      trackEvent('test_complete', 'ikigai_test', 'full_assessment');
      
      setLocation(`/email-collection/${currentSessionId}`);
    },
    onError: () => {
      toast({
        title: t('common:error'),
        description: t('test:errors.completeTest'),
        variant: "destructive",
      });
    },
  });

  useEffect(() => {
    if (!currentSessionId && !createSessionMutation.isPending) {
      createSessionMutation.mutate();
    }
  }, [currentSessionId]);

  useEffect(() => {
    if (session && !isAdvancing && currentSessionId) {
      // Only sync from session on initial load, not during question progression
      if (currentQuestionIndex === 0 && Object.keys(answers).length === 0) {
        setCurrentQuestionIndex(session.currentQuestionIndex || 0);
        setAnswers(session.answers || {});
      }
    }
  }, [session]);

  const handleAnswer = async (questionId: number, value: number) => {
    const newAnswers = { ...answers, [questionId]: value };
    setAnswers(newAnswers);

    // Save the answer first
    if (currentSessionId) {
      try {
        const response = await fetch(`/api/test-sessions/${currentSessionId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({
            answers: newAnswers,
            currentQuestionIndex,
          })
        });
        
        if (!response.ok) {
          throw new Error("Failed to save answer");
        }

        // After successfully saving, handle next action
        if (questions && currentQuestionIndex >= questions.length - 1) {
          // This is the last question - complete the test
          console.log("Last question answered, completing test...");
          completeTestMutation.mutate(currentSessionId);
        } else {
          // Move to next question
          setIsAdvancing(true);
          setTimeout(() => {
            const nextIndex = currentQuestionIndex + 1;
            setCurrentQuestionIndex(nextIndex);
            
            // Update the question index in the session
            fetch(`/api/test-sessions/${currentSessionId}`, {
              method: "PUT",
              headers: { "Content-Type": "application/json" },
              credentials: "include",
              body: JSON.stringify({
                currentQuestionIndex: nextIndex,
              })
            });
            
            setIsAdvancing(false);
          }, 200);
        }
      } catch (error) {
        console.error("Error saving answer:", error);
        toast({
          title: t('common:error'),
          description: "Failed to save your answer. Please try again.",
          variant: "destructive",
        });
      }
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      const prevIndex = currentQuestionIndex - 1;
      setCurrentQuestionIndex(prevIndex);

      if (currentSessionId) {
        updateSessionMutation.mutate({
          sessionId: currentSessionId,
          updates: {
            currentQuestionIndex: prevIndex,
          },
        });
      }
    }
  };

  if (questionsLoading || !questions) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="flex items-center justify-center h-96">
          <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
        </div>
      </div>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];
  const currentAnswer = currentQuestion ? answers[currentQuestion.id] : undefined;

  return (
    <div className="min-h-screen bg-background">
      <SEO
        title="Ikigai Test - Discover Your Life Purpose | Ikigain"
        description="Take our comprehensive 18-question Ikigai test to discover your life purpose. Get detailed insights into your passion, mission, vocation, and profession alignment."
        canonical="https://www.ikigain.org/test"
        keywords="ikigai test, life purpose test, ikigai assessment, find your purpose, career guidance, japanese philosophy test"
      />
      <Navigation />
      
      {/* Hero Section */}
      <header className="relative bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            {t('title', { 
              defaultValue: "Ikigai Test - Discover Your Life Purpose" 
            })}
          </h1>
          <p className="text-lg text-gray-600 mb-6 max-w-2xl mx-auto">
            {t('description', {
              defaultValue: "Take our comprehensive 18-question assessment to discover the intersection of what you love, what you're good at, what the world needs, and what you can be paid for."
            })}
          </p>
        </div>
      </header>
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <ProgressBar 
          current={currentQuestionIndex + 1} 
          total={questions.length} 
        />

        <Card className="mb-8 shadow-xl border-0">
          <CardContent className="p-8">
            <TestQuestion
              question={currentQuestion}
              selectedValue={currentAnswer}
              onAnswer={handleAnswer}
            />
          </CardContent>
        </Card>

        <div className="flex justify-center">
          <Button
            variant="outline"
            onClick={handlePrevious}
            disabled={currentQuestionIndex === 0 || completeTestMutation.isPending}
            className="flex items-center"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            {t('previousButton')}
          </Button>
        </div>

        {completeTestMutation.isPending && (
          <div className="mt-4 text-center text-gray-600">
            <p>{t('completing')}</p>
          </div>
        )}
      </div>
    </div>
  );
}
