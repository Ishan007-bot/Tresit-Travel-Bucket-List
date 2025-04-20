// Mock data for countries
export const mockCountries = [
  {
    name: {
      common: "United States",
      official: "United States of America"
    },
    capital: ["Washington D.C."],
    region: "Americas",
    subregion: "North America",
    population: 329484123,
    flags: {
      png: "https://flagcdn.com/w320/us.png",
      svg: "https://flagcdn.com/us.svg"
    },
    cca3: "USA",
    currencies: {
      USD: {
        name: "United States dollar",
        symbol: "$"
      }
    },
    languages: {
      eng: "English"
    },
    borders: ["CAN", "MEX"],
    area: 9372610,
    maps: {
      googleMaps: "https://goo.gl/maps/e8M246zY4BSjkjAv6"
    }
  },
  {
    name: {
      common: "Japan",
      official: "Japan"
    },
    capital: ["Tokyo"],
    region: "Asia",
    subregion: "Eastern Asia",
    population: 125836021,
    flags: {
      png: "https://flagcdn.com/w320/jp.png",
      svg: "https://flagcdn.com/jp.svg"
    },
    cca3: "JPN",
    currencies: {
      JPY: {
        name: "Japanese yen",
        symbol: "¥"
      }
    },
    languages: {
      jpn: "Japanese"
    },
    borders: [],
    area: 377930,
    maps: {
      googleMaps: "https://goo.gl/maps/NGTLSCSrA8bMrvnX9"
    }
  },
  {
    name: {
      common: "France",
      official: "French Republic"
    },
    capital: ["Paris"],
    region: "Europe",
    subregion: "Western Europe",
    population: 67391582,
    flags: {
      png: "https://flagcdn.com/w320/fr.png",
      svg: "https://flagcdn.com/fr.svg"
    },
    cca3: "FRA",
    currencies: {
      EUR: {
        name: "Euro",
        symbol: "€"
      }
    },
    languages: {
      fra: "French"
    },
    borders: ["AND", "BEL", "DEU", "ITA", "LUX", "MCO", "ESP", "CHE"],
    area: 551695,
    maps: {
      googleMaps: "https://goo.gl/maps/g7QxxSFsWyTPKuzd7"
    }
  },
  {
    name: {
      common: "Brazil",
      official: "Federative Republic of Brazil"
    },
    capital: ["Brasília"],
    region: "Americas",
    subregion: "South America",
    population: 212559409,
    flags: {
      png: "https://flagcdn.com/w320/br.png",
      svg: "https://flagcdn.com/br.svg"
    },
    cca3: "BRA",
    currencies: {
      BRL: {
        name: "Brazilian real",
        symbol: "R$"
      }
    },
    languages: {
      por: "Portuguese"
    },
    borders: ["ARG", "BOL", "COL", "GUF", "GUY", "PRY", "PER", "SUR", "URY", "VEN"],
    area: 8515767,
    maps: {
      googleMaps: "https://goo.gl/maps/waCKk21HeeqFzkNC9"
    }
  },
  {
    name: {
      common: "Australia",
      official: "Commonwealth of Australia"
    },
    capital: ["Canberra"],
    region: "Oceania",
    subregion: "Australia and New Zealand",
    population: 25687041,
    flags: {
      png: "https://flagcdn.com/w320/au.png",
      svg: "https://flagcdn.com/au.svg"
    },
    cca3: "AUS",
    currencies: {
      AUD: {
        name: "Australian dollar",
        symbol: "$"
      }
    },
    languages: {
      eng: "English"
    },
    borders: [],
    area: 7692024,
    maps: {
      googleMaps: "https://goo.gl/maps/DcjaDa7UbhnZTndH6"
    }
  }
];

// Function to simulate API delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Mock API functions
export const getMockCountries = async () => {
  await delay(800); // Simulate network delay
  return [...mockCountries];
};

export const getMockCountryByCode = async (code) => {
  await delay(500);
  const country = mockCountries.find(c => c.cca3 === code);
  
  if (!country) {
    throw new Error("Country not found");
  }
  
  return country;
};

export const searchMockCountries = async (name) => {
  await delay(600);
  const normalizedName = name.toLowerCase();
  return mockCountries.filter(country => 
    country.name.common.toLowerCase().includes(normalizedName)
  );
};

export const getMockCountriesByRegion = async (region) => {
  await delay(700);
  const normalizedRegion = region.toLowerCase();
  return mockCountries.filter(country => 
    country.region.toLowerCase().includes(normalizedRegion)
  );
};

// Flag to determine if we're using mock data
export const USE_MOCK_DATA = false; // Set to true to use mock data instead of real API 