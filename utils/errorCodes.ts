// Opaque Error Code System for AVTran
// Provides internal tracking while keeping user messages clean

export interface ErrorCode {
  code: string;
  category: 'SYSTEM' | 'DATA' | 'NETWORK' | 'USER' | 'BUILD' | 'AUTH';
  userMessage: string;
  internalMessage: string;
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  shouldReport: boolean;
}

export const ERROR_CODES: Record<string, ErrorCode> = {
  // System Errors (200-299) - General system issues
  'ERROR_200': {
    code: 'ERROR_200',
    category: 'SYSTEM',
    userMessage: 'Service temporarily unavailable. Please try again in a few moments.',
    internalMessage: 'General system error',
    severity: 'HIGH',
    shouldReport: true
  },
  'ERROR_201': {
    code: 'ERROR_201',
    category: 'SYSTEM',
    userMessage: 'We\'re experiencing technical difficulties. Please refresh the page.',
    internalMessage: 'React component error boundary triggered',
    severity: 'HIGH',
    shouldReport: true
  },
  'ERROR_202': {
    code: 'ERROR_202',
    category: 'SYSTEM',
    userMessage: 'Service temporarily unavailable. Please try again in a few moments.',
    internalMessage: 'Next.js server error',
    severity: 'HIGH',
    shouldReport: true
  },
  'ERROR_203': {
    code: 'ERROR_203',
    category: 'SYSTEM',
    userMessage: 'We\'re experiencing technical difficulties. Please try again in a few moments.',
    internalMessage: 'Webpack compilation error',
    severity: 'HIGH',
    shouldReport: false // Development only
  },

  // Data Errors (300-399) - LOW PRIORITY
  'ERROR_300': {
    code: 'ERROR_300',
    category: 'DATA',
    userMessage: 'Unable to load vendor information. Please refresh the page.',
    internalMessage: 'Vendor data loading failed',
    severity: 'LOW',
    shouldReport: false
  },
  'ERROR_301': {
    code: 'ERROR_301',
    category: 'DATA',
    userMessage: 'Search results unavailable. Please try again.',
    internalMessage: 'Search data processing error',
    severity: 'LOW',
    shouldReport: false
  },
  'ERROR_302': {
    code: 'ERROR_302',
    category: 'DATA',
    userMessage: 'Comparison feature temporarily unavailable.',
    internalMessage: 'Vendor comparison data error',
    severity: 'LOW',
    shouldReport: false
  },
  'ERROR_303': {
    code: 'ERROR_303',
    category: 'DATA',
    userMessage: 'Service information unavailable. Please try again later.',
    internalMessage: 'Data validation failed',
    severity: 'LOW',
    shouldReport: false
  },

  // Network/User Errors (400-499) - MEDIUM PRIORITY
  'ERROR_400': {
    code: 'ERROR_400',
    category: 'NETWORK',
    userMessage: 'Connection problem. Please check your internet and try again.',
    internalMessage: 'Network request failed',
    severity: 'MEDIUM',
    shouldReport: true
  },
  'ERROR_401': {
    code: 'ERROR_401',
    category: 'NETWORK',
    userMessage: 'Request timeout. Please try again.',
    internalMessage: 'Request timeout error',
    severity: 'MEDIUM',
    shouldReport: true
  },
  'ERROR_404': {
    code: 'ERROR_404',
    category: 'USER',
    userMessage: 'Page not found. The page you\'re looking for doesn\'t exist.',
    internalMessage: 'Route not found',
    severity: 'MEDIUM',
    shouldReport: false
  },
  'ERROR_405': {
    code: 'ERROR_405',
    category: 'NETWORK',
    userMessage: 'Service temporarily unavailable. Please try again.',
    internalMessage: 'API rate limit exceeded',
    severity: 'MEDIUM',
    shouldReport: true
  },

  // Build System Errors (500-599) - HIGH PRIORITY
  'ERROR_500': {
    code: 'ERROR_500',
    category: 'BUILD',
    userMessage: 'Service temporarily unavailable. Please try again later.',
    internalMessage: 'Build system error',
    severity: 'HIGH',
    shouldReport: true
  },
  'ERROR_501': {
    code: 'ERROR_501',
    category: 'BUILD',
    userMessage: 'Service temporarily unavailable. Please try again later.',
    internalMessage: 'CSV processing error',
    severity: 'HIGH',
    shouldReport: true
  },
  'ERROR_502': {
    code: 'ERROR_502',
    category: 'BUILD',
    userMessage: 'Service temporarily unavailable. Please try again later.',
    internalMessage: 'Data compilation error',
    severity: 'HIGH',
    shouldReport: true
  },
  'ERROR_503': {
    code: 'ERROR_503',
    category: 'BUILD',
    userMessage: 'Service temporarily unavailable. Please try again later.',
    internalMessage: 'Database connection failed',
    severity: 'HIGH',
    shouldReport: true
  },

  // Critical System Errors (600-699) - CRITICAL PRIORITY
  'ERROR_600': {
    code: 'ERROR_600',
    category: 'SYSTEM',
    userMessage: 'Service unavailable. Please try again later or contact support.',
    internalMessage: 'Critical system failure',
    severity: 'CRITICAL',
    shouldReport: true
  },
  'ERROR_601': {
    code: 'ERROR_601',
    category: 'SYSTEM',
    userMessage: 'Service unavailable. Please try again later or contact support.',
    internalMessage: 'Application crash',
    severity: 'CRITICAL',
    shouldReport: true
  },
  'ERROR_602': {
    code: 'ERROR_602',
    category: 'SYSTEM',
    userMessage: 'Service unavailable. Please try again later or contact support.',
    internalMessage: 'Memory exhaustion',
    severity: 'CRITICAL',
    shouldReport: true
  },
  'ERROR_603': {
    code: 'ERROR_603',
    category: 'SYSTEM',
    userMessage: 'Service unavailable. Please try again later or contact support.',
    internalMessage: 'Process termination',
    severity: 'CRITICAL',
    shouldReport: true
  }
};

