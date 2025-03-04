import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import PortfolioScreen from 'screens/Portfolio';
import AddToPortfolioScreen from 'screens/AddToPortfolio';
import SettingsScreen from 'screens/Settings';

const Stack = createStackNavigator();

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <NavigationContainer>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name="Portfolio" component={  PortfolioScreen } />
          <Stack.Screen name="AddToPortfolio" component={ AddToPortfolioScreen } />
          <Stack.Screen name="Settings" component={ SettingsScreen } />
         </Stack.Navigator>
      </NavigationContainer>
    </GestureHandlerRootView>
  );
}