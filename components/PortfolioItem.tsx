import { Image, Settings, Text, TouchableOpacity, View } from "react-native"
import { useContext, useState } from "react"
import { ItemData } from "types";
import { useNavigation } from "@react-navigation/native";
import { SettingsContext } from "screens/Settings/settingsContext";

type Props = {
    data: ItemData;
};


const currencySymbols: Record<string, string> = {
    ADA: "₳",       // Cardano
    AED: "د.إ",     // United Arab Emirates Dirham
    AFN: "؋",      // Afghan Afghani
    ALL: "L",      // Albanian lek
    AMD: "֏",      // Armenian dram
    ANG: "ƒ",      // Netherlands Antillean guilder
    AOA: "Kz",     // Angolan kwanza
    ARB: "ARB",    // (No widely recognized symbol)
    ARS: "$",      // Argentine peso
    AUD: "$",      // Australian dollar
    AWG: "ƒ",      // Aruban florin
    AZN: "₼",      // Azerbaijani manat
    BAM: "KM",     // Bosnia and Herzegovina convertible mark
    BBD: "$",      // Barbadian dollar
    BDT: "৳",      // Bangladeshi taka
    BGN: "лв",     // Bulgarian lev
    BHD: ".د.ب",   // Bahraini dinar
    BIF: "FBu",    // Burundian franc
    BMD: "$",      // Bermudian dollar
    BNB: "BNB",    // Binance Coin
    BND: "$",      // Brunei dollar
    BOB: "Bs",     // Bolivian boliviano
    BRL: "R$",     // Brazilian real
    BSD: "$",      // Bahamian dollar
    BTC: "₿",      // Bitcoin
    BTN: "Nu.",    // Bhutanese ngultrum
    BWP: "P",      // Botswana pula
    BYN: "Br",     // Belarusian ruble
    BYR: "Br",     // Belarusian ruble (old)
    BZD: "$",      // Belize dollar
    CAD: "$",      // Canadian dollar
    CDF: "FC",     // Congolese franc
    CHF: "Fr",     // Swiss franc
    CLF: "UF",     // Chilean Unit of Account (UF)
    CLP: "$",      // Chilean peso
    CNY: "¥",      // Chinese yuan
    COP: "$",      // Colombian peso
    CRC: "₡",      // Costa Rican colón
    CUC: "$",      // Cuban convertible peso
    CUP: "$",      // Cuban peso
    CVE: "Esc",    // Cape Verdean escudo
    CZK: "Kč",     // Czech koruna
    DAI: "DAI",    // DAI (stablecoin)
    DJF: "Fdj",    // Djiboutian franc
    DKK: "kr",     // Danish krone
    DOP: "$",      // Dominican peso
    DOT: "DOT",    // Polkadot (crypto)
    DZD: "د.ج",    // Algerian dinar
    EGP: "£",      // Egyptian pound
    ERN: "Nfk",    // Eritrean nakfa
    ETB: "Br",     // Ethiopian birr
    ETH: "Ξ",      // Ethereum
    EUR: "€",      // Euro
    FJD: "$",      // Fijian dollar
    FKP: "£",      // Falkland Islands pound
    GBP: "£",      // British pound
    GEL: "₾",      // Georgian lari
    GGP: "£",      // Guernsey pound
    GHS: "₵",      // Ghanaian cedi
    GIP: "£",      // Gibraltar pound
    GMD: "D",      // Gambian dalasi
    GNF: "FG",     // Guinean franc
    GTQ: "Q",      // Guatemalan quetzal
    GYD: "$",      // Guyanese dollar
    HKD: "$",      // Hong Kong dollar
    HNL: "L",      // Honduran lempira
    HRK: "kn",     // Croatian kuna
    HTG: "G",      // Haitian gourde
    HUF: "Ft",     // Hungarian forint
    IDR: "Rp",     // Indonesian rupiah
    ILS: "₪",      // Israeli new shekel
    IMP: "£",      // Isle of Man pound
    INR: "₹",      // Indian rupee
    IQD: "ع.د",    // Iraqi dinar
    IRR: "﷼",      // Iranian rial
    ISK: "kr",     // Icelandic króna
    JEP: "£",      // Jersey pound
    JMD: "$",      // Jamaican dollar
    JOD: "د.ا",    // Jordanian dinar
    JPY: "¥",      // Japanese yen
    KES: "KSh",    // Kenyan shilling
    KGS: "с",      // Kyrgyzstani som
    KHR: "៛",      // Cambodian riel
    KMF: "CF",     // Comorian franc
    KPW: "₩",      // North Korean won
    KRW: "₩",      // South Korean won
    KWD: "د.ك",    // Kuwaiti dinar
    KYD: "$",      // Cayman Islands dollar
    KZT: "₸",      // Kazakhstani tenge
    LAK: "₭",      // Lao kip
    LBP: "ل.ل",    // Lebanese pound
    LKR: "Rs",     // Sri Lankan rupee
    LRD: "$",      // Liberian dollar
    LSL: "L",      // Lesotho loti
    LTC: "Ł",      // Litecoin
    LTL: "Lt",     // Lithuanian litas (old)
    LVL: "Ls",     // Latvian lats (old)
    LYD: "ل.د",    // Libyan dinar
    MAD: "د.م.",   // Moroccan dirham
    MDL: "L",      // Moldovan leu
    MGA: "Ar",     // Malagasy ariary
    MKD: "ден",    // Macedonian denar
    MMK: "K",      // Myanmar kyat
    MNT: "₮",      // Mongolian tögrög
    MOP: "MOP$",   // Macanese pataca
    MRO: "UM",     // Mauritanian ouguiya
    MUR: "Rs",     // Mauritian rupee
    MVR: ".ރ",     // Maldivian rufiyaa
    MWK: "MK",     // Malawian kwacha
    MXN: "$",      // Mexican peso
    MYR: "RM",     // Malaysian ringgit
    MZN: "MT",     // Mozambican metical
    NAD: "$",      // Namibian dollar
    NGN: "₦",      // Nigerian naira
    NIO: "C$",     // Nicaraguan córdoba
    NOK: "kr",     // Norwegian krone
    NPR: "₨",      // Nepalese rupee
    NZD: "$",      // New Zealand dollar
    OMR: "ر.ع",    // Omani rial
    OP: "OP",      // (No widely recognized symbol)
    PAB: "B/.",    // Panamanian balboa
    PEN: "S/.",    // Peruvian sol
    PGK: "K",      // Papua New Guinean kina
    PHP: "₱",      // Philippine peso
    PKR: "₨",      // Pakistani rupee
    PLN: "zł",     // Polish złoty
    PYG: "₲",      // Paraguayan guaraní
    QAR: "ر.ق",    // Qatari riyal
    RON: "lei",    // Romanian leu
    RSD: "дин",    // Serbian dinar
    RUB: "₽",      // Russian ruble
    RWF: "FRw",    // Rwandan franc
    SAR: "ر.س",    // Saudi riyal
    SBD: "$",      // Solomon Islands dollar
    SCR: "₨",      // Seychellois rupee
    SDG: "ج.س",    // Sudanese pound
    SEK: "kr",     // Swedish krona
    SGD: "$",      // Singapore dollar
    SHP: "£",      // Saint Helena pound
    SLL: "Le",     // Sierra Leonean leone
    SOL: "SOL",    // Solana (crypto)
    SOS: "Sh",     // Somali shilling
    SRD: "$",      // Surinamese dollar
    STD: "Db",     // São Tomé and Príncipe dobra
    SVC: "₡",      // Salvadoran colón
    SYP: "£",      // Syrian pound
    SZL: "E",      // Eswatini lilangeni
    THB: "฿",      // Thai baht
    TJS: "ЅМ",     // Tajikistani somoni
    TMT: "m",      // Turkmenistani manat
    TND: "د.ت",    // Tunisian dinar
    TOP: "T$",     // Tongan paʻanga
    TRY: "₺",      // Turkish lira
    TTD: "$",      // Trinidad and Tobago dollar
    TWD: "NT$",    // New Taiwan dollar
    TZS: "TSh",    // Tanzanian shilling
    UAH: "₴",      // Ukrainian hryvnia
    UGX: "USh",    // Ugandan shilling
    USD: "$",      // US dollar
    UYU: "$",      // Uruguayan peso
    UZS: "so'm",   // Uzbekistani soʻm
    VEF: "Bs",     // Venezuelan bolívar
    VND: "₫",      // Vietnamese đồng
    VUV: "VT",     // Vanuatu vatu
    WST: "WS$",    // Samoan tālā
    XAF: "Fr",     // Central African CFA franc
    XAG: "Ag",     // Silver
    XAU: "Au",     // Gold
    XCD: "$",      // East Caribbean dollar
    XDR: "SDR",    // Special drawing rights
    XOF: "Fr",     // West African CFA franc
    XPD: "Pd",     // Palladium
    XPF: "Fr",     // CFP franc
    XPT: "Pt",     // Platinum
    XRP: "XRP",    // Ripple
    YER: "﷼",      // Yemeni rial
    ZAR: "R",      // South African rand
    ZMK: "ZK",     // Zambian kwacha (old)
    ZMW: "ZK",     // Zambian kwacha
    ZWL: "$"       // Zimbabwean dollar
  };


  export const PortfolioItem: React.FC<Props> = ({ data }) => {
    const navigation = useNavigation();
    const { settings } = useContext(SettingsContext);
    const currencySymbol = currencySymbols[settings.currency] || "$";

    const textColor = settings.darkMode ? "text-white" : "text-black"
    const bgColor = settings.darkMode ? "bg-brand-gray" : "bg-brand-gray"
  
    let change = 0;
    if (data.high24h && data.high24h > 0) {
      change = ((data.priceUsd / data.high24h) * 100) - 100;
    } 

    const formattedChange = change.toLocaleString(undefined, { 
      maximumFractionDigits: 2,
      minimumFractionDigits: 2 
    });
  
    const changeComponent = (
      <Text
        className={`ml-[1vw] text-sm ${
          change || data.change24h < 0 ? "text-red-500" : "text-green-500"
        }`}
      >
        {`${ data.type == "crypto" ? formattedChange : (data.change24h).toLocaleString()}% from 24h ago`}
      </Text>
    );
  
    const totalAmount = data.quantity * data.priceUsd;
    const formattedTotal = totalAmount.toLocaleString(undefined, {
      maximumFractionDigits: 3,
      minimumFractionDigits: 2,
    });
  
    const formattedPrice = data.priceUsd?.toLocaleString(undefined, {
      maximumFractionDigits: 2,
      minimumFractionDigits: 2,
    });

    const borderColor = settings.darkMode ? "" : "#ebebeb"
  
    return (
      <TouchableOpacity onPress={() => navigation.navigate("AssetInfoScreen", { data })}>
        <View className={`flex-row h-[10vh] w-full border-b`} style={{
          borderColor: settings.darkMode ? "" : "#ebebeb",
        }}>  
          <View className="flex-row items-center ml-[3vw]">
            <Image className="h-10 w-10 rounded-full" source={{ uri: data.icon }} />
            <View className="flex-col ml-[3vw]">
              <Text className={`${textColor} text-xl font-bold`}>{data.symbol?.toUpperCase()}</Text>
              <Text className={`${textColor} text-sm`}>
                {data.quantity.toLocaleString()} | {currencySymbol}{formattedPrice}
              </Text> 
            </View>
          </View>
          <View className="flex-row items-center justify-end flex-1 mr-[2vw]">
            <View className="flex-col ml-[1vw] items-end">
              <Text className={`${textColor} text-right text-xl ml-[1vw] font-bold`}>
                {currencySymbol}{formattedTotal}
              </Text>
              {changeComponent}
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  };
  