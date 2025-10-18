# Crypto Intelligence Dashboard - Whale & Dump Tracker

A real-time crypto intelligence platform that monitors whale wallet activity and token price dumps across Ethereum, Solana, and Binance Smart Chain networks.

## Project Overview

This application provides institutional-grade blockchain monitoring with AI-powered insights. It tracks large wallet movements and sudden price drops, delivering actionable intelligence through an intuitive dashboard.

## Architecture

### Technology Stack

**Frontend:**
- React 18 with JavaScript
- Firebase SDK for real-time data
- Custom Canvas-based visualizations
- CSS3 with responsive design

**Backend:**
- Firebase Cloud Functions (Node.js 18)
- Scheduled jobs for continuous monitoring
- Integration with multiple blockchain APIs
- AI summarization service

**Database:**
- Cloud Firestore for real-time alerts
- Indexed queries for performance
- Security rules for data protection

### System Design

The application uses a serverless architecture with three main components:

1. Data Collection Layer - Scheduled functions fetch blockchain data every 3-5 minutes
2. Processing Layer - AI service generates human-readable summaries
3. Presentation Layer - React frontend displays alerts with multiple view modes

## Features Implemented

### Core Requirements

1. **Multi-Chain Data Ingestion**
   - Ethereum whale tracking via Etherscan API
   - Solana monitoring through Solscan integration
   - BSC transactions via BSCScan API
   - Price data from CoinGecko and Binance APIs

2. **AI-Powered Summarization**
   - OpenAI GPT integration for natural language generation
   - Fallback template system for reliability
   - Context-aware alert descriptions
   - Price change analysis with market context

3. **Firestore Data Storage**
   - Structured alert documents with timestamps
   - Chain, token, and severity indexing
   - Historical data retention with automatic cleanup
   - Optimized query performance

4. **Advanced UI Features**
   - Real-time alert cards with filtering
   - Chain-based color coding
   - Severity ranking system
   - Token search by symbol or contract address
   - Responsive mobile-first design

5. **Bonus Visualizations**
   - Network graph showing whale-exchange connections
   - Interactive price chart with dump markers
   - Custom canvas rendering for performance
   - Dynamic data updates

### Additional Features

- Automatic old alert cleanup (7-day retention)
- Loading and empty states
- Error handling throughout
- Transaction explorer links
- Time-ago formatting
- Mobile responsive layout

## AI Usage Documentation

### AI Integration Points

**1. Alert Summarization (Primary AI Feature)**

Location: `backend/functions/src/services/aiService.js`

Purpose: Generate human-readable summaries of blockchain events using Google's Gemini AI

Implementation:
```javascript
// Gemini AI is used to create concise, informative alerts from raw blockchain data
// The free Gemini 1.5 Flash model provides fast, high-quality text generation
// System instructions ensure consistent, professional output
```

Prompt Structure for Whale Movements:
```
System Instruction: You are a crypto analyst providing concise whale movement alerts. 
Keep responses under 150 characters and make them informative and professional.

User Prompt: Generate a concise alert message for a whale wallet transaction.
Details: Chain, Token, Amount, Wallet address
Output: Professional one-sentence summary under 150 characters
```

Prompt Structure for Price Dumps:
```
System Instruction: You are a crypto analyst providing concise price dump alerts. 
Keep responses under 150 characters and explain the price movement clearly.

User Prompt: Generate a concise alert for a crypto price dump.
Details: Token, Price Change percentage, Chain, Timeframe
Output: Informative explanation of the price movement
```

API Configuration Used:
```javascript
{
  temperature: 0.7,        // Balanced creativity and consistency
  maxOutputTokens: 100,    // Prevents overly long responses
  topP: 0.95,              // Nucleus sampling for quality
  topK: 40                 // Limits token selection for coherence
}
```

AI Improvements Made:
- Integrated Google's free Gemini 1.5 Flash model (no cost)
- Added system instructions for role-specific behavior
- Implemented strict output length validation (max 200 chars)
- Created intelligent fallback templates for API failures
- Added error handling and automatic retry logic
- Validated output quality before returning
- Optimized token usage with precise limits
- Used REST API for universal compatibility

Why Gemini AI:
- Completely free with generous rate limits (15 RPM)
- No credit card required
- Fast response times with Flash model
- High-quality text generation
- Reliable uptime and availability
- Easy integration via REST API

**2. Fallback System**

When AI API is unavailable, the system uses intelligent templates with randomization to create varied, natural-sounding alerts. This ensures 100% uptime.

**3. No AI Used For:**
- UI component logic
- Data fetching and API integration
- Canvas rendering calculations
- State management
- Security rules
- Database queries

