import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Navigation from "@/components/Navigation";

export default function DashboardSimple() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <Navigation />
      
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Card>
          <CardHeader>
            <CardTitle>Dashboard Test</CardTitle>
          </CardHeader>
          <CardContent>
            <p>This is a simple dashboard test page.</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}