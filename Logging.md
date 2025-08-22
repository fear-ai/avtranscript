# Comprehensive Logging System

## **📊 OVERVIEW**

The comprehensive logging system captures all test runs, errors, regular outputs, and command executions to structured log files in the `logs/` subdirectory. This provides detailed debugging information, performance metrics, and historical data for troubleshooting and analysis.

---

## **🏗️ SYSTEM ARCHITECTURE**

### **Core Components**

1. **FileLogger** (`scripts/utils/file-logger.ts`)
   - Extends the base ScriptLogger with file output capabilities
   - Buffers log entries for performance
   - Rotates log files automatically
   - Captures structured log data with timestamps

2. **TestRunner** (`scripts/test-runner.ts`)
   - Executes comprehensive test suites
   - Captures command outputs and errors
   - Tracks test dependencies and execution order
   - Generates detailed reports and summaries

3. **LogManager** (`scripts/utils/log-manager.ts`)
   - Manages log file lifecycle
   - Handles log rotation and cleanup
   - Provides log statistics and search capabilities
   - Archives old logs

4. **LogViewer** (`scripts/utils/log-viewer.ts`)
   - Interactive and command-line log viewing
   - Search and filter capabilities
   - Test summary display
   - Log file statistics

---

## **🚀 GETTING STARTED**

### **1. Run Comprehensive Tests**

```bash
# Run all tests with comprehensive logging
npm run test:comprehensive
```

This will:
- Execute all test commands in dependency order
- Capture all outputs and errors to log files
- Generate a test summary JSON file
- Create timestamped log files for each test run

### **2. View Log Files**

```bash
# View log statistics
npm run logs:stats

# List all log files
npm run logs:list

# View test summary
npm run logs:summary

# Search logs for specific patterns
npm run logs:search "ERROR"
npm run logs:search "npm run convert"
```

### **3. Interactive Log Viewer**

```bash
# Start interactive mode
npm run logs:view
```

Interactive commands:
- `stats` - Show log statistics
- `list` - List all log files
- `show <filename> [lines]` - Show log contents
- `search <pattern>` - Search logs
- `summary` - Show test summary
- `help` - Show help
- `exit` - Exit viewer

---

## **📁 LOG FILE STRUCTURE**

### **Directory Layout**
```
logs/
├── test-runner-Comprehensive-Testing-{timestamp}.log    # Main test run log
├── test-summary.json                                    # Test results summary
├── global-{timestamp}.log                               # Global operations log
└── archive-{timestamp}/                                 # Archived logs (if enabled)
```

### **Log File Naming Convention**
- **Format**: `{script}-{operation}-{timestamp}.log`
- **Example**: `test-runner-Comprehensive-Testing-2025-08-21T22-59-43-515Z.log`
- **Timestamp**: ISO format with colons replaced by hyphens for file system compatibility

### **Log File Contents**

#### **Header Section**
```
=== LOG START ===
Script: test-runner
Operation: Comprehensive Testing
Started: 2025-08-21T22:59:43.515Z
================
```

#### **Test Execution Section**
```
=== TEST START: Data Pipeline - Convert Vendors ===
Started: 2025-08-21T22:59:43.515Z
Config: {
  "name": "Data Pipeline - Convert Vendors",
  "command": "npm run convert:vendors",
  "description": "Convert vendor CSV to JSON format",
  "expectedExitCode": 0
}
=====================

--- COMMAND EXECUTION ---
Command: npm run convert:vendors
Description: Convert vendor CSV to JSON format
Start Time: 2025-08-21T22:59:43.515Z

--- COMMAND RESULT ---
Command: npm run convert:vendors
Exit Code: 1
Duration: 361ms
End Time: 2025-08-21T22:59:43.876Z
Error: [Error details...]
---------------------

=== TEST END: Data Pipeline - Convert Vendors ===
Result: FAIL
Ended: 2025-08-21T22:59:43.876Z
Duration: 361ms
===================
```

#### **Structured Log Entries**
```
[2025-08-21T22:59:43.876Z] ERROR   test-runner               Comprehensive Testing                      Data Pipeline - Convert Vendors failed with exit code 1
[2025-08-21T22:59:44.804Z] WARNING test-runner               Comprehensive Testing                      Skipping Data Pipeline - Compile All - missing dependencies: Data Pipeline - Convert All
```

---

