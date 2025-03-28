# Instructions

To start, cd into the main directory and run:

``
npm start
``

If you are in a development build press s to switch to Expo Go, otherwise you will see errors.

From there, press **i** to open in the iOS simulator or **a** to open in the Android simulator as per the onscreen instructions.

---

You will also need 3 API keys (4, if you want to test AI generated portfolio summaries). 

The three API key's you need are a [Coingecko API Key](https://www.coingecko.com/en/api), a [Polygon IO API Key](https://polygon.io/) and a [Etherscan API Key](https://etherscan.io/apis).
If you wish to opt into AI generated portfolio summaries, you'll also need an [OpenAI API Key](https://platform.openai.com/api-keys)

Once you have the required API keys, you'll need to create a dotenv that follows this format:
``
COINGECKO_API_KEY=MY_API_KEY
POLYGON_IO_API_KEY=MY_API_KEY
ETHERSCAN_API_Key=MY_API_KEY
OPENAI_API_KEY=MY_API_KEY
``
