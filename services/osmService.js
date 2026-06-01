import AsyncStorage from '@react-native-async-storage/async-storage';

const OVERPASS_ENDPOINTS = [
  'https://overpass.kumi.systems/api/interpreter',
  'https://overpass-api.de/api/interpreter',
  'https://lz4.overpass-api.de/api/interpreter',
  'https://overpass.openstreetmap.fr/api/interpreter',
];
const CACHE_PREFIX_TRAILS = '@osm_trails_';
const CACHE_PREFIX_PARKS = '@osm_parks_';
const CACHE_TTL_DAYS = 30;

const US_STATES = [
  { code: 'AL', name: 'Alabama' },
  { code: 'AK', name: 'Alaska' },
  { code: 'AZ', name: 'Arizona' },
  { code: 'AR', name: 'Arkansas' },
  { code: 'CA', name: 'California' },
  { code: 'CO', name: 'Colorado' },
  { code: 'CT', name: 'Connecticut' },
  { code: 'DE', name: 'Delaware' },
  { code: 'FL', name: 'Florida' },
  { code: 'GA', name: 'Georgia' },
  { code: 'HI', name: 'Hawaii' },
  { code: 'ID', name: 'Idaho' },
  { code: 'IL', name: 'Illinois' },
  { code: 'IN', name: 'Indiana' },
  { code: 'IA', name: 'Iowa' },
  { code: 'KS', name: 'Kansas' },
  { code: 'KY', name: 'Kentucky' },
  { code: 'LA', name: 'Louisiana' },
  { code: 'ME', name: 'Maine' },
  { code: 'MD', name: 'Maryland' },
  { code: 'MA', name: 'Massachusetts' },
  { code: 'MI', name: 'Michigan' },
  { code: 'MN', name: 'Minnesota' },
  { code: 'MS', name: 'Mississippi' },
  { code: 'MO', name: 'Missouri' },
  { code: 'MT', name: 'Montana' },
  { code: 'NE', name: 'Nebraska' },
  { code: 'NV', name: 'Nevada' },
  { code: 'NH', name: 'New Hampshire' },
  { code: 'NJ', name: 'New Jersey' },
  { code: 'NM', name: 'New Mexico' },
  { code: 'NY', name: 'New York' },
  { code: 'NC', name: 'North Carolina' },
  { code: 'ND', name: 'North Dakota' },
  { code: 'OH', name: 'Ohio' },
  { code: 'OK', name: 'Oklahoma' },
  { code: 'OR', name: 'Oregon' },
  { code: 'PA', name: 'Pennsylvania' },
  { code: 'RI', name: 'Rhode Island' },
  { code: 'SC', name: 'South Carolina' },
  { code: 'SD', name: 'South Dakota' },
  { code: 'TN', name: 'Tennessee' },
  { code: 'TX', name: 'Texas' },
  { code: 'UT', name: 'Utah' },
  { code: 'VT', name: 'Vermont' },
  { code: 'VA', name: 'Virginia' },
  { code: 'WA', name: 'Washington' },
  { code: 'WV', name: 'West Virginia' },
  { code: 'WI', name: 'Wisconsin' },
  { code: 'WY', name: 'Wyoming' },
];

export const getUSStates = () => {
  return US_STATES;
};

const getCachedData = async (prefix, stateCode) => {
  try {
    const key = `${prefix}${stateCode}`;
    const cached = await AsyncStorage.getItem(key);
    
    if (!cached) return null;
    
    const parsed = JSON.parse(cached);
    const ageInDays = (Date.now() - parsed.timestamp) / (1000 * 60 * 60 * 24);
    
    if (ageInDays > CACHE_TTL_DAYS) {
      await AsyncStorage.removeItem(key);
      return null;
    }
    
    return parsed.data;
  } catch (error) {
    console.error('Cache read error:', error);
    return null;
  }
};

const setCachedData = async (prefix, stateCode, data) => {
  try {
    const key = `${prefix}${stateCode}`;
    await AsyncStorage.setItem(key, JSON.stringify({
      timestamp: Date.now(),
      data,
    }));
  } catch (error) {
    console.error('Cache write error:', error);
  }
};

const fetchOsmData = async (query) => {
  let lastError = null;
  
  for (let i = 0; i < OVERPASS_ENDPOINTS.length; i++) {
    const endpoint = OVERPASS_ENDPOINTS[i];
    const url = `${endpoint}?data=${encodeURIComponent(query)}`;
    
    try {
      console.log(`Trying endpoint ${i + 1}/${OVERPASS_ENDPOINTS.length}: ${endpoint.split('//')[1].split('/')[0]}`);
      
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'User-Agent': 'RoadtripPlanner/1.0',
        },
      });
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }
      
      const data = await response.json();
      console.log(`✓ Success on endpoint ${i + 1}`);
      return data;
      
    } catch (error) {
      console.log(`✗ Endpoint ${i + 1} failed: ${error.message}`);
      lastError = error;
      
      if (i < OVERPASS_ENDPOINTS.length - 1) {
        const waitMs = 1000 * (i + 1);
        console.log(`Waiting ${waitMs}ms before next try...`);
        await new Promise(resolve => setTimeout(resolve, waitMs));
      }
    }
  }
  
  throw new Error(`All Overpass endpoints failed. Last error: ${lastError?.message}`);
};

