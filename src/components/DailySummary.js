import React, { useState, useContext } from 'react';
import {
  Card,
  CardContent,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Box,
  Chip,
  IconButton,
  Tooltip
} from '@mui/material';
import {
  CalendarToday,
  FirstPage,
  LastPage,
  NavigateBefore,
  NavigateNext
} from '@mui/icons-material';
import { ThemeContext } from '../App';
import { convertToTraditionalMongolian } from '../utils/dateConversion';
import HoverTranslation from '../utils/HoverTranslation';

function DailySummary({ summary, language }) {
  const { darkMode } = useContext(ThemeContext);
  const [page, setPage] = useState(0);
  const rowsPerPage = 10;

  const sortedSummary = [...summary].sort((a, b) => new Date(b.date) - new Date(a.date));
  const totalPages = Math.ceil(sortedSummary.length / rowsPerPage);
  const currentItems = sortedSummary.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  const handleFirstPage = () => setPage(0);
  const handlePreviousPage = () => setPage(prev => Math.max(prev - 1, 0));
  const handleNextPage = () => setPage(prev => Math.min(prev + 1, totalPages - 1));
  const handleLastPage = () => setPage(totalPages - 1);

  const labels = {
    title: {
      modern: 'Өдөр тутмын хураангуй',
      traditional: 'ᠡᠳᠦᠷ ᠲᠤᠲᠤᠮ ᠤ᠋ᠨ ᠬᠤᠷᠢᠶᠠᠩᠭᠤᠢ',
      hover: 'Өдөр тутмын хураангуй'
    },
    date: {
      traditional: 'ᠣᠩᠨᠠᠭ᠎ᠠ',
      hover: 'Огноо'
    },
    winner: {
      traditional: 'ᠢᠯᠠᠭᠴᠢ',
      hover: 'Ялагч'
    }
  };

  const noSelectStyle = {
    userSelect: 'none',
    WebkitUserSelect: 'none',
    MozUserSelect: 'none',
    msUserSelect: 'none',
    WebkitTapHighlightColor: 'transparent'
  };

  const renderModernTable = () => (
    <TableContainer>
      <Table size="small" sx={{ tableLayout: 'fixed' }}>
        <TableBody>
          {currentItems.map((day, i) => (
            <TableRow key={i} hover>
              <TableCell sx={{ py: 1, fontSize: '0.75rem', width: '40%', ...noSelectStyle }}>
                <Tooltip title={day.date} placement="top-start">
                  <span>{day.date}</span>
                </Tooltip>
              </TableCell>
              <TableCell sx={{ py: 1, width: '60%', ...noSelectStyle }}>
                <Tooltip title={day.winner} placement="top-start">
                  <Chip
                    label={day.winner}
                    color="white"
                    variant="outlined"
                    size="small"
                    sx={{ fontSize: '0.7rem', maxWidth: '100%' }}
                  />
                </Tooltip>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );

  const renderTraditionalTable = () => (
    <TableContainer>
      <Table size="small" sx={{ tableLayout: 'fixed' }}>
        <TableBody>
          <TableRow>
            <TableCell sx={{ width: '50px', ...noSelectStyle }}>
              <HoverTranslation
                traditionalText={labels.date.traditional}
                cyrillicText={labels.date.hover}
                language={language}
                sx={{ fontSize: '1rem', fontWeight: 'bold' }}
              />
            </TableCell>
            {currentItems.map((day, i) => (
              <TableCell key={`date-${i}`} sx={{ fontSize: '1rem', ...noSelectStyle }}>
                <Tooltip title={day.date} placement="left">
                  <span>{convertToTraditionalMongolian(day.date)}</span>
                </Tooltip>
              </TableCell>
            ))}
          </TableRow>
          <TableRow>
            <TableCell sx={{ width: '50px', ...noSelectStyle }}>
              <HoverTranslation
                traditionalText={labels.winner.traditional}
                cyrillicText={labels.winner.hover}
                language={language}
                sx={{ fontSize: '1rem', fontWeight: 'bold' }}
              />
            </TableCell>
            {currentItems.map((day, i) => (
              <TableCell key={`winner-${i}`} sx={{ ...noSelectStyle }}>
                <Tooltip title={day.winner} placement="left">
                  <Chip
                    label={day.winner}
                    color="white"
                    variant="outlined"
                    size="small"
                    sx={{ fontSize: '0.85rem', maxWidth: '100%' }}
                  />
                </Tooltip>
              </TableCell>
            ))}
          </TableRow>
        </TableBody>
      </Table>
    </TableContainer>
  );

  const renderPagination = () => {
    const pageText =
      language === 'traditional'
        ? `${convertToTraditionalMongolian(String(page + 1))} / ${convertToTraditionalMongolian(String(totalPages))}`
        : `${page + 1} / ${totalPages}`;

    return (
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
  };

  return (
    <Card elevation={3} sx={{ height: '100%' }}>
      <CardContent>
        {language === 'traditional' ? (
          <Box display="flex" flexDirection="row" alignItems="stretch" gap={2}>
            {/* Left side: Icon + Vertical Title with hover */}
            <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center">
              <CalendarToday color="primary" sx={{ mb: 1 }} />
              <HoverTranslation
                traditionalText={labels.title.traditional}
                cyrillicText={labels.title.hover}
                language={language}
                sx={{ fontSize: '1.2rem', fontWeight: 'bold' }}
              />
            </Box>

            {/* Right side: Table + Pagination vertically centered */}
            <Box display="flex" flexDirection="column" justifyContent="center" flexGrow={1}>
              {renderTraditionalTable()}
              {renderPagination()}
            </Box>
          </Box>
        ) : (
          <>
            <Box display="flex" alignItems="center" mb={2}>
              <CalendarToday color="primary" sx={{ mr: 1 }} />
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

export default DailySummary;