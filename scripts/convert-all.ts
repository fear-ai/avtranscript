#!/usr/bin/env tsx

import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

interface DataPipelineStep {
  name: string;
  command: string;
  description: string;
  dependencies?: string[];
}

interface PipelineError extends Error {
  step: string;
  command: string;
  exitCode?: number;
  stderr?: string;
  originalError?: unknown;
}

const DATA_PIPELINE: DataPipelineStep[] = [
  {
    name: 'vendors',
    command: 'tsx scripts/convert-vendors.ts',
    description: 'Converting vendor CSV to JSON'
  },
  {
    name: 'affiliates', 
    command: 'tsx scripts/convert-affiliates.ts',
    description: 'Converting affiliate CSV to JSON',
    dependencies: ['vendors'] // Affiliates depend on vendor data
  },
  {
    name: 'compile',
    command: 'tsx scripts/compile-all.ts',
    description: 'Compiling all data to TypeScript',
    dependencies: ['vendors', 'affiliates']
  }
];

function createPipelineError(step: DataPipelineStep, originalError: unknown): PipelineError {
  const error = new Error(`Pipeline step '${step.name}' failed: ${step.description}`) as PipelineError;
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

function runStep(step: DataPipelineStep, completedSteps: Set<string>): void {
  // Check dependencies
  if (step.dependencies) {
    for (const dep of step.dependencies) {
      if (!completedSteps.has(dep)) {
        throw new Error(`Step '${step.name}' depends on '${dep}' which hasn't completed`);
      }
    }
  }
  
  console.log(`🔄 ${step.description}...`);
  try {
    execSync(step.command, { stdio: 'inherit' });
    completedSteps.add(step.name);
    console.log(`✅ ${step.description} completed`);
  } catch (error: unknown) {
    console.error(`❌ ${step.description} failed`);
    
    // Create enhanced error with context
    const pipelineError = createPipelineError(step, error);
    
    // Log detailed error information
    console.error(`\n🔍 Error Details:`);
    console.error(`  Step: ${pipelineError.step}`);
    console.error(`  Command: ${pipelineError.command}`);
    
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
    
    throw pipelineError;
  }
}

function main(): void {
  console.log('🚀 Unified Data Pipeline - Processing vendors and affiliates together');
  console.log('=' .repeat(70));
  
  const completedSteps = new Set<string>();
  
  try {
    for (const step of DATA_PIPELINE) {
      runStep(step, completedSteps);
    }
    
    console.log('\n🎉 Data pipeline completed successfully!');
    console.log('=' .repeat(70));
    console.log('✅ Vendor data processed');
    console.log('✅ Affiliate data processed'); 
    console.log('✅ All data compiled to TypeScript');
    console.log('\n🚀 Ready for build');
    
  } catch (error: unknown) {
    console.error('\n💥 Data pipeline failed!');
    console.error('=' .repeat(70));
    
    if (error instanceof Error) {
      console.error(`❌ Error: ${error.message}`);
      if (error.stack) {
        console.error(`\n📚 Stack Trace:`);
        console.error(error.stack);
      }
    } else {
      console.error(`❌ Unknown Error: ${String(error)}`);
    }
    
    console.error('\n🔧 Check the logs above and fix the issue');
    console.error('💡 Common issues:');
    console.error('   - Missing CSV files in data/ directory');
    console.error('   - Invalid CSV format or data');
    console.error('   - Permission issues with file operations');
    console.error('   - Missing dependencies or TypeScript errors');
    
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}
