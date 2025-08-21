import React from 'react';
import { Vendor } from '../../lib/types/vendor';
import { useComplexity } from '../../providers/ComplexityProvider';

interface VendorComparisonProps {
  vendors: Vendor[];
  isOpen: boolean;
  onClose: () => void;
  onRemoveVendor: (vendorId: string) => void;
}

export const VendorComparison: React.FC<VendorComparisonProps> = ({
  vendors,
  isOpen,
  onClose,
  onRemoveVendor
}) => {
  const { userLevel } = useComplexity();

  if (!isOpen) return null;

  const getCapabilityStatus = (vendor: Vendor, capability: keyof NonNullable<Vendor['capabilities']>) => {
    return vendor.capabilities?.[capability] ? '✓' : '✗';
  };

  const getCapabilityClass = (vendor: Vendor, capability: keyof NonNullable<Vendor['capabilities']>) => {
    return vendor.capabilities?.[capability] 
      ? 'text-green-600 font-semibold' 
      : 'text-red-400';
  };

  const getPricing = (vendor: Vendor) => {
    if (vendor.pricing?.payPerUse?.aiPerMinute) {
      return `$${vendor.pricing.payPerUse.aiPerMinute}/min`;
    }
    if (vendor.pricing?.plans && vendor.pricing.plans.length > 0) {
      const plan = vendor.pricing.plans[0];
      return plan.price ? `$${plan.price}/${plan.billingCycle}` : 'Contact Sales';
    }
    return 'Pricing varies';
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-6xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900">
            Service Comparison
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-2xl font-bold"
          >
            ×
          </button>
        </div>

        {/* Comparison Table */}
        <div className="p-6">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-4 font-semibold text-gray-900 w-48">
                    Service
                  </th>
                  {vendors.map((vendor) => (
                    <th key={vendor.id} className="text-center p-4 min-w-48">
                      <div className="space-y-2">
                        <div className="flex items-center justify-center space-x-2">
                          <h3 className="font-semibold text-gray-900">{vendor.name}</h3>
                          <button
                            onClick={() => onRemoveVendor(vendor.id)}
                            className="text-red-400 hover:text-red-600 text-sm"
                          >
                            ✗
                          </button>
                        </div>
                        <div className="text-sm text-gray-500 capitalize">
                          {vendor.tier} • {vendor.category}
                        </div>
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {/* Basic Information */}
                <tr className="border-b bg-gray-50">
                  <td className="p-4 font-medium text-gray-900">Description</td>
                  {vendors.map((vendor) => (
                    <td key={vendor.id} className="p-4 text-sm text-gray-600">
                      {vendor.description}
                    </td>
                  ))}
                </tr>

                <tr className="border-b">
                  <td className="p-4 font-medium text-gray-900">Pricing</td>
                  {vendors.map((vendor) => (
                    <td key={vendor.id} className="p-4 text-center">
                      <div className="font-semibold text-blue-600">{getPricing(vendor)}</div>
                      {vendor.pricing?.freeTier?.minutes && vendor.pricing.freeTier.minutes > 0 && (
                        <div className="text-xs text-gray-500 mt-1">
                          {vendor.pricing.freeTier.minutes} free min
                        </div>
                      )}
                    </td>
                  ))}
                </tr>

                <tr className="border-b bg-gray-50">
                  <td className="p-4 font-medium text-gray-900">Confidence Score</td>
                  {vendors.map((vendor) => (
                    <td key={vendor.id} className="p-4 text-center">
                      <span className={`font-semibold ${
                        vendor.confidence >= 90 ? 'text-green-600' : 
                        vendor.confidence >= 80 ? 'text-yellow-600' : 'text-red-600'
                      }`}>
                        {vendor.confidence}%
                      </span>
                    </td>
                  ))}
                </tr>

                {vendors.some(v => v.overallScore) && (
                  <tr className="border-b">
                    <td className="p-4 font-medium text-gray-900">Overall Score</td>
                    {vendors.map((vendor) => (
                      <td key={vendor.id} className="p-4 text-center font-semibold">
                        {vendor.overallScore ? `${vendor.overallScore}/30` : 'N/A'}
                      </td>
                    ))}
                  </tr>
                )}

                {/* Capabilities Section */}
                {userLevel !== 'low' && (
                  <>
                    <tr className="border-b bg-blue-50">
                      <td colSpan={vendors.length + 1} className="p-4 font-bold text-blue-900">
                        Professional Features
                      </td>
                    </tr>

                    <tr className="border-b">
                      <td className="p-4 font-medium text-gray-900">API Integration</td>
                      {vendors.map((vendor) => (
                        <td key={vendor.id} className={`p-4 text-center ${getCapabilityClass(vendor, 'apiIntegration')}`}>
                          {getCapabilityStatus(vendor, 'apiIntegration')}
                        </td>
                      ))}
                    </tr>

                    <tr className="border-b bg-gray-50">
                      <td className="p-4 font-medium text-gray-900">Real-time Processing</td>
                      {vendors.map((vendor) => (
                        <td key={vendor.id} className={`p-4 text-center ${getCapabilityClass(vendor, 'realTimeProcessing')}`}>
                          {getCapabilityStatus(vendor, 'realTimeProcessing')}
                        </td>
                      ))}
                    </tr>

                    <tr className="border-b">
                      <td className="p-4 font-medium text-gray-900">Speaker Identification</td>
                      {vendors.map((vendor) => (
                        <td key={vendor.id} className={`p-4 text-center ${getCapabilityClass(vendor, 'speakerIdentification')}`}>
                          {getCapabilityStatus(vendor, 'speakerIdentification')}
                        </td>
                      ))}
                    </tr>

                    <tr className="border-b bg-gray-50">
                      <td className="p-4 font-medium text-gray-900">Custom Vocabulary</td>
                      {vendors.map((vendor) => (
                        <td key={vendor.id} className={`p-4 text-center ${getCapabilityClass(vendor, 'customVocabulary')}`}>
                          {getCapabilityStatus(vendor, 'customVocabulary')}
                        </td>
                      ))}
                    </tr>

                    <tr className="border-b">
                      <td className="p-4 font-medium text-gray-900">Webhook Support</td>
                      {vendors.map((vendor) => (
                        <td key={vendor.id} className={`p-4 text-center ${getCapabilityClass(vendor, 'webhookSupport')}`}>
                          {getCapabilityStatus(vendor, 'webhookSupport')}
                        </td>
                      ))}
                    </tr>

                    <tr className="border-b bg-gray-50">
                      <td className="p-4 font-medium text-gray-900">Batch Processing</td>
                      {vendors.map((vendor) => (
                        <td key={vendor.id} className={`p-4 text-center ${getCapabilityClass(vendor, 'batchProcessing')}`}>
                          {getCapabilityStatus(vendor, 'batchProcessing')}
                        </td>
                      ))}
                    </tr>

                    {/* Advanced Features */}
                    {userLevel === 'high' && (
                      <>
                        <tr className="border-b bg-purple-50">
                          <td colSpan={vendors.length + 1} className="p-4 font-bold text-purple-900">
                            Advanced Features
                          </td>
                        </tr>

                        <tr className="border-b">
                          <td className="p-4 font-medium text-gray-900">AI Summaries</td>
                          {vendors.map((vendor) => (
                            <td key={vendor.id} className={`p-4 text-center ${getCapabilityClass(vendor, 'aiSummaries')}`}>
                              {getCapabilityStatus(vendor, 'aiSummaries')}
                            </td>
                          ))}
                        </tr>

                        <tr className="border-b bg-gray-50">
                          <td className="p-4 font-medium text-gray-900">Team Collaboration</td>
                          {vendors.map((vendor) => (
                            <td key={vendor.id} className={`p-4 text-center ${getCapabilityClass(vendor, 'teamCollaboration')}`}>
                              {getCapabilityStatus(vendor, 'teamCollaboration')}
                            </td>
                          ))}
                        </tr>

                        <tr className="border-b">
                          <td className="p-4 font-medium text-gray-900">SDK Available</td>
                          {vendors.map((vendor) => (
                            <td key={vendor.id} className={`p-4 text-center ${getCapabilityClass(vendor, 'sdkAvailable')}`}>
                              {getCapabilityStatus(vendor, 'sdkAvailable')}
                            </td>
                          ))}
                        </tr>

                        <tr className="border-b bg-gray-50">
                          <td className="p-4 font-medium text-gray-900">Live Streaming</td>
                          {vendors.map((vendor) => (
                            <td key={vendor.id} className={`p-4 text-center ${getCapabilityClass(vendor, 'liveStreaming')}`}>
                              {getCapabilityStatus(vendor, 'liveStreaming')}
                            </td>
                          ))}
                        </tr>

                        <tr className="border-b">
                          <td className="p-4 font-medium text-gray-900">Languages Supported</td>
                          {vendors.map((vendor) => (
                            <td key={vendor.id} className="p-4 text-center text-sm">
                              {vendor.capabilities?.languages ? vendor.capabilities.languages.length : 0}
                            </td>
                          ))}
                        </tr>

                        <tr className="border-b bg-gray-50">
                          <td className="p-4 font-medium text-gray-900">Target Market</td>
                          {vendors.map((vendor) => (
                            <td key={vendor.id} className="p-4 text-center text-sm capitalize">
                              {vendor.targetMarket}
                            </td>
                          ))}
                        </tr>
                      </>
                    )}
                  </>
                )}
              </tbody>
            </table>
          </div>

          {/* Actions */}
          <div className="mt-6 flex items-center justify-between">
            <div className="text-sm text-gray-600">
              Comparing {vendors.length} services • 
              {userLevel === 'low' ? ' Basic comparison' : 
               userLevel === 'mid' ? ' Standard comparison' : 
               ' Advanced comparison'}
            </div>
            <div className="flex space-x-4">
              <button
                onClick={onClose}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                Close
              </button>
              <button
                onClick={() => vendors.forEach(v => window.open(v.website, '_blank'))}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Visit All Sites
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
