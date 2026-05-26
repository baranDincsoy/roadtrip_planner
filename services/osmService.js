import AsyncStorage from '@react-native-async-storage/async-storage';

const OVERPASS_URL = 'https://overpass-api.de/api/interpreter';
const CACHE_PREFIX = '@osm_trails_';
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

const getCachedTrails = async (stateCode) => {
  try {
    const key = `${CACHE_PREFIX}${stateCode}`;
    const cached = await AsyncStorage.getItem(key);
    
    if (!cached) return null;
    
    const parsed = JSON.parse(cached);
    const ageInMs = Date.now() - parsed.timestamp;
    const ageInDays = ageInMs / (1000 * 60 * 60 * 24);
    
    if (ageInDays > CACHE_TTL_DAYS) {
      await AsyncStorage.removeItem(key);
      return null;
    }
    
    return parsed.trails;
  } catch (error) {
    console.error('Cache read error:', error);
    return null;
  }
};

const setCachedTrails = async (stateCode, trails) => {
  try {
    const key = `${CACHE_PREFIX}${stateCode}`;
    const data = {
      timestamp: Date.now(),
      trails,
    };
    await AsyncStorage.setItem(key, JSON.stringify(data));
  } catch (error) {
    console.error('Cache write error:', error);
  }
};

const buildOverpassQuery = (stateCode) => {
  return `
[out:json][timeout:60];
area["ISO3166-2"="US-${stateCode}"]->.searchArea;
(
  way["highway"~"^(path|footway|track)$"]["name"]["foot"!="no"](area.searchArea);
);
out center tags 500;
  `.trim();
};

export const fetchTrailsForState = async (stateCode) => {
  if (!stateCode) return [];
  
  const cached = await getCachedTrails(stateCode);
  if (cached) {
    console.log(`Using cached trails for: ${stateCode} (${cached.length} trails)`);
    return cached;
  }
  
  try {
    const query = buildOverpassQuery(stateCode);
    
    console.log(`Fetching trails for ${stateCode}...`);
    
const url = `${OVERPASS_URL}?data=${encodeURIComponent(query)}`;

const response = await fetch(url, {
  method: 'GET',
  headers: {
    'Accept': 'application/json',
    'User-Agent': 'RoadtripPlanner/1.0',
  },
});
    
    if (!response.ok) {
      throw new Error(`Overpass API error: ${response.status}`);
    }
    
    const data = await response.json();
    
    if (!data.elements || data.elements.length === 0) {
      console.log(`No trails found for ${stateCode}`);
      await setCachedTrails(stateCode, []);
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
    
    await setCachedTrails(stateCode, trails);
    
    return trails;
  } catch (error) {
    console.error('Error fetching OSM trails:', error);
    return [];
  }
};

export const clearTrailsCache = async () => {
  try {
    const keys = await AsyncStorage.getAllKeys();
    const cacheKeys = keys.filter(k => k.startsWith(CACHE_PREFIX));
    await AsyncStorage.multiRemove(cacheKeys);
    return { success: true, cleared: cacheKeys.length };
  } catch (error) {
    console.error('Error clearing cache:', error);
    return { success: false };
  }
};