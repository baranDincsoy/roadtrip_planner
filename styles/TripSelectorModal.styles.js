import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  sheet: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingBottom: 30,
    maxHeight: '75%',
    minHeight: '40%',
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
  header: {
    paddingHorizontal: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1e3a5f',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 13,
    color: '#666',
  },
  loadingContainer: {
    padding: 40,
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 14,
    color: '#999',
  },
  list: {
    paddingVertical: 8,
  },
  createButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 20,
    backgroundColor: '#f0f4f8',
    marginHorizontal: 16,
    marginBottom: 8,
    borderRadius: 12,
  },
  createIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#1e3a5f',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  createIconText: {
    fontSize: 20,
    color: '#fff',
    fontWeight: '300',
  },
  createButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1e3a5f',
  },
  emptyHint: {
    paddingVertical: 30,
    paddingHorizontal: 40,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 13,
    color: '#999',
    textAlign: 'center',
  },
  tripItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 20,
  },
  tripItemDisabled: {
    opacity: 0.5,
  },
  tripIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#f0f4f8',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  tripIcon: {
    fontSize: 16,
  },
  tripContent: {
    flex: 1,
  },
  tripName: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1e3a5f',
    marginBottom: 2,
  },
  tripMeta: {
    fontSize: 12,
    color: '#666',
  },
  checkmark: {
    fontSize: 18,
    color: '#2e7d32',
    fontWeight: '700',
  },
  closeButton: {
    marginHorizontal: 20,
    marginTop: 12,
    paddingVertical: 14,
    backgroundColor: '#f0f0f0',
    borderRadius: 12,
    alignItems: 'center',
  },
  closeButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
  },
  createSection: {
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 15,
    color: '#333',
    marginBottom: 16,
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 10,
  },
  button: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#f0f0f0',
  },
  cancelText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
  },
  confirmButton: {
    backgroundColor: '#1e3a5f',
  },
  confirmText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#fff',
  },
});