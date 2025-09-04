import React, { useEffect, useState } from 'react';
import PlayerStats from './components/PlayerStats';
import DailySummary from './components/DailySummary';
import RankingTable from './components/RankingTable';

function App() {
  const [data, setData] = useState(null);

  useEffect(() => {
    fetch(`${process.env.PUBLIC_URL}/data.json`)
    .then(res => res.json())
    .then(setData)
    .catch(err => console.error('Fetch error:', err));
  }, []);

  if (!data) return <div>Loading...</div>;

  return (
    <div style={{ padding: '2rem', fontFamily: 'sans-serif' }}>
      <h1>🎮 GitHub.io Game Stats</h1>
      <DailySummary summary={data.daily_summary} />
      <RankingTable ranking={data.ranking} />
      <PlayerStats stats={data.player_stats} />
    </div>
  );
}

export default App;