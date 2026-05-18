import { useState } from 'react';
import { View } from 'react-native';
import MapView, { Marker } from 'react-native-maps';

import { styles } from '../styles/MapScreen.styles';
import { nationalParks } from '../data/nationalParks';
import ParkBottomSheet from '../components/ParkBottomSheet';

export default function MapScreen() {
  const [selectedPark, setSelectedPark] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  const handleMarkerPress = (park) => {
    setSelectedPark(park);
    setModalVisible(true);
  };

  const handleClose = () => {
    setModalVisible(false);
  };

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