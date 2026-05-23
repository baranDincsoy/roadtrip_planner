import { useState, useEffect, useRef } from 'react';
import { View, ActivityIndicator, Text, TouchableOpacity } from 'react-native';
import MapView, { Marker } from 'react-native-maps';

import { styles } from '../styles/MapScreen.styles';
import { fetchNationalParks, getAvailableCategories } from '../services/npsService';
import ParkBottomSheet from '../components/ParkBottomSheet';
import FilterDrawer from '../components/DrawerContent';
import SearchBar from '../components/SearchBar';

export default function MapScreen() {
  const [parks, setParks] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedPark, setSelectedPark] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [filterVisible, setFilterVisible] = useState(false);

  const mapRef = useRef(null);

  useEffect(() => {
    loadParks();
  }, []);

  const loadParks = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchNationalParks();
      setParks(data);
      const cats = getAvailableCategories(data);
      setCategories(cats);
      setSelectedCategories(cats.map(c => c.name));
    } catch (err) {
      setError('Failed to load parks. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleCategory = (categoryName) => {
    setSelectedCategories(prev => {
      if (prev.includes(categoryName)) {
        return prev.filter(c => c !== categoryName);
      } else {
        return [...prev, categoryName];
      }
    });
  };

  const handleSelectAll = () => {
    setSelectedCategories(categories.map(c => c.name));
  };

  const handleClearAll = () => {
    setSelectedCategories([]);
  };

  const handleMarkerPress = (park) => {
    setSelectedPark(park);
    setModalVisible(true);
  };

  const handleSelectResult = (park) => {
    setSelectedPark(park);
    setModalVisible(true);

    mapRef.current?.animateToRegion({
      latitude: park.latitude,
      longitude: park.longitude,
      latitudeDelta: 2,
      longitudeDelta: 2,
    }, 1000);
  };

  const filteredParks = parks.filter(park =>
    selectedCategories.includes(park.designation)
  );

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#1e3a5f" />
        <Text style={styles.loadingText}>Loading parks...</Text>
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
        ref={mapRef}
        style={styles.map}
        initialRegion={{
          latitude: 39.5,
          longitude: -98.35,
          latitudeDelta: 30,
          longitudeDelta: 50,
        }}
      >
        {filteredParks.map((park) => (
          <Marker
            key={park.id}
            coordinate={{
              latitude: park.latitude,
              longitude: park.longitude,
            }}
            title={park.shortName}
            pinColor={park.pinColor}
            onPress={() => handleMarkerPress(park)}
          />
        ))}
      </MapView>

      <TouchableOpacity
        style={styles.menuButton}
        onPress={() => setFilterVisible(true)}
        activeOpacity={0.8}
      >
        <Text style={styles.menuIcon}>☰</Text>
      </TouchableOpacity>

      <SearchBar
        parks={parks}
        onSelectResult={handleSelectResult}
      />

      <View style={styles.countBadge}>
        <Text style={styles.countText}>
          {filteredParks.length} location{filteredParks.length !== 1 ? 's' : ''}
        </Text>
      </View>

      <ParkBottomSheet
        visible={modalVisible}
        park={selectedPark}
        onClose={() => setModalVisible(false)}
      />

      <FilterDrawer
        visible={filterVisible}
        categories={categories}
        selectedCategories={selectedCategories}
        onToggleCategory={handleToggleCategory}
        onSelectAll={handleSelectAll}
        onClearAll={handleClearAll}
        onClose={() => setFilterVisible(false)}
      />
    </View>
  );
}