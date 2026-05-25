import { useState, useCallback } from 'react';
import { View, Text, FlatList, TouchableOpacity, Alert } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';

import { styles } from '../styles/TripPlannerScreen.styles';
import { 
  getTripById, 
  removeStopFromTrip, 
  clearTrip, 
  toggleStopVisited, 
  reorderStopsInTrip 
} from '../services/tripService';
import { openRoute } from '../utils/linking';

export default function TripDetailScreen({ navigation, route }) {
  const { tripId } = route.params;
  const [trip, setTrip] = useState(null);
  const [loading, setLoading] = useState(true);

  useFocusEffect(
    useCallback(() => {
      loadTrip();
    }, [tripId])
  );

  const loadTrip = async () => {
    setLoading(true);
    const data = await getTripById(tripId);
    setTrip(data);
    setLoading(false);
  };

  const handleRemove = (stop) => {
    Alert.alert(
      'Remove from trip?',
      `${stop.name} will be removed from your trip.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Remove',
          style: 'destructive',
          onPress: async () => {
            await removeStopFromTrip(tripId, stop.id);
            loadTrip();
          },
        },
      ]
    );
  };

  const handleClearAll = () => {
    if (!trip || trip.stops.length === 0) return;
    
    Alert.alert(
      'Clear trip?',
      'All parks will be removed from this trip.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Clear All',
          style: 'destructive',
          onPress: async () => {
            await clearTrip(tripId);
            loadTrip();
          },
        },
      ]
    );
  };

  const handleSetRoute = () => {
    if (trip) {
      openRoute(trip.stops);
    }
  };

  const handleToggleVisited = async (parkId) => {
    await toggleStopVisited(tripId, parkId);
    loadTrip();
  };

  const handleMoveUp = async (index) => {
    if (index === 0) return;
    await reorderStopsInTrip(tripId, index, index - 1);
    loadTrip();
  };

  const handleMoveDown = async (index) => {
    if (!trip || index === trip.stops.length - 1) return;
    await reorderStopsInTrip(tripId, index, index + 1);
    loadTrip();
  };

  if (loading || !trip) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  const stops = trip.stops;
  const upcomingCount = stops.filter(p => p.status !== 'visited').length;
  const visitedCount = stops.filter(p => p.status === 'visited').length;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity>
        <View style={styles.headerContent}>
          <Text style={styles.title} numberOfLines={1}>{trip.name}</Text>
          <Text style={styles.subtitle}>
            {visitedCount > 0 
              ? `${visitedCount} visited · ${upcomingCount} upcoming`
              : `${stops.length} park${stops.length !== 1 ? 's' : ''} saved`}
          </Text>
        </View>
        {stops.length > 0 && (
          <TouchableOpacity onPress={handleClearAll} style={styles.clearButton}>
            <Text style={styles.clearText}>Clear</Text>
          </TouchableOpacity>
        )}
      </View>

      {stops.length > 0 && (
        <View style={styles.routeContainer}>
          <TouchableOpacity 
            style={styles.routeButton} 
            onPress={handleSetRoute}
            activeOpacity={0.8}
          >
            <Text style={styles.routeIcon}>🧭</Text>
            <Text style={styles.routeText}>Set Route in Google Maps</Text>
          </TouchableOpacity>
          <Text style={styles.routeHint}>
            {upcomingCount === 0 
              ? 'All parks visited!' 
              : upcomingCount === 1 
                ? 'Opens directions to your park' 
                : `Multi-stop route: ${upcomingCount} parks`}
          </Text>
        </View>
      )}

      {stops.length === 0 ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyIcon}>🗺️</Text>
          <Text style={styles.emptyTitle}>No parks in this trip yet</Text>
          <Text style={styles.emptyText}>
            Go back to the map and tap "+ Add" on any park
          </Text>
        </View>
      ) : (
        <FlatList
          data={stops}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
          renderItem={({ item, index }) => {
            const isVisited = item.status === 'visited';
            const isFirst = index === 0;
            const isLast = index === stops.length - 1;
            
            return (
              <View style={[styles.card, isVisited && styles.cardVisited]}>
                <View style={styles.cardNumber}>
                  <Text style={[styles.cardNumberText, isVisited && styles.cardNumberVisited]}>
                    {index + 1}
                  </Text>
                </View>
                <View style={[styles.cardColorBar, { backgroundColor: item.pinColor }, isVisited && styles.cardColorBarVisited]} />
                <View style={styles.cardContent}>
                  <View style={styles.cardHeader}>
                    <Text style={styles.cardIcon}>{item.categoryIcon}</Text>
                    <Text 
                      style={[
                        styles.cardName, 
                        isVisited && styles.cardNameVisited
                      ]} 
                      numberOfLines={1}
                    >
                      {item.name}
                    </Text>
                  </View>
                  <Text style={[styles.cardMeta, isVisited && styles.cardMetaVisited]}>
                    {isVisited ? '✓ Visited' : `${item.designation} · ${item.states}`}
                  </Text>
                </View>
                
                <View style={styles.actionColumn}>
                  <TouchableOpacity 
                    onPress={() => handleMoveUp(index)} 
                    style={[styles.arrowButton, isFirst && styles.arrowDisabled]}
                    disabled={isFirst}
                  >
                    <Text style={[styles.arrowIcon, isFirst && styles.arrowIconDisabled]}>↑</Text>
                  </TouchableOpacity>
                  <TouchableOpacity 
                    onPress={() => handleMoveDown(index)} 
                    style={[styles.arrowButton, isLast && styles.arrowDisabled]}
                    disabled={isLast}
                  >
                    <Text style={[styles.arrowIcon, isLast && styles.arrowIconDisabled]}>↓</Text>
                  </TouchableOpacity>
                </View>
                
                <View style={styles.actionColumn}>
                  <TouchableOpacity 
                    onPress={() => handleToggleVisited(item.id)} 
                    style={[styles.visitButton, isVisited && styles.visitButtonActive]}
                  >
                    <Text style={[styles.visitIcon, isVisited && styles.visitIconActive]}>
                      {isVisited ? '✓' : '○'}
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity 
                    onPress={() => handleRemove(item)} 
                    style={styles.removeButton}
                  >
                    <Text style={styles.removeIcon}>✕</Text>
                  </TouchableOpacity>
                </View>
              </View>
            );
          }}
        />
      )}
    </View>
  );
}