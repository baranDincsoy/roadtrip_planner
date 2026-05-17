import { View } from 'react-native';
import MapView, { Marker } from 'react-native-maps';

import { styles } from '../styles/MapScreen.styles';
import { nationalParks } from '../data/nationalParks';

export default function MapScreen() {
  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        initialRegion={{
          latitude: 35.2271,
          longitude: -80.8431,
          latitudeDelta: 30,
          longitudeDelta: 30,
        }}
      >
        {nationalParks.map((park) => (
          <Marker
            key={park.id}
            coordinate={{
              latitude: park.latitude,
              longitude: park.longitude,
            }}
            title={park.name}
          />
        ))}
      </MapView>
    </View>
  );
}