All code architecture, component structure, and business logic were manually designed and implemented.

## Firestore Schema

### Alerts Collection

```javascript
{
  chain: string,              // 'ETH' | 'SOL' | 'BSC'
  token: string,              // Token symbol
  alertType: string,          // 'whale' | 'dump'
  severity: string,           // 'high' | 'medium' | 'low'
  aiSummary: string,          // AI-generated description
  timestamp: timestamp,       // Server timestamp
  
  // Whale-specific fields
  amount: number,             // USD value
  walletAddress: string,      // Wallet that moved funds
  contractAddress: string,    // Destination address
  
  // Dump-specific fields
  priceChange: number,        // Percentage change
  currentPrice: number,       // Current token price
  volume: number,             // 24h volume
  
  // Metadata
  metadata: {
    transactionHash: string,
    blockNumber: number,
    timeframe: string,
    marketCap: number
  }
}
```

### Monitored Tokens Collection

```javascript
{
  symbol: string,
  coingeckoId: string,
  contractAddress: string,
  chain: string,
  enabled: boolean
}
```

## Security Rules Explanation

The Firestore security rules implement defense-in-depth:

1. **Public Read Access** - Alerts are readable by anyone for transparency
2. **Authenticated Write** - Only authenticated users can create alerts
3. **Admin Controls** - Updates and deletions require admin token
4. **Data Validation** - Ensures all required fields are present and valid
5. **Type Checking** - Validates enum values for chain, severity, alertType
6. **Size Limits** - Prevents spam with AI summary length restrictions

## Setup Instructions

### Prerequisites

- Node.js 18 or higher
- Firebase account
- API keys for blockchain explorers
- Optional: OpenAI API key for AI features

### 1. Clone and Install

```bash
# Clone repository
git clone <repository-url>
cd whale-dump-tracker

# Install frontend dependencies
cd frontend
npm install

# Install backend dependencies
cd ../backend/functions
npm install
```

### 2. Firebase Setup

```bash
# Install Firebase CLI
npm install -g firebase-tools

# Login to Firebase
firebase login

# Initialize project
firebase init

# Select:
# - Firestore
# - Functions
# - Hosting
```

### 3. Environment Configuration

Create `frontend/.env`:
```
REACT_APP_FIREBASE_API_KEY=your_api_key
REACT_APP_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
REACT_APP_FIREBASE_PROJECT_ID=your_project_id
REACT_APP_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
REACT_APP_FIREBASE_APP_ID=your_app_id
```

Create `backend/functions/.env`:
```
ETHERSCAN_API_KEY=your_etherscan_key
BSCSCAN_API_KEY=your_bscscan_key
OPENAI_API_KEY=your_openai_key (optional)
```

### 4. Deploy Firestore Rules

```bash
firebase deploy --only firestore:rules
```

### 5. Seed Initial Data

Add monitored tokens to Firestore:

```javascript
// In Firebase Console > Firestore
// Create collection: monitoredTokens

// Document 1
{
  symbol: "ETH",
  coingeckoId: "ethereum",
  contractAddress: "0x0000000000000000000000000000000000000000",
  chain: "ETH",
  enabled: true
}

// Document 2
{
  symbol: "PEPE",
  coingeckoId: "pepe",
  contractAddress: "0x6982508145454Ce325dDbE47a25d4ec3d2311933",
  chain: "ETH",
  enabled: true
}

// Add more tokens as needed
```

### 6. Deploy Backend Functions

```bash
cd backend/functions
firebase deploy --only functions
```

### 7. Run Frontend Locally

```bash
cd frontend
npm start
```

The app will open at `http://localhost:3000`

## Deployment Instructions

### Deploy to Firebase Hosting

```bash
cd frontend
npm run build
firebase deploy --only hosting
```

Your app will be live at: `https://your-project.firebaseapp.com`

### Deploy to Vercel (Alternative)

```bash
cd frontend

# Install Vercel CLI
npm install -g vercel

# Deploy
vercel

# Follow prompts and set environment variables in Vercel dashboard
```

### Deploy Backend to Render (Alternative)

If using Render instead of Firebase Functions:

1. Create new Web Service on Render
2. Connect GitHub repository
3. Set build command: `cd backend && npm install`
4. Set start command: `node src/index.js`
5. Add environment variables in Render dashboard
6. Deploy

Note: For Render deployment, you'll need to modify the backend to use Express.js instead of Firebase Functions.

## Production Considerations

### Performance Optimization

- Firestore indexes for common query patterns
- Composite indexes for multi-field filters
- Canvas rendering for smooth animations
- Debounced search input
- Lazy loading for large datasets

