import { z } from 'zod'

// Simplified affiliate schema for CSV validation
export const affiliateCsvSchema = z.object({
  vendorId: z.string().min(1, 'Vendor ID is required'),
  hasProgram: z.boolean(),
  programName: z.string().optional(),
  commissionRate: z.number().min(0).max(100, 'Commission rate must be 0-100'),
  commissionType: z.enum(['percentage', 'fixed', 'tiered', 'hybrid']),
  cookieDuration: z.number().min(0, 'Cookie duration must be 0 or positive'),
  minimumPayout: z.number().min(0, 'Minimum payout must be 0 or positive'),
  paymentSchedule: z.enum(['monthly', 'quarterly', 'weekly', 'on-demand']),
  status: z.enum(['active', 'pending', 'inactive', 'rejected', 'expired', 'suspended']),
  startDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Must be valid date in YYYY-MM-DD format').optional(),
  ftcCompliant: z.boolean(),
  disclosureRequired: z.boolean(),
  disclosureText: z.string().optional(),
  baseCommission: z.number().min(0).max(100, 'Base commission must be 0-100'),
  bonusCommission: z.number().min(0).max(100, 'Bonus commission must be 0-100'),
  totalClicks: z.number().min(0, 'Total clicks must be 0 or positive'),
  totalConversions: z.number().min(0, 'Total conversions must be 0 or positive'),
  conversionRate: z.number().min(0).max(100, 'Conversion rate must be 0-100'),
  totalRevenue: z.number().min(0, 'Total revenue must be 0 or positive'),
  totalCommission: z.number().min(0, 'Total commission must be 0 or positive'),
  pendingCommission: z.number().min(0, 'Pending commission must be 0 or positive'),
  lastUpdated: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Must be valid date in YYYY-MM-DD format'),
  confidence: z.number().min(0).max(100, 'Confidence must be 0-100'),
  source: z.string().min(1, 'Source is required')
})

export type AffiliateCsvInput = z.infer<typeof affiliateCsvSchema>

export function validateAffiliateData(data: any[]): AffiliateCsvInput[] {
  const results: AffiliateCsvInput[] = []

  for (let i = 0; i < data.length; i++) {
    try {
      const validated = affiliateCsvSchema.parse(data[i])
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
