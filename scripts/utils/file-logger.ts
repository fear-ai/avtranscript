#!/usr/bin/env tsx

import fs from 'fs';
import path from 'path';
import { createLogger, ScriptLogger } from './logger';

export interface LogFileConfig {
  logDir: string;
  maxFileSize: number; // in bytes
  maxFiles: number;
  timestampFormat: string;
}

export interface LogEntry {
  timestamp: string;
  level: 'debug' | 'info' | 'success' | 'warning' | 'error';
  script: string;
  operation?: string;
  step?: string;
  message: string;
  data?: any;
  error?: unknown;
}

export class FileLogger extends ScriptLogger {
  logStream: fs.WriteStream | null = null;
  currentLogFile: string = '';
  config: LogFileConfig;
  logBuffer: LogEntry[] = [];
  bufferSize: number = 0;
  maxBufferSize: number = 1024 * 1024; // 1MB buffer

  constructor(
    context: { script: string; operation?: string },
    config: LogFileConfig
  ) {
    super(context);
    this.config = config;
    this.ensureLogDirectory();
    this.rotateLogFile();
  }

  ensureLogDirectory(): void {
    if (!fs.existsSync(this.config.logDir)) {
      fs.mkdirSync(this.config.logDir, { recursive: true });
    }
  }

  rotateLogFile(): void {
    const timestamp = new Date().toISOString()
      .replace(/T/, '-')
      .replace(/:/g, '-')
      .replace(/\.\d{3}Z$/, '');
    
    const scriptName = this.context.script.replace(/\.ts$/, '');
    
    this.currentLogFile = path.join(
      this.config.logDir,
      `${scriptName}-${timestamp}.log`
    );

    // Close existing stream
    if (this.logStream) {
      this.logStream.end();
    }

    // Create new stream
    this.logStream = fs.createWriteStream(this.currentLogFile, { flags: 'a' });
    
    // Write header
    this.writeToFile('=== LOG START ===');
    this.writeToFile(`Script: ${this.context.script}`);
    this.writeToFile(`Operation: ${this.context.operation || 'N/A'}`);
    this.writeToFile(`Started: ${new Date().toISOString()}`);
    this.writeToFile('================');
  }

  writeToFile(content: string): void {
    if (this.logStream) {
      this.logStream.write(content + '\n');
    }
  }

  formatLogEntry(entry: LogEntry): string {
    const timestamp = entry.timestamp;
    const level = entry.level.toUpperCase().padEnd(7);
    const script = entry.script.padEnd(25);
    const operation = (entry.operation || '').padEnd(20);
    const step = (entry.step || '').padEnd(20);
    const message = entry.message;
    
    let formatted = `[${timestamp}] ${level} ${script} ${operation} ${step} ${message}`;
    
    if (entry.data) {
      formatted += `\n  Data: ${JSON.stringify(entry.data, null, 2)}`;
    }
    
    if (entry.error) {
      if (entry.error instanceof Error) {
        formatted += `\n  Error: ${entry.error.message}`;
        if (entry.error.stack) {
          formatted += `\n  Stack: ${entry.error.stack}`;
        }
      } else {
        formatted += `\n  Error: ${String(entry.error)}`;
      }
    }
    
    return formatted;
  }

  addToBuffer(entry: LogEntry): void {
    this.logBuffer.push(entry);
    this.bufferSize += JSON.stringify(entry).length;
    
    // Flush buffer if it gets too large
    if (this.bufferSize > this.maxBufferSize) {
      this.flushBuffer();
    }
  }

  flushBuffer(): void {
    if (this.logBuffer.length === 0) return;
    
    const content = this.logBuffer.map(entry => this.formatLogEntry(entry)).join('\n');
    this.writeToFile(content);
    
    this.logBuffer = [];
    this.bufferSize = 0;
  }

  // Override ScriptLogger methods to add file logging
  debug(message: string, data?: any): void {
    const entry: LogEntry = {
      timestamp: new Date().toISOString(),
      level: 'debug',
      script: this.context.script,
      operation: this.context.operation,
      step: this.context.step,
      message,
      data
    };
    
    this.addToBuffer(entry);
    super.debug(message, data);
  }