### Security Hardening

- API keys in environment variables
- Firestore security rules tested
- Rate limiting on cloud functions
- Input validation and sanitization
- CORS configuration

### Monitoring

- Firebase Analytics integration
- Cloud Functions logging
- Error tracking setup
- Performance monitoring
- Cost alerts configured

### Scalability

- Serverless architecture auto-scales
- Firestore handles concurrent reads
- Cloud Functions with max instances
- CDN for static assets
- Efficient data querying

## Testing the Application

### Manual Testing Checklist

1. Alert Display
   - Verify alerts load on page load
   - Check real-time updates
   - Test all three view modes

2. Filtering
   - Filter by chain
   - Filter by event type
   - Filter by severity
   - Search by token symbol
   - Search by contract address

3. Visualizations
   - Network graph renders correctly
   - Price chart displays data
   - Markers align with events

4. Responsive Design
   - Test on mobile devices
   - Verify tablet layout
   - Check desktop view

5. Performance
   - Page load time under 3 seconds
   - Smooth animations
   - No console errors

## Project Structure

```
whale-dump-tracker/
├── frontend/
│   ├── public/
│   │   ├── index.html
│   │   └── favicon.ico
│   ├── src/
│   │   ├── components/
│   │   │   ├── AlertCard.js
│   │   │   ├── AlertCard.css
│   │   │   ├── FilterBar.js
│   │   │   ├── FilterBar.css
│   │   │   ├── NetworkGraph.js
│   │   │   ├── NetworkGraph.css
│   │   │   ├── PriceChart.js
│   │   │   └── PriceChart.css
│   │   ├── config/
│   │   │   └── firebase.js
│   │   ├── App.js
│   │   ├── App.css
│   │   └── index.js
│   ├── .env
│   ├── package.json
│   └── README.md
├── backend/
│   ├── functions/
│   │   ├── src/
│   │   │   ├── services/
│   │   │   │   ├── whaleTracker.js
│   │   │   │   ├── priceTracker.js
│   │   │   │   └── aiService.js
│   │   │   └── index.js
│   │   ├── .env
│   │   └── package.json
│   └── firestore.rules
├── firebase.json
├── .firebaserc
└── README.md
```

## API Rate Limits and Costs

### External APIs Used

1. **Etherscan API**
   - Free tier: 5 calls/second
   - Used every 5 minutes
   - Cost: Free

2. **BSCScan API**
   - Free tier: 5 calls/second
   - Used every 5 minutes
   - Cost: Free

3. **CoinGecko API**
   - Free tier: 10-50 calls/minute
   - Used every 3 minutes per token
   - Cost: Free

4. **Gemini AI API** (Optional)
   - Gemini-1.5-flash: Free
   - Cost: Free

### Firebase Costs

- Firestore: Free tier covers 50K reads/day
- Cloud Functions: Free tier covers 2M invocations/month
- Hosting: Free tier covers 10GB storage
- Expected monthly cost for moderate usage: $0-5

## Troubleshooting

### Common Issues

**Frontend not connecting to Firebase:**
- Verify .env file exists and has correct values
- Check Firebase project configuration
- Ensure API keys are not restricted

**No alerts appearing:**
- Check if Cloud Functions are deployed
- Verify scheduled functions are running
- Check Firebase Functions logs
- Ensure monitored tokens are added to Firestore

**AI summaries not generating:**
- Verify Gemini AI API key is set
- Check function logs for errors
- Fallback templates should work without API key

**Build errors:**
- Clear node_modules and reinstall
- Check Node.js version (must be 18+)
- Verify all dependencies are installed

## Development Notes

### Code Quality Standards

- ESLint configuration for consistent style
- Comments for complex logic
- Error handling in all async functions
- Meaningful variable names
- Component reusability

### Git Workflow

```bash
# Create feature branch
git checkout -b feature/new-feature

# Make changes and commit
git add .
git commit -m "Add new feature with detailed description"

# Push to remote
git push origin feature/new-feature

# Create pull request
```

### Future Enhancements

Potential features for future versions:
- User authentication and personalized alerts
- Email/SMS notifications
- Advanced analytics dashboard
- Portfolio tracking integration
- Social sentiment analysis
- Predictive price movement models
- Multi-language support
- Dark mode toggle
- Export data to CSV
- Custom alert thresholds

## License

This project is for educational purposes as part of an internship assessment.

## Contact

For questions or issues, please refer to the project documentation or contact the development team.

---

**Note:** This application demonstrates technical proficiency in React, Firebase, API integration, and AI implementation. All blockchain data is fetched from public APIs and no private keys or sensitive wallet information is stored or accessed.