## **🔍 LOG ANALYSIS CAPABILITIES**

### **1. Test Execution Analysis**

#### **Success Metrics**
- **Total Tests**: Number of tests in the suite
- **Passed**: Successfully completed tests
- **Failed**: Tests that encountered errors
- **Skipped**: Tests skipped due to missing dependencies
- **Timed Out**: Tests that exceeded time limits
- **Success Rate**: Percentage of passed tests

#### **Performance Metrics**
- **Total Duration**: Sum of all test execution times
- **Overall Duration**: Wall-clock time for entire test suite
- **Individual Test Timing**: Per-test execution times
- **Dependency Chain Analysis**: Test execution order and bottlenecks

### **2. Error Analysis**

#### **Error Categories**
- **Command Failures**: npm script execution errors
- **Validation Errors**: Data validation failures
- **Type Errors**: TypeScript compilation errors
- **Dependency Errors**: Missing prerequisites
- **Timeout Errors**: Long-running operations

#### **Error Context**
- **Script Name**: Which script generated the error
- **Operation**: What operation was being performed
- **Step**: Specific step within the operation
- **Command**: Exact command that failed
- **Exit Code**: Process exit code
- **Error Message**: Detailed error description
- **Stack Trace**: Error stack trace (if available)

### **3. Command Output Analysis**

#### **Captured Data**
- **Standard Output**: Normal command output
- **Standard Error**: Error messages and warnings
- **Exit Codes**: Process completion status
- **Execution Time**: Command duration
- **Dependencies**: Prerequisite test requirements

---

## **📊 LOG MANAGEMENT FEATURES**

### **1. Automatic Log Rotation**

#### **File Size Limits**
- **Default**: 10MB per log file
- **Configurable**: Via LogFileConfig
- **Automatic**: New files created when limit reached

#### **File Count Limits**
- **Default**: 20 log files maximum
- **Cleanup**: Oldest files removed automatically
- **Configurable**: Via LogManagerConfig

### **2. Log Cleanup**

#### **Age-Based Cleanup**
- **Default**: 30 days retention
- **Configurable**: Via LogManagerConfig
- **Automatic**: Old files removed during cleanup

#### **Manual Cleanup**
```typescript
import { createLogManager } from './scripts/utils/log-manager';

const logManager = createLogManager();
logManager.cleanupOldLogs();
```

### **3. Log Archiving**

#### **Archive Creation**
```typescript
const archivePath = logManager.archiveLogs('my-archive');
```

#### **Archive Features**
- **Timestamped**: Automatic timestamp in archive name
- **Compressed**: Future enhancement with tar.gz support
- **Organized**: Structured archive directory

---

## **🔧 CONFIGURATION OPTIONS**

### **FileLogger Configuration**

```typescript
interface LogFileConfig {
  logDir: string;           // Log directory path
  maxFileSize: number;      // Maximum file size in bytes
  maxFiles: number;         // Maximum number of log files
  timestampFormat: string;  // Timestamp format
}

const config: LogFileConfig = {
  logDir: './logs',
  maxFileSize: 10 * 1024 * 1024, // 10MB
  maxFiles: 20,
  timestampFormat: 'ISO'
};
```

### **LogManager Configuration**

```typescript
interface LogManagerConfig {
  logDir: string;           // Log directory path
  maxFileSize: number;      // Maximum file size in bytes
  maxFiles: number;         // Maximum number of log files
  maxAge: number;           // Maximum age in days
  compressOldLogs: boolean; // Enable log compression
}

const config: LogManagerConfig = {
  logDir: './logs',
  maxFileSize: 10 * 1024 * 1024, // 10MB
  maxFiles: 20,
  maxAge: 30,               // 30 days
  compressOldLogs: false
};
```

---

## **📋 USAGE EXAMPLES**

### **1. Basic Test Execution**

```bash
# Run comprehensive tests
npm run test:comprehensive

# Check results
npm run logs:summary
npm run logs:stats
```

### **2. Log Analysis**

```bash
# Find all errors
npm run logs:search "ERROR"

# Find specific command failures
npm run logs:search "npm run convert"

# Find validation errors
npm run logs:search "Validation error"

# Find timeout issues
npm run logs:search "timed out"
```

### **3. Log File Inspection**

