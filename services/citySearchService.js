import AsyncStorage from '@react-native-async-storage/async-storage';

const PLACES_API_KEY = process.env.EXPO_PUBLIC_GOOGLE_PLACES_API_KEY;
const PLACES_BASE_URL = 'https://maps.googleapis.com/maps/api/place';
const CACHE_PREFIX = '@city_parks_';
const CACHE_TTL_DAYS = 30;

const getCacheKey = (cityQuery) => {
  const cleanQuery = cityQuery.toLowerCase().replace(/[^a-z0-9]/g, '_');
  return `${CACHE_PREFIX}${cleanQuery}`;
};

const getCachedParks = async (cityQuery) => {
  try {
    const key = getCacheKey(cityQuery);
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

const setCachedParks = async (cityQuery, data) => {
  try {
    const key = getCacheKey(cityQuery);
    await AsyncStorage.setItem(key, JSON.stringify({
      timestamp: Date.now(),
      data,
    }));
  } catch (error) {
    console.error('Cache write error:', error);
  }
};

const buildPhotoUrl = (photoReference, maxWidth = 400) => {
  return `${PLACES_BASE_URL}/photo?maxwidth=${maxWidth}&photo_reference=${photoReference}&key=${PLACES_API_KEY}`;
};

export const searchParksInCity = async (cityQuery) => {
  if (!cityQuery || cityQuery.trim().length === 0) return [];
  
  const trimmedQuery = cityQuery.trim();
  
  const cached = await getCachedParks(trimmedQuery);
  if (cached) {
    console.log(`Using cached parks for: ${trimmedQuery} (${cached.length} parks)`);
    return cached;
  }
  
  try {
    const query = encodeURIComponent(`parks in ${trimmedQuery}`);
    const searchUrl = `${PLACES_BASE_URL}/textsearch/json?query=${query}&type=park&key=${PLACES_API_KEY}`;
    
    console.log(`Searching parks in: ${trimmedQuery}`);
    
    const response = await fetch(searchUrl);
    
    if (!response.ok) {
      throw new Error(`Places API error: ${response.status}`);
    }
    
    const data = await response.json();
    
    if (data.status !== 'OK' || !data.results || data.results.length === 0) {
      console.log(`No parks found for: ${trimmedQuery}, status: ${data.status}`);
      return [];
    }
    
    const parks = data.results.map(place => {
      const photos = (place.photos || [])
        .slice(0, 3)
        .map(photo => buildPhotoUrl(photo.photo_reference, 400));
      
      return {
        id: `city_park_${place.place_id}`,
        name: place.name,
        shortName: place.name,
        latitude: place.geometry.location.lat,
        longitude: place.geometry.location.lng,
        type: 'city_park',
        designation: 'City Park',
        categoryIcon: '🌳',
        pinColor: '#66bb6a',
        states: trimmedQuery,
        rating: place.rating || null,
        totalRatings: place.user_ratings_total || 0,
        photos,
        address: place.formatted_address || null,
        priceLevel: place.price_level || null,
        place_id: place.place_id,
      };
    });
    
    console.log(`Found ${parks.length} parks in ${trimmedQuery}`);
    await setCachedParks(trimmedQuery, parks);
    
    return parks;
  } catch (error) {
    console.error('Error searching city parks:', error);
    return [];
  }
};

export const clearCityParksCache = async () => {
  try {
    const keys = await AsyncStorage.getAllKeys();
    const cacheKeys = keys.filter(k => k.startsWith(CACHE_PREFIX));
    await AsyncStorage.multiRemove(cacheKeys);
    return { success: true, cleared: cacheKeys.length };
  } catch (error) {
    return { success: false };
  }
};