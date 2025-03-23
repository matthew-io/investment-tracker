import React, { useContext } from "react";
import { View, Text, Image, StyleSheet, ImageBackground } from "react-native";
import { SettingsContext } from "screens/Settings/settingsContext";

type Props = {
  data: string;
  image?: string;
};

export const ScreenHeader: React.FC<Props> = ({ data, image }) => {
  const { settings, saveSettings } = useContext(SettingsContext)

  const textColor = settings.darkMode ? "text-white" : "text-black"
  const bgColor = settings.darkMode ? "bg-brand-gray" : "bg-brand-white"
  const splashBg = require("../assets/splashbg.png");
  const splashBgLight = require("../assets/totalvaluebglight.png");
  const selectedBg = settings.darkMode ? splashBg : splashBgLight;

  let showCurrency = data.length > 6 ? `${data}` : `${data}/${settings.currency}`

  return (
      <ImageBackground
        source={selectedBg}
        className={`flex-row h-[25vh] w-full items-center ${bgColor}`}
        style={{
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 1 },
          shadowOpacity: 1,
          shadowRadius: 1,
          elevation: 5,
        }}
      >
      {image && (
        <Image
          source={{ uri: image }}
          className="h-16 w-16 ml-4 mt-12 rounded-full"
        />
      )}
    
        <Text className={`${textColor} ml-4 font-bold text-4xl mt-12`}>
          {showCurrency}
        </Text>
    </ImageBackground>
  );
};

