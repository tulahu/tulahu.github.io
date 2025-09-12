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
  Box,
  Chip,
  IconButton,
  Tooltip
} from '@mui/material';
import {
  EmojiEvents,
  FirstPage,
  LastPage,
  NavigateBefore,
  NavigateNext
} from '@mui/icons-material';
import { ThemeContext } from '../App';
import { keyframes } from '@emotion/react';

// 🥇 Medal glow animations
const goldGlow = keyframes`
  0%, 100% { box-shadow: 0 0 0px #D4AF37; }
  50% { box-shadow: 0 0 12px #D4AF37; }
`;

const silverGlow = keyframes`
  0%, 100% { box-shadow: 0 0 0px #C0C0C0; }
  50% { box-shadow: 0 0 12px #C0C0C0; }
`;

const bronzeGlow = keyframes`
  0%, 100% { box-shadow: 0 0 0px #CD7F32; }
  50% { box-shadow: 0 0 12px #CD7F32; }
`;

// Time helpers
const timeToSeconds = (timeValue) => {
  if (!timeValue) return 0;
  if (typeof timeValue === 'number') return timeValue;
  if (timeValue.includes(':')) {
    const parts = timeValue.split(':').map(Number);
    if (parts.length === 3) return parts[0] * 3600 + parts[1] * 60 + parts[2];
    if (parts.length === 2) return parts[0] * 60 + parts[1];
  }
  if (timeValue.includes('.')) return parseFloat(timeValue);
  return Number(timeValue);
};

const formatTime = (seconds) => {
  if (seconds < 60) return `${seconds.toFixed(2)}s`;
  const mins = Math.floor(seconds / 60);
  const secs = (seconds % 60).toFixed(2);
  return `${mins}:${secs.padStart(5, '0')}`;
};

function RankingTable({ ranking, searchPlayer, selectedDate }) {
  const { darkMode } = useContext(ThemeContext);
  const [page, setPage] = useState(0);
  const [rowsPerPage] = useState(10);

  const filteredRanking = ranking
    .filter(entry => {
      const matchesPlayer = entry.player.toLowerCase().includes(searchPlayer.toLowerCase());
      const matchesDate = selectedDate === 'All Time' || entry.date === selectedDate;
      return matchesPlayer && matchesDate;
    })
    .sort((a, b) => {
      const dateCompare = new Date(b.date) - new Date(a.date);
      if (dateCompare !== 0) return dateCompare;
      return a.rank - b.rank;
    });

  const totalPages = Math.ceil(filteredRanking.length / rowsPerPage);
  const currentItems = filteredRanking.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  const handleFirstPage = () => setPage(0);
  const handlePreviousPage = () => setPage(prev => Math.max(prev - 1, 0));
  const handleNextPage = () => setPage(prev => Math.min(prev + 1, totalPages - 1));
  const handleLastPage = () => setPage(totalPages - 1);

  const noSelectStyle = {
    userSelect: 'none',
    WebkitUserSelect: 'none',
    MozUserSelect: 'none',
    msUserSelect: 'none',
    WebkitTapHighlightColor: 'transparent'
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

        <TableContainer>
          <Table size="small" sx={{ tableLayout: 'fixed' }}>
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: 'bold', py: 1, width: '25%', fontSize: '0.75rem', ...noSelectStyle }}>Огноо</TableCell>
                <TableCell sx={{ fontWeight: 'bold', py: 1, width: '35%', fontSize: '0.75rem', ...noSelectStyle }}>Тоглогч</TableCell>
                <TableCell sx={{ fontWeight: 'bold', py: 1, width: '20%', textAlign: 'center', fontSize: '0.75rem', ...noSelectStyle }}>Зэрэглэл</TableCell>
                <TableCell sx={{ fontWeight: 'bold', py: 1, width: '20%', fontSize: '0.75rem', ...noSelectStyle }}>Хугацаа</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {currentItems.map((entry, i) => {
                const rank = entry.rank === 0 ? 1 : entry.rank;
                let glowAnimation = 'none';
                let chipColor = 'default';
                let chipStyle = {};

                if (rank === 1) {
                  glowAnimation = goldGlow;
                  chipStyle = { backgroundColor: '#D4AF37', color: 'black' };
                } else if (rank === 2) {
                  glowAnimation = silverGlow;
                  chipStyle = { backgroundColor: '#C0C0C0', color: 'black' };
                } else if (rank === 3) {
                  glowAnimation = bronzeGlow;
                  chipStyle = { backgroundColor: '#CD7F32', color: 'white' };
                }

                return (
                  <TableRow key={i} hover>
                    <TableCell sx={{ py: 1, fontSize: '0.75rem', ...noSelectStyle }}>{entry.date}</TableCell>
                    <TableCell sx={{ py: 1, fontSize: '0.75rem', overflow: 'hidden', ...noSelectStyle }}>
                      <Tooltip title={entry.player} placement="top-start">
                        <Box sx={{
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap',
                          width: '100%'
                        }}>
                          {entry.player}
                        </Box>
                      </Tooltip>
                    </TableCell>
                    <TableCell sx={{ py: 1, textAlign: 'center', ...noSelectStyle }}>
                      <Chip
                        label={rank}
                        size="small"
                        sx={{
                          fontSize: '0.7rem',
                          animation: rank <= 3 ? `${glowAnimation} 2s infinite` : 'none',
                          ...chipStyle
                        }}
                      />
                    </TableCell>
                    <TableCell sx={{ py: 1, fontSize: '0.75rem', ...noSelectStyle }}>
                      {entry.time === null
                        ? <Chip icon={<EmojiEvents />} color="success" size="small" sx={{ fontSize: '0.7rem' }} />
                        : formatTime(timeToSeconds(entry.time))}
                    </TableCell>
                  </TableRow>
                );
              })}
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