import { Modal, Text, View, TouchableOpacity, TouchableWithoutFeedback, ScrollView, FlatList } from 'react-native';

import { styles } from '../styles/ParkBottomSheet.styles';
import VideoCard from './VideoCard';
import PhotoGallery from './PhotoGallery';
import AboutSection from './AboutSection';
import ReviewsSection from './ReviewsSection';
import { openDirections } from '../utils/linking';

export default function ParkBottomSheet({ visible, park, onClose }) {
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
                      <TouchableOpacity style={styles.secondaryButton}>
                        <Text style={styles.secondaryButtonText}>＋ Add</Text>
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