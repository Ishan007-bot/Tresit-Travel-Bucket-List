import React from 'react';
import SearchBar from './SearchBar';

const FilterBar = ({ onSearch, onFilterRegion, onSort }) => {
  const regions = ['Africa', 'Americas', 'Asia', 'Europe', 'Oceania'];
  const sortOptions = [
    { value: 'name-asc', label: 'Name (A-Z)' },
    { value: 'name-desc', label: 'Name (Z-A)' },
    { value: 'population-asc', label: 'Population (Low to High)' },
    { value: 'population-desc', label: 'Population (High to Low)' }
  ];

  const handleRegionChange = (e) => {
    onFilterRegion(e.target.value);
  };

  const handleSortChange = (e) => {
    const [criteria, order] = e.target.value.split('-');
    onSort(criteria, order);
  };

  return (
    <div className="filter-section">
      <h2>Find Your Next Destination</h2>
      <div className="filter-controls">
        <SearchBar onSearch={onSearch} />
        
        <div className="filter-dropdown">
          <select 
            className="form-select" 
            onChange={handleRegionChange}
            defaultValue=""
          >
            <option value="">Filter by Region</option>
            {regions.map(region => (
              <option key={region} value={region.toLowerCase()}>{region}</option>
            ))}
          </select>
        </div>

        <div className="filter-dropdown">
          <select 
            className="form-select" 
            onChange={handleSortChange}
            defaultValue="name-asc"
          >
            <option value="" disabled>Sort by</option>
            {sortOptions.map(option => (
              <option key={option.value} value={option.value}>{option.label}</option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
};

export default FilterBar; 