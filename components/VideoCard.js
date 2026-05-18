import { Text, View, TouchableOpacity, Image } from 'react-native';

import { styles } from '../styles/VideoCard.styles';

export default function VideoCard({ video, onPress }) {
  return (
    <TouchableOpacity style={styles.container} onPress={onPress} activeOpacity={0.8}>
      <View style={[styles.thumbnail, video.isYours && styles.thumbnailYours]}>
        {video.isYours && (
          <View style={styles.yoursBadge}>
            <Text style={styles.yoursBadgeText}>YOUR CHANNEL</Text>
          </View>
        )}
        <View style={styles.playIconContainer}>
          <Text style={styles.playIcon}>▶</Text>
        </View>
      </View>
      <Text style={styles.title} numberOfLines={2}>{video.title}</Text>
      <Text style={styles.views}>{video.views} views</Text>
    </TouchableOpacity>
  );
}