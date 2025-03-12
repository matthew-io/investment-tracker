import { Image, Text, TouchableOpacity, View } from "react-native"
import { useState } from "react"
import { ItemData } from "types";
import { useNavigation } from "@react-navigation/native";

type Props = {
    data: ItemData;
};

export const PortfolioItem: React.FC<Props> = ({ data }) => {
    const navigation = useNavigation();

    let totalAmount;

    if (String(data.amount * data.priceUsd).length > 6) {
        totalAmount = data.amount * data.priceUsd
      } else {
        totalAmount = data.amount * data.priceUsd
      }

    return (
        <TouchableOpacity onPress={() => navigation.navigate("AssetInfoScreen", { data })}>
            <View className="flex-row h-[10vh] w-full border-b border-[#1c1c1c]">  
                <View className="flex-row items-center ml-[3vw]">
                    <Image className="h-10 w-10 rounded-full" source={{uri: data.icon}}></Image>
                    <View className="flex-col ml-[3vw]">
                        <Text className="text-white text-xl font-bold">{(data.symbol).toUpperCase()}</Text>
                        <Text className="text-white text-sm">{data.amount.toLocaleString()} | ${data.priceUsd?.toLocaleString()}</Text> 
                    </View>
                </View>
                <View className="flex-row items-center justify-end flex-1 mr-[2vw]">
                    <View className="flex-col ml-[1vw] items-end">
                        <Text className="text-white text-right text-xl ml-[1vw] font-bold">  
                            ${totalAmount.toLocaleString(undefined, { maximumFractionDigits: 2 })}                         
                        </Text>
                        <Text className="text-green-500 ml-[1vw] text-sm">
                            +6.66% from 24h ago
                        </Text> 
                    </View>
                </View>
            </View>
        </TouchableOpacity>
        
    );
}