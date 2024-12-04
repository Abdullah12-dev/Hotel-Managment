import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Snackbar,
} from '@mui/material';
import GenerateReportButton from './GenerateReportButton';
import { fetchSystemLogs } from '../api'; // Ensure this API function is implemented to fetch logs from the backend.

const SystemLogs = () => {
  const [logList, setLogList] = useState([]);
  const [filteredLogList, setFilteredLogList] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortConfig, setSortConfig] = useState({ field: '', direction: '' });
  const [error, setError] = useState('');

  useEffect(() => {
    const loadLogs = async () => {
      try {
        const response = await fetchSystemLogs();
        if (response && response.data?.logs) {
          setLogList(response.data.logs);
          setFilteredLogList(response.data.logs); // Initialize filtered list
        } else {
          throw new Error('Unexpected response format');
        }
      } catch (error) {
        setError(error.message || 'Failed to fetch system logs. Please try again.');
      }
    };
    loadLogs();
  }, []);

  useEffect(() => {
    let updatedList = logList.filter((log) =>
      Object.values(log)
        .join(' ')
        .toLowerCase()
        .includes(searchQuery.toLowerCase())
    );

    if (sortConfig.field) {
      updatedList = updatedList.sort((a, b) => {
        const aField = sortConfig.field === 'user' ? a.user?.name : a[sortConfig.field];
        const bField = sortConfig.field === 'user' ? b.user?.name : b[sortConfig.field];
        if (sortConfig.direction === 'asc') {
          return aField > bField ? 1 : -1;
        } else {
          return aField < bField ? 1 : -1;
        }
      });
    }

    setFilteredLogList(updatedList);
  }, [logList, searchQuery, sortConfig]);

  const handleSortChange = (field) => {
    setSortConfig((prev) => ({
      field,
      direction: prev.field === field && prev.direction === 'asc' ? 'desc' : 'asc',
    }));
  };

  const columns = [
    { label: 'User Name', accessor: (row) => row.user?.name || 'N/A' },
    { label: 'User Email', accessor: (row) => row.user?.email || 'N/A' },
    { label: 'Action', accessor: (row) => row.action || 'N/A' },
    { label: 'Timestamp', accessor: (row) => new Date(row.timestamp).toLocaleString() },
  ];

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ textAlign: 'center', mb: 3 }}>
        <Typography variant="h4" gutterBottom>
          System Logs
        </Typography>
      </Box>

      {/* Search Bar */}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          mb: 3,
        }}
      >
        <TextField
          variant="outlined"
          label="Search"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          sx={{
            width: '100%',
            maxWidth: 400,
            '& .MuiOutlinedInput-root': {
              borderRadius: '50px',
            },
          }}
        />
      </Box>

      {/* Sorting Combo Box for Mobile */}
      <Box sx={{ display: { xs: 'block', md: 'none' }, mb: 2 }}>
        <FormControl fullWidth variant="outlined">
          <InputLabel>Sort By</InputLabel>
          <Select
            value={sortConfig.field}
            onChange={(e) => handleSortChange(e.target.value)}
            label="Sort By"
          >
            <MenuItem value="user">User Name</MenuItem>
            <MenuItem value="action">Action</MenuItem>
            <MenuItem value="timestamp">Timestamp</MenuItem>
          </Select>
        </FormControl>
      </Box>

      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2, mb: 2 }}>
        <GenerateReportButton
          data={filteredLogList}
          columns={columns}
          title="System Logs Report"
        />
      </Box>

      {/* Responsive Table */}
      <TableContainer
        component={Paper}
        elevation={2}
        sx={{
          display: { xs: 'none', md: 'block' },
          overflowX: 'auto',
          borderRadius: '12px',
          boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)',
        }}
      >
        <Table>
          <TableHead
            sx={{
              backgroundColor: '#333',
              '& th': {
                color: '#fff',
                fontWeight: 'bold',
              },
            }}
          >
            <TableRow>
              <TableCell>
                <Button onClick={() => handleSortChange('user')} sx={{ color: '#fff' }}>
                  User Name
                </Button>
              </TableCell>
              <TableCell>
                <Button onClick={() => handleSortChange('email')} sx={{ color: '#fff' }}>
                  Email
                </Button>
              </TableCell>
              <TableCell>
                <Button onClick={() => handleSortChange('action')} sx={{ color: '#fff' }}>
                  Action
                </Button>
              </TableCell>
              <TableCell>
                <Button onClick={() => handleSortChange('timestamp')} sx={{ color: '#fff' }}>
                  Timestamp
                </Button>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredLogList.map((log) => (
              <TableRow key={log._id}>
                <TableCell>{log.user?.name || 'N/A'}</TableCell>
                <TableCell>{log.user?.email || 'N/A'}</TableCell>
                <TableCell>{log.action || 'N/A'}</TableCell>
                <TableCell>{new Date(log.timestamp).toLocaleString()}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Mobile View for Logs */}
      <Box sx={{ display: { xs: 'block', md: 'none' }, mt: 3 }}>
        {filteredLogList.map((log) => (
          <Paper key={log._id} sx={{ p: 2, mb: 2 }}>
            <Typography variant="h6">User Name: {log.user?.name || 'N/A'}</Typography>
            <Typography>User Email: {log.user?.email || 'N/A'}</Typography>
            <Typography>Action: {log.action || 'N/A'}</Typography>
            <Typography>Timestamp: {new Date(log.timestamp).toLocaleString()}</Typography>
          </Paper>
        ))}
      </Box>

      {/* Error Snackbar */}
      <Snackbar
        open={Boolean(error)}
        message={error}
        autoHideDuration={6000}
        onClose={() => setError('')}
      />
    </Box>
  );
};

export default SystemLogs;
