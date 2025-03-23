import React, { useEffect, useState, useContext } from 'react';
import { View, Text, TouchableOpacity, Modal, ActivityIndicator, ScrollView, TextInput } from 'react-native';
import { SettingsItem } from "../types";
import { BlurView } from "expo-blur"; 
import Ionicons from "@expo/vector-icons/Entypo";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useNavigation } from '@react-navigation/native';
import { db } from "../database";
import { SettingsContext } from 'screens/Settings/settingsContext';

type Props = {
    data: SettingsItem;
};

export const OptionComponent: React.FC<Props> = ({ data }) => {
    const navigation = useNavigation();
    const { settings, saveSettings } = useContext(SettingsContext);

    const [date, setDate] = useState(new Date());
    const [hasButton, setHasButton] = useState(false);
    const [modalOpen, setModalOpen] = useState(false);
    const [notesText, setNotesText] = useState(data.noteValue || "");
    const [modalText, setModalText] = useState("");
    const [currencies, setCurrencies] = useState<string[]>([]);
    const [selectedCurrency, setSelectedCurrency] = useState(settings.currency);

    const textColor = settings.darkMode ? "text-white" : "text-black"
    const bgColor = settings.darkMode ? "bg-brand-gray" : "bg-brand-white"

    useEffect(() => {
        setNotesText(data.noteValue && data.noteValue !== "undefined" ? data.noteValue : "");
        if(data.option === "changeCurrency") {
            setModalText("Select a currency from below...");
        }
    }, [data.noteValue, data.option]);

    useEffect(() => {
        if (data.option === "Enable" || data.option === "Remove" || data.option === "changeCurrency" || data.option === "enableFaceId") {
            setHasButton(true);
        } else {
            setHasButton(false);
        }
    }, [data.option]);

    useEffect(() => {
        if (modalOpen && data.option === "changeCurrency") {
            fetch("https://api.exchangerate-api.com/v4/latest/USD")
                .then(response => response.json())
                .then(apiData => {
                    const currencyList = Object.keys(apiData.rates);
                    setCurrencies(currencyList);
                })
                .catch(err => console.error("Error fetching currencies", err));
        }
    }, [modalOpen, data.option]);

    let rightComponent;
    if (data.option === "EnterText") {
        rightComponent = (
            <TextInput 
              className={`ml-4 w-40 bg-[#404040] px-2 text-white h-9 rounded-[6px]`}
              onChangeText={(text) => {
                data.onChangeText?.(text);
              }}
              value={data.textValue}
            />
        );
    } else if (data.option === "Enable" || data.option === "Remove" || data.option === "changeCurrency" || data.option === "enableFaceId") {
        rightComponent = <Ionicons name="chevron-right" color="white" size={24} />;
    } else if (data.option === "EnterDate") {
        rightComponent = (
            <DateTimePicker
                display="default"
                value={date}
                mode="date"
                maximumDate={new Date()}
                textColor="white"
                themeVariant="dark"
                onChange={(event, selectedDate) => {
                    if (selectedDate) {
                        setDate(selectedDate);
                        data.onChangeDate?.(selectedDate);
                    }
                }}
            />
        );
    }

    const handleConfirm = async () => {
        setModalOpen(false);
        if (data.option === "Remove") {
            
            const statement = `
                DELETE FROM assets
                WHERE asset_id = '${data.id}';
            `;
            try {
                await db.execAsync(`
                    DELETE FROM transactions
                    WHERE asset_id = '${data.id}';
                  `);
                await db.execAsync(statement);
            } catch (error) {
                console.error(error)
            }
            navigation.navigate("Portfolio");
        }
        if (data.option === "changeCurrency") {
            const newSettings = { ...settings, currency: selectedCurrency };
            await saveSettings(newSettings);
        }
        if (data.option === "enableFaceId") {
            if (settings.faceIdEnabled) {
                const newSettings = { ...settings, faceIdEnabled: false };
                await saveSettings(newSettings);
            } else {
                const newSettings = { ...settings, faceIdEnabled: true };
                await saveSettings(newSettings);
            }
        }
    };

    const renderModalContent = () => {
        if (data.option === "changeCurrency") {
            return (
                <>
                    <Text className={`${textColor} mb-4`}>{modalText}</Text>
                    {currencies.length === 0 ? (
                        <ActivityIndicator color="white" />
                    ) : (
                        <ScrollView className="w-72" style={{ maxHeight: 200, backgroundColor: '#ababab', borderRadius: 12, padding: 10 }}>
                            {currencies.map((currency) => (
                                <TouchableOpacity 
                                    key={currency} 
                                    onPress={() => {
                                        setSelectedCurrency(currency);
                                        data.onChangeText?.(currency);
                                    }}
                                    style={{
                                        paddingVertical: 8,
                                        borderBottomWidth: 0.5,
                                        borderColor: 'white'
                                    }}
                                >
                                    <Text className={`${textColor}`}>
                                        {currency} {selectedCurrency === currency ? "✓" : ""}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </ScrollView>
                    )}
                </>
            );
        } else if (data.option === "enableFaceId") {
            return (
                <Text style={[styles.modalText, { color: textColor }]}>
                    {settings.faceIdEnabled ? "Confirm disabling FaceID" : "Confirm enabling FaceID"}
                </Text>
            );
        } else if (data.option !== "Remove") {
            return (
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
                    onChangeText={(text) => {
                        setNotesText(text);
                        data.onChangeNotesText?.(text);
                    }}
                    value={notesText}
                />
            );
        }
        return null;
    };

    if (hasButton) {
        return (
            <TouchableOpacity onPress={() => setModalOpen(true)}>
                <Modal
                    animationType="fade"
                    transparent={true}
                    visible={modalOpen}
                    onRequestClose={() => {
                        setModalOpen(false);
                    }}
                >
                    <BlurView intensity={5} style={styles.blurBackground}>
                        <View style={styles.modalView} className={`${bgColor}`}>
                            {renderModalContent()}
                            <View className="flex-row w-2/3 mt-4 justify-between items-center">
                                <TouchableOpacity className="p-4 bg-red-500 rounded-[12px]" onPress={() => setModalOpen(false)}>
                                    <Text className={`${textColor}`}>Cancel</Text>
                                </TouchableOpacity>
                                <TouchableOpacity className="p-4 bg-green-500 rounded-[12px]" onPress={handleConfirm}>
                                    <Text className={`${textColor}`}>Confirm</Text>
                                </TouchableOpacity>
                            </View>
                        </View>     
                    </BlurView>
                </Modal>
                <View className="h-[14vh] w-full border-b flex-row items-center justify-between px-4" style={{
                    borderColor: settings.darkMode ? "#333" : "#ebebeb",
                }}>
                    <View className="flex-1">
                        <Text className={`${textColor} font-bold text-xl`}>{data.header}</Text>
                        <Text className={`${textColor} text-sm`}>{data.description}</Text>
                    </View>
                    {rightComponent}
                </View>
            </TouchableOpacity>
        );
    } else {
        return (
            <View className="h-[14vh] w-full border-b flex-row items-center justify-between px-4" style={{
                borderColor: settings.darkMode ? "#333" : "#ebebeb",
            }}>
                <View className="flex-1">
                    <Text className={`${textColor} font-bold text-xl`}>{data.header}</Text>
                    <Text className={`${textColor} text-sm`}>{data.description}</Text>
                </View>
                {rightComponent}
            </View>
        );
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
        textAlign: 'center',
    },
};
