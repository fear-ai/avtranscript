# Site Implementation Guide

## Technical Architecture & Stack

### **Frontend Framework**
- **Next.js 14** with App Router
- **TypeScript** for type safety
- **Tailwind CSS** for styling
- **React 18** with hooks and context

### **Data Management**
- **Build-time Processing**: CSV → JSON → TypeScript compilation
- **Static Generation**: Pre-rendered vendor pages
- **Client-side State**: React Context for UI state
- **Data Fetching**: Static imports, no runtime API calls

### **Build & Deployment**
- **Vercel** for hosting and deployment
- **GitHub Actions** for CI/CD
- **Environment**: Node.js 18+ for build process

## Implementation Phases

### **Phase 1: Core Structure & Routing**

#### **1.1 Project Setup**
```bash
# Install dependencies
npm install next@latest react@latest react-dom@latest
npm install -D typescript @types/react @types/node
npm install tailwindcss postcss autoprefixer
npm install lucide-react clsx tailwind-merge
```

#### **1.2 File Structure**
```
app/
├── layout.tsx              # Root layout
├── page.tsx                # Home page
├── vendors/
│   ├── page.tsx            # Vendor directory
│   ├── [category]/
│   │   └── page.tsx        # Category pages
│   └── [slug]/
│       └── page.tsx        # Individual vendor pages
├── compare/
│   └── page.tsx            # Comparison tools
├── resources/
│   └── page.tsx            # Educational content
└── about/
    └── page.tsx            # About page
```

#### **1.3 Core Components Structure**
```
components/
├── layout/
│   ├── Header.tsx          # Navigation header
│   ├── Footer.tsx          # Site footer
│   └── Navigation.tsx      # Main navigation
├── vendors/
│   ├── VendorCard.tsx      # Individual vendor display
│   ├── VendorList.tsx      # Grid/list of vendors
│   ├── VendorGrid.tsx      # Responsive grid layout
│   └── VendorDetail.tsx    # Full vendor profile
├── search/
│   ├── SearchBar.tsx       # Main search interface
│   ├── FilterPanel.tsx     # Advanced filtering
│   └── SearchResults.tsx   # Search results display
├── compare/
│   ├── ComparisonTable.tsx # Feature comparison
│   ├── VendorSelector.tsx  # Vendor picker
│   └── PricingCalculator.tsx # Cost calculator
└── ui/
    ├── Button.tsx          # Reusable button component
    ├── Card.tsx            # Base card component
    ├── Badge.tsx           # Status/feature badges
    └── Loading.tsx         # Loading states
```

### **Phase 2: Data Integration & Components**

#### **2.1 Data Integration**
```typescript
// lib/data/vendors.ts - Generated from build process
import { vendors } from './vendors'
import { Vendor, VendorId } from '../types/vendor'

export function getVendorById(id: VendorId): Vendor | undefined {
  return vendors.find(vendor => vendor.id === id)
}

export function getVendorsByCategory(category: string): Vendor[] {
  return vendors.filter(vendor => 
    vendor.capabilities?.categories?.includes(category)
  )
}

export function searchVendors(query: string): Vendor[] {
  const lowerQuery = query.toLowerCase()
  return vendors.filter(vendor =>
    vendor.name.toLowerCase().includes(lowerQuery) ||
    vendor.description.toLowerCase().includes(lowerQuery) ||
    vendor.capabilities?.categories?.some(cat => 
      cat.toLowerCase().includes(lowerQuery)
    )
  )
}
```

