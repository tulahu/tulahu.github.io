import React from 'react';

function DailySummary({ summary }) {

  const sortedSummary = [...summary].sort((a, b) => new Date(b.date) - new Date(a.date));

  return (
    <div>
      <h2>📅 Өдөр тутмын хураангуй</h2>
      <table border="1" cellPadding="8">
        <thead>
          <tr>
            <th>Огноо</th>
            <th>Ялагч</th>
          </tr>
        </thead>
        <tbody>
          {sortedSummary.map((day, i) => (
            <tr key={i}>
              <td>{day.date}</td>
              <td>{day.winner}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default DailySummary;