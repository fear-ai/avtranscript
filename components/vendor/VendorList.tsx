import React from 'react';
import { Vendor } from '../../types/vendor';
import { SmartVendorCard } from './SmartVendorCard';

interface VendorListProps {
  vendors: Vendor[];
  className?: string;
}

export const VendorList: React.FC<VendorListProps> = ({ vendors, className = '' }) => (
  <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 ${className}`}>
    {vendors.map(vendor => (
      <SmartVendorCard key={vendor.id} vendor={vendor} />
    ))}
  </div>
);
