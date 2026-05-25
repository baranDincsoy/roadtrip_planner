import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY = '@roadtrip_planner_data';

const getStorageData = async () => {
  try {
    const data = await AsyncStorage.getItem(STORAGE_KEY);
    if (data) {
      return JSON.parse(data);
    }
    return { trips: [], activeTripId: null };
  } catch (error) {
    console.error('Error reading storage:', error);
    return { trips: [], activeTripId: null };
  }
};

const saveStorageData = async (data) => {
  try {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    return { success: true };
  } catch (error) {
    console.error('Error saving storage:', error);
    return { success: false };
  }
};

const generateTripId = () => {
  return `trip_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`;
};

export const getAllTrips = async () => {
  const data = await getStorageData();
  return data.trips;
};

export const getActiveTrip = async () => {
  const data = await getStorageData();
  if (!data.activeTripId) return null;
  return data.trips.find(t => t.id === data.activeTripId) || null;
};

export const getTripById = async (tripId) => {
  const data = await getStorageData();
  return data.trips.find(t => t.id === tripId) || null;
};

export const createTrip = async (name) => {
  try {
    const data = await getStorageData();
    const newTrip = {
      id: generateTripId(),
      name: name || 'New Trip',
      createdAt: new Date().toISOString(),
      stops: [],
    };
    
    data.trips.push(newTrip);
    
    if (!data.activeTripId) {
      data.activeTripId = newTrip.id;
    }
    
    await saveStorageData(data);
    return { success: true, trip: newTrip };
  } catch (error) {
    console.error('Error creating trip:', error);
    return { success: false };
  }
};

export const renameTrip = async (tripId, newName) => {
  try {
    const data = await getStorageData();
    const trip = data.trips.find(t => t.id === tripId);
    if (!trip) return { success: false, reason: 'not_found' };
    
    trip.name = newName;
    await saveStorageData(data);
    return { success: true };
  } catch (error) {
    console.error('Error renaming trip:', error);
    return { success: false };
  }
};

export const deleteTrip = async (tripId) => {
  try {
    const data = await getStorageData();
    data.trips = data.trips.filter(t => t.id !== tripId);
    
    if (data.activeTripId === tripId) {
      data.activeTripId = data.trips.length > 0 ? data.trips[0].id : null;
    }
    
    await saveStorageData(data);
    return { success: true };
  } catch (error) {
    console.error('Error deleting trip:', error);
    return { success: false };
  }
};

export const setActiveTrip = async (tripId) => {
  try {
    const data = await getStorageData();
    const tripExists = data.trips.some(t => t.id === tripId);
    if (!tripExists) return { success: false, reason: 'not_found' };
    
    data.activeTripId = tripId;
    await saveStorageData(data);
    return { success: true };
  } catch (error) {
    console.error('Error setting active trip:', error);
    return { success: false };
  }
};

export const addStopToTrip = async (tripId, park) => {
  try {
    const data = await getStorageData();
    const trip = data.trips.find(t => t.id === tripId);
    if (!trip) return { success: false, reason: 'trip_not_found' };
    
    if (trip.stops.some(s => s.id === park.id)) {
      return { success: false, reason: 'already_added' };
    }
    
    const newStop = {
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
    };
    
    trip.stops.push(newStop);
    await saveStorageData(data);
    return { success: true, trip };
  } catch (error) {
    console.error('Error adding stop:', error);
    return { success: false, reason: 'error' };
  }
};

export const removeStopFromTrip = async (tripId, parkId) => {
  try {
    const data = await getStorageData();
    const trip = data.trips.find(t => t.id === tripId);
    if (!trip) return { success: false };
    
    trip.stops = trip.stops.filter(s => s.id !== parkId);
    await saveStorageData(data);
    return { success: true };
  } catch (error) {
    console.error('Error removing stop:', error);
    return { success: false };
  }
};

export const toggleStopVisited = async (tripId, parkId) => {
  try {
    const data = await getStorageData();
    const trip = data.trips.find(t => t.id === tripId);
    if (!trip) return { success: false };
    
    const stop = trip.stops.find(s => s.id === parkId);
    if (!stop) return { success: false };
    
    const isVisited = stop.status === 'visited';
    stop.status = isVisited ? 'upcoming' : 'visited';
    stop.visitedAt = isVisited ? null : new Date().toISOString();
    
    await saveStorageData(data);
    return { success: true };
  } catch (error) {
    console.error('Error toggling visited:', error);
    return { success: false };
  }
};

export const reorderStopsInTrip = async (tripId, fromIndex, toIndex) => {
  try {
    const data = await getStorageData();
    const trip = data.trips.find(t => t.id === tripId);
    if (!trip) return { success: false };
    
    if (fromIndex < 0 || toIndex < 0 || 
        fromIndex >= trip.stops.length || toIndex >= trip.stops.length) {
      return { success: false, reason: 'invalid_index' };
    }
    
    const [movedItem] = trip.stops.splice(fromIndex, 1);
    trip.stops.splice(toIndex, 0, movedItem);
    
    await saveStorageData(data);
    return { success: true };
  } catch (error) {
    console.error('Error reordering:', error);
    return { success: false };
  }
};

export const clearTrip = async (tripId) => {
  try {
    const data = await getStorageData();
    const trip = data.trips.find(t => t.id === tripId);
    if (!trip) return { success: false };
    
    trip.stops = [];
    await saveStorageData(data);
    return { success: true };
  } catch (error) {
    console.error('Error clearing trip:', error);
    return { success: false };
  }
};

export const isParkInAnyTrip = async (parkId) => {
  const data = await getStorageData();
  for (const trip of data.trips) {
    if (trip.stops.some(s => s.id === parkId)) {
      return { inTrip: true, tripId: trip.id, tripName: trip.name };
    }
  }
  return { inTrip: false };
};