```bash
# List all log files
npm run logs:list

# View specific log file (last 50 lines)
npm run logs:show test-runner-Comprehensive-Testing-2025-08-21T22-59-43-515Z.log

# View specific log file (last 100 lines)
npm run logs:show test-runner-Comprehensive-Testing-2025-08-21T22-59-43-515Z.log 100
```

### **4. Interactive Mode**

```bash
# Start interactive viewer
npm run logs:view

# Interactive commands
log-viewer> stats
log-viewer> list
log-viewer> show test-runner-Comprehensive-Testing-2025-08-21T22-59-43-515Z.log
log-viewer> search "ERROR"
log-viewer> summary
log-viewer> help
log-viewer> exit
```

---

## **🚨 TROUBLESHOOTING**

### **Common Issues**

#### **1. Log Files Not Created**
- **Check permissions**: Ensure write access to logs directory
- **Check directory**: Verify logs directory exists
- **Check script**: Ensure test runner is executing correctly

#### **2. Log Files Too Large**
- **Reduce maxFileSize**: Configure smaller file size limits
- **Increase rotation**: More frequent log file rotation
- **Enable compression**: Use log archiving features

#### **3. Missing Log Entries**
- **Check buffer size**: Increase maxBufferSize if needed
- **Check flush calls**: Ensure logs are flushed before script exit
- **Check file streams**: Verify file streams are properly closed

#### **4. Performance Issues**
- **Reduce log verbosity**: Use appropriate log levels
- **Enable buffering**: Use buffered logging for high-volume operations
- **Optimize file I/O**: Use async operations where possible

### **Debug Commands**

```bash
# Check log directory structure
ls -la logs/

# Verify log file permissions
ls -la logs/*.log

# Check log file contents
head -20 logs/latest.log
tail -20 logs/latest.log

# Search for specific errors
grep -r "ERROR" logs/
grep -r "npm run convert" logs/
```

---

## **🔮 FUTURE ENHANCEMENTS**

### **Planned Features**

1. **Real-time Log Streaming**
   - Live log monitoring during test execution
   - WebSocket-based real-time updates
   - Browser-based log viewer

2. **Advanced Search and Filtering**
   - Full-text search across all log files
   - Regular expression support
   - Date range filtering
   - Log level filtering

3. **Log Analytics Dashboard**
   - Performance trend analysis
   - Error pattern recognition
   - Test execution statistics
   - Historical performance data

4. **Integration with CI/CD**
   - Jenkins/ GitHub Actions integration
   - Automated log analysis
   - Failure notification systems
   - Performance regression detection

5. **Log Compression and Storage**
   - Automatic log compression
   - Cloud storage integration
   - Long-term log retention
   - Backup and restore capabilities

---

## **📚 API REFERENCE**

### **FileLogger Class**

```typescript
class FileLogger extends ScriptLogger {
  constructor(context: { script: string; operation?: string }, config: LogFileConfig);
  
  // Test-specific methods
  testStart(testName: string, config?: any): void;
  testEnd(testName: string, result: 'PASS' | 'FAIL' | 'SKIP', duration?: number): void;
  commandExecution(command: string, description: string, startTime: number): void;
  commandResult(command: string, exitCode: number, duration: number, output?: string, error?: string): void;
  
  // Utility methods
  flush(): void;
  close(): void;
  getLogFilePath(): string;
  getLogDirectory(): string;
}
```

### **LogManager Class**

```typescript
class LogManager {
  constructor(config: LogManagerConfig);
  
  // Cleanup methods
  cleanupOldLogs(): void;
  archiveLogs(archiveName?: string): string | null;
  
  // Information methods
  getLogStats(): LogStats;
  listLogFiles(): LogFileInfo[];
  getLogContents(fileName: string, maxLines?: number): string[];
  searchLogs(pattern: string, maxResults?: number): SearchResult[];
}
```

### **LogViewer Class**

```typescript
class LogViewer {
  constructor();
  
  // Display methods
  showLogStats(): void;
  listLogFiles(): void;
  showLogContents(fileName: string, maxLines?: number): void;
  searchLogs(pattern: string, maxResults?: number): void;
  showTestSummary(): void;
  
  // Interactive mode
  interactive(): Promise<void>;
}
```

---

**Document Status**: Complete
**Last Updated**: August 21, 2025
**Next Review**: August 28, 2025
**Owner**: Development Team
**Priority**: High
**Dependencies**: Unified utilities implementation (completed)
