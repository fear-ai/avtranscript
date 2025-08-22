import React from 'react';
import Link from 'next/link';
import { Layout } from '../components/Layout';
            
const TermsPage: React.FC = () => {
  return (
    <Layout>
      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-sm border p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Terms of Service</h1>
          
          <div className="prose prose-gray max-w-none">
            <p className="text-gray-600 mb-6">
              Last updated: {new Date().toLocaleDateString()}
            </p>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">1. Acceptance of Terms</h2>
              <p className="text-gray-700 mb-4">
                By accessing and using AVTran, you accept and agree to be bound by the terms and provision of this agreement.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">2. Description of Service</h2>
              <p className="text-gray-700 mb-4">
                AVTran is a directory and comparison platform for transcription services. We provide information about various 
                transcription service providers to help users make informed decisions.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">3. User Responsibilities</h2>
              <p className="text-gray-700 mb-4">
                Users are responsible for:
              </p>
              <ul className="list-disc pl-6 text-gray-700 mb-4">
                <li>Providing accurate information when using our services</li>
                <li>Respecting the intellectual property rights of others</li>
                <li>Not using our service for any unlawful purpose</li>
                <li>Verifying information before making decisions</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">4. Service Information</h2>
              <p className="text-gray-700 mb-4">
                While we strive to provide accurate and up-to-date information about transcription services, we cannot guarantee 
                the accuracy, completeness, or timeliness of any information. Users should verify all information directly with 
                service providers before making decisions.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">5. Limitation of Liability</h2>
              <p className="text-gray-700 mb-4">
                AVTran is not liable for any damages arising from the use of our service or the information provided. 
                We are not responsible for the quality, reliability, or performance of any transcription services listed on our platform.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">6. Changes to Terms</h2>
              <p className="text-gray-700 mb-4">
                We reserve the right to modify these terms at any time. Changes will be effective immediately upon posting. 
                Continued use of the service constitutes acceptance of the modified terms.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">7. Contact Information</h2>
              <p className="text-gray-700 mb-4">
                If you have any questions about these Terms of Service, please contact us through our support channels.
              </p>
            </section>
          </div>
        </div>
      </main>
    </Layout>
  );
};

export default TermsPage;
