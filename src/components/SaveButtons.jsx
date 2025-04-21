import { useTravel } from '../contexts/TravelContext';

const SaveButtons = ({ country }) => {
  const { savedDestinations, addDestination, updateDestination, removeDestination } = useTravel();
  
  // Check if the country is already saved and its status
  const savedCountryIndex = savedDestinations.findIndex(dest => dest.cca3 === country.cca3);
  const savedCountry = savedCountryIndex !== -1 ? savedDestinations[savedCountryIndex] : null;
  const isWishlist = savedCountry?.status === 'wishlist';
  const isVisited = savedCountry?.status === 'visited';
  
  const handleSave = (status) => {
    // If country is already saved with this status, remove it
    if ((status === 'wishlist' && isWishlist) || (status === 'visited' && isVisited)) {
      removeDestination(country.cca3);
      return;
    }
    
    // If country is already saved but with different status, update it
    if (savedCountry) {
      const updatedDestination = { ...savedCountry, status: status };
      updateDestination(savedCountryIndex, updatedDestination);
      return;
    }
    
    // Otherwise, add the country to saved destinations
    addDestination({ 
      cca3: country.cca3, 
      name: country.name.common,
      flag: country.flags.png,
      status: status,
      dateAdded: new Date().toISOString(),
    });
  };
  
  return (
    <div className="save-buttons">
      <button 
        className={`btn ${isWishlist ? 'btn-active' : ''}`}
        onClick={() => handleSave('wishlist')}
        aria-label={isWishlist ? "Remove from wishlist" : "Add to wishlist"}
      >
        {isWishlist ? 'Remove from Wishlist' : 'Add to Wishlist'}
      </button>
      
      <button 
        className={`btn ${isVisited ? 'btn-active' : ''}`}
        onClick={() => handleSave('visited')}
        aria-label={isVisited ? "Remove from visited" : "Mark as visited"}
      >
        {isVisited ? 'Unmark as Visited' : 'Mark as Visited'}
      </button>
    </div>
  );
};

export default SaveButtons; 