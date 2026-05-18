import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    width: 120,
    marginRight: 10,
  },
  thumbnail: {
    width: 120,
    height: 200,
    backgroundColor: '#444',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  thumbnailYours: {
    backgroundColor: '#1e3a5f',
  },
  yoursBadge: {
    position: 'absolute',
    top: 6,
    left: 6,
    backgroundColor: '#fff',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  yoursBadgeText: {
    fontSize: 8,
    fontWeight: '700',
    color: '#1e3a5f',
  },
  playIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.3)',
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
  views: {
    fontSize: 10,
    color: '#999',
    marginTop: 2,
  },
});