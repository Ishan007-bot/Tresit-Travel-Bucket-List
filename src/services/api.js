import axios from 'axios';

const API_URL = 'https://restcountries.com/v3.1';

// Create axios instance with base config
const apiClient = axios.create({
  baseURL: API_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  }
});

// Response interceptor for error handling
apiClient.interceptors.response.use(
  response => response,
  error => {
    console.error('API Error:', error);
    
    if (error.response) {
      // Server responded with a status code outside of 2xx range
      console.error('Error data:', error.response.data);
      console.error('Error status:', error.response.status);
    } else if (error.request) {
      // Request was made but no response received
      console.error('No response received:', error.request);
    }
    
    return Promise.reject(error);
  }
);

// Helper function to extract common fields from API response
const extractCommonFields = (data) => {
  try {
    return data.map(country => ({
      name: country.name,
      capital: country.capital,
      region: country.region,
      subregion: country.subregion,
      population: country.population,
      flags: country.flags,
      cca3: country.cca3,
      languages: country.languages,
      borders: country.borders,
      currencies: country.currencies,
      area: country.area,
      maps: country.maps
    }));
  } catch (error) {
    console.error('Error extracting data:', error);
    return data; // Return original data if extraction fails
  }
};

// Fetch all countries with basic info
export const getAllCountries = async () => {
  try {
    const response = await apiClient.get('/all?fields=name,capital,region,population,flags,cca3');
    return response.data;
  } catch (error) {
    console.error('Error fetching countries:', error);
    throw error;
  }
};

// Fetch country details by code
export const getCountryByCode = async (countryCode) => {
  try {
    const response = await apiClient.get(`/alpha/${countryCode}`);
    return response.data[0];
  } catch (error) {
    console.error(`Error fetching country with code ${countryCode}:`, error);
    throw error;
  }
};

// Fetch multiple countries by their codes
export const getCountriesByCodes = async (countryCodes) => {
  if (!countryCodes || countryCodes.length === 0) return [];
  
  try {
    const codes = countryCodes.join(',');
    const response = await apiClient.get(`/alpha?codes=${codes}`);
    return extractCommonFields(response.data);
  } catch (error) {
    console.error(`Error fetching countries with codes ${countryCodes}:`, error);
    return []; // Return empty array instead of throwing
  }
};

// Fetch countries by region
export const getCountriesByRegion = async (region) => {
  try {
    const response = await apiClient.get(`/region/${region}?fields=name,capital,region,population,flags,cca3`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching countries in region ${region}:`, error);
    throw error;
  }
};

// Search countries by name
export const searchCountries = async (name) => {
  try {
    const response = await apiClient.get(`/name/${name}?fields=name,capital,region,population,flags,cca3`);
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

// Fetch countries by currency
export const getCountriesByCurrency = async (currency) => {
  try {
    const response = await apiClient.get(`/currency/${currency}`);
    return extractCommonFields(response.data);
  } catch (error) {
    if (error.response && error.response.status === 404) {
      return [];
    }
    console.error(`Error fetching countries with currency ${currency}:`, error);
    throw error;
  }
};

// Fetch countries by language
export const getCountriesByLanguage = async (language) => {
  try {
    const response = await apiClient.get(`/lang/${language}`);
    return extractCommonFields(response.data);
  } catch (error) {
    if (error.response && error.response.status === 404) {
      return [];
    }
    console.error(`Error fetching countries with language ${language}:`, error);
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
  if (!countries || countries.length === 0) return [];
  
  const sortedCountries = [...countries];
  
  const sortFunctions = {
    name: (a, b) => a.name.common.localeCompare(b.name.common),
    population: (a, b) => a.population - b.population,
    region: (a, b) => a.region.localeCompare(b.region),
    area: (a, b) => (a.area || 0) - (b.area || 0)
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

// Get all unique regions from country data
export const getAllRegions = (countries) => {
  if (!countries || countries.length === 0) return [];
  
  const regionsSet = new Set(countries.map(country => country.region).filter(Boolean));
  return Array.from(regionsSet).sort();
};

// Cache API responses
const cache = new Map();

// Fetch with cache
export const fetchWithCache = async (url, ttl = 3600000) => { // Default TTL: 1 hour
  const cachedData = cache.get(url);
  
  if (cachedData && Date.now() - cachedData.timestamp < ttl) {
    return cachedData.data;
  }
  
  try {
    const response = await apiClient.get(url);
    const data = response.data;
    
    // Store in cache
    cache.set(url, {
      data,
      timestamp: Date.now()
    });
    
    return data;
  } catch (error) {
    console.error(`Error fetching ${url}:`, error);
    throw error;
  }
};

// Clear cache
export const clearCache = () => {
  cache.clear();
}; 