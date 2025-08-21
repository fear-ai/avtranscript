# Site Implementation Guide

## **Implementation Strategy Overview**

### **Core Approach: Progressive Enhancement**
- **Initial Target**: Mid-market professional content creator
- **Foundation**: Build solid functionality for professional needs
- **Expansion**: Add amateur and agency features naturally
- **Component Strategy**: Start simple, add complexity when compelling need arises

### **Technology Stack Decisions**
- **Core**: Next.js (current version), React, TypeScript, Tailwind CSS
- **UI Components**: Start with custom Tailwind components
- **Enhancement**: Add shadcn/ui when quality components needed
- **Advanced**: Add Radix primitives only for complex interactions requiring accessibility

## **Phase 1: Professional Creator Foundation (2-3 months)**

### **Core Platform Architecture**
**Goal**: Solid foundation for professional creators that can expand naturally

#### **Component Foundation**
```typescript
// Start with simple, clean components built with Tailwind
const VendorCard = ({ vendor }: { vendor: Vendor }) => (
  <div className="bg-white rounded-lg shadow-sm border p-6 hover:shadow-md transition-shadow">
    <div className="flex items-start justify-between mb-4">
      <div className="flex items-center space-x-3">
        <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
          <span className="text-xl">{vendor.name.charAt(0)}</span>
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-900">{vendor.name}</h3>
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-500">{vendor.category}</span>
            <span className="text-sm text-blue-600 font-medium">{vendor.accuracy}% accuracy</span>
          </div>
        </div>
      </div>
      <button className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors">
        View Details
      </button>
    </div>
    
    <p className="text-gray-600 mb-4">{vendor.description}</p>
    
    <div className="flex items-center justify-between">
      <span className="text-2xl font-bold text-blue-600">${vendor.price}/month</span>
      <div className="flex space-x-2">
        <button className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50">
          Compare
        </button>
        <button className="px-3 py-1 text-sm bg-gray-900 text-white rounded hover:bg-gray-800">
          Get Started
        </button>
      </div>
    </div>
  </div>
);
```

#### **Search & Filtering System**
```typescript
// Professional-focused search with expandable architecture
const useVendorSearch = () => {
  const [query, setQuery] = useState('');
  const [filters, setFilters] = useState({
    price: { min: 0, max: 1000 },
    accuracy: { min: 80, max: 100 },
    features: [] as string[],
    category: 'all'
  });
  
  const searchVendors = useCallback((searchQuery: string, searchFilters: typeof filters) => {
    // Professional-focused search logic
    // Prioritize accuracy, API access, workflow integration
    return vendors.filter(vendor => {
      const matchesQuery = vendor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          vendor.description.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesPrice = vendor.price >= searchFilters.price.min && 
                          vendor.price <= searchFilters.price.max;
      
      const matchesAccuracy = vendor.accuracy >= searchFilters.accuracy.min;
      
      const matchesFeatures = searchFilters.features.length === 0 ||
                             searchFilters.features.every(feature => 
                               vendor.features.includes(feature));
      
      return matchesQuery && matchesPrice && matchesAccuracy && matchesFeatures;
    }).sort((a, b) => {
      // Professional ranking: accuracy first, then features, then price
      if (a.accuracy !== b.accuracy) return b.accuracy - a.accuracy;
      if (a.features.length !== b.features.length) return b.features.length - a.features.length;
      return a.price - b.price;
    });
  }, []);
  
  return { query, setQuery, filters, setFilters, searchVendors };
};
```

#### **Comparison Tools**
```typescript
// Professional comparison focused on features and quality
const ComparisonTable = ({ vendors }: { vendors: Vendor[] }) => {
  const [selectedVendors, setSelectedVendors] = useState<Vendor[]>([]);
  
  const addVendor = (vendor: Vendor) => {
    if (selectedVendors.length < 4) { // Limit to 4 for readability
      setSelectedVendors(prev => [...prev, vendor]);
    }
  };
  
  const removeVendor = (vendorId: string) => {
    setSelectedVendors(prev => prev.filter(v => v.id !== vendorId));
  };
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Compare Services</h2>
        <div className="flex space-x-2">
          {vendors.slice(0, 6).map(vendor => (
            <button
              key={vendor.id}
              onClick={() => addVendor(vendor)}
              disabled={selectedVendors.some(v => v.id === vendor.id)}
              className="px-3 py-1 text-sm border rounded hover:bg-gray-50 disabled:opacity-50"
            >
              {vendor.name}
            </button>
          ))}
        </div>
      </div>
      
      {selectedVendors.length > 0 && (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b">
                <th className="text-left p-3">Feature</th>
                {selectedVendors.map(vendor => (
                  <th key={vendor.id} className="text-left p-3 border-l">
                    {vendor.name}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              <tr className="border-b">
                <td className="p-3 font-medium">Price</td>
                {selectedVendors.map(vendor => (
                  <td key={vendor.id} className="p-3 border-l">
                    ${vendor.price}/month
                  </td>
                ))}
              </tr>
              <tr className="border-b">
                <td className="p-3 font-medium">Accuracy</td>
                {selectedVendors.map(vendor => (
                  <td key={vendor.id} className="p-3 border-l">
                    {vendor.accuracy}%
                  </td>
                ))}
              </tr>
              <tr className="border-b">
                <td className="p-3 font-medium">API Access</td>
                {selectedVendors.map(vendor => (
                  <td key={vendor.id} className="p-3 border-l">
                    {vendor.apiAccess ? '✅' : '❌'}
                  </td>
                ))}
              </tr>
              <tr className="border-b">
                <td className="p-3 font-medium">Workflow Integration</td>
                {selectedVendors.map(vendor => (
                  <td key={vendor.id} className="p-3 border-l">
                    {vendor.workflowIntegration ? '✅' : '❌'}
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
```

