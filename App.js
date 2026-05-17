import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import MapScreen from './screens/MapScreen';
import ParkDetailScreen from './screens/ParkDetailScreen';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <SafeAreaProvider>
      <StatusBar style="dark" />
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen 
            name="Map" 
            component={MapScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen 
            name="ParkDetail" 
            component={ParkDetailScreen}
            options={{ 
              title: 'Park Details',
              headerStyle: { backgroundColor: '#fff' },
              headerTitleStyle: { color: '#1e3a5f', fontWeight: 'bold' },
              headerTintColor: '#1e3a5f',
              headerStatusBarHeight: 30,
            }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}