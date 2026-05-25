import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    width: 140,
    marginRight: 10,
  },
  thumbnailContainer: {
    width: 140,
    height: 200,
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: '#333',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  thumbnail: {
    width: '100%',
    height: '100%',
  },
  thumbnailPlaceholder: {
    backgroundColor: '#444',
  },
  yoursBadge: {
    position: 'absolute',
    top: 6,
    left: 6,
    backgroundColor: '#fff',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    zIndex: 2,
  },
  yoursBadgeText: {
    fontSize: 8,
    fontWeight: '700',
    color: '#1e3a5f',
  },
  playIconContainer: {
    position: 'absolute',
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  playIcon: {
    fontSize: 16,
    color: '#fff',
    marginLeft: 3,
  },
  title: {
    fontSize: 12,
    fontWeight: '500',
    color: '#333',
    marginTop: 6,
    lineHeight: 16,
  },
  channel: {
    fontSize: 10,
    color: '#666',
    marginTop: 2,
  },
  views: {
    fontSize: 10,
    color: '#999',
    marginTop: 1,
  },
});