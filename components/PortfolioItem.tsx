import { Image, Text, View } from "react-native"

export const PortfolioItem: React.FC = () => {
    return (
        <View className="flex-row h-[10vh] w-full border-b border-[#1c1c1c]"
        // style={{
        //     shadowColor: '#000',
        //     shadowOffset: {
        //         width: 0,
        //         height: 2,
        //     },
        //     shadowOpacity: 1,
        //     shadowRadius: 4,
        //     elevation: 5,
        // }}
        >  
            <View className="flex-row items-center ml-[2vw]">
                <Image className="h-12 w-12" source={require("../assets/bitcoin.webp")}></Image>
                <View className="flex-col ml-[2vw]">
                    <Text className="text-white text-xl font-bold">BTC</Text>
                    <Text className="text-white text-sm">6.66 | $2466.66</Text> 
                </View>
            </View>
            <View className="flex-row items-center justify-end flex-1 mr-[2vw]">
                <View className="flex-col ml-[1vw]">
                    <Text className="text-white text-right text-xl ml-[1vw] font-bold">£16,427.96</Text>
                    <Text className="text-green-500 ml-[1vw] text-sm">+6.66% from 24h ago</Text> 
                </View>
            </View>
        </View>
    );
}