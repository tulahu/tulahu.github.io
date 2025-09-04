import React, { useState, useEffect } from 'react';

function PlayerStats({ stats }) {
  const rowsPerPage = 10;

  // Get unique dates and sort descending
  const allDates = Array.from(new Set(stats.map(s => s.date)));
  allDates.sort((a, b) => new Date(b) - new Date(a));

  // Default to latest date
  const [selectedDate, setSelectedDate] = useState(allDates[0] || 'All Time');
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  // Filter by player name and date
  const filteredStats = stats.filter(entry => {
    const matchesName = entry.player.toLowerCase().includes(search.toLowerCase());
    const matchesDate = selectedDate === 'All Time' || entry.date === selectedDate;
    return matchesName && matchesDate;
  });

  const totalPages = Math.ceil(filteredStats.length / rowsPerPage) || 1;
  const startIdx = (currentPage - 1) * rowsPerPage;
  const currentRows = filteredStats.slice(startIdx, startIdx + rowsPerPage);

  const goToPage = (page) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  };

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [search, selectedDate]);

  return (
    <div className="responsive-table-container">
      <h2>🔍 Тоглогчийн статистик</h2>
      <div className="stats-filters">
        <input
          type="text"
          placeholder="Нэрээр хайх..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="stats-searchbar"
        />
        <select
          value={selectedDate}
          onChange={e => setSelectedDate(e.target.value)}
          className="stats-date-select"
        >
          <option value="All Time">Бүх цаг үе</option>
          {allDates.map(date => (
            <option key={date} value={date}>{date}</option>
          ))}
        </select>
      </div>

      <table className="responsive-table" border="1" cellPadding="8">
        <thead>
          <tr>
            <th>Огноо</th>
            <th>Тоглогч</th>
            <th>Алуур</th>
            <th>Үхэл</th>
            <th>Дайсан</th>
            <th>Хохирогч</th>
          </tr>
        </thead>
        <tbody>
          {currentRows.length === 0 ? (
            <tr><td colSpan="6" style={{ textAlign: 'center' }}>Үр дүн олдсонгүй.</td></tr>
          ) : (
            currentRows.map((entry, i) => (
              <tr key={startIdx + i}>
                <td>{entry.date}</td>
                <td>{entry.player}</td>
                <td>{entry.kills}</td>
                <td>{entry.deaths}</td>
                <td>{entry.nemesis}</td>
                <td>{entry.victim}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      <div className="pagination-controls" style={{ marginTop: '1em' }}>
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

export default PlayerStats;