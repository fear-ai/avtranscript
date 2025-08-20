# Transcript Platform - Design & Architecture

## 🏗️ **Architecture Pattern**
The application follows a **data-driven, build-time compilation** architecture with a clear separation between data processing and application logic.

## 📁 **Directory Structure**

### **Root Level**
```
avtranscript/
├── data/           # Raw CSV data files
├── lib/            # Core application logic
├── scripts/        # Data processing pipeline
├── pages/          # Next.js pages (Pages Router)
├── components/     # React components
├── styles/         # CSS and styling
├── docs/           # Documentation
└── .next/          # Next.js build output
```

## 🔄 **Data Pipeline Architecture**

### **1. Data Sources (`/data/`)**
- **`vendors.csv`** - Comprehensive vendor information (25 vendors)
- **`affiliates.csv`** - Affiliate program details (25 records)

### **2. Data Processing (`/scripts/`)**
The application uses a **multi-stage data pipeline**:

```
CSV → JSON → TypeScript → Next.js Application
```

**Scripts:**
- **`convert-csv-json.ts`** - Converts vendor CSV to structured JSON
- **`convert-affiliate-json.ts`** - Converts affiliate CSV to JSON  
- **`compile-data.ts`** - Compiles JSON into TypeScript data files
- **`validate-data.ts`** - Validates vendor data integrity
- **`validate-affiliates.ts`** - Validates affiliate data integrity

### **3. Data Compilation (`/lib/data/`)**
- **`vendors.ts`** - Generated TypeScript file with vendor data
- **`affiliates.ts`** - Generated TypeScript file with affiliate data

## 🏛️ **Core Library Structure (`/lib/`)**

### **Types (`/lib/types/`)**
- **`vendor.ts`** - Vendor interface with nested data structures
- **`affiliate.ts`** - Simplified affiliate interface matching CSV structure

### **Validators (`/lib/validators/`)**
- **`vendor.ts`** - Zod schemas for vendor data validation
- **`affiliate.ts`** - Zod schemas for affiliate data validation

## 🌐 **Frontend Architecture**

### **Pages Router (`/pages/`)**
- **`index.tsx`** - Main landing page
- **`about.tsx`** - About page
- **`/api/`** - API routes
- **`/users/`** - User management pages

### **Components (`/components/`)**
- React components for UI rendering
- Reusable component library

## 🔧 **Build System**

The application uses a **multi-stage build process** that converts raw CSV data into optimized TypeScript files:

1. **Data Conversion** - CSV → JSON with nested object creation
2. **Data Validation** - Zod schema validation for data integrity
3. **TypeScript Generation** - JSON → TypeScript data files for application use
4. **Next.js Build** - Application compilation with static data integration

*For specific npm commands and build scripts, see the project README.md*

## 📊 **Data Model Design**

### **Vendor Data Structure**
The vendor interface uses **nested data structures** with underscore notation in CSV:

```typescript
interface Vendor {
  // Basic info
  id: string
  name: string
  slug: string
  
  // Nested scoring
  vendorScore: {
    productMaturity: number
    companyStability: number
    marketAdoption: number
    total: number
  }
  
  // Nested pricing
  pricing: {
    model: string
    freeTier: { minutes: number, hours: number }
    payPerUse: { aiPerMinute: number, humanPerMinute: number }
  }
  
  // Nested capabilities
  capabilities: {
    languages: string[]
    supportedFormats: string[]
    realTimeProcessing: boolean
    speakerIdentification: boolean
    aiSummaries: boolean
    teamCollaboration: boolean
    apiIntegration: boolean
    sdkAvailable: boolean
    webhookSupport: boolean
    customVocabulary: boolean
    batchProcessing: boolean
    liveStreaming: boolean
  }
  
  // Nested integrations
  integrations: {
    platforms: string[]
    cms: string[]
    socialMedia: string[]
    analytics: string[]
  }
  
  // Nested market position
  marketPosition: {
    tier: 'premium' | 'mid-tier' | 'entry-level'
    priceRange: string
    targetAudience: string[]
    competitiveAdvantage: string[]
    marketSegment: string
  }
  
  // Nested partnerships
  partnerships: {
    hasAffiliateProgram: boolean
    affiliatePlatform?: string
    commissionRange?: string
    referralRewards?: string
    partnerType?: 'affiliate' | 'reseller' | 'referral' | 'co-seller' | 'none'
    applicationProcess?: string
    notes?: string
  }
}
```

### **Affiliate Data Structure**
Simplified flat structure matching CSV:

```typescript
interface VendorAffiliate {
  vendorId: string
  hasProgram: boolean
  programName?: string
  commissionRate: number
  commissionType: 'percentage' | 'fixed' | 'hybrid'
  cookieDuration: number
  minimumPayout: number
  paymentSchedule: 'monthly' | 'quarterly' | 'annually' | 'on-demand'
  status: 'active' | 'pending' | 'inactive' | 'suspended'
  startDate?: string
  
  // Compliance fields (flat structure to match CSV)
  ftcCompliant: boolean
  disclosureRequired: boolean
  disclosureText?: string
  
  // Performance metrics (flat structure to match CSV)
  baseCommission: number
  bonusCommission: number
  totalClicks: number
  totalConversions: number
  conversionRate: number
  totalRevenue: number
  totalCommission: number
  pendingCommission: number
  
  // Metadata
  lastUpdated: string
  confidence: number
  source: string
}
```

## 🎯 **Key Design Principles**

### **1. Data Separation**
- **Vendor data** and **affiliate data** are completely separate
- Different data models for different business concerns
- Clean separation of concerns

