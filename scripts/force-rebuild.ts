#!/usr/bin/env tsx

import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import { 
  handleGracefulError, 
  runCommandWithErrorHandling,
  handleFileOperationError 
} from './utils/error-handler';

const CACHE_FILES = [
  '.build-cache.json',
  '.next',
  'tsconfig.tsbuildinfo'
];

const DATA_DIRS = [
  'data',
  'lib/data'
];

function removePath(pathToRemove: string): void {
  try {
    if (fs.existsSync(pathToRemove)) {
      if (fs.lstatSync(pathToRemove).isDirectory()) {
        // Use rmSync for directories (Node.js 14.14.0+)
        (fs as any).rmSync(pathToRemove, { recursive: true, force: true });
        console.log(`🗑️  Removed directory: ${pathToRemove}`);
      } else {
        fs.unlinkSync(pathToRemove);
        console.log(`🗑️  Removed file: ${pathToRemove}`);
      }
    }
  } catch (error: unknown) {
    handleGracefulError(error, `remove ${pathToRemove}`, {
      script: 'force-rebuild.ts',
      operation: 'File Removal'
    }, () => {
      console.log(`⚠️  Could not remove ${pathToRemove}`);
    });
  }
}

function runCommand(command: string, description: string): void {
  runCommandWithErrorHandling(command, description, {
    script: 'force-rebuild.ts',
    operation: 'Command Execution'
  });
}

function validateStrictMode(): void {
  console.log('🔍 Validating strict TypeScript mode...');
  
  const tsConfigPath = 'tsconfig.json';
  if (!fs.existsSync(tsConfigPath)) {
    console.error('❌ tsconfig.json not found');
    process.exit(1);
  }
  
  try {
    const tsConfig = JSON.parse(fs.readFileSync(tsConfigPath, 'utf8'));
    
    if (tsConfig.compilerOptions?.strict !== true) {
      console.error('❌ TypeScript strict mode is not enabled!');
      console.error('   Expected: "strict": true');
      console.error(`   Found: "strict": ${tsConfig.compilerOptions?.strict}`);
      process.exit(1);
    }
    
    console.log('✅ TypeScript strict mode is enabled');
  } catch (error: unknown) {
    handleGracefulError(error, 'parse tsconfig.json', {
      script: 'force-rebuild.ts',
      operation: 'TypeScript Config Validation'
    }, () => {
      console.error('❌ Could not parse tsconfig.json');
      process.exit(1);
    });
  }
}

function main(): void {
  console.log('🚀 FORCE REBUILD - Clearing all caches and rebuilding from scratch');
  console.log('=' .repeat(60));
  
  // Step 1: Validate strict mode is enabled
  validateStrictMode();
  
  // Step 2: Clear all caches
  console.log('\n🗑️  Clearing all caches...');
  for (const cacheFile of CACHE_FILES) {
    removePath(cacheFile);
  }
  
  // Step 3: Clear generated data files
  console.log('\n🗑️  Clearing generated data files...');
  for (const dataDir of DATA_DIRS) {
    if (fs.existsSync(dataDir)) {
      const files = fs.readdirSync(dataDir);
      for (const file of files) {
        if (file.endsWith('.ts') || file.endsWith('.json')) {
          const filePath = path.join(dataDir, file);
          removePath(filePath);
        }
      }
    }
  }
  
  // Step 4: Force data conversion
  console.log('\n📈 Force processing all CSV data...');
  runCommand('npm run convert:all', 'Processing all CSV data (vendors + affiliates)');
  
  // Step 5: Run strict TypeScript check
  console.log('\n🔍 Running strict TypeScript validation...');
  runCommand('npx tsc --noEmit --project .', 'TypeScript strict mode validation');
  
  // Step 6: Build the project
  console.log('\n🏗️  Building project with strict mode...');
  runCommand('npm run build', 'Next.js production build');
  
  console.log('\n🎉 FORCE REBUILD COMPLETED SUCCESSFULLY!');
  console.log('=' .repeat(60));
  console.log('✅ All caches cleared');
  console.log('✅ CSV data reprocessed');
  console.log('✅ Strict TypeScript validation passed');
  console.log('✅ Production build completed');
  console.log('\n🚀 Ready for development or deployment');
}

if (require.main === module) {
  main();
}
