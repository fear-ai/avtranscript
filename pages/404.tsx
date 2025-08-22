import React from 'react';
import Link from 'next/link';
import { Layout } from '../components/Layout';

const Custom404: React.FC = () => {
  return (
    <Layout>
      <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full text-center">
          {/* 404 Icon */}
          <div className="mb-8">
            <div className="mx-auto w-24 h-24 bg-red-100 rounded-full flex items-center justify-center">
              <span className="text-4xl font-bold text-red-600">404</span>
            </div>
          </div>

          {/* Error Message */}
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Page Not Found
          </h1>
          <p className="text-lg text-gray-600 mb-6">
            Page not found. It may have been moved or you entered the wrong URL.
          </p>

          {/* Helpful Links */}
          <div className="space-y-4 mb-8">
            <h2 className="text-lg font-semibold text-gray-900 mb-3">
              Quick navigation:
            </h2>
            <div className="grid grid-cols-1 gap-3">
              <Link 
                href="/" 
                className="block p-3 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors"
              >
                🏠 Home - Find transcription services
              </Link>
              <Link 
                href="/find" 
                className="block p-3 bg-green-50 text-green-700 rounded-lg hover:bg-green-100 transition-colors"
              >
                🔍 Find Services - Browse vendors
              </Link>
              <Link 
                href="/#learn" 
                className="block p-3 bg-purple-50 text-purple-700 rounded-lg hover:bg-purple-100 transition-colors"
              >
                📚 Learn More - About transcription
              </Link>
            </div>
          </div>

          {/* Search Suggestion */}
          <div className="bg-gray-100 rounded-lg p-4 mb-6">
            <p className="text-sm text-gray-600 mb-2">
              Looking for something specific?
            </p>
            <Link 
              href="/find" 
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
              </svg>
              Search Services
            </Link>
          </div>

          {/* Contact Info */}
          <div className="text-sm text-gray-500">
            <p>Still can't find what you're looking for?</p>
            <p className="mt-1">
              Try going back to the{' '}
              <Link href="/" className="text-blue-600 hover:underline">
                homepage
              </Link>
              {' '}or use the navigation menu above.
            </p>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Custom404;
