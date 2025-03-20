import { CameraView } from "expo-camera";
import React from "react";
import { SafeAreaView, Text, View } from "react-native";

export default function ScannerScreen() {
  return (
   <SafeAreaView style={{ flex: 1 }}>
    <CameraView 
    onBarcodeScanned={(data) => {
      console.log(data)
    }}
    facing="back"
    style={{ flex: 1}}
/>
   </SafeAreaView>
  )
}