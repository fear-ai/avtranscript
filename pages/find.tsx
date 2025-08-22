import React, { useState, useCallback } from 'react';
import { GetStaticProps } from 'next';
import { ComplexityProvider, useComplexity } from '../providers/ComplexityProvider';
import { VendorCard } from '../components/vendor/VendorCard';
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

  // Memoized click handlers for type cards
  const handleAmateurClick = useCallback(() => {
    console.log('Amateur card clicked');
    setUserType('amateur');
  }, [setUserType]);

  const handleProfessionalClick = useCallback(() => {
    console.log('Professional card clicked');
    setUserType('professional');
  }, [setUserType]);

  const handleAgencyClick = useCallback(() => {
    console.log('Agency card clicked');
    setUserType('agency');
  }, [setUserType]);

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
            From amateur creators to enterprise businesses, we help you make informed decisions.
          </p>
        </div>
      </section>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-8">
          {/* User Type Cards Section - Above the fold */}
          <div className="py-8">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Designed for Every Creator</h2>
            </div>
            
            <div className="grid md:grid-cols-3 gap-6 mb-8">
              {/* Amateur Card */}
              <button 
                onClick={handleAmateurClick}
                className={`w-full p-6 rounded-lg transition-all duration-200 hover:-translate-y-1 cursor-pointer text-left ${
                  userType === 'amateur' 
                    ? 'bg-blue-100 shadow-xl border-2 border-blue-300' 
                    : 'bg-blue-50 hover:shadow-xl'
                }`}
              >
                <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 transition-colors ${
                  userType === 'amateur' ? 'bg-blue-200' : 'bg-blue-100 group-hover:bg-blue-200'
                }`}>
                  <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                </div>
                <h3 className={`text-2xl font-bold mb-2 text-center transition-colors ${
                  userType === 'amateur' ? 'text-blue-700' : 'text-gray-900 group-hover:text-blue-600'
                }`}>Amateur</h3>
                <div className="text-lg font-semibold text-blue-600 mb-3 text-center">Free</div>
                <p className="text-gray-600 mb-4 text-sm">Perfect for beginners and for amateur content creators. Transcribe your audio and video for free.</p>
                <ul className="text-left text-gray-600 mb-4 space-y-1 text-sm">
                  <li className="flex items-center">
                    <svg className="w-4 h-4 text-blue-500 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path>
                    </svg>
                    Free tier emphasis
                  </li>
                  <li className="flex items-center">
                    <svg className="w-4 h-4 text-blue-500 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path>
                    </svg>
                    No credit card required
                  </li>
                  <li className="flex items-center">
                    <svg className="w-4 h-4 text-blue-500 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path>
                    </svg>
                    Easy to use
                  </li>
                </ul>
              </button>

              {/* Professional Card */}
              <button 
                onClick={handleProfessionalClick}
                className={`w-full p-6 rounded-lg transition-all duration-200 hover:-translate-y-1 cursor-pointer text-left ${
                  userType === 'professional' 
                    ? 'bg-green-100 shadow-xl border-2 border-green-300' 
                    : 'bg-green-50 hover:shadow-xl'
                }`}
              >
                <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 transition-colors ${
                  userType === 'professional' ? 'bg-green-200' : 'bg-green-100 group-hover:bg-green-200'
                }`}>
                  <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                  </svg>
                </div>
                <h3 className={`text-2xl font-bold mb-2 text-center transition-colors ${
                  userType === 'professional' ? 'text-green-700' : 'text-gray-900 group-hover:text-green-600'
                }`}>Professional</h3>
                <div className="text-lg font-semibold text-green-600 mb-3 text-center">Plus</div>
                <p className="text-gray-600 mb-4 text-sm">You need reliability and advanced features. Integration-ready with workflow automation.</p>
                <ul className="text-left text-gray-600 mb-4 space-y-1 text-sm">
                  <li className="flex items-center">
                    <svg className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path>
                    </svg>
                    Economical options
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
              </button>

              {/* Agency Card */}
              <button 
                onClick={handleAgencyClick}
                className={`w-full p-6 rounded-lg transition-all duration-200 hover:-translate-y-1 cursor-pointer text-left ${
                  userType === 'agency' 
                    ? 'bg-purple-100 shadow-xl border-2 border-purple-300' 
                    : 'bg-purple-50 hover:shadow-xl'
                }`}
              >
                <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 transition-colors ${
                  userType === 'agency' ? 'bg-purple-200' : 'bg-purple-100 group-hover:bg-purple-200'
                }`}>
                  <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
                  </svg>
                </div>
                <h3 className={`text-2xl font-bold mb-2 text-center transition-colors ${
                  userType === 'agency' ? 'text-purple-700' : 'text-gray-900 group-hover:text-purple-600'
                }`}>Agency</h3>
                <div className="text-lg font-semibold text-purple-600 mb-3 text-center">Enterprise</div>
                <p className="text-gray-600 mb-4 text-sm">Business grade solution for content agencies and large organizations. Project management.</p>
                <ul className="text-left text-gray-600 mb-4 space-y-1 text-sm">
                  <li className="flex items-center">
                    <svg className="w-4 h-4 text-purple-500 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path>
                    </svg>
                    Business Tier
                  </li>
                  <li className="flex items-center">
                    <svg className="w-4 h-4 text-purple-500 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path>
                    </svg>
                    Team status
                  </li>
                  <li className="flex items-center">
                    <svg className="w-4 h-4 text-purple-500 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path>
                    </svg>
                    Priority support
                  </li>
                </ul>
              </button>
            </div>
          </div>

          {/* Vendor Cards Section - Below type cards with larger cards */}
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-500">
                For {userType.charAt(0).toUpperCase() + userType.slice(1)}
              </div>
              <div className="text-sm text-gray-500">
                Showing 4 of {initialVendors.length} services
              </div>
            </div>
            
            {/* Complexity Selection Widget - Centered between For Professional and Showing */}
            <div className="flex items-center justify-center space-x-2 mb-4">
              <span className="text-sm text-gray-500">Detail:</span>
              <div className="flex items-center space-x-2 bg-gray-100 rounded-lg p-1">
                <span className="text-xs text-gray-500 px-2 py-1">
                  {userLevel.charAt(0).toUpperCase() + userLevel.slice(1)}
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
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {filteredVendors.slice(0, 4).map(vendor => (
                <VendorCard
                  key={vendor.id}
                  vendor={vendor}
                  onCompare={handleCompare}
                  onSelect={handleSelect}
                />
              ))}
            </div>
          </div>

          {/* Same display below vendor cards */}
          <div className="flex items-center justify-between text-sm text-gray-500 mb-6">
            <div>
              For {userType.charAt(0).toUpperCase() + userType.slice(1)}
            </div>
            <div>
              Detail: {userLevel.charAt(0).toUpperCase() + userLevel.slice(1)}
            </div>
            <div>
              Showing 4 of {initialVendors.length} services
            </div>
          </div>

          {/* User Type Selector - Below vendor cards */}
          <div className="flex items-center justify-center space-x-8 mb-8">
            <div className="flex bg-gray-100 rounded-lg p-1">
              {(['amateur', 'professional', 'agency'] as const).map((type) => {
                const getTypeColors = (type: string) => {
                  switch (type) {
                    case 'amateur':
                      return userType === type ? 'bg-blue-100 text-blue-700' : 'text-blue-600 hover:text-blue-700';
                    case 'professional':
                      return userType === type ? 'bg-green-100 text-green-700' : 'text-green-600 hover:text-green-700';
                    case 'agency':
                      return userType === type ? 'bg-purple-100 text-purple-700' : 'text-purple-600 hover:text-purple-700';
                    default:
                      return 'text-gray-600 hover:text-gray-900';
                  }
                };
                
                return (
                  <button
                    key={type}
                    onClick={() => setUserType(type)}
                    className={`px-3 py-1 text-sm font-medium rounded-md transition-colors ${
                      userType === type
                        ? getTypeColors(type)
                        : getTypeColors(type)
                    }`}
                  >
                    {type.charAt(0).toUpperCase() + type.slice(1)}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Search Criteria Box - Moved below vendor cards */}
          <div id="search" className="bg-white rounded-lg shadow-sm border p-6 mb-8">
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Find {userType.charAt(0).toUpperCase() + userType.slice(1)} Transcription</h2>
              <div className="mb-4">
                <input type="text" placeholder="Search by name, features, or capabilities..." className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"/>
              </div>
              <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Service Tier</label>
                  <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 text-sm">
                    <option value="all">All Tiers</option>
                    <option value="premium">Premium</option>
                    <option value="enterprise">Enterprise</option>
                    <option value="mid-tier">Mid-tier</option>
                    <option value="entry-level">Entry-level</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                  <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 text-sm">
                    <option value="all">All Categories</option>
                    <option value="selected">Top Picks</option>
                    <option value="recommended">Recommended</option>
                    <option value="alternative">Alternatives</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Target Market</label>
                  <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 text-sm">
                    <option value="all">All Markets</option>
                    <option value="professional">Professional</option>
                    <option value="enterprise">Enterprise</option>
                    <option value="consumer">Consumer</option>
                    <option value="agency">Agency</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Sort By</label>
                  <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 text-sm">
                    <option value="relevance">{userType.charAt(0).toUpperCase() + userType.slice(1)} Relevance</option>
                    <option value="confidence">Data Confidence</option>
                    <option value="score">Overall Score</option>
                    <option value="name">Name (A-Z)</option>
                  </select>
                </div>
              </div>
              <div className="mt-4 pt-4 border-t">
                <h3 className="text-sm font-medium text-gray-700 mb-3">{userType.charAt(0).toUpperCase() + userType.slice(1)} Features</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <label className="flex items-center">
                    <input type="checkbox" className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"/>
                    <span className="ml-2 text-sm text-gray-700">API Integration</span>
                  </label>
                  <label className="flex items-center">
                    <input type="checkbox" className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"/>
                    <span className="ml-2 text-sm text-gray-700">Real-time Processing</span>
                  </label>
                  <div>
                    <label className="block text-sm text-gray-700 mb-1">Min. Confidence: 0%</label>
                    <input type="range" min="0" max="100" step="10" className="w-full"/>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                    <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 text-sm">
                      <option value="all">All Status</option>
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                      <option value="acquired">Acquired</option>
                    </select>
                  </div>
                </div>
              </div>
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
                  Find optimized for {userType} needs with intelligent filtering and relevance scoring.
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

          {/* Service Stats - Moved below "How this platform helps" and styled as plain text */}

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

export default FindPage;
