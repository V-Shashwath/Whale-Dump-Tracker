// import React, { useState, useEffect } from 'react';
// import { collection, query, orderBy, limit, onSnapshot, where } from 'firebase/firestore';
// import { db } from './config/firebase';
// import AlertCard from './components/AlertCard';
// import FilterBar from './components/FilterBar';
// import NetworkGraph from './components/NetworkGraph';
// import PriceChart from './components/PriceChart';
// import './App.css';

// function App() {
//   const [alerts, setAlerts] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [filters, setFilters] = useState({
//     chain: 'all',
//     eventType: 'all',
//     severity: 'all',
//     searchToken: ''
//   });
//   const [viewMode, setViewMode] = useState('cards');

//   useEffect(() => {
//     let unsubscribe;

//     const fetchAlerts = () => {
//       try {
//         let q = query(
//           collection(db, 'alerts'),
//           orderBy('timestamp', 'desc'),
//           limit(50)
//         );

//         if (filters.chain !== 'all') {
//           q = query(q, where('chain', '==', filters.chain));
//         }

//         if (filters.eventType !== 'all') {
//           q = query(q, where('alertType', '==', filters.eventType));
//         }

//         if (filters.severity !== 'all') {
//           q = query(q, where('severity', '==', filters.severity));
//         }

//         unsubscribe = onSnapshot(q, (snapshot) => {
//           const alertsData = snapshot.docs.map(doc => ({
//             id: doc.id,
//             ...doc.data()
//           }));

//           let filteredAlerts = alertsData;

//           if (filters.searchToken) {
//             const searchLower = filters.searchToken.toLowerCase();
//             filteredAlerts = alertsData.filter(alert => 
//               alert.token.toLowerCase().includes(searchLower) ||
//               (alert.contractAddress && alert.contractAddress.toLowerCase().includes(searchLower))
//             );
//           }

//           setAlerts(filteredAlerts);
//           setLoading(false);
//         }, (error) => {
//           console.error('Error fetching alerts:', error);
//           setLoading(false);
//         });
//       } catch (error) {
//         console.error('Error setting up query:', error);
//         setLoading(false);
//       }
//     };

//     fetchAlerts();

//     return () => {
//       if (unsubscribe) {
//         unsubscribe();
//       }
//     };
//   }, [filters]);

//   const handleFilterChange = (newFilters) => {
//     setFilters(prev => ({ ...prev, ...newFilters }));
//   };

//   return (
//     <div className="app-container">
//       <header className="app-header">
//         <div className="header-content">
//           <h1>Crypto Intelligence Dashboard</h1>
//           <p className="subtitle">Real-time whale tracking and token dump monitoring</p>
//         </div>
//       </header>

//       <div className="main-content">
//         <FilterBar 
//           filters={filters} 
//           onFilterChange={handleFilterChange}
//           viewMode={viewMode}
//           onViewModeChange={setViewMode}
//         />

//         {loading ? (
//           <div className="loading-state">
//             <div className="spinner"></div>
//             <p>Loading alerts...</p>
//           </div>
//         ) : alerts.length === 0 ? (
//           <div className="empty-state">
//             <div className="empty-icon">📊</div>
//             <h3>No alerts found</h3>
//             <p>Try adjusting your filters or wait for new whale activity</p>
//           </div>
//         ) : (
//           <>
//             {viewMode === 'cards' && (
//               <div className="alerts-grid">
//                 {alerts.map(alert => (
//                   <AlertCard key={alert.id} alert={alert} />
//                 ))}
//               </div>
//             )}

//             {viewMode === 'graph' && (
//               <NetworkGraph alerts={alerts} />
//             )}

//             {viewMode === 'chart' && (
//               <PriceChart alerts={alerts} />
//             )}
//           </>
//         )}
//       </div>

//       <footer className="app-footer">
//         <p>Powered by AI-driven blockchain analytics</p>
//       </footer>
//     </div>
//   );
// }

// export default App;

import React, { useState, useEffect } from 'react';
import { collection, query, orderBy, limit, onSnapshot, where } from 'firebase/firestore';
import { db } from './config/firebase';
import AlertCard from './components/AlertCard';
import FilterBar from './components/FilterBar';
import NetworkGraph from './components/NetworkGraph';
import PriceChart from './components/PriceChart';
import './App.css';

function App() {
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    chain: 'all',
    eventType: 'all',
    severity: 'all',
    searchToken: ''
  });
  const [viewMode, setViewMode] = useState('cards');

  useEffect(() => {
    let unsubscribe;

    const fetchAlerts = () => {
      try {
        const constraints = [];

        if (filters.chain !== 'all') {
          constraints.push(where('chain', '==', filters.chain));
        }

        if (filters.eventType !== 'all') {
          constraints.push(where('alertType', '==', filters.eventType));
        }

        if (filters.severity !== 'all') {
          constraints.push(where('severity', '==', filters.severity));
        }

        constraints.push(orderBy('timestamp', 'desc'));
        constraints.push(limit(50));

        const q = query(collection(db, 'alerts'), ...constraints);

        unsubscribe = onSnapshot(
          q,
          (snapshot) => {
            const alertsData = snapshot.docs.map((doc) => ({
              id: doc.id,
              ...doc.data()
            }));

            let filteredAlerts = alertsData;

            if (filters.searchToken) {
              const searchLower = filters.searchToken.toLowerCase();
              filteredAlerts = alertsData.filter((alert) =>
                alert.token?.toLowerCase().includes(searchLower) ||
                alert.contractAddress?.toLowerCase().includes(searchLower)
              );
            }

            setAlerts(filteredAlerts);
            setLoading(false);
          },
          (error) => {
            console.error('Error fetching alerts:', error);
            setLoading(false);
          }
        );
      } catch (error) {
        console.error('Error setting up query:', error);
        setLoading(false);
      }
    };

    fetchAlerts();

    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, [filters]);

  const handleFilterChange = (newFilters) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
  };

  return (
    <div className="app-container">
      <header className="app-header">
        <div className="header-content">
          <h1>Crypto Intelligence Dashboard</h1>
          <p className="subtitle">Real-time whale tracking and token dump monitoring</p>
        </div>
      </header>

      <div className="main-content">
        <FilterBar
          filters={filters}
          onFilterChange={handleFilterChange}
          viewMode={viewMode}
          onViewModeChange={setViewMode}
        />

        {loading ? (
          <div className="loading-state">
            <div className="spinner"></div>
            <p>Loading alerts...</p>
          </div>
        ) : alerts.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">📊</div>
            <h3>No alerts found</h3>
            <p>Try adjusting your filters or wait for new whale activity</p>
          </div>
        ) : (
          <>
            {viewMode === 'cards' && (
              <div className="alerts-grid">
                {alerts.map((alert) => (
                  <AlertCard key={alert.id} alert={alert} />
                ))}
              </div>
            )}

            {viewMode === 'graph' && <NetworkGraph alerts={alerts} />}
            {viewMode === 'chart' && <PriceChart alerts={alerts} />}
          </>
        )}
      </div>

      <footer className="app-footer">
        <p>Powered by AI-driven blockchain analytics</p>
      </footer>
    </div>
  );
}

export default App;
