export interface ItemData {
    id: string,
    symbol: string,
    amount: number,
    priceUsd?: number,
    icon?: string;
}

export interface SettingsItem {
    header: string,
    description: string,
    option: string,
    type?: string,
    onChangeText?: any,
    onChangeDate?: any
}