import { useState } from 'react';
import { View, FlatList, Image, TouchableOpacity, Modal, Text, Dimensions } from 'react-native';

import { styles } from '../styles/PhotoGallery.styles';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

export default function PhotoGallery({ photos }) {
  const [selectedPhoto, setSelectedPhoto] = useState(null);

  if (!photos || photos.length === 0) {
    return null;
  }

  const getPhotoUri = (item) => {
    if (typeof item === 'string') return item;
    return item.url || item.uri || null;
  };

  const getKey = (item, index) => {
    if (typeof item === 'string') return `photo_${index}`;
    return item.id || item.url || `photo_${index}`;
  };

  return (
    <>
      <FlatList
        data={photos}
        renderItem={({ item }) => {
          const uri = getPhotoUri(item);
          if (!uri) return null;
          return (
            <TouchableOpacity 
              onPress={() => setSelectedPhoto(uri)}
              activeOpacity={0.8}
            >
              <Image source={{ uri }} style={styles.photo} />
            </TouchableOpacity>
          );
        }}
        keyExtractor={(item, index) => getKey(item, index)}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.list}
      />

      <Modal
        visible={selectedPhoto !== null}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setSelectedPhoto(null)}
      >
        <TouchableOpacity 
          style={styles.fullscreenOverlay}
          activeOpacity={1}
          onPress={() => setSelectedPhoto(null)}
        >
          <TouchableOpacity 
            style={styles.closeButton}
            onPress={() => setSelectedPhoto(null)}
          >
            <Text style={styles.closeButtonText}>✕</Text>
          </TouchableOpacity>
          
          {selectedPhoto && (
            <Image 
              source={{ uri: selectedPhoto }} 
              style={[styles.fullscreenImage, { width: screenWidth, height: screenHeight * 0.7 }]}
              resizeMode="contain"
            />
          )}
        </TouchableOpacity>
      </Modal>
    </>
  );
}