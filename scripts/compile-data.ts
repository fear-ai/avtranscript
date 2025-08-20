import { readFileSync, writeFileSync } from 'fs'
import { join } from 'path'
import { Vendor } from '../lib/types/vendor'

interface VendorData {
  metadata: {
    generatedAt: string
    totalVendors: number
    categories: Record<string, number>
    tiers: Record<string, number>
  }
  vendors: Vendor[]
}

async function compileVendorData() {
  try {
    console.log('🔄 Starting vendor data compilation from JSON...')

    // Read JSON file (pre-converted from CSV)
    const jsonPath = join(__dirname, '../data/vendors.json')
    const jsonData = readFileSync(jsonPath, 'utf-8')
    const vendorData: VendorData = JSON.parse(jsonData)

    console.log(`📊 Loaded ${vendorData.vendors.length} vendors from JSON`)
    console.log(`📅 Data generated: ${vendorData.metadata.generatedAt}`)
    console.log(`📊 Category breakdown:`)
    Object.entries(vendorData.metadata.categories).forEach(([category, count]) => {
      console.log(`   ${category}: ${count}`)
    })

    // Generate TypeScript file
    const tsContent = generateTypeScriptFile(vendorData.vendors)

    // Write to lib/data/vendors.ts
    const outputPath = join(__dirname, '../lib/data/vendors.ts')
    writeFileSync(outputPath, tsContent)

    console.log(`📝 Generated TypeScript file: ${outputPath}`)
    console.log(`🎉 Successfully compiled ${vendorData.vendors.length} vendors`)

  } catch (error) {
    console.error('❌ Error compiling vendor data:', error)
    process.exit(1)
  }
}

function generateTypeScriptFile(vendors: Vendor[]): string {
  return `// Auto-generated file - do not edit manually
// Generated on: ${new Date().toISOString()}
// Total vendors: ${vendors.length}

import { Vendor } from '../types/vendor'

export const vendors: Vendor[] = ${JSON.stringify(vendors, null, 2)}

export type VendorId = Vendor['id']

// Helper functions
export function getVendorById(id: string): Vendor | undefined {
  return vendors.find(vendor => vendor.id === id)
}

export function getVendorBySlug(slug: string): Vendor | undefined {
  return vendors.find(vendor => vendor.slug === slug)
}

export function getActiveVendors(): Vendor[] {
  return vendors.filter(vendor => vendor.status === 'active')
}

export function searchVendors(query: string): Vendor[] {
  const lowerQuery = query.toLowerCase()
  return vendors.filter(vendor =>
    vendor.name.toLowerCase().includes(lowerQuery) ||
    vendor.description.toLowerCase().includes(lowerQuery)
  )
}

// Strategic categorization functions
export function getSelectedVendors(): Vendor[] {
  return vendors
    .filter(vendor => vendor.category === 'selected')
    .sort((a, b) => a.priority - b.priority)
}

export function getRecommendedVendors(): Vendor[] {
  return vendors
    .filter(vendor => vendor.category === 'recommended')
    .sort((a, b) => a.priority - b.priority)
}

export function getAlternativeVendors(): Vendor[] {
  return vendors
    .filter(vendor => vendor.category === 'alternative')
    .sort((a, b) => a.priority - b.priority)
}

export function getVendorsByTier(tier: Vendor['tier']): Vendor[] {
  return vendors
    .filter(vendor => vendor.tier === tier)
    .sort((a, b) => a.priority - b.priority)
}

export function getVendorsByCategory(category: Vendor['category']): Vendor[] {
  return vendors
    .filter(vendor => vendor.category === category)
    .sort((a, b) => a.priority - b.priority)
}

export function getVendorsByTargetMarket(targetMarket: Vendor['targetMarket']): Vendor[] {
  return vendors
    .filter(vendor => vendor.targetMarket === targetMarket)
    .sort((a, b) => a.priority - b.priority)
}

export function getVendorsByIndustryFocus(industryFocus: Vendor['industryFocus']): Vendor[] {
  return vendors
    .filter(vendor => vendor.industryFocus === industryFocus)
    .sort((a, b) => a.priority - b.priority)
}

// Top vendors by category
export const topSelectedVendors = getSelectedVendors()
export const topRecommendedVendors = getRecommendedVendors()
export const topAlternativeVendors = getAlternativeVendors()

// Category counts
export const categoryCounts = {
  selected: vendors.filter(v => v.category === 'selected').length,
  recommended: vendors.filter(v => v.category === 'recommended').length,
  alternative: vendors.filter(v => v.category === 'alternative').length,
  monitoring: vendors.filter(v => v.category === 'monitoring').length,
  deprecated: vendors.filter(v => v.category === 'deprecated').length
}

// Tier counts
export const tierCounts = {
  premium: vendors.filter(v => v.tier === 'premium').length,
  'mid-tier': vendors.filter(v => v.tier === 'mid-tier').length,
  'entry-level': vendors.filter(v => v.tier === 'entry-level').length,
  enterprise: vendors.filter(v => v.tier === 'enterprise').length
}
`
}

// Run compilation if this script is executed directly
if (require.main === module) {
  compileVendorData()
}
