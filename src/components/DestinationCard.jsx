import { Link } from 'react-router-dom';

const DestinationCard = ({ country, savedStatus }) => {
  const { name, flags, population, region, capital, cca3 } = country;
  
  // Format population with commas
  const formattedPopulation = population.toLocaleString();
  
  return (
    <div className="card destination-card">
      <img 
        src={flags.png} 
        alt={`Flag of ${name.common}`} 
        className="destination-img"
      />
      <div className="destination-content">
        <h2 className="destination-title">{name.common}</h2>
        <div className="destination-details">
          <p><strong>Population:</strong> {formattedPopulation}</p>
          <p><strong>Region:</strong> {region}</p>
          <p><strong>Capital:</strong> {capital && capital[0]}</p>
        </div>
        <div className="destination-footer">
          {savedStatus && (
            <span className={`status-badge badge-${savedStatus}`}>
              {savedStatus === 'wishlist' ? 'Wishlist' : 'Visited'}
            </span>
          )}
          <Link to={`/country/${cca3}`} className="btn">
            View Details
          </Link>
        </div>
      </div>
    </div>
  );
};

export default DestinationCard; 