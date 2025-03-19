import { useRoute } from "@react-navigation/native";
import { AddToPortfolioConfirm } from "components/AddToPortfolioConfirm";
import { Navbar } from "components/Navbar";
import { OptionComponent } from "components/OptionComponent";
import { ScreenHeader } from "components/ScreenHeader";
import { View, Text } from "react-native";
import { useState } from "react"

export default function AssetInfoScreen() {
    const route = useRoute();
    const assetData = route.params?.data

    const [note, setNote] = useState(assetData.note);
    const [amount, setAmount] = useState(assetData.amount ? assetData.amount.toString() : "")

    const assetOptions = [
        {
            header: "Amount Bought",
            description: `Total amount bought (${assetData.symbol.toUpperCase()})`,
            option: "EnterText",
            textValue: amount,
            onChangeText: (newAmount) => setAmount(newAmount)
        },
        {
            header: "Edit Notes",
            description: "Edit transaction notes",
            option: "Enable",
            noteValue: note,
            onChangeNotesText: (updatedNote: any) => setNote(updatedNote),
        },
        {
            header: "Remove asset",
            description: "Remove all record of the asset",
            option: "Remove",
            id: assetData.id
        }
    ]


    return (
        <View className="h-full bg-brand-gray">
            <ScreenHeader image={assetData.icon} data={assetData.symbol.toUpperCase()} />
            {
                assetOptions.map((option) => {
                    return (
                        <OptionComponent key={option.header} data={ option } />
                    )
                })
            }
            <AddToPortfolioConfirm data={{ id: assetData.id, symbol: assetData.symbol, amount: amount, note: note, mode: "update" }}/>
            <Navbar />
        </View>
    
    )
}