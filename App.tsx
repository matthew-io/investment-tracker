import { ScreenContent } from 'components/ScreenContent';
import React, { useState, useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { Text, View, ScrollView, ActivityIndicator } from "react-native";
import { Navbar } from 'components/Navbar';
import { TotalValue } from 'components/TotalValue';
import { PortfolioItem } from 'components/PortfolioItem'
import { ItemData } from 'types';
import { COINGECKO_API_KEY } from "@env";

import './global.css';

const initialHoldigns: ItemData[] = [
    { id: 'bitcoin', symbol: 'BTC', amount: 6.66 },
    { id: 'ethereum', symbol: 'ETH', amount: 12.2 },
    { id: 'stellar', symbol: 'XLM', amount: 12.2 },

]

let totalPrice: number = 0;

export default function App() {
  const [holdings, setHoldings] = useState<ItemData[]>(initialHoldigns)

  const [prices, setPrices] = useState<Record<string, number>>({});
  const [icons, setIcons] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  const fetchCoinData = async () => {
    try {
      setLoading(true);
      const coinIds = holdings.map((h) => h.id).join("%2C");
      if (!coinIds) return;

      const url = `https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=${coinIds}`;
      const options = {
        method: 'GET',
        headers: {accept: 'application/json', 'x-cg-demo-api-key': COINGECKO_API_KEY}
      }

      const response = await fetch(url, options)
      const data = await response.json();

      const newPrices: Record<string, number> = {};
      const newIcons: Record<string, string> = {};

      data.forEach((coin: any) => {
        const amount = holdings.find(h => h.id === coin.id)?.amount;

        totalPrice += parseFloat(coin.current_price * amount);
        newPrices[coin.id] = coin.current_price;
        newIcons[coin.id] = coin.image;
      })

      setPrices(newPrices);
      setIcons(newIcons);
    } catch (error) {
      console.log("Failed to fetch coin data", error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) { 
    return (
      <View className="flex-1 bg-brand-gray justify-center items-center">
        <ActivityIndicator size="large" color="#00ff00" />
      </View>
    )
  }

  useState(() => {
    fetchCoinData();
  }, [holdings]);  

  return (
    <View className="flex-1 bg-brand-gray">
      <StatusBar  style="light"/>
      <ScrollView contentContainerStyle={{ paddingBottom: 80 }}>
        <TotalValue data={totalPrice} />
        
        {holdings.map((item) => {
          let priceUsd = prices[item.id] ?? 0;
          let iconUrl = icons[item.id];
          
          return (
            <PortfolioItem key={item.symbol} data={{ ...item, priceUsd, icon: iconUrl, }} />
          );
        })}
      
      </ScrollView>
      <Navbar />
    </View>
  );
}
