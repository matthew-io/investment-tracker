import React, { useContext } from "react";
import { useNavigation } from "@react-navigation/native";
import { View, Text, TouchableOpacity, Alert } from "react-native";
import * as LocalAuthentication from "expo-local-authentication";
import { SettingsContext } from "screens/Settings/settingsContext";

export default function EntryScreen() {
  const navigation = useNavigation();
  const { settings } = useContext(SettingsContext);

 const checkBiometricAvailability = async () => {
  const hasHardware = await LocalAuthentication.hasHardwareAsync();
  const isEnrolled = await LocalAuthentication.isEnrolledAsync();
  console.log("hasHardware:", hasHardware, "isEnrolled:", isEnrolled);
  return hasHardware && isEnrolled;
};

const handleEnter = async () => {
  console.log("handleEnter triggered");
  if (settings.faceIdEnabled && await checkBiometricAvailability()) {
    console.log("Biometric available, prompting authentication");
    const result = await LocalAuthentication.authenticateAsync({
      promptMessage: "Authenticate with Face ID",
      fallbackLabel: "Enter Passcode",
    });
    console.log("Authentication result:", result);
    if (result.success) {
      navigation.navigate("Portfolio");
    } else {
      Alert.alert("Authentication failed", "Face ID authentication was not successful.");
    }
  } else {
    console.log("Biometric not enabled or not available, navigating directly");
    navigation.navigate("Portfolio");
  }
};

  
  return (
    <View className="bg-brand-gray h-full justify-center items-center">
      <Text className="text-white text-6xl font-bold">zenith</Text>
      <TouchableOpacity onPress={handleEnter}>
        <Text className="mt-12 bg-white py-2 px-4 rounded-[6px] text-2xl">Enter</Text>
      </TouchableOpacity>
    </View>
  );
}
