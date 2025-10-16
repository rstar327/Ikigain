import { useStripe, Elements, PaymentElement, AddressElement, useElements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { useEffect, useState } from 'react';
import { useLocation } from 'wouter';
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import SEO from "@/components/SEO";
import { ArrowLeft, CreditCard, ShoppingCart, Shield } from 'lucide-react';
import { Link } from 'wouter';

// Make sure to call `loadStripe` outside of a component's render to avoid
// recreating the `Stripe` object on every render.
// Use production keys for live payments
const stripePublicKey = import.meta.env.VITE_STRIPE_PUBLIC_KEY || import.meta.env.VITE_STRIPE_TEST_PUBLIC_KEY;
if (!stripePublicKey) {
  throw new Error('Missing required Stripe key: VITE_STRIPE_PUBLIC_KEY or VITE_STRIPE_TEST_PUBLIC_KEY');
}
const stripePromise = loadStripe(stripePublicKey);

interface CheckoutFormProps {
  amount: number;
  quantity: number;
  productName: string;
  productInfo: {
    quantity: number;
    amount: number;
    productName: string;
    isDigital: boolean;
  };
}

const CheckoutForm = ({ amount, productInfo }: CheckoutFormProps) => {
  const stripe = useStripe();
  const elements = useElements();
  const { toast } = useToast();
  const [isProcessing, setIsProcessing] = useState(false);
  const [, setLocation] = useLocation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsProcessing(true);

    try {
      const { error } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}/shop/success`,
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
          description: productInfo.isDigital 
            ? "Thank you for your purchase! Your download link will be available shortly."
            : "Thank you for your purchase! We'll ship your cards soon.",
        });
        setLocation('/shop/success');
      }
    } catch {
      toast({
        title: "Payment Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="bg-gray-50 p-6 rounded-lg">
        <h3 className="text-lg font-semibold mb-4 flex items-center">
          <CreditCard className="w-5 h-5 mr-2" />
          Payment Information
        </h3>
        <PaymentElement />
      </div>

      {!productInfo.isDigital && (
        <div className="bg-gray-50 p-6 rounded-lg">
          <h3 className="text-lg font-semibold mb-4 flex items-center">
            <ShoppingCart className="w-5 h-5 mr-2" />
            Shipping Address
          </h3>
          <AddressElement options={{ mode: 'shipping' }} />
        </div>
      )}

      <div className="flex items-center justify-between">
        <Link href="/shop" className="text-blue-600 hover:text-blue-800 flex items-center">
          <ArrowLeft className="w-4 h-4 mr-1" />
          Back to Shop
        </Link>
        <Button 
          type="submit" 
          disabled={!stripe || isProcessing}
          className="bg-blue-600 hover:bg-blue-700 text-white px-8"
          size="lg"
        >
          {isProcessing ? (
            <>
              <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2"></div>
              Processing...
            </>
          ) : (
            <>
              <Shield className="w-4 h-4 mr-2" />
              Complete Purchase - ${amount}
            </>
          )}
        </Button>
      </div>
    </form>
  );
};

export default function ShopCheckout() {
  const [clientSecret, setClientSecret] = useState("");
  const [productInfo, setProductInfo] = useState({
    quantity: 1,
    amount: 29.99,
    productName: "Ikigai Self-Discovery Cards",
    isDigital: false
  });
  const [shippingCost, setShippingCost] = useState(5.99);
  const [finalTotal, setFinalTotal] = useState(35.98);

  useEffect(() => {
    // Get product info from URL parameters or localStorage
    const urlParams = new URLSearchParams(window.location.search);
    const quantity = parseInt(urlParams.get('quantity') || '1');
    const amount = parseFloat(urlParams.get('amount') || '29.99');
    const productName = urlParams.get('product') || 'Ikigai Self-Discovery Cards';
    const productId = urlParams.get('productId') || '';
    const isDigital = productId.includes('digital') || productName.toLowerCase().includes('digital');

    setProductInfo({ quantity, amount, productName, isDigital });

    // Create PaymentIntent for the shop purchase
    console.log("Creating payment intent with:", { amount: amount * quantity, quantity, productName, isDigital });
    
    if (isDigital) {
      // Use digital product API for digital items
      apiRequest("POST", "/api/create-digital-payment", { 
        productId: 3, // Use the digital product ID from database
        email: "customer@example.com" // In real scenario, get from user input
      })
        .then((res) => res.json())
        .then((data) => {
          console.log("Digital payment intent response:", data);
          if (data.clientSecret) {
            setClientSecret(data.clientSecret);
            setShippingCost(0); // No shipping for digital
            setFinalTotal(amount * quantity);
          } else {
            throw new Error(data.message || 'Failed to create payment intent');
          }
        })
        .catch((error) => {
          console.error("Digital payment intent creation error:", error);
          setClientSecret("demo-mode-failed");
        });
    } else {
      // Use regular shop API for physical items
      apiRequest("POST", "/api/shop/create-payment", { 
        amount: amount * quantity,
        quantity,
        productName
      })
        .then((res) => res.json())
        .then((data) => {
          console.log("Payment intent response:", data);
          if (data.clientSecret) {
            setClientSecret(data.clientSecret);
            setShippingCost(data.shippingCost || 5.99);
            setFinalTotal(data.finalTotal || (amount * quantity + 5.99));
          } else {
            throw new Error(data.message || 'Failed to create payment intent');
          }
        })
        .catch((error) => {
          console.error("Payment intent creation error:", error);
          setClientSecret("demo-mode-failed");
        });
    }
  }, []);

  if (!clientSecret) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-gray-600">Preparing your checkout...</p>
        </div>
      </div>
    );
  }

  // Handle demo mode when payment intent creation fails
  if (clientSecret === "demo-mode-failed") {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
            <h2 className="text-lg font-semibold text-red-800 mb-2">Payment System Error</h2>
            <p className="text-red-600 mb-4">Unable to initialize payment system. Please try again later.</p>
            <Link href="/shop" className="text-red-600 hover:text-red-800">
              ← Back to Shop
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <SEO 
        title="Ikigai Cards Checkout - Self-Discovery Card Set | Ikigain"
        description="Purchase your Ikigai Self-Discovery Cards. 35 mindfulness cards to help find your life purpose. Secure checkout with fast shipping."
        keywords="ikigai cards purchase, self-discovery cards, mindfulness cards checkout, ikigai shop"
        canonical="/shop/checkout"
      />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Order Summary */}
          <div className="order-2 lg:order-1">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <ShoppingCart className="w-5 h-5 mr-2" />
                  Order Summary
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="font-semibold">{productInfo.productName}</h3>
                    <p className="text-sm text-gray-600">Quantity: {productInfo.quantity}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">${(productInfo.amount * productInfo.quantity).toFixed(2)}</p>
                  </div>
                </div>
                
                <Separator />
                
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Subtotal</span>
                  <span className="text-sm">${(productInfo.amount * productInfo.quantity).toFixed(2)}</span>
                </div>
                
                {!productInfo.isDigital && (
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Shipping</span>
                    <span className="text-sm">{shippingCost === 0 ? (
                      <span className="text-green-600">FREE</span>
                    ) : (
                      `$${shippingCost.toFixed(2)}`
                    )}</span>
                  </div>
                )}
                
                {productInfo.isDigital && (
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Delivery</span>
                    <span className="text-sm text-green-600">Instant Download</span>
                  </div>
                )}
                
                <Separator />
                
                <div className="flex justify-between items-center text-lg font-semibold">
                  <span>Total</span>
                  <span>${finalTotal.toFixed(2)}</span>
                </div>

                <div className="mt-6 space-y-3">
                  <div className="p-4 bg-blue-50 rounded-lg">
                    <div className="flex items-center text-sm text-blue-800">
                      <Shield className="w-4 h-4 mr-2" />
                      <span>Secure checkout powered by Stripe</span>
                    </div>
                  </div>
                  {productInfo.isDigital && (
                    <div className="p-3 bg-green-50 rounded-lg">
                      <div className="text-sm text-green-800 font-medium">
                        ✓ Instant access after payment
                      </div>
                    </div>
                  )}
                  {!productInfo.isDigital && productInfo.amount * productInfo.quantity >= 50 && (
                    <div className="p-3 bg-green-50 rounded-lg">
                      <div className="text-sm text-green-800 font-medium">
                        ✓ You qualify for FREE shipping!
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Checkout Form */}
          <div className="order-1 lg:order-2">
            <Card>
              <CardHeader>
                <CardTitle>Complete Your Purchase</CardTitle>
              </CardHeader>
              <CardContent>
                <Elements stripe={stripePromise} options={{ 
                  clientSecret,
                  appearance: {
                    theme: 'stripe'
                  }
                }}>
                  <CheckoutForm 
                    amount={finalTotal}
                    quantity={productInfo.quantity}
                    productName={productInfo.productName}
                    productInfo={productInfo}
                  />
                </Elements>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}