import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTravel } from '../contexts/TravelContext';
import { getAllCountries } from '../services/api';
import Loading from '../components/Loading';

const AddDestination = () => {
  const navigate = useNavigate();
  const { savedDestinations, addDestination } = useTravel();
  
  const [loading, setLoading] = useState(true);
  const [countries, setCountries] = useState([]);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    country: '',
    status: 'wishlist',
    notes: '',
    visitDate: '',
  });
  const [formErrors, setFormErrors] = useState({});

  // Fetch countries for dropdown
  useEffect(() => {
    const fetchCountries = async () => {
      try {
        setLoading(true);
        const data = await getAllCountries();
        // Sort alphabetically
        const sortedCountries = data.sort((a, b) => 
          a.name.common.localeCompare(b.name.common)
        );
        setCountries(sortedCountries);
        setLoading(false);
      } catch (error) {
        setError('Failed to load countries. Please try again later.');
        setLoading(false);
      }
    };

    fetchCountries();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    
    // Clear error when user types
    if (formErrors[name]) {
      setFormErrors({
        ...formErrors,
        [name]: null
      });
    }
  };

  const validateForm = () => {
    const errors = {};
    
    if (!formData.country) {
      errors.country = 'Please select a country';
    }
    
    if (formData.status === 'visited' && !formData.visitDate) {
      errors.visitDate = 'Please enter the date of visit';
    }
    
    return errors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validate form
    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }
    
    // Find selected country data
    const selectedCountry = countries.find(c => c.cca3 === formData.country);
    if (!selectedCountry) {
      setError('Selected country not found.');
      return;
    }
    
    // Check if country is already in saved destinations
    const alreadySaved = savedDestinations.find(d => d.cca3 === formData.country);
    if (alreadySaved) {
      setFormErrors({
        country: `${selectedCountry.name.common} is already in your ${alreadySaved.status} list`
      });
      return;
    }
    
    // Add to saved destinations
    const newDestination = {
      cca3: selectedCountry.cca3,
      name: selectedCountry.name.common,
      flag: selectedCountry.flags.png,
      status: formData.status,
      notes: formData.notes,
      visitDate: formData.status === 'visited' ? formData.visitDate : null,
      dateAdded: new Date().toISOString()
    };
    
    addDestination(newDestination);
    
    // Redirect to travel log
    navigate('/travel-log');
  };

  if (loading) return <Loading />;

  if (error) return <div className="error-message">{error}</div>;

  return (
    <div className="container">
      <h1>Add New Destination</h1>
      <p>Add a country to your travel wishlist or mark it as visited.</p>
      
      <div className="add-destination-form card">
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="country" className="form-label">Country</label>
            <select 
              id="country" 
              name="country" 
              className="form-select"
              value={formData.country}
              onChange={handleChange}
            >
              <option value="">Select a country</option>
              {countries.map(country => (
                <option key={country.cca3} value={country.cca3}>
                  {country.name.common}
                </option>
              ))}
            </select>
            {formErrors.country && <div className="form-error">{formErrors.country}</div>}
          </div>
          
          <div className="form-group">
            <label className="form-label">Status</label>
            <div className="radio-group">
              <label className="radio-label">
                <input 
                  type="radio" 
                  name="status" 
                  value="wishlist"
                  checked={formData.status === 'wishlist'}
                  onChange={handleChange}
                />
                Add to Wishlist
              </label>
              <label className="radio-label">
                <input 
                  type="radio" 
                  name="status" 
                  value="visited"
                  checked={formData.status === 'visited'}
                  onChange={handleChange}
                />
                Mark as Visited
              </label>
            </div>
          </div>
          
          {formData.status === 'visited' && (
            <div className="form-group">
              <label htmlFor="visitDate" className="form-label">Date of Visit</label>
              <input 
                type="date" 
                id="visitDate" 
                name="visitDate" 
                className="form-input"
                value={formData.visitDate}
                onChange={handleChange}
              />
              {formErrors.visitDate && <div className="form-error">{formErrors.visitDate}</div>}
            </div>
          )}
          
          <div className="form-group">
            <label htmlFor="notes" className="form-label">Notes</label>
            <textarea 
              id="notes" 
              name="notes" 
              className="form-textarea"
              placeholder="Add your travel notes, experiences, or future plans..."
              value={formData.notes}
              onChange={handleChange}
            ></textarea>
          </div>
          
          <button type="submit" className="btn">
            {formData.status === 'wishlist' ? 'Add to Wishlist' : 'Mark as Visited'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddDestination; 