# Complexity Level System - Progressive Enhancement

This directory contains a complete implementation of the complexity level system with progressive enhancement as outlined in `SiteImplement.md`.

## 🏗️ Architecture Overview

The system implements progressive enhancement with three complexity levels:
- **Low (Basic)**: Essential information, works everywhere
- **Mid (Standard)**: Enhanced features, moderate complexity
- **High (Advanced)**: Full feature set, enterprise capabilities

## 📁 Directory Structure

```
├── components/
│   ├── vendor/
│   │   ├── BasicVendorCard.tsx      # Phase 1: Basic functionality
│   │   ├── ResponsiveVendorCard.tsx # Phase 2: Responsive behavior
│   │   ├── EnhancedVendorCard.tsx   # Phase 3: Complexity levels
│   │   ├── SmartVendorCard.tsx      # Auto-adapting component
│   │   └── VendorList.tsx           # List wrapper
│   └── App.tsx                      # Main demo component
├── hooks/
│   ├── complexity/
│   │   └── useComplexityLevel.ts    # Complexity level management
│   └── context/
│       └── useDisplayContext.ts     # Display context detection
├── providers/
│   └── ComplexityProvider.tsx       # React context provider
├── types/
│   ├── complexity/
│   │   └── index.ts                 # Complexity type definitions
│   ├── context/
│   │   └── index.ts                 # Context type definitions
│   └── vendor/
│       └── index.ts                 # Vendor type definitions
└── utils/
    ├── complexity/
    │   └── config.ts                # Complexity level configuration
    └── context/
        └── config.ts                # Display context configuration
```

## 🚀 Implementation Phases

### Phase 1: Basic Foundation (Week 1-2)
```typescript
import { BasicVendorCard } from './components/vendor/BasicVendorCard';

// Simple component that works everywhere
<BasicVendorCard vendor={vendor} />
```

### Phase 2: Context Detection (Week 3-4)
```typescript
import { ResponsiveVendorCard } from './components/vendor/ResponsiveVendorCard';

// Automatically adapts to device context
<ResponsiveVendorCard vendor={vendor} />
```

### Phase 3: Complexity Levels (Week 5-6)
```typescript
import { EnhancedVendorCard } from './components/vendor/EnhancedVendorCard';
import { ComplexityProvider } from './providers/ComplexityProvider';

// Full complexity level system
<ComplexityProvider>
  <EnhancedVendorCard vendor={vendor} />
</ComplexityProvider>
```

## 🎯 Usage Examples

### Basic Usage
```typescript
import { VendorList } from './components/vendor/VendorList';

const vendors = [/* your vendor data */];

<VendorList vendors={vendors} />
```

### With Custom Complexity
```typescript
import { ComplexityProvider } from './providers/ComplexityProvider';
import { EnhancedVendorCard } from './components/vendor/EnhancedVendorCard';

<ComplexityProvider initialLevel="high">
  <EnhancedVendorCard vendor={vendor} />
</ComplexityProvider>
```

### Auto-Adapting Component
```typescript
import { SmartVendorCard } from './components/vendor/SmartVendorCard';

// Automatically chooses appropriate complexity
<SmartVendorCard vendor={vendor} userPreference="mid" />
```

## 🔧 Configuration

### Complexity Levels
```typescript
// utils/complexity/config.ts
export const complexityLevels = {
  low: {
    displayName: 'Basic',
    features: ['core_details', 'basic_pricing'],
    maxItems: 3
  },
  mid: {
    displayName: 'Standard', 
    features: ['detailed_features', 'comparison_tools'],
    maxItems: 6
  },
  high: {
    displayName: 'Advanced',
    features: ['enterprise_features', 'api_integration'],
    maxItems: 10
  }
};
```

### Display Contexts
```typescript
// utils/context/config.ts
export const displayConfigs = {
  mobile: {
    availableLevels: ['low', 'mid'],
    defaultLevel: 'low'
  },
  desktop: {
    availableLevels: ['low', 'mid', 'high'],
    defaultLevel: 'mid'
  }
};
```

## 🎨 Customization

### Adding New Complexity Levels
1. Update `types/complexity/index.ts`
2. Add configuration in `utils/complexity/config.ts`
3. Update components to handle new levels

### Adding New Display Contexts
1. Update `types/context/index.ts`
2. Add configuration in `utils/context/config.ts`
3. Update context detection logic

### Custom Vendor Cards
1. Create new component in `components/vendor/`
2. Implement required props interface
3. Add to `SmartVendorCard` logic if needed

## 🧪 Testing

### Component Testing
```typescript
import { render, screen } from '@testing-library/react';
import { BasicVendorCard } from './components/vendor/BasicVendorCard';

test('renders vendor information', () => {
  render(<BasicVendorCard vendor={mockVendor} />);
  expect(screen.getByText(mockVendor.name)).toBeInTheDocument();
});
```

### Context Testing
```typescript
import { renderHook } from '@testing-library/react';
import { useDisplayContext } from './hooks/context/useDisplayContext';

test('detects mobile context', () => {
  // Mock window.innerWidth
  Object.defineProperty(window, 'innerWidth', { value: 375 });
  
  const { result } = renderHook(() => useDisplayContext());
  expect(result.current.context).toBe('mobile');
});
```

## 📱 Responsive Behavior

- **Mobile (< 768px)**: Basic + Standard levels
- **Tablet (768px - 1024px)**: Basic + Standard levels  
- **Desktop (> 1024px)**: All three levels
- **Embedded/Widget**: Basic only

## 🔄 Progressive Enhancement

1. **Start Simple**: Basic functionality works everywhere
2. **Enhance Gradually**: Add features based on context capabilities
3. **User Control**: Users can adjust complexity level
4. **Performance**: Only load features needed for current context

## 🚀 Next Steps

1. **Integrate with existing data**: Connect to your vendor data source
2. **Add more components**: Expand beyond vendor cards
3. **Performance optimization**: Implement code splitting for complexity levels
4. **User preferences**: Persist user complexity level choices
5. **Analytics**: Track complexity level usage and user behavior

## 📚 Related Documentation

- `SiteImplement.md` - Implementation strategy and technical details
- `Site.md` - User experience requirements and design goals
- `PhaseI.md` - Data infrastructure and build system
- `STATUS.md` - Open questions and technical decisions
