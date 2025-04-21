import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTravel } from '../contexts/TravelContext';
import { getAllCountries } from '../services/dataService';
import Pagination from '../components/Pagination';
import Loading from '../components/Loading';
import '../styles/Explore.css';

const Explore = () => {
  const { savedDestinations } = useTravel();
  const [countries, setCountries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [countriesPerPage] = useState(9); // Show 9 countries per page
  const [totalPages, setTotalPages] = useState(1);
  
  // Fetch countries
  useEffect(() => {
    const fetchCountries = async () => {
      try {
        setLoading(true);
        console.log('Explore page: Starting to fetch countries...');
        
        const data = await getAllCountries();
        console.log('Explore page: Countries data received:', data ? `${data.length} countries` : 'No data');
        
        // Check if data is available
        if (!data) {
          console.error('Explore page: Data is null or undefined');
          setError('No countries data available. Please try again later.');
          setLoading(false);
          return;
        }
        
        if (data.length === 0) {
          console.error('Explore page: Data is empty array');
          setError('No countries data available. Please try again later.');
          setLoading(false);
          return;
        }
        
        // Sort alphabetically
        console.log('Explore page: Sorting countries alphabetically');
        const sortedCountries = data.sort((a, b) => {
          const nameA = a.name?.common || (typeof a.name === 'string' ? a.name : '');
          const nameB = b.name?.common || (typeof b.name === 'string' ? b.name : '');
          return nameA.localeCompare(nameB);
        });
        
        console.log('Explore page: Setting countries in state');
        setCountries(sortedCountries);
        
        // Calculate total pages
        const pages = Math.ceil(sortedCountries.length / countriesPerPage);
        console.log(`Explore page: Setting total pages to ${pages}`);
        setTotalPages(pages);
        
        setLoading(false);
      } catch (err) {
        console.error('Explore page: Error fetching countries:', err);
        setError(`Failed to load countries. Error: ${err.message}`);
        setLoading(false);
      }
    };
    
    fetchCountries();
  }, [countriesPerPage]);

  // Handle page change
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    // Scroll to top for better UX
    window.scrollTo(0, 0);
  };
  
  // Get current countries for current page
  const getCurrentCountries = () => {
    const indexOfLastCountry = currentPage * countriesPerPage;
    const indexOfFirstCountry = indexOfLastCountry - countriesPerPage;
    return countries.slice(indexOfFirstCountry, indexOfLastCountry);
  };
  
  // Get saved status for a country
  const getSavedStatus = (countryCode) => {
    const saved = savedDestinations.find(dest => 
      dest.cca3 === countryCode || dest.alpha3Code === countryCode
    );
    return saved ? saved.status : null;
  };
  
  // Get status badge class
  const getStatusBadgeClass = (status) => {
    switch(status) {
      case 'wishlist': return 'badge-wishlist';
      case 'visited': return 'badge-visited';
      case 'planning': return 'badge-planning';
      case 'booked': return 'badge-booked';
      default: return '';
    }
  };
  
  // Get status label
  const getStatusLabel = (status) => {
    switch(status) {
      case 'wishlist': return 'Wishlist';
      case 'visited': return 'Visited';
      case 'planning': return 'Planning';
      case 'booked': return 'Booked';
      default: return '';
    }
  };
  
  if (loading) return <Loading message="Loading countries..." />;
  
  if (error) return <div className="error-message">{error}</div>;
  
  const currentCountries = getCurrentCountries();

  return (
    <div className="container">
      <div className="explore-header">
        <h1>Explore Countries</h1>
        <p>Discover countries from around the world and add them to your travel bucket list.</p>
      </div>
      
      <div className="countries-grid">
        {currentCountries.map((country) => {
          const countryId = country.cca3 || country.alpha3Code;
          const countryName = country.name.common || 
                             (typeof country.name === 'string' ? country.name : 'Unknown');
          const flagUrl = country.flags?.png || 
                         country.flags?.svg || 
                         country.flag || 
                         `https://flagcdn.com/w320/${countryId.toLowerCase()}.png`;
          const capital = country.capital ? 
                          (Array.isArray(country.capital) ? country.capital[0] : country.capital) : 
                          'Unknown';
          const region = country.region || 'Unknown';
          const savedStatus = getSavedStatus(countryId);
                          
          return (
            <div key={countryId} className="country-card card">
              <div className="img-container">
                <img 
                  src={flagUrl} 
                  alt={`Flag of ${countryName}`} 
                  className="country-img" 
                />
              </div>
              <div className="country-content">
                <h2 className="country-title">{countryName}</h2>
                <div className="country-details">
                  <p><strong>Capital:</strong> {capital}</p>
                  <p><strong>Region:</strong> {region}</p>
                  {country.population && (
                    <p><strong>Population:</strong> {country.population.toLocaleString()}</p>
                  )}
                </div>
                <div className="country-footer">
                  {savedStatus && (
                    <span className={`status-badge ${getStatusBadgeClass(savedStatus)}`}>
                      {getStatusLabel(savedStatus)}
                    </span>
                  )}
                  <Link 
                    to={`/destination/${countryId}`} 
                    className="btn view-btn"
                  >
                    View Details
                  </Link>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      
      <div className="pagination-container">
        <Pagination 
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
        
        <div className="page-info">
          Showing {currentCountries.length} of {countries.length} countries
          (Page {currentPage} of {totalPages})
        </div>
      </div>
    </div>
  );
};

export default Explore; 