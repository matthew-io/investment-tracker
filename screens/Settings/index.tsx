import { Navbar } from "components/Navbar"
import { SettingsComponent } from "components/SettingsComponent"
import { SettingsHeader } from "components/SettingsHeader"
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
            description: "Lorem ipsum, Lorem ipsum, Lorem ipsum, Lorem ipsum, Lorem ipsum, Lorem ipsum",
            option: "Enable"
        },
        {
            header: "Enable AI Portfolio Summaries",
            description: "Lorem ipsum, Lorem ipsum, Lorem ipsum, Lorem ipsum, Lorem ipsum, Lorem ipsum",
            option: "Enable"
        },
        {
            header: "Summary Frequency",
            description: "Lorem ipsum, Lorem ipsum, Lorem ipsum, Lorem ipsum, Lorem ipsum, Lorem ipsum",
            option: "Enable"
        },
        {
            header: "Export Portfolio Data",
            description: "Lorem ipsum, Lorem ipsum, Lorem ipsum, Lorem ipsum, Lorem ipsum, Lorem ipsum",
            option: "Enable"
        }
    ]
    
    return (
        <View className="h-full bg-brand-gray">
            <SettingsHeader data="Settings"/>
            <ScrollView contentContainerStyle={{ paddingBottom: 80 }}>
                {
                    settingsItems.map((item) => {
                        return (
                            <SettingsComponent data={ item } /> 
                        )
                    })
                }
            </ScrollView>
            <Navbar />
        </View>
    ) 
}