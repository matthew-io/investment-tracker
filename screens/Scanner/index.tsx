import { CameraView } from "expo-camera";
import React from "react";
import { SafeAreaView, Text, View } from "react-native";

export default function ScannerScreen() {
  return (
   <SafeAreaView style={{ flex: 1 }}>
    <CameraView 
    facing="back"
    style={{ flex: 1}}
/>
   </SafeAreaView>
  )
}