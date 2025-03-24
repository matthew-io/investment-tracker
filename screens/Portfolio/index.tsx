import React, { useState, useEffect, useContext } from 'react';
import { restClient } from '@polygon.io/client-js';
import { StatusBar } from 'expo-status-bar';
import { Text, View, ScrollView, ActivityIndicator } from "react-native";
import { Navbar } from '../../components/Navbar';
import { TotalValue } from '../../components/TotalValue';
import { PortfolioItem } from '../../components/PortfolioItem';
import { ItemData } from 'types';
import { COINGECKO_API_KEY, POLYGON_IO_API_KEY } from "@env";
import { db } from "../../database";
import { useNavigation, useRoute } from '@react-navigation/native';
import { insertAsset, insertPortfolio, insertTransactions, setupDatabase, updateTransaction } from 'utils/dbUtil';
import '../../global.css';
import { SettingsContext } from 'screens/Settings/settingsContext';
import * as Notifications from "expo-notifications"


export default function PortfolioScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const { settings } = useContext(SettingsContext);
  const userCurrency = settings.currency;
  

  const portfolioId = settings.currentPortfolioId; 
  const newData = route.params?.data;

  const [holdings, setHoldings] = useState<ItemData[]>([]);
  const [prices, setPrices] = useState<Record<string, number>>({});
  const [icons, setIcons] = useState<Record<string, string>>({});
  const [highs, setHighs] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(false);
  const [totalValue, setTotalValue] = useState(0);
  const [allCoinData, setAllCoinData] = useState<any>(null);
  const [databaseExists, setDatabaseExists] = useState(false);
  const [allStockData, setAllStockData] = useState<any>(null);
  const [hasInserted, setHasInserted] = useState(false);
  const [stockHoldings, setStockHoldings] = useState<any[]>([]);
  const [conversionRates, setConversionRates] = useState<Record<string, number>>({});
  const [pastHighs, setPastHighs] = useState<Record<string, number>>({});
  const [portfolioChange, setPortfolioChange] = useState(0);
  const [lastCoinFetch, setLastCoinFetch] = useState<number | null>(null);
  const [lastStockFetch, setLastStockFetch] = useState<number | null>(null);
  const [lastPersonalCoinFetch, setLastPersonalCoinFetch] = useState<Record<string, number>>({});
  const [lastPersonalStockFetch, setLastPersonalStockFetch] = useState<Record<string, number>>({});
  const [lastNotifiedAt, setLastNotifiedAt] = useState<number | null>(null);
  const [cryptoLoaded, setCryptoLoaded] = useState(false);
  const [stocksLoaded, setStocksLoaded] = useState(false);
  const [priceChanges, setPriceChanges] = useState<Record<string, number>>({});

  const textColor = settings.darkMode ? "text-white" : "text-black"
  const bgColor = settings.darkMode ? "bg-brand-gray" : "bg-brand-white"
  const rest = restClient(POLYGON_IO_API_KEY);

  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true,
      shouldPlaySound: true,
      shouldSetBadge: false,
    }),
  });

  useEffect(() => {
    (async () => {
      const { status } = await Notifications.requestPermissionsAsync();
      if (status !== 'granted') {
        alert('Please enable notifications in settings');
      }
    })();
  }, []);
  
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
    const combinedHoldings = [
      ...holdings.map((h) => ({ ...h, type: "crypto" })),
      ...stockHoldings.map((s) => ({ ...s, type: "stock" })),
    ];

    if (combinedHoldings.length === 0) {
      setTotalValue(0);
      return;
    }

    let grandTotal = 0;
    for (const item of combinedHoldings) {
      const price = getPrice(item);
      grandTotal += price * item.quantity;
    }
    setTotalValue(grandTotal);
  }, [holdings, stockHoldings, allStockData, prices, conversionRates]);

  useEffect(() => {
    if (databaseExists) {
      setCryptoLoaded(false);
      setStocksLoaded(false);
      fetchPersonalCoinData();
      fetchPersonalStockData();
    }
  }, [databaseExists]);

  useEffect(() => {
    if (!databaseExists || !newData || hasInserted) {
     
      setLoading(false);
      return;
    }
    
    const assetType = newData.type || "crypto";

    setLoading(true);
    const doUpdateAsset = async () => {
      try {
        await insertAsset(
          newData.id,
          portfolioId,
          assetType,
          newData.symbol,
        );

        const assetRows = await db.getAllAsync(`SELECT * FROM assets WHERE asset_id = '${newData.id}';`);
        console.log("Asset row after upsert:", assetRows);

        console.log("New data: ", newData)
    
        const txData = {
          tx_id: `tx_${Date.now()}`,
          asset_id: newData.id,
          quantity: parseFloat(newData.amount),
          price: parseFloat(newData.price ?? 0),
          date: newData.date || new Date().toISOString(),
          note: newData.notes ?? "",
          portfolio_id: portfolioId,
        };
    
        if (newData.mode === "update") {
          await db.execAsync(`
            DELETE FROM transactions
            WHERE asset_id = '${newData.id}' AND portfolio_id = '${portfolioId}';
          `);
          await insertTransactions(txData);
        } else {
          await insertTransactions(txData);
        }
    
        await fetchPersonalCoinData();
        await fetchPersonalStockData();
    
        setHasInserted(true);
      } catch (err) {
        console.error("Failed to update asset:", err);
      } finally {
        setLoading(false);
      }
    };
    
    doUpdateAsset();
  }, [newData, databaseExists, hasInserted]);
  
  
  const fetchAllStockData = async () => {
    const now = Date.now();
    if (lastStockFetch && now - lastStockFetch < 60 * 1000) {
      console.log("Using cached stock data");
      return;
    }
  
    try {
      setLoading(true);
      const data = await rest.stocks.aggregatesGroupedDaily("2025-03-20", {
        adjusted: "true",
        include_otc: "true"
      });
      const sortedData = data.results.sort((a, b) => b.v - a.v);
      const top1000ByVolume = sortedData.slice(0, 1000);
      setAllStockData(top1000ByVolume);
      setLastStockFetch(now); 
    } catch (err) {
      console.error("Stock API rate limit", err.message);
    } finally {
      setLoading(false);
    }
  };
  
  const computeGainersAndLosers = (holdings) => {
    if (!holdings.length) return { biggestGainer: null, biggestLoser: null };
    const sorted = [...holdings].sort((a, b) => (b.high24h || 0) - (a.high24h || 0));
    return {
      biggestGainer: sorted[0],
      biggestLoser: sorted[sorted.length - 1],
    };
  }

  const schedulePortfolioNotification = async ({
    totalValue,
    portfolioChange,
    holdings,
  }) => {
    console.log("combined holdings 2: ", holdings)
    const { biggestGainer, biggestLoser } = computeGainersAndLosers(holdings);

    const { status } = await Notifications.getPermissionsAsync();
  if (status !== 'granted') {
    const { status: newStatus } = await Notifications.requestPermissionsAsync();
    if (newStatus !== 'granted') {
      alert('Failed to get push token for push notification!');
      return;
    }
  }
  
    const sign = portfolioChange >= 0 ? 'up' : 'down';
    const pctString = portfolioChange.toFixed(2);
    const bodyLines = [];
  
    if (biggestGainer) {
      bodyLines.push(`Biggest gainer: ${biggestGainer.symbol.toUpperCase()} (${(biggestGainer.change24h || 0).toFixed(2)}%)`);
    }
    if (biggestLoser) {
      bodyLines.push(`Biggest loser: ${biggestLoser.symbol.toUpperCase()} (${(biggestLoser.change24h || 0).toFixed(2)}%)`);
    }
  
    await Notifications.scheduleNotificationAsync({
      content: {
        title: `Portfolio is ${sign} ${pctString}%`,
        body: bodyLines.join('\n'),
      },
      trigger: {
        hour: 0,
        minute: 0,
        second: 10,
        repeats: true,
      },
    });
  }

  const fetchAllCoinData = async () => {
    const now = Date.now();
    if (lastCoinFetch && now - lastCoinFetch < 60 * 1000) {
      console.log("Using cached coin data");
      return;
    }
  
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
      setLastCoinFetch(now);
    } catch (e) {
      console.error("Couldn't fetch all coin data, error: ", e);
    } finally {
      setLoading(false);
    }
  };
  
  const fetchPersonalCoinData = async () => {
    const now = Date.now();
    if (lastPersonalCoinFetch[portfolioId] && now - lastPersonalCoinFetch[portfolioId] < 60 * 1000) {
      console.log("Using cached personal coin data");
      return;
    }
  
    try {
      setLoading(true);
  
      const query = `
        SELECT
          a.asset_id AS id,
          a.symbol,
          IFNULL(SUM(t.quantity), 0) AS quantity
        FROM assets a
        LEFT JOIN transactions t ON a.asset_id = t.asset_id
        WHERE a.type = 'crypto' AND a.portfolio_id = '${portfolioId}'
        GROUP BY a.asset_id;
      `;
      const dbData = await db.getAllAsync(query);
  
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
  
      const newPrices: Record<string, number> = {};
      const newIcons: Record<string, string> = {};
      const newHighs: Record<string, number> = {};  
  
      const newChanges: Record<string, number> = {};

      coinData.forEach((coin: any) => {
        const match = dbData.find((row) => row.id === coin.id);
        if (match) {
          newPrices[coin.id] = coin.current_price;
          newIcons[coin.id] = coin.image;
          newHighs[coin.id] = coin.high_24h;
          newChanges[coin.id] = coin.price_change_percentage_24h_in_currency ?? 0;
        }
      });

      setPriceChanges(newChanges);
      setPrices(newPrices);
      setIcons(newIcons);
      setHighs(newHighs);  
  
      const newHoldings = dbData.map((row) => ({
        id: row.id,
        symbol: row.symbol,
        name: row.name,
        quantity: parseFloat(row.quantity),
      }));
      setHoldings(newHoldings);
  
      setLastPersonalCoinFetch(prev => ({
        ...prev,
        [portfolioId]: now,
      }));
    } catch (error) {
      console.log("Failed to fetch coin data:", error);
    } finally {
      setCryptoLoaded(true);
      setLoading(false);
    }
  };
  
  const fetchPersonalStockData = async () => {
    const now = Date.now();
    if (lastPersonalStockFetch[portfolioId] && now - lastPersonalStockFetch[portfolioId] < 60 * 1000) {
      console.log("Using cached personal stock data");
      return;
    }
  
    try {
      setLoading(true);
  
      const query = `
        SELECT
          a.asset_id AS id,
          a.symbol,
          a.name,
          IFNULL(SUM(t.quantity), 0) AS quantity
        FROM assets a
        LEFT JOIN transactions t ON a.asset_id = t.asset_id
        WHERE a.type = 'stock' AND a.portfolio_id = '${portfolioId}'
        GROUP BY a.asset_id;
      `;
      const dbData = await db.getAllAsync(query);
  
      if (!dbData || dbData.length === 0) {
        setStockHoldings([]);
        return;
      }
  
      dbData.forEach((item) => {
        setTimeout(() => {
          rest.stocks.previousClose(item.symbol, { adjusted: "true" }).then((data) => {
            if (data.results && data.results.length > 0) {
              const pastHigh = data.results[0].h;
              setPastHighs((prev) => ({ ...prev, [item.symbol]: pastHigh }));
            }
          });
        }, 100);
      });
  
      const newHoldings = dbData.map((row) => ({
        id: row.id,
        symbol: row.symbol,
        name: row.name,
        quantity: parseFloat(row.quantity),
      }));
      setStockHoldings(newHoldings);
  
      setLastPersonalStockFetch(prev => ({
        ...prev,
        [portfolioId]: now,
      }));
    } catch (error) {
      console.error("Failed to fetch personal stock data:", error);
    } finally {
      setStocksLoaded(true);
      setLoading(false);
    }
  };
    
  const getPrice = (item: any): number => {
    if (item.type === "crypto") {
      return prices[item.id] ?? 0;
    } else {
      if (!allStockData) return 0;
      const match = allStockData.find((d: any) => d.T === item.symbol);
      return match ? convertPrice(match.c) : 0;
    }
  };

