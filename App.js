import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View } from 'react-native';
import MapView, { Marker } from 'react-native-maps';

export default function App() {
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
      <StatusBar style="auto" />
    </View>
  );
}

const nationalParks = [
  {
    id: 1,
    name: 'Great Smoky Mountains',
    latitude: 35.6131,
    longitude: -83.5532,
  },
  {
    id: 2,
    name: 'Shenandoah',
    latitude: 38.2928,
    longitude: -78.6796,
  },
  {
    id: 3,
    name: 'Congaree',
    latitude: 33.7948,
    longitude: -80.7821,
  },
  {
    id: 4,
    name: 'Mammoth Cave',
    latitude: 37.1862,
    longitude: -86.1000,
  },
];




const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    width: '100%',
    height: '100%',
  },
});