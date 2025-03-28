import React, { useEffect, useState, useContext } from "react";
import { View, Text, ScrollView, ActivityIndicator } from "react-native";
import { Navbar } from "components/Navbar";
import { ScreenHeader } from "components/ScreenHeader";
import { SettingsContext } from "screens/Settings/settingsContext";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function SummaryScreen({ route }) {
    const { totalValue, portfolioChange, holdings } = route.params;
  const [summary, setSummary] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const { settings } = useContext(SettingsContext);


    const textColor = settings.darkMode ? "text-white" : "text-black"
    const bgColor = settings.darkMode ? "bg-brand-gray" : "bg-brand-white"


  useEffect(() => {
    const generateOrLoadSummary = async () => {
      try {
        const lastSummary = await AsyncStorage.getItem("ai_summary");
        const lastGeneratedAt = await AsyncStorage.getItem("ai_summary_time");

        const now = Date.now();
        const oneDay = 24 * 60 * 60 * 1000;

       
        // if (lastSummary && lastGeneratedAt && now - parseInt(lastGeneratedAt) < oneDay) {
        //   setSummary(lastSummary);
        //   setLoading(false);
        //   return;
        // }

        const topGainer = holdings.reduce((a, b) => (a.change24h > b.change24h ? a : b));
        const topLoser = holdings.reduce((a, b) => (a.change24h < b.change24h ? a : b));

        const prompt = `My portfolio value changed by ${portfolioChange.toFixed(
          2
        )}%. The top gainer was ${topGainer.symbol} with ${topGainer.change24h.toFixed(
          2
        )}% and the biggest loser was ${topLoser.symbol} with ${topLoser.change24h.toFixed(
          2
        )}%.Please summarise the state of my portfolio, you can provide links/news articles etc. to help explain the change. Speak as an other, not in first person.`;

        const openaiRes = await fetch("https://api.openai.com/v1/chat/completions", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
          },
          body: JSON.stringify({
            model: "gpt-4",
            messages: [{ role: "user", content: prompt }],
          }),
        });


        const json = await openaiRes.json();
        const aiText = json.choices?.[0]?.message?.content?.trim();

        if (aiText) {
          setSummary(aiText);
          await AsyncStorage.setItem("ai_summary", aiText);
          await AsyncStorage.setItem("ai_summary_time", now.toString());
        } else {
          setSummary("Failed to generate summary.");
        }
      } catch (err) {
        console.error("AI summary error:", err);
        setSummary("Error generating AI summary.");
      } finally {
        setLoading(false);
      }
    };

    generateOrLoadSummary();
  }, []);

  return (
    <View className={`h-full ${bgColor}`}>
      <ScreenHeader data={"Portfolio Summary"} />
      <ScrollView className={`flex-1 ${bgColor} p-4`} >
        <Text className={`${textColor} text-2xl font-bold mb-4`}>AI Summary</Text>
        {loading ? (
          <View className="mt-4">
               <Text className={`${textColor} mt-2 text-base`}>Generating AI summary...</Text>
            <ActivityIndicator color="white" size="large" />
          </View>
        ) : (
          <Text className={`${textColor} text-base`}>{summary}</Text>
        )}
      </ScrollView>
      <Navbar />
    </View>
  );
}