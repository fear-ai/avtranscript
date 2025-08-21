#!/usr/bin/env tsx

import { execSync } from 'child_process';

interface ValidationStep {
  name: string;
  command: string;
  description: string;
  dependencies?: string[];
}

const VALIDATION_PIPELINE: ValidationStep[] = [
  {
    name: 'vendors',
    command: 'npm run validate:vendors',
    description: 'Validating vendor data integrity'
  },
  {
    name: 'affiliates',
    command: 'npm run validate:affiliates', 
    description: 'Validating affiliate data integrity',
    dependencies: ['vendors'] // Affiliates reference vendor data
  }
];

function runValidation(step: ValidationStep, completedSteps: Set<string>): void {
  // Check dependencies
  if (step.dependencies) {
    for (const dep of step.dependencies) {
      if (!completedSteps.has(dep)) {
        throw new Error(`Validation '${step.name}' depends on '${dep}' which hasn't completed`);
      }
    }
  }
  
  console.log(`🔍 ${step.description}...`);
  try {
    execSync(step.command, { stdio: 'inherit' });
    completedSteps.add(step.name);
    console.log(`✅ ${step.description} completed`);
  } catch (error) {
    console.error(`❌ ${step.description} failed`);
    throw error;
  }
}

function main(): void {
  console.log('🔍 Unified Data Validation - Checking vendors and affiliates');
  console.log('=' .repeat(60));
  
  const completedSteps = new Set<string>();
  
  try {
    for (const step of VALIDATION_PIPELINE) {
      runValidation(step, completedSteps);
    }
    
    console.log('\n🎉 All data validation passed!');
    console.log('=' .repeat(60));
    console.log('✅ Vendor data validated');
    console.log('✅ Affiliate data validated');
    console.log('\n🚀 Data is ready for use');
    
  } catch (error) {
    console.error('\n💥 Data validation failed!');
    console.error('=' .repeat(60));
    console.error('❌ Error:', error.message);
    console.error('\n🔧 Check the logs above and fix the validation issues');
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}
