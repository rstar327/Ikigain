import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Users, 
  FileText, 
  ShoppingCart, 
  BarChart3, 
  Eye,
  Edit,
  Mail,
  Download,
  Search,
  Home,
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { format } from 'date-fns';
import { Link } from 'wouter';

// Dashboard stats component
function DashboardStats() {
  const { data: blogStats } = useQuery({
    queryKey: ['/api/admin/blog/analytics'],
  });

  const { data: emailStats } = useQuery({
    queryKey: ['/api/admin/emails'],
  });

  const { data: shopStats } = useQuery({
    queryKey: ['/api/admin/shop/products'],
  });

  const totalEmails = (emailStats as any[])?.length || 0;
  const totalProducts = (shopStats as any[])?.length || 0;
  const totalPosts = (blogStats as any)?.totalPosts || 0;
  const publishedPosts = (blogStats as any)?.publishedPosts || 0;

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Blog Posts</CardTitle>
          <FileText className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalPosts}</div>
          <p className="text-xs text-muted-foreground">
            {publishedPosts} published
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Email Collection</CardTitle>
          <Mail className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalEmails}</div>
          <p className="text-xs text-muted-foreground">
            Collected from tests
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Shop Products</CardTitle>
          <ShoppingCart className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalProducts}</div>
          <p className="text-xs text-muted-foreground">
            Active products
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Test Sessions</CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalEmails}</div>
          <p className="text-xs text-muted-foreground">
            Completed tests
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

