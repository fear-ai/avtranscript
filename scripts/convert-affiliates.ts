#!/usr/bin/env tsx

import { writeFileSync } from 'fs';
import { parseCSVFileSync } from './utils/csv-parser';
import { getDataPath } from './utils/paths';
import { createLogger } from './utils/logger';
import { validateAffiliateData } from '../lib/validators/affiliate'

async function convertAffiliatesToJson() {
  const logger = createLogger('convert-affiliates.ts', 'CSV to JSON conversion')
  
  try {
    logger.progress('Converting affiliate CSV to JSON')

    // Get file paths using unified path management
    const csvPath = getDataPath('affiliates', 'csv')
    const jsonPath = getDataPath('affiliates', 'json')
    
    logger.fileOperation('Reading', csvPath)
    
    // Parse CSV using unified parser
    const parsedData = parseCSVFileSync(csvPath)
    logger.csvParsed('affiliates', parsedData.count, parsedData.headers)

    // Process affiliate data with type conversion
    const affiliates = parsedData.records.map(affiliate => {
      const processed: Record<string, any> = {
        // Required fields - CSV has these
        vendorId: affiliate.vendorId,                    // ← ADDED: Required by validator
        hasProgram: affiliate.hasProgram === 'true',
        programName: affiliate.programName,
        commissionRate: parseFloat(affiliate.commissionRate) || 0,
        commissionType: affiliate.commissionType,        // ← ADDED: Required by validator
        cookieDuration: parseInt(affiliate.cookieDuration) || 0,
        minimumPayout: parseFloat(affiliate.minimumPayout) || 0,
        paymentSchedule: affiliate.paymentSchedule,      // ← ADDED: Required by validator
        status: affiliate.status,
        startDate: affiliate.startDate,
        ftcCompliant: affiliate.ftcCompliant === 'true',
        disclosureRequired: affiliate.disclosureRequired === 'true',
        disclosureText: affiliate.disclosureText,
        baseCommission: parseFloat(affiliate.baseCommission) || 0,
        bonusCommission: parseFloat(affiliate.bonusCommission) || 0,
        totalClicks: parseInt(affiliate.totalClicks) || 0,
        totalConversions: parseInt(affiliate.totalConversions) || 0,
        conversionRate: parseFloat(affiliate.conversionRate) || 0,
        totalRevenue: parseFloat(affiliate.totalRevenue) || 0,
        totalCommission: parseFloat(affiliate.totalCommission) || 0,
        pendingCommission: parseFloat(affiliate.pendingCommission) || 0,
        lastUpdated: affiliate.lastUpdated,
        confidence: parseFloat(affiliate.confidence) || 0,
        source: affiliate.source                          // ← ADDED: Required by validator
      }

      return processed
    })

    logger.dataProcessed('affiliates', affiliates.length)

    // Validate data
    logger.progress('Validating affiliate data')
    const validatedAffiliates = validateAffiliateData(affiliates)
    logger.validationResult('affiliates', validatedAffiliates.length)

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
    writeFileSync(jsonPath, JSON.stringify(jsonData, null, 2))
    logger.jsonGenerated('affiliates', jsonPath, {
      totalAffiliates: jsonData.metadata.totalAffiliates,
      activePrograms: jsonData.metadata.affiliatePrograms.hasProgram,
      complianceRate: jsonData.metadata.compliance.ftcCompliant
    })

    logger.completed('affiliate CSV to JSON conversion')

  } catch (error: unknown) {
    logger.error('CSV to JSON conversion failed', error)
    process.exit(1)
  }
}

// Run conversion if this script is executed directly
if (require.main === module) {
  convertAffiliatesToJson()
}