### **Data Management Strategy**
**Leverage existing Phase I data pipeline infrastructure**

#### **Data Loading**
```typescript
// Use existing build-time data processing
import { vendors } from '@/lib/data/vendors';
import { categories } from '@/lib/data/categories';

// Professional-focused data filtering
const getProfessionalVendors = () => {
  return vendors.filter(vendor => 
    vendor.accuracy >= 85 && 
    vendor.features.includes('api_access')
  );
};

const getVendorCategories = () => {
  return categories.filter(category => 
    category.targetAudience.includes('professional')
  );
};
```

#### **State Management**
```typescript
// Simple React state for professional creator needs
const useAppState = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedVendors, setSelectedVendors] = useState<Vendor[]>([]);
  const [filters, setFilters] = useState({
    price: { min: 0, max: 1000 },
    accuracy: { min: 80, max: 100 },
    features: [] as string[]
  });
  
  const addToComparison = (vendor: Vendor) => {
    if (selectedVendors.length < 4) {
      setSelectedVendors(prev => [...prev, vendor]);
    }
  };
  
  const removeFromComparison = (vendorId: string) => {
    setSelectedVendors(prev => prev.filter(v => v.id !== vendorId));
  };
  
  return {
    searchQuery,
    setSearchQuery,
    selectedVendors,
    addToComparison,
    removeFromComparison,
    filters,
    setFilters
  };
};
```

## **Phase 2: Enhanced User Experience (3-4 months)**

### **When to Add shadcn/ui**
**Add when you need better form handling, modals, or consistent design patterns**

#### **Component Enhancement**
```bash
# Install when ready for better UX
npx shadcn@latest init
npx shadcn@latest add button card input form dialog
```

#### **Enhanced Components**
```typescript
// Replace custom components with shadcn/ui when needed
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"

const EnhancedVendorCard = ({ vendor }: { vendor: Vendor }) => (
  <Card className="hover:shadow-md transition-shadow">
    <CardHeader>
      <CardTitle className="flex items-center justify-between">
        {vendor.name}
        <span className="text-sm text-blue-600 font-medium">{vendor.accuracy}% accuracy</span>
      </CardTitle>
    </CardHeader>
    <CardContent>
      <p className="text-gray-600 mb-4">{vendor.description}</p>
      <div className="flex items-center justify-between">
        <span className="text-2xl font-bold text-blue-600">${vendor.price}/month</span>
        <div className="flex space-x-2">
          <Button variant="outline" size="sm">Compare</Button>
          <Button size="sm">Get Started</Button>
        </div>
      </div>
    </CardContent>
  </Card>
);
```

### **Progressive Disclosure Implementation**
**Based on functionality needs, not rigid user types**

#### **Feature Levels**
```typescript
// Progressive disclosure based on user interaction and needs
const useFeatureAccess = (featureName: string) => {
  const [userLevel, setUserLevel] = useState(1);
  
  const featureLevels = {
    'basic_search': 1,
    'advanced_filtering': 2,
    'comparison_tools': 2,
    'pricing_calculator': 3,
    'api_integration': 3,
    'workflow_features': 4,
    'enterprise_features': 4
  };
  
  const canAccess = userLevel >= (featureLevels[featureName] || 1);
  const nextLevel = featureLevels[featureName] || 1;
  
  const upgradeLevel = () => {
    if (userLevel < 4) setUserLevel(prev => prev + 1);
  };
  
  return { canAccess, userLevel, nextLevel, upgradeLevel };
};

// Usage in components
const FeatureSection = ({ featureName, children }: { featureName: string, children: React.ReactNode }) => {
  const { canAccess, userLevel, nextLevel, upgradeLevel } = useFeatureAccess(featureName);
  
  if (!canAccess) {
    return (
      <div className="p-4 border rounded-lg bg-gray-50">
        <p className="text-gray-600 mb-2">
          This feature requires level {nextLevel} access. You're currently at level {userLevel}.
        </p>
        <button 
          onClick={upgradeLevel}
          className="px-3 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Upgrade Access
        </button>
      </div>
    );
  }
  
  return <>{children}</>;
};
```

### **Complexity Level System (Progressive Enhancement)**
**Flexible 3-level system implementing progressive enhancement principles**

#### **Core Complexity Levels (Progressive Enhancement)**
```typescript
// Define complexity levels implementing progressive enhancement
// Start with basic functionality, enhance based on context capabilities
type ComplexityLevel = 'low' | 'mid' | 'high';

interface ComplexityConfig {
  level: ComplexityLevel;
  displayName: string;
  description: string;
  features: string[];
  maxItems?: number;
  showAdvanced?: boolean;
}

const complexityLevels: Record<ComplexityLevel, ComplexityConfig> = {
  low: {
    level: 'low',
    displayName: 'Basic',
    description: 'Essential information and simple interactions',
    features: ['core_details', 'basic_pricing', 'simple_actions'],
    maxItems: 3,
    showAdvanced: false
  },
  mid: {
    level: 'mid',
    displayName: 'Standard',
    description: 'Comprehensive information with moderate complexity',
    features: ['detailed_features', 'comparison_tools', 'advanced_filtering'],
    maxItems: 6,
    showAdvanced: true
  },
  high: {
    level: 'high',
    displayName: 'Advanced',
    description: 'Full feature set with complex interactions',
    features: ['enterprise_features', 'api_integration', 'workflow_tools'],
    maxItems: 10,
    showAdvanced: true
  }
};
```

