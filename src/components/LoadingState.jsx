import React from 'react';

const LoadingState = ({ message = 'Loading...' }) => {
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

export default LoadingState; 