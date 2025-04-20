import { useState, useEffect } from 'react';
import { useTravel } from '../contexts/TravelContext';
import { getAllCountries, getCountriesByRegion, searchCountries, sortCountries } from '../services/api';
import DestinationCard from '../components/DestinationCard';
import FilterBar from '../components/FilterBar';
import Loading from '../components/Loading';

const HomePage = () => {
  const { savedDestinations } = useTravel();
  const [countries, setCountries] = useState([]);
  const [filteredCountries, setFilteredCountries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch all countries when component mounts
  useEffect(() => {
    const fetchCountries = async () => {
      try {
        setLoading(true);
        const data = await getAllCountries();
        setCountries(data);
        setFilteredCountries(data);
        setLoading(false);
      } catch (error) {
        setError('Failed to load countries. Please try again later.');
        setLoading(false);
      }
    };

    fetchCountries();
  }, []);

  // Get saved status for each country
  const getSavedStatus = (cca3) => {
    const savedCountry = savedDestinations.find(dest => dest.cca3 === cca3);
    return savedCountry ? savedCountry.status : null;
  };

  // Handle search
  const handleSearch = async (searchTerm) => {
    try {
      setLoading(true);
      const searchResults = await searchCountries(searchTerm);
      setFilteredCountries(searchResults);
      setLoading(false);
    } catch (error) {
      setError('Error searching countries. Please try again.');
      setLoading(false);
    }
  };

  // Handle region filter
  const handleFilterRegion = async (region) => {
    try {
      setLoading(true);
      if (region) {
        const regionResults = await getCountriesByRegion(region);
        setFilteredCountries(regionResults);
      } else {
        setFilteredCountries(countries);
      }
      setLoading(false);
    } catch (error) {
      setError(`Error filtering by region: ${region}. Please try again.`);
      setLoading(false);
    }
  };

  // Handle sorting
  const handleSort = (criteria, order) => {
    const sortedCountries = sortCountries(filteredCountries, criteria, order);
    setFilteredCountries(sortedCountries);
  };

  if (loading) return <Loading />;

  if (error) return <div className="error-message">{error}</div>;

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
        </div>
      ) : (
        <div className="grid">
          {filteredCountries.map((country) => (
            <DestinationCard 
              key={country.cca3} 
              country={country} 
              savedStatus={getSavedStatus(country.cca3)} 
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default HomePage; 