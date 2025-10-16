import { useEffect, useState } from 'react';
import { useLocation } from 'wouter';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, Download, ArrowLeft, Mail } from 'lucide-react';
import { apiRequest } from '@/lib/queryClient';

export default function ShopSuccess() {
  const [location] = useLocation();
  const [downloadToken, setDownloadToken] = useState<string | null>(null);
  const [downloadCount, setDownloadCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [productName, setProductName] = useState('Digital Product');

  useEffect(() => {
    // Get purchase details from URL params
    const urlParams = new URLSearchParams(window.location.search);
    const paymentIntentId = urlParams.get('payment_intent');
    const email = urlParams.get('email') || 'customer@example.com';
    const product = urlParams.get('product') || 'Ikigai Discovery Digital Edition';
    
    setProductName(product);

    // Confirm purchase and get download token
    if (paymentIntentId) {
      confirmPurchase(paymentIntentId, email);
    }
  }, []);

  const confirmPurchase = async (paymentIntentId: string, email: string) => {
    try {
      setLoading(true);
      const response = await apiRequest('POST', '/api/confirm-digital-purchase', {
        paymentIntentId,
        email
      });
      
      if (response.ok) {
        const data = await response.json();
        setDownloadToken(data.downloadToken);
      } else {
        console.error('Failed to confirm purchase');
      }
    } catch (error) {
      console.error('Error confirming purchase:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async () => {
    if (!downloadToken) return;

    try {
      setLoading(true);
      const response = await fetch(`/api/download/${downloadToken}`);
      
      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.style.display = 'none';
        a.href = url;
        a.download = 'ikigai-cards-digital.pdf';
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        setDownloadCount(prev => prev + 1);
      } else {
        const error = await response.json();
        alert(`Download failed: ${error.error}`);
      }
    } catch (error) {
      console.error('Download error:', error);
      alert('Download failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <div className="text-center mb-8">
        <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
        <h1 className="text-3xl font-bold text-green-700 mb-2">Payment Successful!</h1>
        <p className="text-lg text-gray-600">Thank you for your purchase</p>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Download Section */}
        <Card className="border-green-200">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Download className="w-5 h-5 mr-2 text-green-600" />
              Your Digital Download
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-green-50 p-4 rounded-lg">
              <h3 className="font-semibold text-green-800">{productName}</h3>
              <p className="text-sm text-green-600">High-quality PDF format</p>
            </div>

            {downloadToken ? (
              <div className="space-y-3">
                <Button 
                  onClick={handleDownload}
                  disabled={loading}
                  className="w-full bg-green-600 hover:bg-green-700"
                  size="lg"
                >
                  <Download className="w-4 h-4 mr-2" />
                  {loading ? 'Downloading...' : 'Download Now'}
                </Button>
                
                <div className="text-xs text-gray-500 text-center">
                  Downloads: {downloadCount}/5 • Link expires in 30 days
                </div>
              </div>
            ) : (
              <div className="text-center py-4">
                {loading ? (
                  <div className="text-blue-600">Preparing your download...</div>
                ) : (
                  <div className="text-red-600">Download link not available</div>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Support Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Mail className="w-5 h-5 mr-2 text-blue-600" />
              Need Help?
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="font-semibold text-blue-800">Download Issues?</h3>
              <p className="text-sm text-blue-600">We're here to help you access your purchase</p>
            </div>

            <div className="text-sm space-y-2">
              <p><strong>Having trouble downloading?</strong></p>
              <ul className="list-disc list-inside text-gray-600 space-y-1">
                <li>Check your browser's download folder</li>
                <li>Disable ad blockers temporarily</li>
                <li>Try a different browser</li>
                <li>Contact support if issues persist</li>
              </ul>
            </div>

            <Button variant="outline" className="w-full">
              Contact Support
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Navigation */}
      <div className="mt-8 text-center">
        <Button 
          variant="outline" 
          onClick={() => window.location.href = '/shop'}
          className="mr-4"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Shop
        </Button>
        
        <Button 
          onClick={() => window.location.href = '/'}
        >
          Take Free Test
        </Button>
      </div>

      {/* Purchase Confirmation */}
      <div className="mt-8 text-center text-sm text-gray-500">
        <p>A confirmation email has been sent with your download link.</p>
        <p>Keep this page bookmarked for easy access to your download.</p>
      </div>
    </div>
  );
}