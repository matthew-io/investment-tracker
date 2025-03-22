import { View, TextStyle, Text, TouchableOpacity, Modal, StyleSheet, Alert, Image, Pressable, Touchable, TouchableWithoutFeedback } from "react-native";
import React, { useState, useEffect, useContext } from "react";
import { HomeIcon } from "./HomeIcon";
import Ionicons from "@expo/vector-icons/Entypo";
import { useNavigation, useRoute } from "@react-navigation/native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { BlurView } from "expo-blur"; 
import { Dropdown } from "react-native-element-dropdown";
import { SvgUri } from "react-native-svg";
import { useCameraPermissions } from "expo-camera";
import { SettingsContext } from "screens/Settings/settingsContext";

type Props = {
  coin?: any,
  stock?: any,
}

export const Navbar: React.FC<Props> = ({ coin, stock }) => {
  const route = useRoute();
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedValue, setSelectedValue] = useState<number | null>(null);
  const [assetType, setAssetType] = useState("");
  const navigation = useNavigation();
  const [coinData, setCoinData] = useState<any[]>([]);
  const [stockData, setStockData] = useState<any[]>([]);
  const [cryptoEntryMethod, setCryptoEntryMethod] = useState<"" | "manual" | "qr">("");
  const { settings, saveSettings } = useContext(SettingsContext);

  const [permission, requestPermission] = useCameraPermissions();
  
  const textColor = settings.darkMode ? "text-white" : "text-black"
  const bgColor = settings.darkMode ? "bg-brand-gray" : "bg-brand-white"

  useEffect(() => {
    if (coin && Array.isArray(coin)) {
      const processedCoinData = coin.map((item: any) => ({
        label: item.symbol,
        value: item.id,
        image: item.image,
        priceUsd: item.current_price,
      }));
      setCoinData(processedCoinData);
    }
    
    if (stock && Array.isArray(stock)) {
      const processedStockData = stock.map((item: any) => ({
        label: item.T, 
        ticker: item.T,
        close: item.c,
      }));
      setStockData(processedStockData);
    }
  }, [coin, stock]);

  const handleModal = () => {
    setModalVisible(true);
  };

   const handleCancel = () => {
    setModalVisible(false);
    setAssetType("");
    setCryptoEntryMethod("");
  };

  return (
    <View className={`absolute bottom-0 left-0 right-0 h-24 ${bgColor} flex-row items-center justify-around border-t border-[#1c1c1c]`}>
      <TouchableOpacity onPress={() => navigation.navigate("Portfolio")}>
        <Ionicons name="home" color={`${settings.darkMode ? "white" : "black"}`} size={42} />
      </TouchableOpacity>

      {route.name === "Portfolio" && (
        <View
          className={`absolute -top-8 left-1/2 w-16 h-16 rounded-full ${bgColor} items-center justify-center`}
          style={{ transform: [{ translateX: -32 }] }}
        >
          <TouchableOpacity onPress={handleModal}>
            <Modal
              animationType="fade"
              transparent={true}
              visible={modalVisible}
              onRequestClose={() => setModalVisible(false)}
            >
              <BlurView intensity={5} style={styles.blurBackground}>
                <View style={styles.centeredView}>
                  <View style={styles.modalView} className={`${settings.darkMode ? "bg-[#2c2c2c]" : "bg-brand-white"}`}> 

                    {assetType === "" && (
                      <>
                        <Text style={styles.modalText} className={`${textColor} text-lg`}>
                          Select asset type
                        </Text>

                        <View className="flex-row items-center mt-4">
                          <TouchableOpacity
                            onPress={() => {
                              setAssetType("Crypto");
                            }}
                          >
                            <View className="border-[1px] rounded-[12px] px-12 py-12 justify-center border-white mx-2">
                              <Text className={`${textColor} text-md`}>Crypto</Text>
                            </View>
                          </TouchableOpacity>

                          <TouchableOpacity
                            onPress={() => {
                              setAssetType("Stock");
                            }}
                          >
                            <View className="border-[1px] rounded-[12px] px-12 py-12 border-white mx-2">
                              <Text className={`${textColor} text-md`}>Stock</Text>
                            </View>
                          </TouchableOpacity>
                        </View>

                        <TouchableOpacity
                          className="p-4 bg-red-900 mt-8 rounded-[12px]"
                          onPress={handleCancel}
                        >
                          <Text className="text-white">Cancel</Text>
                        </TouchableOpacity>
                      </>
                    )}

                    {assetType === "Crypto" && cryptoEntryMethod === "" && (
                      <>
                        <Text style={styles.modalText} className={`${textColor}`}>
                          How would you like to add your crypto?
                        </Text>
                        <View className="flex-row items-center mt-4">
                          <TouchableOpacity
                            onPress={() => setCryptoEntryMethod("manual")}
                          >
                            <View className="border-[1px] rounded-[12px] px-12 py-12 justify-center border-white mx-2">
                              <Text className={`${textColor} text-md`}>Manually</Text>
                            </View>
                          </TouchableOpacity>

                          <TouchableOpacity
                              onPress={() => {
                                if (permission) {
                                  navigation.navigate("Scanner");
                                } else {
                                  requestPermission();
                                }
                              }}
                            >
                          <View className="border-[1px] rounded-[12px] px-12 py-12 border-white mx-2">
                            <Text className={`${textColor} text-md`}>Scan</Text>
                          </View>
                        </TouchableOpacity>
                        </View>
                        <TouchableOpacity
                          className="p-4 bg-red-900 mt-8 rounded-[12px]"
                          onPress={handleCancel}
                        >
                          <Text className="text-white">Cancel</Text>
                        </TouchableOpacity>
                      </>
                    )}

                    {assetType === "Crypto" && cryptoEntryMethod === "manual" && (
                      <>
                        <Text style={styles.modalText} className={`${textColor}`}>
                          Select a coin from below...
                        </Text>
                        <Dropdown
                          style={[styles.dropdown, { backgroundColor: settings.darkMode ? '#2c2c2c' : 'white' }]}
                          placeholderStyle={[styles.placeholderStyle, { color: settings.darkMode ? 'white' : 'black' }]}
                          selectedTextStyle={[styles.selectedTextStyle, { color: settings.darkMode ? 'white' : 'black' }]}
                          inputSearchStyle={[styles.inputSearchStyle, { 
                            color: settings.darkMode ? 'white' : 'black',
                            backgroundColor: settings.darkMode ? '#2c2c2c' : 'white'
                          }]}
                          containerStyle={[styles.dropdownList, { 
                            backgroundColor: settings.darkMode ? '#2c2c2c' : 'white',
                            opacity: 1
                          }]}
                          placeholder="Select..."
                          data={coinData}
                          search
                          maxHeight={300}
                          value={selectedValue}
                          onChange={(item) => {
                            setModalVisible(false);
                            setAssetType("");
                            setCryptoEntryMethod("");
                            navigation.navigate("AddToPortfolio", {
                              selectedValue: item,
                            });
                          }}
                          renderItem={(item: any) => (
                            <View style={[styles.itemContainer, {
                              backgroundColor: settings.darkMode ? '#2c2c2c' : 'white'
                            }]}>
                              <Image
                                source={{ uri: item.image }}
                                style={styles.itemImage}
                              />
                              <Text style={[styles.itemText, { color: settings.darkMode ? 'white' : 'black' }]}>
                                {item.label.toUpperCase()}
                              </Text>
                            </View>
                          )}
                          labelField="label"
                          valueField="label"
                        />
                 
                       <TouchableOpacity
                          className="p-4 bg-red-500 mt-4 rounded-[12px]"
                          onPress={() => {
                            setModalVisible(false);
                            setTimeout(() => {
                              setAssetType("");
                              setCryptoEntryMethod("");
                            }, 500);
                          }}
                        >
                          <Text className="text-white">Cancel</Text>
                        </TouchableOpacity>
                      </>
                    )}

                    {assetType === "Stock" && (
                      <>
                        <Text style={styles.modalText} className={`${textColor}`}>
                          Select a stock from below...
                        </Text>
                        <Dropdown
                                style={[styles.dropdown, { backgroundColor: bgColor }]}
                                placeholderStyle={[styles.placeholderStyle, { color: textColor }]}
                                selectedTextStyle={[styles.selectedTextStyle, { color: textColor }]}
                                inputSearchStyle={[styles.inputSearchStyle, { color: textColor }]}
                                containerStyle={[styles.dropdownList, { 
                                  backgroundColor: settings.darkMode ? '#2c2c2c' : 'white', 
                                  opacity: 1 
                                }]}
                                placeholder="Select..."
                                data={coinData}
                                search
                                maxHeight={300}
                                value={selectedValue}
                                onChange={(item) => {
                                  setModalVisible(false);
                                  setAssetType("");
                                  setCryptoEntryMethod("");
                                  navigation.navigate("AddToPortfolio", {
                                    selectedValue: item,
                                  });
                                }}
                                renderItem={(item: any) => (
                                  <View style={[styles.itemContainer, {backgroundColor: bgColor}]}>
                                    <Image
                                      source={{ uri: item.image }}
                                      style={styles.itemImage}
                                    />
                                   <Text style={[styles.itemText, { 
                                    color: settings.darkMode ? 'white' : 'black', 
                                    opacity: 1
                                  }]}>
                                    {item.label.toUpperCase()}
                                  </Text>
                                  </View>
                                )}
                                labelField="label"
                                valueField="label"
                              />
                        <TouchableOpacity
                          className="p-4 bg-red-500 mt-4 rounded-[12px]"
                          onPress={handleCancel}
                        >
                          <Text className="text-white">Cancel</Text>
                        </TouchableOpacity>
                      </>
                    )}
                  </View>
                </View>
              </BlurView>
            </Modal>
            <Ionicons name="circle-with-plus" color={settings.darkMode ? "white" : "black"} size={60} />
          </TouchableOpacity>
        </View>
      )}

      <TouchableOpacity onPress={() => navigation.navigate("Settings")}>
        <Ionicons name="cog" color={`${settings.darkMode ? "white" : "black"}`} size={42} />
      </TouchableOpacity>
    </View>
  );
};


const styles = StyleSheet.create({
  blurBackground: {
    flex: 1,
    position: "absolute",
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  dropdown: {
    height: 50,
    width: 250,
    borderColor: 'gray',
    borderWidth: 0.5,
    borderRadius: 8,
    paddingHorizontal: 8,
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
  },
  modalView: {
    margin: 20,
    // borderColor: 'white',
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
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
  },
  buttonClose: {
    backgroundColor: '#2196F3',
  },
  textStyle: {
    // color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
  },
  placeholderStyle: {
    fontSize: 16,
  },
  selectedTextStyle: {
    fontSize: 16,
    // color: 'white',
    textTransform: 'uppercase',
  },
  inputSearchStyle: {
    height: 40,
    borderRadius: 6,
    marginTop: 12,
    fontSize: 16,
  },
  itemContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    color: '#2196F3',
    borderColor: '#2196F3',
  },
  itemImage: {
    width: 24,
    height: 24,
    marginRight: 10,
  },
  itemText: {
    fontSize: 16,
    // color: 'white',
  },
  dropdownList: {
    marginTop: 6,
    borderWidth: 0.5,
    borderColor: 'white',
    borderRadius: 8,
    overflow: 'hidden',
  },
});
