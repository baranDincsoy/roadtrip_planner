import AsyncStorage from '@react-native-async-storage/async-storage';

const TRIP_KEY = '@roadtrip_planner_saved_parks';

export const getSavedParks = async () => {
  try {
    const data = await AsyncStorage.getItem(TRIP_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Error reading saved parks:', error);
    return [];
  }
};

export const addToTrip = async (park) => {
  try {
    const saved = await getSavedParks();
    
    if (saved.some(p => p.id === park.id)) {
      return { success: false, reason: 'already_added' };
    }
    
    const newSaved = [...saved, { 
      id: park.id, 
      name: park.shortName,
      designation: park.designation,
      latitude: park.latitude,
      longitude: park.longitude,
      pinColor: park.pinColor,
      categoryIcon: park.categoryIcon,
      states: park.states,
      addedAt: new Date().toISOString(),
    }];
    
    await AsyncStorage.setItem(TRIP_KEY, JSON.stringify(newSaved));
    return { success: true };
  } catch (error) {
    console.error('Error adding to trip:', error);
    return { success: false, reason: 'error' };
  }
};

export const removeFromTrip = async (parkId) => {
  try {
    const saved = await getSavedParks();
    const newSaved = saved.filter(p => p.id !== parkId);
    await AsyncStorage.setItem(TRIP_KEY, JSON.stringify(newSaved));
    return { success: true };
  } catch (error) {
    console.error('Error removing from trip:', error);
    return { success: false };
  }
};

export const isInTrip = async (parkId) => {
  try {
    const saved = await getSavedParks();
    return saved.some(p => p.id === parkId);
  } catch (error) {
    return false;
  }
};

export const clearTrip = async () => {
  try {
    await AsyncStorage.removeItem(TRIP_KEY);
    return { success: true };
  } catch (error) {
    console.error('Error clearing trip:', error);
    return { success: false };
  }
};