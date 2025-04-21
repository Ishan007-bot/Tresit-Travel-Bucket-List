import { Link } from 'react-router-dom';
import { useState, memo } from 'react';
import PropTypes from 'prop-types';
import LazyImage from './LazyImage';

const DestinationCard = ({ country, savedStatus }) => {
  const { name, flags, population, region, capital, cca3 } = country;
  const [isHovered, setIsHovered] = useState(false);
  
  // Format population with commas
  const formattedPopulation = population.toLocaleString();
  
  return (
    <div 
      className="card destination-card animate-fadeInUp"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="img-container">
        <LazyImage 
          src={flags.png} 
          alt={`Flag of ${name.common}`} 
          className={isHovered ? 'animate-pulse duration-1000' : ''}
        />
      </div>
      <div className="destination-content">
        <h2 className="destination-title">{name.common}</h2>
        <div className="destination-details">
          <p className="animate-fadeInRight delay-100"><strong>Population:</strong> {formattedPopulation}</p>
          <p className="animate-fadeInRight delay-200"><strong>Region:</strong> {region}</p>
          <p className="animate-fadeInRight delay-300"><strong>Capital:</strong> {capital && capital[0]}</p>
        </div>
        <div className="destination-footer">
          {savedStatus && (
            <span className={`status-badge badge-${savedStatus} animate-scaleIn`}>
              {savedStatus === 'wishlist' ? 'Wishlist' : 
              savedStatus === 'planning' ? 'Planning' :
              savedStatus === 'booked' ? 'Booked' : 'Visited'}
            </span>
          )}
          <Link to={`/country/${cca3}`} className={`btn ${isHovered ? 'animate-float' : ''}`}>
            View Details
          </Link>
        </div>
      </div>
    </div>
  );
};

DestinationCard.propTypes = {
  country: PropTypes.shape({
    name: PropTypes.shape({
      common: PropTypes.string.isRequired
    }).isRequired,
    flags: PropTypes.shape({
      png: PropTypes.string.isRequired
    }).isRequired,
    population: PropTypes.number.isRequired,
    region: PropTypes.string.isRequired,
    capital: PropTypes.arrayOf(PropTypes.string),
    cca3: PropTypes.string.isRequired
  }).isRequired,
  savedStatus: PropTypes.string
};

// Use memo to prevent unnecessary re-renders
export default memo(DestinationCard); 