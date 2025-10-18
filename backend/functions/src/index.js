const functions = require('firebase-functions');
const admin = require('firebase-admin');
const { fetchWhaleMovements } = require('./services/whaleTracker');
const { fetchPriceDumps } = require('./services/priceTracker');
const { generateAISummary } = require('./services/aiService');

admin.initializeApp();
const db = admin.firestore();

exports.trackWhaleMovements = functions.pubsub
  .schedule('every 5 minutes')
  .onRun(async (context) => {
    try {
      const chains = ['ETH', 'SOL', 'BSC'];
      
      for (const chain of chains) {
        const movements = await fetchWhaleMovements(chain);
        
        for (const movement of movements) {
          const aiSummary = await generateAISummary(movement, 'whale');
          
          const alertData = {
            chain: movement.chain,
            token: movement.token,
            amount: movement.amount,
            walletAddress: movement.walletAddress,
            contractAddress: movement.contractAddress,
            alertType: 'whale',
            severity: calculateSeverity(movement.amount),
            aiSummary: aiSummary,
            timestamp: admin.firestore.FieldValue.serverTimestamp(),
            metadata: {
              transactionHash: movement.txHash,
              blockNumber: movement.blockNumber
            }
          };
          
          await db.collection('alerts').add(alertData);
        }
      }
      
      console.log('Whale tracking completed successfully');
      return null;
    } catch (error) {
      console.error('Error in whale tracking:', error);
      throw error;
    }
  });

exports.trackPriceDumps = functions.pubsub
  .schedule('every 3 minutes')
  .onRun(async (context) => {
    try {
      const tokens = await getMonitoredTokens();
      
      for (const token of tokens) {
        const dumpData = await fetchPriceDumps(token);
        
        if (dumpData && dumpData.isDump) {
          const aiSummary = await generateAISummary(dumpData, 'dump');
          
          const alertData = {
            chain: dumpData.chain,
            token: dumpData.token,
            priceChange: dumpData.priceChange,
            currentPrice: dumpData.currentPrice,
            volume: dumpData.volume,
            contractAddress: dumpData.contractAddress,
            alertType: 'dump',
            severity: calculateDumpSeverity(dumpData.priceChange),
            aiSummary: aiSummary,
            timestamp: admin.firestore.FieldValue.serverTimestamp(),
            metadata: {
              timeframe: dumpData.timeframe,
              marketCap: dumpData.marketCap
            }
          };
          
          await db.collection('alerts').add(alertData);
        }
      }
      
      console.log('Price dump tracking completed successfully');
      return null;
    } catch (error) {
      console.error('Error in price dump tracking:', error);
      throw error;
    }
  });

async function getMonitoredTokens() {
  const tokensSnapshot = await db.collection('monitoredTokens').get();
  return tokensSnapshot.docs.map(doc => doc.data());
}

function calculateSeverity(amount) {
  if (amount > 10000000) return 'high';
  if (amount > 1000000) return 'medium';
  return 'low';
}

function calculateDumpSeverity(priceChange) {
  const absChange = Math.abs(priceChange);
  if (absChange > 20) return 'high';
  if (absChange > 10) return 'medium';
  return 'low';
}

exports.cleanOldAlerts = functions.pubsub
  .schedule('every 24 hours')
  .onRun(async (context) => {
    try {
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
      
      const oldAlertsQuery = db.collection('alerts')
        .where('timestamp', '<', sevenDaysAgo);
      
      const snapshot = await oldAlertsQuery.get();
      
      const batch = db.batch();
      snapshot.docs.forEach(doc => {
        batch.delete(doc.ref);
      });
      
      await batch.commit();
      console.log(`Deleted ${snapshot.size} old alerts`);
      return null;
    } catch (error) {
      console.error('Error cleaning old alerts:', error);
      throw error;
    }
  });