#### **Context-Aware Display Options (Progressive Enhancement)**
```typescript
// Display contexts that determine progressive enhancement capabilities
// Each context starts with basic functionality and enhances based on capabilities
type DisplayContext = 'mobile' | 'tablet' | 'desktop' | 'embedded' | 'widget';

interface DisplayConfig {
  context: DisplayContext;
  availableLevels: ComplexityLevel[];
  defaultLevel: ComplexityLevel;
  fallbackLevel?: ComplexityLevel;
}

const displayConfigs: Record<DisplayContext, DisplayConfig> = {
  mobile: {
    context: 'mobile',
    availableLevels: ['low', 'mid'],
    defaultLevel: 'low',
    fallbackLevel: 'low'
  },
  tablet: {
    context: 'tablet',
    availableLevels: ['low', 'mid'],
    defaultLevel: 'mid',
    fallbackLevel: 'low'
  },
  desktop: {
    context: 'desktop',
    availableLevels: ['low', 'mid', 'high'],
    defaultLevel: 'mid',
    fallbackLevel: 'mid'
  },
  embedded: {
    context: 'embedded',
    availableLevels: ['low'],
    defaultLevel: 'low',
    fallbackLevel: 'low'
  },
  widget: {
    context: 'widget',
    availableLevels: ['low', 'mid'],
    defaultLevel: 'low',
    fallbackLevel: 'low'
  }
};
```

#### **Adaptive Component Rendering (Progressive Enhancement)**
```typescript
// Hook for managing progressive enhancement based on context
// Always starts with basic functionality, enhances progressively
const useComplexityLevel = (context: DisplayContext, userPreference?: ComplexityLevel) => {
  const [currentLevel, setCurrentLevel] = useState<ComplexityLevel>('mid');
  
  useEffect(() => {
    const config = displayConfigs[context];
    const preferredLevel = userPreference && config.availableLevels.includes(userPreference) 
      ? userPreference 
      : config.defaultLevel;
    
    setCurrentLevel(preferredLevel);
  }, [context, userPreference]);
  
  const availableLevels = displayConfigs[context].availableLevels;
  const canUpgrade = availableLevels.indexOf(currentLevel) < availableLevels.length - 1;
  const canDowngrade = availableLevels.indexOf(currentLevel) > 0;
  
  const upgrade = () => {
    const currentIndex = availableLevels.indexOf(currentLevel);
    if (currentIndex < availableLevels.length - 1) {
      setCurrentLevel(availableLevels[currentIndex + 1]);
    }
  };
  
  const downgrade = () => {
    const currentIndex = availableLevels.indexOf(currentLevel);
    if (currentIndex > 0) {
      setCurrentLevel(availableLevels[currentIndex - 1]);
    }
  };
  
  return {
    currentLevel,
    availableLevels,
    canUpgrade,
    canDowngrade,
    upgrade,
    downgrade,
    config: complexityLevels[currentLevel]
  };
};

// Component that adapts to complexity level
const AdaptiveVendorCard = ({ vendor, context, userPreference }: { 
  vendor: Vendor, 
  context: DisplayContext, 
  userPreference?: ComplexityLevel 
}) => {
  const { currentLevel, config, canUpgrade, canDowngrade, upgrade, downgrade } = useComplexityLevel(context, userPreference);
  
  return (
    <div className="bg-white rounded-lg shadow-sm border p-6">
      {/* Header with complexity controls */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">{vendor.name}</h3>
        
        {/* Complexity level indicator and controls */}
        <div className="flex items-center space-x-2">
          <span className="text-xs text-gray-500 px-2 py-1 bg-gray-100 rounded">
            {config.displayName}
          </span>
          
          {canDowngrade && (
            <button 
              onClick={downgrade}
              className="text-xs text-gray-400 hover:text-gray-600"
              title="Show less detail"
            >
              −
            </button>
          )}
          
          {canUpgrade && (
            <button 
              onClick={upgrade}
              className="text-xs text-gray-400 hover:text-gray-600"
              title="Show more detail"
            >
              +
            </button>
          )}
        </div>
      </div>
      
      {/* Content based on complexity level */}
      <div className="space-y-3">
        {/* Always show basic info */}
        <p className="text-gray-600">{vendor.description}</p>
        
        {/* Mid and high levels show additional details */}
        {['mid', 'high'].includes(currentLevel) && (
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-gray-500">Accuracy:</span>
              <span className="ml-2 font-medium">{vendor.accuracy}%</span>
            </div>
            <div>
              <span className="text-gray-500">Turnaround:</span>
              <span className="ml-2 font-medium">{vendor.turnaroundTime}</span>
            </div>
          </div>
        )}
        
        {/* High level shows advanced features */}
        {currentLevel === 'high' && (
          <div className="space-y-2">
            <h4 className="font-medium text-sm">Advanced Features:</h4>
            <ul className="text-sm text-gray-600 space-y-1">
              {vendor.features.slice(0, config.maxItems).map(feature => (
                <li key={feature} className="flex items-center">
                  <span className="w-3 h-3 bg-green-100 rounded-full flex items-center justify-center mr-2">✓</span>
                  {feature}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
      
      {/* Footer with actions */}
      <div className="mt-4 pt-4 border-t">
        <div className="flex items-center justify-between">
          <span className="text-xl font-bold text-blue-600">${vendor.price}/month</span>
          
          <div className="flex space-x-2">
            {currentLevel !== 'low' && (
              <button className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50">
                Compare
              </button>
            )}
            <button className="px-3 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600">
              Get Started
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
```

