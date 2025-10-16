import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertTriangle, User, Shield, CheckCircle } from "lucide-react";
import { useLocation } from "wouter";

export default function GuestAccess() {
  const [isLoading, setIsLoading] = useState(false);
  const [, setLocation] = useLocation();

  const handleGuestLogin = async () => {
    setIsLoading(true);
    
    try {
      const response = await fetch('/api/guest-login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include'
      });
      
      if (response.ok) {
        // Refresh the page to update auth state
        window.location.href = '/';
      } else {
        console.error('Guest login failed');
      }
    } catch (error) {
      console.error('Guest login error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 p-3 bg-yellow-100 rounded-full w-fit">
            <AlertTriangle className="h-8 w-8 text-yellow-600" />
          </div>
          <CardTitle className="text-2xl">Authentication Temporarily Unavailable</CardTitle>
          <CardDescription>
            Our main login system is currently under maintenance. You can continue with guest access.
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-4">
          <div className="bg-blue-50 p-4 rounded-lg">
            <h3 className="font-semibold text-blue-900 mb-2 flex items-center">
              <CheckCircle className="h-4 w-4 mr-2" />
              With Guest Access You Can:
            </h3>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• Take the Ikigai personality test</li>
              <li>• View your results and insights</li>
              <li>• Explore Ikigai types and articles</li>
              <li>• Access most features</li>
            </ul>
          </div>
          
          <div className="bg-amber-50 p-4 rounded-lg">
            <h3 className="font-semibold text-amber-900 mb-2 flex items-center">
              <Shield className="h-4 w-4 mr-2" />
              Limitations:
            </h3>
            <ul className="text-sm text-amber-800 space-y-1">
              <li>• Results won't be permanently saved</li>
              <li>• No access to admin features</li>
              <li>• Session ends when you close browser</li>
            </ul>
          </div>
          
          <Button 
            onClick={handleGuestLogin}
            disabled={isLoading}
            className="w-full bg-primary hover:bg-primary/90"
          >
            {isLoading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Accessing...
              </>
            ) : (
              <>
                <User className="h-4 w-4 mr-2" />
                Continue as Guest
              </>
            )}
          </Button>
          
          <div className="text-center">
            <Button 
              variant="outline" 
              onClick={() => setLocation('/')}
              className="text-sm"
            >
              Return to Home
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}