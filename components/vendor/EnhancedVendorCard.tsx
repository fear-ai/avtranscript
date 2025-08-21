import React, { useContext } from 'react';
import { Vendor } from '../../types/vendor';
import { useComplexity } from '../../providers/ComplexityProvider';

interface EnhancedVendorCardProps {
  vendor: Vendor;
}

export const EnhancedVendorCard: React.FC<EnhancedVendorCardProps> = ({ vendor }) => {
  const { userLevel, canUpgrade, canDowngrade, upgrade, downgrade, config } = useComplexity();
  
  return (
    <div className="bg-white rounded-lg shadow-sm border p-6">
      {/* Header with complexity controls */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">{vendor.name}</h3>
        
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
        <p className="text-gray-600">{vendor.description}</p>
        
        {/* Mid and high levels show additional details */}
        {['mid', 'high'].includes(userLevel) && (
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-gray-500">Accuracy:</span>
              <span className="ml-2 font-medium">{vendor.accuracy}%</span>
            </div>
            <div>
              <span className="text-gray-500">Turnaround:</span>
              <span className="ml-2 font-medium">{vendor.turnaroundTime}</span>
            </div>
          </div>
        )}
        
        {/* High level shows advanced features */}
        {userLevel === 'high' && (
          <div className="space-y-2">
            <h4 className="font-medium text-sm">Advanced Features:</h4>
            <ul className="text-sm text-gray-600 space-y-1">
              {vendor.features.slice(0, config.maxItems).map(feature => (
                <li key={feature} className="flex items-center">
                  <span className="w-3 h-3 bg-green-100 rounded-full flex items-center justify-center mr-2">✓</span>
                  {feature}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
      
      {/* Footer with actions */}
      <div className="mt-4 pt-4 border-t">
        <div className="flex items-center justify-between">
          <span className="text-2xl font-bold text-blue-600">${vendor.price}/month</span>
          
          <div className="flex space-x-2">
            {userLevel !== 'low' && (
              <button className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50">
                Compare
              </button>
            )}
            <button className="px-3 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600">
              Get Started
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
