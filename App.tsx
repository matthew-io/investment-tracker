import { ScreenContent } from 'components/ScreenContent';
import { StatusBar } from 'expo-status-bar';
import { Text, View, ScrollView } from "react-native";
import { Navbar } from 'components/Navbar';
import { TotalValue } from 'components/TotalValue';
import { PortfolioItem } from 'components/PortfolioItem'

import './global.css';

export default function App() {
  return (
    <View className="flex-1 bg-brand-gray">
      <StatusBar style="auto" />
      <ScrollView>
        <TotalValue/>
        <PortfolioItem />
        <PortfolioItem />
        <PortfolioItem />
        <PortfolioItem />
        <PortfolioItem />
        <PortfolioItem />
        <PortfolioItem />
        <PortfolioItem />
        <PortfolioItem />
      <PortfolioItem />
      </ScrollView>
      <Navbar />
    </View>
  );
}
