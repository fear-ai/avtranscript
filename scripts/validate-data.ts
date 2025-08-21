import { readFileSync } from 'fs'
import { join } from 'path'
import { vendorSchema } from '../lib/validators/vendor'

interface VendorData {
  metadata: {
    generatedAt: string
    totalVendors: number
    categories: Record<string, number>
    tiers: Record<string, number>
  }
  vendors: any[]
}

async function validateJsonData() {
  try {
    console.log('Validating JSON vendor data...')

    // Read JSON file
    const jsonPath = join(__dirname, '../data/vendors.json')
    const jsonData = readFileSync(jsonPath, 'utf-8')
    const vendorData: VendorData = JSON.parse(jsonData)

    if (!vendorData.vendors || vendorData.vendors.length === 0) {
      throw new Error('No vendors found in JSON data')
    }

    console.log(`Found ${vendorData.vendors.length} vendors to validate`)
    console.log(`Data generated: ${vendorData.metadata.generatedAt}`)

    let validCount = 0
    let errorCount = 0

    for (let i = 0; i < vendorData.vendors.length; i++) {
      try {
        vendorSchema.parse(vendorData.vendors[i])
        validCount++
      } catch (error) {
        errorCount++
        console.error(`Validation error for vendor ${i + 1} (${vendorData.vendors[i].id}):`, error)
      }
    }

    console.log(`\nValidation Results:`)
    console.log(`Valid vendors: ${validCount}`)
    console.log(`Invalid vendors: ${errorCount}`)
    console.log(`Total vendors: ${vendorData.vendors.length}`)

    // Show metadata summary
    console.log(`\nData Summary:`)
    console.log(`   Categories:`, vendorData.metadata.categories)
    console.log(`   Tiers:`, vendorData.metadata.tiers)

    if (errorCount > 0) {
      console.error('\nValidation failed!')
      process.exit(1)
    } else {
      console.log('\nAll vendors passed validation!')
    }

  } catch (error) {
    console.error('Error validating data:', error)
    process.exit(1)
  }
}

// Run validation if this script is executed directly
if (require.main === module) {
  validateJsonData()
}
