import { View, Text, TouchableOpacity, Modal, FlatList, TextInput } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { db } from "../../database";
import { useContext, useEffect, useState } from "react";
import { SettingsContext } from "screens/Settings/settingsContext";

export default function EntryScreen() {
  const navigation = useNavigation();
  const [openPortfolioModal, setOpenPortfolioModal] = useState(false);
  const [createPortfolioModal, setCreatePortfolioModal] = useState(false);
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

    const portfolioId = Date.now().toString(); 
    try {
      await db.execAsync(`
        INSERT INTO portfolios (portfolio_id, name)
        VALUES ('${portfolioId}', '${newPortfolioName}')
      `);
      setNewPortfolioName(""); 
      setCreatePortfolioModal(false); 
      fetchPortfolios(); 
    } catch (error) {
      console.error("Couldn't create portfolio, error: ", error);
    }
  };


  return (
    <View className="bg-brand-gray h-full justify-center items-center">
      <Text className="text-white text-6xl font-bold">zenith</Text>

      <View className="absolute bottom-16 w-full px-6 flex flex-col space-y-4">
        <TouchableOpacity
          onPress={() => setOpenPortfolioModal(true)}
          className="bg-white py-3 rounded-lg"
        >
          <Text className="text-black text-center text-2xl">Open Existing Portfolio</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => setCreatePortfolioModal(true)}
          className="bg-green-500 py-3 mt-4 rounded-lg"
        >
          <Text className="text-white text-center text-2xl">Create New Portfolio</Text>
        </TouchableOpacity>
      </View>

      <Modal visible={openPortfolioModal} transparent={true}>
        <View className="flex justify-center items-center bg-black/50 h-full">
          <View className="bg-white p-6 rounded-lg w-3/4">
            <Text className="text-black text-center text-2xl font-bold mb-4">
              Select a Portfolio
            </Text>

            <View className="max-h-80">
              <FlatList
                data={portfolios}
                keyExtractor={(item) => item.portfolio_id}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    onPress={() => handleSelectPortfolio(item.portfolio_id)}
                    className="py-3 px-4 bg-gray-200 rounded-lg mb-2"
                  >
                    <Text className="text-black text-center text-xl">{item.name}</Text>
                  </TouchableOpacity>
                )}
                showsVerticalScrollIndicator={false}
              />
            </View>

            <TouchableOpacity
              onPress={() => setOpenPortfolioModal(false)}
              className="mt-4 bg-red-500 py-3 rounded-lg"
            >
              <Text className="text-white text-center text-xl">Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <Modal visible={createPortfolioModal} transparent={true}>
        <View className="flex justify-center items-center bg-black/50 h-full">
          <View className="bg-white p-6 rounded-lg w-3/4">
            <Text className="text-black text-center text-2xl font-bold mb-4">
              Create New Portfolio
            </Text>

            <TextInput
              value={newPortfolioName}
              onChangeText={setNewPortfolioName}
              placeholder="Portfolio Name"
              className="border border-gray-300 rounded-lg py-2 px-4 text-lg mb-4"
            />

            <TouchableOpacity
              onPress={handleCreatePortfolio}
              className="bg-blue-500 py-3 rounded-lg"
            >
              <Text className="text-white text-center text-xl">Save Portfolio</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => setCreatePortfolioModal(false)}
              className="mt-4 bg-red-500 py-3 rounded-lg"
            >
              <Text className="text-white text-center text-xl">Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}
