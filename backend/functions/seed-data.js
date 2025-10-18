// Run this script in Firebase Console or as a one-time Cloud Function
// to populate initial test data

const admin = require('firebase-admin');
const serviceAccount = require('./serviceAccount.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  projectId: serviceAccount.project_id,
});
const db = admin.firestore();

async function seedData() {
  const alerts = [
    // ETH alerts - multiple data points for chart
    {
      chain: 'ETH',
      token: 'ETH',
      amount: 12500000,
      walletAddress: '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb',
      contractAddress: '0x1111111254EEB25477B68fb85Ed929f73A960582',
      alertType: 'whale',
      severity: 'high',
      aiSummary: 'Large ETH transfer detected: $12.5M moved by whale wallet 0x742d...0bEb on Ethereum network',
      timestamp: admin.firestore.Timestamp.fromDate(new Date(Date.now() - 3600000)),
      metadata: {
        transactionHash: '0xabc123def456',
        blockNumber: 18500000
      }
    },
    {
      chain: 'ETH',
      token: 'ETH',
      amount: 8200000,
      walletAddress: '0x28C6c06298d514Db089934071355E5743bf21d60',
      contractAddress: '0xdAC17F958D2ee523a2206206994597C13D831ec7',
      alertType: 'whale',
      severity: 'high',
      aiSummary: 'Major ETH transaction: Whale 0x28C6...1d60 moved $8.2M into exchange',
      timestamp: admin.firestore.Timestamp.fromDate(new Date(Date.now() - 7200000)),
      metadata: {
        transactionHash: '0xdef456ghi789',
        blockNumber: 18499800
      }
    },
    {
      chain: 'ETH',
      token: 'ETH',
      priceChange: -8.5,
      currentPrice: 3050,
      volume: 125000000,
      contractAddress: '0x0000000000000000000000000000000000000000',
      alertType: 'dump',
      severity: 'medium',
      aiSummary: 'ETH price declined 8.5% in the last 10 minutes on Ethereum following large sell orders',
      timestamp: admin.firestore.Timestamp.fromDate(new Date(Date.now() - 10800000)),
      metadata: {
        timeframe: '10m',
        marketCap: 380000000000
      }
    },
    {
      chain: 'ETH',
      token: 'ETH',
      amount: 4500000,
      walletAddress: '0xBE0eB53F46cd790Cd13851d5EFf43D12404d33E8',
      contractAddress: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
      alertType: 'whale',
      severity: 'medium',
      aiSummary: 'Moderate ETH transfer: $4.5M moved by institutional wallet',
      timestamp: admin.firestore.Timestamp.fromDate(new Date(Date.now() - 14400000)),
      metadata: {
        transactionHash: '0xghi789jkl012',
        blockNumber: 18499500
      }
    },
    
    // PEPE alerts - multiple data points for chart
    {
      chain: 'ETH',
      token: 'PEPE',
      priceChange: -22.5,
      currentPrice: 0.00000087,
      volume: 45000000,
      contractAddress: '0x6982508145454Ce325dDbE47a25d4ec3d2311933',
      alertType: 'dump',
      severity: 'high',
      aiSummary: 'PEPE experienced sharp 22.5% decline on Ethereum in last 10 minutes due to whale sell-off',
      timestamp: admin.firestore.Timestamp.fromDate(new Date(Date.now() - 1800000)),
      metadata: {
        timeframe: '10m',
        marketCap: 350000000
      }
    },
    {
      chain: 'ETH',
      token: 'PEPE',
      amount: 2800000,
      walletAddress: '0x9876543210abcdef1234567890abcdef12345678',
      contractAddress: '0x6982508145454Ce325dDbE47a25d4ec3d2311933',
      alertType: 'whale',
      severity: 'medium',
      aiSummary: 'PEPE whale movement: $2.8M transferred to exchange wallet',
      timestamp: admin.firestore.Timestamp.fromDate(new Date(Date.now() - 5400000)),
      metadata: {
        transactionHash: '0xpepe123abc456',
        blockNumber: 18499700
      }
    },
    {
      chain: 'ETH',
      token: 'PEPE',
      priceChange: -12.3,
      currentPrice: 0.00000098,
      volume: 38000000,
      contractAddress: '0x6982508145454Ce325dDbE47a25d4ec3d2311933',
      alertType: 'dump',
      severity: 'medium',
      aiSummary: 'PEPE price dropped 12.3% within 10 minutes amid increased selling pressure',
      timestamp: admin.firestore.Timestamp.fromDate(new Date(Date.now() - 9000000)),
      metadata: {
        timeframe: '10m',
        marketCap: 365000000
      }
    },
    {
      chain: 'ETH',
      token: 'PEPE',
      amount: 1500000,
      walletAddress: '0xabcdef1234567890abcdef1234567890abcdef12',
      contractAddress: '0x6982508145454Ce325dDbE47a25d4ec3d2311933',
      alertType: 'whale',
      severity: 'low',
      aiSummary: 'Small PEPE whale activity: $1.5M moved between wallets',
      timestamp: admin.firestore.Timestamp.fromDate(new Date(Date.now() - 12600000)),
      metadata: {
        transactionHash: '0xpepe789def012',
        blockNumber: 18499400
      }
    },
    
    // SOL alerts
    {
      chain: 'SOL',
      token: 'SOL',
      amount: 8200000,
      walletAddress: '7Np41oeYqPefeNQEHSv1UDhYrehxin3NStELsSKCT4K2',
      contractAddress: '5Q544fKrFoe6tsEbD7S8EmxGTJYAKtTVhAW5Q5pge4j1',
      alertType: 'whale',
      severity: 'high',
      aiSummary: 'Whale alert on Solana: 7Np41o...4K2 transferred $8.2M worth of SOL to exchange wallet',
      timestamp: admin.firestore.Timestamp.fromDate(new Date(Date.now() - 300000)),
      metadata: {
        transactionHash: 'xyz789abc456def',
        blockNumber: 240000000
      }
    },
    {
      chain: 'SOL',
      token: 'SOL',
      priceChange: -15.2,
      currentPrice: 98.50,
      volume: 52000000,
      contractAddress: 'So11111111111111111111111111111111111111112',
      alertType: 'dump',
      severity: 'high',
      aiSummary: 'SOL price fell 15.2% in 10 minutes following whale exit on Solana',
      timestamp: admin.firestore.Timestamp.fromDate(new Date(Date.now() - 3900000)),
      metadata: {
        timeframe: '10m',
        marketCap: 42000000000
      }
    },
    {
      chain: 'SOL',
      token: 'SOL',
      amount: 4300000,
      walletAddress: 'ABC123xyz789DEF456ghi012JKL345mno678PQR901',
      contractAddress: '5Q544fKrFoe6tsEbD7S8EmxGTJYAKtTVhAW5Q5pge4j1',
      alertType: 'whale',
      severity: 'medium',
      aiSummary: 'Significant SOL movement: $4.3M moved by whale on Solana network',
      timestamp: admin.firestore.Timestamp.fromDate(new Date(Date.now() - 7500000)),
      metadata: {
        transactionHash: 'sol456def789ghi',
        blockNumber: 239999500
      }
    },
    
    // BSC alerts
    {
      chain: 'BSC',
      token: 'BNB',
      amount: 5800000,
      walletAddress: '0x8894E0a0c962CB723c1976a4421c95949bE2D4E3',
      contractAddress: '0xF977814e90dA44bFA03b6295A0616a897441aceC',
      alertType: 'whale',
      severity: 'medium',
      aiSummary: 'Significant BNB movement: $5.8M moved from whale address 0x8894...D4E3 on Binance Smart Chain',
      timestamp: admin.firestore.Timestamp.fromDate(new Date(Date.now() - 900000)),
      metadata: {
        transactionHash: '0xdef456ghi789',
        blockNumber: 35000000
      }
    },
    {
      chain: 'BSC',
      token: 'BNB',
      priceChange: -11.8,
      currentPrice: 585,
      volume: 28000000,
      contractAddress: '0x0000000000000000000000000000000000000000',
      alertType: 'dump',
      severity: 'medium',
      aiSummary: 'BNB price dropped 11.8% in 10 minutes on BSC network',
      timestamp: admin.firestore.Timestamp.fromDate(new Date(Date.now() - 4500000)),
      metadata: {
        timeframe: '10m',
        marketCap: 92000000000
      }
    },
    
    // USDT alerts
    {
      chain: 'ETH',
      token: 'USDT',
      amount: 15000000,
      walletAddress: '0x28C6c06298d514Db089934071355E5743bf21d60',
      contractAddress: '0xdAC17F958D2ee523a2206206994597C13D831ec7',
      alertType: 'whale',
      severity: 'high',
      aiSummary: 'Major USDT transaction on Ethereum: Whale 0x28C6...1d60 moved $15M into Binance exchange',
      timestamp: admin.firestore.Timestamp.fromDate(new Date(Date.now() - 1200000)),
      metadata: {
        transactionHash: '0xghi789jkl012',
        blockNumber: 18499500
      }
    },
    {
      chain: 'ETH',
      token: 'USDT',
      amount: 22000000,
      walletAddress: '0x5678901234abcdef5678901234abcdef56789012',
      contractAddress: '0xdAC17F958D2ee523a2206206994597C13D831ec7',
      alertType: 'whale',
      severity: 'high',
      aiSummary: 'Massive USDT transfer: $22M moved by institutional wallet on Ethereum',
      timestamp: admin.firestore.Timestamp.fromDate(new Date(Date.now() - 6000000)),
      metadata: {
        transactionHash: '0xusdt456789abc',
        blockNumber: 18499200
      }
    },
    
    // USDC alerts
    {
      chain: 'ETH',
      token: 'USDC',
      amount: 3200000,
      walletAddress: '0xBE0eB53F46cd790Cd13851d5EFf43D12404d33E8',
      contractAddress: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
      alertType: 'whale',
      severity: 'low',
      aiSummary: 'Moderate USDC transfer detected: $3.2M moved by institutional wallet on Ethereum',
      timestamp: admin.firestore.Timestamp.fromDate(new Date(Date.now() - 2100000)),
      metadata: {
        transactionHash: '0xjkl012mno345',
        blockNumber: 18499000
      }
    }
  ];

  const monitoredTokens = [
    {
      symbol: 'ETH',
      coingeckoId: 'ethereum',
      contractAddress: '0x0000000000000000000000000000000000000000',
      chain: 'ETH',
      enabled: true
    },
    {
      symbol: 'USDT',
      coingeckoId: 'tether',
      contractAddress: '0xdAC17F958D2ee523a2206206994597C13D831ec7',
      chain: 'ETH',
      enabled: true
    },
    {
      symbol: 'USDC',
      coingeckoId: 'usd-coin',
      contractAddress: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
      chain: 'ETH',
      enabled: true
    },
    {
      symbol: 'PEPE',
      coingeckoId: 'pepe',
      contractAddress: '0x6982508145454Ce325dDbE47a25d4ec3d2311933',
      chain: 'ETH',
      enabled: true
    },
    {
      symbol: 'SOL',
      coingeckoId: 'solana',
      contractAddress: 'So11111111111111111111111111111111111111112',
      chain: 'SOL',
      enabled: true
    },
    {
      symbol: 'BONK',
      coingeckoId: 'bonk',
      contractAddress: 'DezXAZ8z7PnrnRJjz3wXBoRgixCa6xjnB7YaB1pPB263',
      chain: 'SOL',
      enabled: true
    },
    {
      symbol: 'BNB',
      coingeckoId: 'binancecoin',
      contractAddress: '0x0000000000000000000000000000000000000000',
      chain: 'BSC',
      enabled: true
    },
    {
      symbol: 'CAKE',
      coingeckoId: 'pancakeswap-token',
      contractAddress: '0x0E09FaBB73Bd3Ade0a17ECC321fD13a19e81cE82',
      chain: 'BSC',
      enabled: true
    }
  ];

  console.log('Seeding alerts...');
  for (const alert of alerts) {
    await db.collection('alerts').add(alert);
  }
  console.log(`Added ${alerts.length} alerts`);

  console.log('Seeding monitored tokens...');
  for (const token of monitoredTokens) {
    await db.collection('monitoredTokens').add(token);
  }
  console.log(`Added ${monitoredTokens.length} monitored tokens`);

  console.log('Seed data completed successfully!');
}

seedData().catch(console.error);
