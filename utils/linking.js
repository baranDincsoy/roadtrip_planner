import { Linking, Platform, Alert } from 'react-native';



export const openRoute = async (parks) => {
  if (!parks || parks.length === 0) {
    Alert.alert('Empty Trip', 'Add some parks to your trip first.');
    return;
  }

  const upcoming = parks.filter(p => p.status !== 'visited');

  if (upcoming.length === 0) {
    Alert.alert(
      'All Done!',
      'You have visited all parks in your trip. Add new ones or unmark some as visited.'
    );
    return;
  }

  if (upcoming.length === 1) {
    return openDirections(upcoming[0].latitude, upcoming[0].longitude, upcoming[0].name);
  }

  try {
const stops = upcoming
  .map(p => encodeURIComponent(p.name))
  .join('/');

const url = `https://www.google.com/maps/dir//${stops}`;

    const supported = await Linking.canOpenURL(url);
    
    if (supported) {
      await Linking.openURL(url);
    } else {
      Alert.alert('Error', 'Could not open Google Maps.');
    }
  } catch (error) {
    console.error('Error opening route:', error);
    Alert.alert('Error', 'Could not create route. Please try again.');
  }
};