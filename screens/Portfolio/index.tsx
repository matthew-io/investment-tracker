import React, { useState, useEffect, useContext } from 'react';
import { restClient } from '@polygon.io/client-js';
import { StatusBar } from 'expo-status-bar';
import { Text, View, ScrollView, ActivityIndicator } from "react-native";
import { Navbar } from '../../components/Navbar';
import { TotalValue } from '../../components/TotalValue';
import { PortfolioItem } from '../../components/PortfolioItem';
import { ItemData } from 'types';
import { Camera, CameraType } from "expo-camera";
import { COINGECKO_API_KEY, POLYGON_IO_API_KEY } from "@env";
import { db } from "../../database";
import { useFocusEffect, useNavigation, useRoute } from '@react-navigation/native';
import { insertAsset, insertTransactions, setupDatabase } from 'utils/dbUtil';
import '../../global.css';
import { SettingsContext } from 'screens/Settings/settingsContext';

export default function PortfolioScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const newData = route.params?.data;

  console.log("New data: ", newData)

  const { settings } = useContext(SettingsContext);
  const userCurrency = settings.currency;

  const [holdings, setHoldings] = useState<ItemData[]>([]);
  const [prices, setPrices] = useState<Record<string, number>>({});
  const [icons, setIcons] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [totalValue, setTotalValue] = useState(0);
  const [allCoinData, setAllCoinData] = useState<any>(null);
  const [databaseExists, setDatabaseExists] = useState(false);
  const [allStockData, setAllStockData] = useState<any>(null);
  const [hasInserted, setHasInserted] = useState(false);
  const [stockHoldings, setStockHoldings] = useState<any[]>([]);
  const [stockPrices, setStockPrices] = useState<Record<string, number>>({});
  const [stockTotalValue, setStockTotalValue] = useState<number | undefined>(undefined);
  const [conversionRates, setConversionRates] = useState<Record<string, number>>({});


  useEffect(() => {
    const fetchConversionRates = async () => {
      try {
        if (userCurrency !== "USD") {
          const response = await fetch('https://api.exchangerate-api.com/v4/latest/USD');
          const data = await response.json();
          setConversionRates(data.rates);
        }
      } catch (error) {
        console.error("Failed to fetch conversion rates:", error);
      }
    };
    fetchConversionRates();
  }, [userCurrency]);

  const convertPrice = (usdPrice: number): number => {
    if (userCurrency === "USD" || !conversionRates[userCurrency]) {
      return usdPrice;
    }
    return usdPrice * conversionRates[userCurrency];
  };

  useEffect(() => {
    const initDB = async () => {
      try {
        await setupDatabase();
        await fetchAllCoinData();
        await fetchAllStockData();
        setDatabaseExists(true);
      } catch (err) {
        console.error("Couldn't initialize database, ", err);
      }
    };
    initDB();
  }, []);

  useEffect(() => {
    if (combinedHoldings.length === 0) {
      setTotalValue(0);
      return;
    }

    let grandTotal = 0;
    for (const item of combinedHoldings) {
      const price = getPrice(item);
      grandTotal += (price * item.quantity);
    }
    setTotalValue(grandTotal);
  }, [combinedHoldings, allStockData, prices, conversionRates]);

  useEffect(() => {
    if (databaseExists) {
      fetchPersonalCoinData();
      fetchPersonalStockData();
    }
  }, [databaseExists]);

  useEffect(() => {
    if (!databaseExists || !newData || hasInserted) return;

    const doInsertAndFetch = async () => {
      try {
        console.log("New data", newData.amount);

        await insertAsset(
          newData.id, 
          newData.type,     
          newData.symbol,   
          newData.name      
        );

        const txToInsert = {
          tx_id: `tx_${Date.now()}`,  
          asset_id: newData.id,
          quantity: parseFloat(newData.amount),
          price: parseFloat(newData.price ?? 0),
          date: newData.date || new Date().toISOString(),
          note: newData.note ?? ""
        };

        if (newData.mode === "update") {
          await db.execAsync(`
            DELETE FROM transactions
            WHERE asset_id = '${newData.id}';
          `);
        }

        await insertTransactions(txToInsert);
        await fetchPersonalCoinData(); 
        await fetchPersonalStockData();

        setHasInserted(true);
      } catch (err) {
        console.error("Failed to insert newData:", err);
      }
    };

    doInsertAndFetch();
  }, [newData, databaseExists, hasInserted]);

  const fetchAllStockData = async () => {
    try {
      setLoading(true);
      const rest = restClient(POLYGON_IO_API_KEY);
      
      const data = await rest.stocks.aggregatesGroupedDaily("2025-03-12", {
        adjusted: "true",
        include_otc: "true"
      });
      
      const sortedData = data.results.sort((a, b) => b.v - a.v);
      const top1000ByVolume = sortedData.slice(0, 1000);
      setAllStockData(top1000ByVolume);
    } catch (err) {
      console.error("Couldn't fetch stock data, error: ", err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchAllCoinData = async () => {
    try {
      setLoading(true);
      const url = `https://api.coingecko.com/api/v3/coins/markets?vs_currency=${userCurrency}&order=market_cap_desc`;
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
      console.error("Couldn't fetch all coin data, error: ", e);
    } finally {
      setLoading(false);
    }
  };

  const fetchPersonalCoinData = async () => {
    try {
      setLoading(true);
  
      const query = `
        SELECT
          a.asset_id AS id,
          a.symbol,
          a.name,
          IFNULL(SUM(t.quantity), 0) AS quantity
        FROM assets a
        LEFT JOIN transactions t
          ON a.asset_id = t.asset_id
        WHERE a.type = 'crypto'
        GROUP BY a.asset_id;
      `;
      const dbData = await db.getAllAsync(query);
      console.log("DB data:", dbData);
  
      if (!dbData || dbData.length === 0) {
        console.log("No crypto holdings found in database.");
        setHoldings([]);
        return;
      }
  
      const coinIds = dbData.map((row) => row.id).join("%2C");
      const url = `https://api.coingecko.com/api/v3/coins/markets?vs_currency=${userCurrency}&ids=${coinIds}`;
      const options = {
        method: "GET",
        headers: {
          accept: "application/json",
          "x-cg-demo-api-key": COINGECKO_API_KEY,
        },
      };
      const response = await fetch(url, options);
      const coinData = await response.json();

      console.log("Coin data: ", coinData);
  
      let runningTotal = 0;
      const newPrices: Record<string, number> = {};
      const newIcons: Record<string, string> = {};
  
      coinData.forEach((coin: any) => {
        const match = dbData.find((row) => row.id === coin.id);
        if (match) {
          const quantity = parseFloat(match.quantity);
          runningTotal += coin.current_price * quantity;
          newPrices[coin.id] = coin.current_price;
          newIcons[coin.id] = coin.image;
        }
      });
  
      setPrices(newPrices);
      setIcons(newIcons);
  
      const newHoldings = dbData.map((row) => ({
        id: row.id,
        symbol: row.symbol,
        name: row.name,
        quantity: parseFloat(row.quantity),
      }));

      setHoldings(newHoldings);
    } catch (error) {
      console.log("Failed to fetch coin data:", error);
    } finally {
      setLoading(false);
    }
  };

  const getPrice = (item: any): number => {
    if (item.type === "crypto") {
      return prices[item.id] ?? 0;
    } else {
      const match = allStockData?.find((d: any) => d.T === item.symbol);
      return match ? convertPrice(match.c) : 0;
    }
  };

  const fetchPersonalStockData = async () => {
    try {
      setLoading(true);
  
      const query = `
        SELECT
          a.asset_id AS id,
          a.symbol,
          a.name,
          IFNULL(SUM(t.quantity), 0) AS quantity
        FROM assets a
        LEFT JOIN transactions t
          ON a.asset_id = t.asset_id
        WHERE a.type = 'stock'
        GROUP BY a.asset_id;
      `;
      const dbData = await db.getAllAsync(query);
      console.log("Stock DB data:", dbData);
  
      if (!dbData || dbData.length === 0) {
        console.log("No stock holdings found in DB.");
        setStockHoldings([]);
        setStockTotalValue(0);
        return;
      }
  
      let runningTotal = 0;
      const placeholderPrices: Record<string, number> = {};
  
      dbData.forEach((row) => {
        const quantity = parseFloat(row.quantity);
        const pricePerShare = 0.01;
        runningTotal += pricePerShare * quantity;
        placeholderPrices[row.symbol] = pricePerShare;
      });
  
      const newHoldings = dbData.map((row) => ({
        id: row.id,
        symbol: row.symbol,
        name: row.name,
        quantity: parseFloat(row.quantity),
      }));
      setStockHoldings(newHoldings);
      console.log("Successfully fetched personal stock data with placeholders.");
    } catch (error) {
      console.error("Failed to fetch personal stock data:", error);
    } finally {
      setLoading(false);
    }
  };

  const combinedHoldings = [
    ...holdings.map((h) => ({ ...h, type: "crypto" })),
    ...stockHoldings.map((s) => ({ ...s, type: "stock" })),
  ];

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
        {combinedHoldings.length > 0 &&
          combinedHoldings
            .sort((a, b) => {
              const aPrice = getPrice(a);
              const bPrice = getPrice(b);
              return bPrice * b.quantity - aPrice * a.quantity;
            })
            .map((item) => {
              const priceUsd = getPrice(item);
              return (
                <PortfolioItem
                  key={item.symbol}
                  data={{
                    ...item,
                    priceUsd,
                    icon: item.type === "crypto" ? icons[item.id] : undefined,
                    note: item.note ?? "",
                  }}
                />
              );
            })}
      </ScrollView>
      <Navbar coin={allCoinData} stock={allStockData}/>
    </View>
  );
}
