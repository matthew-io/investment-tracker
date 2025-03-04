import { View, Text } from "react-native"

export const AddToPortfolioConfirm = () => {
    return (
        <View className="justify-end flex-1">
            <View className="mb-24 h-16 bg-brand-gray flex-row items-center justify-around border-t border-[#1c1c1c]">
                <Text className="text-xl text-white  pl-12">Confirm</Text>
                <View className="h-16 w-[1px] bg-black" />
                <Text className="text-xl text-white  pr-12">Cancel</Text>
            </View>
        </View>
    )
}
