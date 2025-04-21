import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTravel } from '../contexts/TravelContext';
import Pagination from '../components/Pagination';
import TravelDashboard from '../components/TravelDashboard';

const TravelLog = () => {
  const { savedDestinations, removeDestination, updateDestination } = useTravel();
  const [activeTab, setActiveTab] = useState('all');
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [destinationsPerPage] = useState(8); // Show 8 destinations per page
  const [displayedDestinations, setDisplayedDestinations] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  
  // Count wishlist and visited destinations
  const wishlistCount = savedDestinations.filter(dest => dest.status === 'wishlist').length;
  const visitedCount = savedDestinations.filter(dest => dest.status === 'visited').length;
  const planningCount = savedDestinations.filter(dest => dest.status === 'planning').length;
  const bookedCount = savedDestinations.filter(dest => dest.status === 'booked').length;
  
  // Filter destinations based on active tab
  const filteredDestinations = activeTab === 'all' 
    ? savedDestinations 
    : savedDestinations.filter(dest => dest.status === activeTab);
  
  // Update pagination when filtered destinations change
  useEffect(() => {
    if (!filteredDestinations.length) {
      setDisplayedDestinations([]);
      setTotalPages(1);
      return;
    }
    
    // Calculate total pages
    const calculatedTotalPages = Math.ceil(filteredDestinations.length / destinationsPerPage);
    setTotalPages(calculatedTotalPages);
    
    // Make sure current page is valid
    const validPage = Math.min(currentPage, calculatedTotalPages);
    if (validPage !== currentPage) {
      setCurrentPage(validPage);
    }
    
    // Get destinations for current page
    const indexOfLastDestination = currentPage * destinationsPerPage;
    const indexOfFirstDestination = indexOfLastDestination - destinationsPerPage;
    const currentDestinations = filteredDestinations.slice(indexOfFirstDestination, indexOfLastDestination);
    
    setDisplayedDestinations(currentDestinations);
  }, [filteredDestinations, currentPage, destinationsPerPage]);
    
  // Change destination status
  const changeStatus = (destination, newStatus) => {
    const index = savedDestinations.findIndex(dest => dest.cca3 === destination.cca3);
    if (index !== -1) {
      updateDestination(index, { ...destination, status: newStatus });
    }
  };
  
  // Handle tab change
  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setCurrentPage(1); // Reset to first page when tab changes
  };
  
  // Handle page change
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };
  
  return (
    <div className="container">
      <h1>My Travel Log</h1>
      
      {savedDestinations.length > 0 && <TravelDashboard />}
      
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
          onClick={() => handleTabChange('all')}
        >
          All Countries
        </button>
        <button 
          className={`tab-button ${activeTab === 'wishlist' ? 'active' : ''}`}
          onClick={() => handleTabChange('wishlist')}
        >
          Wishlist
        </button>
        <button 
          className={`tab-button ${activeTab === 'planning' ? 'active' : ''}`}
          onClick={() => handleTabChange('planning')}
        >
          Planning
        </button>
        <button 
          className={`tab-button ${activeTab === 'booked' ? 'active' : ''}`}
          onClick={() => handleTabChange('booked')}
        >
          Booked
        </button>
        <button 
          className={`tab-button ${activeTab === 'visited' ? 'active' : ''}`}
          onClick={() => handleTabChange('visited')}
        >
          Visited
        </button>
      </div>
      
      {filteredDestinations.length === 0 ? (
        <div className="no-results animate-fadeIn">
          <p>No countries in your {activeTab === 'all' ? 'travel log' : activeTab} yet.</p>
          <Link to="/" className="btn animate-pulse">Explore Countries</Link>
        </div>
      ) : (
        <>
          <div className="saved-countries-grid stagger-list">
            {displayedDestinations.map(dest => (
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
          
          <Pagination 
            currentPage={currentPage} 
            totalPages={totalPages} 
            onPageChange={handlePageChange} 
          />
          
          <div className="page-info animate-fadeInUp">
            Showing {displayedDestinations.length} of {filteredDestinations.length} destinations
            {filteredDestinations.length > destinationsPerPage && (
              <span> (Page {currentPage} of {totalPages})</span>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default TravelLog; 