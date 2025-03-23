import { Text, TextInput, View } from "react-native"
import { Navbar } from "../../components/Navbar"
import { AddToPortfolioConfirm } from "../../components/AddToPortfolioConfirm"
import { AddToPortfolioComponent } from "components/AddToPortfolioComponent"
import { ScreenHeader } from "components/ScreenHeader"
import { useRoute } from "@react-navigation/native"
import { useContext, useState } from "react"
import { OptionComponent } from "components/OptionComponent"
import { ScrollView } from "react-native-gesture-handler"
import { SettingsContext } from "screens/Settings/settingsContext"

export default function AddToPortfolioScreen() {
    const route = useRoute();
    const { settings } = useContext(SettingsContext);
    const [buyPrice, setBuyPrice] = useState();
    const [buyDate, setBuyDate] = useState();
    const [notes, setNotes] = useState();
    const [amountBought, setAmountBought] = useState();
    const { selectedValue } = route.params as { selectedValue: any };

    const textColor = settings.darkMode ? "text-white" : "text-black"
    const bgColor = settings.darkMode ? "bg-brand-gray" : "bg-brand-white"

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
          header: `Buy Price (${settings.currency})`,
          description: `Enter the amount purchased in ${settings.currency}`,
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

      console.log(selectedValue)
      

    return (
        <View className={`${bgColor} h-full`}>
            <ScreenHeader data={selectedValue.ticker ? `${selectedValue.ticker}/${settings.currency}` : `${selectedValue.label.toUpperCase()}/${settings.currency}`} image={selectedValue.image} />
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