  info(message: string, data?: any): void {
    const entry: LogEntry = {
      timestamp: new Date().toISOString(),
      level: 'info',
      script: this.context.script,
      operation: this.context.operation,
      step: this.context.step,
      message,
      data
    };
    
    this.addToBuffer(entry);
    super.info(message, data);
  }

  success(message: string, data?: any): void {
    const entry: LogEntry = {
      timestamp: new Date().toISOString(),
      level: 'success',
      script: this.context.script,
      operation: this.context.operation,
      step: this.context.step,
      message,
      data
    };
    
    this.addToBuffer(entry);
    super.success(message, data);
  }

  warning(message: string, data?: any): void {
    const entry: LogEntry = {
      timestamp: new Date().toISOString(),
      level: 'warning',
      script: this.context.script,
      operation: this.context.operation,
      step: this.context.step,
      message,
      data
    };
    
    this.addToBuffer(entry);
    super.warning(message, data);
  }

  error(message: string, error?: unknown): void {
    const entry: LogEntry = {
      timestamp: new Date().toISOString(),
      level: 'error',
      script: this.context.script,
      operation: this.context.operation,
      step: this.context.step,
      message,
      error
    };
    
    this.addToBuffer(entry);
    super.error(message, error);
  }

  // Special methods for test runs
  testStart(testName: string, config?: any): void {
    this.writeToFile(`\n=== TEST START: ${testName} ===`);
    this.writeToFile(`Started: ${new Date().toISOString()}`);
    if (config) {
      this.writeToFile(`Config: ${JSON.stringify(config, null, 2)}`);
    }
    this.writeToFile('=====================');
  }

  testEnd(testName: string, result: 'PASS' | 'FAIL' | 'SKIP' | 'TIMEOUT', duration?: number): void {
    this.writeToFile(`\n=== TEST END: ${testName} ===`);
    this.writeToFile(`Result: ${result}`);
    this.writeToFile(`Ended: ${new Date().toISOString()}`);
    if (duration !== undefined) {
      this.writeToFile(`Duration: ${duration}ms`);
    }
    this.writeToFile('===================');
  }

  commandExecution(command: string, description: string, startTime: number): void {
    this.writeToFile(`\n--- COMMAND EXECUTION ---`);
    this.writeToFile(`Command: ${command}`);
    this.writeToFile(`Description: ${description}`);
    this.writeToFile(`Start Time: ${new Date(startTime).toISOString()}`);
  }

  commandResult(command: string, exitCode: number, duration: number, output?: string, error?: string): void {
    this.writeToFile(`\n--- COMMAND RESULT ---`);
    this.writeToFile(`Command: ${command}`);
    this.writeToFile(`Exit Code: ${exitCode}`);
    this.writeToFile(`Duration: ${duration}ms`);
    this.writeToFile(`End Time: ${new Date().toISOString()}`);
    
    if (output) {
      this.writeToFile(`Output:\n${output}`);
    }
    
    if (error) {
      this.writeToFile(`Error:\n${error}`);
    }
    
    this.writeToFile('---------------------');
  }

  // Flush and close
  flush(): void {
    this.flushBuffer();
  }

  close(): void {
    this.flush();
    if (this.logStream) {
      this.logStream.end();
      this.logStream = null;
    }
  }

  // Get log file path
  getLogFilePath(): string {
    return this.currentLogFile;
  }

  // Get log directory
  getLogDirectory(): string {
    return this.config.logDir;
  }
}

// Convenience function for creating file loggers
export function createFileLogger(
  scriptName: string, 
  operation?: string, 
  config?: Partial<LogFileConfig>
): FileLogger {
  const defaultConfig: LogFileConfig = {
    logDir: path.resolve(__dirname, '../../logs'),
    maxFileSize: 10 * 1024 * 1024, // 10MB
    maxFiles: 10,
    timestampFormat: 'ISO'
  };

  const finalConfig = { ...defaultConfig, ...config };
  
  return new FileLogger(
    { script: scriptName, operation },
    finalConfig
  );
}

// Global file logger for simple cases
export const globalFileLogger = createFileLogger('global');
