import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  sheet: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingBottom: 30,
    maxHeight: '85%',
    minHeight: '50%',
  },
  handle: {
    width: 60,
    height: 4,
    backgroundColor: '#ddd',
    borderRadius: 2,
    alignSelf: 'center',
    marginTop: 10,
    marginBottom: 16,
  },
  stickyHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingHorizontal: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  headerContent: {
    flex: 1,
  },
  parkName: {
    fontSize: 22,
    fontWeight: '600',
    color: '#1e3a5f',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 13,
    color: '#666',
  },
  closeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeText: {
    fontSize: 16,
    color: '#666',
  },
  scrollContent: {
    paddingTop: 16,
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 20,
    paddingHorizontal: 20,
  },
  primaryButton: {
    flex: 1,
    backgroundColor: '#1e3a5f',
    paddingVertical: 12,
    borderRadius: 20,
    alignItems: 'center',
  },
  primaryButtonText: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '500',
  },
  secondaryButton: {
    flex: 1,
    backgroundColor: '#f0f0f0',
    paddingVertical: 12,
    borderRadius: 20,
    alignItems: 'center',
  },
  secondaryButtonText: {
    color: '#333',
    fontSize: 13,
    fontWeight: '500',
  },
  section: {
    marginBottom: 20,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1e3a5f',
    marginBottom: 12,
    paddingHorizontal: 20,
  },
  videoList: {
    paddingHorizontal: 20,
  },
  info: {
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#eee',
    paddingHorizontal: 20,
  },
  infoTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1e3a5f',
    marginBottom: 4,
  },
  infoText: {
    fontSize: 13,
    color: '#666',
  },
  addedButton: {
  backgroundColor: '#e8f5e9',
},
addedButtonText: {
  color: '#2e7d32',
},
});