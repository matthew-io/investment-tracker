import React, { useContext } from "react";
import { useNavigation } from "@react-navigation/native";
import { View, Text, TouchableOpacity, Alert } from "react-native";
import * as LocalAuthentication from "expo-local-authentication";
import { SettingsContext } from "screens/Settings/settingsContext";

export default function EntryScreen() {
  const navigation = useNavigation();
  const { settings } = useContext(SettingsContext);

  const handleEnter = async () => {
    console.log("22222", settings.faceIdEnabled)
    // If FaceID is enabled in settings, prompt for authentication.
    if (settings.faceIdEnabled) {
      const result = await LocalAuthentication.authenticateAsync({
        promptMessage: "Authenticate with Face ID",
        fallbackLabel: "Enter Passcode",
      });
      if (result.success) {
        navigation.navigate("Portfolio");
      } else {
        Alert.alert("Authentication failed", "Face ID authentication was not successful.");
      }
    } else {
      // If FaceID is not enabled, proceed directly.
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
