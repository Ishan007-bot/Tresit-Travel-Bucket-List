import { useState, useEffect, useCallback } from 'react';
import { useTravel } from '../contexts/TravelContext';
import * as dataService from '../services/dataService';
import useFetch from '../hooks/useFetch';
import DestinationCard from '../components/DestinationCard';
import FilterBar from '../components/FilterBar';
import LoadingState from '../components/LoadingState';
import ErrorHandler from '../components/ErrorHandler';
import Pagination from '../components/Pagination';

const HomePage = () => {
  const { savedDestinations } = useTravel();
  
  // State for countries and filtering
  const [filteredCountries, setFilteredCountries] = useState([]);
  const [activeFilters, setActiveFilters] = useState({
    search: '',
    region: '',
    sort: { criteria: 'name', order: 'asc' }
  });
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [countriesPerPage] = useState(12); // Show 12 countries per page
  const [displayedCountries, setDisplayedCountries] = useState([]);
  const [totalPages, setTotalPages] = useState(1);

  // Get all countries
  const { data: countries, loading, error, execute: fetchCountries } = useFetch(
    dataService.getAllCountries,
    [],
    true
  );

  // Update filtered countries when data or filters change
  useEffect(() => {
    if (!countries) return;
    
    let result = [...countries];
    
    // Filter by region if specified
    if (activeFilters.region) {
      const doFilter = async () => {
        try {
          const regionData = await dataService.getCountriesByRegion(activeFilters.region);
          applyFiltersAndSort(regionData);
        } catch (error) {
          console.error("Error filtering by region:", error);
          // Fallback to client-side filtering
          const filtered = countries.filter(
            country => country.region.toLowerCase() === activeFilters.region.toLowerCase()
          );
          applyFiltersAndSort(filtered);
        }
      };
      
      doFilter();
      return;
    }
    
    // Apply sorting
    applyFiltersAndSort(result);
  }, [countries, activeFilters.region, activeFilters.sort]);

  // Helper to apply sorting
  const applyFiltersAndSort = useCallback((data) => {
    if (!data) return;
    
    const { criteria, order } = activeFilters.sort;
    const sorted = dataService.sortCountries(data, criteria, order);
    setFilteredCountries(sorted);
    setCurrentPage(1); // Reset to first page when filters change
  }, [activeFilters.sort]);
  
  // Update pagination when filtered countries change
  useEffect(() => {
    if (!filteredCountries.length) {
      setDisplayedCountries([]);
      setTotalPages(1);
      return;
    }
    
    // Calculate total pages
    const calculatedTotalPages = Math.ceil(filteredCountries.length / countriesPerPage);
    setTotalPages(calculatedTotalPages);
    
    // Make sure current page is valid
    const validPage = Math.min(currentPage, calculatedTotalPages);
    if (validPage !== currentPage) {
      setCurrentPage(validPage);
    }
    
    // Get countries for current page
    const indexOfLastCountry = currentPage * countriesPerPage;
    const indexOfFirstCountry = indexOfLastCountry - countriesPerPage;
    const currentCountries = filteredCountries.slice(indexOfFirstCountry, indexOfLastCountry);
    
    setDisplayedCountries(currentCountries);
  }, [filteredCountries, currentPage, countriesPerPage]);

  // Handle search
  const handleSearch = async (searchTerm) => {
    setActiveFilters(prev => ({ ...prev, search: searchTerm }));
    
    try {
      if (!searchTerm.trim()) {
        // If search is cleared, reset to all countries
        applyFiltersAndSort(countries);
        return;
      }
      
      const results = await dataService.searchCountries(searchTerm);
      applyFiltersAndSort(results);
    } catch (error) {
      console.error("Error searching countries:", error);
    }
  };

  // Handle region filter
  const handleFilterRegion = (region) => {
    setActiveFilters(prev => ({ ...prev, region }));
  };

  // Handle sorting
  const handleSort = (criteria, order) => {
    setActiveFilters(prev => ({ 
      ...prev, 
      sort: { criteria, order }
    }));
  };
  
  // Handle page change
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  // Get saved status for each country
  const getSavedStatus = (cca3) => {
    const savedCountry = savedDestinations.find(dest => dest.cca3 === cca3);
    return savedCountry ? savedCountry.status : null;
  };

  // Retry loading countries
  const handleRetry = () => {
    fetchCountries();
  };

  if (loading) return <LoadingState message="Discovering countries..." />;

  if (error) return <ErrorHandler error={error} retry={handleRetry} />;

  return (
    <div className="container">
      <h1>Explore Destinations</h1>
      <p>Discover countries from around the world and add them to your travel bucket list.</p>
      
      <FilterBar 
        onSearch={handleSearch} 
        onFilterRegion={handleFilterRegion} 
        onSort={handleSort} 
      />
      
      {filteredCountries.length === 0 ? (
        <div className="no-results">
          <p>No countries found matching your search criteria.</p>
          <button className="btn" onClick={() => {
            setActiveFilters({
              search: '',
              region: '',
              sort: { criteria: 'name', order: 'asc' }
            });
            applyFiltersAndSort(countries);
          }}>
            Reset Filters
          </button>
        </div>
      ) : (
        <>
          <div className="grid">
            {displayedCountries.map((country) => (
              <DestinationCard 
                key={country.cca3} 
                country={country} 
                savedStatus={getSavedStatus(country.cca3)} 
              />
            ))}
          </div>
          
          <Pagination 
            currentPage={currentPage} 
            totalPages={totalPages} 
            onPageChange={handlePageChange} 
          />
          
          <div className="page-info">
            Showing {displayedCountries.length} of {filteredCountries.length} countries
            {filteredCountries.length > countriesPerPage && (
              <span> (Page {currentPage} of {totalPages})</span>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default HomePage; 