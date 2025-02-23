import { View, TextStyle, TouchableOpacity } from "react-native";
import { HomeIcon } from "./HomeIcon";
import Svg, { Path } from "react-native-svg"
import Ionicons from "@expo/vector-icons/Entypo"
import { useNavigation } from "@react-navigation/native";
// import HomeIcon from "../assets/home-icon.svg"

import '../global.css';

export const Navbar: React.FC = () => {
    const navigation = useNavigation();

    const iconShadow: TextStyle = {
      textShadowColor: "#ffffff",
      textShadowRadius: 2,
      textShadowOffset: { width: 0, height: 0 },
    };
    return (
      <View className="absolute bottom-0 left-0 right-0 h-24 bg-brand-gray flex-row items-center justify-around border-t border-[#1c1c1c]">
      <TouchableOpacity onPress={() => navigation.navigate("Portfolio")}>
        <Ionicons name="home" color="white" size={42} />
      </TouchableOpacity>

    <View
      className="absolute -top-8 left-1/2 w-16 h-16 rounded-full bg-brand-gray items-center justify-center"
      style={{ transform: [{ translateX: -32 }] }}
    >
      <TouchableOpacity onPress={() => navigation.navigate("AddToPortfolio")}>
        <Ionicons name="circle-with-plus" color="white" size={60} />
      </TouchableOpacity>
    </View>
    
      <Ionicons name="cog" color="white" size={42} />
    </View>
    );
  };