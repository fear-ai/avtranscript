#!/usr/bin/env tsx

export interface LogContext {
  script: string
  operation?: string
  step?: string
  data?: Record<string, any>
}

export enum LogLevel {
  DEBUG = 'debug',
  INFO = 'info',
  SUCCESS = 'success',
  WARNING = 'warning',
  ERROR = 'error'
}

export class ScriptLogger {
  context: LogContext
  
  constructor(context: LogContext) {
    this.context = context
  }
  
  // Getter for context to allow subclasses to access it
  protected getContext(): LogContext {
    return this.context
  }
  
  private formatMessage(level: LogLevel, message: string, data?: any): string {
    const timestamp = new Date().toISOString()
    const emoji = this.getLevelEmoji(level)
    const script = this.context.script
    const operation = this.context.operation ? ` [${this.context.operation}]` : ''
    const step = this.context.step ? ` (${this.context.step})` : ''
    
    return `${timestamp} ${emoji} ${script}${operation}${step}: ${message}`
  }
  
  private getLevelEmoji(level: LogLevel): string {
    const emojis = {
      [LogLevel.DEBUG]: '🔍',
      [LogLevel.INFO]: 'ℹ️',
      [LogLevel.SUCCESS]: '✅',
      [LogLevel.WARNING]: '⚠️',
      [LogLevel.ERROR]: '❌'
    }
    return emojis[level] || 'ℹ️'
  }
  
  debug(message: string, data?: any): void {
    if (process.env.DEBUG) {
      console.log(this.formatMessage(LogLevel.DEBUG, message), data || '')
    }
  }
  
  info(message: string, data?: any): void {
    console.log(this.formatMessage(LogLevel.INFO, message), data || '')
  }
  
  success(message: string, data?: any): void {
    console.log(this.formatMessage(LogLevel.SUCCESS, message), data || '')
  }
  
  warning(message: string, data?: any): void {
    console.warn(this.formatMessage(LogLevel.WARNING, message), data || '')
  }
  
  error(message: string, error?: unknown): void {
    console.error(this.formatMessage(LogLevel.ERROR, message))
    if (error) {
      console.error('   Error details:', error)
    }
  }
  
  progress(operation: string): void {
    this.info(`${operation}...`)
  }
  
  completed(operation: string, data?: any): void {
    this.success(`${operation} completed`, data)
  }
  
  // Specialized logging methods
  dataProcessed(type: string, count: number, details?: any): void {
    this.success(`Processed ${count} ${type}`, details)
  }
  
  fileOperation(operation: string, filePath: string): void {
    this.info(`${operation} file`, { path: filePath })
  }
  
  validationResult(type: string, count: number, errors?: any): void {
    if (errors && Object.keys(errors).length > 0) {
      this.warning(`Validation completed for ${count} ${type} with issues`, errors)
    } else {
      this.success(`Validation completed for ${count} ${type}`)
    }
  }
  
  csvParsed(type: string, count: number, headers?: string[]): void {
    this.success(`Parsed ${count} ${type} from CSV`, headers ? { headers } : undefined)
  }
  
  jsonGenerated(type: string, filePath: string, metadata?: any): void {
    this.success(`Generated JSON for ${type}`, { path: filePath, ...metadata })
  }
  
  buildStep(step: string, details?: any): void {
    this.info(`Build step: ${step}`, details)
  }
  
  cacheOperation(operation: string, details?: any): void {
    this.debug(`Cache ${operation}`, details)
  }
  
  // Context management
  withStep(step: string): ScriptLogger {
    return new ScriptLogger({ ...this.context, step })
  }
  
  withOperation(operation: string): ScriptLogger {
    return new ScriptLogger({ ...this.context, operation })
  }
  
  withData(data: Record<string, any>): ScriptLogger {
    return new ScriptLogger({ ...this.context, data })
  }
}

// Convenience function for quick logging
export function createLogger(scriptName: string, operation?: string): ScriptLogger {
  return new ScriptLogger({ script: scriptName, operation })
}

// Global logger for simple cases
export const globalLogger = createLogger('global')
