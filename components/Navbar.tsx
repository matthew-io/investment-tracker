import { View, TextStyle, Text, TouchableOpacity, Modal, StyleSheet, Alert, Pressable } from "react-native";
import React, { useState } from "react";
import { HomeIcon } from "./HomeIcon";
import Ionicons from "@expo/vector-icons/Entypo";
import { useNavigation, useRoute } from "@react-navigation/native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { BlurView } from "expo-blur"; 
import { Dropdown } from "react-native-element-dropdown";

const data = [
  { label: 'Item 1', value: 1 },
  { label: 'Item 1', value: 1 },
  { label: 'Item 1', value: 1 },
  { label: 'Item 1', value: 1 },
  { label: 'Item 1', value: 1 },
  { label: 'Item 1', value: 1 },
  { label: 'Item 1', value: 1 },
  { label: 'Item 1', value: 1 },
  { label: 'Item 1', value: 1 },
  { label: 'Item 1', value: 1 }
]

export const Navbar: React.FC = () => {
  const route = useRoute();
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedValue, setSelectedValue] = useState<number | null>(null);
  const navigation = useNavigation();
  const iconShadow: TextStyle = {
    textShadowColor: "#ffffff",
    textShadowRadius: 2,
    textShadowOffset: { width: 0, height: 0 },
  };

  const handleModal = () => {
    
    setModalVisible(true)
  }
  

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
          <TouchableOpacity onPress={() => handleModal()}>
            <Modal
              animationType="fade"
              transparent={true}
              visible={modalVisible}
              onRequestClose={() => {
                Alert.alert('Modal has been closed.');
                setModalVisible(!modalVisible);
              }}
            >
              <BlurView intensity={5} style={styles.blurBackground}>
                <View style={styles.centeredView}>
                  <View style={styles.modalView}>
                    <Text style={styles.modalText}>Select a pair from below...</Text>
                    <Dropdown 
                      style={styles.dropdown}
                      placeholderStyle={styles.placeholderStyle}
                      selectedTextStyle={styles.selectedTextStyle}
                      inputSearchStyle={styles.inputSearchStyle}
                      placeholder="Select..."
                      data={data}
                      search
                      maxHeight={300}
                      onChange={(item) => {
                        setSelectedValue(item.value);
                        console.log("Selected Item:", item);
                      } } 
                      labelField={"label"} valueField={"value"}                    />
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
    alignItems: 'center',
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
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
    textAlign: 'center',
  },
  placeholderStyle: {
    fontSize: 16,
  },
  selectedTextStyle: {
    fontSize: 16,
  },
  inputSearchStyle: {
    height: 40,
    fontSize: 16,
  },
});
