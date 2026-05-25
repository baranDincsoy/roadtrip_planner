import { useState, useEffect } from 'react';
import { Modal, View, Text, TouchableOpacity, FlatList, TextInput, KeyboardAvoidingView, Platform, Alert } from 'react-native';

import { styles } from '../styles/TripSelectorModal.styles';
import { getAllTrips, createTrip, addStopToTrip } from '../services/tripService';

export default function TripSelectorModal({ visible, park, onClose, onSuccess }) {
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [newTripName, setNewTripName] = useState('');

  useEffect(() => {
    if (visible) {
      loadTrips();
      setCreating(false);
      setNewTripName('');
    }
  }, [visible]);

  const loadTrips = async () => {
    setLoading(true);
    const data = await getAllTrips();
    setTrips(data);
    setLoading(false);
  };

  const handleSelectTrip = async (trip) => {
    if (!park) return;
    
    const result = await addStopToTrip(trip.id, park);
    
    if (result.success) {
      onSuccess({ trip, action: 'added' });
      onClose();
    } else if (result.reason === 'already_added') {
      Alert.alert(
        'Already in trip',
        `${park.shortName} is already in "${trip.name}".`,
        [{ text: 'OK' }]
      );
    } else {
      Alert.alert('Error', 'Could not add to trip. Please try again.');
    }
  };

  const handleCreateAndAdd = async () => {
    const name = newTripName.trim() || 'New Trip';
    
    const createResult = await createTrip(name);
    if (!createResult.success) {
      Alert.alert('Error', 'Could not create trip.');
      return;
    }
    
    const addResult = await addStopToTrip(createResult.trip.id, park);
    if (addResult.success) {
      onSuccess({ trip: createResult.trip, action: 'created' });
      onClose();
    } else {
      Alert.alert('Error', 'Trip created but could not add park.');
    }
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.overlay}
      >
        <View style={styles.sheet}>
          <View style={styles.handle} />

          <View style={styles.header}>
            <Text style={styles.title}>
              {creating ? 'Create New Trip' : 'Add to Trip'}
            </Text>
            <Text style={styles.subtitle}>
              {creating 
                ? `${park?.shortName || 'This park'} will be added`
                : `Choose a trip for ${park?.shortName || 'this park'}`}
            </Text>
          </View>

          {creating ? (
            <View style={styles.createSection}>
              <TextInput
                style={styles.input}
                placeholder="e.g. Spring Adventure"
                placeholderTextColor="#999"
                value={newTripName}
                onChangeText={setNewTripName}
                autoFocus={true}
                returnKeyType="done"
                onSubmitEditing={handleCreateAndAdd}
              />
              <View style={styles.buttonRow}>
                <TouchableOpacity 
                  style={[styles.button, styles.cancelButton]}
                  onPress={() => {
                    setCreating(false);
                    setNewTripName('');
                  }}
                >
                  <Text style={styles.cancelText}>Back</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={[styles.button, styles.confirmButton]}
                  onPress={handleCreateAndAdd}
                >
                  <Text style={styles.confirmText}>Create & Add</Text>
                </TouchableOpacity>
              </View>
            </View>
          ) : (
            <>
              {loading ? (
                <View style={styles.loadingContainer}>
                  <Text style={styles.loadingText}>Loading...</Text>
                </View>
              ) : (
                <FlatList
                  data={trips}
                  keyExtractor={(item) => item.id}
                  contentContainerStyle={styles.list}
                  ListHeaderComponent={
                    <TouchableOpacity 
                      style={styles.createButton}
                      onPress={() => setCreating(true)}
                      activeOpacity={0.7}
                    >
                      <View style={styles.createIcon}>
                        <Text style={styles.createIconText}>+</Text>
                      </View>
                      <Text style={styles.createButtonText}>Create new trip</Text>
                    </TouchableOpacity>
                  }
                  ListEmptyComponent={
                    <View style={styles.emptyHint}>
                      <Text style={styles.emptyText}>
                        Tap "Create new trip" above to get started
                      </Text>
                    </View>
                  }
                  renderItem={({ item }) => {
                    const isInThisTrip = item.stops.some(s => s.id === park?.id);
                    return (
                      <TouchableOpacity 
                        style={[styles.tripItem, isInThisTrip && styles.tripItemDisabled]}
                        onPress={() => handleSelectTrip(item)}
                        activeOpacity={0.7}
                        disabled={isInThisTrip}
                      >
                        <View style={styles.tripIconContainer}>
                          <Text style={styles.tripIcon}>📍</Text>
                        </View>
                        <View style={styles.tripContent}>
                          <Text style={styles.tripName}>{item.name}</Text>
                          <Text style={styles.tripMeta}>
                            {item.stops.length} park{item.stops.length !== 1 ? 's' : ''}
                            {isInThisTrip && ' · Already added'}
                          </Text>
                        </View>
                        {isInThisTrip && (
                          <Text style={styles.checkmark}>✓</Text>
                        )}
                      </TouchableOpacity>
                    );
                  }}
                />
              )}

              <TouchableOpacity 
                style={styles.closeButton}
                onPress={onClose}
              >
                <Text style={styles.closeButtonText}>Cancel</Text>
              </TouchableOpacity>
            </>
          )}
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}