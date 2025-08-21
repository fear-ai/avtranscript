import React, { useState, useMemo } from 'react'
import { Vendor, VendorFilters } from '../lib/types/vendor'
import { VendorCard } from './VendorCard'
import { getActiveVendors, searchVendors } from '../lib/data/vendors'

interface VendorListProps {
  vendors: Vendor[]
}

export const VendorList: React.FC<VendorListProps> = ({ vendors }) => {
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<Vendor['status'] | 'all'>('all')
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 6

  // Filter and search vendors
  const filteredVendors = useMemo(() => {
    let filtered = vendors

    // Apply status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(vendor => vendor.status === statusFilter)
    }

    // Apply search query
    if (searchQuery.trim()) {
      filtered = searchVendors(searchQuery).filter(vendor => 
        filtered.some(f => f.id === vendor.id)
      )
    }

    return filtered
  }, [vendors, searchQuery, statusFilter])

  // Pagination
  const totalPages = Math.ceil(filteredVendors.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const paginatedVendors = filteredVendors.slice(startIndex, startIndex + itemsPerPage)

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    setCurrentPage(1) // Reset to first page on search
  }

  const handleStatusChange = (status: Vendor['status'] | 'all') => {
    setStatusFilter(status)
    setCurrentPage(1) // Reset to first page on filter change
  }

  return (
    <div className="space-y-6">
      {/* Search and Filters */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <form onSubmit={handleSearch} className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <input
                type="text"
                placeholder="Search vendors..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div className="flex gap-2">
              <select
                value={statusFilter}
                onChange={(e) => handleStatusChange(e.target.value as Vendor['status'] | 'all')}
                className="px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="acquired">Acquired</option>
                <option value="discontinued">Discontinued</option>
              </select>
              <button
                type="submit"
                className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                Search
              </button>
            </div>
          </div>
        </form>
        
        <div className="mt-4 text-sm text-gray-600">
          Showing {filteredVendors.length} of {vendors.length} vendors
        </div>
      </div>

      {/* Vendor Grid */}
      {paginatedVendors.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {paginatedVendors.map((vendor) => (
            <VendorCard key={vendor.id} vendor={vendor} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="text-gray-500 text-lg">No vendors found</div>
          <div className="text-gray-400 text-sm mt-2">
            Try adjusting your search or filters
          </div>
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center space-x-2">
          <button
            onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1}
            className="px-3 py-2 border border-gray-300 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
          >
            Previous
          </button>
          
          <span className="px-3 py-2 text-sm text-gray-600">
            Page {currentPage} of {totalPages}
          </span>
          
          <button
            onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
            disabled={currentPage === totalPages}
            className="px-3 py-2 border border-gray-300 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
          >
            Next
          </button>
        </div>
      )}
    </div>
  )
}