// Email management component
function EmailManagement() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterTier, setFilterTier] = useState('all');
  
  const { data: emails } = useQuery({
    queryKey: ['/api/admin/emails'],
  });

  const filteredEmails = (emails as any)?.filter((email: any) => {
    const matchesSearch = email.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         email.primaryType.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTier = filterTier === 'all' || email.premiumTier === filterTier;
    return matchesSearch && matchesTier;
  });

  const exportEmails = () => {
    if (!emails) return;
    
    const csvContent = [
      ['Email', 'Primary Type', 'Overall Score', 'Premium Tier', 'Completed Date'].join(','),
      ...(emails as any[]).map((email: any) => [
        email.email,
        email.primaryType,
        email.overallScore,
        email.premiumTier || 'free',
        format(new Date(email.completedAt), 'yyyy-MM-dd HH:mm')
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ikigai-emails-${format(new Date(), 'yyyy-MM-dd')}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="flex gap-2 flex-1">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search emails or personality types..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={filterTier} onValueChange={setFilterTier}>
            <SelectTrigger className="w-48">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Tiers</SelectItem>
              <SelectItem value="free">Free</SelectItem>
              <SelectItem value="roadmap">Roadmap</SelectItem>
              <SelectItem value="personality">Personality</SelectItem>
              <SelectItem value="blueprint">Blueprint</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <Button onClick={exportEmails} className="flex items-center gap-2">
          <Download className="h-4 w-4" />
          Export CSV
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Email Collection ({filteredEmails?.length || 0})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-2">Email</th>
                  <th className="text-left p-2">Primary Type</th>
                  <th className="text-left p-2">Score</th>
                  <th className="text-left p-2">Tier</th>
                  <th className="text-left p-2">Completed</th>
                </tr>
              </thead>
              <tbody>
                {filteredEmails?.map((email: any) => (
                  <tr key={email.id} className="border-b hover:bg-gray-50">
                    <td className="p-2 font-medium">{email.email}</td>
                    <td className="p-2">{email.primaryType}</td>
                    <td className="p-2">{email.overallScore.toFixed(1)}</td>
                    <td className="p-2">
                      <Badge variant={email.premiumTier ? 'default' : 'secondary'}>
                        {email.premiumTier || 'free'}
                      </Badge>
                    </td>
                    <td className="p-2 text-sm text-gray-600">
                      {format(new Date(email.completedAt), 'MMM dd, yyyy')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// Quick actions component
function QuickActions() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Blog Management</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Link href="/admin/blog-enhanced">
            <Button className="w-full">
              <Edit className="h-4 w-4 mr-2" />
              Advanced Blog Editor
            </Button>
          </Link>
          <Link href="/blog">
            <Button variant="outline" className="w-full">
              <Eye className="h-4 w-4 mr-2" />
              View Public Blog
            </Button>
          </Link>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Shop Management</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Link href="/admin/shop">
            <Button className="w-full">
              <ShoppingCart className="h-4 w-4 mr-2" />
              Manage Products
            </Button>
          </Link>
          <Link href="/shop">
            <Button variant="outline" className="w-full">
              <Eye className="h-4 w-4 mr-2" />
              View Shop
            </Button>
          </Link>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Analytics</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Link href="/admin/checkout-analytics">
            <Button className="w-full">
              <BarChart3 className="h-4 w-4 mr-2" />
              Checkout Analytics
            </Button>
          </Link>
          <Link href="/admin/emails">
            <Button variant="outline" className="w-full">
              <Mail className="h-4 w-4 mr-2" />
              Email Dashboard
            </Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}

// Recent activity component
function RecentActivity() {
  const { data: emails } = useQuery({
    queryKey: ['/api/admin/emails'],
  });

  const recentEmails = (emails as any[])?.slice(0, 5);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {recentEmails?.map((email: any) => (
            <div key={email.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div>
                <p className="font-medium">{email.email}</p>
                <p className="text-sm text-gray-600">
                  Completed {email.primaryType} test
                </p>
              </div>
              <div className="text-right">
                <Badge variant={email.premiumTier ? 'default' : 'secondary'}>
                  {email.premiumTier || 'free'}
                </Badge>
                <p className="text-xs text-gray-500 mt-1">
                  {format(new Date(email.completedAt), 'MMM dd, HH:mm')}
                </p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

export default function AdminDashboard() {
  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/">
            <Button variant="outline" size="sm">
              <Home className="h-4 w-4 mr-2" />
              Back to Home
            </Button>
          </Link>
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        </div>
        <Badge variant="outline">Administrator</Badge>
      </div>

      <DashboardStats />

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="emails">Email Management</TabsTrigger>
          <TabsTrigger value="content">Content</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <QuickActions />
          <RecentActivity />
        </TabsContent>

        <TabsContent value="emails">
          <EmailManagement />
        </TabsContent>

        <TabsContent value="content">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Blog Content</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <Link href="/admin/blog-enhanced">
                    <Button className="w-full">
                      <FileText className="h-4 w-4 mr-2" />
                      Advanced Blog Management
                    </Button>
                  </Link>
                  <p className="text-sm text-gray-600">
                    Create, edit, and manage blog posts with advanced features including SEO optimization, analytics, and content templates.
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Shop Products</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <Link href="/admin/shop">
                    <Button className="w-full">
                      <ShoppingCart className="h-4 w-4 mr-2" />
                      Manage Products
                    </Button>
                  </Link>
                  <p className="text-sm text-gray-600">
                    Add, edit, and manage shop products, inventory, and pricing.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="settings">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>SEO Settings</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span>Sitemap</span>
                    <a href="/sitemap.xml" target="_blank" rel="noopener noreferrer">
                      <Button variant="outline" size="sm">View</Button>
                    </a>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Robots.txt</span>
                    <a href="/robots.txt" target="_blank" rel="noopener noreferrer">
                      <Button variant="outline" size="sm">View</Button>
                    </a>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>RSS Feed</span>
                    <a href="/rss.xml" target="_blank" rel="noopener noreferrer">
                      <Button variant="outline" size="sm">View</Button>
                    </a>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>System Status</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span>Database</span>
                    <Badge variant="default">Connected</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Email Service</span>
                    <Badge variant="default">Active</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Payment System</span>
                    <Badge variant="default">Operational</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}