const combinedHoldings = [
  ...holdings.map((h) => ({ ...h, type: "crypto" })),
  ...stockHoldings.map((s) => ({ ...s, type: "stock" })), 
];


useEffect(() => {
  if (!cryptoLoaded || !stocksLoaded || !combinedHoldings.length) {
    setPortfolioChange(0);
    return;
  }

  let totalNow = 0;
  let totalPast = 0;

  for (const asset of combinedHoldings) {
    const todayPrice = getPrice(asset);
    totalNow += todayPrice * asset.quantity;

    if (asset.type === "crypto") {
      const changePct = priceChanges[asset.id] ?? 0;
      const past = todayPrice / (1 + changePct / 100);
      totalPast += past * asset.quantity;
    } else {
      const yesterdayPrice = pastHighs[asset.symbol] ?? 0;
      totalPast += yesterdayPrice * asset.quantity;
    }
  }

  const pct = totalPast > 0 ? ((totalNow - totalPast) / totalPast) * 100 : 0;
  setPortfolioChange(pct);
}, [combinedHoldings, highs, pastHighs, cryptoLoaded, stocksLoaded]);

const NOTIFY_INTERVAL_MS = 6 * 60 * 60 * 1000; 

useEffect(() => {
  const now = Date.now();

  const ready = cryptoLoaded && stocksLoaded && combinedHoldings.length > 0;

  if (
    ready &&
    (!lastNotifiedAt || now - lastNotifiedAt > NOTIFY_INTERVAL_MS)
  ) {
    schedulePortfolioNotification({
      totalValue,
      portfolioChange,
      holdings: combinedHoldings,
    });

    setLastNotifiedAt(now);
  }
}, [combinedHoldings, portfolioChange, cryptoLoaded, stocksLoaded]);




return (
  <View className={`flex-1 ${bgColor}`}>
    {loading && (
      <View className={`absolute inset-0 flex-1 justify-center items-center ${bgColor}`}>
        <ActivityIndicator size="large" color="#5c5c5c" />
      </View>
    )}
    <StatusBar style="light" />
    <TotalValue data={totalValue} portfolioChange={portfolioChange} />
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
            let change24h;
            if (item.type === "stock") {
              const todayData = allStockData && allStockData.find((d: any) => d.T === item.symbol);
              const todayHigh = todayData ? todayData.h : 0;
              const pastHigh = pastHighs[item.symbol] || 0;
              change24h = pastHigh ? ((todayHigh - pastHigh) / pastHigh) * 100 : 0;
            }
            const itemHigh24h = item.type === "crypto" ? highs[item.id] : undefined;
            return (
              <PortfolioItem
                key={item.symbol}
                data={{
                  ...item,
                  priceUsd,
                  icon: item.type === "crypto" ? icons[item.id] : undefined,
                  note: item.note ?? "",
                  high24h: itemHigh24h,
                  change24h,
                }}
              />
            );
          })}
    </ScrollView>
    <Navbar coin={allCoinData} stock={allStockData} />
  </View>
);

}
