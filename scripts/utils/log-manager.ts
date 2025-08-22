#!/usr/bin/env tsx

import fs from 'fs';
import path from 'path';

export interface LogManagerConfig {
  logDir: string;
  maxFileSize: number; // in bytes
  maxFiles: number;
  maxAge: number; // in days
  compressOldLogs: boolean;
}

export class LogManager {
  config: LogManagerConfig;

  constructor(config: LogManagerConfig) {
    this.config = config;
    this.ensureLogDirectory();
  }

  ensureLogDirectory(): void {
    if (!fs.existsSync(this.config.logDir)) {
      fs.mkdirSync(this.config.logDir, { recursive: true });
    }
  }

  /**
   * Clean up old log files based on age and count
   */
  cleanupOldLogs(): void {
    try {
      const files = this.getLogFiles();
      
      // Sort by modification time (oldest first)
      files.sort((a, b) => {
        const statA = fs.statSync(a);
        const statB = fs.statSync(b);
        return statA.mtime.getTime() - statB.mtime.getTime();
      });

      // Remove files older than maxAge
      const cutoffTime = Date.now() - (this.config.maxAge * 24 * 60 * 60 * 1000);
      
      files.forEach(file => {
        const stat = fs.statSync(file);
        if (stat.mtime.getTime() < cutoffTime) {
          fs.unlinkSync(file);
          console.log(`Removed old log file: ${path.basename(file)}`);
        }
      });

      // Keep only maxFiles most recent files
      if (files.length > this.config.maxFiles) {
        const filesToRemove = files.slice(0, files.length - this.config.maxFiles);
        filesToRemove.forEach(file => {
          fs.unlinkSync(file);
          console.log(`Removed excess log file: ${path.basename(file)}`);
        });
      }

    } catch (error) {
      console.error('Error cleaning up old logs:', error);
    }
  }

  /**
   * Get all log files in the log directory
   */
  getLogFiles(): string[] {
    try {
      const files = fs.readdirSync(this.config.logDir);
      return files
        .filter(file => file.endsWith('.log') || file.endsWith('.json'))
        .map(file => path.join(this.config.logDir, file));
    } catch {
      return [];
    }
  }

  /**
   * Get log file statistics
   */
  getLogStats(): {
    totalFiles: number;
    totalSize: number;
    oldestFile: string | null;
    newestFile: string | null;
    averageFileSize: number;
  } {
    try {
      const files = this.getLogFiles();
      
      if (files.length === 0) {
        return {
          totalFiles: 0,
          totalSize: 0,
          oldestFile: null,
          newestFile: null,
          averageFileSize: 0
        };
      }

      let totalSize = 0;
      let oldestFile: string | null = null;
      let newestFile: string | null = null;
      let oldestTime = Date.now();
      let newestTime = 0;

      files.forEach(file => {
        const stat = fs.statSync(file);
        totalSize += stat.size;
        
        const mtime = stat.mtime.getTime();
        if (mtime < oldestTime) {
          oldestTime = mtime;
          oldestFile = path.basename(file);
        }
        if (mtime > newestTime) {
          newestTime = mtime;
          newestFile = path.basename(file);
        }
      });

      return {
        totalFiles: files.length,
        totalSize,
        oldestFile,
        newestFile,
        averageFileSize: Math.round(totalSize / files.length)
      };
    } catch {
      return {
        totalFiles: 0,
        totalSize: 0,
        oldestFile: null,
        newestFile: null,
        averageFileSize: 0
      };
    }
  }

  /**
   * List all log files with details
   */
  listLogFiles(): Array<{
    name: string;
    size: number;
    modified: Date;
    age: string;
  }> {
    try {
      const files = this.getLogFiles();
      const now = Date.now();
      
      return files.map(file => {
        const stat = fs.statSync(file);
        const ageMs = now - stat.mtime.getTime();
        const ageDays = Math.floor(ageMs / (24 * 60 * 60 * 1000));
        const ageHours = Math.floor((ageMs % (24 * 60 * 60 * 1000)) / (60 * 60 * 1000));
        
        let age = '';
        if (ageDays > 0) {
          age = `${ageDays}d ${ageHours}h`;
        } else if (ageHours > 0) {
          age = `${ageHours}h`;
        } else {
          age = '<1h';
        }

        return {
          name: path.basename(file),
          size: stat.size,
          modified: stat.mtime,
          age
        };
      }).sort((a, b) => b.modified.getTime() - a.modified.getTime());
    } catch {
      return [];
    }
  }

  /**
   * Archive logs to a compressed archive
   */
  archiveLogs(archiveName?: string): string | null {
    try {
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      const archiveFileName = archiveName || `logs-archive-${timestamp}.tar.gz`;
      const archivePath = path.join(this.config.logDir, archiveFileName);
      
      // This would require tar command or a tar library
      // For now, just create a simple archive directory
      const archiveDir = path.join(this.config.logDir, `archive-${timestamp}`);
      fs.mkdirSync(archiveDir, { recursive: true });
      
      const files = this.getLogFiles();
      files.forEach(file => {
        const fileName = path.basename(file);
        const destPath = path.join(archiveDir, fileName);
        fs.copyFileSync(file, destPath);
      });
      
      console.log(`Logs archived to: ${archiveDir}`);
      return archiveDir;
    } catch (error) {
      console.error('Error archiving logs:', error);
      return null;
    }
  }

  /**
   * Get log file contents (for debugging)
   */
  getLogContents(fileName: string, maxLines: number = 100): string[] {
    try {
      const filePath = path.join(this.config.logDir, fileName);
      if (!fs.existsSync(filePath)) {
        return [`Log file not found: ${fileName}`];
      }
      
      const content = fs.readFileSync(filePath, 'utf-8');
      const lines = content.split('\n');
      
      if (lines.length <= maxLines) {
        return lines;
      }
      
      return [
        `... showing last ${maxLines} lines of ${lines.length} total ...`,
        ...lines.slice(-maxLines)
      ];
    } catch (error) {
      return [`Error reading log file: ${error}`];
    }
  }

  /**
   * Search log files for specific patterns
   */
  searchLogs(pattern: string, maxResults: number = 50): Array<{
    file: string;
    line: number;
    content: string;
    match: string;
  }> {
    try {
      const files = this.getLogFiles();
      const results: Array<{
        file: string;
        line: number;
        content: string;
        match: string;
      }> = [];
      
      const regex = new RegExp(pattern, 'i');
      
      files.forEach(file => {
        try {
          const content = fs.readFileSync(file, 'utf-8');
          const lines = content.split('\n');
          
          lines.forEach((line, index) => {
            if (regex.test(line)) {
              const match = line.match(regex)?.[0] || '';
              results.push({
                file: path.basename(file),
                line: index + 1,
                content: line.trim(),
                match
              });
              
              if (results.length >= maxResults) {
                return;
              }
            }
          });
        } catch {
          // Skip files that can't be read
        }
      });
      
      return results.slice(0, maxResults);
    } catch (error) {
      return [{
        file: 'error',
        line: 0,
        content: `Error searching logs: ${error}`,
        match: ''
      }];
    }
  }
}

// Convenience function for creating log manager
export function createLogManager(config?: Partial<LogManagerConfig>): LogManager {
  const defaultConfig: LogManagerConfig = {
    logDir: path.resolve(__dirname, '../../logs'),
    maxFileSize: 10 * 1024 * 1024, // 10MB
    maxFiles: 20,
    maxAge: 30, // 30 days
    compressOldLogs: false
  };

  const finalConfig = { ...defaultConfig, ...config };
  return new LogManager(finalConfig);
}
