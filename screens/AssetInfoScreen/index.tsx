import { useRoute } from "@react-navigation/native";
import { AddToPortfolioConfirm } from "components/AddToPortfolioConfirm";
import { Navbar } from "components/Navbar";
import { OptionComponent } from "components/OptionComponent";
import { ScreenHeader } from "components/ScreenHeader";
import { View, Text } from "react-native";
import { useContext, useEffect, useState } from "react"
import { SettingsContext } from "screens/Settings/settingsContext";
import { db } from "database";

export default function AssetInfoScreen() {
    const route = useRoute();
    const assetData = route.params?.data

    const { settings, saveSettings } = useContext(SettingsContext)

    const [note, setNote] = useState(assetData.note);
    const [amount, setAmount] = useState(assetData.amount ? assetData.amount.toString() : "")

    const test= async () => {
        let statement = `
        SELECT * FROM transactions`
        let result = await db.getAllAsync(statement)
        console.log("result: ", result)
    };

    useEffect(() => {
        test();
    }, [])

    const textColor = settings.darkMode ? "text-white" : "text-black"
    const bgColor = settings.darkMode ? "bg-brand-gray" : "bg-brand-white"


    const assetOptions = [
        {
            header: "Amount Bought",
            description: `Total amount bought (${assetData.symbol.toUpperCase()})`,
            option: "EnterText",
            textValue: amount,
            onChangeText: (newAmount) => setAmount(newAmount)
        },
        {
            header: "Full Transaction List",
            description: `View all ${assetData.symbol.toUpperCase()} transactions`,
            option: "newPage",
            id: assetData.id
        },
        {
            header: "Remove asset",
            description: "Remove all record of the asset",
            option: "Remove",
            id: assetData.id
        }
    ]


    return (
        <View className={`h-full ${bgColor}`}>
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