import { Switch, Route } from "wouter";

function Landing() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
      <div className="max-w-4xl mx-auto px-4 text-center">
        <h1 className="text-5xl font-bold text-gray-900 mb-6">
          Discover Your Ikigai
        </h1>
        <p className="text-xl text-gray-600 mb-8">
          Find your life's purpose through our comprehensive personality assessment
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold mb-4">Free Type Test</h3>
            <p className="text-gray-600 mb-4">Quick 12-question assessment</p>
            <button className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700">
              Start Free Test
            </button>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold mb-4">Full Ikigai Test</h3>
            <p className="text-gray-600 mb-4">Comprehensive 18-question analysis</p>
            <button className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700">
              Take Full Test
            </button>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold mb-4">Premium Analysis</h3>
            <p className="text-gray-600 mb-4">Detailed career recommendations</p>
            <button className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700">
              Learn More
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">404 - Page Not Found</h1>
        <p className="text-gray-600">The page you're looking for doesn't exist.</p>
      </div>
    </div>
  )
}

export default function App() {
  return (
    <div className="min-h-screen">
      <Switch>
        <Route path="/"><Landing /></Route>
        <Route path="/home"><Landing /></Route>
        <Route><NotFound /></Route>
      </Switch>
    </div>
  );
}