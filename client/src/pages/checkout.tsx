import { useStripe, Elements, PaymentElement, useElements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { useEffect, useState } from 'react';
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Navigation from "@/components/Navigation";
import SEO from "@/components/SEO";
import { CheckCircle, CreditCard, Shield, ArrowLeft, Loader2 } from "lucide-react";
import { useLocation } from "wouter";

// Use production keys for live payments
const stripePublicKey = import.meta.env.VITE_STRIPE_PUBLIC_KEY || import.meta.env.VITE_STRIPE_TEST_PUBLIC_KEY;
if (!stripePublicKey) {
  throw new Error('Missing required Stripe key: VITE_STRIPE_PUBLIC_KEY or VITE_STRIPE_TEST_PUBLIC_KEY');
}
const stripePromise = loadStripe(stripePublicKey);

const DemoCheckoutForm = ({ offer }: { offer: any }) => {
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const params = new URLSearchParams(window.location.search);
      const sessionId = params.get('sessionId');
      
      await apiRequest("POST", "/api/demo-payment", {
        sessionId,
        offerId: params.get('offer') || 'roadmap'
      });
      
      toast({
        title: "Demo Payment Successful!",
        description: "Premium access has been granted. This was a demo - no real payment was processed.",
      });
      
      setTimeout(() => {
        setLocation(`/upsell/success?sessionId=${sessionId}`);
      }, 1500);
      
    } catch {
      toast({
        title: "Demo Error",
        description: "Something went wrong with the demo. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="bg-gray-50 p-4 rounded-lg">
        <div className="flex items-center justify-between mb-2">
          <span className="font-medium">{offer.title}</span>
          <span className="text-lg font-bold text-blue-600">${offer.discountedPrice}</span>
        </div>
        <p className="text-sm text-gray-600">{offer.description}</p>
      </div>
      
      <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg">
        <div className="flex items-center space-x-2 mb-2">
          <Shield className="w-5 h-5 text-yellow-600" />
          <span className="font-medium text-yellow-800">Demo Mode</span>
        </div>
        <p className="text-sm text-yellow-700">
          Stripe payment methods need to be activated in your dashboard. 
          This will simulate a successful payment to demonstrate the complete upsell flow.
        </p>
      </div>
      
      <Button 
        type="submit" 
        className="w-full" 
        size="lg"
        disabled={isLoading}
      >
        {isLoading ? (
          <>
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            Processing Demo...
          </>
        ) : (
          <>
            <CreditCard className="w-4 h-4 mr-2" />
            Try Demo - $29.99
          </>
        )}
      </Button>
      
      <div className="text-center text-sm text-gray-500 space-y-2">
        <div className="flex items-center justify-center space-x-2">
          <Shield className="w-4 h-4" />
          <span>Demo payment system</span>
        </div>
        <p>No real payment will be processed. This demonstrates the full upsell experience.</p>
      </div>
    </form>
  );
};

const CheckoutForm = ({ offer }: { offer: any }) => {
  const stripe = useStripe();
  const elements = useElements();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Payment form submitted");
    setIsLoading(true);

    try {
      if (!stripe || !elements) {
        console.log("Stripe or elements not loaded");
        return;
      }

      const params = new URLSearchParams(window.location.search);
      const sessionId = params.get('sessionId') || '1';
      
      console.log("Confirming payment with Stripe...");
      const { error } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: window.location.origin + `/upsell/success?sessionId=${sessionId}`,
        },
      });

      if (error) {
        toast({
          title: "Payment Failed",
          description: error.message,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Payment Successful",
          description: "Your premium report is now ready!",
        });
      }
    } catch {
      toast({
        title: "Payment Error",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="bg-gray-50 p-4 rounded-lg">
        <div className="flex items-center justify-between mb-2">
          <span className="font-medium">{offer.title}</span>
          <span className="text-lg font-bold text-blue-600">${offer.discountedPrice}</span>
        </div>
        <p className="text-sm text-gray-600">{offer.description}</p>
      </div>
      
      <PaymentElement />
      
      <Button 
        type="submit" 
        className="w-full" 
        size="lg"
        disabled={!stripe || isLoading}
      >
        {isLoading ? (
          <>
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            Processing...
          </>
        ) : (
          <>
            <CreditCard className="w-4 h-4 mr-2" />
            Pay ${offer.discountedPrice}
          </>
        )}
      </Button>
      
      <div className="text-center text-sm text-gray-500 space-y-2">
        <div className="flex items-center justify-center space-x-2">
          <Shield className="w-4 h-4" />
          <span>Secure payment powered by Stripe</span>
        </div>
        <p>Your payment is processed securely and your data is protected</p>
      </div>
    </form>
  );
};

export default function Checkout() {
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const [clientSecret, setClientSecret] = useState("");
  const [offer, setOffer] = useState<any>(null);
  
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const offerId = params.get('offer') || 'personality';
    const sessionId = params.get('sessionId') || '1';
    const customPrice = params.get('price');
    
    // Get offer details
    const offers = {
      roadmap: { title: 'Career Roadmap Guide', discountedPrice: '2.95', description: '12-month career roadmap, step-by-step action plan, industry networking' },
      personality: { title: 'Personality Deep Dive', discountedPrice: '4.95', description: 'Complete personality analysis, cognitive style test, communication guide' },
      blueprint: { title: 'Success Blueprint', discountedPrice: '9.95', description: '90-day transformation plan, daily habits tracker, goal-setting framework' }
    };
    
    let selectedOffer = offers[offerId as keyof typeof offers] || offers.personality;
    
    // Override price if passed in URL
    if (customPrice) {
      selectedOffer = { ...selectedOffer, discountedPrice: customPrice };
    }
    setOffer(selectedOffer);
    
    // Create payment intent
    console.log("Creating payment intent for checkout with:", { 
      amount: parseFloat(selectedOffer.discountedPrice), 
      offerId,
      sessionId 
    });
    apiRequest("POST", "/api/create-payment-intent", { 
      amount: parseFloat(selectedOffer.discountedPrice), 
      offerId,
      sessionId 
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("Payment intent created successfully:", data);
        setClientSecret(data.clientSecret);
      })
      .catch((error) => {
        console.error('Payment intent error:', error);
        toast({
          title: "Payment Error",
          description: "Unable to initialize payment. Please try again.",
          variant: "destructive",
        });
      });
  }, [toast]);

  if (!clientSecret || !offer) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="h-screen flex items-center justify-center">
          <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" aria-label="Loading"/>
        </div>
      </div>
    );
  }

  const isDemoMode = false; // Always use real Stripe payments

  return (
    <div className="min-h-screen bg-background">
      <SEO 
        title="Secure Checkout - Premium Ikigai Analysis | Ikigain"
        description="Complete your premium Ikigai analysis purchase. Secure payment processing with detailed career insights, roadmaps, and personality analysis."
        keywords="ikigai checkout, premium analysis payment, secure checkout, ikigai purchase"
        canonical="/checkout"
      />
      <Navigation />
      
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-8">
          <Button 
            variant="ghost" 
            onClick={() => setLocation('/upsell')}
            className="mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Offers
          </Button>
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Secure Checkout</h1>
          <p className="text-lg text-gray-600">
            Complete your purchase to unlock premium insights
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2">
          {/* Package Details */}
          <Card>
            <CardHeader>
              <CardTitle className="text-center">{offer.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center mb-6">
                <div className="text-4xl font-bold text-primary mb-2">${offer.discountedPrice}</div>
                <div className="text-sm text-gray-600">One-time payment</div>
              </div>
              
              <div className="space-y-3">
                <div className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                  <span className="text-sm">15-page detailed PDF report</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                  <span className="text-sm">Personalized career recommendations</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                  <span className="text-sm">Action plan for finding your Ikigai</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                  <span className="text-sm">Detailed strength analysis</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                  <span className="text-sm">Growth and development suggestions</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Payment Form */}
          <Card>
            <CardHeader>
              <CardTitle>Payment Details</CardTitle>
            </CardHeader>
            <CardContent>
              {isDemoMode ? (
                <DemoCheckoutForm offer={offer} />
              ) : (
                <Elements stripe={stripePromise} options={{ clientSecret }}>
                  <CheckoutForm offer={offer} />
                </Elements>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="mt-8 text-center text-sm text-gray-500">
          <p>Secure payment powered by Stripe</p>
          <p className="mt-2">Your payment is processed securely and your data is protected</p>
        </div>
      </div>
    </div>
  );
}
