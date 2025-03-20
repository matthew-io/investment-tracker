import React, { useEffect, useState } from "react";
import { View, Text, ActivityIndicator } from "react-native";
import { useRoute } from "@react-navigation/native";
import { ETHERSCAN_API_Key } from "@env";
import { ScreenHeader } from "components/ScreenHeader";
import { AddToPortfolioConfirm } from "components/AddToPortfolioConfirm";
import { utils } from "ethers";

export default function WalletDetailScreen() {
  const route = useRoute();
  const { walletInfo } = route.params as { walletInfo: { type: string; address: string } };
  const [walletData, setWalletData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
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

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: "#f0f0f0" }}>
      <ScreenHeader data={walletInfo.address} />
      {walletInfo.type === "ethereum" && walletData?.result ? (
        <AddToPortfolioConfirm
          data={{
            id: "ethereum",
            symbol: "eth",
            date: Date.now(),
            amount: utils.formatEther(walletData.result),
            type: "crypto",
          }}
        />
      ) : (
        <Text>Bitcoin wallet or unsupported type</Text>
      )}
    </View>
  );
}
