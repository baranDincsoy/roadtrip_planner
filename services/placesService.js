import AsyncStorage from '@react-native-async-storage/async-storage';

const PLACES_API_KEY = process.env.EXPO_PUBLIC_GOOGLE_PLACES_API_KEY;
const PLACES_BASE_URL = 'https://maps.googleapis.com/maps/api/place';
const CACHE_PREFIX = '@places_enrich_';
const CACHE_TTL_DAYS = 30;

console.log('Places API Key loaded:', PLACES_API_KEY ? 'YES (length: ' + PLACES_API_KEY.length + ')' : 'NO - UNDEFINED');

const PREFERRED_TYPES = [
  'park',
  'tourist_attraction',
  'natural_feature',
  'campground',
  'rv_park',
  'museum',
  'art_gallery',
  'zoo',
  'aquarium',
  'amusement_park',
  'stadium',
  'landmark',
];

const getCacheKey = (lat, lng) => {
  const roundedLat = lat.toFixed(4);
  const roundedLng = lng.toFixed(4);
  return `${CACHE_PREFIX}${roundedLat}_${roundedLng}`;
};

const getCachedEnrichment = async (lat, lng) => {
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
    console.error('Cache read error:', error);
    return null;
  }
};

const setCachedEnrichment = async (lat, lng, data) => {
  try {
    const key = getCacheKey(lat, lng);
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

export const enrichLocation = async (latitude, longitude, osmName) => {
  const cached = await getCachedEnrichment(latitude, longitude);
  if (cached) {
    console.log(`Using cached enrichment for: ${osmName}`);
    return cached;
  }
  
  try {
    let bestMatch = null;
    
    if (osmName) {
      const query = encodeURIComponent(osmName);
      const findUrl = `${PLACES_BASE_URL}/findplacefromtext/json?input=${query}&inputtype=textquery&fields=place_id,name,types&locationbias=point:${latitude},${longitude}&key=${PLACES_API_KEY}`;
      
      const findResponse = await fetch(findUrl);
      const findData = await findResponse.json();
      
      console.log('Text search status:', findData.status);
      
      if (findData.status === 'OK' && findData.candidates?.length > 0) {
        const candidate = findData.candidates[0];
        const types = candidate.types || [];
        const hasPreferredType = types.some(t => PREFERRED_TYPES.includes(t));
        
        if (hasPreferredType) {
          bestMatch = candidate;
          console.log('Text search match:', candidate.name, '- types:', types.join(', '));
        }
      }
    }
    
    if (!bestMatch) {
      const searchUrl = `${PLACES_BASE_URL}/nearbysearch/json?location=${latitude},${longitude}&radius=500&key=${PLACES_API_KEY}`;
      
      const searchResponse = await fetch(searchUrl);
      
      if (!searchResponse.ok) {
        throw new Error(`Places API error: ${searchResponse.status}`);
      }
      
      const searchData = await searchResponse.json();
      
      console.log('Nearby search status:', searchData.status);
      console.log('Results count:', searchData.results?.length || 0);
      
      if (searchData.status !== 'OK' || !searchData.results || searchData.results.length === 0) {
        console.log(`No Google Places match for: ${osmName}`);
        return null;
      }
      
      const preferredResults = searchData.results.filter(result => {
        const types = result.types || [];
        return types.some(t => PREFERRED_TYPES.includes(t));
      });
      
      if (preferredResults.length === 0) {
        console.log(`No park/attraction found for: ${osmName} (only generic POIs)`);
        return null;
      }
      
      bestMatch = preferredResults[0];
      console.log('Nearby match:', bestMatch.name, '- types:', bestMatch.types.join(', '));
    }
    
    const placeId = bestMatch.place_id;
    
    const detailsUrl = `${PLACES_BASE_URL}/details/json?place_id=${placeId}&fields=name,rating,user_ratings_total,photos,opening_hours,formatted_address,types,reviews,website&key=${PLACES_API_KEY}`;
    
    const detailsResponse = await fetch(detailsUrl);
    const detailsData = await detailsResponse.json();
    
    if (detailsData.status !== 'OK' || !detailsData.result) {
      return null;
    }
    
    const place = detailsData.result;
    
    const photos = (place.photos || [])
      .slice(0, 5)
      .map(photo => buildPhotoUrl(photo.photo_reference, 400));
    
    const reviews = (place.reviews || [])
      .slice(0, 3)
      .map(review => ({
        author: review.author_name,
        rating: review.rating,
        text: review.text,
        time: review.relative_time_description,
      }));
    
    const enrichedData = {
      googleName: place.name,
      rating: place.rating || null,
      totalRatings: place.user_ratings_total || 0,
      photos,
      reviews,
      address: place.formatted_address || null,
      website: place.website || null,
      isOpen: place.opening_hours?.open_now ?? null,
      types: place.types || [],
    };
    
    await setCachedEnrichment(latitude, longitude, enrichedData);
    
    return enrichedData;
  } catch (error) {
    console.error('Error enriching location:', error);
    return null;
  }
};
export const clearEnrichmentCache = async () => {
  try {
    const keys = await AsyncStorage.getAllKeys();
    const cacheKeys = keys.filter(k => k.startsWith(CACHE_PREFIX));
    await AsyncStorage.multiRemove(cacheKeys);
    console.log('Cleared enrichment cache:', cacheKeys.length);
    return { success: true };
  } catch (error) {
    return { success: false };
  }
};