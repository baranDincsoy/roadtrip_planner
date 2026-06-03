import AsyncStorage from '@react-native-async-storage/async-storage';

const WEATHER_API_KEY = process.env.EXPO_PUBLIC_OPENWEATHER_API_KEY;
const WEATHER_BASE_URL = 'https://api.openweathermap.org/data/2.5';
const CACHE_PREFIX = '@weather_';
const CACHE_TTL_HOURS = 3;

const getCacheKey = (lat, lng) => {
  const roundedLat = lat.toFixed(2);
  const roundedLng = lng.toFixed(2);
  return `${CACHE_PREFIX}${roundedLat}_${roundedLng}`;
};

const getCachedWeather = async (lat, lng) => {
  try {
    const key = getCacheKey(lat, lng);
    const cached = await AsyncStorage.getItem(key);
    
    if (!cached) return null;
    
    const parsed = JSON.parse(cached);
    const ageInHours = (Date.now() - parsed.timestamp) / (1000 * 60 * 60);
    
    if (ageInHours > CACHE_TTL_HOURS) {
      await AsyncStorage.removeItem(key);
      return null;
    }
    
    return parsed.data;
  } catch (error) {
    console.error('Weather cache read error:', error);
    return null;
  }
};

const setCachedWeather = async (lat, lng, data) => {
  try {
    const key = getCacheKey(lat, lng);
    await AsyncStorage.setItem(key, JSON.stringify({
      timestamp: Date.now(),
      data,
    }));
  } catch (error) {
    console.error('Weather cache write error:', error);
  }
};

const groupByDay = (forecastList) => {
  const days = {};
  
  forecastList.forEach(item => {
    const date = new Date(item.dt * 1000);
    const dayKey = date.toISOString().split('T')[0];
    
    if (!days[dayKey]) {
      days[dayKey] = {
        date: dayKey,
        dayName: date.toLocaleDateString('en-US', { weekday: 'short' }),
        temps: [],
        conditions: [],
        icons: [],
        items: [],
      };
    }
    
    days[dayKey].temps.push(item.main.temp);
    days[dayKey].conditions.push(item.weather[0].main);
    days[dayKey].icons.push(item.weather[0].icon);
    days[dayKey].items.push(item);
  });
  
  return Object.values(days).slice(0, 5).map(day => {
    const minTemp = Math.round(Math.min(...day.temps));
    const maxTemp = Math.round(Math.max(...day.temps));
    
    const conditionCounts = day.conditions.reduce((acc, c) => {
      acc[c] = (acc[c] || 0) + 1;
      return acc;
    }, {});
    
    const dominantCondition = Object.entries(conditionCounts)
      .sort((a, b) => b[1] - a[1])[0][0];
    
    const noonItem = day.items.find(item => {
      const hour = new Date(item.dt * 1000).getHours();
      return hour >= 11 && hour <= 14;
    }) || day.items[Math.floor(day.items.length / 2)];
    
    return {
      date: day.date,
      dayName: day.dayName,
      minTemp,
      maxTemp,
      condition: dominantCondition,
      icon: noonItem.weather[0].icon,
      description: noonItem.weather[0].description,
    };
  });
};

export const fetchWeatherForLocation = async (latitude, longitude) => {
  if (!WEATHER_API_KEY) {
    console.error('OpenWeather API key not set');
    return null;
  }
  
  const cached = await getCachedWeather(latitude, longitude);
  if (cached) {
    console.log(`Using cached weather for: ${latitude}, ${longitude}`);
    return cached;
  }
  
  try {
    const url = `${WEATHER_BASE_URL}/forecast?lat=${latitude}&lon=${longitude}&units=imperial&appid=${WEATHER_API_KEY}`;
    
    console.log('Fetching weather...');
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`Weather API error: ${response.status}`);
    }
    
    const data = await response.json();
    
    if (!data.list || data.list.length === 0) {
      console.log('No weather forecast available');
      return null;
    }
    
    const dailyForecast = groupByDay(data.list);
    
    const result = {
      city: data.city?.name || null,
      country: data.city?.country || null,
      forecast: dailyForecast,
    };
    
    console.log(`Fetched weather: ${dailyForecast.length} days`);
    await setCachedWeather(latitude, longitude, result);
    
    return result;
  } catch (error) {
    console.error('Error fetching weather:', error);
    return null;
  }
};

export const getWeatherIconUrl = (iconCode) => {
  return `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
};

export const clearWeatherCache = async () => {
  try {
    const keys = await AsyncStorage.getAllKeys();
    const cacheKeys = keys.filter(k => k.startsWith(CACHE_PREFIX));
    await AsyncStorage.multiRemove(cacheKeys);
    return { success: true, cleared: cacheKeys.length };
  } catch (error) {
    return { success: false };
  }
};