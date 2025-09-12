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
  IconButton,
  Tooltip,
  useMediaQuery
} from '@mui/material';
import {
  Person,
  FirstPage,
  LastPage,
  NavigateBefore,
  NavigateNext
} from '@mui/icons-material';
import { useTheme } from '@mui/material/styles';
import { ThemeContext } from '../App';
import { useSwipeable } from 'react-swipeable';
import { keyframes } from '@emotion/react';

// 🔥 Glow animations
const redGlow = keyframes`
  0%, 100% { box-shadow: 0 0 0px #ff1744; }
  50% { box-shadow: 0 0 12px #ff1744; }
`;

const getGoldGlow = (isDarkMode) => keyframes`
  0%, 100% {
    box-shadow: 0 0 0px ${isDarkMode ? '#ffcc00' : '#b8860b'};
  }
  50% {
    box-shadow: 0 0 ${isDarkMode ? '16px' : '10px'} ${isDarkMode ? '#ffcc00' : '#b8860b'};
  }
`;

// const goldGlow = keyframes`
//   0%, 100% { box-shadow: 0 0 0px #ffcc00; }
//   50% { box-shadow: 0 0 16px #ffcc00; }
// `;

function PlayerStats({ stats, searchPlayer, selectedDate }) {
  const theme = useTheme();
  const isDarkMode = theme.palette.mode === 'dark';
  const goldGlow = getGoldGlow(isDarkMode);
  const { darkMode } = useContext(ThemeContext);
  const [page, setPage] = useState(0);
  const [rowsPerPage] = useState(10);
  const isMobile = useMediaQuery('(max-width:600px)');

  const filteredStats = stats
    .filter(entry => {
      const matchesName = entry.player.toLowerCase().includes(searchPlayer.toLowerCase());
      const matchesDate = selectedDate === 'All Time' || entry.date === selectedDate;
      return matchesName && matchesDate;
    })
    .sort((a, b) => {
      const dateCompare = new Date(b.date) - new Date(a.date);
      if (dateCompare !== 0) return dateCompare;
      return b.kills - a.kills;
    });

  const totalPages = Math.ceil(filteredStats.length / rowsPerPage);
  const currentItems = filteredStats.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  const topKills = currentItems.reduce((max, entry) => Math.max(max, entry.kills), 0);

  const handleFirstPage = () => setPage(0);
  const handlePreviousPage = () => setPage(prev => Math.max(prev - 1, 0));
  const handleNextPage = () => setPage(prev => Math.min(prev + 1, totalPages - 1));
  const handleLastPage = () => setPage(totalPages - 1);

  const swipeHandlers = useSwipeable({
    onSwipedLeft: () => handleNextPage(),
    onSwipedRight: () => handlePreviousPage(),
    preventDefaultTouchmoveEvent: true,
    trackMouse: false
  });

  const noSelectStyle = {
    userSelect: 'none',
    WebkitUserSelect: 'none',
    MozUserSelect: 'none',
    msUserSelect: 'none',
    WebkitTapHighlightColor: 'transparent'
  };

  return (
    <Card elevation={3} sx={{ height: '100%' }} {...swipeHandlers}>
      <CardContent>
        <Box display="flex" alignItems="center" mb={2}>
          <Person color="primary" sx={{ mr: 1 }} />
          <Typography variant="h6" component="h2" sx={{ fontSize: '1rem' }}>
            Тоглогчийн статистик
          </Typography>
        </Box>

        <TableContainer>
          <Table size="small" sx={{ tableLayout: 'fixed' }}>
            <TableHead>
              <TableRow>
                {['Огноо', 'Тоглогч', 'Алуур', 'Өстөн дайсан', 'Хохирогч'].map((label, idx) => (
                  <TableCell
                    key={idx}
                    sx={{
                      fontWeight: 'bold',
                      py: 1,
                      fontSize: '0.75rem',
                      ...(idx === 2 ? { textAlign: 'center', width: '10%' } : {}),
                      ...noSelectStyle
                    }}
                  >
                    {label}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {currentItems.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} align="center" sx={{ py: 1, fontSize: '0.75rem', ...noSelectStyle }}>
                    Үр дүн олдсонгүй.
                  </TableCell>
                </TableRow>
              ) : (
                currentItems.map((entry, i) => (
                  <TableRow key={i} hover>
                    <TableCell sx={{ py: 1, fontSize: '0.75rem', ...noSelectStyle }}>{entry.date}</TableCell>

                    <TableCell sx={{ py: 1, fontSize: '0.75rem', ...noSelectStyle }}>
                      <Tooltip title={entry.player} placement="top-start" enterTouchDelay={0} leaveTouchDelay={3000}>
                        <Box sx={{ ...noSelectStyle, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', width: '100%' }}>
                          {entry.player}
                        </Box>
                      </Tooltip>
                    </TableCell>

                    <TableCell sx={{ py: 1, textAlign: 'center', ...noSelectStyle }}>
                      <Box
                        sx={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          width: isMobile ? 20 : 24,
                          height: isMobile ? 20 : 24,
                          borderRadius: '50%',
                          backgroundColor: 'error.main',
                          color: 'white',
                          fontSize: isMobile ? '0.6rem' : '0.7rem',
                          fontWeight: 'bold',
                          animation: `${entry.kills === topKills ? goldGlow : redGlow} 2s infinite`
                        }}
                      >
                        {entry.kills}
                      </Box>
                    </TableCell>

                    <TableCell sx={{ py: 1, fontSize: '0.75rem', ...noSelectStyle }}>
                      <Tooltip title={entry.nemesis} placement="top-start" enterTouchDelay={0} leaveTouchDelay={3000}>
                        <Box sx={{ ...noSelectStyle, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', width: '100%' }}>
                          {entry.nemesis}
                        </Box>
                      </Tooltip>
                    </TableCell>

                    <TableCell sx={{ py: 1, fontSize: '0.75rem', ...noSelectStyle }}>
                      <Tooltip title={entry.victim} placement="top-start" enterTouchDelay={0} leaveTouchDelay={3000}>
                        <Box sx={{ ...noSelectStyle, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', width: '100%' }}>
                          {entry.victim}
                        </Box>
                      </Tooltip>
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