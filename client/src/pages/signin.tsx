import { useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Compass, LogIn } from 'lucide-react';

export default function SignIn() {
  useEffect(() => {
    // Check if we're already authenticated
    fetch('/api/auth/user')
      .then(res => res.json())
      .then(data => {
        if (data.user) {
          // Already authenticated, redirect to dashboard
          window.location.href = '/dashboard';
        }
      })
      .catch(err => console.error('Auth check error:', err));
  }, []);

  const handleSignIn = () => {
    // Redirect to our new email/password login page
    window.location.href = '/login';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center p-4">
      <Card className="max-w-md w-full">
        <CardContent className="p-8 text-center">
          <Compass className="w-20 h-20 mx-auto mb-6 text-blue-600" />
          <h1 className="text-3xl font-bold mb-2">Sign In to Ikigai Compass</h1>
          <p className="text-gray-600 mb-6">
            Access your test results, track your progress, and discover your purpose.
          </p>
          
          <div className="space-y-4">
            <Button 
              onClick={handleSignIn}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
              size="lg"
            >
              <LogIn className="w-5 h-5 mr-2" />
              Sign In to Your Account
            </Button>
            
            <div className="mt-6 p-4 bg-blue-50 rounded-lg text-left">
              <h3 className="font-semibold text-sm mb-2">How to Sign In:</h3>
              <ol className="text-sm text-gray-600 space-y-1">
                <li>1. Click the "Sign In to Your Account" button above</li>
                <li>2. Enter your email and password</li>
                <li>3. Access your saved Ikigai test results</li>
              </ol>
              <p className="text-xs text-gray-500 mt-2">
                Don't have an account? You can create one during the sign-in process.
              </p>
            </div>
            
            <p className="text-xs text-gray-500 mt-4">
              By signing in, you agree to save your test results securely with your email account.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}