#### **Simplified Display Modes**
```typescript
// For contexts that only support limited complexity levels
const SimpleVendorCard = ({ vendor, mode }: { vendor: Vendor, mode: 'basic' | 'advanced' }) => {
  if (mode === 'basic') {
    return (
      <div className="bg-white rounded-lg shadow-sm border p-4">
        <h3 className="font-semibold text-gray-900 mb-2">{vendor.name}</h3>
        <p className="text-gray-600 text-sm mb-3">{vendor.description}</p>
        <div className="flex items-center justify-between">
          <span className="text-lg font-bold text-blue-600">${vendor.price}/month</span>
          <button className="px-3 py-1 text-sm bg-blue-500 text-white rounded">
            Start
          </button>
        </div>
      </div>
    );
  }
  
  // Advanced mode
  return (
    <div className="bg-white rounded-lg shadow-sm border p-6">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">{vendor.name}</h3>
          <div className="flex items-center space-x-2 mt-1">
            <span className="text-sm text-blue-600 font-medium">{vendor.accuracy}% accuracy</span>
            <span className="text-sm text-gray-500">{vendor.turnaroundTime}</span>
          </div>
        </div>
      </div>
      
      <p className="text-gray-600 mb-4">{vendor.description}</p>
      
      <div className="space-y-2 mb-4">
        {vendor.features.slice(0, 4).map(feature => (
          <div key={feature} className="flex items-center text-sm">
            <span className="w-4 h-4 bg-green-100 rounded-full flex items-center justify-center mr-2">✓</span>
            {feature}
          </div>
        ))}
      </div>
      
      <div className="flex items-center justify-between">
        <span className="text-2xl font-bold text-blue-600">${vendor.price}/month</span>
        <div className="flex space-x-2">
          <button className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50">
            Compare
          </button>
          <button className="px-3 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600">
            Get Started
          </button>
        </div>
      </div>
    </div>
  );
};

// Single-level display for very constrained contexts
const MinimalVendorCard = ({ vendor }: { vendor: Vendor }) => (
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
```

#### **Context Detection and Auto-Adaptation**
```typescript
// Hook to automatically detect display context
const useDisplayContext = () => {
  const [context, setContext] = useState<DisplayContext>('desktop');
  
  useEffect(() => {
    const detectContext = () => {
      const width = window.innerWidth;
      const userAgent = navigator.userAgent;
      
      if (width < 768) {
        setContext('mobile');
      } else if (width < 1024) {
        setContext('tablet');
      } else {
        setContext('desktop');
      }
      
      // Detect embedded context (iframe, etc.)
      if (window !== window.top) {
        setContext('embedded');
      }
      
      // Detect widget context (small viewport, specific URL patterns)
      if (width < 400 || window.location.pathname.includes('/widget')) {
        setContext('widget');
      }
    };
    
    detectContext();
    window.addEventListener('resize', detectContext);
    
    return () => window.removeEventListener('resize', detectContext);
  }, []);
  
  return context;
};

// Auto-adapting component that chooses appropriate complexity
const SmartVendorCard = ({ vendor, userPreference }: { vendor: Vendor, userPreference?: ComplexityLevel }) => {
  const context = useDisplayContext();
  
  // Choose appropriate component based on context
  if (context === 'embedded' || context === 'widget') {
    return <MinimalVendorCard vendor={vendor} />;
  }
  
  if (context === 'mobile') {
    return <SimpleVendorCard vendor={vendor} mode="basic" />;
  }
  
  if (context === 'tablet') {
    return <SimpleVendorCard vendor={vendor} mode="advanced" />;
  }
  
  // Desktop gets full complexity level system
  return <AdaptiveVendorCard vendor={vendor} context={context} userPreference={userPreference} />;
};
```

#### **Initial Implementation Strategy**

**Phase 1: Basic Foundation (Week 1-2)**
Start with the simplest possible implementation that works everywhere:

```typescript
// Start with minimal vendor card - works on all devices
const BasicVendorCard = ({ vendor }: { vendor: Vendor }) => (
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

// Use this everywhere initially
const VendorList = ({ vendors }: { vendors: Vendor[] }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
    {vendors.map(vendor => (
      <BasicVendorCard key={vendor.id} vendor={vendor} />
    ))}
  </div>
);
```

**Phase 2: Context Detection (Week 3-4)**
Add basic context detection without complexity levels:

