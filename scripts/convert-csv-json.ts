import { readFileSync, writeFileSync } from 'fs'
import { join } from 'path'
import { validateVendorData } from '../lib/validators/vendor'

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
  
  // Add the last field
  result.push(current.trim())
  
  return result
}

async function convertCsvToJson() {
  try {
    console.log('Converting CSV to JSON...')

    // Read CSV file
    const csvPath = join(__dirname, '../data/vendors.csv')
    const csvData = readFileSync(csvPath, 'utf-8')

    // Parse CSV manually with proper quoted field handling
    const lines = csvData.split('\n').filter(line => line.trim())
    const headers = parseCSVLine(lines[0])
    const vendors = lines.slice(1).map(line => {
      const values = parseCSVLine(line)
      const vendor: Record<string, any> = {}
      
      headers.forEach((header, index) => {
        let value: any = values[index] || ''
        
        // Remove quotes from value
        value = value.replace(/^"|"$/g, '')
        
        // Convert numeric fields
        if (header === 'confidence' || header === 'priority' || header === 'founded') {
          value = parseInt(value) || 0
        }
        
        // Handle nested fields
        if (header.includes('_')) {
          const [parent, child] = header.split('_', 2)
          if (!vendor[parent]) {
            vendor[parent] = {}
          }
          vendor[parent][child] = value
        } else {
          vendor[header] = value
        }
      })
      
      return vendor
    })

    console.log(`Parsed ${vendors.length} vendors from CSV`)

    // Debug: Check the first vendor's parsed data
    const firstVendor = vendors[0]
    console.log('Debug - First vendor parsed data:')
    console.log('  marketPosition:', firstVendor.marketPosition)
    console.log('  partnerships:', firstVendor.partnerships)
    console.log('  capabilities:', firstVendor.capabilities)

    // Process nested fields to create proper structures
    const processedVendors = vendors.map(vendor => {
      const processed: Record<string, any> = { ...vendor }
      
      // Process vendor scoring
      if (vendor.vendorScore) {
        processed.vendorScore = {
          productMaturity: parseInt(vendor.vendorScore.productMaturity) || 0,
          companyStability: parseInt(vendor.vendorScore.companyStability) || 0,
          marketAdoption: parseInt(vendor.vendorScore.marketAdoption) || 0,
          total: parseInt(vendor.vendorScore.total) || 0
        }
        delete processed.vendorScore_productMaturity
        delete processed.vendorScore_companyStability
        delete processed.vendorScore_marketAdoption
        delete processed.vendorScore_total
      }
      
      // Process product scoring
      if (vendor.productScore) {
        processed.productScore = {
          features: parseInt(vendor.productScore.features) || 0,
          usability: parseInt(vendor.productScore.usability) || 0,
          accuracy: parseInt(vendor.productScore.accuracy) || 0,
          total: parseInt(vendor.productScore.total) || 0
        }
        delete processed.productScore_features
        delete processed.productScore_usability
        delete processed.productScore_accuracy
        delete processed.productScore_total
      }
      
      // Process overall score
      if (vendor.overallScore) {
        processed.overallScore = parseInt(vendor.overallScore) || 0
      }
      
      // Process pricing
      if (vendor.pricing) {
        processed.pricing = {
          model: vendor.pricing.model || 'subscription',
          plans: [], // Will be populated from separate data if needed
          freeTier: {
            minutes: parseInt(vendor.pricing.minutes) || 0,
            hours: parseInt(vendor.pricing.hours) || 0
          },
          payPerUse: {
            aiPerMinute: parseFloat(vendor.pricing.aiPerMinute) || 0,
            humanPerMinute: parseFloat(vendor.pricing.humanPerMinute) || 0,
            perHour: parseFloat(vendor.pricing.perHour) || 0
          }
        }
        delete processed.pricing_minutes
        delete processed.pricing_hours
        delete processed.pricing_aiPerMinute
        delete processed.pricing_humanPerMinute
        delete processed.pricing_perHour
      }
      
      // Process capabilities - handle the languages field specially
      if (vendor.capabilities) {
        processed.capabilities = {
          languages: vendor.capabilities.languages ? vendor.capabilities.languages.split(',') : [],
          supportedFormats: vendor.capabilities.supportedFormats ? vendor.capabilities.supportedFormats.split(',') : [],
          realTimeProcessing: vendor.capabilities.realTimeProcessing === 'true',
          speakerIdentification: vendor.capabilities.speakerIdentification === 'true',
          aiSummaries: vendor.capabilities.aiSummaries === 'true',
          teamCollaboration: vendor.capabilities.teamCollaboration === 'true',
          apiIntegration: vendor.capabilities.apiIntegration === 'true',
          sdkAvailable: vendor.capabilities.sdkAvailable === 'true',
          webhookSupport: vendor.capabilities.webhookSupport === 'true',
          customVocabulary: vendor.capabilities.customVocabulary === 'true',
          batchProcessing: vendor.capabilities.batchProcessing === 'true',
          liveStreaming: vendor.capabilities.liveStreaming === 'true'
        }
        delete processed.capabilities_languages
        delete processed.capabilities_supportedFormats
        delete processed.capabilities_realTimeProcessing
        delete processed.capabilities_speakerIdentification
        delete processed.capabilities_aiSummaries
        delete processed.capabilities_teamCollaboration
        delete processed.capabilities_apiIntegration
        delete processed.capabilities_sdkAvailable
        delete processed.capabilities_webhookSupport
        delete processed.capabilities_customVocabulary
        delete processed.capabilities_batchProcessing
        delete processed.capabilities_liveStreaming
      }
      
      // Process use cases and best for
      if (vendor.useCases) {
        processed.useCases = vendor.useCases.split(',')
        delete processed.useCases
      }
      if (vendor.bestFor) {
        processed.bestFor = vendor.bestFor.split(',')
        delete processed.bestFor
      }
      
      // Process integrations
      if (vendor.integrations) {
        processed.integrations = {
          platforms: vendor.integrations.platforms ? vendor.integrations.platforms.split(',') : [],
          cms: vendor.integrations.cms ? vendor.integrations.cms.split(',') : [],
          socialMedia: vendor.integrations.socialMedia ? vendor.integrations.socialMedia.split(',') : [],
          analytics: vendor.integrations.analytics ? vendor.integrations.analytics.split(',') : []
        }
        delete processed.integrations_platforms
        delete processed.integrations_cms
        delete processed.integrations_socialMedia
        delete processed.integrations_analytics
      }
      
      // Process market position
      if (vendor.marketPosition) {
        processed.marketPosition = {
          tier: vendor.marketPosition.tier || 'mid-tier',
          priceRange: vendor.marketPosition.priceRange || '',
          targetAudience: vendor.marketPosition.targetAudience ? vendor.marketPosition.targetAudience.split(',') : [],
          competitiveAdvantage: vendor.marketPosition.competitiveAdvantage ? vendor.marketPosition.competitiveAdvantage.split(',') : [],
          marketSegment: vendor.marketPosition.marketSegment || ''
        }
        delete processed.marketPosition_tier
        delete processed.marketPosition_priceRange
        delete processed.marketPosition_targetAudience
        delete processed.marketPosition_competitiveAdvantage
        delete processed.marketPosition_marketSegment
      }
      
      // Process partnerships
      if (vendor.partnerships) {
        processed.partnerships = {
          hasAffiliateProgram: vendor.partnerships.hasAffiliateProgram === 'true',
          affiliatePlatform: vendor.partnerships.affiliatePlatform || undefined,
          commissionRange: vendor.partnerships.commissionRange || undefined,
          referralRewards: vendor.partnerships.referralRewards || undefined,
          partnerType: vendor.partnerships.partnerType || undefined,
          applicationProcess: vendor.partnerships.applicationProcess || undefined,
          notes: vendor.partnerships.notes || undefined
        }
        delete processed.partnerships_hasAffiliateProgram
        delete processed.partnerships_affiliatePlatform
        delete processed.partnerships_commissionRange
        delete processed.partnerships_referralRewards
        delete processed.partnerships_partnerType
        delete processed.partnerships_applicationProcess
        delete processed.partnerships_notes
      }
      
      return processed
    })

    console.log(`Processed ${processedVendors.length} vendors with nested fields`)

    // Debug: Check the first vendor's processed data
    const firstProcessed = processedVendors[0]
    console.log('Debug - First vendor processed data:')
    console.log('  marketPosition:', firstProcessed.marketPosition)
    console.log('  partnerships:', firstProcessed.partnerships)

    // Validate data
    const validatedVendors = validateVendorData(processedVendors)
    console.log(`Validated ${validatedVendors.length} vendors`)

    // Generate JSON with metadata
    const jsonData = {
      metadata: {
        generatedAt: new Date().toISOString(),
        totalVendors: validatedVendors.length,
        categories: {
          selected: validatedVendors.filter(v => v.category === 'selected').length,
          recommended: validatedVendors.filter(v => v.category === 'recommended').length,
          alternative: validatedVendors.filter(v => v.category === 'alternative').length,
          monitoring: validatedVendors.filter(v => v.category === 'monitoring').length,
          deprecated: validatedVendors.filter(v => v.category === 'deprecated').length
        },
        tiers: {
          premium: validatedVendors.filter(v => v.tier === 'premium').length,
          'mid-tier': validatedVendors.filter(v => v.tier === 'mid-tier').length,
          'entry-level': validatedVendors.filter(v => v.tier === 'entry-level').length,
          enterprise: validatedVendors.filter(v => v.tier === 'enterprise').length
        },
        affiliatePrograms: {
          active: validatedVendors.filter(v => v.partnerships?.hasAffiliateProgram).length,
          inactive: validatedVendors.filter(v => !v.partnerships?.hasAffiliateProgram).length
        },
        scoring: {
          highScore: validatedVendors.filter(v => (v.overallScore || 0) >= 25).length,
          mediumScore: validatedVendors.filter(v => (v.overallScore || 0) >= 15 && (v.overallScore || 0) < 25).length,
          lowScore: validatedVendors.filter(v => (v.overallScore || 0) < 15).length
        }
      },
      vendors: validatedVendors
    }

    // Write JSON file
    const jsonPath = join(__dirname, '../data/vendors.json')
    writeFileSync(jsonPath, JSON.stringify(jsonData, null, 2))

    console.log(`Generated JSON file: ${jsonPath}`)
    console.log(`Category breakdown:`)
    console.log(`   Selected: ${jsonData.metadata.categories.selected}`)
    console.log(`   Recommended: ${jsonData.metadata.categories.recommended}`)
    console.log(`   Alternative: ${jsonData.metadata.categories.alternative}`)
    console.log(`Affiliate programs: ${jsonData.metadata.affiliatePrograms.active} active`)
    console.log(`Scoring breakdown: ${jsonData.metadata.scoring.highScore} high, ${jsonData.metadata.scoring.mediumScore} medium, ${jsonData.metadata.scoring.lowScore} low`)
    console.log(`Successfully converted CSV to JSON`)

  } catch (error) {
    console.error('Error converting CSV to JSON:', error)
    process.exit(1)
  }
}

// Run conversion if this script is executed directly
if (require.main === module) {
  convertCsvToJson()
}
