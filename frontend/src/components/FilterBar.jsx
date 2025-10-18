import React from 'react';
import './FilterBar.css';

function FilterBar({ filters, onFilterChange, viewMode, onViewModeChange }) {
  return (
    <div className="filter-bar">
      <div className="filter-section">
        <div className="filter-group">
          <label>Chain</label>
          <select 
            value={filters.chain}
            onChange={(e) => onFilterChange({ chain: e.target.value })}
            className="filter-select"
          >
            <option value="all">All Chains</option>
            <option value="ETH">Ethereum</option>
            <option value="SOL">Solana</option>
            <option value="BSC">Binance Smart Chain</option>
          </select>
        </div>

        <div className="filter-group">
          <label>Event Type</label>
          <select 
            value={filters.eventType}
            onChange={(e) => onFilterChange({ eventType: e.target.value })}
            className="filter-select"
          >
            <option value="all">All Events</option>
            <option value="whale">Whale Moves</option>
            <option value="dump">Price Dumps</option>
          </select>
        </div>

        <div className="filter-group">
          <label>Severity</label>
          <select 
            value={filters.severity}
            onChange={(e) => onFilterChange({ severity: e.target.value })}
            className="filter-select"
          >
            <option value="all">All Levels</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>
        </div>

        <div className="filter-group search-group">
          <label>Search Token</label>
          <input
            type="text"
            placeholder="Symbol or contract address"
            value={filters.searchToken}
            onChange={(e) => onFilterChange({ searchToken: e.target.value })}
            className="filter-input"
          />
        </div>
      </div>

      <div className="view-mode-section">
        <button
          className={`view-btn ${viewMode === 'cards' ? 'active' : ''}`}
          onClick={() => onViewModeChange('cards')}
        >
          Cards
        </button>
        <button
          className={`view-btn ${viewMode === 'graph' ? 'active' : ''}`}
          onClick={() => onViewModeChange('graph')}
        >
          Network Graph
        </button>
        <button
          className={`view-btn ${viewMode === 'chart' ? 'active' : ''}`}
          onClick={() => onViewModeChange('chart')}
        >
          Price Chart
        </button>
      </div>
    </div>
  );
}

export default FilterBar;