#### **2.2 Vendor Card Component**
```typescript
// components/vendors/VendorCard.tsx
interface VendorCardProps {
  vendor: Vendor
  onCompare?: (vendor: Vendor) => void
  showActions?: boolean
}

export function VendorCard({ vendor, onCompare, showActions = true }: VendorCardProps) {
  const { name, description, pricing, vendorScore, capabilities } = vendor
  
  return (
    <Card className="hover:shadow-lg transition-shadow">
      <div className="p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-3">
            {vendor.logo && (
              <img 
                src={vendor.logo} 
                alt={`${name} logo`}
                className="w-12 h-12 rounded-lg object-cover"
              />
            )}
            <div>
              <h3 className="text-lg font-semibold text-gray-900">{name}</h3>
              <div className="flex items-center space-x-2">
                <StarRating rating={vendorScore?.total || 0} />
                <span className="text-sm text-gray-600">
                  {vendorScore?.total || 0}/5
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Description */}
        <p className="text-gray-600 mb-4 line-clamp-2">{description}</p>

        {/* Key Metrics */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="text-center p-3 bg-gray-50 rounded-lg">
            <div className="text-2xl font-bold text-blue-600">
              ${pricing?.payPerUse?.aiPerMinute || 0}
            </div>
            <div className="text-sm text-gray-600">per minute</div>
          </div>
          <div className="text-center p-3 bg-gray-50 rounded-lg">
            <div className="text-2xl font-bold text-green-600">
              {vendorScore?.accuracy || 0}%
            </div>
            <div className="text-sm text-gray-600">accuracy</div>
          </div>
        </div>

        {/* Categories */}
        <div className="flex flex-wrap gap-2 mb-4">
          {capabilities?.categories?.slice(0, 3).map(category => (
            <Badge key={category} variant="secondary">
              {category}
            </Badge>
          ))}
        </div>

        {/* Actions */}
        {showActions && (
          <div className="flex space-x-3">
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => window.open(vendor.website, '_blank')}
            >
              Visit Site
            </Button>
            {onCompare && (
              <Button 
                variant="primary" 
                size="sm"
                onClick={() => onCompare(vendor)}
              >
                Compare
              </Button>
            )}
          </div>
        )}
      </div>
    </Card>
  )
}
```

#### **2.3 Search & Filter System**
```typescript
// components/search/SearchBar.tsx
export function SearchBar({ onSearch }: { onSearch: (query: string) => void }) {
  const [query, setQuery] = useState('')
  const [suggestions, setSuggestions] = useState<string[]>([])
  
  const debouncedSearch = useMemo(
    () => debounce((searchQuery: string) => {
      if (searchQuery.length > 2) {
        const results = searchVendors(searchQuery)
        const suggestionSet = new Set<string>()
        
        results.forEach(vendor => {
          vendor.capabilities?.categories?.forEach(cat => 
            suggestionSet.add(cat)
          )
        })
        
        setSuggestions(Array.from(suggestionSet).slice(0, 5))
      } else {
        setSuggestions([])
      }
    }, 300),
    []
  )

  useEffect(() => {
    debouncedSearch(query)
  }, [query, debouncedSearch])

  return (
    <div className="relative max-w-2xl mx-auto">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
        <input
          type="text"
          placeholder="Search vendors, features, or categories..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>
      
      {/* Search Suggestions */}
      {suggestions.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
          {suggestions.map(suggestion => (
            <button
              key={suggestion}
              onClick={() => {
                setQuery(suggestion)
                onSearch(suggestion)
                setSuggestions([])
              }}
              className="w-full px-4 py-2 text-left hover:bg-gray-50 focus:bg-gray-50 focus:outline-none"
            >
              {suggestion}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
```

### **Phase 3: Advanced Features**