### **2. Build-Time Data Processing**
- Data is processed at build time, not runtime
- Static data files for performance
- No database queries during user interactions

### **3. Type Safety**
- Full TypeScript coverage
- Zod validation for data integrity
- Compile-time error checking

### **4. CSV-First Design**
- Raw data stored in human-readable CSV format
- Version control friendly
- Easy to edit and maintain

### **5. Nested Data Strategy**
- Uses underscore notation in CSV headers (`parent_child`)
- Converts flat CSV to nested JSON objects
- Maintains CSV simplicity while providing rich data structures

## 🔄 **Data Flow Architecture**

### **Data Processing Pipeline**
```
Raw CSV Data → Parsing → Validation → JSON → TypeScript → Application
     ↓              ↓         ↓        ↓        ↓          ↓
vendors.csv   parseCSV   Zod      vendors.json  vendors.ts  React
affiliates.csv  parseCSV   Zod      affiliates.json affiliates.ts  Components
```

### **CSV to JSON Conversion Strategy**
The conversion script (`convert-csv-json.ts`) implements:

1. **Manual CSV Parsing** - Handles quoted fields and comma-separated lists
2. **Field Mapping** - Converts underscore notation to nested objects
3. **Type Conversion** - Converts strings to appropriate types (boolean, number, array)
4. **Validation** - Ensures data integrity with Zod schemas

### **Nested Field Examples**
```csv
# CSV Header (flat)
vendorScore_productMaturity,vendorScore_companyStability

# JSON Output (nested)
{
  "vendorScore": {
    "productMaturity": 5,
    "companyStability": 5
  }
}
```

## 🛠️ **Development Workflow**

### **Adding New Data**
1. Edit CSV files in `/data/`
2. Run `npm run prebuild` to regenerate TypeScript
3. Data automatically available in application

### **Modifying Data Structure**
1. Update TypeScript interfaces in `/lib/types/`
2. Update Zod validators in `/lib/validators/`
3. Update conversion scripts if needed
4. Regenerate data with `npm run prebuild`

### **Running the Application**
- **Development**: `npm run dev` (http://localhost:3000)
- **Build**: `npm run build`
- **Production**: `npm start`

*For complete command reference and quick start guide, see the project README.md*

## 📊 **Current Data Status**

### **Vendor Data**
- **25 vendors** with comprehensive information
- **Scoring system**: Product maturity, company stability, market adoption
- **Pricing models**: Pay-per-use, subscription, hybrid
- **Capabilities**: Languages, formats, features, integrations
- **Market positioning**: Tier, target audience, competitive advantages
- **Partnerships**: Affiliate programs, commission structures

### **Affiliate Data**
- **25 affiliate records** with program details
- **Program information**: Commission rates, payment schedules
- **Compliance**: FTC compliance, disclosure requirements
- **Performance metrics**: Clicks, conversions, revenue tracking

## 🔍 **Technical Implementation Details**

### **CSV Parsing Strategy**
```typescript
// Helper function to properly parse CSV with quoted fields
function parseCSVLine(line: string): string[] {
  const result: string[] = []
  let current = ''
  let inQuotes = false

  for (let i = 0; i < line.length; i++) {
    const char = line[i]
    
    if (char === '"') {
      inQuotes = !inQuotes
    } else if (char === ',' && !inQuotes) {
      result.push(current.trim())
      current = ''
    } else {
      current += char
    }
  }
  
  result.push(current.trim())
  return result
}
```

### **Nested Object Creation**
```typescript
// Convert flat CSV fields to nested JSON objects
function createNestedObject(flatData: Record<string, any>): Record<string, any> {
  const result: Record<string, any> = {}
  
  for (const [key, value] of Object.entries(flatData)) {
    if (key.includes('_')) {
      const [parent, child] = key.split('_', 2)
      if (!result[parent]) result[parent] = {}
      result[parent][child] = value
    } else {
      result[key] = value
    }
  }
  
  return result
}
```

## 🚀 **Future Architecture Considerations**

### **Phase II Enhancements**
- **Database Integration** - Move from static files to PostgreSQL/MySQL
- **API Layer** - RESTful endpoints for dynamic data
- **Real-time Updates** - WebSocket connections for live data
- **User Authentication** - NextAuth.js integration

### **Phase III Advanced Features**
- **Search & Filtering** - Elasticsearch or similar
- **Analytics Dashboard** - Performance metrics and insights
- **Admin Panel** - Data management interface
- **Multi-tenant Support** - Organization-specific views

## 📈 **Performance Characteristics**

### **Build Time**
- **Data Processing**: ~2-3 seconds for 25 vendors + 25 affiliates
- **TypeScript Compilation**: ~1-2 seconds
- **Next.js Build**: ~5-10 seconds

### **Runtime Performance**
- **Static Data Loading**: Instant (pre-compiled)
- **Page Rendering**: <100ms (static generation)
- **Bundle Size**: Optimized with Next.js tree-shaking

## 🔒 **Security Considerations**

### **Data Validation**
- **Input Sanitization** - Zod schema validation
- **Type Safety** - TypeScript compile-time checks
- **CSV Injection Prevention** - Controlled data sources

### **Build Security**
- **No Runtime Data Processing** - Reduces attack surface
- **Static File Generation** - No dynamic code execution
- **Environment Variable Protection** - Sensitive data isolation

---

*This document captures the current architecture and design decisions for the Transcript Platform. The system is designed for maintainability, type safety, and performance while providing a solid foundation for future enhancements.*
