import React, { useContext, useEffect, useState } from 'react';
import { View, Text, ScrollView, Settings } from 'react-native';
import { db } from '../../database';
import { ScreenHeader } from 'components/ScreenHeader';
import { Navbar } from 'components/Navbar';
import { OptionComponent } from 'components/OptionComponent';
import { SettingsContext } from 'screens/Settings/settingsContext';

export default function AssetTransactionsScreen({ route }) {
  const { assetId } = route.params;
  const [transactions, setTransactions] = useState([]);
  const { settings, saveSettings } = useContext(SettingsContext)
  const [note, setNote] = useState("")


  useEffect(() => {
    const fetchTransactions = async () => {
      const query = `SELECT * FROM transactions WHERE asset_id = ?`;
      const result = await db.getAllAsync(query, [assetId]);
      console.log("resutlresultresu: ", result);
      setTransactions(result);
    };
  
    fetchTransactions();
  }, [assetId, transactions.length]);
 
    const capitalizeFirstLetter = (val: any) => {
        return String(val).charAt(0).toUpperCase() + String(val).slice(1);
    }



  return (
    <View className="flex-1 bg-brand-gray">
        <ScreenHeader data={`  ${capitalizeFirstLetter(assetId)} Transactions`}/>
      <ScrollView contentContainerStyle={{ paddingBottom: 100 }}>
      {transactions.map((tx) => {
  const { tx_id, date, quantity, asset_id, price, note } = tx;

  return (
    <OptionComponent
      key={tx_id}
      data={{
        header: `Date Purchased: ${date}`,
        description: `${quantity} ${capitalizeFirstLetter(asset_id)} @ ${price} ${settings.currency} | Note: ${note || "None"}`,
        option: "changeNotes",
        noteValue: note,
        onChangeNotesText: async (newNote) => {
            try {
                console.log("Updating tx_id:", tx_id, "with note:", newNote);
        
                await db.execAsync(
                    `UPDATE transactions SET note = ? WHERE tx_id = ?`,
                    [newNote, tx_id]
                );
        
                const updated = await db.getFirstAsync(
                    `SELECT note FROM transactions WHERE tx_id = ?`,
                    [tx_id]
                );
                console.log("Verified updated note:", updated?.note);
        
                const updatedTransactions = transactions.map((t) =>
                    t.tx_id === tx_id ? { ...t, note: newNote } : t
                );
                setTransactions(updatedTransactions);
                
                console.log("State updated with new transactions");
            } catch (error) {
                console.error("Failed to update note:", error);
            }
        },
      }}
    />
  );
})}
      </ScrollView>
      <Navbar />
    </View>
  );
}
