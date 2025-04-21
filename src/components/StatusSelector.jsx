import React from 'react';
import PropTypes from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircle, faClock, faCheck, faTimes, faTriangleExclamation } from '@fortawesome/free-solid-svg-icons';
import '../styles/StatusSelector.css';

const StatusSelector = ({ status, onStatusChange }) => {
  const statuses = [
    { value: 'wishlist', label: 'Wishlist', icon: '✨' },
    { value: 'planning', label: 'Planning', icon: '📝' },
    { value: 'booked', label: 'Booked', icon: '🎫' },
    { value: 'visited', label: 'Visited', icon: '✅' }
  ];

  return (
    <div className="status-selector">
      <h3>Travel Status</h3>
      <div className="status-options">
        {statuses.map((option) => (
          <button
            key={option.value}
            className={`status-option ${status === option.value ? 'active' : ''}`}
            onClick={() => onStatusChange(option.value)}
            aria-pressed={status === option.value}
          >
            <span className="status-icon">{option.icon}</span>
            <span className="status-label">{option.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

StatusSelector.propTypes = {
  status: PropTypes.string,
  onStatusChange: PropTypes.func.isRequired
};

export default StatusSelector; 