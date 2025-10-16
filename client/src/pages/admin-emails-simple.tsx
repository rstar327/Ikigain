import React, { useState } from 'react';

export default function AdminEmailsSimple() {
  const [emails, setEmails] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState('Ready to fetch');

  const fetchEmails = async () => {
    setLoading(true);
    setStatus('Fetching emails...');
    
    try {
      const response = await fetch('/api/collected-emails');
      const data = await response.json();
      
      setEmails(data);
      setStatus(`✅ Loaded ${data.length} emails successfully`);
    } catch (error) {
      setStatus(`❌ Error: ${error}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <h1 className="text-3xl font-bold mb-6">Simple Email Admin</h1>
      
      <div className="bg-white p-6 rounded-lg shadow mb-6">
        <div className="flex items-center gap-4 mb-4">
          <button 
            onClick={fetchEmails}
            disabled={loading}
            className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600 disabled:bg-gray-400"
          >
            {loading ? 'Loading...' : 'Fetch Emails'}
          </button>
          <span className="text-sm text-gray-600">{status}</span>
        </div>
        
        <div className="text-lg font-semibold mb-2">
          Total Emails: {emails.length}
        </div>
        
        <div className="text-sm text-gray-600 mb-4">
          Key Emails Status:
          <ul className="ml-4 mt-2">
            <li>cindytradellc@gmail.com: {emails.some(e => e.email === 'cindytradellc@gmail.com') ? '✅ Found' : '❌ Not Found'}</li>
            <li>baltscandlv@gmail.com: {emails.some(e => e.email === 'baltscandlv@gmail.com') ? '✅ Found' : '❌ Not Found'}</li>
          </ul>
        </div>
      </div>
      
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="px-6 py-4 bg-gray-50 border-b">
          <h2 className="text-xl font-semibold">Email List ({emails.length})</h2>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tier</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {emails.map((email) => (
                <tr key={email.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {email.email}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(email.created_at).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                      email.is_completed ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {email.is_completed ? 'Complete' : 'Incomplete'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {email.premium_tier || 'Free'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}