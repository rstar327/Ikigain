import React, { useState, useEffect } from 'react';

export default function EmailsSimple() {
  const [emails, setEmails] = useState<any[]>([]);
  const [status, setStatus] = useState('Loading...');

  useEffect(() => {
    fetch('/api/collected-emails')
      .then(response => response.json())
      .then(data => {
        setEmails(data);
        setStatus(`✅ Loaded ${data.length} emails`);
      })
      .catch(error => {
        setStatus(`❌ Error: ${error.message}`);
      });
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <h1 className="text-3xl font-bold mb-4">Email Collection Dashboard</h1>
      
      <div className="bg-white p-6 rounded-lg shadow mb-6">
        <p className="text-lg mb-4">Status: {status}</p>
        <p className="text-2xl font-bold mb-4">Total Emails: {emails.length}</p>
        
        <div className="mb-4">
          <h3 className="text-lg font-semibold mb-2">Key Emails:</h3>
          <ul className="space-y-1">
            <li>cindytradellc@gmail.com: {emails.some(e => e.email === 'cindytradellc@gmail.com') ? '✅ Found' : '❌ Not Found'}</li>
            <li>baltscandlv@gmail.com: {emails.some(e => e.email === 'baltscandlv@gmail.com') ? '✅ Found' : '❌ Not Found'}</li>
          </ul>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left">Email</th>
              <th className="px-6 py-3 text-left">Date</th>
              <th className="px-6 py-3 text-left">Status</th>
              <th className="px-6 py-3 text-left">Tier</th>
            </tr>
          </thead>
          <tbody>
            {emails.map((email, index) => (
              <tr key={index} className="border-t">
                <td className="px-6 py-4">{email.email}</td>
                <td className="px-6 py-4">{new Date(email.created_at).toLocaleDateString()}</td>
                <td className="px-6 py-4">{email.is_completed ? 'Complete' : 'Incomplete'}</td>
                <td className="px-6 py-4">{email.premium_tier || 'Free'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}