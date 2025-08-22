#!/usr/bin/env tsx

import { execSync } from 'child_process';

// Base error interface for all script errors
export interface ScriptError extends Error {
  context?: string;
  command?: string;
  step?: string;
  originalError?: unknown;
}

// Error severity levels
export enum ErrorSeverity {
  INFO = 'info',
  WARNING = 'warning',
  ERROR = 'error',
  FATAL = 'fatal'
}

// Error context information
export interface ErrorContext {
  script: string;
  step?: string;
  command?: string;
  operation?: string;
  severity?: ErrorSeverity;
}

// Common error messages for different scenarios
export const COMMON_ERRORS = {
  CSV_PROCESSING: {
    title: 'CSV Processing Error',
    issues: [
      'Missing or corrupted CSV file',
      'Invalid CSV format or data structure',
      'Permission issues with file operations',
      'Missing required fields in CSV data'
    ]
  },
  DATA_VALIDATION: {
    title: 'Data Validation Error',
    issues: [
      'Missing or corrupted JSON data files',
      'Invalid data structure or missing required fields',
      'Type mismatches in data validation',
      'Missing vendor-affiliate relationships',
      'Data integrity violations'
    ]
  },
  BUILD_SYSTEM: {
    title: 'Build System Error',
    issues: [
      'Missing dependencies or TypeScript errors',
      'Permission issues with file operations',
      'Cache corruption or access issues',
      'Command execution failures'
    ]
  },
  FILE_OPERATIONS: {
    title: 'File Operation Error',
    issues: [
      'File not found or inaccessible',
      'Permission denied for file operations',
      'Disk space or quota issues',
      'File system corruption'
    ]
  }
} as const;

// Create a standardized error with context
export function createScriptError(
  message: string,
  context: ErrorContext,
  originalError?: unknown
): ScriptError {
  const error = new Error(message) as ScriptError;
  error.context = context.script;
  error.step = context.step;
  error.command = context.command;
  error.originalError = originalError;
  
  // Enhance message with context
  if (context.step) {
    error.message = `${context.step}: ${message}`;
  }
  if (context.operation) {
    error.message = `${context.operation} - ${error.message}`;
  }
  
  return error;
}

// Standardized error logging with context
export function logError(
  error: unknown,
  context: ErrorContext,
  commonErrorType?: keyof typeof COMMON_ERRORS
): void {
  const severity = context.severity || ErrorSeverity.ERROR;
  const emoji = severity === ErrorSeverity.FATAL ? '💥' : 
                severity === ErrorSeverity.ERROR ? '❌' :
                severity === ErrorSeverity.WARNING ? '⚠️' : 'ℹ️';
  
  console.error(`${emoji} ${context.script} Error`);
  console.error('=' .repeat(50));
  
  // Log context information
  if (context.step) {
    console.error(`Step: ${context.step}`);
  }
  if (context.command) {
    console.error(`Command: ${context.command}`);
  }
  if (context.operation) {
    console.error(`Operation: ${context.operation}`);
  }
  
  // Log error details
  if (error instanceof Error) {
    console.error(`Error Type: ${error.constructor.name}`);
    console.error(`Error Message: ${error.message}`);
    if (error.stack) {
      console.error(`\n📚 Stack Trace:`);
      console.error(error.stack.split('\n').slice(0, 5).join('\n'));
    }
  } else {
    console.error(`Error Type: ${typeof error}`);
    console.error(`Error Value: ${String(error)}`);
  }
  
  // Log common issues if specified
  if (commonErrorType && COMMON_ERRORS[commonErrorType]) {
    const commonError = COMMON_ERRORS[commonErrorType];
    console.error(`\n💡 Common ${commonError.title} Issues:`);
    commonError.issues.forEach(issue => {
      console.error(`   - ${issue}`);
    });
  }
  
  console.error('\n🔧 Check the logs above and fix the issue');
}

// Standardized command execution with error handling
export function runCommandWithErrorHandling(
  command: string,
  description: string,
  context: ErrorContext
): void {
  console.log(`🔄 ${description}...`);
  try {
    execSync(command, { stdio: 'inherit' });
    console.log(`✅ ${description} completed`);
  } catch (error: unknown) {
    const scriptError = createScriptError(
      `${description} failed`,
      { ...context, command, operation: 'Command Execution' },
      error
    );
    
    logError(scriptError, context, 'BUILD_SYSTEM');
    process.exit(1);
  }
}

// Standardized file operation error handling
export function handleFileOperationError(
  error: unknown,
  operation: string,
  filePath: string,
  context: ErrorContext
): void {
  const scriptError = createScriptError(
    `Could not ${operation} ${filePath}`,
    { ...context, operation: `File ${operation}` },
    error
  );
  
  logError(scriptError, context, 'FILE_OPERATIONS');
}

// Standardized CSV processing error handling
export function handleCSVError(
  error: unknown,
  context: ErrorContext
): void {
  const scriptError = createScriptError(
    'CSV processing failed',
    { ...context, operation: 'CSV Processing' },
    error
  );
  
  logError(scriptError, context, 'CSV_PROCESSING');
}

// Standardized data validation error handling
export function handleValidationError(
  error: unknown,
  context: ErrorContext
): void {
  const scriptError = createScriptError(
    'Data validation failed',
    { ...context, operation: 'Data Validation' },
    error
  );
  
  logError(scriptError, context, 'DATA_VALIDATION');
}

// Graceful error handling for non-critical operations
export function handleGracefulError(
  error: unknown,
  operation: string,
  context: ErrorContext,
  fallback?: () => void
): void {
  console.log(`⚠️  ${operation} failed`);
  if (error instanceof Error) {
    console.log(`   Reason: ${error.message}`);
  }
  
  if (fallback) {
    fallback();
  }
}

// Exit with error and context
export function exitWithError(
  error: unknown,
  context: ErrorContext,
  commonErrorType?: keyof typeof COMMON_ERRORS
): never {
  logError(error, context, commonErrorType);
  process.exit(1);
}
