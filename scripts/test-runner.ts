#!/usr/bin/env tsx

import { execSync, spawn } from 'child_process';
import { createFileLogger, FileLogger } from './utils/file-logger';
import { getDataPath } from './utils/paths';
import * as path from 'path';
import * as fs from 'fs';

interface TestConfig {
  name: string;
  command: string;
  description: string;
  timeout?: number;
  expectedExitCode?: number;
  dependencies?: string[];
}

interface TestResult {
  name: string;
  status: 'PASS' | 'FAIL' | 'SKIP' | 'TIMEOUT';
  duration: number;
  exitCode: number;
  output: string;
  error: string;
  startTime: Date;
  endTime: Date;
}

class TestRunner {
  private logger: FileLogger;
  private results: TestResult[] = [];
  private startTime: number;

  constructor() {
    this.logger = createFileLogger('test', 'Comprehensive');
    this.startTime = Date.now();
  }

  async runTests(): Promise<void> {
    this.logger.testStart('Comprehensive Test Suite', {
      totalTests: this.getTestConfigs().length,
      startTime: new Date(this.startTime).toISOString()
    });

    const testConfigs = this.getTestConfigs();
    
    for (const config of testConfigs) {
      await this.runTest(config);
    }

    this.generateReport();
    this.logger.close();
  }

  private getTestConfigs(): TestConfig[] {
    return [
      {
        name: 'Data Pipeline - Convert Vendors',
        command: 'npm run convert:vendors',
        description: 'Convert vendor CSV to JSON format',
        expectedExitCode: 0
      },
      {
        name: 'Data Pipeline - Convert Affiliates',
        command: 'npm run convert:affiliates',
        description: 'Convert affiliate CSV to JSON format',
        expectedExitCode: 0
      },
      {
        name: 'Data Pipeline - Convert All',
        command: 'npm run convert:all',
        description: 'Convert all CSV data to JSON format',
        expectedExitCode: 0
      },
      {
        name: 'Data Pipeline - Compile All',
        command: 'npm run compile:all',
        description: 'Compile JSON data to TypeScript',
        expectedExitCode: 0,
        dependencies: ['Data Pipeline - Convert All']
      },
      {
        name: 'Data Validation - Validate Vendors',
        command: 'npm run validate:vendors',
        description: 'Validate vendor data integrity',
        expectedExitCode: 0,
        dependencies: ['Data Pipeline - Convert Vendors']
      },
      {
        name: 'Data Validation - Validate Affiliates',
        command: 'npm run validate:affiliates',
        description: 'Validate affiliate data integrity',
        expectedExitCode: 0,
        dependencies: ['Data Pipeline - Convert Affiliates']
      },
      {
        name: 'Data Validation - Validate All',
        command: 'npm run validate:all',
        description: 'Validate all data integrity',
        expectedExitCode: 0,
        dependencies: ['Data Pipeline - Convert All']
      },
      {
        name: 'Build System - Smart Build',
        command: 'npm run prebuild',
        description: 'Smart build with dependency checking',
        expectedExitCode: 0,
        dependencies: ['Data Pipeline - Compile All']
      },
      {
        name: 'Build System - Production Build',
        command: 'npm run build',
        description: 'Production Next.js build',
        expectedExitCode: 0,
        dependencies: ['Build System - Smart Build']
      },
      {
        name: 'Type Checking',
        command: 'npm run type-check',
        description: 'TypeScript type checking',
        expectedExitCode: 0
      }
    ];
  }

  private async runTest(config: TestConfig): Promise<void> {
    const testStartTime = Date.now();
    this.logger.testStart(config.name, config);

    // Check dependencies
    if (config.dependencies) {
      const missingDeps = config.dependencies.filter(dep => 
        !this.results.some(r => r.name === dep && r.status === 'PASS')
      );
      
      if (missingDeps.length > 0) {
        this.logger.warning(`Skipping ${config.name} - missing dependencies: ${missingDeps.join(', ')}`);
        this.results.push({
          name: config.name,
          status: 'SKIP',
          duration: 0,
          exitCode: 0,
          output: '',
          error: `Missing dependencies: ${missingDeps.join(', ')}`,
          startTime: new Date(testStartTime),
          endTime: new Date(testStartTime)
        });
        return;
      }
    }

    try {
      this.logger.commandExecution(config.command, config.description, testStartTime);
      
      const result = await this.executeCommand(config.command, config.timeout || 30000);
      const testEndTime = Date.now();
      const duration = testEndTime - testStartTime;

      const testResult: TestResult = {
        name: config.name,
        status: this.determineStatus(result.exitCode, config.expectedExitCode, result.error),
        duration,
        exitCode: result.exitCode,
        output: result.output,
        error: result.error,
        startTime: new Date(testStartTime),
        endTime: new Date(testEndTime)
      };

      this.results.push(testResult);
      
      this.logger.commandResult(
        config.command,
        result.exitCode,
        duration,
        result.output,
        result.error
      );

      this.logger.testEnd(config.name, testResult.status, duration);

      if (testResult.status === 'PASS') {
        this.logger.success(`${config.name} completed successfully in ${duration}ms`);
      } else {
        this.logger.error(`${config.name} failed with exit code ${result.exitCode}`);
      }

    } catch (error: unknown) {
      const testEndTime = Date.now();
      const duration = testEndTime - testStartTime;

      const testResult: TestResult = {
        name: config.name,
        status: 'FAIL',
        duration,
        exitCode: -1,
        output: '',
        error: error instanceof Error ? error.message : String(error),
        startTime: new Date(testStartTime),
        endTime: new Date(testEndTime)
      };

      this.results.push(testResult);
      this.logger.error(`${config.name} failed with error`, error);
      this.logger.testEnd(config.name, 'FAIL', duration);
    }
  }

