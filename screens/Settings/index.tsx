import { Navbar } from "components/Navbar"
import { OptionComponent } from "components/OptionComponent"
import { ScreenHeader } from "components/ScreenHeader"
import { TotalValue } from "components/TotalValue"
import { Text, View, ScrollView, ActivityIndicator } from "react-native";
import { SettingsItem } from "types"

export default function SettingsScreen() {
    const settingsItems: SettingsItem[] = 
    [
        {
            header: "Currency",
            description: "Set the default currency, all transactional and financial data will be displayed in your chosen currency.",
            option: "Enable"
        },
        {
            header: "Enable face ID",
            description: "Lock your portfolio data behind face ID. You'll be asked to provide your face ID every time you open the app.",
            option: "Enable"
        },
        {
            header: "Enable AI Portfolio Summaries",
            description: "Enabling AI portfolio summaries to give a more detailed analysis of the recent state of your portfolio.",
            option: "Enable"
        },
        {
            header: "Summary Frequency",
            description: "Set how often you would like to receive portfolio summaries.",
            option: "Enable"
        },
        {
            header: "Export Portfolio Data",
            description: "Export your portfolio data in JSON format.",
            option: "Enable"
        }
    ]
    
    return (
        <View className="h-full bg-brand-gray">
            <ScreenHeader data="Settings"/>
            <ScrollView contentContainerStyle={{ paddingBottom: 80 }}>
                {
                    settingsItems.map((item) => {
                        return (
                            <OptionComponent key={item.header} data={ item } /> 
                        )
                    })
                }
            </ScrollView>
            <Navbar />
        </View>
    ) 
}