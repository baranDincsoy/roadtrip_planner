import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  list: {
    paddingHorizontal: 20,
  },
  card: {
    width: 260,
    padding: 14,
    backgroundColor: '#f9f9f9',
    borderRadius: 12,
    marginRight: 10,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  author: {
    fontSize: 13,
    fontWeight: '600',
    color: '#1e3a5f',
  },
  date: {
    fontSize: 11,
    color: '#999',
  },
  stars: {
    fontSize: 12,
    marginBottom: 8,
  },
  text: {
    fontSize: 13,
    lineHeight: 18,
    color: '#444',
  },
});