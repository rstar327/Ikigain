import React, { useState, useEffect } from 'react';

interface EmailData {
  id: number;
  email: string;
  created_at: string;
  is_completed: boolean;
  premium_tier: string | null;
}

export default function AdminEmailsWorking() {
  const [emails, setEmails] = useState<EmailData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchEmails();
  }, []);

  const fetchEmails = async () => {
    try {
      console.log('Fetching emails...');
      const response = await fetch('/api/collected-emails');
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('Received data:', data);
      console.log('Data type:', typeof data);
      console.log('Is array:', Array.isArray(data));
      
      if (Array.isArray(data)) {
        setEmails(data);
        console.log('Set emails to:', data);
      } else {
        console.error('API returned non-array data:', data);
        setError('Invalid data format received');
      }
    } catch (error) {
      console.error('Error fetching emails:', error);
      setError(error instanceof Error ? error.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString();
    } catch {
      return dateString;
    }
  };

  const todaysEmails = emails.filter(email => {
    try {
      const emailDate = new Date(email.created_at);
      const today = new Date();
      return emailDate.toDateString() === today.toDateString();
    } catch {
      return false;
    }
  });

  const realEmails = emails.filter(email => 
    email.email && !email.email.includes('@example.com')
  );

  console.log('Current render state:', {
    loading,
    error,
    emailsCount: emails.length,
    todaysCount: todaysEmails.length,
    realCount: realEmails.length
  });

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading emails...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          <strong>Error:</strong> {error}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-gray-800">Email Collection Dashboard</h1>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-blue-800 mb-2">Total Emails</h3>
          <p className="text-3xl font-bold text-blue-600">{emails.length}</p>
        </div>
        
        <div className="bg-green-50 border border-green-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-green-800 mb-2">Real Users</h3>
          <p className="text-3xl font-bold text-green-600">{realEmails.length}</p>
        </div>
        
        <div className="bg-orange-50 border border-orange-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-orange-800 mb-2">Today</h3>
          <p className="text-3xl font-bold text-orange-600">{todaysEmails.length}</p>
        </div>
      </div>

      {/* Debug Info */}
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-6">
        <h3 className="font-semibold text-gray-800 mb-2">Debug Information:</h3>
        <ul className="text-sm text-gray-600 space-y-1">
          <li>Loading: {loading ? 'Yes' : 'No'}</li>
          <li>Error: {error || 'None'}</li>
          <li>Total emails in state: {emails.length}</li>
          <li>API endpoint: /api/collected-emails</li>
          <li>cindytradellc@gmail.com found: {emails.some(e => e.email === 'cindytradellc@gmail.com') ? 'Yes' : 'No'}</li>
          <li>baltscandlv@gmail.com found: {emails.some(e => e.email === 'baltscandlv@gmail.com') ? 'Yes' : 'No'}</li>
        </ul>
      </div>

      {/* Email Table */}
      <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-800">All Emails ({emails.length})</h2>
        </div>
        
        {emails.length === 0 ? (
          <div className="px-6 py-8 text-center text-gray-500">
            No emails found
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tier</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {emails.map((email) => (
                  <tr key={email.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{email.email}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">{formatDate(email.created_at)}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        email.is_completed 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {email.is_completed ? 'Complete' : 'Incomplete'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm text-gray-500">{email.premium_tier || 'Free'}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}