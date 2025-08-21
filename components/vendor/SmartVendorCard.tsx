import React from 'react';
import { Vendor } from '../../types/vendor';
import { ComplexityLevel } from '../../types/complexity';
import { useDisplayContext } from '../../hooks/context/useDisplayContext';
import { BasicVendorCard } from './BasicVendorCard';
import { ResponsiveVendorCard } from './ResponsiveVendorCard';
import { EnhancedVendorCard } from './EnhancedVendorCard';

interface SmartVendorCardProps {
  vendor: Vendor;
  userPreference?: ComplexityLevel;
}

export const SmartVendorCard: React.FC<SmartVendorCardProps> = ({ vendor, userPreference }) => {
  const { context } = useDisplayContext();
  
  // Choose appropriate component based on context
  if (context === 'embedded' || context === 'widget') {
    return <BasicVendorCard vendor={vendor} />;
  }
  
  if (context === 'mobile') {
    return <ResponsiveVendorCard vendor={vendor} />;
  }
  
  if (context === 'tablet') {
    return <ResponsiveVendorCard vendor={vendor} />;
  }
  
  // Desktop gets full complexity level system
  return <EnhancedVendorCard vendor={vendor} />;
};
