import React, { useState } from 'react';

export default function ApiTest() {
  const [result, setResult] = useState<string>('');
  const [loading, setLoading] = useState(false);

  const testAPI = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/collected-emails');
      const data = await response.json();
      setResult(JSON.stringify(data, null, 2));
    } catch (error) {
      setResult(`Error: ${error}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <h1 className="text-2xl font-bold mb-4">API Test</h1>
      <button 
        onClick={testAPI}
        disabled={loading}
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:bg-gray-400"
      >
        {loading ? 'Testing...' : 'Test API'}
      </button>
      
      <div className="mt-4">
        <h2 className="text-lg font-semibold mb-2">Result:</h2>
        <pre className="bg-white p-4 rounded border overflow-auto max-h-96 text-sm">
          {result || 'Click "Test API" to test the endpoint'}
        </pre>
      </div>
    </div>
  );
}