#!/usr/bin/env tsx

import fs from 'fs';
import path from 'path';
import { 
  handleGracefulError, 
  runCommandWithErrorHandling,
  handleFileOperationError 
} from './utils/error-handler';
import { getCachePath, getCSVFiles as getCSVFilePaths, getFileModTime } from './utils/paths';
import { createLogger } from './utils/logger';

const logger = createLogger('smart-build.ts', 'Smart Build System')

interface FileTimestamp {
  path: string;
  mtime: Date;
}

interface CacheData {
  dataFiles: FileTimestamp[];
  lastBuild: Date;
  buildHash: string;
}

const CACHE_FILE = getCachePath('build')
const CSV_DIR = 'data';
const OUTPUT_DIR = 'lib/data';

function getCSVFiles(): FileTimestamp[] {
  const csvFiles: FileTimestamp[] = [];
  
  try {
    const csvPaths = getCSVFilePaths();
    for (const filePath of csvPaths) {
      const timestamp = getFileModTime(filePath);
      if (timestamp) {
        csvFiles.push({ path: filePath, mtime: timestamp });
      }
    }
  } catch (error: unknown) {
    handleGracefulError(error, 'read CSV directory', {
      script: 'smart-build.ts',
      operation: 'Directory Reading'
    }, () => {
      logger.warning('No CSV directory found, skipping data processing')
    });
    return [];
  }
  
  return csvFiles;
}

function getOutputFiles(): FileTimestamp[] {
  const outputFiles: FileTimestamp[] = [];
  const expectedFiles = [
    'vendors.ts',
    'affiliates.ts'
  ];
  
  for (const file of expectedFiles) {
    const filePath = path.join(OUTPUT_DIR, file);
    const timestamp = getFileModTime(filePath);
    if (timestamp) {
      outputFiles.push({ path: filePath, mtime: timestamp });
    }
  }
  
  return outputFiles;
}

function loadCache(): CacheData | null {
  try {
    if (fs.existsSync(CACHE_FILE)) {
      const cacheData = fs.readFileSync(CACHE_FILE, 'utf8');
      return JSON.parse(cacheData);
    }
  } catch (error: unknown) {
    handleGracefulError(error, 'load build cache', {
      script: 'smart-build.ts',
      operation: 'Cache Loading'
    }, () => {
      logger.warning('Could not load build cache, will rebuild')
    });
  }
  return null;
}

function saveCache(cache: CacheData): void {
  try {
    fs.writeFileSync(CACHE_FILE, JSON.stringify(cache, null, 2));
  } catch (error: unknown) {
    handleGracefulError(error, 'save build cache', {
      script: 'smart-build.ts',
      operation: 'Cache Saving'
    }, () => {
      logger.warning('Could not save build cache')
    });
  }
}

function hasCSVChanged(currentCSV: FileTimestamp[], cachedCSV: FileTimestamp[]): boolean {
  if (currentCSV.length !== cachedCSV.length) {
    return true;
  }
  
  for (const current of currentCSV) {
    const cached = cachedCSV.find(c => c.path === current.path);
    if (!cached || cached.mtime !== current.mtime) {
      return true;
    }
  }
  
  return false;
}

function hasOutputChanged(currentOutput: FileTimestamp[], cachedOutput: FileTimestamp[]): boolean {
  if (currentOutput.length !== cachedOutput.length) {
    return true;
  }
  
  for (const current of currentOutput) {
    const cached = cachedOutput.find(c => c.path === current.path);
    if (!cached || cached.mtime !== current.mtime) {
      return true;
    }
  }
  
  return false;
}

function runCommand(command: string, description: string): void {
  runCommandWithErrorHandling(command, description, {
    script: 'smart-build.ts',
    operation: 'Command Execution'
  });
}

function main(): void {
  logger.info('Smart Build - Checking for changes...');
  
  const currentCSV = getCSVFiles();
  const currentOutput = getOutputFiles();
  const cache = loadCache();
  
  let shouldProcessData = false;
  
  if (!cache) {
    logger.info('No cache found, processing all data...');
    shouldProcessData = true;
  } else if (hasCSVChanged(currentCSV, cache.dataFiles)) {
    logger.info('CSV files changed, reprocessing data...');
    shouldProcessData = true;
  } else if (hasOutputChanged(currentOutput, cache.dataFiles)) {
    logger.info('Output files changed, reprocessing data...');
    shouldProcessData = true;
  } else {
    logger.info('No changes detected, skipping data processing');
  }
  
  if (shouldProcessData) {
    logger.info('\nProcessing CSV data...');
    
    // Run data conversion scripts
    if (currentCSV.length > 0) {
      runCommand('npm run convert:all', 'Processing all CSV data (vendors + affiliates)');
    }
    
    // Update cache
    const newCache: CacheData = {
      dataFiles: currentCSV,
      lastBuild: new Date(),
      buildHash: 'placeholder' // Placeholder for now
    };
    saveCache(newCache);
    
    logger.info('Data processing completed');
  } else {
    logger.info('Skipping data processing (no changes)');
  }
  
  logger.info('\nProceeding with Next.js build...');
}

if (require.main === module) {
  main();
}
