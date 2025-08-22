#!/usr/bin/env tsx

import csv from 'csv-parser'
import { createReadStream, readFileSync } from 'fs'
import { promisify } from 'util'
import { pipeline as pipelineCallback } from 'stream'

const pipeline = promisify(pipelineCallback)

export interface CSVParsingOptions {
  trim?: boolean
  skipEmptyLines?: boolean
  quote?: string
  escape?: string
  delimiter?: string
}

export interface ParsedCSV {
  headers: string[]
  records: Record<string, any>[]
  count: number
}

/**
 * Parse CSV file using stream-based csv-parser (recommended for large files)
 */
export async function parseCSVFile(filePath: string, options: CSVParsingOptions = {}): Promise<ParsedCSV> {
  const records: Record<string, any>[] = []
  let headers: string[] = []

  return new Promise((resolve, reject) => {
    createReadStream(filePath)
      .pipe(csv(options))
      .on('headers', (headerList: string[]) => {
        headers = headerList
      })
      .on('data', (data: Record<string, any>) => {
        records.push(data)
      })
      .on('end', () => {
        resolve({
          headers,
          records,
          count: records.length
        })
      })
      .on('error', (error: Error) => {
        reject(error)
      })
  })
}

/**
 * Parse CSV string with proper quoted field handling (for smaller files)
 */
export function parseCSVString(
  csvData: string, 
  options: CSVParsingOptions = {}
): ParsedCSV {
  const records: Record<string, any>[] = []
  const lines = csvData.split('\n').filter(line => line.trim())
  
  if (lines.length === 0) {
    return { headers: [], records: [], count: 0 }
  }
  
  const headers = parseCSVLine(lines[0])
  
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i]
    const values = parseCSVLine(line)
    const record: Record<string, any> = {}
    
    headers.forEach((header, index) => {
      record[header] = values[index] || ''
    })
    
    records.push(record)
  }
  
  return {
    headers,
    records,
    count: records.length
  }
}

/**
 * Parse a single CSV line with proper quoted field handling
 */
function parseCSVLine(line: string): string[] {
  const result: string[] = []
  let current = ''
  let inQuotes = false
  
  for (let i = 0; i < line.length; i++) {
    const char = line[i]
    
    if (char === '"') {
      inQuotes = !inQuotes
    } else if (char === ',' && !inQuotes) {
      result.push(current.trim())
      current = ''
    } else {
      current += char
    }
  }
  
  result.push(current.trim())
  return result
}

/**
 * Auto-detect best parsing method based on file size
 */
export async function parseCSV(
  source: string, 
  options: CSVParsingOptions = {}
): Promise<ParsedCSV> {
  // If source looks like a file path, use file parser
  if (source.includes('/') || source.includes('\\') || source.endsWith('.csv')) {
    return parseCSVFile(source, options)
  }
  
  // Otherwise treat as CSV string
  return parseCSVString(source, options)
}

/**
 * Parse CSV file synchronously (for smaller files)
 */
export function parseCSVFileSync(
  filePath: string, 
  options: CSVParsingOptions = {}
): ParsedCSV {
  const csvData = readFileSync(filePath, 'utf-8')
  return parseCSVString(csvData, options)
}
