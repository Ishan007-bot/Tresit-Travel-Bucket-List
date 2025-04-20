import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTravel } from '../contexts/TravelContext';

const TravelLog = () => {
  const { savedDestinations, removeDestination, updateDestination } = useTravel();
  const [activeTab, setActiveTab] = useState('all');
  
  // Count wishlist and visited destinations
  const wishlistCount = savedDestinations.filter(dest => dest.status === 'wishlist').length;
  const visitedCount = savedDestinations.filter(dest => dest.status === 'visited').length;
  const planningCount = savedDestinations.filter(dest => dest.status === 'planning').length;
  const bookedCount = savedDestinations.filter(dest => dest.status === 'booked').length;
  
  // Filter destinations based on active tab
  const filteredDestinations = activeTab === 'all' 
    ? savedDestinations 
    : savedDestinations.filter(dest => dest.status === activeTab);
    
  // Change destination status
  const changeStatus = (destination, newStatus) => {
    const index = savedDestinations.findIndex(dest => dest.cca3 === destination.cca3);
    if (index !== -1) {
      updateDestination(index, { ...destination, status: newStatus });
    }
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
          className={`tab-button ${activeTab === 'planning' ? 'active' : ''}`}
          onClick={() => setActiveTab('planning')}
        >
          Planning
        </button>
        <button 
          className={`tab-button ${activeTab === 'booked' ? 'active' : ''}`}
          onClick={() => setActiveTab('booked')}
        >
          Booked
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
                    {dest.status === 'wishlist' ? 'Wishlist' : 
                     dest.status === 'planning' ? 'Planning' :
                     dest.status === 'booked' ? 'Booked' : 'Visited'}
                  </span>
                  <div className="status-change-buttons">
                    {dest.status !== 'wishlist' && (
                      <button 
                        className="btn-link"
                        onClick={() => changeStatus(dest, 'wishlist')}
                      >
                        Move to Wishlist
                      </button>
                    )}
                    {dest.status !== 'visited' && (
                      <button 
                        className="btn-link"
                        onClick={() => changeStatus(dest, 'visited')}
                      >
                        Mark as Visited
                      </button>
                    )}
                    <button 
                      className="btn-link remove"
                      onClick={() => removeDestination(dest.cca3)}
                    >
                      Remove
                    </button>
                  </div>
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