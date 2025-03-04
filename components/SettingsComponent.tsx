import React from 'react';
import { View, Text } from 'react-native';
import { SettingsItem } from "../types";
import Ionicons from "@expo/vector-icons/Entypo";

type Props = {
    data: SettingsItem;
};

export const SettingsComponent: React.FC<Props> = ({ data }) => {
    return (
        <View className="h-[14vh] w-full border-b flex-row items-center justify-between px-4">
            <View className="flex-1">
                <Text className="text-white font-bold text-xl">{data.header}</Text>
                <Text className="text-white">{data.description}</Text>
            </View>
            <Ionicons name="chevron-right" color="white" size={24} />
        </View>
    );
};
