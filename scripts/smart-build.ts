#!/usr/bin/env tsx

import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

interface FileTimestamp {
  path: string;
  mtime: number;
}

interface CacheData {
  csvFiles: FileTimestamp[];
  lastBuild: number;
  dataFiles: FileTimestamp[];
}

const CACHE_FILE = '.build-cache.json';
const CSV_DIR = 'data';
const OUTPUT_DIR = 'lib/data';

function getFileTimestamp(filePath: string): FileTimestamp | null {
  try {
    const stats = fs.statSync(filePath);
    return {
      path: filePath,
      mtime: stats.mtime.getTime()
    };
  } catch {
    return null;
  }
}

function getCSVFiles(): FileTimestamp[] {
  const csvFiles: FileTimestamp[] = [];
  
  try {
    const files = fs.readdirSync(CSV_DIR);
    for (const file of files) {
      if (file.endsWith('.csv')) {
        const timestamp = getFileTimestamp(path.join(CSV_DIR, file));
        if (timestamp) {
          csvFiles.push(timestamp);
        }
      }
    }
  } catch (error) {
    console.log('📁 No CSV directory found, skipping data processing');
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
    const timestamp = getFileTimestamp(filePath);
    if (timestamp) {
      outputFiles.push(timestamp);
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
  } catch (error) {
    console.log('⚠️  Could not load build cache, will rebuild');
  }
  return null;
}

function saveCache(cache: CacheData): void {
  try {
    fs.writeFileSync(CACHE_FILE, JSON.stringify(cache, null, 2));
  } catch (error) {
    console.log('⚠️  Could not save build cache');
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
  console.log(`🔄 ${description}...`);
  try {
    execSync(command, { stdio: 'inherit' });
    console.log(`✅ ${description} completed`);
  } catch (error) {
    console.error(`❌ ${description} failed`);
    process.exit(1);
  }
}

function main(): void {
  console.log('🚀 Smart Build - Checking for changes...');
  
  const currentCSV = getCSVFiles();
  const currentOutput = getOutputFiles();
  const cache = loadCache();
  
  let shouldProcessData = false;
  
  if (!cache) {
    console.log('📝 No cache found, processing all data...');
    shouldProcessData = true;
  } else if (hasCSVChanged(currentCSV, cache.csvFiles)) {
    console.log('📊 CSV files changed, reprocessing data...');
    shouldProcessData = true;
  } else if (hasOutputChanged(currentOutput, cache.outputFiles)) {
    console.log('🔧 Output files changed, reprocessing data...');
    shouldProcessData = true;
  } else {
    console.log('✅ No changes detected, skipping data processing');
  }
  
  if (shouldProcessData) {
    console.log('\n📈 Processing CSV data...');
    
    // Run data conversion scripts
    if (currentCSV.length > 0) {
      runCommand('npm run convert:all', 'Processing all CSV data (vendors + affiliates)');
    }
    
    // Update cache
    const newCache: CacheData = {
      csvFiles: currentCSV,
      lastBuild: Date.now(),
      dataFiles: getOutputFiles()
    };
    saveCache(newCache);
    
    console.log('✅ Data processing completed');
  } else {
    console.log('⏭️  Skipping data processing (no changes)');
  }
  
  console.log('\n🏗️  Proceeding with Next.js build...');
}

if (require.main === module) {
  main();
}
