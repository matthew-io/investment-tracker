import { useNavigation } from "@react-navigation/native";
import { CameraView } from "expo-camera";
import React from "react";
import { SafeAreaView, Text, View } from "react-native";
import { Overlay } from "./Overlay";

export default function ScannerScreen() {
const navigation = useNavigation();


const parseWalletData = (qrData: string): { type: string; address: string } => {
  if (qrData.startsWith("ethereum:")) {
    return { type: "ethereum", address: qrData.replace("ethereum:", "").trim() };
  } else if (qrData.startsWith("bitcoin:")) {
    return { type: "bitcoin", address: qrData.replace("bitcoin:", "").trim() };
  } else {
    if (qrData.startsWith("0x")) {
      return { type: "ethereum", address: qrData.trim() };
    }
    return { type: "bitcoin", address: qrData.trim() };
  }
}

const handleQrCodeScanner = (barcode: any) => {
  console.log("Raw QR data:", barcode);
  if (barcode.data) {
    const walletInfo = parseWalletData(barcode.data);
    navigation.navigate("AddToPortfolioWallet", { walletInfo })
  }
};

  return (
   <SafeAreaView style={{ flex: 1 }} >
    <CameraView 
  onBarcodeScanned={(barcode) => {
    handleQrCodeScanner(barcode);
  }}
  facing="back"
  className="h-full"
  style={{ flex: 1 }}
/>
    <Overlay />
   </SafeAreaView>
  )
}