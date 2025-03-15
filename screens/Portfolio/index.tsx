import React, { useState, useEffect } from 'react';
import { restClient } from '@polygon.io/client-js';
import { StatusBar } from 'expo-status-bar';
import { Text, View, ScrollView, ActivityIndicator } from "react-native";
import { Navbar } from '../../components/Navbar';
import { TotalValue } from '../../components/TotalValue';
import { PortfolioItem } from '../../components/PortfolioItem'
import { ItemData } from 'types';
import { COINGECKO_API_KEY, POLYGON_IO_API_KEY } from "@env";
import { db } from "../../database"
import { useFocusEffect, useRoute } from '@react-navigation/native';

import '../../global.css';

export default function PortfolioScreen() {
  const route = useRoute();
  const newData = route.params?.data;

  const [holdings, setHoldings] = useState<ItemData[]>([])
  const [prices, setPrices] = useState<Record<string, number>>({});
  const [icons, setIcons] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [totalValue, setTotalValue] = useState(0);
  const [allCoinData, setAllCoinData] = useState();
  const [databaseExists, setDatabaseExists] = useState(false);
  const [allStockData, setAllStockData] = useState();

  const statement = `
  CREATE TABLE IF NOT EXISTS test (
    id TEXT PRIMARY KEY NOT NULL,
    symbol TEXT NOT NULL,
    amount REAL NOT NULL,
    note TEXT
  );
`;

useFocusEffect(
  React.useCallback(() => {
    fetchPersonalCoinData();
  }, [])
)

  useEffect(() => {
    const fetchAllData = async () => {
      await fetchPersonalCoinData();
      await fetchAllCoinData();
      await fetchAllStockData();
    }

    const setupDatabase = async () => {
      try {
        if (!databaseExists) {
          await db.execAsync(statement);
          setDatabaseExists(true);  
        }
        await fetchAllData();
      } catch (error) {
        await db.execAsync("ROLLBACK;");
        console.error("Database setup failed:", error);
      }
    };

    setupDatabase();
  }, []);


  useEffect(() => {
    const insertData = async (data) => {
      try {
        console.log("Attempting to insert:", data.id, data.symbol, data.amount);
        
        const existingRecord = await db.getAllAsync(`SELECT amount FROM test WHERE id = '${data.id}'`);
        
        if (existingRecord.length > 0) {
          if (newData.mode == "update") {
            await db.execAsync(`
              UPDATE test 
              SET amount = ${data.amount}, 
              note = '${data.note}'
              WHERE id = '${data.id}';
            `);
          } else {
            await db.execAsync(`
              UPDATE test 
              SET amount = amount + ${parseFloat(data.amount)}, 
              note = '${data.note}'
              WHERE id = '${data.id}';
            `);
          }
          
          console.log(`Updated holdings for ${data.symbol}, added ${data.amount}`);
        } else {
          await db.execAsync(`
            INSERT INTO test (id, symbol, amount, note) 
            VALUES ('${data.id}', '${data.symbol}', ${parseFloat(data.amount)}, '${data.notes}');
          `);
          console.log(`Added new holding for ${data.symbol}`);
        }
        
        await fetchPersonalCoinData();
      } catch (error) {
        console.error("Failed to insert data:", error);
        try {
          const existing = await db.getAllAsync(`SELECT * FROM test WHERE id = '${data.id}'`);
          console.log("Existing records with this ID:", existing);
        } catch (e) {
          console.error("Failed to check existing records:", e);
        }
      }
    };

    const doInsertAndFetch = async () => {
      if (newData && databaseExists) {
        await insertData(newData);
        await fetchPersonalCoinData();
      }
    }
    
    doInsertAndFetch()
  }, [newData, databaseExists]);

  const fetchAllStockData = async () => {
    try {
      setLoading(true);
      const rest = restClient(POLYGON_IO_API_KEY)
      
      const data = await rest.stocks.aggregatesGroupedDaily("2025-03-12", {
        adjusted: "true",
        include_otc: "true"
      }) 

      const sortedData = data.results.sort((a, b) => b.v - a.v);
      const top1000ByVolume = sortedData.slice(0, 1000);

      setAllStockData(top1000ByVolume)
    } catch (e) {
      console.error("Couldn't fetch stock data, error: ", e.message)
    } finally {
      setLoading(false)
    }
  }
  

  const fetchAllCoinData = async () => {
    try {
      setLoading(true);

      const url = "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc";
      const options = {
        method: 'GET',
        headers: {
          accept: 'application/json',
          'x-cg-demo-api-key': COINGECKO_API_KEY
        }
      };

      const response = await fetch(url, options);
      let coinData = await response.json();
      setAllCoinData(coinData);

    } catch (e) {
      console.error("Couldn't fetch all coin data, error: ", e)
    } finally {
      setLoading(false)
    }
  }

  const fetchPersonalCoinData = async () => {
    try {
      setLoading(true);
      let runningTotal = 0;
  
      const dbData = await db.getAllAsync("SELECT id, symbol, amount, note FROM test");
  
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
  
      setHoldings(dbData);

      console.log("DB data", dbData)
  
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

  return (
    <View className="flex-1 bg-brand-gray">
      {loading && (
        <View className="absolute inset-0 flex-1 justify-center items-center bg-brand-gray">
          <ActivityIndicator size="large" color="#5c5c5c" />
        </View>
      )}
  
      <StatusBar style="light" />
      <TotalValue data={totalValue} />
      <ScrollView contentContainerStyle={{ paddingBottom: 80 }}>
  
      {holdings.length > 0 &&
        [...holdings] 
          .sort((a, b) => (prices[b.id] * b.amount) - (prices[a.id] * a.amount))
          .map((item) => (
            <PortfolioItem 
              key={item.symbol} 
              data={{ 
                ...item, 
                priceUsd: prices[item.id] ?? 0, 
                icon: icons[item.id], 
                note: item.note 
              }} 
            />
          ))}
      </ScrollView>
  
      <Navbar coin={allCoinData} stock={allStockData}/>
    </View>
  );  
}
