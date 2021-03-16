require('dotenv').config()
const request = require('request-promise')
const CoinGecko = require('coingecko-api');
const CoinGeckoClient = new CoinGecko();
const csv = require('csv-parser')
const fs = require('fs')
const results = [];

const sendRequest = async (method, url, body) => {
    const option = {
        'method': method,
        'url': url,
        body: JSON.stringify(body)
    }

    return await request(option)
}

const goldPriceRequest = async (method, url) => {
    const option = {
        'method': method,
        'url': url,
        'headers': {
            'x-access-token': process.env.GOLD_API
        }
    }

    return await request(option)
}

const GMU = async () => {
    let storedFiatValues: any = {}

    const data = await sendRequest(
        'GET', 
        'https://api.ratesapi.io/api/latest?base=USD',
        ''
    )
    
    let parsedData = await JSON.parse(data)
    storedFiatValues.USD = parsedData.rates.USD       
    storedFiatValues.EUR = parsedData.rates.EUR
    storedFiatValues.CNY = parsedData.rates.CNY
    storedFiatValues.JPY = parsedData.rates.JPY
    storedFiatValues.INR = parsedData.rates.INR
    storedFiatValues.GBP = parsedData.rates.GBP
    storedFiatValues.BRL = parsedData.rates.BRL
    storedFiatValues.CAD = parsedData.rates.CAD
    storedFiatValues.CHF = parsedData.rates.CHF
    
    let usdWorth = ( parsedData.rates.USD / 100 ) * 29.93
    let euroWorth = ( parsedData.rates.EUR / 100 ) * 23.23
    let yuanWorth = ( parsedData.rates.CNY / 100 ) * 18.90
    let yenWorth = ( parsedData.rates.JPY / 100 ) * 10.17
    let inrWorth = ( parsedData.rates.INR / 100 ) * 4.85
    let poundWorth = ( parsedData.rates.GBP / 100 ) * 4.78
    let brazillianRealWorth = ( parsedData.rates.BRL / 100 ) * 3.84
    let cadWorth = ( parsedData.rates.CAD / 100 ) * 3.18
    let swissFrancWorth = ( parsedData.rates.CHF / 100 ) * 1.12
    //console.log(swissFrancWorth);
    
    // Ma

    //=$AL$14*(D11+G11+J11+M11+P11+S11+V11+Y11+AA11)+AD11+AG11

    let fiatTotal = 
        usdWorth + euroWorth + yuanWorth + yenWorth + inrWorth + poundWorth + brazillianRealWorth + cadWorth + swissFrancWorth
    //console.log(fiatTotal);
    
    let fiatPercentage = ( fiatTotal / 100 ) * 80
    //console.log(fiatPercentage);

    let bitcoinPricRequest = await CoinGeckoClient.coins.fetch('bitcoin', {});
    let bitcoinPrice = bitcoinPricRequest.data.market_data.current_price.usd
    let bitcoinPercentage = ( bitcoinPrice / 100 ) * 5
    
    let goldRequest = await goldPriceRequest(
        'GET', 
        'https://www.goldapi.io/api/XAU/USD'
    )
    
    let goldData = JSON.parse(goldRequest)
    let goldPrice = goldData.price
    let goldsPercentage = ( goldPrice / 100 ) * 15
    
    console.log({ 
        goldsPercentage: goldsPercentage,  
        bitcoinPercentage: bitcoinPercentage,
        fiatPercentage: fiatPercentage
    });

    console.log(goldsPercentage + bitcoinPercentage + fiatPercentage );
    
    
    return { 
        goldsPercentage: goldsPercentage,  
        bitcoinPercentage: bitcoinPercentage,
        fiatPercentage: fiatPercentage
    }
}

GMU()

const testGoldPrice = async () => {
    let goldRequest = await goldPriceRequest(
        'GET', 
        'https://www.goldapi.io/api/XAU/USD'
    )
    
    let goldData = JSON.parse(goldRequest)
    let goldPrice = goldData.price
    let goldsPercentage = ( goldPrice / 100 ) * 15
    console.log(goldsPercentage);
    
}

//testGoldPrice()

const testBtcPrice = async () => {
    let bitcoinPricRequest = await CoinGeckoClient.coins.fetch('bitcoin', {});
    let bitcoinPrice = bitcoinPricRequest.data.market_data.current_price.usd
    let bitcoinPercentage = ( bitcoinPrice / 100 ) * 5

    console.log(bitcoinPercentage);
}

//testBtcPrice()

// export default class GMU { 
//     public storedFiatData = []
//     public storedFiatValues: any = {}

//     constructor() {

//     }

//     async updateFiatPrices() {
//         const data = await sendRequest(
//             'GET', 
//             'https://api.ratesapi.io/api/latest?base=USD',
//             ''
//         )
        
//         let parsedData = await JSON.parse(data)
//         this.storedFiatValues.USD = parsedData.rates.USD       
//         this.storedFiatValues.EUR = parsedData.rates.EUR
//         this.storedFiatValues.CNY = parsedData.rates.CNY
//         this.storedFiatValues.JPY = parsedData.rates.JPY
//         this.storedFiatValues.INR = parsedData.rates.INR
//         this.storedFiatValues.GBP = parsedData.rates.GBP
//         this.storedFiatValues.BRL = parsedData.rates.BRL
//         this.storedFiatValues.CAD = parsedData.rates.CAD
//         this.storedFiatValues.CHF = parsedData.rates.CHF
        
//         this.storedFiatData.push(this.storedFiatValues)
//         console.log(this.storedFiatData);
        
//         return { success: true }
//     }

//     async getFiatPrices() {
//         return this.storedFiatData
//     }
// }

// const run = async () => {
//     const g = new GMU()
//     //g.updateFiatPrices()
//     console.log(await g.getFiatPrices());
// }

// run()
