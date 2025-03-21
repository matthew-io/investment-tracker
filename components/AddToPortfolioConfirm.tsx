import { View, Text } from "react-native"
import { useNavigation, useRoute } from "@react-navigation/native";
import { useContext, useState } from "react";
import { ItemData } from "types";
import { SettingsContext } from "screens/Settings/settingsContext";

type Props = {
    data: ItemData
}

export const AddToPortfolioConfirm = ({ data }) => {
    const navigation = useNavigation();
    const { settings, saveSettings } = useContext(SettingsContext)

    const textColor = settings.darkMode ? "text-white" : "text-black"
    const bgColor = settings.darkMode ? "bg-brand-gray" : "bg-brand-white"

    return (
        <View className="justify-end flex-1">
            <View className={`mb-24 h-16 ${bgColor} flex-row items-center justify-around border-t border-[#1c1c1c]`}>
                <Text className={`text-xl ${textColor} pl-12 font-bold`} onPress={() => navigation.navigate("Portfolio")}>Cancel</Text>
                <View className="h-16 w-[1px] bg-black" />
                <Text className={`text-xl ${textColor} pr-12 font-bold`} onPress={() => navigation.navigate("Portfolio", { data })}>Confirm</Text>
            </View>
        </View>
    )
}
