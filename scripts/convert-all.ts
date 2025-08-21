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
  } catch (error) {
    console.error(`❌ ${step.description} failed`);
    throw error;
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
    
  } catch (error) {
    console.error('\n💥 Data pipeline failed!');
    console.error('=' .repeat(70));
    console.error('❌ Error:', error.message);
    console.error('\n🔧 Check the logs above and fix the issue');
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}
