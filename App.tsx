import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import PortfolioScreen from 'screens/Portfolio';
import AddToPortfolioScreen from 'screens/AddToPortfolio';
import SettingsScreen from 'screens/Settings';
import AssetInfoScreen from 'screens/AssetInfoScreen';

const Stack = createStackNavigator();

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <NavigationContainer>
        <Stack.Navigator screenOptions={{ headerShown: false }} >
          <Stack.Screen name="Portfolio" options={{ animation: 'none' }} component={  PortfolioScreen } />
          <Stack.Screen name="AddToPortfolio" options={{ animation: 'none' }} component={ AddToPortfolioScreen } />
          <Stack.Screen name="Settings" options={{ animation: 'none' }} component={ SettingsScreen } />
          <Stack.Screen name="AssetInfoScreen" options={{ animation: 'none' }} component={ AssetInfoScreen } />
         </Stack.Navigator>
      </NavigationContainer>
    </GestureHandlerRootView>
  );
}