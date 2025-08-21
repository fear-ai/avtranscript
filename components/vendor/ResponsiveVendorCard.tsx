import React from 'react';
import { Vendor } from '../../types/vendor';
import { useDisplayContext } from '../../hooks/context/useDisplayContext';

interface ResponsiveVendorCardProps {
  vendor: Vendor;
}

export const ResponsiveVendorCard: React.FC<ResponsiveVendorCardProps> = ({ vendor }) => {
  const { isMobile, isTablet } = useDisplayContext();
  
  if (isMobile) {
    return (
      <div className="bg-white rounded border p-3">
        <h4 className="font-medium text-gray-900">{vendor.name}</h4>
        <p className="text-sm text-gray-600 mb-2">{vendor.description}</p>
        <div className="flex items-center justify-between">
          <span className="font-bold text-blue-600">${vendor.price}</span>
          <button className="text-xs bg-blue-500 text-white px-2 py-1 rounded">
            Start
          </button>
        </div>
      </div>
    );
  }
  
  if (isTablet) {
    return (
      <div className="bg-white rounded-lg shadow-sm border p-4">
        <h3 className="font-semibold text-gray-900 mb-2">{vendor.name}</h3>
        <p className="text-gray-600 text-sm mb-3">{vendor.description}</p>
        <div className="flex items-center justify-between">
          <span className="text-lg font-bold text-blue-600">${vendor.price}/month</span>
          <button className="px-3 py-1 text-sm bg-blue-500 text-white rounded">
            Start
          </button>
        </div>
      </div>
    );
  }
  
  // Desktop - enhanced version
  return (
    <div className="bg-white rounded-lg shadow-sm border p-6">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">{vendor.name}</h3>
          <div className="flex items-center space-x-2 mt-1">
            <span className="text-sm text-blue-600 font-medium">{vendor.accuracy}% accuracy</span>
          </div>
        </div>
      </div>
      
      <p className="text-gray-600 mb-4">{vendor.description}</p>
      
      <div className="flex items-center justify-between">
        <span className="text-2xl font-bold text-blue-600">${vendor.price}/month</span>
        <div className="flex space-x-2">
          <button className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50">
            Compare
          </button>
          <button className="px-3 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600">
            Get Started
          </button>
        </div>
      </div>
    </div>
  );
};
