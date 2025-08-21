import { readFileSync, writeFileSync } from 'fs'
import { join } from 'path'
import { validateAffiliateData } from '../lib/validators/affiliate'

async function convertAffiliatesToJson() {
  try {
    console.log('🔄 Converting affiliate CSV to JSON...')

    // Read CSV file
    const csvPath = join(__dirname, '../data/affiliates.csv')
    const csvData = readFileSync(csvPath, 'utf-8')

    // Parse CSV manually
    const lines = csvData.split('\n').filter(line => line.trim())
    const headers = lines[0].split(',').map(h => h.trim())
    const affiliates = lines.slice(1).map(line => {
      const values = line.split(',').map(v => v.trim().replace(/^"|"$/g, ''))
      const affiliate: Record<string, any> = {}
      
      headers.forEach((header, index) => {
        let value: any = values[index] || ''
        
        // Convert numeric fields
        if (['commissionRate', 'cookieDuration', 'minimumPayout', 'baseCommission', 'bonusCommission', 'totalClicks', 'totalConversions', 'conversionRate', 'totalRevenue', 'totalCommission', 'pendingCommission', 'confidence'].includes(header)) {
          value = parseFloat(value) || 0
        }
        
        // Convert boolean fields
        if (['hasProgram', 'ftcCompliant', 'disclosureRequired'].includes(header)) {
          value = value === 'true'
        }
        
        affiliate[header] = value
      })
      
      return affiliate
    })

    console.log(`Parsed ${affiliates.length} affiliate records from CSV`)

    // Validate data
    const validatedAffiliates = validateAffiliateData(affiliates)
    console.log(`Validated ${validatedAffiliates.length} affiliate records`)

    // Generate JSON with metadata
    const jsonData = {
      metadata: {
        generatedAt: new Date().toISOString(),
        totalAffiliates: validatedAffiliates.length,
        programStatus: {
          active: validatedAffiliates.filter(a => a.status === 'active').length,
          pending: validatedAffiliates.filter(a => a.status === 'pending').length,
          inactive: validatedAffiliates.filter(a => a.status === 'inactive').length,
          rejected: validatedAffiliates.filter(a => a.status === 'rejected').length,
          expired: validatedAffiliates.filter(a => a.status === 'expired').length,
          suspended: validatedAffiliates.filter(a => a.status === 'suspended').length
        },
        affiliatePrograms: {
          hasProgram: validatedAffiliates.filter(a => a.hasProgram).length,
          noProgram: validatedAffiliates.filter(a => !a.hasProgram).length
        },
        compliance: {
          ftcCompliant: validatedAffiliates.filter(a => a.ftcCompliant).length,
          disclosureRequired: validatedAffiliates.filter(a => a.disclosureRequired).length
        },
        performance: {
          highConversion: validatedAffiliates.filter(a => a.conversionRate >= 5).length,
          mediumConversion: validatedAffiliates.filter(a => a.conversionRate >= 2 && a.conversionRate < 5).length,
          lowConversion: validatedAffiliates.filter(a => a.conversionRate < 2).length
        }
      },
      affiliates: validatedAffiliates
    }

    // Write JSON file
    const jsonPath = join(__dirname, '../data/affiliates.json')
    writeFileSync(jsonPath, JSON.stringify(jsonData, null, 2))

    console.log(`Generated JSON file: ${jsonPath}`)
    console.log(`Program status breakdown:`)
    console.log(`   Active: ${jsonData.metadata.programStatus.active}`)
    console.log(`   Pending: ${jsonData.metadata.programStatus.pending}`)
    console.log(`   Inactive: ${jsonData.metadata.programStatus.inactive}`)
    console.log(`Affiliate programs: ${jsonData.metadata.affiliatePrograms.hasProgram} active`)
    console.log(`Compliance: ${jsonData.metadata.compliance.ftcCompliant} FTC compliant`)
    console.log(`Performance: ${jsonData.metadata.performance.highConversion} high conversion`)
          console.log(`Successfully converted affiliate CSV to JSON`)

  } catch (error) {
    console.error('Error converting affiliate CSV to JSON:', error)
    process.exit(1)
  }
}

// Run conversion if this script is executed directly
if (require.main === module) {
  convertAffiliatesToJson()
}
