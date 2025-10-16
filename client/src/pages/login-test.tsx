import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/hooks/useAuth";
import { Link } from "wouter";
import { LogIn, User, Settings } from "lucide-react";

interface User {
  firstName?: string
  lastName?: string
  email?: string
  id?: string
}
interface AuthReturn {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
}
export default function LoginTest() {
  const { user, isAuthenticated, isLoading } = useAuth() as AuthReturn;

  const handleLogin = () => {
    window.location.href = "/api/login";
  };

  const handleLogout = () => {
    window.location.href = "/api/logout";
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-center">Admin Login Test</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {isLoading && (
            <div className="text-center">
              <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full mx-auto"></div>
              <p className="mt-2 text-gray-600">Loading...</p>
            </div>
          )}
          
          {!isLoading && !isAuthenticated && (
            <div className="text-center space-y-4">
              <p className="text-gray-600">Click below to log in as admin</p>
              <Button onClick={handleLogin} className="w-full">
                <LogIn className="mr-2 h-4 w-4" />
                Login as Admin
              </Button>
            </div>
          )}
          
          {!isLoading && isAuthenticated && (
            <div className="space-y-4">
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="flex items-center">
                  <User className="h-5 w-5 text-green-600 mr-2" />
                  <div>
                    <p className="text-sm font-medium text-green-800">
                      Logged in as: {user?.firstName} {user?.lastName}
                    </p>
                    <p className="text-xs text-green-600">{user?.email}</p>
                  </div>
                </div>
              </div>
              
              <div className="space-y-2">
                <Link href="/admin/blog" className="w-full">
                  <Button className="w-full" variant="default">
                    <Settings className="mr-2 h-4 w-4" />
                    Access Admin Blog
                  </Button>
                </Link>
                
                <Link href="/blog" className="w-full">
                  <Button className="w-full" variant="outline">
                    View Public Blog
                  </Button>
                </Link>
                
                <Button onClick={handleLogout} className="w-full" variant="outline">
                  Logout
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}