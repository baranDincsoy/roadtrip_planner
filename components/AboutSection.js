import { Text, View } from 'react-native';

import { styles } from '../styles/AboutSection.styles';

export default function AboutSection({ description }) {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>{description}</Text>
    </View>
  );
}