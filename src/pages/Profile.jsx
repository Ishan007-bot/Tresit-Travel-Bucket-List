import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useTravel } from '../contexts/TravelContext';
import LoadingState from '../components/LoadingState';
import '../styles/Profile.css';

const Profile = () => {
  const { currentUser, updateProfile, logout, loading: authLoading } = useAuth();
  const { savedDestinations } = useTravel();
  const navigate = useNavigate();
  
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  
  // Count travel stats
  const wishlistCount = savedDestinations.filter(dest => dest.status === 'wishlist').length;
  const visitedCount = savedDestinations.filter(dest => dest.status === 'visited').length;
  const planningCount = savedDestinations.filter(dest => dest.status === 'planning').length;
  const bookedCount = savedDestinations.filter(dest => dest.status === 'booked').length;
  
  // Redirect if not logged in
  useEffect(() => {
    if (!authLoading && !currentUser) {
      navigate('/login');
    } else if (currentUser) {
      setName(currentUser.name || '');
    }
  }, [currentUser, authLoading, navigate]);
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!name.trim()) {
      return setError('Name cannot be empty');
    }
    
    try {
      setError('');
      setLoading(true);
      
      await updateProfile({ name });
      setMessage('Profile updated successfully');
      setIsEditing(false);
    } catch (err) {
      setError(err.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };
  
  const handleLogout = () => {
    logout();
    navigate('/login');
  };
  
  if (authLoading) {
    return <LoadingState message="Loading profile..." />;
  }
  
  if (!currentUser) {
    return null; // Will redirect in useEffect
  }
  
  return (
    <div className="profile-container container">
      <div className="profile-header">
        <h1>Your Profile</h1>
        <button 
          onClick={handleLogout} 
          className="btn-outline logout-btn"
        >
          Log Out
        </button>
      </div>
      
      <div className="profile-grid">
        <div className="profile-details card">
          <div className="profile-avatar">
            <span>{currentUser.name ? currentUser.name[0].toUpperCase() : '?'}</span>
          </div>
          
          {error && <div className="profile-error">{error}</div>}
          {message && <div className="profile-message">{message}</div>}
          
          {isEditing ? (
            <form onSubmit={handleSubmit} className="profile-form">
              <div className="form-group">
                <label htmlFor="name">Full Name</label>
                <input
                  type="text"
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="form-input"
                />
              </div>
              
              <div className="form-group read-only">
                <label>Email</label>
                <input
                  type="email"
                  value={currentUser.email}
                  readOnly
                  className="form-input"
                />
                <small>Email cannot be changed</small>
              </div>
              
              <div className="profile-actions">
                <button 
                  type="submit" 
                  className="btn" 
                  disabled={loading}
                >
                  {loading ? 'Saving...' : 'Save Changes'}
                </button>
                <button 
                  type="button" 
                  className="btn-outline" 
                  onClick={() => {
                    setIsEditing(false);
                    setName(currentUser.name || '');
                    setError('');
                    setMessage('');
                  }}
                >
                  Cancel
                </button>
              </div>
            </form>
          ) : (
            <div className="profile-info">
              <div className="info-row">
                <span className="info-label">Name:</span>
                <span className="info-value">{currentUser.name}</span>
              </div>
              <div className="info-row">
                <span className="info-label">Email:</span>
                <span className="info-value">{currentUser.email}</span>
              </div>
              <div className="info-row">
                <span className="info-label">Member Since:</span>
                <span className="info-value">
                  {new Date(currentUser.createdAt).toLocaleDateString()}
                </span>
              </div>
              
              <button 
                onClick={() => {
                  setIsEditing(true);
                  setMessage('');
                }} 
                className="btn edit-profile-btn"
              >
                Edit Profile
              </button>
            </div>
          )}
        </div>
        
        <div className="profile-stats card">
          <h2>Your Travel Stats</h2>
          
          <div className="stats-grid">
            <div className="stat-box">
              <div className="stat-number">{savedDestinations.length}</div>
              <div className="stat-label">Total Destinations</div>
            </div>
            
            <div className="stat-box">
              <div className="stat-number">{wishlistCount}</div>
              <div className="stat-label">Wishlist</div>
            </div>
            
            <div className="stat-box">
              <div className="stat-number">{planningCount}</div>
              <div className="stat-label">Planning</div>
            </div>
            
            <div className="stat-box">
              <div className="stat-number">{bookedCount}</div>
              <div className="stat-label">Booked</div>
            </div>
            
            <div className="stat-box">
              <div className="stat-number">{visitedCount}</div>
              <div className="stat-label">Visited</div>
            </div>
          </div>
          
          <button onClick={() => navigate('/travel-log')} className="btn view-log-btn">
            View Travel Log
          </button>
        </div>
      </div>
    </div>
  );
};

export default Profile; 