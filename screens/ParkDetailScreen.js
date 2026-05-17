import { Text, View } from 'react-native';

import { styles } from '../styles/ParkDetailScreen.styles';

export default function ParkDetailScreen({ route }) {
  const { park } = route.params;

  return (
    <View style={styles.container}>
      <Text style={styles.parkName}>{park.name}</Text>
      <Text style={styles.coordinates}>
        Latitude: {park.latitude.toFixed(4)}, Longitude: {park.longitude.toFixed(4)}
      </Text>
      <Text style={styles.description}>
        This is a placeholder description for {park.name}. We will fetch the real description from the NPS API in the next step.
      </Text>
    </View>
  );
}