// Get error information by code
export const getErrorInfo = (errorCode: string): ErrorCode => {
  return ERROR_CODES[errorCode] || ERROR_CODES['ERROR_200'];
};

// Generate unique error ID for tracking
export const generateErrorId = (): string => {
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).substr(2, 5);
  return `${timestamp}-${random}`.toUpperCase();
};

// Map common errors to error codes based on new priority system
export const mapErrorToCode = (error: any): string => {
  // Critical System Errors (600-699) - CRITICAL PRIORITY
  if (error?.message?.includes('FATAL') || error?.message?.includes('CRASH')) {
    return 'ERROR_600';
  }
  
  if (error?.message?.includes('memory') || error?.message?.includes('Memory')) {
    return 'ERROR_602';
  }
  
  if (error?.message?.includes('process') || error?.message?.includes('termination')) {
    return 'ERROR_603';
  }

  // Build System Errors (500-599) - HIGH PRIORITY
  if (error?.message?.includes('build') || error?.message?.includes('compile')) {
    return 'ERROR_500';
  }
  
  if (error?.message?.includes('CSV') || error?.message?.includes('csv')) {
    return 'ERROR_501';
  }
  
  if (error?.message?.includes('database') || error?.message?.includes('db')) {
    return 'ERROR_503';
  }

  // Network/User Errors (400-499) - MEDIUM PRIORITY
  if (error?.code === 'ECONNREFUSED' || error?.code === 'ETIMEDOUT') {
    return 'ERROR_400';
  }
  
  if (error?.code === 'ENOENT') {
    return 'ERROR_404';
  }
  
  if (error?.status === 429 || error?.message?.includes('rate limit')) {
    return 'ERROR_405';
  }

  // Data Errors (300-399) - LOW PRIORITY
  if (error?.message?.includes('vendor') || error?.message?.includes('data')) {
    return 'ERROR_300';
  }
  
  if (error?.message?.includes('search') || error?.message?.includes('filter')) {
    return 'ERROR_301';
  }
  
  if (error?.message?.includes('comparison') || error?.message?.includes('compare')) {
    return 'ERROR_302';
  }

  // System Errors (200-299) - General system issues
  if (error?.message?.includes('ENOENT') && error?.message?.includes('_document.js')) {
    return 'ERROR_202';
  }
  
  if (error?.message?.includes('webpack') || error?.message?.includes('Compilation')) {
    return 'ERROR_203';
  }

  // Default system error
  return 'ERROR_200';
};
