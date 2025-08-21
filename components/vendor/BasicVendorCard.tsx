import React from 'react';
import { Vendor } from '../../types/vendor';

interface BasicVendorCardProps {
  vendor: Vendor;
}

export const BasicVendorCard: React.FC<BasicVendorCardProps> = ({ vendor }) => (
  <div className="bg-white rounded border p-3">
    <h4 className="font-medium text-gray-900">{vendor.name}</h4>
    <p className="text-sm text-gray-600 mb-2">{vendor.description}</p>
    <div className="flex items-center justify-between">
      <span className="font-bold text-blue-600">${vendor.price}</span>
      <button className="text-xs bg-blue-500 text-white px-2 py-1 rounded">
        View
      </button>
    </div>
  </div>
);