const buildTrailsQuery = (stateCode) => {
  return `
[out:json][timeout:90];
area["ISO3166-2"="US-${stateCode}"]->.searchArea;
(
  way["highway"~"^(path|footway|track)$"]["name"]["foot"!="no"](area.searchArea);
);
out center tags 500;
  `.trim();
};

const buildParksQuery = (stateCode) => {
  return `
[out:json][timeout:90];
area["ISO3166-2"="US-${stateCode}"]->.searchArea;
(
  way["leisure"="park"]["name"](area.searchArea);
  relation["leisure"="park"]["name"](area.searchArea);
);
out center 300;
  `.trim();
};

export const fetchTrailsForState = async (stateCode) => {
  if (!stateCode) return [];
  
  const cached = await getCachedData(CACHE_PREFIX_TRAILS, stateCode);
  if (cached) {
    console.log(`Using cached trails for: ${stateCode} (${cached.length} trails)`);
    return cached;
  }
  
  try {
    console.log(`Fetching trails for ${stateCode}...`);
    const query = buildTrailsQuery(stateCode);
    const data = await fetchOsmData(query);
    
    if (!data.elements || data.elements.length === 0) {
      await setCachedData(CACHE_PREFIX_TRAILS, stateCode, []);
      return [];
    }
    
    const trails = data.elements
      .filter(el => el.center && el.tags?.name)
      .map(el => ({
        id: `trail_${el.id}`,
        name: el.tags.name,
        latitude: el.center.lat,
        longitude: el.center.lon,
        type: 'trail',
        highway: el.tags.highway,
        surface: el.tags.surface || 'unknown',
        difficulty: el.tags['sac_scale'] || el.tags['mtb:scale'] || null,
        wheelchair: el.tags.wheelchair === 'yes',
        bicycle: el.tags.bicycle === 'yes',
        designation: 'Trail',
        categoryIcon: '🥾',
        pinColor: '#2e7d32',
        states: stateCode,
      }));
    
    console.log(`Fetched ${trails.length} trails for ${stateCode}`);
    await setCachedData(CACHE_PREFIX_TRAILS, stateCode, trails);
    
    return trails;
  } catch (error) {
    console.error('Error fetching OSM trails:', error);
    return [];
  }
};

export const fetchParksForState = async (stateCode) => {
  if (!stateCode) return [];
  
  const cached = await getCachedData(CACHE_PREFIX_PARKS, stateCode);
  if (cached) {
    console.log(`Using cached parks for: ${stateCode} (${cached.length} parks)`);
    return cached;
  }
  
  try {
    console.log(`Fetching parks for ${stateCode}...`);
    const query = buildParksQuery(stateCode);
    const data = await fetchOsmData(query);
    
    
    if (!data.elements || data.elements.length === 0) {
      await setCachedData(CACHE_PREFIX_PARKS, stateCode, []);
      return [];
    }
    
    const parks = data.elements
      .filter(el => (el.center || (el.lat && el.lon)) && el.tags?.name)
      .map(el => {
        const lat = el.center ? el.center.lat : el.lat;
        const lon = el.center ? el.center.lon : el.lon;
        
        return {
          id: `park_osm_${el.id}`,
          name: el.tags.name,
          shortName: el.tags.name,
          latitude: lat,
          longitude: lon,
          type: 'city_park',
          designation: 'City Park',
          categoryIcon: '🌳',
          pinColor: '#4caf50',
          states: stateCode,
        };
      });
    
console.log(`Fetched ${parks.length} parks for ${stateCode}`);
    await setCachedData(CACHE_PREFIX_PARKS, stateCode, parks);
    
    return parks;
  } catch (error) {
    console.error('Error fetching OSM parks:', error);
    return [];
  }
};

export const clearTrailsCache = async () => {
  try {
    const keys = await AsyncStorage.getAllKeys();
    const cacheKeys = keys.filter(k => k.startsWith(CACHE_PREFIX_TRAILS));
    await AsyncStorage.multiRemove(cacheKeys);
    return { success: true, cleared: cacheKeys.length };
  } catch (error) {
    return { success: false };
  }
};

export const clearParksCache = async () => {
  try {
    const keys = await AsyncStorage.getAllKeys();
    const cacheKeys = keys.filter(k => k.startsWith(CACHE_PREFIX_PARKS));
    await AsyncStorage.multiRemove(cacheKeys);
    return { success: true, cleared: cacheKeys.length };
  } catch (error) {
    return { success: false };
  }
};