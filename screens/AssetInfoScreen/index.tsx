import { useRoute } from "@react-navigation/native";
import { AddToPortfolioConfirm } from "components/AddToPortfolioConfirm";
import { Navbar } from "components/Navbar";
import { OptionComponent } from "components/OptionComponent";
import { ScreenHeader } from "components/ScreenHeader";
import { View, Text } from "react-native";

export default function AssetInfoScreen() {
    const route = useRoute();
    const assetData = route.params?.data

    const assetOptions = [
        {
            header: "Amount Bought",
            description: `Total amount bought (${assetData.symbol.toUpperCase()})`,
            option: "EnterText",
            textValue: assetData.amount.toLocaleString()
        },
        {
            header: "Edit Notes",
            description: "Edit transaction notes",
            option: "Enable",
        },
        {
            header: "Remove asset",
            description: "Remove all record of the asset",
            option: "Enable"
        }
    ]

    return (
        <View className="h-full bg-brand-gray">
            <ScreenHeader image={assetData.icon} data={assetData.symbol.toUpperCase()} />
            {
                assetOptions.map((asset) => {
                    return (
                        <OptionComponent key={asset.header} data={ asset }/>
                    )
                })
            }
            <AddToPortfolioConfirm />
            <Navbar />
        </View>
    
    )
}