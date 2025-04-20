import axios from 'axios';

const API_URL = 'https://restcountries.com/v3.1';

// Fetch all countries with basic info
export const getAllCountries = async () => {
  try {
    const response = await axios.get(`${API_URL}/all?fields=name,capital,region,population,flags,cca3`);
    return response.data;
  } catch (error) {
    console.error('Error fetching countries:', error);
    throw error;
  }
};

// Fetch country details by code
export const getCountryByCode = async (countryCode) => {
  try {
    const response = await axios.get(`${API_URL}/alpha/${countryCode}`);
    return response.data[0];
  } catch (error) {
    console.error(`Error fetching country with code ${countryCode}:`, error);
    throw error;
  }
};

// Fetch countries by region
export const getCountriesByRegion = async (region) => {
  try {
    const response = await axios.get(`${API_URL}/region/${region}?fields=name,capital,region,population,flags,cca3`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching countries in region ${region}:`, error);
    throw error;
  }
};

// Search countries by name
export const searchCountries = async (name) => {
  try {
    const response = await axios.get(`${API_URL}/name/${name}?fields=name,capital,region,population,flags,cca3`);
    return response.data;
  } catch (error) {
    // Return empty array for not found
    if (error.response && error.response.status === 404) {
      return [];
    }
    console.error(`Error searching countries with name ${name}:`, error);
    throw error;
  }
};

// Filter countries by population (min and max are optional)
export const filterCountriesByPopulation = (countries, min, max) => {
  if (!min && !max) return countries;
  
  return countries.filter(country => {
    const population = country.population;
    if (min && max) {
      return population >= min && population <= max;
    } else if (min) {
      return population >= min;
    } else if (max) {
      return population <= max;
    }
    return true;
  });
};

// Sort countries by various criteria
export const sortCountries = (countries, criteria, order = 'asc') => {
  const sortedCountries = [...countries];
  
  const sortFunctions = {
    name: (a, b) => a.name.common.localeCompare(b.name.common),
    population: (a, b) => a.population - b.population,
    region: (a, b) => a.region.localeCompare(b.region)
  };
  
  if (!sortFunctions[criteria]) {
    return sortedCountries;
  }
  
  sortedCountries.sort(sortFunctions[criteria]);
  
  if (order === 'desc') {
    sortedCountries.reverse();
  }
  
  return sortedCountries;
}; 