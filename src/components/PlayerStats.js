import React, { useState } from 'react';

function PlayerStats({ stats }) {
  const [currentPage, setCurrentPage] = useState(1);
  const [search, setSearch] = useState("");
  const [selectedDate, setSelectedDate] = useState("All Time");
  const rowsPerPage = 10;

  // Get unique dates for dropdown
  const allDates = Array.from(new Set(stats.map(s => s.date)));
  allDates.sort((a, b) => new Date(b) - new Date(a));

  // Filter by player name and date
  const filteredStats = stats.filter(entry => {
    const matchesName = entry.player.toLowerCase().includes(search.toLowerCase());
    const matchesDate = selectedDate === "All Time" || entry.date === selectedDate;
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
  React.useEffect(() => {
    setCurrentPage(1);
  }, [search, selectedDate]);

  return (
    <div className="responsive-table-container">
      <h2>🔍 Player Stats</h2>
      <div className="stats-filters">
        <input
          type="text"
          placeholder="Search player name..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="stats-searchbar"
        />
        <select
          value={selectedDate}
          onChange={e => setSelectedDate(e.target.value)}
          className="stats-date-select"
        >
          <option value="All Time">All Time</option>
          {allDates.map(date => (
            <option key={date} value={date}>{date}</option>
          ))}
        </select>
      </div>
      <table className="responsive-table" border="1" cellPadding="8">
        <thead>
          <tr>
            <th>Date</th>
            <th>Player</th>
            <th>Kills</th>
            <th>Deaths</th>
            <th>Nemesis</th>
            <th>Victim</th>
          </tr>
        </thead>
        <tbody>
          {currentRows.length === 0 ? (
            <tr><td colSpan="6" style={{textAlign:'center'}}>No results found.</td></tr>
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
      <div className="pagination-controls">
        <button onClick={() => goToPage(currentPage - 1)} disabled={currentPage === 1}>
          Previous
        </button>
        <span style={{ margin: '0 1em' }}>
          Page {currentPage} of {totalPages}
        </span>
        <button onClick={() => goToPage(currentPage + 1)} disabled={currentPage === totalPages}>
          Next
        </button>
      </div>
    </div>
  );
}

export default PlayerStats;