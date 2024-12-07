import React, { useState, useEffect } from 'react';
import { Box, Typography, Snackbar } from '@mui/material';
import { fetchBookingDetails } from '../api';
import SearchBar from './components/SearchBar';
import SortControl from './components/SortControl';
import GenericTable from './components/GenericTable';
import CardView from './components/CardView';
import GenerateReportButton from './components/GenerateReportButton';

// Utility function to safely get nested values
const getNestedValue = (obj, path) => {
  return path.split('.').reduce((acc, part) => acc && acc[part], obj);
};

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
        const aField = getNestedValue(a, sortConfig.field);
        const bField = getNestedValue(b, sortConfig.field);
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
    { label: 'Guest Name', accessor: 'guest.name' },
    { label: 'Room Number', accessor: 'room.roomNumber' },
    { label: 'Total Amount', accessor: 'totalAmount' },
    { label: 'Check-In Date', accessor: 'checkInDate' },
    { label: 'Check-Out Date', accessor: 'checkOutDate' },
    { label: 'Status', accessor: 'status' },
  ];

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ textAlign: 'center', mb: 3 }}>
        <Typography variant="h4" gutterBottom>
          Booking History
        </Typography>
      </Box>

      <SearchBar value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />

      <SortControl
        value={sortConfig.field}
        onChange={handleSortChange}
        fields={['guest.name', 'room.roomNumber', 'totalAmount', 'checkInDate']}
      />

      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2, mb: 2 }}>
        <GenerateReportButton
          data={filteredBookingList}
          columns={columns}
          title="Booking History Report"
        />
      </Box>

      {/* Table View */}
      <GenericTable
        data={filteredBookingList}
        columns={columns}
        onSort={handleSortChange}
        sortConfig={sortConfig}
      />

      {/* Card View */}
      <CardView
        data={filteredBookingList}
        fields={[
          { name: 'guest.name', label: 'Guest Name' },
          { name: 'room.roomNumber', label: 'Room Number' },
          { name: 'totalAmount', label: 'Total Amount' },
          { name: 'checkInDate', label: 'Check-In Date' },
          { name: 'status', label: 'Status' },
        ]}
      />

      {/* Error Snackbar */}
      <Snackbar open={Boolean(error)} message={error} autoHideDuration={6000} onClose={() => setError('')} />
    </Box>
  );
};

export default BookingHistory;