#### **3.1 Comparison System**
```typescript
// components/compare/ComparisonTable.tsx
interface ComparisonTableProps {
  vendors: Vendor[]
  features: string[]
}

export function ComparisonTable({ vendors, features }: ComparisonTableProps) {
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set())
  
  const toggleRow = (feature: string) => {
    const newExpanded = new Set(expandedRows)
    if (newExpanded.has(feature)) {
      newExpanded.delete(feature)
    } else {
      newExpanded.add(feature)
    }
    setExpandedRows(newExpanded)
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse">
        <thead>
          <tr className="border-b-2 border-gray-200">
            <th className="text-left p-4 font-semibold">Feature</th>
            {vendors.map(vendor => (
              <th key={vendor.id} className="text-center p-4 font-semibold">
                {vendor.name}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {features.map(feature => (
            <React.Fragment key={feature}>
              <tr 
                className="border-b border-gray-100 hover:bg-gray-50 cursor-pointer"
                onClick={() => toggleRow(feature)}
              >
                <td className="p-4 font-medium">{feature}</td>
                {vendors.map(vendor => (
                  <td key={vendor.id} className="text-center p-4">
                    {getFeatureValue(vendor, feature)}
                  </td>
                ))}
              </tr>
              {expandedRows.has(feature) && (
                <tr className="bg-gray-50">
                  <td colSpan={vendors.length + 1} className="p-4">
                    <div className="text-sm text-gray-600">
                      {getFeatureDescription(feature)}
                    </div>
                  </td>
                </tr>
              )}
            </React.Fragment>
          ))}
        </tbody>
      </table>
    </div>
  )
}
```

#### **3.2 Pricing Calculator**
```typescript
// components/compare/PricingCalculator.tsx
export function PricingCalculator({ vendors }: { vendors: Vendor[] }) {
  const [selectedVendors, setSelectedVendors] = useState<Vendor[]>([])
  const [fileDuration, setFileDuration] = useState(60) // minutes
  const [fileCount, setFileCount] = useState(1)
  const [monthlyVolume, setMonthlyVolume] = useState(1000) // minutes

  const calculateCosts = useMemo(() => {
    return selectedVendors.map(vendor => {
      const basePrice = vendor.pricing?.payPerUse?.aiPerMinute || 0
      const totalMinutes = fileDuration * fileCount
      const baseCost = basePrice * totalMinutes
      
      // Apply volume discounts if available
      let finalCost = baseCost
      if (vendor.pricing?.volumeDiscounts) {
        // Apply discount logic
      }
      
      return {
        vendor,
        baseCost,
        finalCost,
        costPerMinute: finalCost / totalMinutes
      }
    })
  }, [selectedVendors, fileDuration, fileCount, monthlyVolume])

  return (
    <Card className="p-6">
      <h3 className="text-xl font-semibold mb-4">Pricing Calculator</h3>
      
      {/* Input Controls */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            File Duration (minutes)
          </label>
          <input
            type="number"
            value={fileDuration}
            onChange={(e) => setFileDuration(Number(e.target.value))}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
            min="1"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Number of Files
          </label>
          <input
            type="number"
            value={fileCount}
            onChange={(e) => setFileCount(Number(e.target.value))}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
            min="1"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Monthly Volume (minutes)
          </label>
          <input
            type="number"
            value={monthlyVolume}
            onChange={(e) => setMonthlyVolume(Number(e.target.value))}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
            min="1"
          />
        </div>
      </div>

      {/* Results */}
      {calculateCosts.length > 0 && (
        <div className="space-y-3">
          {calculateCosts.map(({ vendor, baseCost, finalCost, costPerMinute }) => (
            <div key={vendor.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
              <span className="font-medium">{vendor.name}</span>
              <div className="text-right">
                <div className="font-semibold">${finalCost.toFixed(2)}</div>
                <div className="text-sm text-gray-600">
                  ${costPerMinute.toFixed(3)}/min
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </Card>
  )
}
```

## Technical Implementation Details

### **State Management**
```typescript
// lib/context/VendorContext.tsx
interface VendorContextType {
  selectedVendors: Vendor[]
  addVendor: (vendor: Vendor) => void
  removeVendor: (vendorId: string) => void
  clearSelection: () => void
  searchQuery: string
  setSearchQuery: (query: string) => void
  filters: FilterState
  updateFilters: (filters: Partial<FilterState>) => void
}

export function VendorProvider({ children }: { children: React.ReactNode }) {
  const [selectedVendors, setSelectedVendors] = useState<Vendor[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [filters, setFilters] = useState<FilterState>({
    categories: [],
    priceRange: null,
    features: [],
    tiers: []
  })

  const addVendor = (vendor: Vendor) => {
    if (selectedVendors.length < 4) { // Limit to 4 vendors
      setSelectedVendors(prev => [...prev, vendor])
    }
  }

  const removeVendor = (vendorId: string) => {
    setSelectedVendors(prev => prev.filter(v => v.id !== vendorId))
  }

  const clearSelection = () => setSelectedVendors([])

  const updateFilters = (newFilters: Partial<FilterState>) => {
    setFilters(prev => ({ ...prev, ...newFilters }))
  }

  return (
    <VendorContext.Provider value={{
      selectedVendors,
      addVendor,
      removeVendor,
      clearSelection,
      searchQuery,
      setSearchQuery,
      filters,
      updateFilters
    }}>
      {children}
    </VendorContext.Provider>
  )
}
```

