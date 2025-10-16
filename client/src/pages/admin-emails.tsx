import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Download, Search, Mail, Calendar, User } from "lucide-react";

interface CollectedEmail {
  id: number;
  email: string;
  created_at: string;
  is_completed: boolean;
  premium_tier: string | null;
}

export default function AdminEmails() {
  const [emails, setEmails] = useState<CollectedEmail[]>([]);
  const [filteredEmails, setFilteredEmails] = useState<CollectedEmail[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState({
    total: 0,
    today: 0,
    week: 0,
    premium: 0
  });

  // Force immediate data display for debugging
  console.log('AdminEmails component rendered');
  console.log('Current emails state:', emails);
  console.log('Current loading state:', loading);
  console.log('Current error state:', error);

  useEffect(() => {
    fetchEmails();
  }, []);

  useEffect(() => {
    if (searchTerm) {
      const filtered = emails.filter(email =>
        email.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredEmails(filtered);
    } else {
      setFilteredEmails(emails);
    }
  }, [searchTerm, emails]);

  const fetchEmails = async () => {
    try {
      console.log('Fetching emails from API...');
      const response = await fetch('/api/collected-emails');
      console.log('Response status:', response.status);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('Fetched email data:', data);
      console.log('Number of emails received:', data.length);
      
      // Ensure data is an array
      if (!Array.isArray(data)) {
        console.error('API returned non-array data:', data);
        setError('Invalid data format received from server');
        return;
      }
      
      console.log('Setting emails state with data:', data);
      setEmails(data);
      setFilteredEmails(data);
      
      // Force a re-render by updating loading state
      setTimeout(() => {
        setLoading(false);
      }, 100);
      
      // Calculate stats
      const now = new Date();
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      
      const calculatedStats = {
        total: data.length,
        today: data.filter((e: CollectedEmail) => {
          try {
            return new Date(e.created_at) >= today;
          } catch {
            console.error('Error parsing date:', e.created_at);
            return false;
          }
        }).length,
        week: data.filter((e: CollectedEmail) => {
          try {
            return new Date(e.created_at) >= weekAgo;
          } catch {
            console.error('Error parsing date:', e.created_at);
            return false;
          }
        }).length,
        premium: data.filter((e: CollectedEmail) => e.premium_tier !== null && e.premium_tier !== undefined).length
      };
      
      console.log('Calculated stats:', calculatedStats);
      setStats(calculatedStats);
    } catch (error) {
      console.error('Error fetching emails:', error);
      setError(`Failed to fetch emails: ${error instanceof Error ? error.message : 'Unknown error'}`);
      setLoading(false);
    }
  };

  const exportEmails = () => {
    const csvContent = [
      ['Email', 'Date Collected', 'Status', 'Premium Tier'],
      ...filteredEmails.map(email => [
        email.email,
        new Date(email.created_at).toLocaleDateString(),
        email.is_completed ? 'Completed' : 'Incomplete',
        email.premium_tier || 'Free'
      ])
    ].map(row => row.join(',')).join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ikigai-emails-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const getTierBadge = (tier: string | null) => {
    if (!tier) return <Badge variant="outline">Free</Badge>;
    
    const colors = {
      roadmap: 'bg-blue-100 text-blue-800',
      personality: 'bg-purple-100 text-purple-800',
      blueprint: 'bg-green-100 text-green-800'
    };
    
    return (
      <Badge className={colors[tier as keyof typeof colors] || 'bg-gray-100 text-gray-800'}>
        {tier.charAt(0).toUpperCase() + tier.slice(1)}
      </Badge>
    );
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center h-64">
          <div className="text-lg">Loading emails...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Error Loading Emails</h1>
          <p className="text-red-600 mb-4">{error}</p>
          <button 
            onClick={() => {
              setError(null);
              setLoading(true);
              fetchEmails();
            }}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Collected Emails</h1>
        <p className="text-gray-600">View and manage all emails collected from Ikigai tests</p>
      </div>



      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Mail className="h-8 w-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Emails</p>
                <p className="text-2xl font-bold">{stats.total}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Calendar className="h-8 w-8 text-green-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Today</p>
                <p className="text-2xl font-bold">{stats.today}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Calendar className="h-8 w-8 text-orange-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">This Week</p>
                <p className="text-2xl font-bold">{stats.week}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <User className="h-8 w-8 text-purple-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Premium</p>
                <p className="text-2xl font-bold">{stats.premium}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Export */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search emails..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
        <Button onClick={exportEmails} className="flex items-center gap-2">
          <Download className="h-4 w-4" />
          Export CSV
        </Button>
      </div>

      {/* Emails Table */}
      <Card>
        <CardHeader>
          <CardTitle>Email Collection ({filteredEmails.length} emails)</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4">Email</th>
                  <th className="text-left py-3 px-4">Date Collected</th>
                  <th className="text-left py-3 px-4">Status</th>
                  <th className="text-left py-3 px-4">Tier</th>
                </tr>
              </thead>
              <tbody>
                {filteredEmails.map((email) => (
                  <tr key={email.id} className="border-b hover:bg-gray-50">
                    <td className="py-3 px-4 font-medium">{email.email}</td>
                    <td className="py-3 px-4">
                      {new Date(email.created_at).toLocaleDateString()} at{' '}
                      {new Date(email.created_at).toLocaleTimeString()}
                    </td>
                    <td className="py-3 px-4">
                      {email.is_completed ? (
                        <Badge variant="outline" className="bg-green-100 text-green-800">
                          Completed
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="bg-yellow-100 text-yellow-800">
                          Incomplete
                        </Badge>
                      )}
                    </td>
                    <td className="py-3 px-4">{getTierBadge(email.premium_tier)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {filteredEmails.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              {searchTerm ? 'No emails found matching your search.' : 'No emails collected yet.'}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}