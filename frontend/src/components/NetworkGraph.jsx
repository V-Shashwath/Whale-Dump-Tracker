import React, { useEffect, useRef } from 'react';
import './NetworkGraph.css';

function NetworkGraph({ alerts }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const width = canvas.width = canvas.offsetWidth;
    const height = canvas.height = canvas.offsetHeight;

    const nodes = [];
    const edges = [];
    const nodeMap = new Map();

    const whaleAlerts = alerts.filter(a => a.alertType === 'whale').slice(0, 20);

    whaleAlerts.forEach(alert => {
      if (!nodeMap.has(alert.walletAddress)) {
        nodeMap.set(alert.walletAddress, {
          id: alert.walletAddress,
          x: Math.random() * (width - 100) + 50,
          y: Math.random() * (height - 100) + 50,
          vx: 0,
          vy: 0,
          type: 'wallet',
          label: `${alert.walletAddress.slice(0, 6)}...`,
          chain: alert.chain
        });
      }

      const exchangeId = `exchange_${alert.chain}`;
      if (!nodeMap.has(exchangeId)) {
        nodeMap.set(exchangeId, {
          id: exchangeId,
          x: width / 2 + (Math.random() - 0.5) * 200,
          y: height / 2 + (Math.random() - 0.5) * 200,
          vx: 0,
          vy: 0,
          type: 'exchange',
          label: `${alert.chain} Exchange`,
          chain: alert.chain
        });
      }

      edges.push({
        source: alert.walletAddress,
        target: exchangeId,
        amount: alert.amount
      });
    });

    nodes.push(...Array.from(nodeMap.values()));

    function applyForces() {
      const centerX = width / 2;
      const centerY = height / 2;

      nodes.forEach(node => {
        node.vx *= 0.9;
        node.vy *= 0.9;

        const dx = centerX - node.x;
        const dy = centerY - node.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance > 0) {
          const force = 0.01;
          node.vx += (dx / distance) * force;
          node.vy += (dy / distance) * force;
        }

        for (let other of nodes) {
          if (node === other) continue;
          
          const dx = other.x - node.x;
          const dy = other.y - node.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          
          if (distance > 0 && distance < 150) {
            const force = 50 / (distance * distance);
            node.vx -= (dx / distance) * force;
            node.vy -= (dy / distance) * force;
          }
        }

        edges.forEach(edge => {
          if (edge.source === node.id) {
            const target = nodeMap.get(edge.target);
            if (target) {
              const dx = target.x - node.x;
              const dy = target.y - node.y;
              const distance = Math.sqrt(dx * dx + dy * dy);
              const force = (distance - 100) * 0.01;
              
              node.vx += (dx / distance) * force;
              node.vy += (dy / distance) * force;
            }
          }
        });
      });

      nodes.forEach(node => {
        node.x += node.vx;
        node.y += node.vy;

        node.x = Math.max(30, Math.min(width - 30, node.x));
        node.y = Math.max(30, Math.min(height - 30, node.y));
      });
    }

    function draw() {
      ctx.clearRect(0, 0, width, height);

      edges.forEach(edge => {
        const source = nodeMap.get(edge.source);
        const target = nodeMap.get(edge.target);
        
        if (source && target) {
          ctx.beginPath();
          ctx.moveTo(source.x, source.y);
          ctx.lineTo(target.x, target.y);
          ctx.strokeStyle = 'rgba(99, 102, 241, 0.3)';
          ctx.lineWidth = Math.min(edge.amount / 1000000, 3);
          ctx.stroke();
        }
      });

      nodes.forEach(node => {
        const radius = node.type === 'exchange' ? 25 : 15;
        
        ctx.beginPath();
        ctx.arc(node.x, node.y, radius, 0, Math.PI * 2);
        
        if (node.type === 'exchange') {
          ctx.fillStyle = node.chain === 'ETH' ? '#627eea' 
                        : node.chain === 'SOL' ? '#14f195' 
                        : '#f3ba2f';
        } else {
          ctx.fillStyle = '#8b5cf6';
        }
        
        ctx.fill();
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 2;
        ctx.stroke();

        ctx.fillStyle = '#ffffff';
        ctx.font = '11px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(node.label, node.x, node.y + radius + 15);
      });
    }

    function animate() {
      applyForces();
      draw();
      requestAnimationFrame(animate);
    }

    animate();
  }, [alerts]);

  return (
    <div className="network-graph-container">
      <div className="graph-header">
        <h2>Whale Network Visualization</h2>
        <p>Connections between whale wallets and exchanges</p>
      </div>
      <canvas ref={canvasRef} className="network-canvas"></canvas>
      <div className="graph-legend">
        <div className="legend-item">
          <div className="legend-color" style={{ backgroundColor: '#8b5cf6' }}></div>
          <span>Whale Wallets</span>
        </div>
        <div className="legend-item">
          <div className="legend-color" style={{ backgroundColor: '#627eea' }}></div>
          <span>ETH Exchanges</span>
        </div>
        <div className="legend-item">
          <div className="legend-color" style={{ backgroundColor: '#14f195' }}></div>
          <span>SOL Exchanges</span>
        </div>
        <div className="legend-item">
          <div className="legend-color" style={{ backgroundColor: '#f3ba2f' }}></div>
          <span>BSC Exchanges</span>
        </div>
      </div>
    </div>
  );
}

export default NetworkGraph;