### **Data Fetching & Caching**
```typescript
// lib/hooks/useVendors.ts
export function useVendors() {
  const [vendors, setVendors] = useState<Vendor[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    // Import vendors data (build-time generated)
    import('../data/vendors').then(({ vendors }) => {
      setVendors(vendors)
      setLoading(false)
    }).catch(err => {
      setError('Failed to load vendors')
      setLoading(false)
    })
  }, [])

  const searchVendors = useCallback((query: string) => {
    if (!query.trim()) return vendors
    
    const lowerQuery = query.toLowerCase()
    return vendors.filter(vendor =>
      vendor.name.toLowerCase().includes(lowerQuery) ||
      vendor.description.toLowerCase().includes(lowerQuery) ||
      vendor.capabilities?.categories?.some(cat => 
        cat.toLowerCase().includes(lowerQuery)
      )
    )
  }, [vendors])

  const filterVendors = useCallback((filters: FilterState) => {
    return vendors.filter(vendor => {
      // Category filter
      if (filters.categories.length > 0 && 
          !filters.categories.some(cat => 
            vendor.capabilities?.categories?.includes(cat)
          )) {
        return false
      }

      // Price filter
      if (filters.priceRange) {
        const price = vendor.pricing?.payPerUse?.aiPerMinute || 0
        if (price < filters.priceRange.min || price > filters.priceRange.max) {
          return false
        }
      }

      // Feature filter
      if (filters.features.length > 0) {
        const hasAllFeatures = filters.features.every(feature =>
          vendor.capabilities?.[feature as keyof typeof vendor.capabilities]
        )
        if (!hasAllFeatures) return false
      }

      return true
    })
  }, [vendors])

  return {
    vendors,
    loading,
    error,
    searchVendors,
    filterVendors
  }
}
```

### **Responsive Design Implementation**
```typescript
// lib/hooks/useBreakpoint.ts
export function useBreakpoint() {
  const [breakpoint, setBreakpoint] = useState<'mobile' | 'tablet' | 'desktop'>('desktop')

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth
      if (width < 768) {
        setBreakpoint('mobile')
      } else if (width < 1024) {
        setBreakpoint('tablet')
      } else {
        setBreakpoint('desktop')
      }
    }

    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  return breakpoint
}

// Usage in components
export function VendorGrid({ vendors }: { vendors: Vendor[] }) {
  const breakpoint = useBreakpoint()
  
  const gridCols = {
    mobile: 1,
    tablet: 2,
    desktop: 3
  }[breakpoint]

  return (
    <div className={`grid grid-cols-${gridCols} gap-6`}>
      {vendors.map(vendor => (
        <VendorCard key={vendor.id} vendor={vendor} />
      ))}
    </div>
  )
}
```

## Performance Optimizations

### **Image Optimization**
```typescript
// components/ui/OptimizedImage.tsx
import Image from 'next/image'

export function OptimizedImage({ 
  src, 
  alt, 
  width = 48, 
  height = 48 
}: { 
  src: string
  alt: string
  width?: number
  height?: number
}) {
  return (
    <Image
      src={src}
      alt={alt}
      width={width}
      height={height}
      className="rounded-lg object-cover"
      placeholder="blur"
      blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX/9k="
    />
  )
}
```

