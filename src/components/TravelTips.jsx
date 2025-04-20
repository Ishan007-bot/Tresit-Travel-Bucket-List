import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import '../styles/TravelTips.css';

const TravelTips = ({ countryName, region }) => {
  const [tips, setTips] = useState([]);
  const [loading, setLoading] = useState(true);

  // Load tips based on country and region
  useEffect(() => {
    setLoading(true);
    
    // Simulate API call to get tips
    setTimeout(() => {
      const generalTips = [
        'Always keep a digital copy of your passport and important documents.',
        'Register with your country\'s embassy before international travel.',
        'Research local customs and etiquette before your trip.',
        'Learn a few basic phrases in the local language.',
        'Keep emergency contacts easily accessible.',
        'Purchase travel insurance that covers medical emergencies.',
        'Check if your phone will work at your destination or if you need a local SIM card.'
      ];
      
      // Country-specific tips based on region
      let regionTips = [];
      
      if (region === 'Europe') {
        regionTips = [
          'Many European cities have excellent public transportation systems.',
          'Consider a rail pass if visiting multiple countries.',
          'Tipping practices vary by country, research before you go.',
          'Many museums offer free entry on certain days of the month.',
          'Carry some cash as not all places accept credit cards.'
        ];
      } else if (region === 'Asia') {
        regionTips = [
          'Remove shoes before entering homes and some businesses.',
          'Learn about chopstick etiquette if visiting East Asia.',
          'Carry toilet paper as some public restrooms may not provide it.',
          'Be aware of local dress codes, especially at religious sites.',
          'Street food is delicious but choose vendors with high turnover of customers.'
        ];
      } else if (region === 'Americas') {
        regionTips = [
          'Tipping is expected in restaurants in North America (15-20%).',
          'Distances can be vast, plan transportation accordingly.',
          'In South America, many businesses close for siesta in the afternoon.',
          'Hurricane season affects Caribbean travel from June to November.',
          'Water quality varies, check if tap water is potable at your destination.'
        ];
      } else if (region === 'Africa') {
        regionTips = [
          'Check vaccination requirements well in advance.',
          'Many countries require visa applications ahead of time.',
          'Cash is king in many locations, but keep it secure.',
          'Pack lightweight, breathable clothing for hot climates.',
          'In Muslim countries, dress modestly and respect prayer times.'
        ];
      } else if (region === 'Oceania') {
        regionTips = [
          'Australia and New Zealand have strict biosecurity laws.',
          'Island nations can be expensive, budget accordingly.',
          'The sun is very strong, wear high SPF sunscreen.',
          'Distances between locations can be vast, plan travel time.',
          'Respect indigenous cultures and sacred sites.'
        ];
      }
      
      // Combine and randomize tips
      const allTips = [...generalTips, ...regionTips];
      const shuffled = allTips.sort(() => 0.5 - Math.random());
      const selectedTips = shuffled.slice(0, 5); // Show 5 random tips
      
      setTips(selectedTips);
      setLoading(false);
    }, 1000);
  }, [countryName, region]);

  return (
    <div className="travel-tips">
      <h3>Travel Tips for {countryName}</h3>
      
      {loading ? (
        <div className="tips-loading">Loading travel tips...</div>
      ) : (
        <ul className="tips-list">
          {tips.map((tip, index) => (
            <li key={index} className="tip-item">
              <span className="tip-icon">💡</span>
              <span className="tip-text">{tip}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

TravelTips.propTypes = {
  countryName: PropTypes.string.isRequired,
  region: PropTypes.string.isRequired
};

export default TravelTips; 