import React from 'react';
import './AlertCard.css';

function AlertCard({ alert }) {
  const getSeverityColor = (severity) => {
    switch(severity) {
      case 'high': return '#ef4444';
      case 'medium': return '#f59e0b';
      case 'low': return '#10b981';
      default: return '#6b7280';
    }
  };

  const getChainColor = (chain) => {
    switch(chain) {
      case 'ETH': return '#627eea';
      case 'SOL': return '#14f195';
      case 'BSC': return '#f3ba2f';
      default: return '#6b7280';
    }
  };

  const formatTimestamp = (timestamp) => {
    if (!timestamp) return 'Unknown';
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    
    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffMins < 1440) return `${Math.floor(diffMins / 60)}h ago`;
    return `${Math.floor(diffMins / 1440)}d ago`;
  };

  const formatAmount = (amount) => {
    if (amount >= 1000000) {
      return `$${(amount / 1000000).toFixed(2)}M`;
    } else if (amount >= 1000) {
      return `$${(amount / 1000).toFixed(2)}K`;
    }
    return `$${amount.toFixed(2)}`;
  };

  return (
    <div className="alert-card" style={{ borderLeftColor: getSeverityColor(alert.severity) }}>
      <div className="alert-header">
        <div className="alert-badges">
          <span 
            className="chain-badge" 
            style={{ backgroundColor: getChainColor(alert.chain) }}
          >
            {alert.chain}
          </span>
          <span 
            className="severity-badge"
            style={{ backgroundColor: getSeverityColor(alert.severity) }}
          >
            {alert.severity.toUpperCase()}
          </span>
          <span className="type-badge">
            {alert.alertType === 'whale' ? '🐋 Whale Move' : '📉 Price Dump'}
          </span>
        </div>
        <span className="alert-time">{formatTimestamp(alert.timestamp)}</span>
      </div>

      <div className="alert-body">
        <h3 className="alert-token">{alert.token}</h3>
        <p className="alert-summary">{alert.aiSummary}</p>
        
        <div className="alert-details">
          {alert.amount && (
            <div className="detail-item">
              <span className="detail-label">Amount:</span>
              <span className="detail-value">{formatAmount(alert.amount)}</span>
            </div>
          )}
          
          {alert.priceChange && (
            <div className="detail-item">
              <span className="detail-label">Price Change:</span>
              <span 
                className="detail-value"
                style={{ color: alert.priceChange < 0 ? '#ef4444' : '#10b981' }}
              >
                {alert.priceChange > 0 ? '+' : ''}{alert.priceChange.toFixed(2)}%
              </span>
            </div>
          )}

          {alert.walletAddress && (
            <div className="detail-item">
              <span className="detail-label">Wallet:</span>
              <span className="detail-value wallet-address">
                {alert.walletAddress.slice(0, 6)}...{alert.walletAddress.slice(-4)}
              </span>
            </div>
          )}

          {alert.contractAddress && (
            <div className="detail-item">
              <span className="detail-label">Contract:</span>
              <span className="detail-value wallet-address">
                {alert.contractAddress.slice(0, 6)}...{alert.contractAddress.slice(-4)}
              </span>
            </div>
          )}
        </div>
      </div>

      <div className="alert-footer">
        <button className="action-btn" onClick={() => {
          const url = alert.chain === 'ETH' 
            ? `https://etherscan.io/address/${alert.walletAddress || alert.contractAddress}`
            : alert.chain === 'SOL'
            ? `https://solscan.io/account/${alert.walletAddress || alert.contractAddress}`
            : `https://bscscan.com/address/${alert.walletAddress || alert.contractAddress}`;
          window.open(url, '_blank');
        }}>
          View on Explorer
        </button>
      </div>
    </div>
  );
}

export default AlertCard;