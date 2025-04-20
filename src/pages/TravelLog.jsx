import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTravel } from '../contexts/TravelContext';

const TravelLog = () => {
  const { savedDestinations, setSavedDestinations } = useTravel();
  const [activeTab, setActiveTab] = useState('all');
  
  // Count wishlist and visited destinations
  const wishlistCount = savedDestinations.filter(dest => dest.status === 'wishlist').length;
  const visitedCount = savedDestinations.filter(dest => dest.status === 'visited').length;
  
  // Filter destinations based on active tab
  const filteredDestinations = activeTab === 'all' 
    ? savedDestinations 
    : savedDestinations.filter(dest => dest.status === activeTab);
    
  // Remove a destination
  const removeDestination = (cca3) => {
    setSavedDestinations(prev => prev.filter(dest => dest.cca3 !== cca3));
  };
  
  // Change destination status (toggle between wishlist and visited)
  const toggleStatus = (cca3) => {
    setSavedDestinations(prev => 
      prev.map(dest => {
        if (dest.cca3 === cca3) {
          return {
            ...dest,
            status: dest.status === 'wishlist' ? 'visited' : 'wishlist'
          };
        }
        return dest;
      })
    );
  };
  
  return (
    <div className="container">
      <h1>My Travel Log</h1>
      
      <div className="travel-stats">
        <div className="stat-box">
          <h3>Total Countries</h3>
          <p className="stat-number">{savedDestinations.length}</p>
        </div>
        <div className="stat-box">
          <h3>Wishlist</h3>
          <p className="stat-number">{wishlistCount}</p>
        </div>
        <div className="stat-box">
          <h3>Visited</h3>
          <p className="stat-number">{visitedCount}</p>
        </div>
      </div>
      
      <div className="travel-log-tabs">
        <button 
          className={`tab-button ${activeTab === 'all' ? 'active' : ''}`}
          onClick={() => setActiveTab('all')}
        >
          All Countries
        </button>
        <button 
          className={`tab-button ${activeTab === 'wishlist' ? 'active' : ''}`}
          onClick={() => setActiveTab('wishlist')}
        >
          Wishlist
        </button>
        <button 
          className={`tab-button ${activeTab === 'visited' ? 'active' : ''}`}
          onClick={() => setActiveTab('visited')}
        >
          Visited
        </button>
      </div>
      
      {filteredDestinations.length === 0 ? (
        <div className="no-results">
          <p>No countries in your {activeTab === 'all' ? 'travel log' : activeTab} yet.</p>
          <Link to="/" className="btn">Explore Countries</Link>
        </div>
      ) : (
        <div className="saved-countries-grid">
          {filteredDestinations.map(dest => (
            <div key={dest.cca3} className="saved-country-card card">
              <img 
                src={dest.flag} 
                alt={`Flag of ${dest.name}`} 
                className="saved-country-img" 
              />
              <div className="saved-country-content">
                <h3>{dest.name}</h3>
                <div className="saved-country-actions">
                  <span 
                    className={`status-badge badge-${dest.status}`}
                  >
                    {dest.status === 'wishlist' ? 'Wishlist' : 'Visited'}
                  </span>
                  <button 
                    className="btn-link"
                    onClick={() => toggleStatus(dest.cca3)}
                  >
                    {dest.status === 'wishlist' ? 'Mark as Visited' : 'Move to Wishlist'}
                  </button>
                  <button 
                    className="btn-link remove"
                    onClick={() => removeDestination(dest.cca3)}
                  >
                    Remove
                  </button>
                </div>
                <Link to={`/country/${dest.cca3}`} className="btn">
                  View Details
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TravelLog; 