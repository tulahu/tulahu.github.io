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
import { convertToTraditionalMongolian } from '../utils/dateConversion';
import HoverTranslation from '../utils/HoverTranslation';

// Medal glow animations
const goldGlow = keyframes`0%, 100% { box-shadow: 0 0 0px #D4AF37; } 50% { box-shadow: 0 0 12px #D4AF37; }`;
const silverGlow = keyframes`0%, 100% { box-shadow: 0 0 0px #C0C0C0; } 50% { box-shadow: 0 0 12px #C0C0C0; }`;
const bronzeGlow = keyframes`0%, 100% { box-shadow: 0 0 0px #CD7F32; } 50% { box-shadow: 0 0 12px #CD7F32; }`;

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

function RankingTable({ ranking, searchPlayer, selectedDate, language }) {
  const { darkMode } = useContext(ThemeContext);
  const [page, setPage] = useState(0);
  const rowsPerPage = 10;

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

  const labels = {
    title: {
      traditional: 'ᠲᠣᠭᠯᠠᠭᠴᠢᠳ ᠤ᠋ᠨ ᠵᠡᠷᢉᠡᠯᠡᠯ',
      hover: 'Тоглогчдын зэрэглэл',
      modern: 'Тоглогчдын зэрэглэл'
    },
    date: { traditional: 'ᠣᠩᠨᠠᠭ᠎ᠠ', hover: 'Огноо', modern: 'Огноо' },
    player: { traditional: 'ᠲᠣᠭᠯᠠᠭᠴᠢ', hover: 'Тоглогч', modern: 'Тоглогч' },
    rank: { traditional: 'ᠵᠡᠷᢉᠡᠯᠡᠯ', hover: 'Зэрэглэл', modern: 'Зэрэглэл' },
    time: { traditional: 'ᠬᠤᠭᠤᠴᠠᠭ᠎ᠠ', hover: 'Хугацаа', modern: 'Хугацаа' }
  };

  const pageText =
    language === 'traditional'
      ? `${convertToTraditionalMongolian(String(page + 1))} / ${convertToTraditionalMongolian(String(totalPages))}`
      : `${page + 1} / ${totalPages}`;

  const renderPagination = () => (
    <Box display="flex" justifyContent="center" alignItems="center" mt={2} gap={2}>
      <IconButton onClick={handleFirstPage} disabled={page === 0} size="small">
        <FirstPage fontSize="small" />
      </IconButton>
      <IconButton onClick={handlePreviousPage} disabled={page === 0} size="small">
        <NavigateBefore fontSize="small" />
      </IconButton>
      <Typography variant="body2" sx={{ fontSize: language === 'traditional' ? '1rem' : '0.75rem' }}>
        {pageText}
      </Typography>
      <IconButton onClick={handleNextPage} disabled={page >= totalPages - 1} size="small">
        <NavigateNext fontSize="small" />
      </IconButton>
      <IconButton onClick={handleLastPage} disabled={page >= totalPages - 1} size="small">
        <LastPage fontSize="small" />
      </IconButton>
    </Box>
  );

  const renderModernTable = () => (
    <TableContainer>
      <Table size="small" sx={{ tableLayout: 'fixed' }}>
        <TableHead>
          <TableRow>
            {[labels.date.modern, labels.player.modern, labels.rank.modern, labels.time.modern].map((label, idx) => (
              <TableCell
                key={idx}
                sx={{
                  fontWeight: 'bold',
                  py: 1,
                  fontSize: '0.75rem',
                  textAlign: idx === 2 ? 'center' : 'left',
                  ...noSelectStyle
                }}
              >
                {label}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {currentItems.map((entry, i) => {
            const rank = entry.rank === 0 ? 1 : entry.rank;
            let glowAnimation = 'none';
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
  );

  return (
    <Card elevation={3} sx={{ height: '100%' }}>
      <CardContent>
        {language === 'traditional' ? (
          <Box display="flex" flexDirection="row" alignItems="stretch" gap={2}>
            {/* Left side: Icon + Vertical Title */}
            <Box display="flex" flexDirection="column" alignItems="center" justifyContent="start">
              <EmojiEvents color="primary" sx={{ mb: 1 }} />
              <HoverTranslation
                traditionalText={labels.title.traditional}
                cyrillicText={labels.title.hover}
                language={language}
                sx={{ fontSize: '1.2rem', fontWeight: 'bold' }}
              />
            </Box>

            {/* Right side: Rotated Table + Pagination */}
            <Box display="flex" flexDirection="column" justifyContent="center" flexGrow={1}>
              <TableContainer>
                <Table size="small" sx={{ tableLayout: 'fixed' }}>
                  <TableBody>
                    {['date', 'player', 'rank', 'time'].map((key) => (
                      <TableRow key={key}>
                        <TableCell sx={{ width: '50px', ...noSelectStyle }}>
                          <HoverTranslation
                            traditionalText={labels[key].traditional}
                            cyrillicText={labels[key].hover}
                            language={language}
                            sx={{ fontSize: '1rem', fontWeight: 'bold' }}
                          />
                        </TableCell>

                        {currentItems.map((entry, i) => {
                          const rank = entry.rank === 0 ? 1 : entry.rank;

                          let cellContent;
                          if (key === 'date') {
                            cellContent = (
                              <HoverTranslation
                                traditionalText={convertToTraditionalMongolian(entry.date)}
                                cyrillicText={entry.date}
                                language={language}
                                sx={{ fontSize: '1rem' }}
                              />
                            );
                          } else if (key === 'player') {
                            cellContent = (
                              <Tooltip title={entry.player} placement="left">
                                <Box sx={{
                                  overflow: 'hidden',
                                  textOverflow: 'ellipsis',
                                  whiteSpace: 'nowrap',
                                  width: '100%'
                                }}>
                                  {entry.player}
                                </Box>
                              </Tooltip>
                            );
                          } else if (key === 'rank') {
                            let glow = 'none';
                            let style = {};
                            if (rank === 1) style = { backgroundColor: '#D4AF37', color: 'black' };
                            else if (rank === 2) style = { backgroundColor: '#C0C0C0', color: 'black' };
                            else if (rank === 3) style = { backgroundColor: '#CD7F32', color: 'white' };

                            cellContent = (
                              <Chip
                                label={rank}
                                size="small"
                                sx={{
                                  fontSize: '0.85rem',
                                  animation: rank <= 3 ? `${rank === 1 ? goldGlow : rank === 2 ? silverGlow : bronzeGlow} 2s infinite` : 'none',
                                  ...style
                                }}
                              />
                            );
                          } else if (key === 'time') {
                            cellContent = entry.time === null
                              ? <Chip icon={<EmojiEvents />} color="success" size="small" sx={{ fontSize: '0.85rem' }} />
                              : formatTime(timeToSeconds(entry.time));
                          }

                          return (
                            <TableCell key={`${key}-${i}`} sx={{ fontSize: '1rem', ...noSelectStyle }}>
                              {cellContent}
                            </TableCell>
                          );
                        })}
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
              {renderPagination()}
            </Box>
          </Box>
        ) : (
          <>
            {/* Modern layout */}
            <Box display="flex" alignItems="center" mb={2}>
              <EmojiEvents color="primary" sx={{ mr: 1 }} />
              <Typography variant="h6" component="h2" sx={{ fontSize: '1rem' }}>
                {labels.title.modern}
              </Typography>
            </Box>
            {renderModernTable()}
            {renderPagination()}
          </>
        )}
      </CardContent>
    </Card>
  );
}

export default RankingTable;