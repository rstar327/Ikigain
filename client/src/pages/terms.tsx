import Navigation from "@/components/Navigation";
import SEO from "@/components/SEO";

export default function Terms() {
  return (
    <div className="min-h-screen bg-background">
      <SEO
        title="Terms of Service | Ikigain.org"
        description="Read our terms of service to understand the rules and guidelines for using our Ikigai assessment platform and services."
        canonical="https://www.ikigain.org/terms"
      />
      <Navigation />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">Terms of Service</h1>
        
        <div className="prose prose-lg max-w-none">
          <p className="text-gray-600 mb-6">
            <strong>Last updated:</strong> July 15, 2025
          </p>
          
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">1. Acceptance of Terms</h2>
          <p className="text-gray-700 mb-6">
            By accessing and using Ikigain.org, you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by the above, please do not use this service.
          </p>
          
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">2. Use License</h2>
          <p className="text-gray-700 mb-4">
            Permission is granted to temporarily access the materials on Ikigain.org for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title, and under this license you may not:
          </p>
          <ul className="list-disc pl-6 mb-6 text-gray-700">
            <li>Modify or copy the materials</li>
            <li>Use the materials for any commercial purpose</li>
            <li>Attempt to reverse engineer any software</li>
            <li>Remove any copyright or other proprietary notations</li>
          </ul>
          
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">3. Assessment Results</h2>
          <p className="text-gray-700 mb-6">
            The Ikigai assessment results are provided for informational and educational purposes only. They are not intended to be a substitute for professional advice, diagnosis, or treatment. Always seek the advice of qualified professionals with any questions you may have regarding career or life decisions.
          </p>
          
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">4. Premium Services</h2>
          <p className="text-gray-700 mb-6">
            Premium features are available through subscription or one-time purchase. All payments are processed securely through Stripe. Refunds are available within 30 days of purchase, subject to our refund policy.
          </p>
          
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">5. User Accounts</h2>
          <p className="text-gray-700 mb-6">
            You are responsible for maintaining the confidentiality of your account information and for all activities that occur under your account. You agree to notify us immediately of any unauthorized use of your account.
          </p>
          
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">6. Disclaimer</h2>
          <p className="text-gray-700 mb-6">
            The materials on Ikigain.org are provided on an 'as is' basis. Ikigain.org makes no warranties, expressed or implied, and hereby disclaims and negates all other warranties including without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights.
          </p>
          
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">7. Limitations</h2>
          <p className="text-gray-700 mb-6">
            In no event shall Ikigain.org or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use the materials on Ikigain.org, even if Ikigain.org or an authorized representative has been notified orally or in writing of the possibility of such damage.
          </p>
          
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">8. Contact Information</h2>
          <p className="text-gray-700 mb-6">
            If you have any questions about these terms of service, please contact us at:
          </p>
          <p className="text-gray-700">
            Email: hello@ikigain.org
          </p>
        </div>
      </div>
    </div>
  );
}