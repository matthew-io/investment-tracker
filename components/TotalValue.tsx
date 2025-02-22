import { View, Text, Image } from "react-native"

import "../global.css"

export const TotalValue: React.FC = () => {
    return (
      <View className="flex-row h-[25vh] w-full bg-brand-gray items-center justify-between">
        <View
          className="flex-col ml-[4vw] mt-[5vh]"
          style={{
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 1 },
            shadowOpacity: 1,
            shadowRadius: 2,
            elevation: 5,
          }}
        >
          <Text className="text-white text-xl">Total Value</Text>
          <Text className="text-white text-5xl font-bold">£666.66</Text>
          <Text className="text-green-400">+6.66% from 24h ago.</Text>            
        </View>
  
        <View className="mr-[4vw] h-[16vh] mt-[6vh] items-center flex-col justify-between">
          <Image className="h-8 w-8" source={require("../assets/light-mode.png")}></Image>
        </View>
      </View>
    );
  };
  