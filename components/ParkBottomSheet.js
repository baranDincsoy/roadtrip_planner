import { Modal, Text, View, TouchableOpacity, ScrollView } from 'react-native';

import { styles } from '../styles/ParkBottomSheet.styles';

export default function ParkBottomSheet({ visible, park, onClose }) {
  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.sheet}>
          <View style={styles.handle} />

          {park && (
            <ScrollView showsVerticalScrollIndicator={false}>
              <View style={styles.header}>
                <View style={styles.headerContent}>
                  <Text style={styles.parkName}>{park.name}</Text>
                  <Text style={styles.subtitle}>⭐ 4.6 · National Park</Text>
                </View>
                <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                  <Text style={styles.closeText}>✕</Text>
                </TouchableOpacity>
              </View>

              <View style={styles.buttonRow}>
                <TouchableOpacity style={styles.primaryButton}>
                  <Text style={styles.primaryButtonText}>🧭 Directions</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.secondaryButton}>
                  <Text style={styles.secondaryButtonText}>▶ Start</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.secondaryButton}>
                  <Text style={styles.secondaryButtonText}>＋ Add</Text>
                </TouchableOpacity>
              </View>

              <View style={styles.info}>
                <Text style={styles.infoTitle}>Coordinates</Text>
                <Text style={styles.infoText}>
                  Lat: {park.latitude.toFixed(4)}, Lng: {park.longitude.toFixed(4)}
                </Text>
              </View>
            </ScrollView>
          )}
        </View>
      </View>
    </Modal>
  );
}