export interface Vendor {
  id: string
  name: string
  slug: string
  website: string
  description: string
  status: 'active' | 'inactive' | 'acquired' | 'discontinued'
  lastVerified: string
  createdAt: string
  updatedAt: string
  source: string
  confidence: number
  
  // Strategic categorization fields
  tier: 'premium' | 'mid-tier' | 'entry-level' | 'enterprise'
  category: 'selected' | 'recommended' | 'alternative' | 'monitoring' | 'deprecated'
  priority: number // 1-25 for sorting within categories
  
  // Extended company information
  logo?: string
  founded?: number
  headquarters?: string
  employeeCount?: string
  supportEmail?: string
  supportPhone?: string
  supportHours?: string
  
  // Market position indicators
  marketShare?: 'leader' | 'challenger' | 'niche' | 'emerging'
  targetMarket?: 'consumer' | 'professional' | 'enterprise' | 'agency'
  industryFocus?: 'general' | 'media' | 'legal' | 'healthcare' | 'education' | 'technology'
  
  // Research-based scoring (from TranscriptResearch.md)
  vendorScore?: {
    productMaturity: number // 1-5
    companyStability: number // 1-5
    marketAdoption: number // 1-5
    total: number // 15 max
  }
  
  productScore?: {
    features: number // 1-5
    usability: number // 1-5
    accuracy: number // 1-5
    total: number // 15 max
  }
  
  overallScore?: number // 30 max
  
  // Pricing information (from research)
  pricing?: {
    model: 'subscription' | 'pay-per-use' | 'hybrid' | 'free' | 'enterprise'
    plans: PricingPlan[]
    freeTier?: {
      minutes?: number
      hours?: number
      features?: string[]
    }
    payPerUse?: {
      aiPerMinute?: number
      humanPerMinute?: number
      perHour?: number
      perFile?: number
    }
  }
  
  // Service capabilities (from research)
  capabilities?: {
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
  
  // Use case targeting (from research)
  useCases?: string[]
  bestFor?: string[]
  
  // Integration information (from research)
  integrations?: {
    platforms: string[] // Zoom, Google Meet, Teams, etc.
    cms: string[] // WordPress, Drupal, etc.
    socialMedia: string[] // Buffer, Hootsuite, etc.
    analytics: string[] // Google Analytics, Mixpanel, etc.
  }
  
  // Market positioning (from research)
  marketPosition?: {
    tier: 'premium' | 'mid-tier' | 'entry-level'
    priceRange: string
    targetAudience: string[]
    competitiveAdvantage: string[]
    marketSegment: string
  }
  
  // Partnership information (from TranscriptAffiliate.md)
  partnerships?: {
    hasAffiliateProgram: boolean
    affiliatePlatform?: string // PartnerStack, Impact, etc.
    commissionRange?: string
    referralRewards?: string
    partnerType?: 'affiliate' | 'reseller' | 'referral' | 'co-seller' | 'none'
    applicationProcess?: string
    notes?: string
  }
}

export interface PricingPlan {
  name: string
  price: string
  billingCycle: 'monthly' | 'yearly' | 'quarterly' | 'one-time'
  features: string[]
  limitations?: string[]
}

export interface VendorFilters {
  status?: Vendor['status']
  tier?: Vendor['tier']
  category?: Vendor['category']
  marketShare?: Vendor['marketShare']
  targetMarket?: Vendor['targetMarket']
  industryFocus?: Vendor['industryFocus']
  search?: string
  page?: number
  limit?: number
}

export interface PaginatedVendors {
  vendors: Vendor[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

// Vendor category constants for easy reference
export const VENDOR_CATEGORIES = {
  SELECTED: 'selected' as const,      // Top 5 vendors - primary focus
  RECOMMENDED: 'recommended' as const, // Next 6 vendors - strong alternatives
  ALTERNATIVE: 'alternative' as const, // Remaining active vendors
  MONITORING: 'monitoring' as const,   // Vendors to watch for future inclusion
  DEPRECATED: 'deprecated' as const    // Inactive/discontinued vendors
} as const

export const VENDOR_TIERS = {
  PREMIUM: 'premium' as const,        // High-end, feature-rich services
  MID_TIER: 'mid-tier' as const,      // Balanced features and pricing
  ENTRY_LEVEL: 'entry-level' as const, // Basic services, low cost
  ENTERPRISE: 'enterprise' as const   // Large-scale, custom solutions
} as const
