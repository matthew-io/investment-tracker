export interface ItemData {
    id: string;
    symbol: string;
    amount: number;
    note?: string;
    priceUsd?: number;
    icon?: string;
  }
  
  export interface StockData {
    ticker: string;
    close: number;
    icon?: string;
  }
  
  export interface SettingsItem {
    header: string;
    description: string;
    option: string;
    type?: "toggle" | "remove" | "text" | "date" | "navigate" | "none";
    onChangeText?: (text: string) => void;
    onChangeDate?: (date: Date) => void;
    onChangeNotesText?: (notes: string) => void;
    textValue?: string;
    noteValue?: string;
    id?: string;
  }
  