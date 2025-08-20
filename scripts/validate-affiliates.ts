import { readFileSync } from 'fs'
import { join } from 'path'
import { affiliateCsvSchema } from '../lib/validators/affiliate'

interface AffiliateData {
  metadata: {
    generatedAt: string
    totalAffiliates: number
    programStatus: Record<string, number>
    affiliatePrograms: Record<string, number>
    compliance: Record<string, number>
    performance: Record<string, number>
  }
  affiliates: any[]
}

async function validateAffiliateData() {
  try {
    console.log('🔍 Validating affiliate data...')

    // Read JSON file
    const jsonPath = join(__dirname, '../data/affiliates.json')
    const jsonData = readFileSync(jsonPath, 'utf-8')
    const affiliateData: AffiliateData = JSON.parse(jsonData)

    if (!affiliateData.affiliates || affiliateData.affiliates.length === 0) {
      throw new Error('No affiliates found in JSON data')
    }

    console.log(`📊 Found ${affiliateData.affiliates.length} affiliates to validate`)
    console.log(`📅 Data generated: ${affiliateData.metadata.generatedAt}`)

    let validCount = 0
    let errorCount = 0

    for (let i = 0; i < affiliateData.affiliates.length; i++) {
      try {
        affiliateCsvSchema.parse(affiliateData.affiliates[i])
        validCount++
      } catch (error) {
        errorCount++
        console.error(`❌ Validation error for affiliate ${i + 1} (${affiliateData.affiliates[i].vendorId}):`, error)
      }
    }

    console.log(`\n📋 Validation Results:`)
    console.log(`✅ Valid affiliates: ${validCount}`)
    console.log(`❌ Invalid affiliates: ${errorCount}`)
    console.log(`📊 Total affiliates: ${affiliateData.affiliates.length}`)

    // Show metadata summary
    console.log(`\n📊 Data Summary:`)
    console.log(`   Program Status:`, affiliateData.metadata.programStatus)
    console.log(`   Affiliate Programs:`, affiliateData.metadata.affiliatePrograms)
    console.log(`   Compliance:`, affiliateData.metadata.compliance)
    console.log(`   Performance:`, affiliateData.metadata.performance)

    if (errorCount > 0) {
      console.error('\n❌ Validation failed!')
      process.exit(1)
    } else {
      console.log('\n🎉 All affiliates passed validation!')
    }

  } catch (error) {
    console.error('❌ Error validating affiliate data:', error)
    process.exit(1)
  }
}

// Run validation if this script is executed directly
if (require.main === module) {
  validateAffiliateData()
}
