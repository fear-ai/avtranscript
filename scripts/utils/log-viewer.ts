#!/usr/bin/env tsx

import { createLogManager, LogManager } from './log-manager';
import path from 'path';

class LogViewer {
  logManager: LogManager;

  constructor() {
    this.logManager = createLogManager();
  }

  showLogStats(): void {
    console.log('\n📊 LOG STATISTICS');
    console.log('==================');
    
    const stats = this.logManager.getLogStats();
    console.log(`Total Log Files: ${stats.totalFiles}`);
    console.log(`Total Size: ${this.formatBytes(stats.totalSize)}`);
    console.log(`Oldest File: ${stats.oldestFile || 'None'}`);
    console.log(`Newest File: ${stats.newestFile || 'None'}`);
    console.log(`Average File Size: ${this.formatBytes(stats.averageFileSize)}`);
  }

  listLogFiles(): void {
    console.log('\n📁 LOG FILES');
    console.log('=============');
    
    const files = this.logManager.listLogFiles();
    
    if (files.length === 0) {
      console.log('No log files found.');
      return;
    }

    files.forEach((file, index) => {
      console.log(`${index + 1}. ${file.name}`);
      console.log(`   Size: ${this.formatBytes(file.size)}`);
      console.log(`   Age: ${file.age}`);
      console.log(`   Modified: ${file.modified.toLocaleString()}`);
      console.log('');
    });
  }

  showLogContents(fileName: string, maxLines: number = 50): void {
    console.log(`\n📖 LOG CONTENTS: ${fileName}`);
    console.log('=' .repeat(50));
    
    const contents = this.logManager.getLogContents(fileName, maxLines);
    
    if (contents.length === 0) {
      console.log('Log file is empty or could not be read.');
      return;
    }

    contents.forEach((line, index) => {
      if (line.startsWith('===') || line.startsWith('---')) {
        console.log(`\n${line}`);
      } else if (line.includes('ERROR')) {
      console.log(`❌ ${line}`);
      } else if (line.includes('WARNING')) {
        console.log(`⚠️  ${line}`);
      } else if (line.includes('SUCCESS')) {
        console.log(`✅ ${line}`);
      } else if (line.includes('INFO')) {
        console.log(`ℹ️  ${line}`);
      } else {
        console.log(line);
      }
    });
  }

  searchLogs(pattern: string, maxResults: number = 20): void {
    console.log(`\n🔍 SEARCHING LOGS FOR: "${pattern}"`);
    console.log('=' .repeat(50));
    
    const results = this.logManager.searchLogs(pattern, maxResults);
    
    if (results.length === 0) {
      console.log('No matches found.');
      return;
    }

    console.log(`Found ${results.length} matches:\n`);
    
    results.forEach((result, index) => {
      console.log(`${index + 1}. File: ${result.file} (Line ${result.line})`);
      console.log(`   Match: ${result.match}`);
      console.log(`   Content: ${result.content}`);
      console.log('');
    });
  }

  showTestSummary(): void {
    try {
      const fs = require('fs');
      const path = require('path');
      
      // Find the most recent summary file
      const logDir = this.logManager.config.logDir;
      const files = fs.readdirSync(logDir);
      const summaryFiles = files
        .filter((file: string) => file.startsWith('summary-') && file.endsWith('.json'))
        .map((file: string) => path.join(logDir, file))
        .sort()
        .reverse(); // Most recent first
      
      if (summaryFiles.length === 0) {
        console.log('No test summary files found.');
        return;
      }
      
      // Get the most recent summary file
      const latestSummary = summaryFiles[0];
      if (fs.existsSync(latestSummary)) {
        const summary = JSON.parse(fs.readFileSync(latestSummary, 'utf-8'));
        
        console.log('\n📋 TEST SUMMARY');
        console.log('================');
        console.log(`Timestamp: ${summary.timestamp}`);
        console.log(`Total Tests: ${summary.totalTests}`);
        console.log(`Passed: ${summary.passed}`);
        console.log(`Failed: ${summary.failed}`);
        console.log(`Skipped: ${summary.skipped}`);
        console.log(`Timed Out: ${summary.timedOut}`);
        console.log(`Success Rate: ${summary.successRate.toFixed(1)}%`);
        console.log(`Total Duration: ${summary.totalDuration}ms`);
        console.log(`Overall Duration: ${summary.overallDuration}ms`);
        
        if (summary.results && summary.results.length > 0) {
          console.log('\n📊 DETAILED RESULTS:');
          summary.results.forEach((result: any, index: number) => {
            const statusIcon = result.status === 'PASS' ? '✅' : 
                              result.status === 'FAIL' ? '❌' : 
                              result.status === 'SKIP' ? '⏭️' : '⏰';
            
            console.log(`${index + 1}. ${statusIcon} ${result.name}`);
            console.log(`   Status: ${result.status}`);
            console.log(`   Duration: ${result.duration}ms`);
            console.log(`   Exit Code: ${result.exitCode}`);
            console.log(`   Start: ${result.startTime}`);
            console.log(`   End: ${result.endTime}`);
            console.log('');
          });
        }
      } else {
        console.log('Test summary file not found.');
      }
    } catch (error) {
      console.error('Error reading test summary:', error);
    }
  }

