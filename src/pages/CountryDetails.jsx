import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { getCountryByCode } from '../services/api';
import SaveButtons from '../components/SaveButtons';
import Loading from '../components/Loading';
import { useTravel } from '../contexts/TravelContext';

const CountryDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { savedDestinations } = useTravel();
  const [country, setCountry] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCountryDetails = async () => {
      try {
        setLoading(true);
        
        // First check if we already have this country in our saved destinations
        const savedCountry = savedDestinations.find(dest => dest.cca3 === id);
        
        if (savedCountry) {
          // If we have some basic data already, use it temporarily while loading full details
          setCountry({
            name: { common: savedCountry.name, official: savedCountry.name },
            flags: { png: savedCountry.flag },
            cca3: savedCountry.cca3
          });
        }
        
        // Now fetch full details from the API
        const data = await getCountryByCode(id);
        if (data) {
          setCountry(data);
          setLoading(false);
        } else {
          setError('Country data not available. Please try again later.');
          setLoading(false);
        }
      } catch (error) {
        console.error('Error fetching country details:', error);
        setError('Failed to load country details. Please try again later.');
        setLoading(false);
      }
    };

    fetchCountryDetails();
  }, [id, savedDestinations]);

  if (loading && !country) return <Loading />;

  if (error) return (
    <div className="container">
      <div className="error-message">{error}</div>
      <button onClick={() => navigate(-1)} className="btn">Go Back</button>
    </div>
  );

  if (!country) return (
    <div className="container">
      <div className="error-message">Country not found</div>
      <button onClick={() => navigate(-1)} className="btn">Go Back</button>
    </div>
  );

  // Handle potentially missing data safely
  const {
    name = { common: 'Unknown', official: 'Unknown' },
    flags = { png: '' },
    population = 0,
    region = 'Unknown',
    subregion = 'Unknown',
    capital = [],
    currencies = {},
    languages = {}
  } = country;

  // Format population with commas
  const formattedPopulation = population.toLocaleString();

  // Get currency names
  const currencyNames = currencies 
    ? Object.values(currencies).map(currency => currency.name).join(', ')
    : 'N/A';

  // Get languages
  const languageNames = languages 
    ? Object.values(languages).join(', ')
    : 'N/A';

  return (
    <div className="container">
      <button onClick={() => navigate(-1)} className="btn">
        &larr; Go Back
      </button>

      <div className="country-details">
        <div className="country-flag">
          <img src={flags.png} alt={`Flag of ${name.common}`} />
        </div>

        <div className="country-info">
          <h1>{name.common}</h1>
          
          <div className="info-grid">
            <div className="info-column">
              <p><strong>Native Name:</strong> {name.official}</p>
              <p><strong>Population:</strong> {formattedPopulation}</p>
              <p><strong>Region:</strong> {region}</p>
              <p><strong>Sub Region:</strong> {subregion || 'N/A'}</p>
            </div>
            
            <div className="info-column">
              <p><strong>Capital:</strong> {capital?.length ? capital[0] : 'N/A'}</p>
              <p><strong>Currencies:</strong> {currencyNames}</p>
              <p><strong>Languages:</strong> {languageNames}</p>
            </div>
          </div>

          <SaveButtons country={country} />
        </div>
      </div>
    </div>
  );
};

export default CountryDetails; 