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
import { Person, FirstPage, LastPage, NavigateBefore, NavigateNext } from '@mui/icons-material';
import { ThemeContext } from '../App';

function PlayerStats({ stats, searchPlayer }) {
  const { darkMode } = useContext(ThemeContext);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [selectedDate, setSelectedDate] = useState('All Time');

  // Get unique dates and sort descending
  const allDates = Array.from(new Set(stats.map(s => s.date)));
  allDates.sort((a, b) => new Date(b) - new Date(a));

  // Filter by player name and date
  const filteredStats = stats
    .filter(entry => {
      const matchesName = entry.player.toLowerCase().includes(searchPlayer.toLowerCase());
      const matchesDate = selectedDate === 'All Time' || entry.date === selectedDate;
      return matchesName && matchesDate;
    })
    // Sort by date (newest first) and then by kills (highest first)
    .sort((a, b) => {
      const dateCompare = new Date(b.date) - new Date(a.date);
      if (dateCompare !== 0) return dateCompare;
      return b.kills - a.kills;
    });

  const totalPages = Math.ceil(filteredStats.length / rowsPerPage);
  const currentItems = filteredStats.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

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
          <Person color="primary" sx={{ mr: 1 }} />
          <Typography variant="h6" component="h2" sx={{ fontSize: '1rem' }}>
            Тоглогчийн статистик
          </Typography>
        </Box>
        
        <Box sx={{ mb: 2 }}>
          <TextField
            fullWidth
            select
            value={selectedDate}
            onChange={e => setSelectedDate(e.target.value)}
            SelectProps={{
              native: true,
            }}
            size="small"
            sx={{ fontSize: '0.75rem' }}
          >
            <option value="All Time">Бүх цаг үе</option>
            {allDates.map(date => (
              <option key={date} value={date}>{date}</option>
            ))}
          </TextField>
        </Box>

        <TableContainer>
          <Table size="small" sx={{ tableLayout: 'fixed' }}>
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: 'bold', py: 1, width: '15%', fontSize: '0.75rem' }}>Огноо</TableCell>
                <TableCell sx={{ fontWeight: 'bold', py: 1, width: '20%', fontSize: '0.75rem' }}>Тоглогч</TableCell>
                <TableCell sx={{ fontWeight: 'bold', py: 1, width: '10%', textAlign: 'center', fontSize: '0.75rem' }}>Алуур</TableCell>
                <TableCell sx={{ fontWeight: 'bold', py: 1, width: '10%', textAlign: 'center', fontSize: '0.75rem' }}>Үхэл</TableCell>
                <TableCell sx={{ fontWeight: 'bold', py: 1, width: '20%', fontSize: '0.75rem' }}>Дайсан</TableCell>
                <TableCell sx={{ fontWeight: 'bold', py: 1, width: '25%', fontSize: '0.75rem' }}>Хохирогч</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {currentItems.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} align="center" sx={{ py: 1, fontSize: '0.75rem' }}>
                    Үр дүн олдсонгүй.
                  </TableCell>
                </TableRow>
              ) : (
                currentItems.map((entry, i) => (
                  <TableRow key={i} hover>
                    <TableCell sx={{ py: 1, fontSize: '0.75rem' }}>{entry.date}</TableCell>
                    <TableCell sx={{ py: 1, fontSize: '0.75rem', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {entry.player}
                    </TableCell>
                    <TableCell sx={{ py: 1, textAlign: 'center' }}>
                      <Chip label={entry.kills} color="error" size="small" sx={{ fontSize: '0.7rem' }} />
                    </TableCell>
                    <TableCell sx={{ py: 1, textAlign: 'center' }}>
                      <Chip label={entry.deaths} color="default" size="small" variant="outlined" sx={{ fontSize: '0.7rem' }} />
                    </TableCell>
                    <TableCell sx={{ py: 1, fontSize: '0.75rem', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {entry.nemesis}
                    </TableCell>
                    <TableCell sx={{ py: 1, fontSize: '0.75rem', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {entry.victim}
                    </TableCell>
                  </TableRow>
                ))
              )}
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

export default PlayerStats;