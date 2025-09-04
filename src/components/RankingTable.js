import React, { useState } from 'react';

function RankingTable({ ranking }) {
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 10;
  const totalPages = Math.ceil(ranking.length / rowsPerPage);

  const startIdx = (currentPage - 1) * rowsPerPage;
  const currentRows = ranking.slice(startIdx, startIdx + rowsPerPage);

  const goToPage = (page) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  };

  return (
    <div>
      <h2>🏅 Player Rankings</h2>
      <table border="1" cellPadding="8">
        <thead>
          <tr>
            <th>Date</th>
            <th>Player</th>
            <th>Rank</th>
            <th>Time</th>
          </tr>
        </thead>
        <tbody>
          {currentRows.map((entry, i) => (
            <tr key={startIdx + i}>
              <td>{entry.date}</td>
              <td>{entry.player}</td>
              <td>{entry.rank}</td>
              <td>{entry.time}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div style={{ marginTop: '1em' }}>
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

export default RankingTable;