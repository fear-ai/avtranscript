import React from 'react';
import { Vendor } from '../../lib/types/vendor';
import { useDisplayContext } from '../../hooks/context/useDisplayContext';
import { useComplexity } from '../../providers/ComplexityProvider';

interface VendorCardAdaptedProps {
  vendor: Vendor;
  onCompare?: (vendor: Vendor) => void;
  onSelect?: (vendor: Vendor) => void;
}

export const VendorCardAdapted: React.FC<VendorCardAdaptedProps> = ({ 
  vendor, 
  onCompare, 
  onSelect 
}) => {
  const { context } = useDisplayContext();
  const { userLevel, canUpgrade, canDowngrade, upgrade, downgrade, config } = useComplexity();

  // Get pricing display
  const getPricing = () => {
    if (vendor.pricing?.payPerUse?.aiPerMinute) {
      return `$${vendor.pricing.payPerUse.aiPerMinute}/min`;
    }
    if (vendor.pricing?.plans && vendor.pricing.plans.length > 0) {
      const plan = vendor.pricing.plans[0];
      return plan.price ? `$${plan.price}/${plan.billingCycle}` : 'Contact Sales';
    }
    return 'Pricing varies';
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

  return (
    <div className="bg-white rounded-lg shadow-sm border p-6 hover:shadow-md transition-shadow">
      {/* Header with complexity controls */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-start space-x-3">
          <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
            {vendor.logo ? (
              <img 
                src={vendor.logo} 
                alt={`${vendor.name} logo`}
                className="w-8 h-8 object-contain"
              />
            ) : (
              <span className="text-lg font-semibold text-gray-500">
                {vendor.name.charAt(0)}
              </span>
            )}
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">{vendor.name}</h3>
            <div className="flex items-center space-x-2 mt-1">
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor()}`}>
                {vendor.status}
              </span>
              {vendor.tier && (
                <span className="text-xs text-gray-500 capitalize">{vendor.tier}</span>
              )}
            </div>
          </div>
        </div>
        
        {/* Complexity level controls */}
        <div className="flex items-center space-x-2">
          <span className="text-xs text-gray-500 px-2 py-1 bg-gray-100 rounded">
            {config.displayName}
          </span>
          
          {canDowngrade && (
            <button 
              onClick={downgrade}
              className="text-xs text-gray-400 hover:text-gray-600"
              title="Show less detail"
            >
              −
            </button>
          )}
          
          {canUpgrade && (
            <button 
              onClick={upgrade}
              className="text-xs text-gray-400 hover:text-gray-600"
              title="Show more detail"
            >
              +
            </button>
          )}
        </div>
      </div>

      {/* Content based on complexity level */}
      <div className="space-y-3">
        {/* Always show description */}
        <p className="text-gray-600">{vendor.description}</p>
        
        {/* Mid and high levels show additional details */}
        {['mid', 'high'].includes(userLevel) && (
          <>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-500">Confidence:</span>
                <span className={`ml-2 font-medium ${getConfidenceColor()}`}>
                  {vendor.confidence}%
                </span>
              </div>
              {vendor.overallScore && (
                <div>
                  <span className="text-gray-500">Score:</span>
                  <span className="ml-2 font-medium">{vendor.overallScore}/30</span>
                </div>
              )}
            </div>
            
            {vendor.marketPosition && (
              <div className="text-sm">
                <span className="text-gray-500">Target:</span>
                <span className="ml-2">{vendor.marketPosition.targetAudience?.join(', ')}</span>
              </div>
            )}
          </>
        )}
        
        {/* High level shows advanced features */}
        {userLevel === 'high' && (
          <div className="space-y-2">
            {vendor.capabilities && (
              <div>
                <h4 className="font-medium text-sm">Capabilities:</h4>
                <div className="flex flex-wrap gap-1 mt-1">
                  {vendor.capabilities.apiIntegration && (
                    <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">API</span>
                  )}
                  {vendor.capabilities.realTimeProcessing && (
                    <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">Real-time</span>
                  )}
                  {vendor.capabilities.speakerIdentification && (
                    <span className="text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded">Speakers</span>
                  )}
                  {vendor.capabilities.languages && vendor.capabilities.languages.length > 5 && (
                    <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded">
                      {vendor.capabilities.languages.length} languages
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

      {/* Footer with actions */}
      <div className="mt-4 pt-4 border-t">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-2xl font-bold text-blue-600">{getPricing()}</span>
            {vendor.pricing?.freeTier?.minutes && vendor.pricing.freeTier.minutes > 0 && (
              <p className="text-xs text-gray-500 mt-1">
                {vendor.pricing.freeTier.minutes} free minutes
              </p>
            )}
          </div>
          
          <div className="flex space-x-2">
            {userLevel !== 'low' && onCompare && (
              <button 
                onClick={() => onCompare(vendor)}
                className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50"
              >
                Compare
              </button>
            )}
            <button 
              onClick={() => onSelect ? onSelect(vendor) : window.open(vendor.website, '_blank')}
              className="px-3 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              {onSelect ? 'View Details' : 'Visit Site'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
