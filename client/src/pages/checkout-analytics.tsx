import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { ShoppingCart, Eye, CreditCard, CheckCircle } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface CheckoutAnalytics {
  id: number;
  sessionId: string;
  userId: string;
  email: string;
  productType: string;
  productId: string;
  tier: 'roadmap' | 'personality' | 'blueprint';
  amount: number;
  currency: string;
  viewedUpsell: boolean;
  startedCheckout: boolean;
  enteredPaymentInfo: boolean;
  completedPurchase: boolean;
  createdAt: string;
  updatedAt: string;
}

interface ConversionStats {
  totalViews: number;
  checkoutStarts: number;
  paymentInfoEntered: number;
  completedPurchases: number;
  conversionRates: {
    viewToCheckout: number;
    checkoutToPayment: number;
    paymentToComplete: number;
    overallConversion: number;
  };
  dropOffPoints: {
    afterUpsellView: number;
    afterCheckoutStart: number;
    afterPaymentInfo: number;
  };
}

export default function CheckoutAnalytics() {
  const { data: analytics = [], isLoading: analyticsLoading } = useQuery<CheckoutAnalytics[]>({
    queryKey: ['/api/admin/checkout-analytics'],
    queryFn: async () => {
      const response = await fetch('/api/admin/checkout-analytics');
      if (!response.ok) throw new Error('Failed to fetch checkout analytics');
      return response.json();
    }
  });

  const { data: stats, isLoading: statsLoading } = useQuery<ConversionStats>({
    queryKey: ['/api/admin/checkout-stats'],
    queryFn: async () => {
      const response = await fetch('/api/admin/checkout-conversion-stats');
      if (!response.ok) throw new Error('Failed to fetch conversion stats');
      return response.json();
    }
  });

  if (analyticsLoading || statsLoading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Checkout Analytics</h1>
            <p className="text-gray-600 mt-2">Monitor checkout conversion rates and user behavior</p>
          </div>
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        </div>
      </div>
    );
  }

  const getTierBadgeColor = (tier: string) => {
    switch (tier) {
      case 'roadmap': return 'bg-blue-100 text-blue-800';
      case 'personality': return 'bg-purple-100 text-purple-800';
      case 'blueprint': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusBadgeColor = (completed: boolean, started: boolean) => {
    if (completed) return 'bg-green-100 text-green-800';
    if (started) return 'bg-yellow-100 text-yellow-800';
    return 'bg-red-100 text-red-800';
  };

  const getStatusText = (item: CheckoutAnalytics) => {
    if (item.completedPurchase) return 'Completed';
    if (item.enteredPaymentInfo) return 'Payment Info';
    if (item.startedCheckout) return 'Started Checkout';
    if (item.viewedUpsell) return 'Viewed Upsell';
    return 'No Activity';
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Checkout Analytics</h1>
          <p className="text-gray-600 mt-2">Monitor checkout conversion rates and user behavior</p>
        </div>

        {/* Conversion Stats Overview */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Views</CardTitle>
                <Eye className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalViews}</div>
                <p className="text-xs text-muted-foreground">
                  Upsell page views
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Checkout Starts</CardTitle>
                <ShoppingCart className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.checkoutStarts}</div>
                <p className="text-xs text-muted-foreground">
                  {stats.conversionRates.viewToCheckout.toFixed(1)}% from views
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Payment Info</CardTitle>
                <CreditCard className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.paymentInfoEntered}</div>
                <p className="text-xs text-muted-foreground">
                  {stats.conversionRates.checkoutToPayment.toFixed(1)}% from checkout
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Completed</CardTitle>
                <CheckCircle className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.completedPurchases}</div>
                <p className="text-xs text-muted-foreground">
                  {stats.conversionRates.overallConversion.toFixed(1)}% overall
                </p>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Conversion Funnel */}
        {stats && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Conversion Funnel</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Upsell Views</span>
                  <span className="text-sm text-gray-600">{stats.totalViews}</span>
                </div>
                <Progress value={100} className="h-2" />
                
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Started Checkout</span>
                  <span className="text-sm text-gray-600">
                    {stats.checkoutStarts} ({stats.conversionRates.viewToCheckout.toFixed(1)}%)
                  </span>
                </div>
                <Progress 
                  value={stats.totalViews > 0 ? (stats.checkoutStarts / stats.totalViews) * 100 : 0} 
                  className="h-2" 
                />
                
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Entered Payment Info</span>
                  <span className="text-sm text-gray-600">
                    {stats.paymentInfoEntered} ({stats.conversionRates.checkoutToPayment.toFixed(1)}%)
                  </span>
                </div>
                <Progress 
                  value={stats.checkoutStarts > 0 ? (stats.paymentInfoEntered / stats.checkoutStarts) * 100 : 0} 
                  className="h-2" 
                />
                
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Completed Purchase</span>
                  <span className="text-sm text-gray-600">
                    {stats.completedPurchases} ({stats.conversionRates.paymentToComplete.toFixed(1)}%)
                  </span>
                </div>
                <Progress 
                  value={stats.paymentInfoEntered > 0 ? (stats.completedPurchases / stats.paymentInfoEntered) * 100 : 0} 
                  className="h-2" 
                />
              </div>
            </CardContent>
          </Card>
        )}

        {/* Analytics Table */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Checkout Sessions</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Session</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Tier</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Created</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {analytics.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className="font-mono text-sm">
                      {item.sessionId.slice(0, 8)}...
                    </TableCell>
                    <TableCell>{item.email}</TableCell>
                    <TableCell>
                      <Badge className={getTierBadgeColor(item.tier)}>
                        {item.tier}
                      </Badge>
                    </TableCell>
                    <TableCell>${item.amount}</TableCell>
                    <TableCell>
                      <Badge className={getStatusBadgeColor(item.completedPurchase, item.startedCheckout)}>
                        {getStatusText(item)}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm text-gray-600">
                      {formatDistanceToNow(new Date(item.createdAt), { addSuffix: true })}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            
            {analytics.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                No checkout analytics data available yet.
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}