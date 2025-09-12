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
import { CalendarToday, FirstPage, LastPage, NavigateBefore, NavigateNext } from '@mui/icons-material';
import { ThemeContext } from '../App';

function DailySummary({ summary }) {
  const { darkMode } = useContext(ThemeContext);
  const [page, setPage] = useState(0);
  const rowsPerPage = 10;

  const sortedSummary = [...summary].sort((a, b) => new Date(b.date) - new Date(a.date));

  const totalPages = Math.ceil(sortedSummary.length / rowsPerPage);
  const currentItems = sortedSummary.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

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
          <CalendarToday color="primary" sx={{ mr: 1 }} />
          <Typography variant="h6" component="h2" sx={{ fontSize: '1rem' }}>
            Өдөр тутмын хураангуй
          </Typography>
        </Box>
        <TableContainer>
          <Table size="small" sx={{ tableLayout: 'fixed' }}>
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: 'bold', py: 1, width: '40%', fontSize: '0.75rem', ...noSelectStyle }}>Огноо</TableCell>
                <TableCell sx={{ fontWeight: 'bold', py: 1, width: '60%', fontSize: '0.75rem', ...noSelectStyle }}>Ялагч</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {currentItems.map((day, i) => (
                <TableRow key={i} hover>
                  <TableCell sx={{ py: 1, fontSize: '0.75rem', ...noSelectStyle }}>{day.date}</TableCell>
                  <TableCell sx={{ py: 1, ...noSelectStyle }}>
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

export default DailySummary;