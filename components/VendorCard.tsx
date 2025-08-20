import React from 'react'
import { Vendor } from '../lib/types/vendor'

interface VendorCardProps {
  vendor: Vendor
}

export const VendorCard: React.FC<VendorCardProps> = ({ vendor }) => {
  const getStatusColor = (status: Vendor['status']) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800'
      case 'inactive': return 'bg-yellow-100 text-yellow-800'
      case 'acquired': return 'bg-blue-100 text-blue-800'
      case 'discontinued': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 90) return 'text-green-600'
    if (confidence >= 70) return 'text-yellow-600'
    return 'text-red-600'
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            {vendor.name}
          </h3>
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(vendor.status)}`}>
            {vendor.status}
          </span>
        </div>
        <div className="text-right">
          <div className={`text-sm font-medium ${getConfidenceColor(vendor.confidence)}`}>
            {vendor.confidence}% confidence
          </div>
          <div className="text-xs text-gray-500">
            {new Date(vendor.lastVerified).toLocaleDateString()}
          </div>
        </div>
      </div>
      
      <p className="text-gray-600 mb-4 line-clamp-3">
        {vendor.description}
      </p>
      
      <div className="flex items-center justify-between">
        <a
          href={vendor.website}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 hover:text-blue-800 font-medium text-sm"
        >
          Visit Website →
        </a>
        <div className="text-xs text-gray-500">
          Source: {vendor.source}
        </div>
      </div>
    </div>
  )
}
