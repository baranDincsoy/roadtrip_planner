import { useState } from 'react';
import { View, TextInput, TouchableOpacity, Text, FlatList, Keyboard } from 'react-native';

import { styles } from '../styles/SearchBar.styles';

export default function SearchBar({ parks, onSelectResult }) {
  const [query, setQuery] = useState('');
  const [focused, setFocused] = useState(false);

  const results = query.trim().length > 0
    ? parks
        .filter(park =>
          park.name.toLowerCase().includes(query.toLowerCase()) ||
          park.shortName.toLowerCase().includes(query.toLowerCase())
        )
        .slice(0, 8)
    : [];

  const showResults = focused && query.trim().length > 0;

  const handleSelect = (park) => {
    setQuery('');
    setFocused(false);
    Keyboard.dismiss();
    onSelectResult(park);
  };

  const handleClear = () => {
    setQuery('');
    Keyboard.dismiss();
  };

  return (
    <View style={styles.container}>
      <View style={styles.searchBox}>
        <Text style={styles.searchIcon}>🔍</Text>
        <TextInput
          style={styles.input}
          placeholder="Search parks..."
          placeholderTextColor="#999"
          value={query}
          onChangeText={setQuery}
          onFocus={() => setFocused(true)}
          returnKeyType="search"
        />
        {query.length > 0 && (
          <TouchableOpacity onPress={handleClear} style={styles.clearButton}>
            <Text style={styles.clearIcon}>✕</Text>
          </TouchableOpacity>
        )}
      </View>

      {showResults && (
        <View style={styles.resultsContainer}>
          {results.length === 0 ? (
            <View style={styles.emptyState}>
              <Text style={styles.emptyText}>No parks found</Text>
            </View>
          ) : (
            <FlatList
              data={results}
              keyExtractor={(item) => item.id}
              keyboardShouldPersistTaps="handled"
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.resultItem}
                  onPress={() => handleSelect(item)}
                  activeOpacity={0.7}
                >
                  <Text style={styles.resultIcon}>{item.categoryIcon}</Text>
                  <View style={styles.resultInfo}>
                    <Text style={styles.resultName} numberOfLines={1}>
                      {item.shortName}
                    </Text>
                    <Text style={styles.resultMeta} numberOfLines={1}>
                      {item.designation} · {item.states}
                    </Text>
                  </View>
                </TouchableOpacity>
              )}
            />
          )}
        </View>
      )}
    </View>
  );
}