```typescript
// Simple context detection hook
const useSimpleContext = () => {
  const [isMobile, setIsMobile] = useState(false);
  const [isTablet, setIsTablet] = useState(false);
  
  useEffect(() => {
    const checkContext = () => {
      const width = window.innerWidth;
      setIsMobile(width < 768);
      setIsTablet(width >= 768 && width < 1024);
    };
    
    checkContext();
    window.addEventListener('resize', checkContext);
    return () => window.removeEventListener('resize', checkContext);
  }, []);
  
  return { isMobile, isTablet, isDesktop: !isMobile && !isTablet };
};

// Enhanced vendor card with basic responsive behavior
const ResponsiveVendorCard = ({ vendor }: { vendor: Vendor }) => {
  const { isMobile, isTablet } = useSimpleContext();
  
  if (isMobile) {
    return (
      <div className="bg-white rounded border p-3">
        <h4 className="font-medium text-gray-900">{vendor.name}</h4>
        <p className="text-sm text-gray-600 mb-2">{vendor.description}</p>
        <div className="flex items-center justify-between">
          <span className="font-bold text-blue-600">${vendor.price}</span>
          <button className="text-xs bg-blue-500 text-white px-2 py-1 rounded">
            Start
          </button>
        </div>
      </div>
    );
  }
  
  if (isTablet) {
    return (
      <div className="bg-white rounded-lg shadow-sm border p-4">
        <h3 className="font-semibold text-gray-900 mb-2">{vendor.name}</h3>
        <p className="text-gray-600 text-sm mb-3">{vendor.description}</p>
        <div className="flex items-center justify-between">
          <span className="text-lg font-bold text-blue-600">${vendor.price}/month</span>
          <button className="px-3 py-1 text-sm bg-blue-500 text-white rounded">
            Start
          </button>
        </div>
      </div>
    );
  }
  
  // Desktop - enhanced version
  return (
    <div className="bg-white rounded-lg shadow-sm border p-6">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">{vendor.name}</h3>
          <div className="flex items-center space-x-2 mt-1">
            <span className="text-sm text-blue-600 font-medium">{vendor.accuracy}% accuracy</span>
          </div>
        </div>
      </div>
      
      <p className="text-gray-600 mb-4">{vendor.description}</p>
      
      <div className="flex items-center justify-between">
        <span className="text-2xl font-bold text-blue-600">${vendor.price}/month</span>
        <div className="flex space-x-2">
          <button className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50">
            Compare
          </button>
          <button className="px-3 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600">
            Get Started
          </button>
        </div>
      </div>
    </div>
  );
};
```

**Phase 3: Complexity Levels (Week 5-6)**
Add the full complexity level system:

```typescript
// Add complexity level context
const ComplexityProvider = ({ children }: { children: React.ReactNode }) => {
  const [userLevel, setUserLevel] = useState<ComplexityLevel>('mid');
  const context = useDisplayContext();
  
  // Ensure user level is valid for current context
  useEffect(() => {
    const config = displayConfigs[context];
    if (!config.availableLevels.includes(userLevel)) {
      setUserLevel(config.defaultLevel);
    }
  }, [context, userLevel]);
  
  const value = {
    userLevel,
    setUserLevel,
    context,
    availableLevels: displayConfigs[context].availableLevels,
    canUpgrade: displayConfigs[context].availableLevels.indexOf(userLevel) < displayConfigs[context].availableLevels.length - 1,
    canDowngrade: displayConfigs[context].availableLevels.indexOf(userLevel) > 0
  };
  
  return (
    <ComplexityContext.Provider value={value}>
      {children}
    </ComplexityContext.Provider>
  );
};

// Enhanced vendor card with complexity levels
const EnhancedVendorCard = ({ vendor }: { vendor: Vendor }) => {
  const { userLevel, canUpgrade, canDowngrade, setUserLevel } = useContext(ComplexityContext);
  
  const upgrade = () => {
    if (canUpgrade) {
      setUserLevel(prev => {
        if (prev === 'low') return 'mid';
        if (prev === 'mid') return 'high';
        return prev;
      });
    }
  };
  
  const downgrade = () => {
    if (canDowngrade) {
      setUserLevel(prev => {
        if (prev === 'high') return 'mid';
        if (prev === 'mid') return 'low';
        return prev;
      });
    }
  };
  
  return (
    <div className="bg-white rounded-lg shadow-sm border p-6">
      {/* Header with complexity controls */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">{vendor.name}</h3>
        
        <div className="flex items-center space-x-2">
          <span className="text-xs text-gray-500 px-2 py-1 bg-gray-100 rounded">
            {complexityLevels[userLevel].displayName}
          </span>
          
          {canDowngrade && (
            <button 
              onClick={downgrade}
              className="text-xs text-gray-400 hover:text-gray-600"
              title="Show less detail"
            >
              −
            </button>
          )}
          
          {canUpgrade && (
            <button 
              onClick={upgrade}
              className="text-xs text-gray-400 hover:text-gray-600"
              title="Show more detail"
            >
              +
            </button>
          )}
        </div>
      </div>
      
      {/* Content based on complexity level */}
      <div className="space-y-3">
        <p className="text-gray-600">{vendor.description}</p>
        
        {['mid', 'high'].includes(userLevel) && (
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-gray-500">Accuracy:</span>
              <span className="ml-2 font-medium">{vendor.accuracy}%</span>
            </div>
            <div>
              <span className="text-gray-500">Turnaround:</span>
              <span className="ml-2 font-medium">{vendor.turnaroundTime}</span>
            </div>
          </div>
        )}
        
        {userLevel === 'high' && (
          <div className="space-y-2">
            <h4 className="font-medium text-sm">Advanced Features:</h4>
            <ul className="text-sm text-gray-600 space-y-1">
              {vendor.features.slice(0, 6).map(feature => (
                <li key={feature} className="flex items-center">
                  <span className="w-3 h-3 bg-green-100 rounded-full flex items-center justify-center mr-2">✓</span>
                  {feature}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
      
      {/* Footer with actions */}
      <div className="mt-4 pt-4 border-t">
        <div className="flex items-center justify-between">
          <span className="text-2xl font-bold text-blue-600">${vendor.price}/month</span>
          
          <div className="flex space-x-2">
            {userLevel !== 'low' && (
              <button className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50">
                Compare
              </button>
            )}
            <button className="px-3 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600">
              Get Started
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
```

