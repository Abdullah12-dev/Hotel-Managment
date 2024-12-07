import React, { useState, useEffect } from 'react';
import { Box, Typography, Snackbar } from '@mui/material';
import { fetchSystemLogs } from '../api';
import GenericTable from './components/GenericTable'; // Generic Table Component
import SearchBar from './components/SearchBar';
import SortControl from './components/SortControl';
import GenerateReportButton from './components/GenerateReportButton';
import CardView from './components/CardView';

// Utility function to safely get nested values
const getNestedValue = (obj, path) => {
  return path.split('.').reduce((acc, part) => acc && acc[part], obj);
};

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
      Object.values(log).join(' ').toLowerCase().includes(searchQuery.toLowerCase())
    );

    // Sorting logic
    if (sortConfig.field) {
      updatedList = updatedList.sort((a, b) => {
        // Use getNestedValue for dynamic field access (for example, 'user.name')
        const aField = getNestedValue(a, sortConfig.field);
        const bField = getNestedValue(b, sortConfig.field);

        // If values are not defined, return 0 (no change in order)
        if (aField === undefined || bField === undefined) return 0;

        // String comparison for non-timestamp fields
        if (typeof aField === 'string' && typeof bField === 'string') {
          return sortConfig.direction === 'asc' ? aField.localeCompare(bField) : bField.localeCompare(aField);
        }

        // If the field is a timestamp, compare date values
        if (sortConfig.field === 'timestamp') {
          const aDate = new Date(aField);
          const bDate = new Date(bField);
          if (isNaN(aDate) || isNaN(bDate)) return 0; // Handle invalid dates
          return sortConfig.direction === 'asc' ? aDate - bDate : bDate - aDate;
        }

        // Default number comparison
        return sortConfig.direction === 'asc' ? aField - bField : bField - aField;
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

  const logColumns = [
    { label: 'User Name', accessor: 'user.name' }, // Use dot notation for nested fields
    { label: 'User Email', accessor: 'user.email' },
    { label: 'Action', accessor: 'action' },
    { label: 'Timestamp', accessor: 'timestamp' },
  ];


  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ textAlign: 'center', mb: 3 }}>
        <Typography variant="h4" gutterBottom>System Logs</Typography>
      </Box>

      <SearchBar value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
      <SortControl value={sortConfig.field} onChange={handleSortChange} fields={['user.name', 'action', 'timestamp']} />

      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2, mb: 2 }}>
        <GenerateReportButton
          data={filteredLogList}
          columns={logColumns}
          title="System Logs Report"
        />
      </Box>

      {/* Table View */}
      <GenericTable
        data={filteredLogList}
        columns={logColumns}
        onSort={handleSortChange}
        sortConfig={sortConfig}
      />

      {/* Card View */}
      <CardView
        data={filteredLogList}
        fields={[
          { name: 'user.name', label: 'User Name' },
          { name: 'user.email', label: 'User Email' },
          { name: 'action', label: 'Action' },
          { name: 'timestamp', label: 'Time Stamps' },
        ]}
      />

      <Snackbar open={Boolean(error)} message={error} autoHideDuration={6000} onClose={() => setError('')} />
    </Box>
  );
};

export default SystemLogs;
