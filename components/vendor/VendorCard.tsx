import React from 'react';
import { Vendor } from '../../lib/types/vendor';
import { useDisplayContext } from '../../hooks/context/useDisplayContext';
import { useComplexity } from '../../providers/ComplexityProvider';

interface VendorCardProps {
  vendor: Vendor;
  onCompare?: (vendor: Vendor) => void;
  onSelect?: (vendor: Vendor) => void;
}

export const VendorCard: React.FC<VendorCardProps> = ({ 
  vendor, 
  onCompare, 
  onSelect 
}) => {
  const { context, isMobile, isTablet } = useDisplayContext();
  const { userLevel, canUpgrade, canDowngrade, upgrade, downgrade, config } = useComplexity();

  // Get pricing display
  const getPricing = () => {
    if (vendor.pricing?.payPerUse?.aiPerMinute && vendor.pricing.payPerUse.aiPerMinute > 0) {
      return `$${vendor.pricing.payPerUse.aiPerMinute}/min`;
    }
    if (vendor.pricing?.plans && vendor.pricing.plans.length > 0) {
      const plan = vendor.pricing.plans[0];
      return plan.price ? `$${plan.price}/${plan.billingCycle}` : 'Contact Sales';
    }
    if (vendor.pricing?.freeTier?.minutes && vendor.pricing.freeTier.minutes > 0) {
      return `Free + ${vendor.pricing.freeTier.minutes}min`;
    }
    if (vendor.pricing?.freeTier?.hours && vendor.pricing.freeTier.hours > 0) {
      return `Free + ${vendor.pricing.freeTier.hours}h`;
    }
    // Show tier information instead of "Price Varies"
    if (vendor.tier) {
      const tierMap: Record<string, string> = {
        'free': 'Free',
        'basic': 'Basic Tier',
        'premium': 'Premium Tier',
        'enterprise': 'Enterprise Tier'
      };
      return tierMap[vendor.tier] || `${vendor.tier.charAt(0).toUpperCase() + vendor.tier.slice(1)} Tier`;
    }
    return 'Contact Sales';
  };

  // Get pricing subtitle
  const getPricingSubtitle = () => {
    if (vendor.pricing?.freeTier?.minutes && vendor.pricing.freeTier.minutes > 0) {
      return `${vendor.pricing.freeTier.minutes} free minutes`;
    }
    if (vendor.pricing?.freeTier?.hours && vendor.pricing.freeTier.hours > 0) {
      return `${vendor.pricing.freeTier.hours} free hours`;
    }
    if (vendor.pricing?.plans && vendor.pricing.plans.length > 0) {
      return `[${vendor.pricing.plans.length}] Plans available`;
    }
    return null;
  };

  // Get status badge color
  const getStatusColor = () => {
    switch (vendor.status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'inactive': return 'bg-gray-100 text-gray-800';
      case 'acquired': return 'bg-blue-100 text-blue-800';
      case 'discontinued': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  // Get confidence score color
  const getConfidenceColor = () => {
    if (vendor.confidence >= 90) return 'text-green-600';
    if (vendor.confidence >= 80) return 'text-yellow-600';
    return 'text-red-600';
  };

  // Mobile-specific optimizations
  const isMobileView = isMobile || context === 'mobile';
  const isTabletView = isTablet || context === 'tablet';

  return (
    <div className={`bg-white rounded-xl border border-gray-200 relative overflow-hidden ${
      isMobileView 
        ? 'p-3 shadow-sm' 
        : isTabletView 
          ? 'p-4 shadow-md' 
          : 'p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02]'
    }`}>
      {/* Subtle top accent line */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-400 via-indigo-500 to-purple-600"></div>
      {/* Header with company name upper right and complexity controls */}
      <div className={`flex items-center justify-between ${
        isMobileView ? 'mb-3' : 'mb-4'
      }`}>
        <div className={`flex items-start ${
          isMobileView ? 'space-x-2' : 'space-x-3'
        }`}>
          <div className={`bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-100 rounded-xl flex items-center justify-center shadow-sm ${
            isMobileView ? 'w-10 h-10' : 'w-12 h-12'
          }`}>
            {vendor.logo ? (
              <img 
                src={vendor.logo} 
                alt={`${vendor.name} logo`}
                className={isMobileView ? 'w-6 h-6' : 'w-8 h-8'}
              />
            ) : (
              <div className={`flex items-center justify-center ${
                isMobileView ? 'w-6 h-6' : 'w-8 h-8'
              }`}>
                {vendor.category === 'selected' ? (
                  <span className="text-blue-600" title="Top Pick - Highest rated service for your needs">⭐</span>
                ) : vendor.category === 'recommended' ? (
                  <span className="text-green-600" title="Recommended - Excellent alternative option">🚀</span>
                ) : vendor.category === 'alternative' ? (
                  <span className="text-purple-600" title="Alternative - Good option to consider">💡</span>
                ) : (
                  <span className="text-gray-600" title="Standard - Basic service option">🔧</span>
                )}
              </div>
            )}
          </div>
          <div className="flex-1 text-center">
            {/* Show tier level and status */}
            <div className="flex items-center justify-center space-x-2">
              <span 
                className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-sm"
                title={`${vendor.tier ? vendor.tier.charAt(0).toUpperCase() + vendor.tier.slice(1) : 'Standard'} tier service level`}
              >
                {vendor.tier ? vendor.tier.charAt(0).toUpperCase() + vendor.tier.slice(1) : ''}
              </span>
              {!isMobileView && (
                <span 
                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium shadow-sm ${getStatusColor()}`}
                  title={`Service status: ${vendor.status}`}
                >
                  {vendor.status === 'active' ? '🟢' : vendor.status === 'inactive' ? '⚪' : vendor.status === 'acquired' ? '🔵' : '🔴'} {vendor.status}
                </span>
              )}
            </div>
          </div>
        </div>
        
        {/* Company name upper right large */}
        <div className="text-right">
          <h4 className={`font-bold text-gray-900 ${
            isMobileView ? 'text-lg' : 'text-xl'
          }`}>
            {vendor.name}
          </h4>
        </div>
      </div>

      {/* Content based on complexity level and screen size */}
      <div className={`space-y-3 ${
        isMobileView ? 'space-y-2' : 'space-y-3'
      }`}>
        {/* Description - larger and centered */}
        <p className={`text-gray-600 leading-relaxed text-center ${
          isMobileView ? 'text-sm' : 'text-lg'
        }`}>
          {vendor.description}
        </p>
        
        {/* Visual separator */}
        <div className="w-16 h-px bg-gradient-to-r from-blue-200 to-transparent mx-auto my-3"></div>
        
        {/* Target audience - left justified below description */}
        <div className="text-sm text-left">
          <span className="text-gray-500">Target:</span>
          <span className="ml-2">{vendor.marketPosition?.targetAudience?.[0] || 'General users'}</span>
        </div>
        
        {/* Show additional details based on complexity AND screen size */}
        {['mid', 'high'].includes(userLevel) && !isMobileView && (
          <>
            {/* Enhanced Score and Confidence display */}
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="text-center p-2 bg-gray-50 rounded-lg">
                <div className="text-xs text-gray-500 mb-1">Data Confidence</div>
                <div className={`text-lg font-bold ${getConfidenceColor()}`}>
                  {vendor.confidence}%
                </div>
                <div className="text-xs text-gray-400">
                  {vendor.confidence >= 90 ? 'Excellent' : 
                   vendor.confidence >= 80 ? 'Good' : 
                   vendor.confidence >= 70 ? 'Fair' : 'Limited'}
                </div>
              </div>
              {vendor.overallScore && (
                <div className="text-center p-2 bg-gray-50 rounded-lg">
                  <div className="text-xs text-gray-500 mb-1">Overall Score</div>
                  <div className="text-lg font-bold text-blue-600">
                    {vendor.overallScore}/30
                  </div>
                  <div className="text-xs text-gray-400">
                    {vendor.overallScore >= 25 ? 'Outstanding' : 
                     vendor.overallScore >= 20 ? 'Excellent' : 
                     vendor.overallScore >= 15 ? 'Good' : 'Basic'}
                  </div>
                </div>
              )}
            </div>
          </>
        )}
        
        {/* High level shows advanced features - hidden on mobile */}
        {userLevel === 'high' && !isMobileView && (
          <div className="space-y-2">
            {vendor.capabilities && (
              <div>
                <h4 className="font-medium text-sm">Capabilities:</h4>
                <div className="flex flex-wrap gap-1 mt-1">
                  {vendor.capabilities.apiIntegration && (
                    <span className="text-xs bg-gradient-to-r from-blue-100 to-blue-200 text-blue-800 px-2 py-1 rounded-lg shadow-sm">🔌 API</span>
                  )}
                  {vendor.capabilities.realTimeProcessing && (
                    <span className="text-xs bg-gradient-to-r from-green-100 to-green-200 text-green-800 px-2 py-1 rounded-lg shadow-sm">⚡ Real-time</span>
                  )}
                  {vendor.capabilities.speakerIdentification && (
                    <span className="text-xs bg-gradient-to-r from-purple-100 to-purple-200 text-purple-800 px-2 py-1 rounded-lg shadow-sm">👥 Speakers</span>
                  )}
                  {vendor.capabilities.languages && vendor.capabilities.languages.length > 5 && (
                    <span className="text-xs bg-gradient-to-r from-yellow-100 to-yellow-200 text-yellow-800 px-2 py-1 rounded-lg shadow-sm">
                      🌍 {vendor.capabilities.languages.length} languages
                    </span>
                  )}
                </div>
              </div>
            )}
            
            {vendor.bestFor && vendor.bestFor.length > 0 && (
              <div>
                <h4 className="font-medium text-sm">Best For:</h4>
                <ul className="text-sm text-gray-600 mt-1">
                  {vendor.bestFor.slice(0, 3).map((use, index) => (
                    <li key={index} className="flex items-center">
                      <span className="w-3 h-3 bg-green-100 rounded-full flex items-center justify-center mr-2">✓</span>
                      {use}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Footer with actions - optimized for mobile */}
      <div className={`mt-4 pt-4 border-t ${
        isMobileView ? 'mt-3 pt-3' : 'mt-4 pt-4'
      }`}>
        <div className="flex items-center justify-between">
          <div>
            <span className={`font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent ${
              isMobileView ? 'text-lg' : 'text-2xl'
            }`}>
              {getPricing()}
            </span>
            {/* Show pricing subtitle only on larger screens */}
            {getPricingSubtitle() && !isMobileView && (
              <p className="text-xs text-gray-500 mt-1">
                {getPricingSubtitle()}
              </p>
            )}
          </div>
          
          <div className="flex space-x-2">
            {/* Show compare button only on larger screens and when not on low complexity */}
            {userLevel !== 'low' && onCompare && !isMobileView && (
              <button 
                onClick={() => onCompare(vendor)}
                className="px-3 py-1 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 hover:border-gray-400 transition-colors duration-200"
              >
                Compare
              </button>
            )}
            <button 
              onClick={() => onSelect ? onSelect(vendor) : window.open(vendor.website, '_blank')}
              className={`bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-lg hover:from-blue-600 hover:to-indigo-700 transition-all duration-200 shadow-sm hover:shadow-md ${
                isMobileView 
                  ? 'px-3 py-2 text-sm' // Larger touch target on mobile
                  : 'px-3 py-1 text-sm'
              }`}
            >
              {onSelect ? 'View Details' : (isMobileView ? 'Start' : 'Visit Site')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
