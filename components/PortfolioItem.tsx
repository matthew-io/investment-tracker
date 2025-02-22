import { Image, Text, View } from "react-native"
import { ItemData } from "types";

type Props = {
    data: ItemData;
};

export const PortfolioItem: React.FC<Props> = ({ data }) => {
    console.log(data)
    return (
        <View className="flex-row h-[10vh] w-full border-b border-[#1c1c1c]">  
            <View className="flex-row items-center ml-[2vw]">
                <Image className="h-10 w-10" source={{uri: data.icon}}></Image>
                <View className="flex-col ml-[2vw]">
                    <Text className="text-white text-xl font-bold">{data.symbol}</Text>
                    <Text className="text-white text-sm">{data.amount.toLocaleString()} | ${data.priceUsd?.toLocaleString()}</Text> 
                </View>
            </View>
            <View className="flex-row items-center justify-end flex-1 mr-[2vw]">
                <View className="flex-col ml-[1vw]">
                    <Text className="text-white text-right text-xl ml-[1vw] font-bold">£{(data.amount * data.priceUsd).toLocaleString()}</Text>
                    <Text className="text-green-500 ml-[1vw] text-sm">+6.66% from 24h ago</Text> 
                </View>
            </View>
        </View>
    );
}