  formatBytes(bytes: number): string {
    if (bytes === 0) return '0 B';
    
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  showHelp(): void {
    console.log('\n📚 LOG VIEWER HELP');
    console.log('===================');
    console.log('Available commands:');
    console.log('  stats                    - Show log statistics');
    console.log('  list                     - List all log files');
    console.log('  show <filename> [lines]  - Show log file contents');
    console.log('  search <pattern>         - Search logs for pattern');
    console.log('  summary                  - Show test summary');
    console.log('  help                     - Show this help');
    console.log('  exit                     - Exit the viewer');
    console.log('');
    console.log('Examples:');
    console.log('  show test-runner-Comprehensive-Testing-2025-08-21T22-59-43-515Z.log');
    console.log('  show test-runner-Comprehensive-Testing-2025-08-21T22-59-43-515Z.log 100');
    console.log('  search "ERROR"');
    console.log('  search "npm run convert"');
  }

  async interactive(): Promise<void> {
    const readline = require('readline');
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });

    console.log('🚀 LOG VIEWER - Interactive Mode');
    console.log('Type "help" for available commands, "exit" to quit\n');

    const question = (prompt: string): Promise<string> => {
      return new Promise((resolve) => {
        rl.question(prompt, resolve);
      });
    };

    try {
      while (true) {
        const input = await question('log-viewer> ');
        const parts = input.trim().split(' ');
        const command = parts[0].toLowerCase();

        switch (command) {
          case 'stats':
            this.showLogStats();
            break;
          case 'list':
            this.listLogFiles();
            break;
          case 'show':
            if (parts.length < 2) {
              console.log('Usage: show <filename> [lines]');
            } else {
              const fileName = parts[1];
              const maxLines = parts[2] ? parseInt(parts[2]) : 50;
              this.showLogContents(fileName, maxLines);
            }
            break;
          case 'search':
            if (parts.length < 2) {
              console.log('Usage: search <pattern>');
            } else {
              const pattern = parts.slice(1).join(' ');
              this.searchLogs(pattern);
            }
            break;
          case 'summary':
            this.showTestSummary();
            break;
          case 'help':
            this.showHelp();
            break;
          case 'exit':
          case 'quit':
            console.log('Goodbye! 👋');
            rl.close();
            return;
          default:
            console.log(`Unknown command: ${command}. Type "help" for available commands.`);
        }
        console.log('');
      }
    } finally {
      rl.close();
    }
  }
}

// Run interactive mode if this script is executed directly
if (require.main === module) {
  const viewer = new LogViewer();
  
  if (process.argv.length > 2) {
    // Command line mode
    const command = process.argv[2];
    
    switch (command) {
      case 'stats':
        viewer.showLogStats();
        break;
      case 'list':
        viewer.listLogFiles();
        break;
      case 'show':
        if (process.argv.length < 4) {
          console.log('Usage: tsx log-viewer.ts show <filename> [lines]');
          process.exit(1);
        }
        const fileName = process.argv[3];
        const maxLines = process.argv[4] ? parseInt(process.argv[4]) : 50;
        viewer.showLogContents(fileName, maxLines);
        break;
      case 'search':
        if (process.argv.length < 4) {
          console.log('Usage: tsx log-viewer.ts search <pattern>');
          process.exit(1);
        }
        const pattern = process.argv[3];
        viewer.searchLogs(pattern);
        break;
      case 'summary':
        viewer.showTestSummary();
        break;
      default:
        console.log(`Unknown command: ${command}`);
        viewer.showHelp();
        process.exit(1);
    }
  } else {
    // Interactive mode
    viewer.interactive().catch(error => {
      console.error('Error in interactive mode:', error);
      process.exit(1);
    });
  }
}
