import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { SettingsItem } from "../types";
import Ionicons from "@expo/vector-icons/Entypo";
import { TextInput } from 'react-native';
import DateTimePicker from "@react-native-community/datetimepicker"

type Props = {
    data: SettingsItem;
};

export const OptionComponent: React.FC<Props> = ({ data }) => {
    const [date, setDate] = useState(new Date());
    const [datePickerOpen, setDatePickerOpen] = useState(false)
    const [hasButton, setHasButton] = useState(false);

    useEffect(() => {
        if (data.option == "Enable") {
            setHasButton(true)
        } 
    }, [data.option])

    let rightComponent;
    if (data.option == "EnterText") {
        rightComponent = <TextInput 
          className="ml-4 w-40 bg-[#404040] px-2 text-white h-9 rounded-[6px]"
          onChangeText={(text) => {
            data.onChangeText?.(text);
          }}
        />
    } else if (data.option == "Enable") {
        rightComponent = <Ionicons name="chevron-right" color="white" size={24} />
    } else if (data.option == "EnterDate") {
        rightComponent = <DateTimePicker
            display="default"
            value={date}
            mode="date"
            maximumDate={new Date()}
            textColor="white"
            themeVariant="dark"
            onChange={(event, selectedDate) => {
                if (selectedDate) {
                    setDate(selectedDate)
                    console.log(selectedDate)
                    data.onChangeDate?.(selectedDate);
                }
            }}
        />
    }
    

    if (hasButton) {
        return (
            <TouchableOpacity>
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
