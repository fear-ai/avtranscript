import { z } from 'zod'

// Nested schema for vendor scoring - relaxed to allow 0 scores
const vendorScoreSchema = z.object({
  productMaturity: z.number().min(0).max(5),    // Changed from min(1) to allow 0
  companyStability: z.number().min(0).max(5),   // Changed from min(1) to allow 0
  marketAdoption: z.number().min(0).max(5),     // Changed from min(1) to allow 0
  total: z.number().min(0).max(15)              // Changed from min(3) to allow 0
}).optional()

const productScoreSchema = z.object({
  features: z.number().min(0).max(5),           // Changed from min(1) to allow 0
  usability: z.number().min(0).max(5),          // Changed from min(1) to allow 0
  accuracy: z.number().min(0).max(5),           // Changed from min(1) to allow 0
  total: z.number().min(0).max(15)              // Changed from min(3) to allow 0
}).optional()

// Nested schema for pricing - relaxed to make plans optional
const pricingPlanSchema = z.object({
  name: z.string().min(1).max(100),
  price: z.string().min(1).max(50),
  billingCycle: z.enum(['monthly', 'yearly', 'quarterly', 'one-time']),
  features: z.array(z.string()),
  limitations: z.array(z.string()).optional()
})

const freeTierSchema = z.object({
  minutes: z.number().min(0).optional(),
  hours: z.number().min(0).optional(),
  features: z.array(z.string()).optional()
}).optional()

const payPerUseSchema = z.object({
  aiPerMinute: z.number().min(0).optional(),
  humanPerMinute: z.number().min(0).optional(),
  perHour: z.number().min(0).optional(),
  perFile: z.number().min(0).optional()
}).optional()

const pricingSchema = z.object({
  model: z.enum(['subscription', 'pay-per-use', 'hybrid', 'free', 'enterprise']),
  plans: z.array(pricingPlanSchema).optional(),  // Changed from required to optional
  freeTier: freeTierSchema,
  payPerUse: payPerUseSchema
}).optional()

// Nested schema for capabilities
const capabilitiesSchema = z.object({
  languages: z.array(z.string()),
  supportedFormats: z.array(z.string()),
  realTimeProcessing: z.boolean(),
  speakerIdentification: z.boolean(),
  aiSummaries: z.boolean(),
  teamCollaboration: z.boolean(),
  apiIntegration: z.boolean(),
  sdkAvailable: z.boolean(),
  webhookSupport: z.boolean(),
  customVocabulary: z.boolean(),
  batchProcessing: z.boolean(),
  liveStreaming: z.boolean()
}).optional()

// Nested schema for integrations
const integrationsSchema = z.object({
  platforms: z.array(z.string()),
  cms: z.array(z.string()),
  socialMedia: z.array(z.string()),
  analytics: z.array(z.string())
}).optional()

// Nested schema for market position
const marketPositionSchema = z.object({
  tier: z.enum(['premium', 'mid-tier', 'entry-level']),
  priceRange: z.string().min(1).max(100),
  targetAudience: z.array(z.string()),
  competitiveAdvantage: z.array(z.string()),
  marketSegment: z.string().min(1).max(200)
}).optional()

// Nested schema for partnerships
const partnershipsSchema = z.object({
  hasAffiliateProgram: z.boolean(),
  affiliatePlatform: z.string().optional(),
  commissionRange: z.string().optional(),
  referralRewards: z.string().optional(),
  partnerType: z.enum(['affiliate', 'reseller', 'referral', 'co-seller', 'none']).optional(),
  applicationProcess: z.string().optional(),
  notes: z.string().optional()
}).optional()

export const vendorSchema = z.object({
  id: z.string().regex(/^[a-z0-9-]+$/, 'ID must be lowercase with hyphens only'),
  name: z.string().min(1, 'Name is required').max(200, 'Name too long'),
  slug: z.string().regex(/^[a-z0-9-]+$/, 'Slug must be lowercase with hyphens only'),
  website: z.string().url('Must be a valid URL'),
  description: z.string().min(10, 'Description too short').max(2000, 'Description too long'),
  status: z.enum(['active', 'inactive', 'acquired', 'discontinued']),
  lastVerified: z.string().datetime('Must be valid ISO date'),
  createdAt: z.string().datetime('Must be valid ISO date'),
  updatedAt: z.string().datetime('Must be valid ISO date'),
  source: z.string().min(1, 'Source is required'),
  confidence: z.number().min(0).max(100, 'Confidence must be 0-100'),
  
  // Strategic categorization fields
  tier: z.enum(['premium', 'mid-tier', 'entry-level', 'enterprise']),
  category: z.enum(['selected', 'recommended', 'alternative', 'monitoring', 'deprecated']),
  priority: z.number().min(1).max(100, 'Priority must be 1-100'),
  
  // Extended company information (optional)
  logo: z.string().url().optional(),
  founded: z.number().min(1800).max(2030).optional(),
  headquarters: z.string().max(200).optional(),
  employeeCount: z.string().max(50).optional(),
  supportEmail: z.string().email().optional(),
  supportPhone: z.string().max(20).optional(),
  supportHours: z.string().max(100).optional(),
  
  // Market position indicators (optional)
  marketShare: z.enum(['leader', 'challenger', 'niche', 'emerging']).optional(),
  targetMarket: z.enum(['consumer', 'professional', 'enterprise', 'agency']).optional(),
  industryFocus: z.enum(['general', 'media', 'legal', 'healthcare', 'education', 'technology']).optional(),
  
  // Research-based scoring (optional)
  vendorScore: vendorScoreSchema,
  productScore: productScoreSchema,
  overallScore: z.number().min(0).max(30, 'Overall score must be 0-30').optional(),
  
  // Pricing information (optional)
  pricing: pricingSchema,
  
  // Service capabilities (optional)
  capabilities: capabilitiesSchema,
  
  // Use case targeting (optional)
  useCases: z.array(z.string()).optional(),
  bestFor: z.array(z.string()).optional(),
  
  // Integration information (optional)
  integrations: integrationsSchema,
  
  // Market positioning (optional)
  marketPosition: marketPositionSchema,
  
  // Partnership information (optional)
  partnerships: partnershipsSchema
})

export type VendorInput = z.infer<typeof vendorSchema>

export function validateVendorData(data: any[]): VendorInput[] {
  const results: VendorInput[] = []

  for (let i = 0; i < data.length; i++) {
    try {
      const validated = vendorSchema.parse(data[i])
      results.push(validated)
    } catch (error) {
      if (error instanceof z.ZodError) {
        console.error(`Validation error at row ${i + 1}:`, error.errors)
        throw new Error(`Row ${i + 1}: ${error.errors.map(e => e.message).join(', ')}`)
      }
      throw error
    }
  }

  return results
}
