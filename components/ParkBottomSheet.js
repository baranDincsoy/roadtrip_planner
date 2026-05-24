import { Modal, Text, View, TouchableOpacity, TouchableWithoutFeedback, ScrollView, FlatList } from 'react-native';

import { styles } from '../styles/ParkBottomSheet.styles';
import VideoCard from './VideoCard';
import PhotoGallery from './PhotoGallery';
import AboutSection from './AboutSection';
import ReviewsSection from './ReviewsSection';
import { openDirections } from '../utils/linking';

import { useState, useEffect } from 'react';
import { Alert } from 'react-native';
import { addToTrip, isInTrip, removeFromTrip } from '../services/tripService';

export default function ParkBottomSheet({ visible, park, onClose }) {

    const [inTrip, setInTrip] = useState(false);

  useEffect(() => {
    if (park && visible) {
      checkIfInTrip();
    }
  }, [park, visible]);

  const checkIfInTrip = async () => {
    if (!park) return;
    const result = await isInTrip(park.id);
    setInTrip(result);
  };

  const handleAddToTrip = async () => {
    if (!park) return;

    if (inTrip) {
      await removeFromTrip(park.id);
      setInTrip(false);
      Alert.alert('Removed', `${park.shortName} removed from your trip.`);
    } else {
      const result = await addToTrip(park);
      if (result.success) {
        setInTrip(true);
        Alert.alert('Added!', `${park.shortName} added to your trip.`);
      } else if (result.reason === 'already_added') {
        Alert.alert('Already added', 'This park is already in your trip.');
      }
    }
  };

  const handleVideoPress = (video) => {
    console.log('Video pressed:', video.title);
  };

  const handleDirections = () => {
  if (park) {
    openDirections(park.latitude, park.longitude, park.shortName);
  }
};

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.overlay}>
          <TouchableWithoutFeedback>
            <View style={styles.sheet}>
              <View style={styles.handle} />

              {park && (
                <>
                  {/* STICKY HEADER */}
                  <View style={styles.stickyHeader}>
                    <View style={styles.headerContent}>
                      <Text style={styles.parkName}>{park.name}</Text>
                      <Text style={styles.subtitle}>⭐ 4.6 · National Park</Text>
                    </View>
                    <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                      <Text style={styles.closeText}>✕</Text>
                    </TouchableOpacity>
                  </View>

                  {/* SCROLLABLE CONTENT */}
                  <ScrollView
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={styles.scrollContent}
                  >
                    <View style={styles.buttonRow}>
<TouchableOpacity style={styles.primaryButton} onPress={handleDirections}>
  <Text style={styles.primaryButtonText}>🧭 Directions</Text>
</TouchableOpacity>
                      <TouchableOpacity style={styles.secondaryButton}>
                        <Text style={styles.secondaryButtonText}>▶ Start</Text>
                      </TouchableOpacity>
<TouchableOpacity 
  style={[styles.secondaryButton, inTrip && styles.addedButton]} 
  onPress={handleAddToTrip}
>
  <Text style={[styles.secondaryButtonText, inTrip && styles.addedButtonText]}>
    {inTrip ? '✓ Added' : '＋ Add'}
  </Text>
</TouchableOpacity>
                    </View>

                    <View style={styles.section}>
                      <Text style={styles.sectionTitle}>🎥 Shorts</Text>
                      <FlatList
                        data={park.videos}
                        renderItem={({ item }) => (
                          <VideoCard video={item} onPress={() => handleVideoPress(item)} />
                        )}
                        keyExtractor={(item) => item.id}
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        contentContainerStyle={styles.videoList}
                      />
                    </View>

                    <View style={styles.section}>
                      <Text style={styles.sectionTitle}>📸 Photos</Text>
                      <PhotoGallery photos={park.photos} />
                    </View>

                    <View style={styles.section}>
                      <Text style={styles.sectionTitle}>📝 About</Text>
                      <AboutSection description={park.description} />
                    </View>

                    <View style={styles.section}>
                      <Text style={styles.sectionTitle}>⭐ Reviews & Tips</Text>
                      <ReviewsSection reviews={park.reviews} />
                    </View>

                    <View style={styles.info}>
                      <Text style={styles.infoTitle}>Coordinates</Text>
                      <Text style={styles.infoText}>
                        Lat: {park.latitude.toFixed(4)}, Lng: {park.longitude.toFixed(4)}
                      </Text>
                    </View>
                  </ScrollView>
                </>
              )}
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
}