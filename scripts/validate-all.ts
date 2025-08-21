#!/usr/bin/env tsx

import { execSync } from 'child_process';

interface ValidationStep {
  name: string;
  command: string;
  description: string;
  dependencies?: string[];
}

interface ValidationError extends Error {
  step: string;
  command: string;
  exitCode?: number;
  stderr?: string;
  originalError?: unknown;
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

function createValidationError(step: ValidationStep, originalError: unknown): ValidationError {
  const error = new Error(`Validation step '${step.name}' failed: ${step.description}`) as ValidationError;
  error.step = step.name;
  error.command = step.command;
  error.originalError = originalError;
  
  // Extract additional error information
  if (originalError instanceof Error) {
    error.message = `${error.message}\nOriginal error: ${originalError.message}`;
    error.stack = originalError.stack;
  }
  
  return error;
}

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
  } catch (error: unknown) {
    console.error(`❌ ${step.description} failed`);
    
    // Create enhanced error with context
    const validationError = createValidationError(step, error);
    
    // Log detailed error information
    console.error(`\n🔍 Error Details:`);
    console.error(`  Step: ${validationError.step}`);
    console.error(`  Command: ${validationError.command}`);
    
    if (error instanceof Error) {
      console.error(`  Error Type: ${error.constructor.name}`);
      console.error(`  Error Message: ${error.message}`);
      if (error.stack) {
        console.error(`  Stack Trace: ${error.stack.split('\n').slice(0, 3).join('\n')}`);
      }
    } else {
      console.error(`  Error Type: ${typeof error}`);
      console.error(`  Error Value: ${String(error)}`);
    }
    
    throw validationError;
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
    
  } catch (error: unknown) {
    console.error('\n💥 Data validation failed!');
    console.error('=' .repeat(60));
    
    if (error instanceof Error) {
      console.error(`❌ Error: ${error.message}`);
      if (error.stack) {
        console.error(`\n📚 Stack Trace:`);
        console.error(error.stack);
      }
    } else {
      console.error(`❌ Unknown Error: ${String(error)}`);
    }
    
    console.error('\n🔧 Check the logs above and fix the validation issues');
    console.error('💡 Common validation issues:');
    console.error('   - Missing or corrupted JSON data files');
    console.error('   - Invalid data structure or missing required fields');
    console.error('   - Type mismatches in data validation');
    console.error('   - Missing vendor-affiliate relationships');
    console.error('   - Data integrity violations');
    
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}
