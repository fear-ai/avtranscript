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
        id: vendor.id,
        name: vendor.name,
        description: vendor.description,
        website: vendor.website,
        category: vendor.category,
        targetMarket: vendor.targetMarket,
        pricing: {
          freeTier: {
            minutes: parseInt(vendor.pricing?.freeTier?.minutes) || 0,
            hours: parseInt(vendor.pricing?.freeTier?.hours) || 0
          },
          paidTier: {
            aiPerMinute: parseFloat(vendor.pricing?.paidTier?.aiPerMinute) || 0,
            humanPerMinute: parseFloat(vendor.pricing?.paidTier?.humanPerMinute) || 0,
            perHour: parseFloat(vendor.pricing?.paidTier?.perHour) || 0
          }
        },
        features: {
          realTimeProcessing: vendor.features?.realTimeProcessing === 'true',
          speakerIdentification: vendor.features?.speakerIdentification === 'true',
          languageSupport: vendor.features?.languageSupport?.split(',').map((lang: string) => lang.trim()) || [],
          exportFormats: vendor.features?.exportFormats?.split(',').map((format: string) => format.trim()) || []
        },
        vendorScore: {
          productMaturity: parseInt(vendor.vendorScore?.productMaturity) || 0,
          companyStability: parseInt(vendor.vendorScore?.companyStability) || 0,
          marketAdoption: parseInt(vendor.vendorScore?.marketAdoption) || 0,
          total: parseInt(vendor.vendorScore?.total) || 0
        },
        productScore: {
          features: parseInt(vendor.productScore?.features) || 0,
          usability: parseInt(vendor.productScore?.usability) || 0,
          accuracy: parseInt(vendor.productScore?.accuracy) || 0,
          total: parseInt(vendor.productScore?.total) || 0
        },
        overallScore: parseInt(vendor.overallScore) || 0,
        confidence: parseFloat(vendor.confidence) || 0,
        tier: vendor.tier,
        lastUpdated: vendor.lastUpdated
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
