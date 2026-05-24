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
      status: 'upcoming',
      addedAt: new Date().toISOString(),
      visitedAt: null,
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

export const toggleVisited = async (parkId) => {
  try {
    const saved = await getSavedParks();
    const newSaved = saved.map(park => {
      if (park.id !== parkId) return park;
      
      const isVisited = park.status === 'visited';
      return {
        ...park,
        status: isVisited ? 'upcoming' : 'visited',
        visitedAt: isVisited ? null : new Date().toISOString(),
      };
    });
    
    await AsyncStorage.setItem(TRIP_KEY, JSON.stringify(newSaved));
    return { success: true };
  } catch (error) {
    console.error('Error toggling visited:', error);
    return { success: false };
  }
};

export const reorderStops = async (fromIndex, toIndex) => {
  try {
    const saved = await getSavedParks();
    
    if (fromIndex < 0 || toIndex < 0 || 
        fromIndex >= saved.length || toIndex >= saved.length) {
      return { success: false, reason: 'invalid_index' };
    }
    
    const newSaved = [...saved];
    const [movedItem] = newSaved.splice(fromIndex, 1);
    newSaved.splice(toIndex, 0, movedItem);
    
    await AsyncStorage.setItem(TRIP_KEY, JSON.stringify(newSaved));
    return { success: true };
  } catch (error) {
    console.error('Error reordering:', error);
    return { success: false };
  }
};