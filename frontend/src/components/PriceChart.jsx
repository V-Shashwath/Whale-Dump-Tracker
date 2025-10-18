import React, { useEffect, useRef, useState } from 'react';
import './PriceChart.css';

function PriceChart({ alerts }) {
  const canvasRef = useRef(null);
  const [selectedToken, setSelectedToken] = useState('');
  const [tokenList, setTokenList] = useState([]);

  useEffect(() => {
    const uniqueTokens = [...new Set(alerts.map(a => a.token))];
    setTokenList(uniqueTokens);
    if (uniqueTokens.length > 0 && !selectedToken) {
      setSelectedToken(uniqueTokens[0]);
    }
  }, [alerts, selectedToken]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !selectedToken) return;

    const ctx = canvas.getContext('2d');
    const width = canvas.width = canvas.offsetWidth;
    const height = canvas.height = canvas.offsetHeight;

    const tokenAlerts = alerts
      .filter(a => a.token === selectedToken)
      .sort((a, b) => {
        const timeA = a.timestamp?.toDate ? a.timestamp.toDate() : new Date(a.timestamp);
        const timeB = b.timestamp?.toDate ? b.timestamp.toDate() : new Date(b.timestamp);
        return timeA - timeB;
      });

    if (tokenAlerts.length === 0) return;

    ctx.clearRect(0, 0, width, height);

    const padding = { top: 40, right: 40, bottom: 60, left: 60 };
    const chartWidth = width - padding.left - padding.right;
    const chartHeight = height - padding.top - padding.bottom;

    const priceData = tokenAlerts.map((alert, index) => {
      const basePrice = 100;
      const priceChange = tokenAlerts.slice(0, index + 1)
        .reduce((sum, a) => sum + (a.priceChange || 0), 0);
      return {
        price: basePrice * (1 + priceChange / 100),
        time: alert.timestamp?.toDate ? alert.timestamp.toDate() : new Date(alert.timestamp),
        isDump: alert.alertType === 'dump',
        isWhale: alert.alertType === 'whale',
        priceChange: alert.priceChange
      };
    });

    const maxPrice = Math.max(...priceData.map(d => d.price)) * 1.1;
    const minPrice = Math.min(...priceData.map(d => d.price)) * 0.9;
    const priceRange = maxPrice - minPrice;

    ctx.strokeStyle = '#fdfdfd9a';
    ctx.lineWidth = 1;
    for (let i = 0; i <= 5; i++) {
      const y = padding.top + (chartHeight * i / 5);
      ctx.beginPath();
      ctx.moveTo(padding.left, y);
      ctx.lineTo(width - padding.right, y);
      ctx.stroke();

      const price = maxPrice - (priceRange * i / 5);
      ctx.fillStyle = '#fffcfcd3';
      ctx.font = '12px sans-serif';
      ctx.textAlign = 'right';
      ctx.fillText(`$${price.toFixed(2)}`, padding.left - 10, y + 4);
    }

    ctx.beginPath();
    ctx.strokeStyle = '#6366f1';
    ctx.lineWidth = 2;

    priceData.forEach((point, index) => {
      const x = padding.left + (chartWidth * index / (priceData.length - 1 || 1));
      const y = padding.top + chartHeight - ((point.price - minPrice) / priceRange * chartHeight);

      if (index === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    });

    ctx.stroke();

    priceData.forEach((point, index) => {
      const x = padding.left + (chartWidth * index / (priceData.length - 1 || 1));
      const y = padding.top + chartHeight - ((point.price - minPrice) / priceRange * chartHeight);

      if (point.isDump) {
        ctx.beginPath();
        ctx.arc(x, y, 6, 0, Math.PI * 2);
        ctx.fillStyle = '#ef4444';
        ctx.fill();
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 2;
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(x, y - 20);
        ctx.lineTo(x, y - 8);
        ctx.strokeStyle = '#ef4444';
        ctx.lineWidth = 2;
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(x - 3, y - 12);
        ctx.lineTo(x, y - 8);
        ctx.lineTo(x + 3, y - 12);
        ctx.fillStyle = '#ef4444';
        ctx.fill();
      }

      if (point.isWhale) {
        ctx.beginPath();
        ctx.arc(x, y, 5, 0, Math.PI * 2);
        ctx.fillStyle = '#8b5cf6';
        ctx.fill();
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 2;
        ctx.stroke();
      }
    });

    ctx.fillStyle = '#fcfdffff';
    ctx.font = '12px sans-serif';
    ctx.textAlign = 'center';
    
    const timeStep = Math.max(1, Math.floor(priceData.length / 6));
    priceData.forEach((point, index) => {
      if (index % timeStep === 0 || index === priceData.length - 1) {
        const x = padding.left + (chartWidth * index / (priceData.length - 1 || 1));
        const timeStr = point.time.toLocaleTimeString('en-US', { 
          hour: '2-digit', 
          minute: '2-digit' 
        });
        ctx.fillText(timeStr, x, height - padding.bottom + 20);
      }
    });

    ctx.fillStyle = '#dbe9ffff';
    ctx.font = 'bold 16px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(`${selectedToken} Price Movement`, width / 2, 25);

  }, [alerts, selectedToken]);

  return (
    <div className="price-chart-container">
      <div className="chart-header">
        <h2>Token Price Analysis</h2>
        <select 
          value={selectedToken}
          onChange={(e) => setSelectedToken(e.target.value)}
          className="token-select"
        >
          {tokenList.map(token => (
            <option key={token} value={token}>{token}</option>
          ))}
        </select>
      </div>
      <canvas ref={canvasRef} className="price-canvas"></canvas>
      <div className="chart-legend">
        <div className="legend-item">
          <div className="legend-marker dump"></div>
          <span>Price Dump Event</span>
        </div>
        <div className="legend-item">
          <div className="legend-marker whale"></div>
          <span>Whale Movement</span>
        </div>
        <div className="legend-item">
          <div className="legend-line"></div>
          <span>Price Trend</span>
        </div>
      </div>
    </div>
  );
}

export default PriceChart;