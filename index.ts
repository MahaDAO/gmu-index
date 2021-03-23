require("dotenv").config();
const request = require("request-promise");
const CoinGecko = require("coingecko-api");
const CoinGeckoClient = new CoinGecko();
const csv = require("csv-parser");
const fs = require("fs");

const sendRequest = async (method, url, body) => {
  const option = {
    method: method,
    url: url,
    body: JSON.stringify(body),
  };

  return await request(option);
};

const goldPriceRequest = async (method, url) => {
  const option = {
    method: method,
    url: url,
    headers: {
      "x-access-token": process.env.GOLD_API,
    },
  };

  return await request(option);
};

const GMU = async () => {
  const storedFiatValues: any = {};

  const data = await sendRequest(
    "GET",
    "https://api.ratesapi.io/api/latest?base=USD",
    ""
  );

  const parsedData = await JSON.parse(data);

  const usdWorth = (parsedData.rates.USD / 100) * 29.93;
  const euroWorth = (parsedData.rates.EUR / 100) * 23.23;
  const yuanWorth = (parsedData.rates.CNY / 100) * 18.9;
  const yenWorth = (parsedData.rates.JPY / 100) * 10.17;
  const inrWorth = (parsedData.rates.INR / 100) * 4.85;
  const poundWorth = (parsedData.rates.GBP / 100) * 4.78;
  const brazillianRealWorth = (parsedData.rates.BRL / 100) * 3.84;
  const cadWorth = (parsedData.rates.CAD / 100) * 3.18;
  const swissFrancWorth = (parsedData.rates.CHF / 100) * 1.12;

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

  console.log("gold weighted price", goldsPercentage);
  console.log("bitcoin weighted price", bitcoinPercentage);
  console.log("fiat weighted price", fiatPercentage);

  const indexPrice = goldsPercentage + bitcoinPercentage + fiatPercentage;
  const startingPrice = 3025;
  const normalizedIndexPrice = indexPrice / startingPrice;

  console.log("starting price", startingPrice);
  console.log("index price", indexPrice);
  console.log("normalized index price", normalizedIndexPrice);

  return normalizedIndexPrice;
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

GMU();
