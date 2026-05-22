import { Modal, View, Text, ScrollView, TouchableOpacity, TouchableWithoutFeedback, Animated } from 'react-native';
import { useEffect, useRef } from 'react';

import { styles } from '../styles/DrawerContent.styles';

export default function FilterDrawer({ visible, categories, selectedCategories, onToggleCategory, onSelectAll, onClearAll, onClose }) {
  const slideAnim = useRef(new Animated.Value(-300)).current;

  useEffect(() => {
    if (visible) {
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 250,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(slideAnim, {
        toValue: -300,
        duration: 200,
        useNativeDriver: true,
      }).start();
    }
  }, [visible]);

  return (
    <Modal
      visible={visible}
      animationType="none"
      transparent={true}
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.backdrop}>
          <TouchableWithoutFeedback>
            <Animated.View 
              style={[
                styles.drawer,
                { transform: [{ translateX: slideAnim }] }
              ]}
            >
              <View style={styles.header}>
                <Text style={styles.title}>Filter Locations</Text>
                <Text style={styles.subtitle}>Select categories to show</Text>
              </View>

              <View style={styles.actionRow}>
                <TouchableOpacity onPress={onSelectAll} style={styles.actionButton}>
                  <Text style={styles.actionText}>Select All</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={onClearAll} style={styles.actionButton}>
                  <Text style={styles.actionText}>Clear All</Text>
                </TouchableOpacity>
              </View>

              <ScrollView style={styles.list} showsVerticalScrollIndicator={false}>
                {categories.map((category) => {
                  const isSelected = selectedCategories.includes(category.name);
                  return (
                    <TouchableOpacity
                      key={category.name}
                      style={styles.categoryItem}
                      onPress={() => onToggleCategory(category.name)}
                      activeOpacity={0.7}
                    >
                      <View style={[styles.colorDot, { backgroundColor: category.color }]} />
                      <Text style={styles.categoryIcon}>{category.icon}</Text>
                      <View style={styles.categoryInfo}>
                        <Text style={styles.categoryName} numberOfLines={1}>{category.name}</Text>
                        <Text style={styles.categoryCount}>{category.count} locations</Text>
                      </View>
                      <View style={[styles.checkbox, isSelected && styles.checkboxSelected]}>
                        {isSelected && <Text style={styles.checkmark}>✓</Text>}
                      </View>
                    </TouchableOpacity>
                  );
                })}
              </ScrollView>
            </Animated.View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
}