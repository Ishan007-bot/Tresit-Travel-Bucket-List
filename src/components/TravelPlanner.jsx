import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useTravel } from '../contexts/TravelContext';
import '../styles/TravelPlanner.css';

const TravelPlanner = ({ countryName, countryCode }) => {
  const { saveTravelPlan, getTravelPlan } = useTravel();
  const [activeTab, setActiveTab] = useState('budget');
  const [budget, setBudget] = useState({
    accommodation: 0,
    transportation: 0,
    food: 0,
    activities: 0,
    misc: 0
  });
  const [packingItems, setPackingItems] = useState([]);
  const [newPackingItem, setNewPackingItem] = useState('');
  const [itineraryDays, setItineraryDays] = useState([
    { day: 1, activities: [] }
  ]);
  const [newActivity, setNewActivity] = useState('');
  const [selectedDay, setSelectedDay] = useState(1);

  // Load saved travel plans
  useEffect(() => {
    const savedBudget = getTravelPlan(countryCode, 'budget');
    if (savedBudget) {
      setBudget(savedBudget);
    }

    const savedPackingItems = getTravelPlan(countryCode, 'packingItems');
    if (savedPackingItems) {
      setPackingItems(savedPackingItems);
    }

    const savedItinerary = getTravelPlan(countryCode, 'itinerary');
    if (savedItinerary) {
      setItineraryDays(savedItinerary);
    }
  }, [countryCode, getTravelPlan]);

  // Calculate total budget
  const totalBudget = Object.values(budget).reduce((sum, item) => sum + Number(item), 0);

  // Handle budget changes
  const handleBudgetChange = (category, value) => {
    const newBudget = {
      ...budget,
      [category]: Number(value)
    };
    setBudget(newBudget);
    saveTravelPlan(countryCode, 'budget', newBudget);
  };

  // Add a new packing item
  const addPackingItem = (e) => {
    e.preventDefault();
    if (!newPackingItem.trim()) return;
    
    const newItems = [...packingItems, {
      id: Date.now(),
      name: newPackingItem,
      packed: false
    }];
    
    setPackingItems(newItems);
    setNewPackingItem('');
    saveTravelPlan(countryCode, 'packingItems', newItems);
  };

  // Toggle packed status
  const togglePackedStatus = (id) => {
    const updatedItems = packingItems.map(item => 
      item.id === id ? { ...item, packed: !item.packed } : item
    );
    
    setPackingItems(updatedItems);
    saveTravelPlan(countryCode, 'packingItems', updatedItems);
  };

  // Remove packing item
  const removePackingItem = (id) => {
    const updatedItems = packingItems.filter(item => item.id !== id);
    setPackingItems(updatedItems);
    saveTravelPlan(countryCode, 'packingItems', updatedItems);
  };

  // Add new activity to itinerary
  const addActivity = (e) => {
    e.preventDefault();
    if (!newActivity.trim()) return;
    
    const updatedDays = itineraryDays.map(day => {
      if (day.day === selectedDay) {
        return {
          ...day,
          activities: [...day.activities, {
            id: Date.now(),
            name: newActivity,
            time: ''
          }]
        };
      }
      return day;
    });
    
    setItineraryDays(updatedDays);
    setNewActivity('');
    saveTravelPlan(countryCode, 'itinerary', updatedDays);
  };

  // Add a new day to itinerary
  const addDay = () => {
    const newDay = itineraryDays.length + 1;
    const updatedDays = [...itineraryDays, { day: newDay, activities: [] }];
    
    setItineraryDays(updatedDays);
    setSelectedDay(newDay);
    saveTravelPlan(countryCode, 'itinerary', updatedDays);
  };

  // Remove activity
  const removeActivity = (dayNum, activityId) => {
    const updatedDays = itineraryDays.map(day => {
      if (day.day === dayNum) {
        return {
          ...day,
          activities: day.activities.filter(activity => activity.id !== activityId)
        };
      }
      return day;
    });
    
    setItineraryDays(updatedDays);
    saveTravelPlan(countryCode, 'itinerary', updatedDays);
  };

  // Handle activity time change
  const updateActivityTime = (dayNum, activityId, time) => {
    const updatedDays = itineraryDays.map(day => {
      if (day.day === dayNum) {
        return {
          ...day,
          activities: day.activities.map(activity => {
            if (activity.id === activityId) {
              return { ...activity, time };
            }
            return activity;
          })
        };
      }
      return day;
    });
    
    setItineraryDays(updatedDays);
    saveTravelPlan(countryCode, 'itinerary', updatedDays);
  };

  return (
    <div className="travel-planner">
      <h2>Travel Planner for {countryName}</h2>
      
      <div className="planner-tabs">
        <button 
          className={`tab-button ${activeTab === 'budget' ? 'active' : ''}`}
          onClick={() => setActiveTab('budget')}
        >
          Budget
        </button>
        <button 
          className={`tab-button ${activeTab === 'packing' ? 'active' : ''}`}
          onClick={() => setActiveTab('packing')}
        >
          Packing List
        </button>
        <button 
          className={`tab-button ${activeTab === 'itinerary' ? 'active' : ''}`}
          onClick={() => setActiveTab('itinerary')}
        >
          Itinerary
        </button>
      </div>
      
      <div className="tab-content">
        {activeTab === 'budget' && (
          <div className="budget-panel">
            <div className="budget-header">
              <h3>Trip Budget</h3>
              <p className="budget-total">Total: ${totalBudget}</p>
            </div>
            
            <div className="budget-form">
              <div className="budget-item">
                <label>Accommodation:</label>
                <div className="budget-input-container">
                  <span className="currency-symbol">$</span>
                  <input 
                    type="number" 
                    value={budget.accommodation} 
                    onChange={(e) => handleBudgetChange('accommodation', e.target.value)}
                    min="0"
                  />
                </div>
              </div>
              
              <div className="budget-item">
                <label>Transportation:</label>
                <div className="budget-input-container">
                  <span className="currency-symbol">$</span>
                  <input 
                    type="number" 
                    value={budget.transportation} 
                    onChange={(e) => handleBudgetChange('transportation', e.target.value)}
                    min="0"
                  />
                </div>
              </div>
              
              <div className="budget-item">
                <label>Food:</label>
                <div className="budget-input-container">
                  <span className="currency-symbol">$</span>
                  <input 
                    type="number" 
                    value={budget.food} 
                    onChange={(e) => handleBudgetChange('food', e.target.value)}
                    min="0"
                  />
                </div>
              </div>
              
              <div className="budget-item">
                <label>Activities:</label>
                <div className="budget-input-container">
                  <span className="currency-symbol">$</span>
                  <input 
                    type="number" 
                    value={budget.activities} 
                    onChange={(e) => handleBudgetChange('activities', e.target.value)}
                    min="0"
                  />
                </div>
              </div>
              
              <div className="budget-item">
                <label>Miscellaneous:</label>
                <div className="budget-input-container">
                  <span className="currency-symbol">$</span>
                  <input 
                    type="number" 
                    value={budget.misc} 
                    onChange={(e) => handleBudgetChange('misc', e.target.value)}
                    min="0"
                  />
                </div>
              </div>
            </div>
            
            <div className="budget-chart">
              <div className="chart-legend">
                {Object.entries(budget).map(([category, value]) => {
                  if (Number(value) > 0) {
                    return (
                      <div className="legend-item" key={category}>
                        <div className="legend-color" style={{ backgroundColor: getCategoryColor(category) }}></div>
                        <span>{formatCategoryName(category)}: ${value}</span>
                      </div>
                    );
                  }
                  return null;
                })}
              </div>
            </div>
          </div>
        )}
        
        {activeTab === 'packing' && (
          <div className="packing-panel">
            <h3>Packing List</h3>
            
            <form onSubmit={addPackingItem} className="add-item-form">
              <input
                type="text"
                placeholder="Add item to pack..."
                value={newPackingItem}
                onChange={(e) => setNewPackingItem(e.target.value)}
              />
              <button type="submit" className="btn">Add</button>
            </form>
            
            <div className="packing-list">
              {packingItems.length === 0 ? (
                <p className="empty-list">Your packing list is empty. Start adding items above!</p>
              ) : (
                <>
                  <div className="packing-stats">
                    <span>{packingItems.filter(item => item.packed).length} of {packingItems.length} packed</span>
                  </div>
                  
                  <ul className="items-list">
                    {packingItems.map(item => (
                      <li key={item.id} className={item.packed ? 'packed' : ''}>
                        <label className="checkbox-label">
                          <input
                            type="checkbox"
                            checked={item.packed}
                            onChange={() => togglePackedStatus(item.id)}
                          />
                          <span className="item-name">{item.name}</span>
                        </label>
                        <button 
                          className="remove-btn"
                          onClick={() => removePackingItem(item.id)}
                        >
                          &times;
                        </button>
                      </li>
                    ))}
                  </ul>
                </>
              )}
            </div>
          </div>
        )}
        
        {activeTab === 'itinerary' && (
          <div className="itinerary-panel">
            <h3>Trip Itinerary</h3>
            
            <div className="day-selector">
              {itineraryDays.map(day => (
                <button
                  key={day.day}
                  className={`day-btn ${selectedDay === day.day ? 'active' : ''}`}
                  onClick={() => setSelectedDay(day.day)}
                >
                  Day {day.day}
                </button>
              ))}
              <button className="add-day-btn" onClick={addDay}>+ Add Day</button>
            </div>
            
            <div className="day-activities">
              <h4>Day {selectedDay}</h4>
              
              <form onSubmit={addActivity} className="add-activity-form">
                <input
                  type="text"
                  placeholder="Add activity..."
                  value={newActivity}
                  onChange={(e) => setNewActivity(e.target.value)}
                />
                <button type="submit" className="btn">Add</button>
              </form>
              
              {itineraryDays.find(day => day.day === selectedDay)?.activities.length === 0 ? (
                <p className="empty-list">No activities planned for this day yet.</p>
              ) : (
                <ul className="activities-list">
                  {itineraryDays.find(day => day.day === selectedDay)?.activities.map(activity => (
                    <li key={activity.id}>
                      <div className="activity-details">
                        <input
                          type="time"
                          value={activity.time}
                          onChange={(e) => updateActivityTime(selectedDay, activity.id, e.target.value)}
                          className="time-input"
                        />
                        <span className="activity-name">{activity.name}</span>
                      </div>
                      <button 
                        className="remove-btn"
                        onClick={() => removeActivity(selectedDay, activity.id)}
                      >
                        &times;
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// Helper functions
const getCategoryColor = (category) => {
  const colors = {
    accommodation: '#6c5ce7',
    transportation: '#00b894',
    food: '#fdcb6e',
    activities: '#e84393',
    misc: '#636e72'
  };
  
  return colors[category] || '#ddd';
};

const formatCategoryName = (category) => {
  return category.charAt(0).toUpperCase() + category.slice(1);
};

TravelPlanner.propTypes = {
  countryName: PropTypes.string.isRequired,
  countryCode: PropTypes.string.isRequired
};

export default TravelPlanner; 