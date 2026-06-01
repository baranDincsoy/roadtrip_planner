import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  content: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingBottom: 30,
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
    fontSize: 20,
    fontWeight: '700',
    color: '#1e3a5f',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 12,
    color: '#666',
  },
  currentCityBox: {
    backgroundColor: '#e8f5e9',
    marginHorizontal: 20,
    marginTop: 12,
    padding: 12,
    borderRadius: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  currentCityRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  currentCityLabel: {
    fontSize: 12,
    color: '#666',
    marginRight: 6,
  },
  currentCityName: {
    fontSize: 14,
    fontWeight: '700',
    color: '#2e7d32',
  },
  clearButton: {
    padding: 4,
  },
  clearText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#d32f2f',
  },
  inputSection: {
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  inputLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#1e3a5f',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 15,
    color: '#333',
  },
  inputHint: {
    fontSize: 11,
    color: '#999',
    marginTop: 6,
    fontStyle: 'italic',
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 10,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  cancelButton: {
    flex: 1,
    paddingVertical: 12,
    backgroundColor: '#f0f0f0',
    borderRadius: 12,
    alignItems: 'center',
  },
  cancelText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
  },
  searchButton: {
    flex: 2,
    paddingVertical: 12,
    backgroundColor: '#1e3a5f',
    borderRadius: 12,
    alignItems: 'center',
  },
  searchButtonDisabled: {
    opacity: 0.4,
  },
  searchButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#fff',
  },
  examplesSection: {
    paddingHorizontal: 20,
    paddingTop: 24,
  },
  examplesTitle: {
    fontSize: 12,
    color: '#666',
    marginBottom: 10,
  },
  examplesRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  exampleChip: {
    backgroundColor: '#f0f4f8',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  exampleChipText: {
    fontSize: 12,
    color: '#1e3a5f',
    fontWeight: '600',
  },
});