import { useState, useEffect, useRef } from 'react';
import { View, ActivityIndicator, Text, TouchableOpacity, Modal, TouchableWithoutFeedback, FlatList } from 'react-native';
import MapView, { Marker } from 'react-native-maps';

import { styles } from '../styles/MapScreen.styles';
import { fetchNationalParks, getAvailableCategories } from '../services/npsService';
import { fetchTrailsForState, getUSStates } from '../services/osmService';
import ParkBottomSheet from '../components/ParkBottomSheet';
import FilterDrawer from '../components/DrawerContent';
import SearchBar from '../components/SearchBar';

export default function MapScreen({ navigation }) {
  const [parks, setParks] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedPark, setSelectedPark] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [filterVisible, setFilterVisible] = useState(false);
  const [zoomLevel, setZoomLevel] = useState('wide');
  
  const [trails, setTrails] = useState([]);
  const [selectedState, setSelectedState] = useState(null);
  const [loadingTrails, setLoadingTrails] = useState(false);
  const [stateSelectorVisible, setStateSelectorVisible] = useState(false);

  const mapRef = useRef(null);

  useEffect(() => {
    loadParks();
  }, []);

  useEffect(() => {
  if (categories.length > 0) {
    const updatedCategories = categories.map(cat => 
      cat.name === 'Trail' 
        ? { ...cat, count: trails.length }
        : cat
    );
    
    if (JSON.stringify(updatedCategories) !== JSON.stringify(categories)) {
      setCategories(updatedCategories);
    }
  }
}, [trails]);


  const loadParks = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchNationalParks();
      setParks(data);
      const cats = getAvailableCategories(data);
      
      const trailCategory = {
        name: 'Trail',
        icon: '🥾',
        color: '#2e7d32',
        count: 0,
      };
      
      setCategories([...cats, trailCategory]);
      setSelectedCategories([...cats.map(c => c.name), 'Trail']);
    } catch (err) {
      setError('Failed to load parks. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const loadTrails = async (stateCode) => {
    if (!stateCode) {
      setTrails([]);
      return;
    }
    
    setLoadingTrails(true);
    try {
      const data = await fetchTrailsForState(stateCode);
      setTrails(data);
    } catch (err) {
      console.error('Failed to load trails:', err);
      setTrails([]);
    } finally {
      setLoadingTrails(false);
    }
  };

  const handleSelectState = (stateCode) => {
    setSelectedState(stateCode);
    setStateSelectorVisible(false);
    loadTrails(stateCode);
  };

  const handleClearTrails = () => {
    setSelectedState(null);
    setTrails([]);
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

  const handleRegionChange = (region) => {
    if (region.latitudeDelta > 20) {
      setZoomLevel('wide');
    } else if (region.latitudeDelta > 5) {
      setZoomLevel('medium');
    } else {
      setZoomLevel('close');
    }
  };

  const filteredParks = parks.filter(park => {
    if (!selectedCategories.includes(park.designation)) {
      return false;
    }

    if (zoomLevel === 'wide') {
      return park.designation === 'National Park' || park.designation === 'National Historical Park';
    }

    if (zoomLevel === 'medium') {
      const importantCategories = [
        'National Park',
        'National Historical Park',
        'National Monument',
        'National Seashore',
        'National Recreation Area',
        'National Preserve',
      ];
      return importantCategories.includes(park.designation);
    }

    return true;
  });

  const showTrails = selectedCategories.includes('Trail');
  const filteredTrails = showTrails ? trails : [];

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
        onRegionChangeComplete={handleRegionChange}
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
        
        {filteredTrails.map((trail) => (
          <Marker
            key={trail.id}
            coordinate={{
              latitude: trail.latitude,
              longitude: trail.longitude,
            }}
            title={trail.name}
            pinColor={trail.pinColor}
            onPress={() => handleMarkerPress(trail)}
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
          {filteredParks.length + filteredTrails.length} location{(filteredParks.length + filteredTrails.length) !== 1 ? 's' : ''}
          {zoomLevel === 'wide' && filteredParks.length > 0 && ' (zoom in for more)'}
        </Text>
      </View>

      <TouchableOpacity
        style={styles.stateButton}
        onPress={() => setStateSelectorVisible(true)}
        activeOpacity={0.8}
      >
        <Text style={styles.stateIcon}>📍</Text>
        <Text style={styles.stateText}>
          {loadingTrails 
            ? 'Loading...' 
            : selectedState 
              ? `Trails: ${selectedState}` 
              : 'Add Trails'}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.tripButton}
        onPress={() => navigation.navigate('TripList')}
        activeOpacity={0.8}
      >
        <Text style={styles.tripIcon}>🗺️</Text>
      </TouchableOpacity>

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

      <Modal
        visible={stateSelectorVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setStateSelectorVisible(false)}
      >
        <TouchableWithoutFeedback onPress={() => setStateSelectorVisible(false)}>
          <View style={styles.stateModalOverlay}>
            <TouchableWithoutFeedback>
              <View style={styles.stateModalContent}>
                <View style={styles.stateModalHeader}>
                  <Text style={styles.stateModalTitle}>Select a State</Text>
                  <Text style={styles.stateModalSubtitle}>
                    Load hiking trails from OpenStreetMap
                  </Text>
                </View>
                
                {selectedState && (
                  <TouchableOpacity 
                    style={styles.clearTrailsButton}
                    onPress={() => {
                      handleClearTrails();
                      setStateSelectorVisible(false);
                    }}
                  >
                    <Text style={styles.clearTrailsText}>✕ Clear Trails</Text>
                  </TouchableOpacity>
                )}
                
                <FlatList
                  data={getUSStates()}
                  keyExtractor={(item) => item.code}
                  renderItem={({ item }) => (
                    <TouchableOpacity 
                      style={[
                        styles.stateItem,
                        selectedState === item.code && styles.stateItemActive
                      ]}
                      onPress={() => handleSelectState(item.code)}
                    >
                      <Text style={styles.stateItemCode}>{item.code}</Text>
                      <Text style={styles.stateItemName}>{item.name}</Text>
                      {selectedState === item.code && (
                        <Text style={styles.stateItemCheck}>✓</Text>
                      )}
                    </TouchableOpacity>
                  )}
                />
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </View>
  );
}