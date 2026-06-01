import { useState } from 'react';
import { Modal, View, Text, TouchableOpacity, TextInput, KeyboardAvoidingView, Platform } from 'react-native';

import { styles } from '../styles/CitySearchModal.styles';

export default function CitySearchModal({ visible, onClose, onSearch, currentCity, loading }) {
  const [cityName, setCityName] = useState('');

  const handleSearch = () => {
    if (cityName.trim().length === 0) return;
    onSearch(cityName.trim());
    setCityName('');
  };

  const handleClear = () => {
    onSearch(null);
    setCityName('');
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
        <View style={styles.content}>
          <View style={styles.handle} />
          
          <View style={styles.header}>
            <Text style={styles.title}>Find Parks in a City</Text>
            <Text style={styles.subtitle}>
              Powered by Google Places · Free to use
            </Text>
          </View>

          {currentCity && (
            <View style={styles.currentCityBox}>
              <View style={styles.currentCityRow}>
                <Text style={styles.currentCityLabel}>Currently showing:</Text>
                <Text style={styles.currentCityName}>{currentCity}</Text>
              </View>
              <TouchableOpacity onPress={handleClear} style={styles.clearButton}>
                <Text style={styles.clearText}>✕ Clear</Text>
              </TouchableOpacity>
            </View>
          )}

          <View style={styles.inputSection}>
            <Text style={styles.inputLabel}>City Name</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g. Charlotte NC, New York, Miami FL"
              placeholderTextColor="#999"
              value={cityName}
              onChangeText={setCityName}
              autoFocus={true}
              returnKeyType="search"
              onSubmitEditing={handleSearch}
              editable={!loading}
            />
            <Text style={styles.inputHint}>
              Tip: Add state for better results (e.g. "Charlotte NC")
            </Text>
          </View>

          <View style={styles.buttonRow}>
            <TouchableOpacity 
              style={styles.cancelButton}
              onPress={onClose}
            >
              <Text style={styles.cancelText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.searchButton, (cityName.trim().length === 0 || loading) && styles.searchButtonDisabled]}
              onPress={handleSearch}
              disabled={cityName.trim().length === 0 || loading}
            >
              <Text style={styles.searchButtonText}>
                {loading ? 'Searching...' : 'Search'}
              </Text>
            </TouchableOpacity>
          </View>

          <View style={styles.examplesSection}>
            <Text style={styles.examplesTitle}>Popular cities:</Text>
            <View style={styles.examplesRow}>
              {['Charlotte NC', 'New York', 'San Francisco', 'Miami', 'Chicago'].map(city => (
                <TouchableOpacity
                  key={city}
                  style={styles.exampleChip}
                  onPress={() => {
                    setCityName(city);
                  }}
                >
                  <Text style={styles.exampleChipText}>{city}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}