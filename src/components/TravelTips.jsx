import { useMemo } from 'react';
import PropTypes from 'prop-types';
import '../styles/TravelTips.css';

const TravelTips = ({ countryName, region }) => {
  // Define region-specific tips
  const regionTipsMap = useMemo(() => ({
    'Europe': [
      'Many European cities have excellent public transportation systems.',
      'Consider a rail pass if visiting multiple countries.',
      'Tipping practices vary by country, research before you go.',
      'Many museums offer free entry on certain days of the month.',
      'Carry some cash as not all places accept credit cards.'
    ],
    'Asia': [
      'Remove shoes before entering homes and some businesses.',
      'Learn about chopstick etiquette if visiting East Asia.',
      'Carry toilet paper as some public restrooms may not provide it.',
      'Be aware of local dress codes, especially at religious sites.',
      'Street food is delicious but choose vendors with high turnover of customers.'
    ],
    'Americas': [
      'Tipping is expected in restaurants in North America (15-20%).',
      'Distances can be vast, plan transportation accordingly.',
      'In South America, many businesses close for siesta in the afternoon.',
      'Hurricane season affects Caribbean travel from June to November.',
      'Water quality varies, check if tap water is potable at your destination.'
    ],
    'Africa': [
      'Check vaccination requirements well in advance.',
      'Many countries require visa applications ahead of time.',
      'Cash is king in many locations, but keep it secure.',
      'Pack lightweight, breathable clothing for hot climates.',
      'In Muslim countries, dress modestly and respect prayer times.'
    ],
    'Oceania': [
      'Australia and New Zealand have strict biosecurity laws.',
      'Island nations can be expensive, budget accordingly.',
      'The sun is very strong, wear high SPF sunscreen.',
      'Distances between locations can be vast, plan travel time.',
      'Respect indigenous cultures and sacred sites.'
    ]
  }), []);

  const generalTips = useMemo(() => [
    'Always keep a digital copy of your passport and important documents.',
    'Register with your country\'s embassy before international travel.',
    'Research local customs and etiquette before your trip.',
    'Learn a few basic phrases in the local language.',
    'Keep emergency contacts easily accessible.',
    'Purchase travel insurance that covers medical emergencies.',
    'Check if your phone will work at your destination or if you need a local SIM card.'
  ], []);

  // Generate tips based on country and region - do this synchronously without timeouts
  const selectedTips = useMemo(() => {
    try {
      // Get region-specific tips
      const regionTips = regionTipsMap[region] || [];
      
      // Combine and randomize tips
      const allTips = [...generalTips, ...regionTips];
      
      // Use a deterministic "random" selection based on country name
      // This ensures the same country always gets the same tips, eliminating flickering
      const seed = countryName.length; 
      const selectedTips = [];
      
      // Select 5 tips using a deterministic approach
      const indices = new Set();
      let counter = seed;
      
      while (selectedTips.length < 5 && selectedTips.length < allTips.length) {
        const index = counter % allTips.length;
        counter += 1;
        
        if (!indices.has(index)) {
          indices.add(index);
          selectedTips.push(allTips[index]);
        }
      }
      
      return selectedTips;
    } catch (error) {
      console.error('Error generating travel tips:', error);
      return generalTips.slice(0, 5); // Fallback to first 5 general tips
    }
  }, [region, countryName, generalTips, regionTipsMap]);

  return (
    <div className="travel-tips">
      <h3>Travel Tips for {countryName}</h3>
      
      <ul className="tips-list">
        {selectedTips.map((tip, index) => (
          <li key={`${countryName}-tip-${index}`} className="tip-item">
            <span className="tip-icon">💡</span>
            <span className="tip-text">{tip}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

TravelTips.propTypes = {
  countryName: PropTypes.string.isRequired,
  region: PropTypes.string.isRequired
};

export default TravelTips; 