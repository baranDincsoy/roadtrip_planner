import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  list: {
    paddingHorizontal: 20,
  },
  photo: {
    width: 120,
    height: 90,
    borderRadius: 8,
    marginRight: 10,
  },
  fullscreenOverlay: {
  flex: 1,
  backgroundColor: 'rgba(0,0,0,0.9)',
  justifyContent: 'center',
  alignItems: 'center',
},
fullscreenImage: {
  // width ve height inline veriliyor (Dimensions'tan)
},
closeButton: {
  position: 'absolute',
  top: 60,
  right: 20,
  width: 44,
  height: 44,
  borderRadius: 22,
  backgroundColor: 'rgba(255,255,255,0.2)',
  justifyContent: 'center',
  alignItems: 'center',
  zIndex: 10,
},
closeButtonText: {
  fontSize: 22,
  color: '#fff',
  fontWeight: '300',
},
});