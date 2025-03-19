import { COINGECKO_API_KEY } from "@env"

export const fetchCoinData = async (assetIds: string[]) => {
    if (!assetIds.length) {
        return { prices: {}, icons: {}, total: 0 }
    }

    const idList = assetIds.join("%2C");

    const url = `https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=${idList}&order=market_cap_desc`;
    const options = {
        method: 'GET',
        headers: {
        accept: 'application/json',
        'x-cg-demo-api-key': COINGECKO_API_KEY
        }
    };

    const response = await fetch(url, options)
    const data = await response.json();

    const prices: Record<string, number> = {};
    const icons: Record<string, string> = {};

    data.forEach((coin: any) => {
        prices[coin.id] = coin.current_price;
        icons[coin.id] = coin.image
    })

    return { prices, icons }
}

export const fetchPersonalCoinData = async () => {
    try {
      setLoading(true);
      let runningTotal = 0;
  
      const dbData = await db.getAllAsync("SELECT id, symbol, amount, note FROM test");
  
      if (dbData.length === 0) {
        console.log("No holdings found in database.");
        setLoading(false);
        return;
      }
  
      const coinIds = dbData.map((coin) => coin.id).join("%2C");
  
      const url = `https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=${coinIds}`;
      const options = {
        method: 'GET',
        headers: { accept: 'application/json', 'x-cg-demo-api-key': COINGECKO_API_KEY }
      };
  
      const response = await fetch(url, options);
      const data = await response.json();
  
      setHoldings(dbData);

      console.log("DB data", dbData)
  
      const newPrices: Record<string, number> = {};
      const newIcons: Record<string, string> = {};
  
      data.forEach((coin: any) => {
        const amount = dbData.find((h) => h.id === coin.id)?.amount ?? 0;
        runningTotal += parseFloat(coin.current_price * amount);
        newPrices[coin.id] = coin.current_price;
        newIcons[coin.id] = coin.image;
      });
  
      setPrices(newPrices);
      setIcons(newIcons);
      setTotalValue(runningTotal);
    } catch (error) {
      console.log("Failed to fetch coin data", error);
    } finally {
      setLoading(false);
    }
  };