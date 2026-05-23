import { Linking, Platform, Alert } from 'react-native';

export const openDirections = async (latitude, longitude, label) => {
  const encodedLabel = encodeURIComponent(label || 'Destination');
  
  const url = Platform.select({
    ios: `maps://?daddr=${latitude},${longitude}&q=${encodedLabel}`,
    android: `geo:0,0?q=${latitude},${longitude}(${encodedLabel})`,
  });

  const webFallback = `https://www.google.com/maps/dir/?api=1&destination=${latitude},${longitude}`;

  try {
    const supported = await Linking.canOpenURL(url);

    if (supported) {
      await Linking.openURL(url);
    } else {
      await Linking.openURL(webFallback);
    }
  } catch (error) {
    console.error('Error opening directions:', error);
    Alert.alert(
      'Error',
      'Could not open maps. Please try again.',
      [{ text: 'OK' }]
    );
  }
};