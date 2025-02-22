import { View, Text, Image } from "react-native"
type Props = {
    data: number;
}

import "../global.css"
import { ItemData } from "types";

export const TotalValue: React.FC<Props> = ( {data} ) => {
    console.log(data)

    return (
      <View className="flex-row h-[25vh] w-full items-center bg-brand-gray justify-between"
      style={{
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 1,
        shadowRadius: 1,
        elevation: 5,
      }}>
        <View className="flex-col ml-[4vw] mt-[5vh]">
          <Text className="text-white text-xl">Total Value</Text>
          <Text className="text-white text-4xl font-bold">£{data.toLocaleString()}</Text>
          <Text className="text-green-400">+6.66% from 24h ago.</Text>            
        </View>
  
        <View className="mr-[4vw] h-[16vh] mt-[6vh] items-center flex-col justify-between">
          <Image className="h-8 w-8" source={require("../assets/light-mode.png")}></Image>
          <Image className="h-8 w-8" source={require("../assets/light-mode.png")}></Image>
        </View>
      </View>
    );
  };
  