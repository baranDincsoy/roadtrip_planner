import AsyncStorage from '@react-native-async-storage/async-storage';

const RIDB_API_KEY = process.env.EXPO_PUBLIC_RIDB_API_KEY;
const RIDB_BASE_URL = 'https://ridb.recreation.gov/api/v1';
const CACHE_PREFIX = '@recreation_';
const CACHE_TTL_DAYS = 7;

const SEARCH_RADIUS_MILES = 25;

const getCacheKey = (lat, lng) => {
  const roundedLat = lat.toFixed(2);
  const roundedLng = lng.toFixed(2);
  return `${CACHE_PREFIX}${roundedLat}_${roundedLng}`;
};

const getCachedData = async (lat, lng) => {
  try {
    const key = getCacheKey(lat, lng);
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
    console.error('Recreation cache read error:', error);
    return null;
  }
};

const setCachedData = async (lat, lng, data) => {
  try {
    const key = getCacheKey(lat, lng);
    await AsyncStorage.setItem(key, JSON.stringify({
      timestamp: Date.now(),
      data,
    }));
  } catch (error) {
    console.error('Recreation cache write error:', error);
  }
};

export const fetchNearbyCampgrounds = async (latitude, longitude) => {
  if (!RIDB_API_KEY) {
    console.error('RIDB API key not set');
    return [];
  }
  
  const cached = await getCachedData(latitude, longitude);
  if (cached) {
    console.log(`Using cached campgrounds for: ${latitude}, ${longitude}`);
    return cached;
  }
  
  try {
    const url = `${RIDB_BASE_URL}/facilities?latitude=${latitude}&longitude=${longitude}&radius=${SEARCH_RADIUS_MILES}&activity=CAMPING&limit=20`;
    
    console.log('Fetching campgrounds...');
    const response = await fetch(url, {
      headers: {
        'apikey': RIDB_API_KEY,
        'Accept': 'application/json',
      },
    });
    
    if (!response.ok) {
      throw new Error(`RIDB API error: ${response.status}`);
    }
    
    const data = await response.json();
    
    if (!data.RECDATA || data.RECDATA.length === 0) {
      console.log('No campgrounds found nearby');
      await setCachedData(latitude, longitude, []);
      return [];
    }
    
    const campgrounds = data.RECDATA
      .filter(facility => facility.FacilityName && facility.FacilityLatitude && facility.FacilityLongitude)
      .map(facility => ({
        id: `rec_${facility.FacilityID}`,
        name: facility.FacilityName,
        description: facility.FacilityDescription || null,
        phone: facility.FacilityPhone || null,
        email: facility.FacilityEmail || null,
        latitude: parseFloat(facility.FacilityLatitude),
        longitude: parseFloat(facility.FacilityLongitude),
        reservable: facility.Reservable || false,
        useFee: facility.FacilityUseFeeDescription || null,
        directions: facility.FacilityDirections || null,
        recreationGovUrl: `https://www.recreation.gov/camping/campgrounds/${facility.FacilityID}`,
      }));
    
    console.log(`Found ${campgrounds.length} campgrounds nearby`);
    await setCachedData(latitude, longitude, campgrounds);
    
    return campgrounds;
  } catch (error) {
    console.error('Error fetching campgrounds:', error);
    return [];
  }
};

export const clearRecreationCache = async () => {
  try {
    const keys = await AsyncStorage.getAllKeys();
    const cacheKeys = keys.filter(k => k.startsWith(CACHE_PREFIX));
    await AsyncStorage.multiRemove(cacheKeys);
    return { success: true, cleared: cacheKeys.length };
  } catch (error) {
    return { success: false };
  }
};