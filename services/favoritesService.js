import AsyncStorage from '@react-native-async-storage/async-storage';

const FAVORITES_KEY = '@favorites';

export const getFavorites = async () => {
  try {
    const data = await AsyncStorage.getItem(FAVORITES_KEY);
    if (!data) return [];
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading favorites:', error);
    return [];
  }
};

export const isFavorite = async (parkId) => {
  try {
    const favorites = await getFavorites();
    return favorites.some(fav => fav.id === parkId);
  } catch (error) {
    return false;
  }
};

export const addFavorite = async (park) => {
  try {
    const favorites = await getFavorites();
    
    if (favorites.some(fav => fav.id === park.id)) {
      return { success: false, reason: 'already_exists' };
    }
    
    const favoriteData = {
      id: park.id,
      name: park.name,
      shortName: park.shortName || park.name,
      latitude: park.latitude,
      longitude: park.longitude,
      type: park.type || 'park',
      designation: park.designation || 'Park',
      pinColor: park.pinColor,
      states: park.states,
      categoryIcon: park.categoryIcon,
      addedAt: Date.now(),
    };
    
    const updated = [favoriteData, ...favorites];
    await AsyncStorage.setItem(FAVORITES_KEY, JSON.stringify(updated));
    
    return { success: true, favorite: favoriteData };
  } catch (error) {
    console.error('Error adding favorite:', error);
    return { success: false, reason: 'storage_error' };
  }
};

export const removeFavorite = async (parkId) => {
  try {
    const favorites = await getFavorites();
    const updated = favorites.filter(fav => fav.id !== parkId);
    await AsyncStorage.setItem(FAVORITES_KEY, JSON.stringify(updated));
    return { success: true };
  } catch (error) {
    console.error('Error removing favorite:', error);
    return { success: false };
  }
};

export const toggleFavorite = async (park) => {
  const isFav = await isFavorite(park.id);
  if (isFav) {
    await removeFavorite(park.id);
    return { isFavorite: false };
  } else {
    await addFavorite(park);
    return { isFavorite: true };
  }
};

export const clearAllFavorites = async () => {
  try {
    await AsyncStorage.removeItem(FAVORITES_KEY);
    return { success: true };
  } catch (error) {
    return { success: false };
  }
};