**Implementation Benefits:**

1. **Always Works**: Basic functionality works on all devices from day one
2. **Progressive Enhancement**: Features are added incrementally based on context
3. **User Control**: Users can adjust complexity level based on their needs
4. **Performance**: Only loads features needed for current context
5. **Maintainable**: Single component system with clear enhancement path
6. **Accessible**: Works on all devices and screen sizes

**Testing Strategy:**

1. **Week 1-2**: Test basic functionality across all devices
2. **Week 3-4**: Test responsive behavior and context detection
3. **Week 5-6**: Test complexity level switching and user preferences
4. **Ongoing**: Performance testing and accessibility validation

## **Phase 3: User Type Expansion (3-4 months)**

### **Amateur Experience**
**Simplify existing professional features, add guided workflows**

#### **Amateur Component Adaptation**
```typescript
// Build on professional foundation with simplified interfaces
const AmateurVendorCard = ({ vendor }: { vendor: Vendor }) => (
  <div className="bg-white rounded-lg shadow-sm border p-6">
    <div className="text-center mb-4">
      <h3 className="text-lg font-semibold text-gray-900 mb-2">{vendor.name}</h3>
      <p className="text-sm text-gray-500 mb-3">Perfect for beginners</p>
      <div className="flex items-center justify-center space-x-4 text-sm text-gray-600">
        <span>✅ Easy to use</span>
        <span>✅ Great support</span>
        <span>✅ Affordable</span>
      </div>
    </div>
    
    <p className="text-gray-600 text-center mb-4">{vendor.description}</p>
    
    <div className="text-center">
      <span className="text-2xl font-bold text-blue-600 block mb-3">${vendor.price}/month</span>
      <button className="w-full px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600">
        Start Free Trial
      </button>
    </div>
  </div>
);
```

### **Agency Experience**
**Add enterprise features on top of professional foundation**

#### **Agency Component Enhancement**
```typescript
// Extend professional components with enterprise features
const AgencyVendorCard = ({ vendor }: { vendor: Vendor }) => (
  <div className="bg-white rounded-lg shadow-sm border p-6">
    <div className="flex items-start justify-between mb-4">
      <div>
        <h3 className="text-lg font-semibold text-gray-900">{vendor.name}</h3>
        <div className="flex items-center space-x-2 mt-1">
          <span className="text-sm text-green-600 font-medium">Enterprise Ready</span>
          <span className="text-sm text-purple-600 font-medium">Compliance Certified</span>
        </div>
      </div>
      <div className="text-right">
        <span className="text-xs text-gray-500">Volume Discount</span>
        <div className="text-lg font-bold text-blue-600">${vendor.volumePrice}/month</div>
      </div>
    </div>
    
    <p className="text-gray-600 mb-4">{vendor.description}</p>
    
    <div className="space-y-2 mb-4">
      <div className="flex items-center text-sm">
        <span className="w-4 h-4 bg-green-100 rounded-full flex items-center justify-center mr-2">✓</span>
        <span>White-label options available</span>
      </div>
      <div className="flex items-center text-sm">
        <span className="w-4 h-4 bg-green-100 rounded-full flex items-center justify-center mr-2">✓</span>
        <span>Compliance reporting included</span>
      </div>
      <div className="flex items-center text-sm">
        <span className="w-4 h-4 bg-green-100 rounded-full flex items-center justify-center mr-2">✓</span>
        <span>Dedicated account manager</span>
      </div>
    </div>
    
    <div className="flex space-x-2">
      <button className="flex-1 px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50">
        Request Demo
      </button>
      <button className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600">
        Contact Sales
      </button>
    </div>
  </div>
);
```

### **User Type Detection System**
**Built on top of existing functionality**

#### **User Type Context**
```typescript
// Add user type system when expanding to multiple user types
interface UserTypeContext {
  userType: 'amateur' | 'professional' | 'agency';
  setUserType: (type: UserType) => void;
  userPreferences: UserPreferences;
  updatePreferences: (prefs: Partial<UserPreferences>) => void;
}

const UserTypeProvider = ({ children }: { children: React.ReactNode }) => {
  const [userType, setUserType] = useState<UserType>('professional'); // Default to professional
  const [userPreferences, setUserPreferences] = useState<UserPreferences>({});
  
  const updatePreferences = (prefs: Partial<UserPreferences>) => {
    setUserPreferences(prev => ({ ...prev, ...prefs }));
  };
  
  const value = {
    userType,
    setUserType,
    userPreferences,
    updatePreferences
  };
  
  return (
    <UserTypeContext.Provider value={value}>
      {children}
    </UserTypeContext.Provider>
  );
};
```

## **When to Add Radix Primitives**

### **Complex Interactions Requiring Accessibility**
**Add only when you need advanced accessibility, keyboard navigation, or complex state management**

