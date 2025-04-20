import { useState, useEffect } from 'react';
import { getAllCountries } from '../services/api';
import DestinationCard from '../components/DestinationCard';
import Loading from '../components/Loading';

const HomePage = () => {
  const [countries, setCountries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const data = await getAllCountries();
        setCountries(data);
        setLoading(false);
      } catch (error) {
        setError('Failed to load countries. Please try again later.');
        setLoading(false);
      }
    };

    fetchCountries();
  }, []);

  if (loading) return <Loading />;

  if (error) return <div className="error-message">{error}</div>;

  return (
    <div className="container">
      <h1>Explore Destinations</h1>
      <p>Discover countries from around the world and add them to your travel bucket list.</p>
      
      <div className="grid">
        {countries.map((country) => (
          <DestinationCard key={country.cca3} country={country} />
        ))}
      </div>
    </div>
  );
};

export default HomePage; 