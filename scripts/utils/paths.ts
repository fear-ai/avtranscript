#!/usr/bin/env tsx

import path from 'path'
import fs from 'fs'

// Base project directories (from scripts/utils directory)
export const PROJECT_PATHS = {
  root: path.resolve(__dirname, '../../'),
  scripts: path.resolve(__dirname, '../'),
  data: path.resolve(__dirname, '../../data'),
  lib: path.resolve(__dirname, '../../lib'),
  libData: path.resolve(__dirname, '../../lib/data'),
  components: path.resolve(__dirname, '../../components'),
  interfaces: path.resolve(__dirname, '../../interfaces'),
  utils: path.resolve(__dirname, '../../utils'),
  styles: path.resolve(__dirname, '../../styles'),
  pages: path.resolve(__dirname, '../../pages')
} as const

// Data file paths
export const DATA_PATHS = {
  vendors: {
    csv: path.join(PROJECT_PATHS.data, 'vendors.csv'),
    json: path.join(PROJECT_PATHS.data, 'vendors.json'),
    ts: path.join(PROJECT_PATHS.libData, 'vendors.ts')
  },
  affiliates: {
    csv: path.join(PROJECT_PATHS.data, 'affiliates.csv'),
    json: path.join(PROJECT_PATHS.data, 'affiliates.json')
  },
  cache: {
    build: path.join(PROJECT_PATHS.root, '.build-cache.json'),
    temp: path.join(PROJECT_PATHS.root, '.temp')
  }
} as const

// Validation schemas
export const SCHEMA_PATHS = {
  vendors: path.join(PROJECT_PATHS.lib, 'validators/vendor.ts'),
  affiliates: path.join(PROJECT_PATHS.lib, 'validators/affiliate.ts')
} as const

// Configuration files
export const CONFIG_PATHS = {
  tsconfig: path.join(PROJECT_PATHS.root, 'tsconfig.json'),
  package: path.join(PROJECT_PATHS.root, 'package.json'),
  tailwind: path.join(PROJECT_PATHS.root, 'tailwind.config.js'),
  postcss: path.join(PROJECT_PATHS.root, 'postcss.config.js')
} as const

// Utility functions
export function getDataPath(type: 'vendors' | 'affiliates', format: 'csv' | 'json' | 'ts'): string {
  if (type === 'vendors') {
    return DATA_PATHS.vendors[format as keyof typeof DATA_PATHS.vendors]
  } else if (type === 'affiliates') {
    if (format === 'ts') {
      throw new Error('Affiliates do not have TypeScript output files')
    }
    return DATA_PATHS.affiliates[format]
  }
  throw new Error(`Unknown data type: ${type}`)
}

export function getCachePath(type: 'build' | 'temp'): string {
  return DATA_PATHS.cache[type]
}

export function getSchemaPath(type: 'vendors' | 'affiliates'): string {
  return SCHEMA_PATHS[type]
}

export function getConfigPath(type: keyof typeof CONFIG_PATHS): string {
  return CONFIG_PATHS[type]
}

/**
 * Ensure directory exists, create if it doesn't
 */
export function ensureDirectoryExists(dirPath: string): void {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true })
  }
}

/**
 * Get relative path from project root
 */
export function getRelativePath(absolutePath: string): string {
  return path.relative(PROJECT_PATHS.root, absolutePath)
}

/**
 * Check if path exists
 */
export function pathExists(filePath: string): boolean {
  return fs.existsSync(filePath)
}

/**
 * Get file stats (modification time, size, etc.)
 */
export function getFileStats(filePath: string): fs.Stats | null {
  try {
    return fs.statSync(filePath)
  } catch {
    return null
  }
}

/**
 * Get file modification time
 */
export function getFileModTime(filePath: string): Date | null {
  const stats = getFileStats(filePath)
  return stats ? stats.mtime : null
}

/**
 * Get file size in bytes
 */
export function getFileSize(filePath: string): number | null {
  const stats = getFileStats(filePath)
  return stats ? stats.size : null
}

/**
 * List all CSV files in data directory
 */
export function getCSVFiles(): string[] {
  try {
    const files = fs.readdirSync(PROJECT_PATHS.data)
    return files
      .filter(file => file.endsWith('.csv'))
      .map(file => path.join(PROJECT_PATHS.data, file))
  } catch {
    return []
  }
}

/**
 * List all JSON files in data directory
 */
export function getJSONFiles(): string[] {
  try {
    const files = fs.readdirSync(PROJECT_PATHS.data)
    return files
      .filter(file => file.endsWith('.json'))
      .map(file => path.join(PROJECT_PATHS.data, file))
  } catch {
    return []
  }
}

/**
 * List all TypeScript files in lib/data directory
 */
export function getTypeScriptFiles(): string[] {
  try {
    const files = fs.readdirSync(PROJECT_PATHS.libData)
    return files
      .filter(file => file.endsWith('.ts'))
      .map(file => path.join(PROJECT_PATHS.libData, file))
  } catch {
    return []
  }
}
