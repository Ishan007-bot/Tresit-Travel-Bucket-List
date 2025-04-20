import { createContext, useState, useEffect, useContext } from 'react';

// Create context
export const TravelContext = createContext();

// Custom hook to use travel context
export const useTravel = () => useContext(TravelContext);

export const TravelProvider = ({ children }) => {
  // State for saved destinations
  const [savedDestinations, setSavedDestinations] = useState([]);
  
  // Load saved destinations from localStorage on initial render
  useEffect(() => {
    const savedData = localStorage.getItem('tresit_destinations');
    if (savedData) {
      setSavedDestinations(JSON.parse(savedData));
    }
  }, []);
  
  // Save destinations to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('tresit_destinations', JSON.stringify(savedDestinations));
  }, [savedDestinations]);
  
  // Context value
  const value = {
    savedDestinations,
    setSavedDestinations
  };
  
  return (
    <TravelContext.Provider value={value}>
      {children}
    </TravelContext.Provider>
  );
}; 