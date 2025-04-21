import React from 'react';
import { Link } from 'react-router-dom';
import { FaExclamationTriangle } from 'react-icons/fa';

/**
 * 404 Not Found page component
 * Displays when users navigate to a non-existent route
 */
const NotFound = () => {
  return (
    <div className="container">
      <div className="error-container">
        <FaExclamationTriangle className="error-icon" />
        <h1>404 - Page Not Found</h1>
        <p className="error-message">
          The page you are looking for doesn't exist or has been moved.
        </p>
        <div>
          <Link to="/" className="btn retry-button">
            Return to Home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFound; 