import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';

export default function DevAdminLogin() {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleReflitAuth = async () => {
    setLoading(true);

    try {
      toast({
        title: "Redirecting to Replit Auth",
        description: "Please sign in with karlisvilmanis@gmail.com to access admin features",
      });
      
      // Redirect to Replit Auth login
      window.location.href = '/api/login';
    } catch {
      toast({
        title: "Error",
        description: "Failed to redirect to login",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl text-center">Development Admin Login</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="font-medium text-blue-900 mb-2">Admin Access Instructions</h3>
              <p className="text-sm text-blue-700">
                Click the button below to sign in with Replit Auth using <strong>karlisvilmanis@gmail.com</strong>. 
                After successful authentication, you'll have access to admin features.
              </p>
            </div>
            
            <Button onClick={handleReflitAuth} className="w-full" disabled={loading}>
              {loading ? 'Redirecting...' : 'Sign in with Replit Auth'}
            </Button>
          </div>
          
          <div className="mt-4 text-xs text-gray-500 text-center">
            Admin access restricted to karlisvilmanis@gmail.com only
          </div>
        </CardContent>
      </Card>
    </div>
  );
}