import { Text, View, FlatList } from 'react-native';

import { styles } from '../styles/ReviewsSection.styles';

function ReviewCard({ review }) {
  const stars = '⭐'.repeat(review.rating);

  return (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <Text style={styles.author}>{review.author}</Text>
        <Text style={styles.date}>{review.date}</Text>
      </View>
      <Text style={styles.stars}>{stars}</Text>
      <Text style={styles.text}>{review.text}</Text>
    </View>
  );
}

export default function ReviewsSection({ reviews }) {
  return (
    <FlatList
      data={reviews}
      renderItem={({ item }) => <ReviewCard review={item} />}
      keyExtractor={(item) => item.id}
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.list}
    />
  );
}