  private async executeCommand(command: string, timeout: number): Promise<{
    exitCode: number;
    output: string;
    error: string;
  }> {
    return new Promise((resolve) => {
      const startTime = Date.now();
      let output = '';
      let error = '';
      let timedOut = false;

      const timeoutId = setTimeout(() => {
        timedOut = true;
        child.kill('SIGTERM');
      }, timeout);

      const child = spawn(command, [], {
        shell: true,
        stdio: ['pipe', 'pipe', 'pipe']
      });

      child.stdout?.on('data', (data) => {
        output += data.toString();
      });

      child.stderr?.on('data', (data) => {
        error += data.toString();
      });

      child.on('close', (code) => {
        clearTimeout(timeoutId);
        
        if (timedOut) {
          resolve({
            exitCode: -1,
            output,
            error: `Command timed out after ${timeout}ms`
          });
        } else {
          resolve({
            exitCode: code || 0,
            output,
            error
          });
        }
      });

      child.on('error', (err) => {
        clearTimeout(timeoutId);
        resolve({
          exitCode: -1,
          output,
          error: err.message
        });
      });
    });
  }

  private determineStatus(exitCode: number, expectedExitCode?: number, error?: string): 'PASS' | 'FAIL' | 'SKIP' | 'TIMEOUT' {
    if (exitCode === -1) {
      return error?.includes('timed out') ? 'TIMEOUT' : 'FAIL';
    }
    
    if (expectedExitCode !== undefined && exitCode !== expectedExitCode) {
      return 'FAIL';
    }
    
    return exitCode === 0 ? 'PASS' : 'FAIL';
  }

  private generateReport(): void {
    const totalTests = this.results.length;
    const passedTests = this.results.filter(r => r.status === 'PASS').length;
    const failedTests = this.results.filter(r => r.status === 'FAIL').length;
    const skippedTests = this.results.filter(r => r.status === 'SKIP').length;
    const timedOutTests = this.results.filter(r => r.status === 'TIMEOUT').length;
    
    const totalDuration = this.results.reduce((sum, r) => sum + r.duration, 0);
    const overallDuration = Date.now() - this.startTime;

    this.logger.writeToFile('\n=== TEST SUITE SUMMARY ===');
    this.logger.writeToFile(`Total Tests: ${totalTests}`);
    this.logger.writeToFile(`Passed: ${passedTests}`);
    this.logger.writeToFile(`Failed: ${failedTests}`);
    this.logger.writeToFile(`Skipped: ${skippedTests}`);
    this.logger.writeToFile(`Timed Out: ${timedOutTests}`);
    this.logger.writeToFile(`Success Rate: ${((passedTests / totalTests) * 100).toFixed(1)}%`);
    this.logger.writeToFile(`Total Duration: ${totalDuration}ms`);
    this.logger.writeToFile(`Overall Duration: ${overallDuration}ms`);
    this.logger.writeToFile('==========================');

    // Detailed results
    this.logger.writeToFile('\n=== DETAILED RESULTS ===');
    this.results.forEach(result => {
      this.logger.writeToFile(`\n${result.name}:`);
      this.logger.writeToFile(`  Status: ${result.status}`);
      this.logger.writeToFile(`  Duration: ${result.duration}ms`);
      this.logger.writeToFile(`  Exit Code: ${result.exitCode}`);
      this.logger.writeToFile(`  Start: ${result.startTime.toISOString()}`);
      this.logger.writeToFile(`  End: ${result.endTime.toISOString()}`);
      
      if (result.output) {
        this.logger.writeToFile(`  Output: ${result.output.substring(0, 200)}${result.output.length > 200 ? '...' : ''}`);
      }
      
      if (result.error) {
        this.logger.writeToFile(`  Error: ${result.error}`);
      }
    });
    this.logger.writeToFile('=======================');

    // Generate summary report file
    this.generateSummaryFile();
  }

  private generateSummaryFile(): void {
    const timestamp = new Date().toISOString()
      .replace(/T/, '-')
      .replace(/:/g, '-')
      .replace(/\.\d{3}Z$/, '');
    
    const summaryPath = path.join(this.logger.getLogDirectory(), `summary-${timestamp}.json`);
    const summary = {
      timestamp: new Date().toISOString(),
      totalTests: this.results.length,
      passed: this.results.filter(r => r.status === 'PASS').length,
      failed: this.results.filter(r => r.status === 'FAIL').length,
      skipped: this.results.filter(r => r.status === 'SKIP').length,
      timedOut: this.results.filter(r => r.status === 'TIMEOUT').length,
      successRate: (this.results.filter(r => r.status === 'PASS').length / this.results.length) * 100,
      totalDuration: this.results.reduce((sum, r) => sum + r.duration, 0),
      overallDuration: Date.now() - this.startTime,
      results: this.results.map(r => ({
        name: r.name,
        status: r.status,
        duration: r.duration,
        exitCode: r.exitCode,
        startTime: r.startTime.toISOString(),
        endTime: r.endTime.toISOString()
      }))
    };

    fs.writeFileSync(summaryPath, JSON.stringify(summary, null, 2));
    this.logger.info(`Test summary written to: ${summaryPath}`);
  }
}

// Run tests if this script is executed directly
if (require.main === module) {
  const runner = new TestRunner();
  runner.runTests().catch(error => {
    console.error('Test runner failed:', error);
    process.exit(1);
  });
}
