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
import { fetchBookingDetails } from '../api'; // Ensure correct API path
import GenerateReportButton from './GenerateReportButton';

const BookingHistory = () => {
  const [bookingList, setBookingList] = useState([]);
  const [filteredBookingList, setFilteredBookingList] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortConfig, setSortConfig] = useState({ field: '', direction: '' });
  const [error, setError] = useState('');

  useEffect(() => {
    const loadBookings = async () => {
      try {
        const response = await fetchBookingDetails();
        if (response && response.data) {
          setBookingList(response.data);
          setFilteredBookingList(response.data); // Initialize filtered list
        } else {
          throw new Error('Unexpected response format');
        }
      } catch (error) {
        setError(error.message || 'Failed to fetch booking data. Please try again.');
      }
    };
    loadBookings();
  }, []);

  useEffect(() => {
    let updatedList = bookingList.filter((booking) =>
      Object.values(booking)
        .join(' ')
        .toLowerCase()
        .includes(searchQuery.toLowerCase())
    );

    if (sortConfig.field) {
      updatedList = updatedList.sort((a, b) => {
        const aField = a[sortConfig.field];
        const bField = b[sortConfig.field];
        if (sortConfig.direction === 'asc') {
          return aField > bField ? 1 : -1;
        } else {
          return aField < bField ? 1 : -1;
        }
      });
    }

    setFilteredBookingList(updatedList);
  }, [bookingList, searchQuery, sortConfig]);

  const handleSortChange = (field) => {
    setSortConfig((prev) => ({
      field,
      direction: prev.field === field && prev.direction === 'asc' ? 'desc' : 'asc',
    }));
  };

  const columns = [
    { label: 'Guest Name', accessor: (row) => row.guest?.name || 'N/A' },
    { label: 'Room Number', accessor: (row) => row.room?.roomNumber || 'N/A' },
    { label: 'Total Amount', accessor: (row) => `$${row.totalAmount}` },
    { label: 'Check-In Date', accessor: (row) => new Date(row.checkInDate).toLocaleDateString() },
    { label: 'Check-Out Date', accessor: (row) => new Date(row.checkOutDate).toLocaleDateString() },
    { label: 'Status', accessor: (row) => row.status },
  ];

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ textAlign: 'center', mb: 3 }}>
        <Typography variant="h4" gutterBottom>
          Booking History
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
            <MenuItem value="guest.name">Guest Name</MenuItem>
            <MenuItem value="room.roomNumber">Room Number</MenuItem>
            <MenuItem value="totalAmount">Total Amount</MenuItem>
            <MenuItem value="checkInDate">Check-In Date</MenuItem>
          </Select>
        </FormControl>
      </Box>

      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2, mb:2 }}>
        <GenerateReportButton
            data={filteredBookingList}
            columns={columns}
            title="Booking History Report"
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
                <Button onClick={() => handleSortChange('guest.name')} sx={{ color: '#fff' }}>
                  Guest Name
                </Button>
              </TableCell>
              <TableCell>
                <Button onClick={() => handleSortChange('room.roomNumber')} sx={{ color: '#fff' }}>
                  Room Number
                </Button>
              </TableCell>
              <TableCell>
                <Button onClick={() => handleSortChange('totalAmount')} sx={{ color: '#fff' }}>
                  Total Amount
                </Button>
              </TableCell>
              <TableCell>
                <Button onClick={() => handleSortChange('checkInDate')} sx={{ color: '#fff' }}>
                  Check-In Date
                </Button>
              </TableCell>
              <TableCell>
                <Button onClick={() => handleSortChange('checkOutDate')} sx={{ color: '#fff' }}>
                  Check-In Date
                </Button>
              </TableCell>
              <TableCell>Status</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredBookingList.map((booking) => (
              <TableRow key={booking._id}>
                <TableCell>{booking.guest?.name || 'N/A'}</TableCell>
                <TableCell>{booking.room?.roomNumber || 'N/A'}</TableCell>
                <TableCell>${booking.totalAmount}</TableCell>
                <TableCell>{new Date(booking.checkInDate).toLocaleDateString()}</TableCell>
                <TableCell>{new Date(booking.checkOutDate).toLocaleDateString()}</TableCell>
                <TableCell>{booking.status}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Mobile View for Booking List */}
      <Box sx={{ display: { xs: 'block', md: 'none' }, mt: 3 }}>
        {filteredBookingList.map((booking) => (
          <Paper key={booking._id} sx={{ p: 2, mb: 2 }}>
            <Typography variant="h6">{booking.guest?.name || 'N/A'}</Typography>
            <Typography>Room: {booking.room?.roomNumber || 'N/A'}</Typography>
            <Typography>Amount: ${booking.totalAmount}</Typography>
            <Typography>
              Check-In: {new Date(booking.checkInDate).toLocaleDateString()}
            </Typography>
            <Typography>Status: {booking.status}</Typography>
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

export default BookingHistory;
