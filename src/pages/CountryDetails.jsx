import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getCountryByCode } from '../services/api';
import SaveButtons from '../components/SaveButtons';
import Loading from '../components/Loading';

const CountryDetails = () => {
  const { id } = useParams();
  const [country, setCountry] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCountryDetails = async () => {
      try {
        setLoading(true);
        const data = await getCountryByCode(id);
        setCountry(data);
        setLoading(false);
      } catch (error) {
        setError('Failed to load country details. Please try again later.');
        setLoading(false);
      }
    };

    fetchCountryDetails();
  }, [id]);

  if (loading) return <Loading />;

  if (error) return <div className="error-message">{error}</div>;

  if (!country) return <div className="error-message">Country not found</div>;

  const {
    name,
    flags,
    population,
    region,
    subregion,
    capital,
    currencies,
    languages
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
      <Link to="/" className="btn">
        &larr; Back to All Countries
      </Link>

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
              <p><strong>Capital:</strong> {capital ? capital[0] : 'N/A'}</p>
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