import { View, FlatList } from 'react-native';

import { styles } from '../styles/PhotoGallery.styles';

export default function PhotoGallery({ photos }) {
  return (
    <FlatList
      data={photos}
      renderItem={({ item }) => (
        <View style={[styles.photo, { backgroundColor: item.color }]} />
      )}
      keyExtractor={(item) => item.id}
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.list}
    />
  );
}