import React from 'react';

/**
 * Loading spinner component that shows during data fetching operations
 */
const Loading = ({ message = 'Loading...' }) => {
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

export default Loading; 