import React, { useState, useMemo } from 'react';
import { Vendor } from '../../lib/types/vendor';
import { useDisplayContext } from '../../hooks/context/useDisplayContext';

interface ProfessionalSearchProps {
  vendors: Vendor[];
  onResultsChange: (vendors: Vendor[]) => void;
  className?: string;
}

interface SearchFilters {
  query: string;
  tier: string;
  category: string;
  targetMarket: string;
  minConfidence: number;
  hasAPI: boolean;
  hasRealTime: boolean;
  status: string;
}

export const ProfessionalSearch: React.FC<ProfessionalSearchProps> = ({
  vendors,
  onResultsChange,
  className = ''
}) => {
  const { context, isMobile } = useDisplayContext();
  
  const [filters, setFilters] = useState<SearchFilters>({
    query: '',
    tier: 'all',
    category: 'all',
    targetMarket: 'all',
    minConfidence: 0,
    hasAPI: false,
    hasRealTime: false,
    status: 'active'
  });

  const [sortBy, setSortBy] = useState<'relevance' | 'confidence' | 'score' | 'name'>('relevance');

  // Filter and sort vendors based on professional needs
  const filteredVendors = useMemo(() => {
    let results = vendors.filter(vendor => {
      // Query filter
      if (filters.query) {
        const query = filters.query.toLowerCase();
        const matchesQuery = 
          vendor.name.toLowerCase().includes(query) ||
          vendor.description.toLowerCase().includes(query) ||
          vendor.bestFor?.some(use => use.toLowerCase().includes(query)) ||
          vendor.capabilities?.languages?.some(lang => lang.toLowerCase().includes(query));
        
        if (!matchesQuery) return false;
      }

      // Tier filter
      if (filters.tier !== 'all' && vendor.tier !== filters.tier) return false;

      // Category filter
      if (filters.category !== 'all' && vendor.category !== filters.category) return false;

      // Target market filter
      if (filters.targetMarket !== 'all' && vendor.targetMarket !== filters.targetMarket) return false;

      // Confidence filter
      if (vendor.confidence < filters.minConfidence) return false;

      // API filter
      if (filters.hasAPI && !vendor.capabilities?.apiIntegration) return false;

      // Real-time filter
      if (filters.hasRealTime && !vendor.capabilities?.realTimeProcessing) return false;

      // Status filter
      if (filters.status !== 'all' && vendor.status !== filters.status) return false;

      return true;
    });

    // Sort results based on professional priorities
    results.sort((a, b) => {
      switch (sortBy) {
        case 'confidence':
          return b.confidence - a.confidence;
        case 'score':
          return (b.overallScore || 0) - (a.overallScore || 0);
        case 'name':
          return a.name.localeCompare(b.name);
        case 'relevance':
        default:
          // Professional relevance scoring
          const getRelevanceScore = (vendor: Vendor) => {
            let score = 0;
            
            // Prioritize professional/enterprise target markets
            if (vendor.targetMarket === 'professional') score += 10;
            if (vendor.targetMarket === 'enterprise') score += 8;
            
            // Prioritize premium/enterprise tiers
            if (vendor.tier === 'premium') score += 8;
            if (vendor.tier === 'enterprise') score += 10;
            
            // Prioritize selected/recommended categories
            if (vendor.category === 'selected') score += 6;
            if (vendor.category === 'recommended') score += 4;
            
            // Professional features
            if (vendor.capabilities?.apiIntegration) score += 5;
            if (vendor.capabilities?.webhookSupport) score += 3;
            if (vendor.capabilities?.customVocabulary) score += 2;
            if (vendor.capabilities?.speakerIdentification) score += 2;
            
            // High confidence and scores
            score += (vendor.confidence / 10);
            score += ((vendor.overallScore || 0) / 3);
            
            return score;
          };
          
          return getRelevanceScore(b) - getRelevanceScore(a);
      }
    });

    return results;
  }, [vendors, filters, sortBy]);

  // Update parent component when results change
  React.useEffect(() => {
    onResultsChange(filteredVendors);
  }, [filteredVendors, onResultsChange]);

  const updateFilter = <K extends keyof SearchFilters>(key: K, value: SearchFilters[K]) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  return (
    <div className={`bg-white rounded-lg shadow-sm border p-6 ${className}`}>
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          Find Professional Transcription Services
        </h2>
        
        {/* Search input */}
        <div className="mb-4">
          <input
            type="text"
            placeholder="Search by name, features, or capabilities..."
            value={filters.query}
            onChange={(e) => updateFilter('query', e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {/* Filters */}
        <div className={`grid gap-4 ${isMobile ? 'grid-cols-1' : 'grid-cols-2 lg:grid-cols-4'}`}>
          {/* Tier filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Service Tier
            </label>
            <select
              value={filters.tier}
              onChange={(e) => updateFilter('tier', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 text-sm"
            >
              <option value="all">All Tiers</option>
              <option value="premium">Premium</option>
              <option value="enterprise">Enterprise</option>
              <option value="mid-tier">Mid-tier</option>
              <option value="entry-level">Entry-level</option>
            </select>
          </div>

          {/* Category filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Category
            </label>
            <select
              value={filters.category}
              onChange={(e) => updateFilter('category', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 text-sm"
            >
              <option value="all">All Categories</option>
              <option value="selected">Top Picks</option>
              <option value="recommended">Recommended</option>
              <option value="alternative">Alternatives</option>
            </select>
          </div>

          {/* Target market filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Target Market
            </label>
            <select
              value={filters.targetMarket}
              onChange={(e) => updateFilter('targetMarket', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 text-sm"
            >
              <option value="all">All Markets</option>
              <option value="professional">Professional</option>
              <option value="enterprise">Enterprise</option>
              <option value="consumer">Consumer</option>
              <option value="agency">Agency</option>
            </select>
          </div>

          {/* Sort by */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Sort By
            </label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 text-sm"
            >
              <option value="relevance">Professional Relevance</option>
              <option value="confidence">Data Confidence</option>
              <option value="score">Overall Score</option>
              <option value="name">Name (A-Z)</option>
            </select>
          </div>
        </div>

        {/* Advanced filters */}
        <div className="mt-4 pt-4 border-t">
          <h3 className="text-sm font-medium text-gray-700 mb-3">Professional Features</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={filters.hasAPI}
                onChange={(e) => updateFilter('hasAPI', e.target.checked)}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="ml-2 text-sm text-gray-700">API Integration</span>
            </label>
            
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={filters.hasRealTime}
                onChange={(e) => updateFilter('hasRealTime', e.target.checked)}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="ml-2 text-sm text-gray-700">Real-time Processing</span>
            </label>

            <div>
              <label className="block text-sm text-gray-700 mb-1">
                Min. Confidence: {filters.minConfidence}%
              </label>
              <input
                type="range"
                min="0"
                max="100"
                step="10"
                value={filters.minConfidence}
                onChange={(e) => updateFilter('minConfidence', parseInt(e.target.value))}
                className="w-full"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Status
              </label>
              <select
                value={filters.status}
                onChange={(e) => updateFilter('status', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 text-sm"
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="acquired">Acquired</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Results summary */}
      <div className="flex items-center justify-between text-sm text-gray-600">
        <span>
          Showing {filteredVendors.length} of {vendors.length} services
        </span>
        <span>
          Optimized for professional content creators
        </span>
      </div>
    </div>
  );
};
