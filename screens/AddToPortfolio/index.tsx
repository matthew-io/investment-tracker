import { Text, View } from "react-native"
import { Navbar } from "../../components/Navbar"
import { AddToPortfolioConfirm } from "../../components/AddToPortfolioConfirm"
import { AddToPortfolioComponent } from "components/AddToPortfolioComponent"
import { SettingsHeader } from "components/SettingsHeader"

export default function AddToPortfolioScreen() {
    return (
        <View className="bg-brand-gray h-full">
            <SettingsHeader data="BTC/GBP" />
            <AddToPortfolioConfirm />
            <Navbar />
        </View>
    )
}
