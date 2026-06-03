import { useState, useEffect } from 'react';
import { Modal, Text, View, TouchableOpacity, TouchableWithoutFeedback, ScrollView, FlatList, Alert, Linking, Image } from 'react-native';

import { styles } from '../styles/ParkBottomSheet.styles';
import VideoCard from './VideoCard';
import PhotoGallery from './PhotoGallery';
import AboutSection from './AboutSection';
import ReviewsSection from './ReviewsSection';
import TripSelectorModal from './TripSelectorModal';
import { isParkInAnyTrip } from '../services/tripService';
import { fetchVideosForPark } from '../services/youtubeService';
import { openDirections } from '../utils/linking';
import { enrichLocation } from '../services/placesService';
import { getCurrentLocation, calculateDistance, formatDistance } from '../services/locationService';
import { isFavorite, toggleFavorite } from '../services/favoritesService';
import { fetchWeatherForLocation, getWeatherIconUrl } from '../services/weatherService';

export default function ParkBottomSheet({ visible, park, onClose }) {
  const [tripInfo, setTripInfo] = useState({ inTrip: false });
  const [selectorVisible, setSelectorVisible] = useState(false);
  const [videos, setVideos] = useState([]);
  const [loadingVideos, setLoadingVideos] = useState(false);
  const [enrichment, setEnrichment] = useState(null);
  const [loadingEnrichment, setLoadingEnrichment] = useState(false);
  const [distance, setDistance] = useState(null);

  const isTrail = park?.type === 'trail';

  const [isFav, setIsFav] = useState(false);

  const [weather, setWeather] = useState(null);
  const [loadingWeather, setLoadingWeather] = useState(false);


useEffect(() => {
  if (park && visible) {
    checkTripStatus();
    loadVideos();
    loadEnrichment();
    loadDistance();
    checkFavoriteStatus();
    loadWeather();
  }
}, [park, visible]);

useEffect(() => {
  if (!visible) {
    setEnrichment(null);
    setDistance(null);
    setWeather(null);
  }
}, [visible]);

  const checkTripStatus = async () => {
    if (!park) return;
    const info = await isParkInAnyTrip(park.id);
    setTripInfo(info);
  };

  const loadVideos = async () => {
    if (!park) return;
    setLoadingVideos(true);
    const fetchedVideos = await fetchVideosForPark(
      park.shortName || park.name,
      {
        type: park.type === 'trail' ? 'trail' : 'park',
        state: park.states,
      }
    );
    setVideos(fetchedVideos);
    setLoadingVideos(false);
  };

  const loadEnrichment = async () => {
    if (!park) return;
    
    if (isTrail) {
      console.log('Skipping enrichment for trail (OSM name is sufficient)');
      setEnrichment(null);
      return;
    }
    
    setLoadingEnrichment(true);
    try {
      const data = await enrichLocation(
        park.latitude, 
        park.longitude, 
        park.shortName || park.name
      );
      setEnrichment(data);
    } catch (error) {
      console.error('Failed to enrich:', error);
      setEnrichment(null);
    } finally {
      setLoadingEnrichment(false);
    }
  };

const loadDistance = async () => {
  if (!park) return;
  
  const userLocation = await getCurrentLocation();
  if (!userLocation) {
    setDistance(null);
    return;
  }
  
  const miles = calculateDistance(
    userLocation.latitude,
    userLocation.longitude,
    park.latitude,
    park.longitude
  );
  
  setDistance(miles);
};

const loadWeather = async () => {
  if (!park) return;
  
  setLoadingWeather(true);
  try {
    const data = await fetchWeatherForLocation(park.latitude, park.longitude);
    setWeather(data);
  } catch (error) {
    console.error('Failed to load weather:', error);
    setWeather(null);
  } finally {
    setLoadingWeather(false);
  }
};

const checkFavoriteStatus = async () => {
  if (!park) return;
  const status = await isFavorite(park.id);
  setIsFav(status);
};

const handleFavoritePress = async () => {
  if (!park) return;
  const result = await toggleFavorite(park);
  setIsFav(result.isFavorite);
};

  const handleAddPress = () => {
    setSelectorVisible(true);
  };

  const handleAddSuccess = ({ trip, action }) => {
    Alert.alert(
      action === 'created' ? 'Trip Created!' : 'Added!',
      `${park.shortName || park.name} added to "${trip.name}".`
    );
    checkTripStatus();
  };

  const handleDirections = () => {
    if (park) {
      openDirections(park.latitude, park.longitude, park.shortName || park.name);
    }
  };

  const handleStart = () => {
    if (!park) return;
    const url = `https://www.google.com/maps/dir/?api=1&destination=${park.latitude},${park.longitude}&travelmode=driving&dir_action=navigate`;
    Linking.openURL(url).catch(err => {
      console.error('Could not start navigation:', err);
      Alert.alert('Error', 'Could not start navigation.');
    });
  };

  const handleVideoPress = async (video) => {
    const url = `https://www.youtube.com/watch?v=${video.id}`;
    try {
      await Linking.openURL(url);
    } catch (error) {
      console.error('Could not open YouTube:', error);
    }
  };

  const handleWebsitePress = async (url) => {
    if (!url) return;
    try {
      await Linking.openURL(url);
    } catch (error) {
      console.error('Could not open website:', error);
      Alert.alert('Error', 'Could not open the website.');
    }
  };

  const renderVideosSection = () => {
    if (loadingVideos) {
      return (
        <View style={styles.videoStatusContainer}>
          <Text style={styles.videoStatusText}>Loading videos...</Text>
        </View>
      );
    }
    
    if (videos.length === 0) {
      return (
        <View style={styles.videoStatusContainer}>
          <Text style={styles.videoStatusText}>No videos available</Text>
        </View>
      );
    }
    
    return (
      <FlatList
        data={videos}
        renderItem={({ item }) => (
          <VideoCard video={item} onPress={() => handleVideoPress(item)} />
        )}
        keyExtractor={(item) => item.id}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.videoList}
      />
    );
  };

  const renderWeatherSection = () => {
  if (loadingWeather) {
    return (
      <View style={styles.videoStatusContainer}>
        <Text style={styles.videoStatusText}>Loading weather...</Text>
      </View>
    );
  }
  
  if (!weather || !weather.forecast || weather.forecast.length === 0) {
    return (
      <View style={styles.videoStatusContainer}>
        <Text style={styles.videoStatusText}>Weather unavailable</Text>
      </View>
    );
  }
  
  return (
    <View style={styles.weatherContainer}>
      <FlatList
        data={weather.forecast}
        renderItem={({ item, index }) => (
          <View style={styles.weatherCard}>
            <Text style={styles.weatherDay}>
              {index === 0 ? 'Today' : item.dayName}
            </Text>
            <Image 
              source={{ uri: getWeatherIconUrl(item.icon) }}
              style={styles.weatherIcon}
            />
            <Text style={styles.weatherTemp}>{item.maxTemp}°</Text>
            <Text style={styles.weatherTempMin}>{item.minTemp}°</Text>
            <Text style={styles.weatherCondition} numberOfLines={1}>
              {item.condition}
            </Text>
          </View>
        )}
        keyExtractor={(item) => item.date}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.weatherList}
      />
    </View>
  );
};

  const renderParkContent = () => (
    <>
      {(enrichment?.address || enrichment?.isOpen !== null || enrichment?.website) && (
        <View style={styles.infoCard}>
          {enrichment?.address && (
            <View style={styles.infoRow}>
              <Text style={styles.infoIcon}>📍</Text>
              <Text style={styles.infoText} numberOfLines={2}>{enrichment.address}</Text>
            </View>
          )}
          
          {enrichment?.isOpen !== null && enrichment?.isOpen !== undefined && (
            <View style={styles.infoRow}>
              <Text style={styles.infoIcon}>🕐</Text>
              <Text style={[styles.infoText, enrichment.isOpen ? styles.openText : styles.closedText]}>
                {enrichment.isOpen ? 'Open now' : 'Closed'}
              </Text>
            </View>
          )}
          
          {enrichment?.website && (
            <TouchableOpacity 
              style={styles.infoRow}
              onPress={() => handleWebsitePress(enrichment.website)}
              activeOpacity={0.7}
            >
              <Text style={styles.infoIcon}>🌐</Text>
              <Text style={[styles.infoText, styles.websiteText]} numberOfLines={1}>
                Visit website
              </Text>
            </TouchableOpacity>
          )}
        </View>
      )}

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>🎥 Shorts</Text>
        {renderVideosSection()}
      </View>

      <View style={styles.section}>
      <Text style={styles.sectionTitle}>🌤️ 5-Day Forecast</Text>
      {renderWeatherSection()}
      </View>

      {(enrichment?.photos?.length > 0 || park.photos?.length > 0) && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>📸 Photos</Text>
          <PhotoGallery photos={enrichment?.photos || park.photos} />
        </View>
      )}

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>📝 About</Text>
        <AboutSection description={park.description} />
      </View>

      {enrichment?.reviews?.length > 0 ? (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>⭐ Reviews</Text>
          <View style={styles.reviewsContainer}>
            {enrichment.reviews.map((review, index) => (
              <View key={`review_${index}`} style={styles.reviewCard}>
                <View style={styles.reviewHeader}>
                  <Text style={styles.reviewAuthor}>{review.author}</Text>
                  <View style={styles.reviewMeta}>
                    <Text style={styles.reviewStars}>{'⭐'.repeat(review.rating)}</Text>
                    <Text style={styles.reviewTime}>{review.time}</Text>
                  </View>
                </View>
                <Text style={styles.reviewText} numberOfLines={6}>
                  {review.text}
                </Text>
              </View>
            ))}
          </View>
        </View>
      ) : (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>⭐ Reviews & Tips</Text>
          <ReviewsSection reviews={park.reviews} />
        </View>
      )}
    </>
  );

  const renderTrailContent = () => (
    <>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>🥾 Trail Info</Text>
        <View style={styles.trailInfoCard}>
          <View style={styles.trailInfoRow}>
            <Text style={styles.trailInfoLabel}>Type</Text>
            <Text style={styles.trailInfoValue}>
              {park.highway === 'path' && 'Footpath'}
              {park.highway === 'footway' && 'Pedestrian Path'}
              {park.highway === 'track' && 'Track / Forest Road'}
              {!['path', 'footway', 'track'].includes(park.highway) && 'Trail'}
            </Text>
          </View>
          
          <View style={styles.trailInfoRow}>
            <Text style={styles.trailInfoLabel}>Surface</Text>
            <Text style={styles.trailInfoValue}>
              {park.surface ? park.surface.charAt(0).toUpperCase() + park.surface.slice(1) : 'Unknown'}
            </Text>
          </View>
          
          {park.difficulty && (
            <View style={styles.trailInfoRow}>
              <Text style={styles.trailInfoLabel}>Difficulty</Text>
              <Text style={styles.trailInfoValue}>{park.difficulty}</Text>
            </View>
          )}
          
          <View style={styles.trailInfoRow}>
            <Text style={styles.trailInfoLabel}>Bicycle</Text>
            <Text style={[styles.trailInfoValue, park.bicycle ? styles.trailYes : styles.trailUnknown]}>
              {park.bicycle ? '✓ Allowed' : '? Unknown'}
            </Text>
          </View>
          
          <View style={styles.trailInfoRow}>
            <Text style={styles.trailInfoLabel}>Wheelchair</Text>
            <Text style={[styles.trailInfoValue, park.wheelchair ? styles.trailYes : styles.trailUnknown]}>
              {park.wheelchair ? '✓ Accessible' : '? Unknown'}
            </Text>
          </View>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>🎥 Related Videos</Text>
        {renderVideosSection()}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>🌤️ 5-Day Forecast</Text>
        {renderWeatherSection()}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>📍 Source</Text>
        <Text style={styles.trailDescription}>
          Data from OpenStreetMap contributors · © OSM
        </Text>
      </View>
    </>
  );

  return (
    <>
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
                    <View style={styles.stickyHeader}>
                      <View style={styles.headerContent}>
                        <Text style={styles.parkName}>
                          {enrichment?.googleName || park.name}
                        </Text>
                        <Text style={styles.subtitle}>
                          {enrichment?.rating 
                            ? `⭐ ${enrichment.rating} (${enrichment.totalRatings.toLocaleString()} reviews)`
                            : isTrail 
                              ? `🥾 Trail · ${park.states}` 
                              : `⭐ ${park.designation || 'National Park'}`}
                        </Text>
                        {distance !== null && (
                          <Text style={styles.distanceText}>📍 {formatDistance(distance)}</Text>
                        )}
                        {enrichment?.googleName && enrichment.googleName !== park.name && (
                          <Text style={styles.alternateName}>OSM: {park.name}</Text>
                        )}
                      </View>
                      <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                        <Text style={styles.closeText}>✕</Text>
                      </TouchableOpacity>
                    </View>

                    <ScrollView
                      showsVerticalScrollIndicator={false}
                      contentContainerStyle={styles.scrollContent}
                    >
                      <View style={styles.buttonRow}>
                        <TouchableOpacity style={styles.primaryButton} onPress={handleDirections}>
                          <Text style={styles.primaryButtonText}>🧭 Directions</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.secondaryButton} onPress={handleStart}>
                          <Text style={styles.secondaryButtonText}>▶ Start</Text>
                        </TouchableOpacity>
                        <TouchableOpacity 
                          style={[styles.secondaryButton, tripInfo.inTrip && styles.addedButton]} 
                          onPress={handleAddPress}
                        >
                          <Text style={[styles.secondaryButtonText, tripInfo.inTrip && styles.addedButtonText]}>
                            {tripInfo.inTrip ? '✓ In Trip' : '＋ Add'}
                          </Text>
                        </TouchableOpacity>
                      </View>

                      <TouchableOpacity 
                        style={[styles.favoriteButton, isFav && styles.favoriteButtonActive]} 
                         onPress={handleFavoritePress}
                          >
                          <Text style={[styles.favoriteButtonText, isFav && styles.favoriteButtonTextActive]}>
                          {isFav ? '❤️ Saved' : '🤍 Save to Favorites'}
                          </Text>
                        </TouchableOpacity>

                      {tripInfo.inTrip && (
                        <View style={styles.tripBadge}>
                          <Text style={styles.tripBadgeText}>
                            In: <Text style={styles.tripBadgeName}>{tripInfo.tripName}</Text>
                          </Text>
                        </View>
                      )}

                      {isTrail ? renderTrailContent() : renderParkContent()}

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

      <TripSelectorModal
        visible={selectorVisible}
        park={park}
        onClose={() => setSelectorVisible(false)}
        onSuccess={handleAddSuccess}
      />
    </>
  );
}