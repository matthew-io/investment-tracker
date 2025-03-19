import { View, TextStyle, Text, TouchableOpacity, Modal, StyleSheet, Alert, Image, Pressable, Touchable, TouchableWithoutFeedback } from "react-native";
import React, { useState, useEffect } from "react";
import { HomeIcon } from "./HomeIcon";
import Ionicons from "@expo/vector-icons/Entypo";
import { useNavigation, useRoute } from "@react-navigation/native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { BlurView } from "expo-blur"; 
import { Dropdown } from "react-native-element-dropdown";
import { SvgUri } from "react-native-svg";
import { useCameraPermissions } from "expo-camera";

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

  const [permission, requestPermission] = useCameraPermissions();
  
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
    <View className="absolute bottom-0 left-0 right-0 h-24 bg-brand-gray flex-row items-center justify-around border-t border-[#1c1c1c]">
      <TouchableOpacity onPress={() => navigation.navigate("Portfolio")}>
        <Ionicons name="home" color="white" size={42} />
      </TouchableOpacity>

      {route.name === "Portfolio" && (
        <View
          className="absolute -top-8 left-1/2 w-16 h-16 rounded-full bg-brand-gray items-center justify-center"
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
                  <View style={styles.modalView}>

                    {assetType === "" && (
                      <>
                        <Text style={styles.modalText} className="text-lg">
                          Select asset type
                        </Text>

                        <View className="flex-row items-center mt-4">
                          <TouchableOpacity
                            onPress={() => {
                              setAssetType("Crypto");
                            }}
                          >
                            <View className="border-[1px] rounded-[12px] px-12 py-12 justify-center border-white mx-2">
                              <Text className="text-white text-md">Crypto</Text>
                            </View>
                          </TouchableOpacity>

                          <TouchableOpacity
                            onPress={() => {
                              setAssetType("Stock");
                            }}
                          >
                            <View className="border-[1px] rounded-[12px] px-12 py-12 border-white mx-2">
                              <Text className="text-white text-md">Stock</Text>
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
                        <Text style={styles.modalText}>
                          How would you like to add your crypto?
                        </Text>
                        <View className="flex-row items-center mt-4">
                          <TouchableOpacity
                            onPress={() => setCryptoEntryMethod("manual")}
                          >
                            <View className="border-[1px] rounded-[12px] px-12 py-12 justify-center border-white mx-2">
                              <Text className="text-white text-md">Manually</Text>
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
                            <Text className="text-white text-md">Scan</Text>
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
                        <Text style={styles.modalText}>
                          Select a coin from below...
                        </Text>
                        <Dropdown
                          style={styles.dropdown}
                          placeholderStyle={styles.placeholderStyle}
                          selectedTextStyle={styles.selectedTextStyle}
                          inputSearchStyle={styles.inputSearchStyle}
                          containerStyle={styles.dropdownList}
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
                            <View style={styles.itemContainer}>
                              <Image
                                source={{ uri: item.image }}
                                style={styles.itemImage}
                              />
                              <Text style={styles.itemText}>
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
                        <Text style={styles.modalText}>
                          Select a stock from below...
                        </Text>
                        <Dropdown
                          style={styles.dropdown}
                          placeholderStyle={styles.placeholderStyle}
                          selectedTextStyle={styles.selectedTextStyle}
                          inputSearchStyle={styles.inputSearchStyle}
                          containerStyle={styles.dropdownList}
                          placeholder="Select..."
                          data={stockData}
                          search
                          maxHeight={300}
                          value={selectedValue}
                          onChange={(item) => {
                            setModalVisible(false);
                            setAssetType("");
                            navigation.navigate("AddToPortfolio", {
                              selectedValue: item,
                            });
                          }}
                          renderItem={(item: any) => (
                            <View style={styles.itemContainer}>
                              <Text style={styles.itemText}>{item.ticker}</Text>
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
            <Ionicons name="circle-with-plus" color="white" size={60} />
          </TouchableOpacity>
        </View>
      )}

      <TouchableOpacity onPress={() => navigation.navigate("Settings")}>
        <Ionicons name="cog" color="white" size={42} />
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
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
  },
  buttonClose: {
    backgroundColor: '#2196F3',
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  modalText: {
    marginBottom: 15,
    color: 'white',
    textAlign: 'center',
  },
  placeholderStyle: {
    color: 'white',
    fontSize: 16,
  },
  selectedTextStyle: {
    fontSize: 16,
    color: 'white',
    textTransform: 'uppercase',
  },
  inputSearchStyle: {
    height: 40,
    borderRadius: 6,
    marginTop: 12,
    color: 'white',
    fontSize: 16,
  },
  itemContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    color: '#2196F3',
    backgroundColor: '#2C2C2C',
    borderColor: '#2196F3',
  },
  itemImage: {
    width: 24,
    height: 24,
    marginRight: 10,
  },
  itemText: {
    fontSize: 16,
    color: 'white',
  },
  dropdownList: {
    marginTop: 6,
    backgroundColor: '#2C2C2C',
    borderWidth: 0.5,
    borderColor: 'white',
    borderRadius: 8,
    overflow: 'hidden',
  },
});
