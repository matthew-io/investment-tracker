import { Navbar } from "components/Navbar"
import { OptionComponent } from "components/OptionComponent"
import { ScreenHeader } from "components/ScreenHeader"
import { TotalValue } from "components/TotalValue"
import { useContext } from "react";
import { Text, View, ScrollView, ActivityIndicator } from "react-native";
import { SettingsItem } from "types"
import { SettingsContext } from "./settingsContext";

export default function SettingsScreen() {
    const { settings, saveSettings } = useContext(SettingsContext)

    const textColor = settings.darkMode ? "text-white" : "text-black"
    const bgColor = settings.darkMode ? "bg-brand-gray" : "bg-brand-white"

    const settingsItems: SettingsItem[] = 
    [
        {
            header: "Currency",
            description: "Set the default currency, all transactional and financial data will be displayed in your chosen currency.",
            option: "changeCurrency"
        },
        {
            header: `${settings.faceIdEnabled ? 'Disable Face ID' : 'Enable Face ID'}`,
            description: "Lock your portfolio data behind face ID. You'll be asked to provide your face ID every time you open the app.",
            option: "enableFaceId",
            type: "toggle"
        },
        {
            header: `${!settings.enableAISummaries ? 'Enable AI Portfolio Summaries' : 'Disable AI Portfolio Summaries'}`,
            description: "Enabling AI portfolio summaries to give a more detailed analysis of the recent state of your portfolio.",
            option: "enableAISummaries",
            type: "toggle"
        },
        {
            header: "Summary Frequency",
            description: "Set how often you would like to receive portfolio summaries.",
            option: "setSummaryFrequency"
        },
        // {
        //     header: "Export Portfolio Data",
        //     description: "Export your portfolio data in JSON format.",
        //     option: "Enable",

        // }
    ]
    
    return (
        <View className={`h-full ${bgColor}`}>
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