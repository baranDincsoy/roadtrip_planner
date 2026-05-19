import { View, FlatList, Image } from 'react-native';

import { styles } from '../styles/PhotoGallery.styles';

export default function PhotoGallery({ photos }) {
  if (!photos || photos.length === 0) {
    return null;
  }

  return (
    <FlatList
      data={photos}
      renderItem={({ item }) => (
        <Image source={{ uri: item.url }} style={styles.photo} />
      )}
      keyExtractor={(item) => item.id}
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.list}
    />
  );
}