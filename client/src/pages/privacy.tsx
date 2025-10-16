import Navigation from "@/components/Navigation";
import SEO from "@/components/SEO";

export default function Privacy() {
  return (
    <div className="min-h-screen bg-background">
      <SEO
        title="Privacy Policy | Ikigain.org"
        description="Read our privacy policy to understand how we protect your personal information and data when using our Ikigai assessment platform."
        canonical="https://www.ikigain.org/privacy"
      />
      <Navigation />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">Privacy Policy</h1>
        
        <div className="prose prose-lg max-w-none">
          <p className="text-gray-600 mb-6">
            <strong>Last updated:</strong> July 15, 2025
          </p>
          
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">1. Information We Collect</h2>
          <p className="text-gray-700 mb-4">
            We collect information you provide directly to us, such as when you:
          </p>
          <ul className="list-disc pl-6 mb-6 text-gray-700">
            <li>Take our Ikigai assessment</li>
            <li>Create an account</li>
            <li>Subscribe to our newsletter</li>
            <li>Contact us for support</li>
          </ul>
          
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">2. How We Use Your Information</h2>
          <p className="text-gray-700 mb-4">
            We use the information we collect to:
          </p>
          <ul className="list-disc pl-6 mb-6 text-gray-700">
            <li>Provide and improve our services</li>
            <li>Generate your personalized Ikigai results</li>
            <li>Process payments for premium features</li>
            <li>Send you updates and educational content</li>
            <li>Respond to your inquiries</li>
          </ul>
          
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">3. Information Sharing</h2>
          <p className="text-gray-700 mb-6">
            We do not sell, trade, or otherwise transfer your personal information to third parties without your consent, except as described in this privacy policy. We may share information with trusted service providers who assist us in operating our website and conducting our business.
          </p>
          
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">4. Data Security</h2>
          <p className="text-gray-700 mb-6">
            We implement appropriate security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. However, no method of transmission over the internet is 100% secure.
          </p>
          
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">5. Your Rights</h2>
          <p className="text-gray-700 mb-4">
            You have the right to:
          </p>
          <ul className="list-disc pl-6 mb-6 text-gray-700">
            <li>Access your personal information</li>
            <li>Correct inaccurate information</li>
            <li>Delete your personal information</li>
            <li>Opt out of marketing communications</li>
          </ul>
          
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">6. Cookies</h2>
          <p className="text-gray-700 mb-6">
            We use cookies to enhance your experience on our website. You can choose to disable cookies through your browser settings, but this may affect the functionality of our site.
          </p>
          
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">7. Contact Us</h2>
          <p className="text-gray-700 mb-6">
            If you have any questions about this privacy policy, please contact us at:
          </p>
          <p className="text-gray-700">
            Email: hello@ikigain.org
          </p>
        </div>
      </div>
    </div>
  );
}