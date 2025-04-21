import React from 'react';

/**
 * A loading spinner component that displays an animated globe
 * Used during suspense fallback and loading states
 */
const LoadingSpinner = ({ message = 'Loading...' }) => {
  return (
    <div className="loading-container">
      <div className="loading-animation">
        <div className="spinner-container">
          <div className="spinner"></div>
        </div>
        <div className="globe-container">
          <div className="globe"></div>
        </div>
      </div>
      <p className="loading-message">{message}</p>
    </div>
  );
};

export default LoadingSpinner; 