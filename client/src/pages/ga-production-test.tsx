import { useEffect, useState } from 'react';
import Navigation from '@/components/Navigation';
import SEO from '@/components/SEO';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, XCircle, AlertCircle, ExternalLink } from 'lucide-react';

export default function GAProductionTest() {
  const [gaStatus, setGaStatus] = useState<{
    loaded: boolean;
    configured: boolean;
    measurementId: string;
    environment: string;
    networkRequests: string[];
  }>({
    loaded: false,
    configured: false,
    measurementId: '',
    environment: '',
    networkRequests: []
  });

  useEffect(() => {
    // Comprehensive GA verification
    const checkGA = () => {
      const measurementId = import.meta.env.VITE_GA_MEASUREMENT_ID || 'G-7LMJGM0MQT';
      const environment = window.location.hostname === 'www.ikigain.org' ? 'PRODUCTION' : 'DEVELOPMENT';
      
      console.log('=== GA PRODUCTION TEST ===');
      console.log('Environment:', environment);
      console.log('Hostname:', window.location.hostname);
      console.log('Measurement ID:', measurementId);
      console.log('gtag exists:', typeof window !== 'undefined' && 'gtag' in window);
      console.log('dataLayer exists:', typeof window !== 'undefined' && !!window.dataLayer);
      
      setGaStatus({
        loaded: typeof window !== 'undefined' && 'gtag' in window,
        configured: typeof window !== 'undefined' && !!window.dataLayer,
        measurementId,
        environment,
        networkRequests: []
      });

      // Force send a test pageview for production
      if (typeof window !== 'undefined' && 'gtag' in window) {
        (window as any).gtag('event', 'page_view', {
          page_title: 'GA Production Test Page',
          page_location: window.location.href,
          page_path: '/ga-production-test',
          custom_parameter_production_test: true
        });
        console.log('✅ Production test page view sent to GA4');
      }
    };

    // Wait for GA to load
    setTimeout(checkGA, 3000);
  }, []);

  const sendProductionTestEvent = () => {
    const timestamp = new Date().toISOString();
    
    if (typeof window !== 'undefined' && 'gtag' in window) {
      const eventName = 'production_test_event';
      (window as any).gtag('event', eventName, {
        event_category: 'production_test',
        event_label: 'manual_production_test',
        custom_parameter_test: timestamp,
        production_environment: gaStatus.environment,
        measurement_id_used: gaStatus.measurementId
      });
      
      console.log('✅ Production test event sent:', {
        event: eventName,
        timestamp,
        environment: gaStatus.environment,
        measurementId: gaStatus.measurementId
      });
      
      alert(`Production test event sent at ${timestamp}\nCheck GA4 Real-time Events in 1-2 minutes`);
    } else {
      alert('❌ Google Analytics not loaded');
    }
  };

  const openGARealtimeEvents = () => {
    window.open('https://analytics.google.com/analytics/web/#/realtime/rt-event/a265643617w429635892p352808976/', '_blank');
  };

  const openGARealtimeOverview = () => {
    window.open('https://analytics.google.com/analytics/web/#/realtime/rt-overview/a265643617w429635892p352808976/', '_blank');
  };

  return (
    <div className="min-h-screen bg-background">
      <SEO 
        title="GA Production Test - Real-time Analytics Verification | Ikigain"
        description="Production test page to verify Google Analytics is working in real-time on www.ikigain.org"
        canonical="/ga-production-test"
      />
      <Navigation />
      
      <div className="max-w-4xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-2">Google Analytics Production Test</h1>
        <p className="text-gray-600 mb-6">Real-time verification for www.ikigain.org</p>
        
        <div className="grid gap-6 md:grid-cols-2">
          {/* Status Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                {gaStatus.loaded && gaStatus.configured ? 
                  <CheckCircle className="w-5 h-5 text-green-500" /> :
                  <XCircle className="w-5 h-5 text-red-500" />
                }
                Production Status
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span>Environment:</span>
                  <Badge variant={gaStatus.environment === 'PRODUCTION' ? 'default' : 'outline'}>
                    {gaStatus.environment}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span>Measurement ID:</span>
                  <code className="text-sm bg-gray-100 px-2 py-1 rounded">
                    {gaStatus.measurementId}
                  </code>
                </div>
                <div className="flex items-center justify-between">
                  <span>GA4 Loaded:</span>
                  <Badge variant={gaStatus.loaded ? 'default' : 'destructive'}>
                    {gaStatus.loaded ? '✅ Yes' : '❌ No'}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span>Configured:</span>
                  <Badge variant={gaStatus.configured ? 'default' : 'destructive'}>
                    {gaStatus.configured ? '✅ Yes' : '❌ No'}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span>Domain:</span>
                  <code className="text-sm bg-gray-100 px-2 py-1 rounded">
                    {window.location.hostname}
                  </code>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Test Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Production Test Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Button 
                  onClick={sendProductionTestEvent}
                  className="w-full"
                  disabled={!gaStatus.loaded}
                >
                  Send Production Test Event
                </Button>
                
                <div className="border-t pt-4">
                  <h4 className="font-semibold mb-2">Check GA4 Real-time:</h4>
                  <div className="space-y-2">
                    <Button 
                      onClick={openGARealtimeOverview}
                      variant="outline"
                      className="w-full justify-between"
                      size="sm"
                    >
                      Real-time Overview
                      <ExternalLink className="w-4 h-4" />
                    </Button>
                    <Button 
                      onClick={openGARealtimeEvents}
                      variant="outline"
                      className="w-full justify-between"
                      size="sm"
                    >
                      Real-time Events
                      <ExternalLink className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Instructions for Production Testing */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>🔴 LIVE Production Test Instructions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 text-sm">
              <div className="bg-red-50 border border-red-200 p-4 rounded">
                <h4 className="font-bold text-red-800 mb-2">⚠️ Production Environment Only</h4>
                <p className="text-red-700">This test only works on <strong>www.ikigain.org</strong>. If you're not on the production domain, GA data won't show in your dashboard.</p>
              </div>

              <div className="bg-blue-50 border border-blue-200 p-4 rounded">
                <h4 className="font-bold text-blue-800 mb-2">📊 Real-time Testing Steps:</h4>
                <ol className="list-decimal list-inside space-y-1 text-blue-700">
                  <li>Ensure you're on <strong>www.ikigain.org/ga-production-test</strong></li>
                  <li>Click "Send Production Test Event" button above</li>
                  <li>Click "Real-time Events" to open your GA4 dashboard</li>
                  <li>Look for "production_test_event" in real-time events</li>
                  <li>You should see activity within 1-2 minutes</li>
                </ol>
              </div>

              <div className="bg-green-50 border border-green-200 p-4 rounded">
                <h4 className="font-bold text-green-800 mb-2">✅ What to Look For:</h4>
                <ul className="list-disc list-inside space-y-1 text-green-700">
                  <li><strong>Real-time Overview:</strong> Should show 1 active user</li>
                  <li><strong>Real-time Events:</strong> Look for "production_test_event"</li>
                  <li><strong>Page Views:</strong> Should show "/ga-production-test" page</li>
                  <li><strong>Location:</strong> Should show your geographic location</li>
                </ul>
              </div>

              <div className="bg-yellow-50 border border-yellow-200 p-4 rounded">
                <h4 className="font-bold text-yellow-800 mb-2">🚨 If No Data Appears:</h4>
                <ul className="list-disc list-inside space-y-1 text-yellow-700">
                  <li>Wait 2-3 minutes (GA4 real-time can have slight delays)</li>
                  <li>Check browser console for GA errors (F12 → Console)</li>
                  <li>Verify you're on the correct GA4 property (G-7LMJGM0MQT)</li>
                  <li>Ensure ad blockers aren't blocking GA requests</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Network Debug Info */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Debug Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-xs font-mono bg-gray-50 p-4 rounded">
              <div>Current URL: {window.location.href}</div>
              <div>Hostname: {window.location.hostname}</div>
              <div>Is Production: {window.location.hostname === 'www.ikigain.org' ? 'YES' : 'NO'}</div>
              <div>Environment: {gaStatus.environment}</div>
              <div>Measurement ID: {gaStatus.measurementId}</div>
              <div>User Agent: {navigator.userAgent}</div>
              <div>Timestamp: {new Date().toISOString()}</div>
            </div>
            <p className="text-sm text-gray-600 mt-2">
              Open browser DevTools → Console to see detailed GA logs
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}