import React, { useState, useContext } from 'react';
import {
  Card,
  CardContent,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Box,
  Chip,
  IconButton
} from '@mui/material';
import { EmojiEvents, FirstPage, LastPage, NavigateBefore, NavigateNext } from '@mui/icons-material';
import { ThemeContext } from '../App';

// Helper to convert time string to seconds
const timeToSeconds = (timeValue) => {
  if (!timeValue) return 0;
  
  // If it's already a number, return it directly
  if (typeof timeValue === 'number') {
    return timeValue;
  }
  
  // If it's a string with colons (HH:MM:SS format)
  if (timeValue.includes(':')) {
    const parts = timeValue.split(':').map(Number);
    if (parts.length === 3) {
      return parts[0] * 3600 + parts[1] * 60 + parts[2];
    } else if (parts.length === 2) {
      return parts[0] * 60 + parts[1];
    }
  }
  
  // If it's a string with dots (seconds.centiseconds format)
  if (timeValue.includes('.')) {
    return parseFloat(timeValue);
  }
  
  // If it's just a number as string
  return Number(timeValue);
};

// Helper to convert seconds back to MM:SS format (for shorter times)
const formatTime = (seconds) => {
  if (seconds < 60) {
    return `${seconds.toFixed(2)}s`; // Show decimal seconds for short times
  }
  
  const mins = Math.floor(seconds / 60);
  const secs = (seconds % 60).toFixed(2);
  return `${mins}:${secs.padStart(5, '0')}`; // Format as M:SS.ss
};

function RankingTable({ ranking, searchPlayer }) {
  const { darkMode } = useContext(ThemeContext);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchDate, setSearchDate] = useState('');

  const uniqueDates = [...new Set(ranking.map(entry => entry.date))].sort().reverse();

  // Filter by player name and date
  const filteredRanking = ranking
    .filter(entry => {
      const matchesPlayer = entry.player.toLowerCase().includes(searchPlayer.toLowerCase());
      const matchesDate = searchDate ? entry.date === searchDate : true;
      return matchesPlayer && matchesDate;
    })
    // Sort by date (newest first) and then by rank (lowest first)
    .sort((a, b) => {
      const dateCompare = new Date(b.date) - new Date(a.date);
      if (dateCompare !== 0) return dateCompare;
      return a.rank - b.rank;
    });

  const totalPages = Math.ceil(filteredRanking.length / rowsPerPage);
  const currentItems = filteredRanking.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  const handleFirstPage = () => {
    setPage(0);
  };

  const handlePreviousPage = () => {
    setPage(prev => Math.max(prev - 1, 0));
  };

  const handleNextPage = () => {
    setPage(prev => Math.min(prev + 1, totalPages - 1));
  };

  const handleLastPage = () => {
    setPage(totalPages - 1);
  };

  return (
    <Card elevation={3} sx={{ height: '100%' }}>
      <CardContent>
        <Box display="flex" alignItems="center" mb={2}>
          <EmojiEvents color="primary" sx={{ mr: 1 }} />
          <Typography variant="h6" component="h2" sx={{ fontSize: '1rem' }}>
            Тоглогчдын зэрэглэл
          </Typography>
        </Box>

        <Box sx={{ mb: 2 }}>
          <TextField
            fullWidth
            select
            value={searchDate}
            onChange={(e) => setSearchDate(e.target.value)}
            SelectProps={{
              native: true,
            }}
            size="small"
            sx={{ fontSize: '0.75rem' }}
          >
            <option value="">Бүх огноо</option>
            {uniqueDates.map((date, i) => (
              <option key={i} value={date}>{date}</option>
            ))}
          </TextField>
        </Box>

        <TableContainer>
          <Table size="small" sx={{ tableLayout: 'fixed' }}>
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: 'bold', py: 1, width: '25%', fontSize: '0.75rem' }}>Огноо</TableCell>
                <TableCell sx={{ fontWeight: 'bold', py: 1, width: '35%', fontSize: '0.75rem' }}>Тоглогч</TableCell>
                <TableCell sx={{ fontWeight: 'bold', py: 1, width: '20%', textAlign: 'center', fontSize: '0.75rem' }}>Зэрэглэл</TableCell>
                <TableCell sx={{ fontWeight: 'bold', py: 1, width: '20%', fontSize: '0.75rem' }}>Хугацаа</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {currentItems.map((entry, i) => (
                <TableRow key={i} hover>
                  <TableCell sx={{ py: 1, fontSize: '0.75rem' }}>{entry.date}</TableCell>
                  <TableCell sx={{ py: 1, fontSize: '0.75rem', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {entry.player}
                  </TableCell>
                  <TableCell sx={{ py: 1, textAlign: 'center' }}>
                    <Chip 
                      label={entry.rank === 0 ? 1 : entry.rank} 
                      color={
                        entry.rank === 0 ? 'primary' : 
                        entry.rank <= 3 ? 'secondary' : 'default'
                      } 
                      variant={entry.rank <= 3 ? 'filled' : 'outlined'}
                      size="small"
                      sx={{ fontSize: '0.7rem' }}
                    />
                  </TableCell>
                  <TableCell sx={{ py: 1, fontSize: '0.75rem' }}>
                    {entry.time === null
                      ? <Chip icon={<EmojiEvents />} color="success" size="small" sx={{ fontSize: '0.7rem' }} />
                      : formatTime(timeToSeconds(entry.time))}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        
        <Box display="flex" justifyContent="space-between" alignItems="center" mt={2}>
          <Box>
            <IconButton onClick={handleFirstPage} disabled={page === 0} size="small">
              <FirstPage fontSize="small" />
            </IconButton>
            <IconButton onClick={handlePreviousPage} disabled={page === 0} size="small">
              <NavigateBefore fontSize="small" />
            </IconButton>
          </Box>
          <Typography variant="body2" sx={{ fontSize: '0.75rem' }}>
            {page + 1} / {totalPages}
          </Typography>
          <Box>
            <IconButton onClick={handleNextPage} disabled={page >= totalPages - 1} size="small">
              <NavigateNext fontSize="small" />
            </IconButton>
            <IconButton onClick={handleLastPage} disabled={page >= totalPages - 1} size="small">
              <LastPage fontSize="small" />
            </IconButton>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
}

export default RankingTable;