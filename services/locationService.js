import * as Location from 'expo-location';

let cachedLocation = null;
let cacheTimestamp = 0;
const CACHE_DURATION_MS = 5 * 60 * 1000;

export const requestLocationPermission = async () => {
  try {
    const { status } = await Location.requestForegroundPermissionsAsync();
    return status === 'granted';
  } catch (error) {
    console.error('Permission request error:', error);
    return false;
  }
};

export const getCurrentLocation = async () => {
  if (cachedLocation && (Date.now() - cacheTimestamp) < CACHE_DURATION_MS) {
    return cachedLocation;
  }
  
  try {
    const hasPermission = await requestLocationPermission();
    console.log('Location: Permission =', hasPermission);
    
    if (!hasPermission) {
      console.log('Location: Permission denied');
      return null;
    }
    
    console.log('Location: Calling getCurrentPositionAsync...');
    const location = await Location.getCurrentPositionAsync({
      accuracy: Location.Accuracy.Balanced,
    });
    
    
    const coords = {
      latitude: location.coords.latitude,
      longitude: location.coords.longitude,
    };
    
    cachedLocation = coords;
    cacheTimestamp = Date.now();
    
    return coords;
  } catch (error) {
    console.error('Error getting location:', error);
    return null;
  }
};

export const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 3958.8;
  
  const toRad = (deg) => (deg * Math.PI) / 180;
  
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  
  const a = 
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  
  return R * c;
};

export const formatDistance = (miles) => {
  if (miles == null) return null;
  
  if (miles < 0.1) {
    return 'Less than 0.1 mi';
  }
  
  if (miles < 10) {
    return `${miles.toFixed(1)} mi away`;
  }
  
  return `${Math.round(miles)} mi away`;
};