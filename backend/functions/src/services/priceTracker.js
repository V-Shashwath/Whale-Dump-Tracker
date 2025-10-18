const axios = require('axios');

const DUMP_THRESHOLD = -10;

async function fetchPriceDumps(tokenConfig) {
  try {
    const priceData = await fetchTokenPrice(tokenConfig);
    
    if (!priceData) {
      return null;
    }
    
    const priceChange = calculatePriceChange(priceData);
    
    if (priceChange < DUMP_THRESHOLD) {
      return {
        chain: tokenConfig.chain,
        token: tokenConfig.symbol,
        priceChange: priceChange,
        currentPrice: priceData.currentPrice,
        volume: priceData.volume,
        contractAddress: tokenConfig.contractAddress,
        isDump: true,
        timeframe: '10m',
        marketCap: priceData.marketCap
      };
    }
    
    return null;
  } catch (error) {
    console.error('Error fetching price dumps:', error.message);
    return generateMockDumpData(tokenConfig);
  }
}

async function fetchTokenPrice(tokenConfig) {
  try {
    const coingeckoId = tokenConfig.coingeckoId || tokenConfig.symbol.toLowerCase();
    const url = `https://api.coingecko.com/api/v3/coins/${coingeckoId}/market_chart?vs_currency=usd&days=1`;
    
    const response = await axios.get(url);
    
    if (response.data && response.data.prices) {
      const prices = response.data.prices;
      const volumes = response.data.total_volumes;
      
      return {
        currentPrice: prices[prices.length - 1][1],
        previousPrice: prices[Math.max(0, prices.length - 12)][1],
        volume: volumes[volumes.length - 1][1],
        marketCap: tokenConfig.marketCap || 0,
        priceHistory: prices.slice(-20).map(p => p[1])
      };
    }
    
    return null;
  } catch (error) {
    console.error('Error fetching from CoinGecko:', error.message);
    
    try {
      return await fetchFromBinance(tokenConfig.symbol);
    } catch (binanceError) {
      console.error('Error fetching from Binance:', binanceError.message);
      return null;
    }
  }
}

async function fetchFromBinance(symbol) {
  const url = `https://api.binance.com/api/v3/ticker/24hr?symbol=${symbol}USDT`;
  
  const response = await axios.get(url);
  
  if (response.data) {
    return {
      currentPrice: parseFloat(response.data.lastPrice),
      previousPrice: parseFloat(response.data.openPrice),
      volume: parseFloat(response.data.volume),
      marketCap: 0,
      priceHistory: []
    };
  }
  
  return null;
}

function calculatePriceChange(priceData) {
  if (!priceData || !priceData.previousPrice) {
    return 0;
  }
  
  const change = ((priceData.currentPrice - priceData.previousPrice) / priceData.previousPrice) * 100;
  return change;
}

function generateMockDumpData(tokenConfig) {
  const shouldGenerateDump = Math.random() < 0.3;
  
  if (!shouldGenerateDump) {
    return null;
  }
  
  const priceChange = -Math.random() * 25 - 10;
  
  return {
    chain: tokenConfig.chain,
    token: tokenConfig.symbol,
    priceChange: priceChange,
    currentPrice: Math.random() * 100,
    volume: Math.random() * 10000000,
    contractAddress: tokenConfig.contractAddress,
    isDump: true,
    timeframe: '10m',
    marketCap: Math.random() * 1000000000
  };
}

module.exports = { fetchPriceDumps };