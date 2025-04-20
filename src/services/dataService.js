import * as api from './api';
import * as mock from './mockData';

// Using either mock data or real API based on environment
const useMockData = mock.USE_MOCK_DATA || process.env.NODE_ENV === 'test';

/**
 * Get all countries
 */
export const getAllCountries = async () => {
  try {
    if (useMockData) {
      return await mock.getMockCountries();
    }
    
    return await api.getAllCountries();
  } catch (error) {
    console.error('Error getting all countries:', error);
    throw error;
  }
};

/**
 * Get country by its code
 */
export const getCountryByCode = async (code) => {
  try {
    if (useMockData) {
      return await mock.getMockCountryByCode(code);
    }
    
    return await api.getCountryByCode(code);
  } catch (error) {
    console.error(`Error getting country with code ${code}:`, error);
    throw error;
  }
};

/**
 * Get multiple countries by their codes
 */
export const getCountriesByCodes = async (codes) => {
  try {
    if (useMockData) {
      const countries = [];
      for (const code of codes) {
        try {
          const country = await mock.getMockCountryByCode(code);
          countries.push(country);
        } catch (e) {
          // Skip countries that weren't found
          console.warn(`Country with code ${code} not found in mock data`);
        }
      }
      return countries;
    }
    
    return await api.getCountriesByCodes(codes);
  } catch (error) {
    console.error(`Error getting countries with codes ${codes}:`, error);
    return []; // Return empty array instead of throwing
  }
};

/**
 * Search for countries by name
 */
export const searchCountries = async (name) => {
  try {
    if (useMockData) {
      return await mock.searchMockCountries(name);
    }
    
    return await api.searchCountries(name);
  } catch (error) {
    console.error(`Error searching countries with name ${name}:`, error);
    // Return empty array for not found
    if (error.response && error.response.status === 404) {
      return [];
    }
    throw error;
  }
};

/**
 * Get countries by region
 */
export const getCountriesByRegion = async (region) => {
  try {
    if (useMockData) {
      return await mock.getMockCountriesByRegion(region);
    }
    
    return await api.getCountriesByRegion(region);
  } catch (error) {
    console.error(`Error getting countries in region ${region}:`, error);
    throw error;
  }
};

/**
 * Get countries by currency
 */
export const getCountriesByCurrency = async (currency) => {
  try {
    if (useMockData) {
      // Filter mock data for currency
      const countries = mock.mockCountries.filter(country => {
        return country.currencies && 
               Object.keys(country.currencies).some(key => 
                 key.toLowerCase() === currency.toLowerCase()
               );
      });
      await mock.delay(600);
      return countries;
    }
    
    return await api.getCountriesByCurrency(currency);
  } catch (error) {
    console.error(`Error getting countries with currency ${currency}:`, error);
    if (error.response && error.response.status === 404) {
      return [];
    }
    throw error;
  }
};

/**
 * Get countries by language
 */
export const getCountriesByLanguage = async (language) => {
  try {
    if (useMockData) {
      // Filter mock data for language
      const countries = mock.mockCountries.filter(country => {
        return country.languages && 
               Object.keys(country.languages).some(key => 
                 key.toLowerCase() === language.toLowerCase()
               );
      });
      await mock.delay(600);
      return countries;
    }
    
    return await api.getCountriesByLanguage(language);
  } catch (error) {
    console.error(`Error getting countries with language ${language}:`, error);
    if (error.response && error.response.status === 404) {
      return [];
    }
    throw error;
  }
};

// Re-export utility functions from API service
export const {
  filterCountriesByPopulation,
  sortCountries,
  getAllRegions,
  clearCache
} = api; 