import { View, Text } from "react-native"
import { useNavigation, useRoute } from "@react-navigation/native";
import { useState } from "react";
import { ItemData } from "types";

type Props = {
    data: ItemData
}

export const AddToPortfolioConfirm = ({ data }) => {
    const navigation = useNavigation();

    return (
        <View className="justify-end flex-1">
            <View className="mb-24 h-16 bg-brand-gray flex-row items-center justify-around border-t border-[#1c1c1c]">
                <Text className="text-xl text-white pl-12" onPress={() => navigation.navigate("Portfolio")}>Cancel</Text>
                <View className="h-16 w-[1px] bg-black" />
                <Text className="text-xl text-white pr-12" onPress={() => navigation.navigate("Portfolio", { data })}>Confirm</Text>
            </View>
        </View>
    )
}
