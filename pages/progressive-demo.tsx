import React, { useState } from 'react';
import { ComplexityProvider } from '../providers/ComplexityProvider';
import { BasicVendorCard } from '../components/vendor/BasicVendorCard';
import { ResponsiveVendorCard } from '../components/vendor/ResponsiveVendorCard';
import { EnhancedVendorCard } from '../components/vendor/EnhancedVendorCard';
import { SmartVendorCard } from '../components/vendor/SmartVendorCard';
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

const ProgressiveDemoPage: React.FC = () => {
  const [activePhase, setActivePhase] = useState<'basic' | 'responsive' | 'enhanced' | 'smart'>('basic');
  const [selectedVendor, setSelectedVendor] = useState<Vendor>(mockVendors[0]);

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Progressive Enhancement Demo
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            See how the complexity level system evolves from basic to advanced
          </p>
          
          {/* Phase Selector */}
          <div className="flex justify-center space-x-2 mb-8">
            <button
              onClick={() => setActivePhase('basic')}
              className={`px-4 py-2 rounded-md font-medium ${
                activePhase === 'basic'
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
              }`}
            >
              Phase 1: Basic
            </button>
            <button
              onClick={() => setActivePhase('responsive')}
              className={`px-4 py-2 rounded-md font-medium ${
                activePhase === 'responsive'
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
              }`}
            >
              Phase 2: Responsive
            </button>
            <button
              onClick={() => setActivePhase('enhanced')}
              className={`px-4 py-2 rounded-md font-medium ${
                activePhase === 'enhanced'
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
              }`}
            >
              Phase 3: Enhanced
            </button>
            <button
              onClick={() => setActivePhase('smart')}
              className={`px-4 py-2 rounded-md font-medium ${
                activePhase === 'smart'
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
              }`}
            >
              Smart Auto-Adapt
            </button>
          </div>
        </div>

        {/* Vendor Selection */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Select Vendor to Display</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {mockVendors.map((vendor) => (
              <button
                key={vendor.id}
                onClick={() => setSelectedVendor(vendor)}
                className={`p-4 rounded-lg border-2 text-left transition-colors ${
                  selectedVendor.id === vendor.id
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 bg-white hover:border-gray-300'
                }`}
              >
                <h3 className="font-semibold text-gray-900">{vendor.name}</h3>
                <p className="text-sm text-gray-600 mt-1">{vendor.category}</p>
                <p className="text-sm text-gray-500 mt-1">${vendor.price}/month</p>
              </button>
            ))}
          </div>
        </div>

        {/* Component Display */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Component Output</h2>
          
          {activePhase === 'basic' && (
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Phase 1: Basic Vendor Card</h3>
              <p className="text-sm text-gray-600 mb-4">
                Simple component that works everywhere with essential information only.
              </p>
              <div className="max-w-md">
                <BasicVendorCard vendor={selectedVendor} />
              </div>
            </div>
          )}

          {activePhase === 'responsive' && (
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Phase 2: Responsive Vendor Card</h3>
              <p className="text-sm text-gray-600 mb-4">
                Automatically adapts to screen size and device capabilities.
              </p>
              <div className="max-w-md">
                <ResponsiveVendorCard vendor={selectedVendor} />
              </div>
            </div>
          )}

          {activePhase === 'enhanced' && (
            <ComplexityProvider>
              <div className="bg-white rounded-lg shadow-sm border p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Phase 3: Enhanced Vendor Card</h3>
                <p className="text-sm text-gray-600 mb-4">
                  Full complexity level system with user-controlled detail levels.
                </p>
                <div className="max-w-md">
                  <EnhancedVendorCard vendor={selectedVendor} />
                </div>
              </div>
            </ComplexityProvider>
          )}

          {activePhase === 'smart' && (
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Smart Auto-Adapting Vendor Card</h3>
              <p className="text-sm text-gray-600 mb-4">
                Automatically chooses appropriate complexity based on device context.
              </p>
              <div className="max-w-md">
                <SmartVendorCard vendor={selectedVendor} />
              </div>
            </div>
          )}
        </div>

        {/* Phase Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Implementation Phases</h3>
            <div className="space-y-4">
              <div>
                <h4 className="font-medium text-gray-900">Phase 1: Basic (Week 1-2)</h4>
                <p className="text-sm text-gray-600">
                  Start with simple components that work on all devices. Focus on essential functionality and universal compatibility.
                </p>
              </div>
              <div>
                <h4 className="font-medium text-gray-900">Phase 2: Responsive (Week 3-4)</h4>
                <p className="text-sm text-gray-600">
                  Add context detection and responsive behavior. Components adapt to screen size and device capabilities.
                </p>
              </div>
              <div>
                <h4 className="font-medium text-gray-900">Phase 3: Enhanced (Week 5-6)</h4>
                <p className="text-sm text-gray-600">
                  Implement full complexity level system with user control. Progressive disclosure based on user needs.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Complexity Levels</h3>
            <div className="space-y-4">
              <div>
                <h4 className="font-medium text-gray-900">Low (Basic)</h4>
                <p className="text-sm text-gray-600">
                  Essential information only. Works on all devices including embedded contexts.
                </p>
              </div>
              <div>
                <h4 className="font-medium text-gray-900">Mid (Standard)</h4>
                <p className="text-sm text-gray-600">
                  Enhanced features with moderate complexity. Available on mobile, tablet, and desktop.
                </p>
              </div>
              <div>
                <h4 className="font-medium text-gray-900">High (Advanced)</h4>
                <p className="text-sm text-gray-600">
                  Full feature set with complex interactions. Desktop only with enterprise features.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Technical Details */}
        <div className="mt-8 bg-white rounded-lg shadow-sm border p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Technical Implementation</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Context Detection</h4>
              <ul className="text-gray-600 space-y-1">
                <li>• Mobile: &lt; 768px</li>
                <li>• Tablet: 768px - 1024px</li>
                <li>• Desktop: &gt; 1024px</li>
                <li>• Embedded: iframe detection</li>
                <li>• Widget: small viewport</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Progressive Enhancement</h4>
              <ul className="text-gray-600 space-y-1">
                <li>• Start with basic functionality</li>
                <li>• Enhance based on capabilities</li>
                <li>• Graceful degradation</li>
                <li>• User-controlled complexity</li>
                <li>• Performance optimization</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Benefits</h4>
              <ul className="text-gray-600 space-y-1">
                <li>• Always works everywhere</li>
                <li>• Better user experience</li>
                <li>• Reduced development risk</li>
                <li>• Flexible architecture</li>
                <li>• Future-proof design</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProgressiveDemoPage;
