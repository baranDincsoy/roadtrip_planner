import { useState, useCallback } from 'react';
import { View, Text, FlatList, TouchableOpacity, Alert } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';

import { styles } from '../styles/TripPlannerScreen.styles';
import { getSavedParks, removeFromTrip, clearTrip } from '../services/tripService';

export default function TripPlannerScreen({ navigation }) {
  const [savedParks, setSavedParks] = useState([]);
  const [loading, setLoading] = useState(true);

  useFocusEffect(
    useCallback(() => {
      loadSavedParks();
    }, [])
  );

  const loadSavedParks = async () => {
    setLoading(true);
    const parks = await getSavedParks();
    setSavedParks(parks);
    setLoading(false);
  };

  const handleRemove = (park) => {
    Alert.alert(
      'Remove from trip?',
      `${park.name} will be removed from your trip.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Remove',
          style: 'destructive',
          onPress: async () => {
            await removeFromTrip(park.id);
            loadSavedParks();
          },
        },
      ]
    );
  };

  const handleClearAll = () => {
    if (savedParks.length === 0) return;
    
    Alert.alert(
      'Clear trip?',
      'All saved parks will be removed.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Clear All',
          style: 'destructive',
          onPress: async () => {
            await clearTrip();
            loadSavedParks();
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
          <Text style={styles.title}>My Trip</Text>
          <Text style={styles.subtitle}>
            {savedParks.length} park{savedParks.length !== 1 ? 's' : ''} saved
          </Text>
        </View>
        {savedParks.length > 0 && (
          <TouchableOpacity onPress={handleClearAll} style={styles.clearButton}>
            <Text style={styles.clearText}>Clear</Text>
          </TouchableOpacity>
        )}
      </View>

      {savedParks.length === 0 ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyIcon}>🗺️</Text>
          <Text style={styles.emptyTitle}>No parks in your trip yet</Text>
          <Text style={styles.emptyText}>
            Tap "+ Add" on any park to save it to your trip
          </Text>
        </View>
      ) : (
        <FlatList
          data={savedParks}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
          renderItem={({ item, index }) => (
            <View style={styles.card}>
              <View style={styles.cardNumber}>
                <Text style={styles.cardNumberText}>{index + 1}</Text>
              </View>
              <View style={[styles.cardColorBar, { backgroundColor: item.pinColor }]} />
              <View style={styles.cardContent}>
                <View style={styles.cardHeader}>
                  <Text style={styles.cardIcon}>{item.categoryIcon}</Text>
                  <Text style={styles.cardName} numberOfLines={1}>
                    {item.name}
                  </Text>
                </View>
                <Text style={styles.cardMeta}>
                  {item.designation} · {item.states}
                </Text>
              </View>
              <TouchableOpacity onPress={() => handleRemove(item)} style={styles.removeButton}>
                <Text style={styles.removeIcon}>✕</Text>
              </TouchableOpacity>
            </View>
          )}
        />
      )}
    </View>
  );
}