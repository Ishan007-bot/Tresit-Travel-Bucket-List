import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTravel } from '../contexts/TravelContext';
import * as dataService from '../services/dataService';
import Loading from '../components/Loading';
import StatusSelector from '../components/StatusSelector';
import '../styles/DestinationDetail.css';
import '../styles/StaticComponents.css';

// Simple static component to display a map placeholder
const StaticMapView = ({ countryName, latlng }) => {
  const lat = latlng?.[0];
  const lng = latlng?.[1];
  
  return (
    <div className="map-view">
      <div className="map-fallback">
        <div className="static-map">
          <div className="map-placeholder">
            <h3>{countryName}</h3>
            {lat && lng && (
              <p className="coordinates">Coordinates: {lat.toFixed(2)}°, {lng.toFixed(2)}°</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// Static travel tips component
const StaticTravelTips = ({ countryName }) => {
  return (
    <div className="travel-tips">
      <h3>Travel Tips for {countryName}</h3>
      <ul className="tips-list">
        <li className="tip-item">
          <span className="tip-icon">💡</span>
          <span className="tip-text">Keep a digital copy of your passport and travel documents.</span>
        </li>
        <li className="tip-item">
          <span className="tip-icon">💡</span>
          <span className="tip-text">Learn a few basic phrases in the local language.</span>
        </li>
        <li className="tip-item">
          <span className="tip-icon">💡</span>
          <span className="tip-text">Research local customs and etiquette before arrival.</span>
        </li>
        <li className="tip-item">
          <span className="tip-icon">💡</span>
          <span className="tip-text">Register with your country's embassy before travel.</span>
        </li>
        <li className="tip-item">
          <span className="tip-icon">💡</span>
          <span className="tip-text">Purchase travel insurance that covers medical emergencies.</span>
        </li>
      </ul>
    </div>
  );
};

// Simple static budget planner component
const StaticBudgetPlanner = ({ countryName }) => {
  return (
    <div className="travel-planner">
      <h2>Travel Planner for {countryName}</h2>
      <div className="planner-tabs">
        <button className="tab-button active">Budget</button>
        <button className="tab-button">Packing List</button>
        <button className="tab-button">Itinerary</button>
      </div>
      <div className="tab-content">
        <div className="budget-panel">
          <div className="budget-header">
            <h3>Trip Budget</h3>
            <p className="budget-total">To set your budget, save this country to your travel list first.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

const DestinationDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { savedDestinations, addDestination, updateDestination } = useTravel();
  const [country, setCountry] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [status, setStatus] = useState(null);
  const [notes, setNotes] = useState('');

  // Single effect to fetch data and initialize state
  useEffect(() => {
    const fetchCountryData = async () => {
      try {
        setLoading(true);
        
        // Fetch country data
        const data = await dataService.getCountryByCode(id);
        setCountry(data);
        
        // Check if country is in saved destinations
        const savedCountry = savedDestinations.find(dest => dest.cca3 === id);
        if (savedCountry) {
          setStatus(savedCountry.status);
          setNotes(savedCountry.notes || '');
        }
        
        setLoading(false);
      } catch (err) {
        console.error('Error loading country data:', err);
        setError(err);
        setLoading(false);
      }
    };
    
    fetchCountryData();
  }, [id, savedDestinations]);

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
          <StaticMapView 
            countryName={countryName}
            latlng={country.latlng}
          />
        </div>
      </div>

      <StaticTravelTips countryName={countryName} />
      
      {status && <StaticBudgetPlanner countryName={countryName} />}
    </div>
  );
};

export default DestinationDetail; 