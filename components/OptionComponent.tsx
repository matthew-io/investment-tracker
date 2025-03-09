import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { SettingsItem } from "../types";
import Ionicons from "@expo/vector-icons/Entypo";
import { TextInput } from 'react-native';
import DatePicker from 'react-native-date-picker';

type Props = {
    data: SettingsItem;
};

export const OptionComponent: React.FC<Props> = ({ data }) => {
    const [date, setDate] = useState(new Date());
    const [datePickerOpen, setDatePickerOpen] = useState(false)
    const [hasButton, setHasButton] = useState(false);

    useEffect(() => {
        if (data.option == "EnterDate" || data.option == "Enable") {
            setHasButton(true)
        } 
    }, [data.option])

    let rightComponent, mainComponent;
    if (data.option == "EnterText") {
        rightComponent = <TextInput 
          className="ml-4 w-40 bg-[#404040] h-9 rounded-[6px]"
        />
    } else if (data.option == "Enable" || data.option == "EnterDate") {
        rightComponent = <Ionicons name="chevron-right" color="white" size={24} />
    } 

    if (hasButton) {
        return (
            <TouchableOpacity onPress={() => setDatePickerOpen(true)}>
                <DatePicker 
                    modal
                    open={datePickerOpen}
                    date={date}
                    onConfirm={(date) => {
                        setDatePickerOpen(false)
                        setDate(date)
                    }}
                    onCancel={() => {
                        setDatePickerOpen(false)
                    }}
                />
                <View className="h-[14vh] w-full border-b flex-row items-center justify-between px-4">
                    <View className="flex-1">
                        <Text className="text-white font-bold text-xl">{data.header}</Text>
                        <Text className="text-white text-sm">{data.description}</Text>
                    </View>
                    {rightComponent}
                </View>
            </TouchableOpacity>
        )
    } else {
        return (
            <View className="h-[14vh] w-full border-b flex-row items-center justify-between px-4">
                <View className="flex-1">
                    <Text className="text-white font-bold text-xl">{data.header}</Text>
                    <Text className="text-white text-sm">{data.description}</Text>
                </View>
                {rightComponent}
            </View>
        )
    }

};
