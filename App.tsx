import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import PortfolioScreen from "screens/Portfolio";
import AddToPortfolioScreen from "screens/AddToPortfolio";
import SettingsScreen from "screens/Settings";
import AssetInfoScreen from "screens/AssetInfoScreen";
import ScannerScreen from "screens/Scanner";

// Import your provider
import { SettingsProvider } from "./screens/Settings/settingsContext";
import WalletDetailScreen from "screens/AddToPortfolioWallet";
import EntryScreen from "screens/EntryScreen";

const Stack = createStackNavigator();

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SettingsProvider>
        <NavigationContainer>
          <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen
              name="Entry"
              options={{ animation: "none" }}
              component={EntryScreen}
            />
            <Stack.Screen
              name="Portfolio"
              options={{ animation: "none" }}
              component={PortfolioScreen}
            />
            <Stack.Screen
              name="AddToPortfolio"
              options={{ animation: "none" }}
              component={AddToPortfolioScreen}
            />
            <Stack.Screen
              name="Settings"
              options={{ animation: "none" }}
              component={SettingsScreen}
            />
            <Stack.Screen
              name="AssetInfoScreen"
              options={{ animation: "none" }}
              component={AssetInfoScreen}
            />
            <Stack.Screen
              name="Scanner"
              options={{ animation: "none" }}
              component={ScannerScreen}
            />
            <Stack.Screen
              name="AddToPortfolioWallet"
              options={{ animation: "none" }}
              component={WalletDetailScreen}
            />              
          </Stack.Navigator>
        </NavigationContainer>
      </SettingsProvider>
    </GestureHandlerRootView>
  );
}
