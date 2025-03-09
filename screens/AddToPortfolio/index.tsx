import { Text, TextInput, View } from "react-native"
import { Navbar } from "../../components/Navbar"
import { AddToPortfolioConfirm } from "../../components/AddToPortfolioConfirm"
import { AddToPortfolioComponent } from "components/AddToPortfolioComponent"
import { ScreenHeader } from "components/ScreenHeader"
import { useRoute } from "@react-navigation/native"
import { useState } from "react"
import { OptionComponent } from "components/OptionComponent"
import { ScrollView } from "react-native-gesture-handler"

export default function AddToPortfolioScreen() {
    const route = useRoute();
    const [buyPrice, setBuyPrice] = useState();
    const [amountBought, setAmountBought] = useState();
    const { selectedValue } = route.params as { selectedValue: any };
    console.log("Selected value:", selectedValue)

    const options = [
        {
            header: "Buy Price (USD)",
            description: `Enter the amount purchased in USD`,
            option: "EnterText"
        },
        {
            header: `Amount Bought (${selectedValue.label.toUpperCase()})`,
            description: `Enter the total amount bought in ${selectedValue.label.toUpperCase()}`,
            option: "EnterText"
        },
        {
            header: "Date Purchased",
            description: "Select the date that the purchase was made on.",
            option: "EnterDate"
        },
        {
            header: "Notes",
            description: "Add informational notes to your transaction.",
            option: "Enable"
        }
    ]

    return (
        <View className="bg-brand-gray h-full">
            <ScreenHeader data={`${selectedValue.label.toUpperCase()}/USD`} image={selectedValue.image} />
            <ScrollView className="">
                {options.map((option) => {
                    return <OptionComponent key={option.header} data={option}/>
                })}
            </ScrollView>
            <AddToPortfolioConfirm data={{id: selectedValue.value, symbol: selectedValue.label, amount: parseFloat(amountBought)}}/>
            <Navbar />
        </View>
    )
}
