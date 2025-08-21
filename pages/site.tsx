import React, { useState } from 'react';
import { GetStaticProps } from 'next';
import { ComplexityProvider } from '../providers/ComplexityProvider';
import { VendorCardAdapted } from '../components/vendor/VendorCardAdapted';
import { ProfessionalSearch } from '../components/search/ProfessionalSearch';
import { VendorComparison } from '../components/comparison/VendorComparison';
import { Vendor } from '../lib/types/vendor';
import { vendors as allVendors } from '../lib/data/vendors';

interface SitePageProps {
  vendors: Vendor[];
}

const SitePage: React.FC<SitePageProps> = ({ vendors: initialVendors }) => {
  const [filteredVendors, setFilteredVendors] = useState<Vendor[]>(initialVendors);
  const [comparisonList, setComparisonList] = useState<Vendor[]>([]);
  const [selectedVendor, setSelectedVendor] = useState<Vendor | null>(null);
  const [showComparison, setShowComparison] = useState<boolean>(false);

  const handleCompare = (vendor: Vendor) => {
    if (comparisonList.some(v => v.id === vendor.id)) {
      setComparisonList(prev => prev.filter(v => v.id !== vendor.id));
    } else if (comparisonList.length < 4) {
      setComparisonList(prev => [...prev, vendor]);
    }
  };

  const handleSelect = (vendor: Vendor) => {
    setSelectedVendor(vendor);
  };

  const clearComparison = () => {
    setComparisonList([]);
    setShowComparison(false);
  };

  const removeFromComparison = (vendorId: string) => {
    setComparisonList(prev => prev.filter(v => v.id !== vendorId));
  };

  return (
    <ComplexityProvider initialLevel="mid" context="desktop">
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <header className="bg-white shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="py-6">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">
                    Professional Transcription Services
                  </h1>
                  <p className="mt-2 text-lg text-gray-600">
                    Find the perfect transcription solution for your professional content creation needs
                  </p>
                </div>
                
                <div className="flex items-center space-x-4">
                  {comparisonList.length > 0 && (
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-gray-600">
                        {comparisonList.length} selected for comparison
                      </span>
                      <button
                        onClick={() => setShowComparison(true)}
                        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                      >
                        Compare Services
                      </button>
                      <button
                        onClick={clearComparison}
                        className="text-sm text-gray-500 hover:text-gray-700"
                      >
                        Clear
                      </button>
                    </div>
                  )}
                  
                  <div className="flex space-x-2">
                    <div className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                      {initialVendors.length} Services
                    </div>
                    <div className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                      Real-time Data
                    </div>
                    <div className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm font-medium">
                      Professional Focus
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Main content */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="space-y-8">
            {/* Search and filters */}
            <ProfessionalSearch
              vendors={initialVendors}
              onResultsChange={setFilteredVendors}
            />

            {/* Results grid */}
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-900">
                  Transcription Services
                </h2>
                <div className="text-sm text-gray-500">
                  Showing {filteredVendors.length} services
                </div>
              </div>

              {filteredVendors.length === 0 ? (
                <div className="text-center py-12">
                  <div className="w-24 h-24 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                    <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.34 0-4.47.58-6.322 1.582C3.94 17.334 3 18.48 3 19.875V21h18v-1.125c0-1.395-.94-2.54-2.678-3.293z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    No services found
                  </h3>
                  <p className="text-gray-500 mb-4">
                    Try adjusting your search criteria or filters
                  </p>
                  <button 
                    onClick={() => setFilteredVendors(initialVendors)}
                    className="text-blue-600 hover:text-blue-800 font-medium"
                  >
                    Reset filters
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredVendors.map((vendor) => (
                    <VendorCardAdapted
                      key={vendor.id}
                      vendor={vendor}
                      onCompare={handleCompare}
                      onSelect={handleSelect}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Professional insights */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Professional Creator Insights
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600 mb-2">
                    {initialVendors.filter(v => v.capabilities?.apiIntegration).length}
                  </div>
                  <div className="text-sm text-gray-600">
                    Services with API Integration
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600 mb-2">
                    {initialVendors.filter(v => v.capabilities?.realTimeProcessing).length}
                  </div>
                  <div className="text-sm text-gray-600">
                    Real-time Processing Available
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600 mb-2">
                    {Math.round(initialVendors.reduce((acc, v) => acc + v.confidence, 0) / initialVendors.length)}%
                  </div>
                  <div className="text-sm text-gray-600">
                    Average Data Confidence
                  </div>
                </div>
              </div>
            </div>

            {/* How it works */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                How This Platform Helps Professional Creators
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                    <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                  <h4 className="font-medium text-gray-900 mb-2">Smart Discovery</h4>
                  <p className="text-sm text-gray-600">
                    Find services optimized for professional content creation with intelligent filtering and relevance scoring.
                  </p>
                </div>
                <div>
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                    <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 00-2-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                  </div>
                  <h4 className="font-medium text-gray-900 mb-2">Detailed Comparison</h4>
                  <p className="text-sm text-gray-600">
                    Compare services side-by-side with professional-focused metrics like API access, accuracy, and workflow integration.
                  </p>
                </div>
                <div>
                  <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                    <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <h4 className="font-medium text-gray-900 mb-2">Progressive Enhancement</h4>
                  <p className="text-sm text-gray-600">
                    Experience adapts to your device and needs with complexity levels from basic to advanced professional features.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </main>

        {/* Footer */}
        <footer className="bg-white border-t mt-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="text-center text-sm text-gray-500">
              <p>
                Professional transcription service directory • Data updated regularly • 
                Built with progressive enhancement for professional creators
              </p>
            </div>
          </div>
        </footer>

        {/* Comparison Modal */}
        <VendorComparison
          vendors={comparisonList}
          isOpen={showComparison}
          onClose={() => setShowComparison(false)}
          onRemoveVendor={removeFromComparison}
        />
      </div>
    </ComplexityProvider>
  );
};

export const getStaticProps: GetStaticProps<SitePageProps> = async () => {
  // Filter for active, professional-focused vendors
  const professionalVendors = allVendors
    .filter(vendor => 
      vendor.status === 'active' && 
      vendor.confidence >= 80 &&
      (vendor.targetMarket === 'professional' || 
       vendor.targetMarket === 'enterprise' ||
       vendor.tier === 'premium' ||
       vendor.tier === 'enterprise' ||
       vendor.category === 'selected' ||
       vendor.category === 'recommended')
    )
    .sort((a, b) => {
      // Professional relevance sorting
      const getScore = (v: Vendor) => {
        let score = 0;
        if (v.category === 'selected') score += 10;
        if (v.category === 'recommended') score += 5;
        if (v.targetMarket === 'professional') score += 8;
        if (v.tier === 'premium') score += 6;
        score += v.confidence / 10;
        score += (v.overallScore || 0) / 3;
        return score;
      };
      return getScore(b) - getScore(a);
    });

  return {
    props: {
      vendors: professionalVendors
    },
    revalidate: 3600 // Revalidate every hour
  };
};

export default SitePage;
