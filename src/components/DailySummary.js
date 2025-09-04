import React from 'react';

function DailySummary({ summary }) {
  return (
    <div>
      <h2>📅 Daily Summary</h2>
      <table border="1" cellPadding="8">
        <thead>
          <tr>
            <th>Date</th>
            <th>Players</th>
            <th>Winner</th>
          </tr>
        </thead>
        <tbody>
          {summary.map((day, i) => (
            <tr key={i}>
              <td>{day.date}</td>
              <td>{day.num_players}</td>
              <td>{day.winner}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default DailySummary;