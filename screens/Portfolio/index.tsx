import React, { useState, useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { Text, View, ScrollView, ActivityIndicator } from "react-native";
import { Navbar } from '../../components/Navbar';
import { TotalValue } from '../../components/TotalValue';
import { PortfolioItem } from '../../components/PortfolioItem'
import { ItemData } from 'types';
import { COINGECKO_API_KEY } from "@env";
import { db } from "../../database"

import '../../global.css';

export default function PortfolioScreen() {
  const [holdings, setHoldings] = useState<ItemData[]>([])

  const [prices, setPrices] = useState<Record<string, number>>({});
  const [icons, setIcons] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [totalValue, setTotalValue] = useState(0);

  const fetchCoinData = async () => {
    try {
      setLoading(true);
      let runningTotal = 0;
  
      const dbData = await db.getAllAsync("SELECT id, symbol, amount FROM test");
  
      if (dbData.length === 0) {
        console.log("No holdings found in database.");
        setLoading(false);
        return;
      }
  
      const coinIds = dbData.map((coin) => coin.id).join("%2C");
  
      const url = `https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=${coinIds}`;
      const options = {
        method: 'GET',
        headers: { accept: 'application/json', 'x-cg-demo-api-key': COINGECKO_API_KEY }
      };
  
      const response = await fetch(url, options);
      const data = await response.json();
  
      setHoldings((prevHoldings) => {
        const existingIds = new Set(prevHoldings.map((h) => h.id));
        const newHoldings = dbData
          .filter((holding) => !existingIds.has(holding.id))
          .map((holding) => ({
            id: holding.id,
            symbol: holding.symbol,
            amount: holding.amount,
          }));
        return [...prevHoldings, ...newHoldings];
      });
  
      const newPrices: Record<string, number> = {};
      const newIcons: Record<string, string> = {};
  
      data.forEach((coin: any) => {
        const amount = dbData.find((h) => h.id === coin.id)?.amount ?? 0;
        runningTotal += parseFloat(coin.current_price * amount);
        newPrices[coin.id] = coin.current_price;
        newIcons[coin.id] = coin.image;
      });
  
      setPrices(newPrices);
      setIcons(newIcons);
      setTotalValue(runningTotal);
    } catch (error) {
      console.log("Failed to fetch coin data", error);
    } finally {
      setLoading(false);
    }
  };

  const statement = `
    CREATE TABLE IF NOT EXISTS test (
      id TEXT PRIMARY KEY NOT NULL,
      symbol TEXT NOT NULL,
      amount REAL NOT NULL
    );
  `;

  useEffect(() => {
    const setupDatabase = async () => {
      try {
        await db.execAsync(statement);
        console.log("Table created successfully.");
        await fetchCoinData();
      } catch (error) {
        await db.execAsync("ROLLBACK;");
        console.error("Database setup failed:", error);
      }
    };

    setupDatabase();
  }, []);

  return (
    <View className="flex-1 bg-brand-gray">
      {loading && (
        <View className="absolute inset-0 flex-1 justify-center items-center bg-brand-gray">
          <ActivityIndicator size="large" color="#5c5c5c" />
        </View>
      )}
  
      <StatusBar style="light" />
      <ScrollView contentContainerStyle={{ paddingBottom: 80 }}>
        <TotalValue data={totalValue} />
  
        {holdings.length > 0 &&
          holdings.map((item) => (
            <PortfolioItem key={item.symbol} data={{ ...item, priceUsd: prices[item.id] ?? 0, icon: icons[item.id] }} />
          ))}
      </ScrollView>
  
      <Navbar />
    </View>
  );  
}
