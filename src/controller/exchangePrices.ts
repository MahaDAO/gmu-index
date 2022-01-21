require("dotenv").config();
const request = require("request-promise");
const CoinGecko = require("coingecko-api");
const CoinGeckoClient = new CoinGecko();
const csv = require("csv-parser");
const fs = require("fs");

const sendRequest = async (method: any, url: any, body: any) => {
  const option = {
    method: method,
    url: url,
    headers: {
      "content-Type": "application/json",
    },
    body: JSON.stringify(body),
  };
  return await request(option);
};

const goldPriceRequest = async (method: any, url: any) => {
  const option = {
    method: method,
    url: url,
    headers: {
      "x-access-token": process.env.GOLD_API,
    },
  };

  return await request(option);
};

export const GMU = async (req: any, res: any) => {
  try {
    const data = await sendRequest(
      "GET",
      `http://apilayer.net/api/live?access_key=${process.env.ACCESS_KEY}`,
      ""
    );

    const parsedData = await JSON.parse(data);

    const usdWorth = (parsedData.quotes.USDUSD / 100) * 29.93;
    const euroWorth = (parsedData.quotes.USDEUR / 100) * 23.23;
    const yuanWorth = (parsedData.quotes.USDCNY / 100) * 18.9;
    const yenWorth = (parsedData.quotes.USDJPY / 100) * 10.17;
    const inrWorth = (parsedData.quotes.USDINR / 100) * 4.85;
    const poundWorth = (parsedData.quotes.USDGBP / 100) * 4.78;
    const brazillianRealWorth = (parsedData.quotes.USDBRL / 100) * 3.84;
    const cadWorth = (parsedData.quotes.USDCAD / 100) * 3.18;
    const swissFrancWorth = (parsedData.quotes.USDCHF / 100) * 1.12;

    const fiatTotal =
      usdWorth +
      euroWorth +
      yuanWorth +
      yenWorth +
      inrWorth +
      poundWorth +
      brazillianRealWorth +
      cadWorth +
      swissFrancWorth;

    const fiatPercentage = (fiatTotal / 100) * 80;

    const bitcoinPrice = await getBTCPrice();
    const bitcoinPercentage = (bitcoinPrice / 100) * 5;

    const goldPrice = await getGoldPrice();
    const goldsPercentage = (goldPrice / 100) * 15;

    // console.log("gold weighted price", goldsPercentage);
    // console.log("bitcoin weighted price", bitcoinPercentage);
    // console.log("fiat weighted price", fiatPercentage);

    const indexPrice = goldsPercentage + bitcoinPercentage + fiatPercentage;
    const startingPrice = 1214.5;
    const normalizedIndexPrice = indexPrice / startingPrice;

    // console.log("starting price", startingPrice);
    // console.log("index price", indexPrice);
    // console.log("normalized index price", normalizedIndexPrice);

    // return normalizedIndexPrice;
    res.send({
      goldsPercentage: goldsPercentage,
      bitcoinPercentage: bitcoinPercentage,
      fiatPercentage: fiatPercentage,
      startingPrice: startingPrice,
      indexPrice: indexPrice,
      normalizedIndexPrice: normalizedIndexPrice
    })
  } catch (e) {
    res.send(e)
  }
};

const getGoldPrice = async () => {
  const goldRequest = await goldPriceRequest(
    "GET",
    "https://www.goldapi.io/api/XAU/USD"
  );

  const goldData = JSON.parse(goldRequest);
  return goldData.price;
};

const getBTCPrice = async () => {
  const bitcoinPricRequest = await CoinGeckoClient.coins.fetch("bitcoin", {});
  return bitcoinPricRequest.data.market_data.current_price.usd;
};