### **Lazy Loading & Virtualization**
```typescript
// components/vendors/VendorList.tsx
import { useVirtualizer } from '@tanstack/react-virtual'

export function VendorList({ vendors }: { vendors: Vendor[] }) {
  const parentRef = useRef<HTMLDivElement>(null)

  const rowVirtualizer = useVirtualizer({
    count: vendors.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 200, // Estimated row height
    overscan: 5
  })

  return (
    <div ref={parentRef} className="h-96 overflow-auto">
      <div
        style={{
          height: `${rowVirtualizer.getTotalSize()}px`,
          width: '100%',
          position: 'relative',
        }}
      >
        {rowVirtualizer.getVirtualItems().map((virtualRow) => {
          const vendor = vendors[virtualRow.index]
          return (
            <div
              key={virtualRow.index}
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: `${virtualRow.size}px`,
                transform: `translateY(${virtualRow.start}px)`,
              }}
            >
              <VendorCard vendor={vendor} />
            </div>
          )
        })}
      </div>
    </div>
  )
}
```

## Testing Strategy

### **Unit Tests**
```typescript
// __tests__/components/VendorCard.test.tsx
import { render, screen, fireEvent } from '@testing-library/react'
import { VendorCard } from '@/components/vendors/VendorCard'

const mockVendor: Vendor = {
  id: '1',
  name: 'Test Vendor',
  description: 'A test vendor for testing',
  pricing: { payPerUse: { aiPerMinute: 0.10 } },
  vendorScore: { total: 4.5, accuracy: 98 },
  capabilities: { categories: ['Audio', 'Video'] }
}

describe('VendorCard', () => {
  it('renders vendor information correctly', () => {
    render(<VendorCard vendor={mockVendor} />)
    
    expect(screen.getByText('Test Vendor')).toBeInTheDocument()
    expect(screen.getByText('A test vendor for testing')).toBeInTheDocument()
    expect(screen.getByText('$0.10')).toBeInTheDocument()
    expect(screen.getByText('4.5/5')).toBeInTheDocument()
  })

  it('calls onCompare when compare button is clicked', () => {
    const mockOnCompare = jest.fn()
    render(<VendorCard vendor={mockVendor} onCompare={mockOnCompare} />)
    
    fireEvent.click(screen.getByText('Compare'))
    expect(mockOnCompare).toHaveBeenCalledWith(mockVendor)
  })
})
```

### **Integration Tests**
```typescript
// __tests__/pages/vendors.test.tsx
import { render, screen, waitFor } from '@testing-library/react'
import VendorsPage from '@/app/vendors/page'

describe('Vendors Page', () => {
  it('loads and displays vendors', async () => {
    render(<VendorsPage />)
    
    await waitFor(() => {
      expect(screen.getByText('Browse Vendors')).toBeInTheDocument()
    })
    
    // Check that vendor cards are rendered
    expect(screen.getAllByTestId('vendor-card')).toHaveLength(25)
  })
})
```

## Deployment & CI/CD

### **GitHub Actions Workflow**
```yaml
# .github/workflows/deploy.yml
name: Deploy to Vercel

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'
      
      - run: npm ci
      - run: npm run build:data
      - run: npm run test
      - run: npm run build

  deploy:
    needs: test
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    steps:
      - uses: actions/checkout@v3
      - uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.ORG_ID }}
          vercel-project-id: ${{ secrets.PROJECT_ID }}
          vercel-args: '--prod'
```

### **Environment Configuration**
```typescript
// lib/config/environment.ts
export const config = {
  development: {
    apiUrl: 'http://localhost:3000',
    dataSource: 'local',
    enableAnalytics: false
  },
  production: {
    apiUrl: process.env.NEXT_PUBLIC_API_URL,
    dataSource: 'build',
    enableAnalytics: true
  }
}[process.env.NODE_ENV || 'development']
```

This implementation guide provides a comprehensive technical roadmap for building the vendor comparison platform, with specific code examples, architectural decisions, and implementation details for each phase.
