import React from 'react';

const ErrorHandler = ({ error, retry = null }) => {
  // Determine error message based on the error type
  const getErrorMessage = () => {
    if (typeof error === 'string') {
      return error;
    }
    
    if (error?.response) {
      // Handle API error with response
      const status = error.response.status;
      
      switch (status) {
        case 404:
          return 'The requested resource was not found. Please check your input and try again.';
        case 429:
          return 'Too many requests. Please wait a moment and try again.';
        case 500:
          return 'Server error. Please try again later.';
        default:
          return `An error occurred (${status}). Please try again.`;
      }
    }
    
    if (error?.request) {
      // Network error
      return 'Unable to connect to the server. Please check your internet connection.';
    }
    
    // Fallback message
    return 'Something went wrong. Please try again later.';
  };

  return (
    <div className="error-container">
      <div className="error-icon">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="icon">
          <path fillRule="evenodd" d="M9.401 3.003c1.155-2 4.043-2 5.197 0l7.355 12.748c1.154 2-.29 4.5-2.599 4.5H4.645c-2.309 0-3.752-2.5-2.598-4.5L9.4 3.003zM12 8.25a.75.75 0 01.75.75v3.75a.75.75 0 01-1.5 0V9a.75.75 0 01.75-.75zm0 8.25a.75.75 0 100-1.5.75.75 0 000 1.5z" clipRule="evenodd" />
        </svg>
      </div>
      <div className="error-message">{getErrorMessage()}</div>
      {retry && (
        <button onClick={retry} className="btn retry-button">
          Try Again
        </button>
      )}
    </div>
  );
};

export default ErrorHandler; 