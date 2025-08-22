import React from 'react';
import { NextPageContext } from 'next';
import { Layout } from '../components/Layout';
import { getSafeErrorMessage, logError } from '../utils/errorUtils';

interface ErrorProps {
  statusCode?: number;
  hasGetInitialPropsRun?: boolean;
  err?: Error;
  errorCode?: string;
  errorId?: string;
}

const ErrorPage = ({ statusCode, errorCode, errorId, err }: ErrorProps) => {
  // Use error code system for consistent messaging
  const safeError = err ? getSafeErrorMessage(err) : null;
  
  const getErrorMessage = () => {
    if (safeError) {
      return {
        title: getErrorTitle(safeError.errorCode),
        message: safeError.userMessage,
        errorCode: safeError.errorCode,
        errorId: safeError.errorId
      };
    }
    
    // Fallback for status codes without error objects
    if (statusCode === 404) {
      return {
        title: 'Page Not Found',
        message: 'The page you\'re looking for doesn\'t exist.',
        errorCode: 'ERROR_404',
        errorId: errorId || 'N/A'
      };
    }
    
    return {
      title: 'Service Temporarily Unavailable',
      message: 'We\'re experiencing technical difficulties. Please try again in a few moments.',
      errorCode: errorCode || 'ERROR_200',
      errorId: errorId || 'N/A'
    };
  };

  const getErrorTitle = (code: string): string => {
    if (code.startsWith('ERROR_4')) return 'Page Not Found';
    if (code.startsWith('ERROR_5')) return 'Service Temporarily Unavailable';
    return 'Something Went Wrong';
  };

  const { title, message, errorCode: displayErrorCode, errorId: displayErrorId } = getErrorMessage();

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full text-center">
          {/* Error Icon */}
          <div className="mb-8">
            <div className="mx-auto w-24 h-24 bg-red-100 rounded-full flex items-center justify-center">
              <span className="text-4xl font-bold text-red-600">{statusCode || '?'}</span>
            </div>
          </div>

          {/* Error Message */}
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            {title}
          </h1>
          <p className="text-lg text-gray-600 mb-6">
            {message}
          </p>
          
          {/* Error Code for Support */}
          <div className="bg-gray-100 rounded-lg p-3 mb-8">
            <p className="text-sm text-gray-600">
              <span className="font-medium">Error Reference:</span> {displayErrorCode}
            </p>
            <p className="text-xs text-gray-500 mt-1">
              Include this reference when contacting support
            </p>
          </div>

          {/* Action Buttons */}
          <div className="space-y-4">
            <button 
              onClick={() => window.location.reload()}
              className="w-full bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
            >
              Try Again
            </button>
            
            <a 
              href="/"
              className="block w-full bg-gray-100 text-gray-700 px-6 py-3 rounded-lg font-semibold hover:bg-gray-200 transition-colors"
            >
              Go Home
            </a>
          </div>

          {/* Help Text - No technical details */}
          <div className="mt-8 text-sm text-gray-500">
            <p>If this problem persists, please contact support.</p>
          </div>
        </div>
      </div>
    </Layout>
  );
};

// Use modern Next.js error handling
ErrorPage.getInitialProps = ({ res, err }: NextPageContext) => {
  const statusCode = res ? res.statusCode : err ? err.statusCode : 404;
  
  // Generate error code and ID for tracking
  let errorCode = 'ERROR_200';
  let errorId = 'N/A';
  
  if (err) {
    const safeError = getSafeErrorMessage(err);
    errorCode = safeError.errorCode;
    errorId = safeError.errorId;
    
    // Log with error code for internal tracking
    logError(err, 'ErrorPage');
  }
  
  return { statusCode, errorCode, errorId, err };
};

export default ErrorPage;
