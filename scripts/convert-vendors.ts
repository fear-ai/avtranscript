#!/usr/bin/env tsx

import { writeFileSync } from 'fs';
import { parseCSVFileSync } from './utils/csv-parser';
import { getDataPath } from './utils/paths';
import { createLogger } from './utils/logger';
import { validateVendorData } from '../lib/validators/vendor'

async function convertVendorsToJson() {
  const logger = createLogger('convert-vendors.ts', 'CSV to JSON conversion')
  
  try {
    logger.progress('Converting vendor CSV to JSON')

    // Get file paths using unified path management
    const csvPath = getDataPath('vendors', 'csv')
    const jsonPath = getDataPath('vendors', 'json')
    
    logger.fileOperation('Reading', csvPath)
    
    // Parse CSV using unified parser
    const parsedData = parseCSVFileSync(csvPath)
    logger.csvParsed('vendors', parsedData.count, parsedData.headers)

    // Process vendor data with type conversion
    const vendors = parsedData.records.map(vendor => {
      const processed: Record<string, any> = {
        // Required fields - CSV has these
        id: vendor.id,
        name: vendor.name,
        slug: vendor.slug,                    // ← ADDED: Required by validator
        website: vendor.website,
        description: vendor.description,
        status: vendor.status,                // ← ADDED: Required by validator
        lastVerified: vendor.lastVerified,    // ← ADDED: Required by validator
        createdAt: vendor.createdAt,          // ← ADDED: Required by validator
        updatedAt: vendor.updatedAt,          // ← ADDED: Required by validator
        source: vendor.source,                // ← ADDED: Required by validator
        confidence: parseFloat(vendor.confidence) || 0,
        tier: vendor.tier,
        category: vendor.category,
        priority: parseInt(vendor.priority) || 50, // ← ADDED: Required by validator
        
        // Market position (optional)
        marketShare: vendor.marketShare,
        targetMarket: vendor.targetMarket,
        industryFocus: vendor.industryFocus,
        
        // Scores - fix mapping from flat CSV to nested structure
        vendorScore: {
          productMaturity: parseInt(vendor.vendorScore_productMaturity) || 0,
          companyStability: parseInt(vendor.vendorScore_companyStability) || 0,
          marketAdoption: parseInt(vendor.vendorScore_marketAdoption) || 0,
          total: parseInt(vendor.vendorScore_total) || 0
        },
        productScore: {
          features: parseInt(vendor.productScore_features) || 0,
          usability: parseInt(vendor.productScore_usability) || 0,
          accuracy: parseInt(vendor.productScore_accuracy) || 0,
          total: parseInt(vendor.productScore_total) || 0
        },
        overallScore: parseInt(vendor.overallScore) || 0,
        
        // Pricing - fix structure and add missing fields
        pricing: {
          model: vendor.pricing_model,
          plans: [], // ← ADDED: Empty array as default (now optional in validator)
          freeTier: {
            minutes: parseInt(vendor.pricing_freeTier_minutes) || 0,
            hours: parseInt(vendor.pricing_freeTier_hours) || 0
          },
          payPerUse: {
            aiPerMinute: parseFloat(vendor.pricing_payPerUse_aiPerMinute) || 0,
            humanPerMinute: parseFloat(vendor.pricing_payPerUse_humanPerMinute) || 0,
            perHour: parseFloat(vendor.pricing_payPerUse_perHour) || 0
          }
        },
        
        // Capabilities - fix mapping from flat CSV
        capabilities: {
          languages: vendor.capabilities_languages?.split(',').map((lang: string) => lang.trim()) || [],
          supportedFormats: vendor.capabilities_supportedFormats?.split(',').map((format: string) => format.trim()) || [],
          realTimeProcessing: vendor.capabilities_realTimeProcessing === 'true',
          speakerIdentification: vendor.capabilities_speakerIdentification === 'true',
          aiSummaries: vendor.capabilities_aiSummaries === 'true',
          teamCollaboration: vendor.capabilities_teamCollaboration === 'true',
          apiIntegration: vendor.capabilities_apiIntegration === 'true',
          sdkAvailable: vendor.capabilities_sdkAvailable === 'true',
          webhookSupport: vendor.capabilities_webhookSupport === 'true',
          customVocabulary: vendor.capabilities_customVocabulary === 'true',
          batchProcessing: vendor.capabilities_batchProcessing === 'true',
          liveStreaming: vendor.capabilities_liveStreaming === 'true'
        },
        
        // Use cases and targeting
        useCases: vendor.useCases?.split(',').map((useCase: string) => useCase.trim()) || [],
        bestFor: vendor.bestFor?.split(',').map((best: string) => best.trim()) || [],
        
        // Integrations - fix mapping from flat CSV
        integrations: {
          platforms: vendor.integrations_platforms?.split(',').map((platform: string) => platform.trim()) || [],
          cms: vendor.integrations_cms?.split(',').map((cms: string) => cms.trim()) || [],
          socialMedia: vendor.integrations_socialMedia?.split(',').map((social: string) => social.trim()) || [],
          analytics: vendor.integrations_analytics?.split(',').map((analytic: string) => analytic.trim()) || []
        },
        
        // Market position - fix mapping from flat CSV
        marketPosition: {
          tier: vendor.marketPosition_tier,
          priceRange: vendor.marketPosition_priceRange,
          targetAudience: vendor.marketPosition_targetAudience?.split(',').map((audience: string) => audience.trim()) || [],
          competitiveAdvantage: vendor.marketPosition_competitiveAdvantage?.split(',').map((advantage: string) => advantage.trim()) || [],
          marketSegment: vendor.marketPosition_marketSegment
        },
        
        // Partnerships - fix mapping from flat CSV
        partnerships: {
          hasAffiliateProgram: vendor.partnerships_hasAffiliateProgram === 'true',
          affiliatePlatform: vendor.partnerships_affiliatePlatform,
          commissionRange: vendor.partnerships_commissionRange,
          referralRewards: vendor.partnerships_referralRewards,
          partnerType: vendor.partnerships_partnerType,
          applicationProcess: vendor.partnerships_applicationProcess,
          notes: vendor.partnerships_notes
        }
      }

      return processed
    })

    logger.dataProcessed('vendors', vendors.length)

    // Validate data
    logger.progress('Validating vendor data')
    const validatedVendors = validateVendorData(vendors)
    logger.validationResult('vendors', validatedVendors.length)

    // Generate JSON with metadata
    const jsonData = {
      metadata: {
        generatedAt: new Date().toISOString(),
        totalVendors: validatedVendors.length,
        categories: Array.from(new Set(validatedVendors.map(v => v.category))),
        tiers: Array.from(new Set(validatedVendors.map(v => v.tier))),
        targetMarkets: Array.from(new Set(validatedVendors.map(v => v.targetMarket).filter(Boolean))),
        scoreRanges: {
          overall: {
            min: Math.min(...validatedVendors.map(v => v.overallScore || 0)),
            max: Math.max(...validatedVendors.map(v => v.overallScore || 0)),
            average: Math.round(validatedVendors.reduce((sum, v) => sum + (v.overallScore || 0), 0) / validatedVendors.length)
          },
          confidence: {
            min: Math.min(...validatedVendors.map(v => v.confidence || 0)),
            max: Math.max(...validatedVendors.map(v => v.confidence || 0)),
            average: Math.round(validatedVendors.reduce((sum, v) => sum + (v.confidence || 0), 0) / validatedVendors.length * 100) / 100
          }
        }
      },
      vendors: validatedVendors
    }

    // Write JSON file
    writeFileSync(jsonPath, JSON.stringify(jsonData, null, 2))
    logger.jsonGenerated('vendors', jsonPath, {
      totalVendors: jsonData.metadata.totalVendors,
      categories: jsonData.metadata.categories.length,
      tiers: jsonData.metadata.tiers.length
    })

    logger.completed('vendor CSV to JSON conversion')

  } catch (error: unknown) {
    logger.error('CSV to JSON conversion failed', error)
    process.exit(1)
  }
}

// Run conversion if this script is executed directly
if (require.main === module) {
  convertVendorsToJson()
}
