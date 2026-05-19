import { useState, useEffect } from 'react';
import { View, ActivityIndicator, Text } from 'react-native';
import MapView, { Marker } from 'react-native-maps';

import { styles } from '../styles/MapScreen.styles';
import { fetchNationalParks } from '../services/npsService';
import ParkBottomSheet from '../components/ParkBottomSheet';

export default function MapScreen() {
  const [parks, setParks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedPark, setSelectedPark] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    loadParks();
  }, []);

  const loadParks = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchNationalParks();
      setParks(data);
    } catch (err) {
      setError('Failed to load parks. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleMarkerPress = (park) => {
    setSelectedPark(park);
    setModalVisible(true);
  };

  const handleClose = () => {
    setModalVisible(false);
  };

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#1e3a5f" />
        <Text style={styles.loadingText}>Loading national parks...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        initialRegion={{
          latitude: 39.5,
          longitude: -98.35,
          latitudeDelta: 30,
          longitudeDelta: 50,
        }}
      >
        {parks.map((park) => (
          <Marker
            key={park.id}
            coordinate={{
              latitude: park.latitude,
              longitude: park.longitude,
            }}
            title={park.shortName}
            onPress={() => handleMarkerPress(park)}
          />
        ))}
      </MapView>

      <ParkBottomSheet
        visible={modalVisible}
        park={selectedPark}
        onClose={handleClose}
      />
    </View>
  );
}