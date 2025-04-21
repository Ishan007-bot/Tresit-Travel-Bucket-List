import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTravel } from '../contexts/TravelContext';
import * as dataService from '../services/dataService';
import useFetch from '../hooks/useFetch';
import Loading from '../components/Loading';
import MapView from '../components/MapView';
import StatusSelector from '../components/StatusSelector';
import TravelPlanner from '../components/TravelPlanner';
import TravelTips from '../components/TravelTips';
import '../styles/DestinationDetail.css';

const DestinationDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { savedDestinations, addDestination, updateDestination } = useTravel();
  const [status, setStatus] = useState(null);
  const [notes, setNotes] = useState('');

  // Fetch country details
  const { 
    data: country, 
    loading, 
    error, 
    retry: retryFetch 
  } = useFetch(() => dataService.getCountryByCode(id), [id]);

  // Check if country is in saved destinations
  useEffect(() => {
    if (!country) return;
    
    const savedCountry = savedDestinations.find(dest => dest.cca3 === id);
    if (savedCountry) {
      setStatus(savedCountry.status);
      setNotes(savedCountry.notes || '');
    }
  }, [country, savedDestinations, id]);

  const handleStatusChange = (newStatus) => {
    setStatus(newStatus);
    
    if (newStatus && country) {
      // Get country name safely
      const countryName = country.name?.common || 
                         (typeof country.name === 'string' ? country.name : 'Unknown Country');
      
      // Get flag URL safely
      const flagUrl = country.flags?.png || 
                     country.flags?.svg || 
                     `https://flagcdn.com/w320/${id.toLowerCase()}.png`;
      
      // Get capital safely
      const capital = country.capital ? 
                     (Array.isArray(country.capital) ? country.capital[0] : country.capital) : 
                     'Unknown';
      
      const countryData = {
        cca3: id,
        name: countryName,
        flag: flagUrl,
        capital: capital,
        region: country.region || 'Unknown',
        status: newStatus,
        notes,
        dateUpdated: new Date().toISOString()
      };
      
      // Check if country is already saved
      const existingIndex = savedDestinations.findIndex(dest => dest.cca3 === id);
      
      if (existingIndex >= 0) {
        updateDestination(existingIndex, {
          ...savedDestinations[existingIndex],
          ...countryData
        });
      } else {
        countryData.dateAdded = new Date().toISOString();
        addDestination(countryData);
      }
    }
  };

  const handleNotesChange = (e) => {
    const newNotes = e.target.value;
    setNotes(newNotes);
    
    // Update notes in context
    const existingIndex = savedDestinations.findIndex(dest => dest.cca3 === id);
    if (existingIndex >= 0 && status) {
      const updatedDestination = {
        ...savedDestinations[existingIndex],
        notes: newNotes,
        dateUpdated: new Date().toISOString()
      };
      updateDestination(existingIndex, updatedDestination);
    }
  };

  if (loading) return <Loading message="Loading country details..." />;
  
  if (error) {
    return (
      <div className="error-container">
        <h2>Error Loading Country</h2>
        <p className="error-message">{error.message || 'Failed to load country details.'}</p>
        <div className="error-actions">
          <button className="btn retry-button" onClick={retryFetch}>
            Retry
          </button>
          <button className="btn" onClick={() => navigate(-1)}>
            Go Back
          </button>
        </div>
      </div>
    );
  }

  if (!country) {
    return (
      <div className="error-container">
        <h2>Country Not Found</h2>
        <p className="error-message">
          We couldn't find information for this country. It may not exist or the ID may be incorrect.
        </p>
        <button className="btn" onClick={() => navigate(-1)}>
          Go Back
        </button>
      </div>
    );
  }

  // Get country name safely
  const countryName = country.name?.common || 
                     (typeof country.name === 'string' ? country.name : 'Unknown Country');
  
  // Get flag URL safely
  const flagUrl = country.flags?.png || 
                 country.flags?.svg || 
                 `https://flagcdn.com/w320/${id.toLowerCase()}.png`;
  
  // Get flag alt text safely
  const flagAlt = country.flags?.alt || `Flag of ${countryName}`;

  return (
    <div className="destination-detail container">
      <button className="back-button" onClick={() => navigate(-1)}>
        &larr; Back
      </button>
      
      <div className="destination-header">
        <div className="flag-container">
          <img src={flagUrl} alt={flagAlt} className="country-flag" />
        </div>
        <div className="destination-title">
          <h1>{countryName}</h1>
          {country.name?.official && country.name.official !== countryName && (
            <p className="destination-subheader">
              {country.name.official}
            </p>
          )}
        </div>
      </div>

      <div className="status-selector-container">
        <StatusSelector 
          status={status}
          onStatusChange={handleStatusChange} 
        />
      </div>
      
      <div className="destination-grid">
        <div className="destination-info">
          <div className="info-section">
            <h3>Quick Facts</h3>
            <div className="info-grid">
              <div className="info-item">
                <span className="info-label">Capital:</span>
                <span className="info-value">
                  {country.capital ? 
                    (Array.isArray(country.capital) ? country.capital[0] : country.capital) 
                    : 'None'}
                </span>
              </div>
              <div className="info-item">
                <span className="info-label">Region:</span>
                <span className="info-value">{country.region || 'Unknown'}</span>
              </div>
              <div className="info-item">
                <span className="info-label">Subregion:</span>
                <span className="info-value">{country.subregion || 'None'}</span>
              </div>
              <div className="info-item">
                <span className="info-label">Population:</span>
                <span className="info-value">
                  {country.population ? country.population.toLocaleString() : 'Unknown'}
                </span>
              </div>
              <div className="info-item">
                <span className="info-label">Languages:</span>
                <span className="info-value">
                  {country.languages 
                    ? Object.values(country.languages).join(', ') 
                    : 'None listed'}
                </span>
              </div>
              <div className="info-item">
                <span className="info-label">Currencies:</span>
                <span className="info-value">
                  {country.currencies 
                    ? Object.values(country.currencies)
                        .map(currency => `${currency.name} (${currency.symbol || 'N/A'})`)
                        .join(', ')
                    : 'None listed'}
                </span>
              </div>
            </div>
          </div>

          {status && (
            <div className="info-section">
              <h3>Travel Notes</h3>
              <textarea
                className="notes-textarea"
                placeholder="Add your travel notes here..."
                value={notes}
                onChange={handleNotesChange}
              />
            </div>
          )}
        </div>

        <div className="map-container">
          <MapView 
            latitude={country.latlng?.[0]} 
            longitude={country.latlng?.[1]} 
            countryName={countryName} 
          />
        </div>
      </div>

      <TravelTips
        countryName={countryName}
        region={country.region || ''}
      />
      
      {status && (
        <TravelPlanner 
          countryName={countryName}
          countryCode={id} 
        />
      )}
    </div>
  );
};

export default DestinationDetail; 