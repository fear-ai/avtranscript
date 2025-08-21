import React from 'react';
import { ComplexityProvider } from '../providers/ComplexityProvider';
import { VendorList } from './vendor/VendorList';
import { Vendor } from '../types/vendor';

// Mock data for demonstration
const mockVendors: Vendor[] = [
  {
    id: '1',
    name: 'TranscribePro',
    description: 'Professional transcription service with high accuracy and fast turnaround',
    price: 99,
    accuracy: 98,
    turnaroundTime: '24 hours',
    category: 'Professional',
    features: ['API Access', 'Workflow Integration', 'Bulk Processing', 'Custom Vocabulary', 'Speaker Identification', 'Time Stamps'],
    apiAccess: true,
    workflowIntegration: true
  },
  {
    id: '2',
    name: 'QuickTranscribe',
    description: 'Fast and affordable transcription for everyday needs',
    price: 29,
    accuracy: 92,
    turnaroundTime: '4 hours',
    category: 'Basic',
    features: ['Fast Processing', 'Easy Upload', 'Basic Editing'],
    apiAccess: false,
    workflowIntegration: false
  },
  {
    id: '3',
    name: 'EnterpriseTranscribe',
    description: 'Enterprise-grade transcription with compliance and security features',
    price: 299,
    accuracy: 99,
    turnaroundTime: '12 hours',
    category: 'Enterprise',
    features: ['SOC2 Compliance', 'HIPAA Compliance', 'White Label', 'Volume Pricing', 'Dedicated Support', 'Custom Integration'],
    apiAccess: true,
    workflowIntegration: true,
    volumePrice: 199
  }
];

export const App: React.FC = () => {
  return (
    <ComplexityProvider>
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Transcription Services
            </h1>
            <p className="text-gray-600">
              Compare professional transcription services with progressive enhancement
            </p>
          </div>
          
          <VendorList vendors={mockVendors} />
          
          <div className="mt-8 p-6 bg-white rounded-lg shadow-sm border">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              How It Works
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <h3 className="font-medium text-gray-900 mb-2">Phase 1: Basic</h3>
                <p className="text-sm text-gray-600">
                  Simple vendor cards that work on all devices with essential information.
                </p>
              </div>
              <div>
                <h3 className="font-medium text-gray-900 mb-2">Phase 2: Responsive</h3>
                <p className="text-sm text-gray-600">
                  Enhanced cards that adapt to screen size and device capabilities.
                </p>
              </div>
              <div>
                <h3 className="font-medium text-gray-900 mb-2">Phase 3: Complex</h3>
                <p className="text-sm text-gray-600">
                  Full complexity level system with user-controlled detail levels.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ComplexityProvider>
  );
};
