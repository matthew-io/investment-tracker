import { View, Text, TouchableOpacity, Modal, FlatList, TextInput } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { db } from "../../database";
import { useContext, useEffect, useState } from "react";
import { ImageBackground } from "react-native";
import { SettingsContext } from "screens/Settings/settingsContext";
import { BlurView } from "expo-blur";
import { Dropdown } from "react-native-element-dropdown";
import { SelectList } from 'react-native-dropdown-select-list'


export default function EntryScreen() {
  const navigation = useNavigation();
  const [openPortfolioModal, setOpenPortfolioModal] = useState(false);
  const [createPortfolioModal, setCreatePortfolioModal] = useState(false);
  const [entryChoiceModal, setEntryChoiceModal] = useState(false);
  const [portfolios, setPortfolios] = useState([]);
  const [newPortfolioName, setNewPortfolioName] = useState("");
  const { settings, saveSettings } = useContext(SettingsContext)

  useEffect(() => {
    fetchPortfolios();
  }, []);

  const handleSelectPortfolio = (portfolioId: string) => {
    const newSettings = { ...settings, currentPortfolioId: portfolioId };
    saveSettings(newSettings);
    setOpenPortfolioModal(false);
    navigation.navigate("Portfolio");
  };

  const fetchPortfolios = async () => {
    try {
      const results = await db.getAllAsync("SELECT * FROM portfolios");
      console.log(results)
      setPortfolios(results);
    } catch (error) {
      console.error("Couldn't fetch portfolios, error: ", error);
    }
  };

  const handleCreatePortfolio = async () => {
    if (!newPortfolioName.trim()) {
      alert("Portfolio name cannot be empty.");
      return;
    }
  
    try {
      const existing = await db.getFirstAsync(
        "SELECT * FROM portfolios WHERE name = ?",
        [newPortfolioName.trim()]
      );
  
      if (existing) {
        alert("A portfolio with that name already exists.");
        return;
      }
  
      const portfolioId = Date.now().toString();
      await db.execAsync(`
        INSERT INTO portfolios (portfolio_id, name)
        VALUES ('${portfolioId}', '${newPortfolioName}')
      `);
  
      setNewPortfolioName("");
      setCreatePortfolioModal(false);
      fetchPortfolios();
      const newSettings = { ...settings, currentPortfolioId: portfolioId };
      saveSettings(newSettings);
      navigation.navigate("Portfolio");
    } catch (error) {
      console.error("Couldn't create portfolio, error: ", error);
    }
  };
  


  return (
    <ImageBackground source={require("../../assets/splashbg.png")} className="bg-brand-gray h-full justify-center items-center">
      <Text className="text-white text-6xl font-bold" style={{
              shadowColor: "#fff",
              shadowOffset: { width: 0, height: 0 },
              shadowOpacity: 0.5,
              shadowRadius: 10,
              elevation: 15,
            }}>zenith</Text>

      <View className="absolute bottom-16 w-1/2 px-6 flex flex-col space-y-4">
      <TouchableOpacity
        onPress={() => setEntryChoiceModal(true)}
        className="border-white border-2 py-3 rounded-lg"
      >
        <Text className="text-white text-center text-2xl">Enter</Text>
      </TouchableOpacity>

{/* 
        <TouchableOpacity
          onPress={() => setCreatePortfolioModal(true)}
          className="bg-green-500 py-3 mt-4 rounded-lg"
        >
          <Text className="text-white text-center text-2xl">Create New Portfolio</Text>
        </TouchableOpacity> */}
      </View>

      <Modal visible={openPortfolioModal} transparent={true}>
        <View className="flex justify-center items-center h-full">
          <BlurView intensity={5} tint="dark" className="absolute top-0 left-0 w-full h-full" />
          <View
            className="bg-brand-gray p-6 rounded-xl w-[85%]"
            style={{
              shadowColor: "#fff",
              shadowOffset: { width: 0, height: 0 },
              shadowOpacity: 0.5,
              shadowRadius: 5,
              elevation: 15,
            }}
          >
            <Text className="text-white text-center text-lg mb-4">
              Select a portfolio from below...
            </Text>

            <SelectList
              data={portfolios.map((item) => ({
                key: item.portfolio_id,
                value: item.name,
              }))}
              placeholder="Select..."
              search={true}
              boxStyles={{
                backgroundColor: "#f0f0f0",
                borderRadius: 10,
                paddingVertical: 14,
              }}
              dropdownStyles={{
                backgroundColor: "#2c2c2c",
                borderRadius: 12,
              }}
              dropdownTextStyles={{
                color: "#fff",
              }}
              inputStyles={{
                color: "#000",
                fontSize: 16,
              }}
              setSelected={(key) => {
                handleSelectPortfolio(key); 
              }}
            />
            <TouchableOpacity
              onPress={() => setOpenPortfolioModal(false)}
              className="mt-8 w-1/3 self-center bg-red-700 py-3 rounded-lg"
            >
              <Text className="text-white text-center text-xl">Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <Modal visible={createPortfolioModal} transparent={true}>
  <View className="flex justify-center items-center h-full">
    <BlurView intensity={5} tint="dark" className="absolute top-0 left-0 w-full h-full" />
    <View
      className="bg-brand-gray p-6 rounded-xl w-[85%]"
      style={{
        shadowColor: "#fff",
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.5,
        shadowRadius: 5,
        elevation: 15,
      }}
    >
      <Text className="text-white text-center text-lg mb-4">
        Create a new portfolio...
      </Text>

      <TextInput
        value={newPortfolioName}
        onChangeText={setNewPortfolioName}
        placeholder="Portfolio Name"
        placeholderTextColor="#999"
        className="bg-white/90 border border-white/20 rounded-lg py-3 px-4 text-lg text-black mb-4"
      />
        <View className="flex-row space-x-4 mt-4">
          <TouchableOpacity
            onPress={() => setCreatePortfolioModal(false)}
            className="flex-1 bg-red-700 py-3 mr-4 rounded-lg"
          >
            <Text className="text-white text-center text-xl">Cancel</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={handleCreatePortfolio}
            className="flex-1 bg-green-500 py-3 rounded-lg"
          >
            <Text className="text-white text-center text-xl">Confirm</Text>
          </TouchableOpacity>
        </View>
    </View>
  </View>
</Modal>

<Modal visible={entryChoiceModal} transparent={true}>
  <View className="flex justify-center p-30 items-center h-full">
    <BlurView intensity={5} tint="dark" className="absolute top-0 left-0 w-full h-full" />
    <View
      className="bg-brand-gray p-6 rounded-xl w-[85%]"
      style={{
        shadowColor: "#fff",
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.5,
        shadowRadius: 5,
        elevation: 15,
      }}
    >
      <Text className="text-white text-center text-lg mb-4">
        Select a portfolio option...
      </Text>

      <View className="flex-row space-x-4 mb-4">
        <TouchableOpacity
          onPress={() => {
            setEntryChoiceModal(false);
            setOpenPortfolioModal(true);
          }}
          className="flex-1 border-[1px] mr-4 justify-center border-white p-10 rounded-[12px]"
        >
          <Text className="text-white text-center text-md">
            Open Existing
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => {
            setEntryChoiceModal(false);
            setCreatePortfolioModal(true);
          }}
          className="flex-1 border-[1px] justify-center border-white p-10 rounded-[12px]"
        >
          <Text className="text-white text-center text-md">Create New</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        onPress={() => setEntryChoiceModal(false)}
        className="bg-red-700 w-1/3 mt-4 self-center py-3 rounded-lg"
      >
        <Text className="text-white text-center text-xl">Cancel</Text>
      </TouchableOpacity>
    </View>
  </View>
</Modal>
    </ImageBackground>
  );
}
