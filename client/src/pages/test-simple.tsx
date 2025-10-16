export default function TestSimple() {
  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-gray-900">Simple Test Page</h1>
        <p className="text-lg text-gray-600 mb-4">
          This is a simple test page to verify routing is working.
        </p>
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Test Information</h2>
          <ul className="space-y-2 text-gray-700">
            <li>• Route: /test-simple</li>
            <li>• Component: TestSimple</li>
            <li>• Status: Working</li>
          </ul>
        </div>
      </div>
    </div>
  );
}