#### **Dialog/Modal System**
```typescript
// When you need proper modal behavior, focus management, keyboard navigation
import * as Dialog from '@radix-ui/react-dialog';

const VendorDetailModal = ({ vendor, isOpen, onClose }: { vendor: Vendor, isOpen: boolean, onClose: () => void }) => {
  return (
    <Dialog.Root open={isOpen} onOpenChange={onClose}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/50" />
        <Dialog.Content className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
          <Dialog.Title className="text-xl font-semibold mb-4">
            {vendor.name} - Service Details
          </Dialog.Title>
          
          <div className="space-y-4">
            <div>
              <h4 className="font-medium mb-2">Description</h4>
              <p className="text-gray-600">{vendor.description}</p>
            </div>
            
            <div>
              <h4 className="font-medium mb-2">Features</h4>
              <ul className="space-y-1">
                {vendor.features.map(feature => (
                  <li key={feature} className="flex items-center">
                    <span className="w-4 h-4 bg-green-100 rounded-full flex items-center justify-center mr-2">✓</span>
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
            
            <div>
              <h4 className="font-medium mb-2">Pricing</h4>
              <p className="text-2xl font-bold text-blue-600">${vendor.price}/month</p>
            </div>
          </div>
          
          <div className="flex justify-end space-x-2 mt-6">
            <button onClick={onClose} className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50">
              Close
            </button>
            <button className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600">
              Get Started
            </button>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};
```

#### **Tabs for Complex Content**
```typescript
// When you need accessible tab interfaces
import * as Tabs from '@radix-ui/react-tabs';

const VendorDetailTabs = ({ vendor }: { vendor: Vendor }) => {
  return (
    <Tabs.Root defaultValue="overview" className="w-full">
      <Tabs.List className="flex border-b">
        <Tabs.Trigger value="overview" className="px-4 py-2 border-b-2 border-transparent data-[state=active]:border-blue-500">
          Overview
        </Tabs.Trigger>
        <Tabs.Trigger value="features" className="px-4 py-2 border-b-2 border-transparent data-[state=active]:border-blue-500">
          Features
        </Tabs.Trigger>
        <Tabs.Trigger value="pricing" className="px-4 py-2 border-b-2 border-transparent data-[state=active]:border-blue-500">
          Pricing
        </Tabs.Trigger>
        <Tabs.Trigger value="reviews" className="px-4 py-2 border-b-2 border-transparent data-[state=active]:border-blue-500">
          Reviews
        </Tabs.Trigger>
      </Tabs.List>
      
      <Tabs.Content value="overview" className="mt-4">
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Service Overview</h3>
          <p className="text-gray-600">{vendor.description}</p>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <span className="text-sm text-gray-500">Accuracy</span>
              <p className="font-medium">{vendor.accuracy}%</p>
            </div>
            <div>
              <span className="text-sm text-gray-500">Turnaround Time</span>
              <p className="font-medium">{vendor.turnaroundTime}</p>
            </div>
          </div>
        </div>
      </Tabs.Content>
      
      <Tabs.Content value="features" className="mt-4">
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Features & Capabilities</h3>
          <ul className="space-y-2">
            {vendor.features.map(feature => (
              <li key={feature} className="flex items-center">
                <span className="w-4 h-4 bg-green-100 rounded-full flex items-center justify-center mr-2">✓</span>
                {feature}
              </li>
            ))}
          </ul>
        </div>
      </Tabs.Content>
      
      <Tabs.Content value="pricing" className="mt-4">
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Pricing Plans</h3>
          <div className="bg-blue-50 p-4 rounded-lg">
            <p className="text-2xl font-bold text-blue-600">${vendor.price}/month</p>
            <p className="text-sm text-gray-600">Standard plan includes all basic features</p>
          </div>
        </div>
      </Tabs.Content>
      
      <Tabs.Content value="reviews" className="mt-4">
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Customer Reviews</h3>
          <p className="text-gray-600">Reviews coming soon...</p>
        </div>
      </Tabs.Content>
    </Tabs.Root>
  );
};
```

## **Performance Optimization Strategy**

### **Bundle Size Management**
**Keep bundles lean by loading features progressively**

#### **Code Splitting by Feature**
```typescript
// Lazy load features based on user needs
const ComparisonTools = lazy(() => import('@/components/compare/ComparisonTools'));
const PricingCalculator = lazy(() => import('@/components/pricing/PricingCalculator'));
const APIDocumentation = lazy(() => import('@/components/api/APIDocumentation'));

// Load features when needed
const FeatureLoader = ({ featureName, children }: { featureName: string, children: React.ReactNode }) => {
  const [isLoaded, setIsLoaded] = useState(false);
  
  useEffect(() => {
    // Load feature based on user interaction or navigation
    if (featureName === 'comparison' && !isLoaded) {
      setIsLoaded(true);
    }
  }, [featureName, isLoaded]);
  
  if (!isLoaded) {
    return <div className="p-4 text-center text-gray-500">Loading...</div>;
  }
  
  return <>{children}</>;
};
```

### **Image and Asset Optimization**
**Use Next.js built-in optimization**

#### **Image Strategy**
```typescript
// Leverage Next.js Image component for optimization
import Image from 'next/image';

const VendorLogo = ({ vendor }: { vendor: Vendor }) => (
  <div className="w-12 h-12 relative">
    {vendor.logo ? (
      <Image
        src={vendor.logo}
        alt={`${vendor.name} logo`}
        fill
        className="object-contain rounded-lg"
        sizes="48px"
      />
    ) : (
      <div className="w-full h-full bg-gray-100 rounded-lg flex items-center justify-center">
        <span className="text-lg font-semibold text-gray-500">
          {vendor.name.charAt(0)}
        </span>
      </div>
    )}
  </div>
);
```

## **Testing Strategy**

### **Testing Framework**
**Jest + React Testing Library for comprehensive testing**

