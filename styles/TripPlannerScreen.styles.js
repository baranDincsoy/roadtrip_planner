import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  loadingText: {
    fontSize: 14,
    color: '#666',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingTop: 60,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backIcon: {
    fontSize: 24,
    color: '#1e3a5f',
    fontWeight: '600',
  },
  headerContent: {
    flex: 1,
    marginLeft: 8,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1e3a5f',
    marginBottom: 2,
  },
  subtitle: {
    fontSize: 12,
    color: '#666',
  },
  clearButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    backgroundColor: '#fee',
  },
  clearText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#d32f2f',
  },
  routeContainer: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
  },
  routeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#1e3a5f',
    paddingVertical: 14,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
  },
  routeIcon: {
    fontSize: 18,
    marginRight: 8,
  },
  routeText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#fff',
  },
  routeHint: {
    fontSize: 11,
    color: '#999',
    textAlign: 'center',
    marginTop: 6,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1e3a5f',
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
    lineHeight: 20,
  },
  list: {
    padding: 16,
  },
  card: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 10,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  cardVisited: {
    opacity: 0.6,
    backgroundColor: '#f9f9f9',
  },
  cardNumber: {
    width: 32,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
  },
  cardNumberText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#666',
  },
  cardNumberVisited: {
    color: '#999',
    textDecorationLine: 'line-through',
  },
  cardColorBar: {
    width: 4,
  },
  cardColorBarVisited: {
    opacity: 0.3,
  },
  cardContent: {
    flex: 1,
    padding: 10,
    justifyContent: 'center',
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  cardIcon: {
    fontSize: 14,
    marginRight: 6,
  },
  cardName: {
    flex: 1,
    fontSize: 13,
    fontWeight: '600',
    color: '#1e3a5f',
  },
  cardNameVisited: {
    textDecorationLine: 'line-through',
    color: '#999',
  },
  cardMeta: {
    fontSize: 10,
    color: '#999',
  },
  cardMetaVisited: {
    color: '#2e7d32',
    fontWeight: '600',
  },
  actionColumn: {
    width: 32,
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingVertical: 4,
  },
  arrowButton: {
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  arrowDisabled: {
    opacity: 0.3,
  },
  arrowIcon: {
    fontSize: 14,
    color: '#1e3a5f',
    fontWeight: '700',
  },
  arrowIconDisabled: {
    color: '#ccc',
  },
  visitButton: {
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: '#ccc',
    justifyContent: 'center',
    alignItems: 'center',
  },
  visitButtonActive: {
    backgroundColor: '#2e7d32',
    borderColor: '#2e7d32',
  },
  visitIcon: {
    fontSize: 14,
    color: '#999',
  },
  visitIconActive: {
    color: '#fff',
    fontWeight: '700',
  },
  removeButton: {
    width: 28,
    height: 28,
    justifyContent: 'center',
    alignItems: 'center',
  },
  removeIcon: {
    fontSize: 16,
    color: '#999',
  },
});