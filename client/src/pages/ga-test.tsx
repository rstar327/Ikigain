import { useEffect, useState } from 'react';
import Navigation from '@/components/Navigation';
import SEO from '@/components/SEO';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { trackEvent } from '@/lib/analytics';

export default function GATest() {
  const [gaStatus, setGaStatus] = useState<'loading' | 'active' | 'inactive'>('loading');
  const [measurementId, setMeasurementId] = useState('');
  const [testEvents, setTestEvents] = useState<string[]>([]);

  useEffect(() => {
    // Check if GA is loaded and configured
    const checkGA = () => {
      const envId = import.meta.env.VITE_GA_MEASUREMENT_ID || 'G-7LMJGM0MQT';
      setMeasurementId(envId);
      
      if (typeof window !== 'undefined' && 'gtag' in window && window.dataLayer) {
        console.log('✅ GA4 is active with ID:', envId);
        console.log('DataLayer exists:', !!window.dataLayer);
        console.log('DataLayer length:', window.dataLayer?.length || 0);
        setGaStatus('active');
      } else {
        console.log('❌ GA4 is not active');
        setGaStatus('inactive');
      }
    };

    // Wait a bit for GA to load
    setTimeout(checkGA, 2000);
  }, []);

  const sendTestEvent = () => {
    const timestamp = new Date().toLocaleTimeString();
    const eventName = `ga_test_${Date.now()}`;
    
    try {
      trackEvent(eventName, 'test_category', 'manual_test', 1);
      const message = `${timestamp}: Test event "${eventName}" sent`;
      setTestEvents(prev => [message, ...prev.slice(0, 4)]);
      console.log('Test event sent:', eventName);
    } catch (error) {
      const message = `${timestamp}: Error sending test event - ${error}`;
      setTestEvents(prev => [message, ...prev.slice(0, 4)]);
      console.error('Error sending test event:', error);
    }
  };

  const checkNetworkRequests = () => {
    console.log('=== GA Debug Information ===');
    console.log('Current URL:', window.location.href);
    console.log('Measurement ID:', measurementId);
    console.log('gtag function exists:', !!window.gtag);
    console.log('dataLayer exists:', !!window.dataLayer);
    console.log('dataLayer contents:', window.dataLayer);
    
    if (typeof window !== 'undefined' && 'gtag' in window) {
      // Send a debug event
      (window as any).gtag('event', 'debug_check', {
        event_category: 'debug',
        event_label: 'manual_debug',
        debug_mode: true
      });
      console.log('Debug event sent to GA');
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <SEO 
        title="Google Analytics Test - Ikigain"
        description="Test page to verify Google Analytics is working properly"
        canonical="/ga-test"
      />
      <Navigation />
      
      <div className="max-w-4xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Google Analytics Debug</h1>
        
        <div className="grid gap-6 md:grid-cols-2">
          {/* Status Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                {gaStatus === 'loading' && <AlertCircle className="w-5 h-5 text-yellow-500" />}
                {gaStatus === 'active' && <CheckCircle className="w-5 h-5 text-green-500" />}
                {gaStatus === 'inactive' && <XCircle className="w-5 h-5 text-red-500" />}
                GA4 Status
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span>Status:</span>
                  <Badge variant={gaStatus === 'active' ? 'default' : 'destructive'}>
                    {gaStatus === 'loading' ? 'Checking...' : 
                     gaStatus === 'active' ? 'Active ✅' : 'Inactive ❌'}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span>Measurement ID:</span>
                  <code className="text-sm bg-gray-100 px-2 py-1 rounded">
                    {measurementId || 'Not found'}
                  </code>
                </div>
                <div className="flex items-center justify-between">
                  <span>Environment:</span>
                  <Badge variant="outline">
                    {window.location.hostname === 'www.ikigain.org' ? 'Production' : 'Development'}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span>gtag function:</span>
                  <Badge variant={(typeof window !== 'undefined' && 'gtag' in window) ? 'default' : 'destructive'}>
                    {(typeof window !== 'undefined' && 'gtag' in window) ? 'Loaded ✅' : 'Missing ❌'}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span>dataLayer:</span>
                  <Badge variant={(typeof window !== 'undefined' && window.dataLayer) ? 'default' : 'destructive'}>
                    {(typeof window !== 'undefined' && window.dataLayer) ? `${window.dataLayer.length} items` : 'Missing ❌'}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Test Controls */}
          <Card>
            <CardHeader>
              <CardTitle>Testing Tools</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Button 
                  onClick={sendTestEvent}
                  className="w-full"
                  disabled={gaStatus !== 'active'}
                >
                  Send Test Event
                </Button>
                <Button 
                  onClick={checkNetworkRequests}
                  variant="outline"
                  className="w-full"
                >
                  Log Debug Info
                </Button>
                <p className="text-sm text-gray-600">
                  Open browser DevTools → Console to see detailed logs
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Test Events Log */}
        {testEvents.length > 0 && (
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Recent Test Events</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {testEvents.map((event, index) => (
                  <div key={index} className="text-sm bg-gray-50 p-2 rounded">
                    {event}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Instructions */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>How to Test GA in Production</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 text-sm">
              <div>
                <strong>1. Real-time Check:</strong>
                <ul className="list-disc list-inside ml-4 mt-1">
                  <li>Go to Google Analytics → Reports → Realtime</li>
                  <li>Visit this page on www.ikigain.org</li>
                  <li>You should see activity within 1-2 minutes</li>
                </ul>
              </div>
              
              <div>
                <strong>2. Event Testing:</strong>
                <ul className="list-disc list-inside ml-4 mt-1">
                  <li>Click "Send Test Event" button above</li>
                  <li>Check GA4 → Events → View events in real-time</li>
                  <li>Look for custom events starting with "ga_test_"</li>
                </ul>
              </div>

              <div>
                <strong>3. Browser Network Tab:</strong>
                <ul className="list-disc list-inside ml-4 mt-1">
                  <li>Open DevTools → Network tab</li>
                  <li>Filter for "google-analytics.com" or "collect"</li>
                  <li>Reload page and look for outgoing requests</li>
                </ul>
              </div>

              <div className="bg-yellow-50 p-3 rounded border border-yellow-200">
                <strong>Note:</strong> Standard GA reporting can take 24-48 hours to show data. 
                Use Real-time reports for immediate verification.
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}