#### **Component Testing**
```typescript
// Test components with different data scenarios
describe('VendorCard', () => {
  it('renders vendor information correctly', () => {
    render(<VendorCard vendor={mockVendor} />);
    expect(screen.getByText(mockVendor.name)).toBeInTheDocument();
    expect(screen.getByText(`$${mockVendor.price}/month`)).toBeInTheDocument();
  });

  it('handles missing vendor data gracefully', () => {
    const incompleteVendor = { ...mockVendor, description: undefined };
    render(<VendorCard vendor={incompleteVendor} />);
    expect(screen.getByText('No description available')).toBeInTheDocument();
  });

  it('shows comparison button when vendor is not in comparison', () => {
    render(<VendorCard vendor={mockVendor} />);
    expect(screen.getByText('Compare')).toBeInTheDocument();
  });
});
```

#### **Integration Testing**
```typescript
// Test user workflows
describe('Vendor Search and Comparison', () => {
  it('allows users to search and add vendors to comparison', async () => {
    render(<VendorSearch />);
    
    // Search for a vendor
    const searchInput = screen.getByPlaceholderText('Search vendors...');
    fireEvent.change(searchInput, { target: { value: 'test vendor' } });
    
    // Wait for results
    await waitFor(() => {
      expect(screen.getByText('Test Vendor')).toBeInTheDocument();
    });
    
    // Add to comparison
    const compareButton = screen.getByText('Compare');
    fireEvent.click(compareButton);
    
    // Verify vendor added to comparison
    expect(screen.getByText('1 vendor in comparison')).toBeInTheDocument();
  });
});
```

## **Development Workflow**

### **Code Quality Standards**
**ESLint + Prettier + TypeScript strict mode**

#### **ESLint Configuration**
```javascript
// .eslintrc.js
module.exports = {
  extends: [
    'next/core-web-vitals',
    '@typescript-eslint/recommended',
    'prettier'
  ],
  rules: {
    '@typescript-eslint/no-unused-vars': 'error',
    '@typescript-eslint/explicit-function-return-type': 'warn',
    'react-hooks/exhaustive-deps': 'error',
    'prefer-const': 'error'
  }
};
```

### **Git Workflow**
**Feature branch workflow with PR reviews**

```bash
# Development workflow
git checkout -b feature/vendor-card
# Develop and test
git add .
git commit -m "Add vendor card component with professional focus"
git push origin feature/vendor-card
# Create PR, review, merge
```

## **Deployment Strategy**

### **Vercel Integration**
**Automatic deployments with GitHub integration**

#### **Deployment Configuration**
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
      - run: npm run compile
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

## **Implementation Timeline**

### **Phase 1: Professional Creator Foundation (Weeks 1-8)**
1. **Weeks 1-2**: Core component architecture and vendor display
2. **Weeks 3-4**: Search and filtering system
3. **Weeks 5-6**: Comparison tools and basic interaction
4. **Weeks 7-8**: Testing and refinement

### **Phase 2: Enhanced User Experience (Weeks 9-20)**
1. **Weeks 9-12**: Add shadcn/ui components for better UX
2. **Weeks 13-16**: Implement progressive disclosure system
3. **Weeks 17-20**: Performance optimization and testing

### **Phase 3: User Type Expansion (Weeks 21-32)**
1. **Weeks 21-24**: Amateur experience implementation
2. **Weeks 25-28**: Agency experience implementation
3. **Weeks 29-32**: User type detection and switching

### **Phase 4: Advanced Features (Weeks 33+)**
1. **Weeks 33-36**: Add Radix primitives for complex interactions
2. **Weeks 37-40**: Advanced accessibility and performance
3. **Weeks 41+**: User testing and refinement

## **Success Metrics**

### **Performance Targets**
- **Initial Load**: < 2 seconds for professional creator experience
- **Search Response**: < 1 second for filtered results
- **Bundle Size**: < 500KB for professional features
- **Mobile Performance**: < 3 seconds on 3G connection

### **Quality Metrics**
- **Code Coverage**: 80%+ for critical components
- **Accessibility**: WCAG AA compliance
- **Cross-browser**: Support for Chrome, Firefox, Safari, Edge
- **Mobile**: Responsive design on all screen sizes

### **User Experience Metrics**
- **User Type Selection**: 90%+ users select appropriate type
- **Feature Discovery**: 80%+ users find and use comparison tools
- **Performance Satisfaction**: 4.5+ rating on speed and responsiveness
- **Accessibility**: 4.5+ rating from users with accessibility needs

## **Risk Mitigation**

### **Technical Risks**
- **Component Complexity**: Start simple, add complexity incrementally
- **Performance Issues**: Monitor bundle size and load times throughout development
- **User Type Confusion**: Clear user type selection with benefits explanation
- **Feature Bloat**: Focus on professional creator needs first

### **Timeline Risks**
- **Scope Creep**: Strict feature prioritization, MVP focus
- **Technical Challenges**: Research and prototype complex features early
- **Testing Overhead**: Automate testing where possible, focus on critical paths

### **User Experience Risks**
- **User Confusion**: Progressive disclosure with clear information hierarchy
- **Mobile Experience**: Mobile-first development approach
- **Accessibility**: Regular accessibility testing throughout development

This implementation guide provides a clear path from professional creator foundation to full user type expansion, with progressive enhancement based on actual needs rather than premature complexity. The approach ensures quality, performance, and maintainability while building toward the full vision outlined in Site.md.

