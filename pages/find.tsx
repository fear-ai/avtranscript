import React, { useState } from 'react';
import { GetStaticProps } from 'next';
import { ComplexityProvider, useComplexity } from '../providers/ComplexityProvider';
import { VendorCardAdapted } from '../components/vendor/VendorCardAdapted';
import { ProfessionalSearch } from '../components/search/ProfessionalSearch';
import { VendorComparison } from '../components/comparison/VendorComparison';
import { Vendor } from '../lib/types/vendor';
import { vendors as allVendors } from '../lib/data/vendors';
import { Layout } from '../components/Layout';
import Link from 'next/link';

interface FindPageProps {
  vendors: Vendor[];
}

// Inner component that uses the complexity context
const FindPageContent: React.FC<FindPageProps> = ({ vendors: initialVendors }) => {
  const [filteredVendors, setFilteredVendors] = useState<Vendor[]>(initialVendors);
  const [comparisonList, setComparisonList] = useState<Vendor[]>([]);
  const [selectedVendor, setSelectedVendor] = useState<Vendor | null>(null);
  const [showComparison, setShowComparison] = useState<boolean>(false);
  
  // Use the enhanced complexity system
  const { 
    userType, 
    setUserType, 
    userLevel, 
    setUserLevel, 
    userTypeConfig,
    availableLevels,
    canUpgrade,
    canDowngrade,
    upgrade,
    downgrade
  } = useComplexity();

  const handleCompare = (vendor: Vendor) => {
    if (comparisonList.some(v => v.id === vendor.id)) {
      setComparisonList(comparisonList.filter(v => v.id !== vendor.id));
    } else if (comparisonList.length < 3) {
      setComparisonList([...comparisonList, vendor]);
    }
  };

  const handleSelect = (vendor: Vendor) => {
    setSelectedVendor(vendor);
  };

  const clearComparison = () => {
    setComparisonList([]);
  };

  const removeFromComparison = (vendorId: string) => {
    setComparisonList(comparisonList.filter(v => v.id !== vendorId));
  };

  return (
    <Layout>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-50 to-indigo-100 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Find Your Perfect
            <span className="text-blue-600"> Audio Video Transcription Service</span>
          </h1>
          <p className="text-lg text-gray-600 mb-6 max-w-3xl mx-auto">
            Discover and compare the best transcription services for your needs. 
            From amateur creators to enterprise businesses, we help you make informed decisions.
          </p>
          
          {/* User Type and Complexity Controls */}
          <div className="flex items-center justify-center space-x-8 mb-8">
            {/* User Type Selector */}
            <div className="flex bg-gray-100 rounded-lg p-1">
              {(['amateur', 'professional', 'agency'] as const).map((type) => (
                <button
                  key={type}
                  onClick={() => setUserType(type)}
                  className={`px-3 py-1 text-sm font-medium rounded-md transition-colors ${
                    userType === type
                      ? 'bg-white text-blue-600 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  {type.charAt(0).toUpperCase() + type.slice(1)}
                </button>
              ))}
            </div>
            
            {/* Detail Level Controls */}
            <div className="flex items-center space-x-2 bg-gray-100 rounded-lg p-1">
              <span className="text-xs text-gray-500 px-2 py-1">
                Detail: {userLevel.charAt(0).toUpperCase() + userLevel.slice(1)}
              </span>
              
              {canDowngrade && (
                <button 
                  onClick={downgrade}
                  className="text-xs text-gray-400 hover:text-gray-600 px-1 py-1"
                  title="Show less detail"
                >
                  −
                </button>
              )}
              
              {canUpgrade && (
                <button 
                  onClick={upgrade}
                  className="text-xs text-gray-400 hover:text-gray-600 px-1 py-1"
                  title="Show more detail"
                >
                  +
                </button>
              )}
            </div>
          </div>
          
          {/* User Type Benefits - Same design as Homepage */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Link href="#search" className="group">
              <div className={`p-6 rounded-lg ${
                userType === 'amateur' 
                  ? 'bg-blue-50 border-2 border-blue-200' 
                  : 'bg-blue-50'
              } hover:shadow-xl transition-all duration-200 hover:-translate-y-1 cursor-pointer`}>
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-blue-200 transition-colors">
                  <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path>
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">Amateur Creator</h3>
                <div className="text-2xl font-bold text-blue-600 mb-3">Free</div>
                <p className="text-gray-600 mb-4 text-sm">Perfect for beginners and hobbyists. Simple pricing, easy-to-use interfaces, and basic features to get you started.</p>
                <ul className="text-left text-gray-600 mb-4 space-y-1 text-sm">
                  <li className="flex items-center">
                    <svg className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path>
                    </svg>
                    Free tier emphasis
                  </li>
                  <li className="flex items-center">
                    <svg className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path>
                    </svg>
                    Simple interfaces
                  </li>
                  <li className="flex items-center">
                    <svg className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path>
                    </svg>
                    Basic features
                  </li>
                </ul>
              </div>
            </Link>
            
            <Link href="#search" className="group">
              <div className={`p-6 rounded-lg ${
                userType === 'professional' 
                  ? 'bg-green-50 border-2 border-green-200' 
                  : 'bg-green-50'
              } hover:shadow-xl transition-all duration-200 hover:-translate-y-1 cursor-pointer`}>
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-green-200 transition-colors">
                  <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-green-600 transition-colors">Pro</h3>
                <div className="text-2xl font-bold text-green-600 mb-3">Professional</div>
                <p className="text-gray-600 mb-4 text-sm">Built for professionals who need reliability and advanced features. Integration-ready with workflow automation capabilities.</p>
                <ul className="text-left text-gray-600 mb-4 space-y-1 text-sm">
                  <li className="flex items-center">
                    <svg className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path>
                    </svg>
                    Cheapest paid options
                  </li>
                  <li className="flex items-center">
                    <svg className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path>
                    </svg>
                    Integration ready
                  </li>
                  <li className="flex items-center">
                    <svg className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path>
                    </svg>
                    Workflow automation
                  </li>
                </ul>
              </div>
            </Link>
            
            <Link href="#search" className="group">
              <div className={`p-6 rounded-lg ${
                userType === 'agency' 
                  ? 'bg-purple-50 border-2 border-purple-200' 
                  : 'bg-purple-50'
              } hover:shadow-xl transition-all duration-200 hover:-translate-y-1 cursor-pointer`}>
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-purple-200 transition-colors">
                  <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-purple-600 transition-colors">Agency & Business</h3>
                <div className="text-2xl font-bold text-purple-600 mb-3">Enterprise</div>
                <p className="text-gray-600 mb-4 text-sm">Enterprise-grade solutions for agencies and businesses. White-label options, volume pricing, and advanced security.</p>
                <ul className="text-left text-gray-600 mb-4 space-y-1 text-sm">
                  <li className="flex items-center">
                    <svg className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path>
                    </svg>
                    More expensive tiers
                  </li>
                  <li className="flex items-center">
                    <svg className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path>
                    </svg>
                    White-label options
                  </li>
                  <li className="flex items-center">
                    <svg className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path>
                    </svg>
                    Volume pricing
                  </li>
                </ul>
              </div>
            </Link>
          </div>

          {/* Service count and optimization message - Improved layout */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center space-x-6 text-sm text-gray-600 bg-white rounded-full px-6 py-3 shadow-sm">
              <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full font-medium">
                {initialVendors.length} Services Available
              </span>
              <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full font-medium">
                Real-time Data
              </span>
              <span className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full font-medium">
                {userTypeConfig.displayName} Focus
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Main content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-8">
          {/* Search and filters */}
          <div id="search">
            <ProfessionalSearch
              vendors={initialVendors}
              onResultsChange={setFilteredVendors}
            />
          </div>

          {/* Service count and optimization message */}
          <div className="flex items-center justify-between text-sm text-gray-600">
            <span>Showing {filteredVendors.length} of {initialVendors.length} services</span>
            <span>Optimized for {userType} creators • {userLevel} complexity</span>
          </div>

          {/* Vendor list */}
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900">Transcription Services</h2>
              <div className="text-sm text-gray-500">Showing {filteredVendors.length} services</div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredVendors.map(vendor => (
                <VendorCardAdapted
                  key={vendor.id}
                  vendor={vendor}
                  onCompare={handleCompare}
                  onSelect={handleSelect}
                />
              ))}
            </div>
          </div>

          {/* Comparison Section */}
          {comparisonList.length > 0 && (
            <div id="compare" className="bg-white rounded-lg shadow-sm border p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Compare Services</h3>
                <div className="flex items-center space-x-4">
                  <span className="text-sm text-gray-600">
                    {comparisonList.length} selected for comparison
                  </span>
                  <button
                    onClick={() => setShowComparison(true)}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                  >
                    Compare Now
                  </button>
                  <button
                    onClick={clearComparison}
                    className="text-sm text-gray-500 hover:text-gray-700"
                  >
                    Clear All
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Professional Creator Insights */}
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">{userTypeConfig.displayName} Insights</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600 mb-2">
                  {initialVendors.filter(v => v.capabilities?.apiIntegration).length}
                </div>
                <div className="text-sm text-gray-600">Services with API Integration</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600 mb-2">
                  {initialVendors.filter(v => v.capabilities?.realTimeProcessing).length}
                </div>
                <div className="text-sm text-gray-600">Real-time Processing Available</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600 mb-2">
                  {Math.round(initialVendors.reduce((sum, v) => sum + (v.confidence || 0), 0) / initialVendors.length)}%
                </div>
                <div className="text-sm text-gray-600">Average Data Confidence</div>
              </div>
            </div>
          </div>

          {/* How This Platform Helps Professional Creators */}
          <div id="learn" className="bg-white rounded-lg shadow-sm border p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">How This Platform Helps {userTypeConfig.displayName}s</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                  <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <h4 className="font-medium text-gray-900 mb-2">Smart Discovery</h4>
                <p className="text-sm text-gray-600">
                  Find services optimized for {userType} needs with intelligent filtering and relevance scoring.
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
                  Compare services side-by-side with {userType}-focused metrics like API access, accuracy, and workflow integration.
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
                  Experience adapts to your device and needs with complexity levels from basic to advanced {userType} features.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Comparison Modal */}
      <VendorComparison
        vendors={comparisonList}
        isOpen={showComparison}
        onClose={() => setShowComparison(false)}
        onRemoveVendor={removeFromComparison}
      />
    </Layout>
  );
};

// Wrapper component that provides the complexity context
const FindPage: React.FC<FindPageProps> = (props) => {
  return (
    <ComplexityProvider initialLevel="mid" initialUserType="professional" context="desktop">
              <FindPageContent {...props} />
    </ComplexityProvider>
  );
};

export const getStaticProps: GetStaticProps<FindPageProps> = async () => {
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
