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
    const [buyDate, setBuyDate] = useState();
    const [notes, setNotes] = useState();
    const [amountBought, setAmountBought] = useState();
    const { selectedValue } = route.params as { selectedValue: any };

    console.log("Selected value: ", selectedValue)

    const handleBuyPriceChange = (value: any) => {
        setBuyPrice(value);
    }

    const handleAmountBoughtChange = (value: any) => {
        setAmountBought(value);
    }

    const handleBuyDateChange = (value: any) => {
        setBuyDate(value);
    } 

    const handleNotesTextChange = (value: any) => {
        setNotes(value)
    }

    const options = [
        {
          header: "Buy Price (USD)",
          description: `Enter the amount purchased in USD`,
          option: "EnterText",
          onChangeText: handleBuyPriceChange
        },
        {
          header: `Amount Bought (${
            selectedValue.ticker ? selectedValue.ticker.toUpperCase() : selectedValue.label.toUpperCase()
          })`,
          description: "Enter the total amount bought",
          option: "EnterText",
          onChangeText: handleAmountBoughtChange
        },
        {
          header: "Date Purchased",
          description: "Select the date that the purchase was made on.",
          option: "EnterDate",
          onChangeDate: handleBuyDateChange
        },
        {
          header: "Notes",
          description: "Add informational notes to your transaction.",
          option: "Enable",
          onChangeNotesText: handleNotesTextChange
        }
      ];
      

    return (
        <View className="bg-brand-gray h-full">
            <ScreenHeader data={selectedValue.ticker ? `${selectedValue.ticker}/USD` : `${selectedValue.label.toUpperCase()}/USD`} image={selectedValue.image} />
            <ScrollView className="">
                {options.map((option) => {
                    return <OptionComponent key={option.header} data={option}/>
                })}
            </ScrollView>
            {selectedValue.ticker ? (
                <AddToPortfolioConfirm data={{id: selectedValue._index, symbol: selectedValue.ticker, date: buyDate, notes: notes, amount: parseFloat(amountBought), type: "stock"}}/>
            ) : (
                <AddToPortfolioConfirm data={{id: selectedValue.value, symbol: selectedValue.label, date: buyDate, notes: notes, amount: parseFloat(amountBought), type: "crypto"}}/>
            )}
           
            <Navbar />
        </View>
    )
}
