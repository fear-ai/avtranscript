// Safe error handling utilities
import { getErrorInfo, mapErrorToCode, generateErrorId, type ErrorCode } from './errorCodes';

export interface SafeError {
  message: string;
  statusCode: number;
  userMessage: string;
  errorCode: string;
  errorId: string;
  shouldReport: boolean;
}

// Convert internal errors to user-friendly messages with error codes
export const getSafeErrorMessage = (error: any): SafeError => {
  const errorCode = mapErrorToCode(error);
  const errorInfo = getErrorInfo(errorCode);
  const errorId = generateErrorId();
  
  // Map error severity to HTTP status codes based on new priority system
  const getStatusCode = (severity: string): number => {
    switch (severity) {
      case 'CRITICAL': return 503; // 6xx errors
      case 'HIGH': return 500;     // 5xx errors  
      case 'MEDIUM': return 400;   // 4xx errors
      case 'LOW': return 200;      // 3xx errors (non-critical)
      default: return 500;
    }
  };

  return {
    message: errorInfo.internalMessage,
    statusCode: getStatusCode(errorInfo.severity),
    userMessage: errorInfo.userMessage,
    errorCode: errorInfo.code,
    errorId,
    shouldReport: errorInfo.shouldReport
  };
};

// Log errors safely with error codes
export const logError = (error: any, context?: string) => {
  const safeError = getSafeErrorMessage(error);
  
  if (process.env.NODE_ENV === 'development') {
    console.error(`[${context || 'Error'}] ${safeError.errorCode} (${safeError.errorId}):`, {
      userMessage: safeError.userMessage,
      internalMessage: safeError.message,
      originalError: error
    });
  }
  
  // In production, only log if it should be reported
  if (process.env.NODE_ENV === 'production' && safeError.shouldReport) {
    // Log for internal tracking (could be sent to error reporting service)
    console.error(`${safeError.errorCode} (${safeError.errorId}): ${safeError.message}`);
    
    // Example: Send to error reporting service
    // errorReportingService.captureException(error, { 
    //   tags: { 
    //     context, 
    //     errorCode: safeError.errorCode, 
    //     errorId: safeError.errorId 
    //   } 
    // });
  }
};

// Async error wrapper to catch and handle errors gracefully
export const safeAsyncWrapper = async <T>(
  asyncFn: () => Promise<T>,
  fallbackValue: T,
  context?: string
): Promise<T> => {
  try {
    return await asyncFn();
  } catch (error) {
    logError(error, context);
    return fallbackValue;
  }
};

// Note: React component error handling should be implemented in component files
// This utility file is for non-React error handling only
