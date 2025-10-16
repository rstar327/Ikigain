import { useState, useEffect } from 'react';

export default function AdminEmailsDebug() {
  console.log('🔍 DEBUG COMPONENT LOADED - NEW VERSION');
  const [rawData, setRawData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log('=== FETCHING DATA ===');
        const response = await fetch('/api/collected-emails');
        console.log('Response:', response);
        
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}`);
        }
        
        const data = await response.json();
        console.log('Raw data:', data);
        console.log('Data type:', typeof data);
        console.log('Is array:', Array.isArray(data));
        console.log('Data length:', data?.length);
        
        setRawData(data);
        setLoading(false);
      } catch (err) {
        console.error('Error:', err);
        setError(err instanceof Error ? err.message : 'Unknown error');
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);

  if (loading) return <div className="p-8">Loading...</div>;
  if (error) return <div className="p-8 text-red-500">Error: {error}</div>;

  const emails = Array.isArray(rawData) ? rawData : [];
  const realEmails = emails.filter(e => e.email && !e.email.includes('@example.com'));
  const todayEmails = emails.filter(e => {
    const date = new Date(e.created_at);
    const today = new Date();
    return date.toDateString() === today.toDateString();
  });

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-red-600">🔍 EMAIL DEBUG DASHBOARD - LIVE DATA v2</h1>
      
      <div className="bg-gray-100 p-6 rounded-lg mb-8">
        <h2 className="text-xl font-bold mb-4">Debug Information</h2>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p><strong>Total Raw Records:</strong> {emails.length}</p>
            <p><strong>Real Emails:</strong> {realEmails.length}</p>
            <p><strong>Today's Emails:</strong> {todayEmails.length}</p>
            <p><strong>Data Type:</strong> {typeof rawData}</p>
          </div>
          <div>
            <p><strong>First Email:</strong> {emails[0]?.email || 'None'}</p>
            <p><strong>Recent Email:</strong> {emails.find(e => e.email === 'cindytradellc@gmail.com') ? 'Found' : 'Not Found'}</p>
            <p><strong>API Status:</strong> Working</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="font-semibold text-gray-600">Total Emails</h3>
          <p className="text-3xl font-bold text-blue-600">{emails.length}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="font-semibold text-gray-600">Real Users</h3>
          <p className="text-3xl font-bold text-green-600">{realEmails.length}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="font-semibold text-gray-600">Today</h3>
          <p className="text-3xl font-bold text-orange-600">{todayEmails.length}</p>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow">
        <div className="p-6">
          <h2 className="text-xl font-bold mb-4">All Collected Emails ({emails.length})</h2>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-50">
                  <th className="border p-3 text-left">Email</th>
                  <th className="border p-3 text-left">Date</th>
                  <th className="border p-3 text-left">Status</th>
                  <th className="border p-3 text-left">Tier</th>
                </tr>
              </thead>
              <tbody>
                {emails.map((email, index) => (
                  <tr key={email.id || index} className={index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                    <td className="border p-3 font-medium">{email.email}</td>
                    <td className="border p-3">{new Date(email.created_at).toLocaleDateString()}</td>
                    <td className="border p-3">
                      <span className={`px-2 py-1 rounded text-xs ${
                        email.is_completed ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {email.is_completed ? 'Complete' : 'Incomplete'}
                      </span>
                    </td>
                    <td className="border p-3">{email.premium_tier || 'Free'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div className="mt-8 p-4 bg-blue-50 rounded-lg">
        <h3 className="font-bold text-blue-800 mb-2">Key Emails Found:</h3>
        <ul className="text-blue-700">
          <li>• cindytradellc@gmail.com: {emails.find(e => e.email === 'cindytradellc@gmail.com') ? '✅ Found' : '❌ Not Found'}</li>
          <li>• baltscandlv@gmail.com: {emails.find(e => e.email === 'baltscandlv@gmail.com') ? '✅ Found' : '❌ Not Found'}</li>
        </ul>
      </div>
    </div>
  );
}