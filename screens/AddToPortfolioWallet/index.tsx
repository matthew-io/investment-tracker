import React, { useEffect, useState } from "react";
import { View, Text, ActivityIndicator } from "react-native";
import { useRoute } from "@react-navigation/native";
import { ETHERSCAN_API_Key } from "@env";
import { ScreenHeader } from "components/ScreenHeader";
import { AddToPortfolioConfirm } from "components/AddToPortfolioConfirm";
import { formatEther } from "ethers";
import { Navbar } from "components/Navbar";
import { OptionComponent } from "components/OptionComponent";


export default function WalletDetailScreen() {
  const route = useRoute();
  const { walletInfo } = route.params as { walletInfo: { type: string; address: string } };
  const [walletData, setWalletData] = useState<any>(null);
  const [loading, setLoading] = useState(true);


  useEffect(() => {
    setLoading(true);
    const fetchWalletData = async () => {
      try {
        if (walletInfo.type === "ethereum") {
          const response = await fetch(
            `https://api.etherscan.io/api?module=account&action=balance&address=${walletInfo.address}&tag=latest&apikey=${ETHERSCAN_API_Key}`
          );
          const data = await response.json();
          setWalletData(data);
        } else if (walletInfo.type === "bitcoin") {
          const response = await fetch(
            `https://api.blockcypher.com/v1/btc/main/addrs/${walletInfo.address}/balance`
          );
          const data = await response.json();
          setWalletData(data);
        }
      } catch (error) {
        console.error("Error fetching wallet data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchWalletData();
  }, [walletInfo]);

  if (loading || !walletData) {
    return (
      <View className="flex-1 justify-center items-center">
        <ActivityIndicator size="large" />
      </View>
    );
  }

  const options = [
    {
      header: `Amount Held (${walletInfo.type === "bitcoin" ? "BTC" : "ETH"})`,
      description: "Amount held in scanned wallet",
      option: "EnterText",
      textValue:
        walletInfo.type === "bitcoin"
          ? (walletData.balance / 1e8).toFixed(8)
          : walletData.result
            ? formatEther(walletData.result)
            : "",
    },
  ];


  return (
    <View className="flex-1 h-full bg-brand-gray">
      <ScreenHeader
        data={`Wallet: ${walletInfo.address.slice(0, 3)}...${walletInfo.address.slice(-3)}`}
        image={
          walletInfo.type === "bitcoin"
            ? "https://cryptologos.cc/logos/bitcoin-btc-logo.png"
            : "https://www.iconarchive.com/download/i109534/cjdowner/cryptocurrency-flat/Ethereum-ETH.1024.png"
        }
      />

      {options.map((option) => (
        <OptionComponent key={option.header} data={option} />
      ))}

      {walletInfo.type === "ethereum" && walletData?.result ? (
        <AddToPortfolioConfirm
          data={{
            id: "ethereum",
            symbol: "eth",
            date: Date.now(),
            amount: formatEther(walletData.result),
            type: "crypto",
          }}
        />
      ) : walletInfo.type === "bitcoin" && walletData?.balance ? (
        <AddToPortfolioConfirm
          data={{
            id: "bitcoin",
            symbol: "btc",
            date: Date.now(),
            amount: (walletData.balance / 1e8).toFixed(8),
            type: "crypto",
          }}
        />
      ) : (
        <Text className="text-center text-red-500 mt-6">
          Unsupported wallet type or failed to load data.
        </Text>
      )}

      <Navbar />
    </View>
  );
}
