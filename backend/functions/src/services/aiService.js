const axios = require('axios');

async function generateAISummary(data, eventType) {
  try {
    if (eventType === 'whale') {
      return await generateWhaleSummary(data);
    } else if (eventType === 'dump') {
      return await generateDumpSummary(data);
    }
    
    return 'Alert detected on blockchain network';
  } catch (error) {
    console.error('Error generating AI summary:', error.message);
    return generateFallbackSummary(data, eventType);
  }
}

async function generateWhaleSummary(whaleData) {
  const systemInstruction = 'You are a crypto analyst providing concise whale movement alerts. Keep responses under 150 characters and make them informative and professional.';
  
  const prompt = `Generate a concise alert message for a whale wallet transaction. Details: Chain: ${whaleData.chain}, Token: ${whaleData.token}, Amount: ${whaleData.amount.toFixed(0)}, Wallet: ${whaleData.walletAddress.slice(0, 10)}. Create a professional, informative one-sentence summary.`;
  
  try {
    const apiKey = process.env.GEMINI_API_KEY;
    
    if (!apiKey) {
      return generateFallbackSummary(whaleData, 'whale');
    }
    
    const response = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
      {
        contents: [
          {
            parts: [
              {
                text: `${systemInstruction}\n\n${prompt}`
              }
            ]
          }
        ],
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 100,
          topP: 0.95,
          topK: 40
        }
      },
      {
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );
    
    if (response.data && response.data.candidates && response.data.candidates[0]) {
      const generatedText = response.data.candidates[0].content.parts[0].text.trim();
      
      if (generatedText.length > 200) {
        return generatedText.substring(0, 197) + '...';
      }
      
      return generatedText;
    }
    
    return generateFallbackSummary(whaleData, 'whale');
  } catch (error) {
    console.error('Error calling Gemini AI API:', error.message);
    return generateFallbackSummary(whaleData, 'whale');
  }
}

async function generateDumpSummary(dumpData) {
  const systemInstruction = 'You are a crypto analyst providing concise price dump alerts. Keep responses under 150 characters and explain the price movement clearly.';
  
  const prompt = `Generate a concise alert for a crypto price dump. Details: Token: ${dumpData.token}, Price Change: ${dumpData.priceChange.toFixed(2)}%, Chain: ${dumpData.chain}, Timeframe: ${dumpData.timeframe}. Create a professional, informative one-sentence summary explaining the situation.`;
  
  try {
    const apiKey = process.env.GEMINI_API_KEY;
    
    if (!apiKey) {
      return generateFallbackSummary(dumpData, 'dump');
    }
    
    const response = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
      {
        contents: [
          {
            parts: [
              {
                text: `${systemInstruction}\n\n${prompt}`
              }
            ]
          }
        ],
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 100,
          topP: 0.95,
          topK: 40
        }
      },
      {
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );
    
    if (response.data && response.data.candidates && response.data.candidates[0]) {
      const generatedText = response.data.candidates[0].content.parts[0].text.trim();
      
      if (generatedText.length > 200) {
        return generatedText.substring(0, 197) + '...';
      }
      
      return generatedText;
    }
    
    return generateFallbackSummary(dumpData, 'dump');
  } catch (error) {
    console.error('Error calling Gemini AI API:', error.message);
    return generateFallbackSummary(dumpData, 'dump');
  }
}

function generateFallbackSummary(data, eventType) {
  if (eventType === 'whale') {
    const amountFormatted = formatAmount(data.amount);
    const walletShort = data.walletAddress.slice(0, 6) + '...' + data.walletAddress.slice(-4);
    
    const templates = [
      `Large ${data.token} transfer detected: ${amountFormatted} moved by whale wallet ${walletShort} on ${data.chain}`,
      `Whale alert on ${data.chain}: ${walletShort} transferred ${amountFormatted} worth of ${data.token}`,
      `Significant ${data.token} movement: ${amountFormatted} moved from whale address ${walletShort}`,
      `Major transaction on ${data.chain}: Whale ${walletShort} moved ${amountFormatted} in ${data.token}`
    ];
    
    return templates[Math.floor(Math.random() * templates.length)];
  } else if (eventType === 'dump') {
    const changeAbs = Math.abs(data.priceChange).toFixed(2);
    
    const templates = [
      `${data.token} experienced a sharp ${changeAbs}% decline on ${data.chain} in the last ${data.timeframe}`,
      `Price alert: ${data.token} dropped ${changeAbs}% within ${data.timeframe} on ${data.chain} network`,
      `Sudden price movement: ${data.token} fell ${changeAbs}% in ${data.timeframe} on ${data.chain}`,
      `${data.token} on ${data.chain} shows ${changeAbs}% decrease over ${data.timeframe} period`
    ];
    
    return templates[Math.floor(Math.random() * templates.length)];
  }
  
  return 'Blockchain activity detected requiring attention';
}

function formatAmount(amount) {
  if (amount >= 1000000) {
    return `$${(amount / 1000000).toFixed(2)}M`;
  } else if (amount >= 1000) {
    return `$${(amount / 1000).toFixed(2)}K`;
  }
  return `$${amount.toFixed(2)}`;
}

module.exports = { generateAISummary };