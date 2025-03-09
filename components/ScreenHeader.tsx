import React from "react";
import { View, Text, Image, StyleSheet } from "react-native";

type Props = {
  data: string;
  image?: string;
};

export const ScreenHeader: React.FC<Props> = ({ data, image }) => {
  return (
      <View
        className="flex-row h-[25vh] w-full items-center bg-brand-gray"
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
    
        <Text className="text-white ml-4 font-bold text-4xl mt-12">
          {data}
        </Text>
    </View>
  );
};

