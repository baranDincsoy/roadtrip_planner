import { View, FlatList, Image } from 'react-native';

import { styles } from '../styles/PhotoGallery.styles';

export default function PhotoGallery({ photos }) {
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
    <FlatList
      data={photos}
      renderItem={({ item }) => {
        const uri = getPhotoUri(item);
        if (!uri) return null;
        return <Image source={{ uri }} style={styles.photo} />;
      }}
      keyExtractor={(item, index) => getKey(item, index)}
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.list}
    />
  );
}