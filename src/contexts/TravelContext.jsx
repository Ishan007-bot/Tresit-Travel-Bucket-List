import { createContext, useState, useEffect, useContext } from 'react';

// Create context
export const TravelContext = createContext();

// Custom hook to use travel context
export const useTravel = () => useContext(TravelContext);

export const TravelProvider = ({ children }) => {
  // State for saved destinations
  const [savedDestinations, setSavedDestinations] = useState([]);
  
  // State for travel plans (budget, packing lists, itineraries)
  const [travelPlans, setTravelPlans] = useState({});
  
  // Load saved destinations from localStorage on initial render
  useEffect(() => {
    const savedData = localStorage.getItem('tresit_destinations');
    if (savedData) {
      setSavedDestinations(JSON.parse(savedData));
    }
    
    const plansData = localStorage.getItem('tresit_travel_plans');
    if (plansData) {
      setTravelPlans(JSON.parse(plansData));
    }
  }, []);
  
  // Save destinations to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('tresit_destinations', JSON.stringify(savedDestinations));
  }, [savedDestinations]);
  
  // Save travel plans to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('tresit_travel_plans', JSON.stringify(travelPlans));
  }, [travelPlans]);
  
  // Add a new destination
  const addDestination = (destination) => {
    setSavedDestinations(prev => [...prev, destination]);
  };
  
  // Update an existing destination
  const updateDestination = (index, updatedDestination) => {
    setSavedDestinations(prev => {
      const newDestinations = [...prev];
      newDestinations[index] = updatedDestination;
      return newDestinations;
    });
  };
  
  // Remove a destination
  const removeDestination = (cca3) => {
    setSavedDestinations(prev => prev.filter(destination => destination.cca3 !== cca3));
    
    // Also remove any travel plans for this destination
    setTravelPlans(prev => {
      const newPlans = { ...prev };
      delete newPlans[cca3];
      return newPlans;
    });
  };
  
  // Save travel plan for a country
  const saveTravelPlan = (cca3, planType, planData) => {
    setTravelPlans(prev => ({
      ...prev,
      [cca3]: {
        ...prev[cca3],
        [planType]: planData
      }
    }));
  };
  
  // Get travel plan for a country
  const getTravelPlan = (cca3, planType) => {
    return travelPlans[cca3]?.[planType] || null;
  };
  
  // Context value
  const value = {
    savedDestinations,
    addDestination,
    updateDestination,
    removeDestination,
    saveTravelPlan,
    getTravelPlan,
    travelPlans
  };
  
  return (
    <TravelContext.Provider value={value}>
      {children}
    </TravelContext.Provider>
  );
}; 