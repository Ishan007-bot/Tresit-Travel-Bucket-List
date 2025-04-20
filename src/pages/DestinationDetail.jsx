import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTravel } from '../contexts/TravelContext';
import * as dataService from '../services/dataService';
import useFetch from '../hooks/useFetch';
import LoadingState from '../components/LoadingState';
import ErrorHandler from '../components/ErrorHandler';
import MapView from '../components/MapView';
import StatusSelector from '../components/StatusSelector';

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
    execute: fetchCountry 
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
      const countryData = {
        cca3: country.cca3,
        name: country.name.common,
        flag: country.flags.png,
        capital: country.capital?.[0] || 'Unknown',
        region: country.region,
        status: newStatus,
        notes
      };
      
      // Check if country is already saved
      const existingIndex = savedDestinations.findIndex(dest => dest.cca3 === id);
      
      if (existingIndex >= 0) {
        updateDestination(existingIndex, countryData);
      } else {
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
        notes: newNotes
      };
      updateDestination(existingIndex, updatedDestination);
    }
  };

  const handleRetry = () => {
    fetchCountry();
  };

  if (loading) return <LoadingState message="Loading country details..." />;
  
  if (error) return <ErrorHandler error={error} retry={handleRetry} />;

  if (!country) return <ErrorHandler error="Country not found" retry={() => navigate('/')} />;

  return (
    <div className="destination-detail">
      <button className="back-button" onClick={() => navigate(-1)}>
        &larr; Back
      </button>
      
      <div className="destination-header">
        <div className="flag-container">
          <img src={country.flags.png} alt={country.flags.alt || `Flag of ${country.name.common}`} className="country-flag" />
        </div>
        <div className="destination-title">
          <h1>{country.name.common}</h1>
          <p className="destination-subheader">
            {country.name.official}
          </p>
        </div>
      </div>

      <div className="status-selector-container">
        <StatusSelector 
          currentStatus={status} 
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
                <span className="info-value">{country.capital?.[0] || 'None'}</span>
              </div>
              <div className="info-item">
                <span className="info-label">Region:</span>
                <span className="info-value">{country.region}</span>
              </div>
              <div className="info-item">
                <span className="info-label">Subregion:</span>
                <span className="info-value">{country.subregion || 'None'}</span>
              </div>
              <div className="info-item">
                <span className="info-label">Population:</span>
                <span className="info-value">{country.population.toLocaleString()}</span>
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
            countryName={country.name.common} 
          />
        </div>
      </div>
    </div>
  );
};

export default DestinationDetail; 