import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, Modal, Button } from 'react-native';
import { SettingsItem } from "../types";
import { BlurView } from "expo-blur"; 
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
    const [modalOpen, setModalOpen] = useState(false);
    const [notesText, setNotesText] = useState(data.noteValue || "");

    useEffect(() => {
        setNotesText(data.noteValue && data.noteValue !== "undefined" ? data.noteValue : "")
    }, [data.noteValue])

    useEffect(() => {
        if (data.option == "Enable") {
            setHasButton(true)
        } else {
            setHasButton(false)
        }
    }, [data.option])

    let rightComponent;
    if (data.option == "EnterText") {
        rightComponent = <TextInput 
          className="ml-4 w-40 bg-[#404040] px-2 text-white h-9 rounded-[6px]"
          onChangeText={(text) => {
            data.onChangeText?.(text);
          }}
          value={data.textValue}
        />
    } else if (data.option == "Enable") {
        rightComponent = 
        <Ionicons name="chevron-right" color="white" size={24} />
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
                    data.onChangeDate?.(selectedDate);
                }
            }}
        />
    }

    if (hasButton) {
        return (
            <TouchableOpacity onPress={() => setModalOpen(true)}>
                <Modal
                    animationType="fade"
                    transparent={true}
                    visible={ modalOpen }
                    onRequestClose={() => {
                        setModalOpen(false)
                    }}
                >
                    <BlurView intensity={5} style={styles.blurBackground}>
                        <View style={styles.modalView}>
                            <Text style={styles.modalText}>
                                Edit your transaction notes below...
                            </Text>
                            <TextInput
                                className="w-72"
                                style={{
                                    maxHeight: 200,
                                    backgroundColor: '#404040',
                                    color: 'white',
                                    borderRadius: 12,
                                    padding: 10,
                                }}
                                multiline
                                textAlignVertical="top"
                                onChangeText={(text) => 
                                    {
                                        setNotesText(text)
                                        data.onChangeNotesText?.(text)
                                    }
                                }
                                value={notesText}
                            />
                            <View className="flex-row w-2/3 mt-4 justify-between items-center">
                               <TouchableOpacity className="p-4 bg-red-500 rounded-[12px]"  onPress={() => setModalOpen(false)}>
                                    <Text className="text-white">Cancel</Text>
                               </TouchableOpacity>
                               <TouchableOpacity  className='p-4 bg-green-500 rounded-[12px]' onPress={() => setModalOpen(false)}>
                                    <Text className="text-white">Confirm</Text>
                               </TouchableOpacity>
                            </View>
                        </View>     
                    </BlurView>
                </Modal>
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

const styles = {
    blurBackground: {
        flex: 1,
        position: "absolute",
        width: "100%",
        height: "100%",
        justifyContent: "center",
        alignItems: "center",
    },
    centeredView: {
        flex: 1,
        justifyContent: 'center',
    },
    modalView: {
        margin: 20,
        backgroundColor: '#2C2C2C',
        borderColor: 'white',
        borderWidth: 0.5,
        borderRadius: 20,
        padding: 35,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
    modalText: {
        marginBottom: 15,
        color: 'white',
        textAlign: 'center',
    },
}
