import React, { useState, useEffect } from 'react';
import { Box, Typography, Button, Snackbar, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
import { addStaff, editStaff, deleteStaff, fetchAllStaff,getPerformanceMetrics } from '../api';
import GenericTable from './components/GenericTable'; // Generic Table Component
import GenericDialog from './components/GenericDialog'; // Generic Dialog Component
import SearchBar from './components/SearchBar'; // SearchBar Component
import SortControl from './components/SortControl'; // Sort Control Component
import GenerateReportButton from './components/GenerateReportButton'; // Report Button Component
import CardView from './components/CardView'; // Card View Component

const StaffManagement = () => {
  const [staffList, setStaffList] = useState([]);
  const [filteredStaffList, setFilteredStaffList] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortConfig, setSortConfig] = useState({ field: '', direction: '' });
  const [newStaff, setNewStaff] = useState({ name: '', email: '', phoneNumber: '', role: '' });
  const [openDialog, setOpenDialog] = useState(false);
  const [viewMetricsDialog, setViewMetricsDialog] = useState(false);
  const [performanceMetrics, setPerformanceMetrics] = useState(null);
  const [editingStaff, setEditingStaff] = useState(null);
  const [error, setError] = useState('');

  const roles = ['Receptionist', 'Manager', 'Housekeeping'];

  useEffect(() => {
    const loadStaff = async () => {
      try {
        const response = await fetchAllStaff();
        if (response && response.data && response.data.staff) {
          setStaffList(response.data.staff);
          setFilteredStaffList(response.data.staff); // Initialize filtered list
        } else {
          throw new Error('Unexpected response format');
        }
      } catch (error) {
        setError(error.message || 'Failed to fetch staff data. Please try again.');
      }
    };
    loadStaff();
  }, []);

  useEffect(() => {
    let updatedList = staffList.filter((staff) =>
      Object.values(staff).join(' ').toLowerCase().includes(searchQuery.toLowerCase())
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

    setFilteredStaffList(updatedList);
  }, [staffList, searchQuery, sortConfig]);

  const handleOpenDialog = (staff = null) => {
    setEditingStaff(staff);
    setNewStaff(staff ? { ...staff } : { name: '', email: '', phoneNumber: '', role: '' });
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingStaff(null);
    setError('');
  };

  const handleSaveStaff = async (staffData) => {
    try {
      if (editingStaff) {
        const updatedStaff = await editStaff(editingStaff._id, staffData);
        setStaffList((prev) =>
          prev.map((staff) => (staff._id === editingStaff._id ? updatedStaff.data.staff : staff))
        );
      } else {
        const addedStaff = await addStaff(staffData);
        setStaffList((prev) => [...prev, addedStaff.data.staff]);
      }
      handleCloseDialog();
    } catch (error) {
      setError(error.message || 'Failed to save staff data. Please try again.');
    }
  };

  const handleDeleteStaff = async (id) => {
    try {
      await deleteStaff(id);
      setStaffList((prev) => prev.filter((staff) => staff._id !== id));
    } catch (error) {
      setError(error.message || 'Failed to delete staff member. Please try again.');
    }
  };

  const handleSortChange = (field) => {
    setSortConfig((prev) => ({
      field,
      direction: prev.field === field && prev.direction === 'asc' ? 'desc' : 'asc',
    }));
  };

  const handleViewPerformance = async (staffId) => {
    try {
      const response = await getPerformanceMetrics(staffId);
      setPerformanceMetrics(response.data.performanceMetrics);
      setViewMetricsDialog(true);
    } catch (error) {
      setError(error.message || 'Failed to fetch performance metrics. Please try again.');
    }
  };
  
  const staffColumns = [
    { label: 'Name', accessor: 'name' },
    { label: 'Email', accessor: 'email' },
    { label: 'Phone Number', accessor: 'phoneNumber' },
    { label: 'Role', accessor: 'role' },
  ];

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ textAlign: 'center', mb: 3 }}>
        <Typography variant="h4" gutterBottom>
          Staff Management
        </Typography>
      </Box>

      {/* Search Bar */}
      <SearchBar value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />

      {/* Sort Control */}
      <SortControl value={sortConfig.field} onChange={handleSortChange} fields={['name', 'email', 'phoneNumber', 'role']} />

      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2, mb: 2 }}>
        <GenerateReportButton data={filteredStaffList} columns={staffColumns} title="Staff Report" />
      </Box>

      {/* Table View */}
      <GenericTable
        data={filteredStaffList}
        columns={staffColumns}
        onEdit={handleOpenDialog}
        onDelete={handleDeleteStaff}
        onView={handleViewPerformance}
        onSort={handleSortChange}
        sortConfig={sortConfig}
      />

      {/* Card View (Mobile and Tablet) */}
      <CardView
        data={filteredStaffList}
        onEdit={handleOpenDialog}
        onView={handleViewPerformance}
        onDelete={handleDeleteStaff}
        fields={[
          { name: 'name', label: 'Name' },
          { name: 'email', label: 'Email' },
          { name: 'phoneNumber', label: 'Phone Number' },
          { name: 'role', label: 'Role' },
        ]}
      />

      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2, mb: 2 }}>
        <Button variant="contained" color="primary" startIcon={<AddIcon />} onClick={() => handleOpenDialog()}>
          Add New Staff
        </Button>
      </Box>

      {/* Add/Edit Staff Dialog */}
      <GenericDialog
        open={openDialog}
        onClose={handleCloseDialog}
        data={newStaff}
        onSave={handleSaveStaff}
        fields={[
          { name: 'name', label: 'Name' },
          { name: 'email', label: 'Email' },
          { name: 'phoneNumber', label: 'Phone Number' },
          { name: 'role', label: 'Role', type: 'select', options: roles },
        ]}
        title={editingStaff ? 'Edit Staff' : 'Add Staff'}
      />
        {/* View Performance Metrics Dialog */}
        <Dialog open={viewMetricsDialog} onClose={() => setViewMetricsDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Performance Metrics</DialogTitle>
        <DialogContent>
          {performanceMetrics ? (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Typography>Completed Tasks: {performanceMetrics.completedTasks}</Typography>
              <Typography>Customer Ratings: {performanceMetrics.customerRatings}</Typography>
            </Box>
          ) : (
            <Typography>Loading...</Typography>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setViewMetricsDialog(false)} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
      <Snackbar open={Boolean(error)} message={error} autoHideDuration={6000} onClose={() => setError('')} />
    </Box>
  );
};

export default StaffManagement;
