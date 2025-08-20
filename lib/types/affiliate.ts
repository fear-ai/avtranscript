// Affiliate program data structures for the Transcript Platform
// This file defines affiliate information separate from vendor service data

// ============================================================================
// CORE AFFILIATE ENTITIES
// ============================================================================

export interface VendorAffiliate {
  // Reference to main vendor
  vendorId: string
  
  // Basic affiliate program details
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

// ============================================================================
// UTILITY TYPES
// ============================================================================

export type AffiliateId = VendorAffiliate['vendorId']

// ============================================================================
// FILTER AND SEARCH TYPES
// ============================================================================

export interface AffiliateFilters {
  // Program filters
  hasProgram?: boolean
  commissionRate?: {
    min?: number
    max?: number
  }
  paymentSchedule?: 'monthly' | 'quarterly' | 'annually' | 'on-demand'
  
  // Partnership filters
  status?: 'active' | 'pending' | 'inactive' | 'suspended'
  
  // Performance filters
  minConversionRate?: number
  minRevenue?: number
  
  // Compliance filters
  ftcCompliant?: boolean
  disclosureRequired?: boolean
  
  // Search
  search?: string
  page?: number
  limit?: number
}

export interface AffiliateSearchResult {
  affiliates: VendorAffiliate[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
  filters: AffiliateFilters
  metadata: {
    searchTime: number
    resultCount: number
    statusBreakdown: Record<string, number>
    performanceBreakdown: {
      highPerforming: number
      mediumPerforming: number
      lowPerforming: number
    }
  }
}

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

export function isActiveAffiliate(affiliate: VendorAffiliate): boolean {
  return affiliate.status === 'active'
}

export function hasHighPerformance(affiliate: VendorAffiliate): boolean {
  return affiliate.conversionRate > 5 && affiliate.totalRevenue > 1000
}

export function isCompliant(affiliate: VendorAffiliate): boolean {
  const ftc = Boolean(affiliate.ftcCompliant)
  const disclosure = Boolean(affiliate.disclosureRequired)
  const text = Boolean(affiliate.disclosureText)
  return ftc && disclosure && text
}

export function calculateEffectiveCommission(affiliate: VendorAffiliate): number {
  const base = affiliate.commissionRate || 0
  const bonus = affiliate.bonusCommission || 0
  return base + bonus
}
