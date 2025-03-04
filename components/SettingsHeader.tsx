import { View, Text } from "react-native"
import { SettingsComponent } from "./SettingsComponent"
import { SettingsItem } from "types"

type Props = {
    data: string;
}

export const SettingsHeader: React.FC<Props> = ({ data }) => {
    
    return (
        <View>
            <View className="flex-row h-[25vh] w-full items-center bg-brand-gray justify-between"
                style={{
                    shadowColor: '#000',
                    shadowOffset: { width: 0, height: 1 },
                    shadowOpacity: 1,
                    shadowRadius: 1,
                    elevation: 5,
                }}>
                    <Text className="text-white font-bold text-4xl ml-[4vw] mt-[4vh]">{data}</Text>
            </View>
        </View>
    )
}