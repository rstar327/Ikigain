import { useEffect, useState } from 'react';
import { useLocation } from 'wouter';
import { useTranslation } from 'react-i18next';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Navigation from "@/components/Navigation";
import { CheckCircle, Award, ArrowRight, Download, Calendar, Zap } from 'lucide-react';
import { motion } from 'framer-motion';

export default function UpsellSuccess() {
  const [, setLocation] = useLocation();
  const { t } = useTranslation(['common', 'results']);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Get sessionId from URL parameters
    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get('sessionId');
    setSessionId(id);
    
    // Check if this is a successful payment by looking for payment_intent parameter
    const paymentIntent = urlParams.get('payment_intent');
    const paymentIntentClientSecret = urlParams.get('payment_intent_client_secret');
    
    if (paymentIntent && paymentIntentClientSecret) {
      // This is a successful payment redirect from Stripe
      console.log('Payment successful:', paymentIntent);
      
      // CRITICAL: Verify payment and update session status
      if (id) {
        const urlParams = new URLSearchParams(window.location.search);
        const offerId = urlParams.get('offer') || 'personality';
        
        fetch(`/api/payment-success`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            payment_intent_id: paymentIntent,
            sessionId: id,
            offerId: offerId
          }),
        }).then(response => {
          if (response.ok) {
            console.log('✅ Payment verified and session updated');
          } else {
            console.error('❌ Failed to verify payment');
          }
        }).catch(error => {
          console.error('Error verifying payment:', error);
        });
      }
    }
    
    setIsLoading(false);
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
        <Navigation />
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
            <p className="text-lg text-gray-600">Processing your payment...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      <Navigation />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-6">
            <CheckCircle className="w-10 h-10 text-green-600" />
          </div>
          
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            {t('paymentSuccessful', 'Payment Successful!')}
          </h1>
          
          <p className="text-xl text-gray-600 mb-6 max-w-2xl mx-auto">
            {t('congratulationsMessage', 'Congratulations! Your premium analysis is now ready. You can access all the advanced features and insights.')}
          </p>
          
          <div className="inline-flex items-center gap-2 bg-green-100 px-4 py-2 rounded-full">
            <Award className="w-5 h-5 text-green-600" />
            <span className="text-sm font-medium text-green-800">{t('premiumAccessActivated', 'Premium Access Activated')}</span>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          <Card className="border-green-200 bg-green-50/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Download className="h-5 w-5 text-green-600" />
                Access Your Premium Results
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">
                Your comprehensive analysis including career matches, development roadmap, and personality insights is ready.
              </p>
              <Button 
                onClick={() => setLocation(`/premium-results/${sessionId}`)}
                className="w-full bg-green-600 hover:bg-green-700"
              >
                <ArrowRight className="w-4 h-4 mr-2" />
                View Premium Results
              </Button>
            </CardContent>
          </Card>

          <Card className="border-blue-200 bg-blue-50/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-blue-600" />
                Dashboard Access
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">
                Track your progress and access all your assessments from your personal dashboard.
              </p>
              <Button 
                onClick={() => setLocation(`/dashboard?session=${sessionId}`)}
                variant="outline"
                className="w-full border-blue-600 text-blue-600 hover:bg-blue-50"
              >
                <Zap className="w-4 h-4 mr-2" />
                Go to Dashboard
              </Button>
            </CardContent>
          </Card>
        </div>

        <Card className="bg-gradient-to-r from-purple-50 to-blue-50 border-purple-200">
          <CardContent className="p-8">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">What's Next?</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
                <div>
                  <div className="inline-flex items-center justify-center w-12 h-12 bg-purple-100 rounded-full mb-3">
                    <CheckCircle className="w-6 h-6 text-purple-600" />
                  </div>
                  <h3 className="font-semibold text-gray-800 mb-2">Review Your Analysis</h3>
                  <p className="text-sm text-gray-600">Explore your detailed personality profile and career insights</p>
                </div>
                <div>
                  <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-100 rounded-full mb-3">
                    <Calendar className="w-6 h-6 text-blue-600" />
                  </div>
                  <h3 className="font-semibold text-gray-800 mb-2">Follow Your Roadmap</h3>
                  <p className="text-sm text-gray-600">Implement the personalized development plan step by step</p>
                </div>
                <div>
                  <div className="inline-flex items-center justify-center w-12 h-12 bg-green-100 rounded-full mb-3">
                    <Zap className="w-6 h-6 text-green-600" />
                  </div>
                  <h3 className="font-semibold text-gray-800 mb-2">Track Progress</h3>
                  <p className="text-sm text-gray-600">Monitor your growth and celebrate milestones</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="text-center mt-12">
          <p className="text-gray-500 text-sm mb-4">
            Questions about your results? Need support?
          </p>
          <Button 
            variant="ghost" 
            onClick={() => setLocation('/about')}
            className="text-gray-600 hover:text-gray-800"
          >
            Contact Support
          </Button>
        </div>
      </div>
    </div>
  );
}