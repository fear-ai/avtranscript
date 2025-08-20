import React from 'react'
import Layout from '../components/Layout'
import { VendorList } from '../components/VendorList'
import { vendors } from '../lib/data/vendors'

const IndexPage = () => (
  <Layout title="Transcript Platform - AI Transcription Services">
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Transcript Platform
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Discover and compare the best AI transcription services. Find the perfect solution for your audio and video transcription needs.
            </p>
            <div className="flex justify-center space-x-4">
              <div className="bg-blue-100 text-blue-800 px-4 py-2 rounded-full text-sm font-medium">
                {vendors.length} Services
              </div>
              <div className="bg-green-100 text-green-800 px-4 py-2 rounded-full text-sm font-medium">
                Real-time Updates
              </div>
              <div className="bg-purple-100 text-purple-800 px-4 py-2 rounded-full text-sm font-medium">
                Verified Data
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <VendorList vendors={vendors} />
      </div>
    </div>
  </Layout>
)

export default IndexPage
