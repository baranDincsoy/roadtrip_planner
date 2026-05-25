import { useState, useCallback } from 'react';
import { View, Text, FlatList, TouchableOpacity, Alert, Modal, TextInput, KeyboardAvoidingView, Platform } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';

import { styles } from '../styles/TripListScreen.styles';
import { getAllTrips, createTrip, deleteTrip, setActiveTrip } from '../services/tripService';

export default function TripListScreen({ navigation }) {
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [createModalVisible, setCreateModalVisible] = useState(false);
  const [newTripName, setNewTripName] = useState('');

  useFocusEffect(
    useCallback(() => {
      loadTrips();
    }, [])
  );

  const loadTrips = async () => {
    setLoading(true);
    const data = await getAllTrips();
    setTrips(data);
    setLoading(false);
  };

  const handleOpenTrip = async (trip) => {
    await setActiveTrip(trip.id);
    navigation.navigate('TripDetail', { tripId: trip.id });
  };

  const handleCreateTrip = async () => {
    const name = newTripName.trim() || 'New Trip';
    const result = await createTrip(name);
    
    if (result.success) {
      setNewTripName('');
      setCreateModalVisible(false);
      await loadTrips();
      navigation.navigate('TripDetail', { tripId: result.trip.id });
    } else {
      Alert.alert('Error', 'Could not create trip. Please try again.');
    }
  };

  const handleDeleteTrip = (trip) => {
    Alert.alert(
      'Delete trip?',
      `"${trip.name}" and all its parks will be permanently removed.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            await deleteTrip(trip.id);
            loadTrips();
          },
        },
      ]
    );
  };

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity>
        <View style={styles.headerContent}>
          <Text style={styles.title}>My Trips</Text>
          <Text style={styles.subtitle}>
            {trips.length} trip{trips.length !== 1 ? 's' : ''}
          </Text>
        </View>
      </View>

      {trips.length === 0 ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyIcon}>🗺️</Text>
          <Text style={styles.emptyTitle}>No trips yet</Text>
          <Text style={styles.emptyText}>
            Create your first trip to start planning
          </Text>
          <TouchableOpacity 
            style={styles.emptyButton} 
            onPress={() => setCreateModalVisible(true)}
          >
            <Text style={styles.emptyButtonText}>+ Create Trip</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={trips}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
          renderItem={({ item }) => {
            const totalStops = item.stops.length;
            const visitedStops = item.stops.filter(s => s.status === 'visited').length;
            const upcomingStops = totalStops - visitedStops;
            
            return (
              <TouchableOpacity 
                style={styles.tripCard}
                onPress={() => handleOpenTrip(item)}
                onLongPress={() => handleDeleteTrip(item)}
                activeOpacity={0.7}
              >
                <View style={styles.tripIconContainer}>
                  <Text style={styles.tripIcon}>📍</Text>
                </View>
                <View style={styles.tripContent}>
                  <Text style={styles.tripName} numberOfLines={1}>{item.name}</Text>
                  <Text style={styles.tripMeta}>
                    {totalStops === 0 
                      ? 'No parks yet'
                      : visitedStops > 0 
                        ? `${visitedStops} visited · ${upcomingStops} upcoming`
                        : `${totalStops} park${totalStops !== 1 ? 's' : ''}`}
                  </Text>
                </View>
                <Text style={styles.chevron}>›</Text>
              </TouchableOpacity>
            );
          }}
        />
      )}

      {trips.length > 0 && (
        <TouchableOpacity 
          style={styles.fab} 
          onPress={() => setCreateModalVisible(true)}
          activeOpacity={0.8}
        >
          <Text style={styles.fabIcon}>+</Text>
        </TouchableOpacity>
      )}

      <Modal
        visible={createModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setCreateModalVisible(false)}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.modalOverlay}
        >
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Create New Trip</Text>
            <Text style={styles.modalSubtitle}>Give your trip a memorable name</Text>
            <TextInput
              style={styles.modalInput}
              placeholder="e.g. Spring Adventure"
              placeholderTextColor="#999"
              value={newTripName}
              onChangeText={setNewTripName}
              autoFocus={true}
              returnKeyType="done"
              onSubmitEditing={handleCreateTrip}
            />
            <View style={styles.modalButtons}>
              <TouchableOpacity 
                style={[styles.modalButton, styles.modalCancelButton]}
                onPress={() => {
                  setNewTripName('');
                  setCreateModalVisible(false);
                }}
              >
                <Text style={styles.modalCancelText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.modalButton, styles.modalCreateButton]}
                onPress={handleCreateTrip}
              >
                <Text style={styles.modalCreateText}>Create</Text>
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </View>
  );
}