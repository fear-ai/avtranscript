import React from 'react';
import Link from 'next/link';
import { Layout } from '../components/Layout';
            
const PrivacyPage: React.FC = () => {
  return (
    <Layout>
      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-sm border p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Privacy Policy</h1>
          
          <div className="prose prose-gray max-w-none">
            <p className="text-gray-600 mb-6">
              Last updated: {new Date().toLocaleDateString()}
            </p>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">1. Information We Collect</h2>
              <p className="text-gray-700 mb-4">
                AVTran is committed to protecting your privacy. We want to be clear about our data practices:
              </p>
              <ul className="list-disc pl-6 text-gray-700 mb-4">
                <li><strong>We do NOT collect personal user information</strong></li>
                <li><strong>We do NOT share any user data</strong></li>
                <li><strong>We do NOT use cookies for tracking</strong></li>
                <li><strong>We do NOT store user preferences or history</strong></li>
              </ul>
              <p className="text-gray-700 mb-4">
                Our platform is designed to be completely anonymous and privacy-focused.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">2. What We Do Collect (Non-Personal)</h2>
              <p className="text-gray-700 mb-4">
                The only information we may collect is:
              </p>
              <ul className="list-disc pl-6 text-gray-700 mb-4">
                <li>Aggregate usage statistics (anonymous, no individual identification)</li>
                <li>Technical information necessary for website functionality</li>
                <li>Service provider information (publicly available data)</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">3. How We Use Information</h2>
              <p className="text-gray-700 mb-4">
                Any non-personal information we collect is used solely for:
              </p>
              <ul className="list-disc pl-6 text-gray-700 mb-4">
                <li>Improving our service directory</li>
                <li>Ensuring website functionality</li>
                <li>Providing accurate service information</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">4. Data Sharing</h2>
              <p className="text-gray-700 mb-4">
                <strong>We do not share, sell, or rent any user information to third parties.</strong> Our platform operates 
                as a directory service without any user data collection or sharing mechanisms.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">5. Third-Party Services</h2>
              <p className="text-gray-700 mb-4">
                While we provide information about third-party transcription services, we have no control over their privacy 
                practices. Users should review the privacy policies of any services they choose to use.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">6. Data Security</h2>
              <p className="text-gray-700 mb-4">
                Since we don't collect personal user data, there is no personal information to secure. Our platform 
                is designed with privacy-by-design principles.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">7. Your Rights</h2>
              <p className="text-gray-700 mb-4">
                Since we don't collect personal information, there is no personal data to access, modify, or delete. 
                You can use our platform with complete confidence that your privacy is protected.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">8. Changes to This Policy</h2>
              <p className="text-gray-700 mb-4">
                We may update this privacy policy from time to time. Any changes will be posted on this page, and 
                the "Last updated" date will be revised accordingly.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">9. Contact Information</h2>
              <p className="text-gray-700 mb-4">
                If you have any questions about this Privacy Policy or our privacy practices, please contact us 
                through our support channels.
              </p>
            </section>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-8">
              <h3 className="text-lg font-semibold text-blue-900 mb-2">Privacy Commitment</h3>
              <p className="text-blue-800 text-sm">
                At AVTran, we believe privacy is a fundamental right. Our platform is built to provide valuable 
                information without compromising your personal data. You can browse, search, and compare services 
                with complete anonymity.
              </p>
            </div>
          </div>
        </div>
      </main>
    </Layout>
  );
};

export default PrivacyPage;
