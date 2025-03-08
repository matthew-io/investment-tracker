import { Text, TextInput, View } from "react-native"
import { Navbar } from "../../components/Navbar"
import { AddToPortfolioConfirm } from "../../components/AddToPortfolioConfirm"
import { AddToPortfolioComponent } from "components/AddToPortfolioComponent"
import { SettingsHeader } from "components/SettingsHeader"
import { useRoute } from "@react-navigation/native"
import { useState } from "react"

export default function AddToPortfolioScreen() {
    const route = useRoute();
    const [buyPrice, setBuyPrice] = useState();
    const [amountBought, setAmountBought] = useState();
    const { selectedValue } = route.params as { selectedValue: any };
    console.log("Selected value:", selectedValue)

    return (
        <View className="bg-brand-gray h-full">
            <SettingsHeader data={`${selectedValue.label.toUpperCase()}/GBP`} />
            <View className="mx-2 mt-4">
                <Text className="text-2xl text-white">Buy Price (GBP)</Text>
                <View className="flex-row items-center border-2 mt-2 h-12 border-white text-white p-2">
                    <Text className="text-white text-lg">$</Text>
                    <TextInput
                        className="flex-1 text-white p-2"
                        keyboardType="numeric"
                        value={buyPrice ?? ""}
                        onChangeText={(text) => setBuyPrice(text)}
                    />
                </View>
            </View>
            <View className="mx-2 mt-4">
                <Text className="text-2xl text-white">Amount bought ({selectedValue.label.toUpperCase()})</Text>
                <TextInput className="border-2 mt-2 h-12 border-white text-white p-2" value={amountBought ?? ""} onChangeText={(text) => setAmountBought(text)} />
            </View>
            <AddToPortfolioConfirm data={{id: selectedValue.value, symbol: selectedValue.label, amount: parseFloat(amountBought)}}/>
            <Navbar />
        </View>
    )
}
