import { useState, useEffect, useCallback } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { View, Text, TouchableOpacity, FlatList, Alert } from 'react-native';

import { styles } from '../styles/FavoritesScreen.styles';
import { getFavorites, removeFavorite, clearAllFavorites } from '../services/favoritesService';

export default function FavoritesScreen({ navigation }) {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadFavorites = async () => {
    setLoading(true);
    const data = await getFavorites();
    setFavorites(data);
    setLoading(false);
  };

  useFocusEffect(
    useCallback(() => {
      loadFavorites();
    }, [])
  );

  const handleRemove = (item) => {
    Alert.alert(
      'Remove from Favorites?',
      `Remove "${item.shortName || item.name}" from your favorites?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Remove', 
          style: 'destructive',
          onPress: async () => {
            await removeFavorite(item.id);
            loadFavorites();
          }
        }
      ]
    );
  };

  const handleClearAll = () => {
    if (favorites.length === 0) return;
    
    Alert.alert(
      'Clear All Favorites?',
      'This will remove all saved locations. This cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Clear All', 
          style: 'destructive',
          onPress: async () => {
            await clearAllFavorites();
            loadFavorites();
          }
        }
      ]
    );
  };

  const handleItemPress = (item) => {
    navigation.navigate('Map', { focusLocation: item });
  };

  const formatDate = (timestamp) => {
    if (!timestamp) return '';
    const date = new Date(timestamp);
    const now = new Date();
    const diffDays = Math.floor((now - date) / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} week${Math.floor(diffDays / 7) !== 1 ? 's' : ''} ago`;
    return date.toLocaleDateString();
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity 
      style={styles.card}
      onPress={() => handleItemPress(item)}
      activeOpacity={0.7}
    >
      <View style={styles.iconCircle}>
        <Text style={styles.iconText}>
          {item.categoryIcon || (item.type === 'trail' ? '🥾' : '🏞️')}
        </Text>
      </View>
      
      <View style={styles.cardContent}>
        <Text style={styles.cardName} numberOfLines={1}>
          {item.shortName || item.name}
        </Text>
        <Text style={styles.cardDesignation} numberOfLines={1}>
          {item.designation}
          {item.states && ` · ${item.states}`}
        </Text>
        <Text style={styles.cardDate}>
          Saved {formatDate(item.addedAt)}
        </Text>
      </View>

      <TouchableOpacity 
        style={styles.removeButton}
        onPress={() => handleRemove(item)}
        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
      >
        <Text style={styles.removeButtonText}>✕</Text>
      </TouchableOpacity>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.loadingText}>Loading favorites...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Text style={styles.backText}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.title}>❤️ My Favorites</Text>
        {favorites.length > 0 && (
          <TouchableOpacity onPress={handleClearAll}>
            <Text style={styles.clearAllText}>Clear All</Text>
          </TouchableOpacity>
        )}
      </View>

      {favorites.length === 0 ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyIcon}>🤍</Text>
          <Text style={styles.emptyTitle}>No favorites yet</Text>
          <Text style={styles.emptyDescription}>
            Tap the heart button on any park to save it here for quick access.
          </Text>
          <TouchableOpacity 
            style={styles.exploreButton}
            onPress={() => navigation.navigate('Map')}
          >
            <Text style={styles.exploreButtonText}>🗺️ Explore Parks</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <>
          <Text style={styles.subtitle}>
            {favorites.length} saved location{favorites.length !== 1 ? 's' : ''}
          </Text>
          <FlatList
            data={favorites}
            renderItem={renderItem}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.list}
            showsVerticalScrollIndicator={false}
          />
        </>
      )}
    </View>
  );
}