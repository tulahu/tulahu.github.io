import React, { useState } from 'react';

// Helper to convert time string to seconds
const timeToSeconds = (timeStr) => {
  const parts = timeStr.split('.').map(Number);
  if (parts.length === 3) {
    return parts[0] * 3600 + parts[1] * 60 + parts[2]; // HH.MM.SS
  } else if (parts.length === 2) {
    return parts[0] * 60 + parts[1]; // MM.SS
  } else {
    return parts[0]; // SS
  }
};

// Helper to convert seconds back to HH:MM:SS
const formatSeconds = (totalSec) => {
  const h = Math.floor(totalSec / 3600);
  const m = Math.floor((totalSec % 3600) / 60);
  const s = totalSec % 60;
  return [h, m, s].map(v => String(v).padStart(2, '0')).join(':');
};

function RankingTable({ ranking }) {
  const uniqueDates = [...new Set(ranking.map(entry => entry.date))].sort().reverse();
  const [searchDate, setSearchDate] = useState(uniqueDates[0] || '');
  const [searchPlayer, setSearchPlayer] = useState('');
  const [sortOrder, setSortOrder] = useState('asc'); // 'asc' or 'desc'
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 10;

  // Filter by player name and date
  const filteredRanking = ranking.filter(entry => {
    const matchesPlayer = entry.player.toLowerCase().includes(searchPlayer.toLowerCase());
    const matchesDate = searchDate ? entry.date === searchDate : true;
    return matchesPlayer && matchesDate;
  });

  // Sort by rank
  const sortedRanking = [...filteredRanking].sort((a, b) => {
    const rankA = a.rank === 0 ? 1 : a.rank;
    const rankB = b.rank === 0 ? 1 : b.rank;
    return sortOrder === 'asc' ? rankA - rankB : rankB - rankA;
  });

  const totalPages = Math.ceil(sortedRanking.length / rowsPerPage);
  const startIdx = (currentPage - 1) * rowsPerPage;
  const currentRows = sortedRanking.slice(startIdx, startIdx + rowsPerPage);

  const goToPage = (page) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  };

  return (
    <div>
      <h2>🏅 Тоглогчдын зэрэглэл</h2>

      {/* Filters */}
      <div style={{ marginBottom: '1em' }}>
        <input
          type="text"
          placeholder="Тоглогчийн нэрээр хайх"
          value={searchPlayer}
          onChange={(e) => {
            setSearchPlayer(e.target.value);
            setCurrentPage(1);
          }}
          style={{ marginRight: '1em' }}
        />
        <select
          value={searchDate}
          onChange={(e) => {
            setSearchDate(e.target.value);
            setCurrentPage(1);
          }}
          style={{ marginRight: '1em' }}
        >
          {uniqueDates.map((date, i) => (
            <option key={i} value={date}>{date}</option>
          ))}
        </select>
      </div>

      {/* Ranking Table */}
      <table border="1" cellPadding="8">
        <thead>
          <tr>
            <th>Огноо</th>
            <th>Тоглогч</th>
            <th>Зэрэглэл</th>
            <th>Хугацаа</th>
          </tr>
        </thead>
        <tbody>
          {currentRows.map((entry, i) => (
            <tr key={startIdx + i}>
              <td>{entry.date}</td>
              <td>{entry.player}</td>
              <td>{entry.rank === 0 ? 1 : entry.rank}</td>
              <td>
                {entry.time === null
                  ? '🏆'
                  : formatSeconds(timeToSeconds(entry.time.toString()))}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Mongolian Pagination */}
      <div style={{ marginTop: '1em' }}>
        <button onClick={() => goToPage(1)} disabled={currentPage === 1}>
          Эхлэл
        </button>
        <button onClick={() => goToPage(currentPage - 1)} disabled={currentPage === 1}>
          Өмнөх
        </button>
        <span style={{ margin: '0 1em' }}>
          Хуудас {currentPage} / {totalPages}
        </span>
        <button onClick={() => goToPage(currentPage + 1)} disabled={currentPage === totalPages}>
          Дараах
        </button>
        <button onClick={() => goToPage(totalPages)} disabled={currentPage === totalPages}>
          Төгсгөл
        </button>
      </div>
    </div>
  );
}

export default RankingTable;