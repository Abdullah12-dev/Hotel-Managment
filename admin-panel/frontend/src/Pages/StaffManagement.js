import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Snackbar,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from '@mui/material';
import { Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { addStaff, editStaff, deleteStaff, fetchAllStaff } from '../api'; // Adjust the import path as needed

const StaffManagement = () => {
  const [staffList, setStaffList] = useState([]);
  const [filteredStaffList, setFilteredStaffList] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortConfig, setSortConfig] = useState({ field: '', direction: '' });
  const [newStaff, setNewStaff] = useState({ name: '', email: '', phoneNumber: '', role: '' });
  const [openDialog, setOpenDialog] = useState(false);
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
      Object.values(staff)
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

  const handleSaveStaff = async () => {
    try {
      if (editingStaff) {
        const updatedStaff = await editStaff(editingStaff._id, newStaff);
        setStaffList((prev) =>
          prev.map((staff) => (staff._id === editingStaff._id ? updatedStaff.data.staff : staff))
        );
      } else {
        const addedStaff = await addStaff(newStaff);
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

  return (
    <Box sx={{ p: 3 }}>
    <Box sx={{ textAlign: 'center', mb: 3 }}>
        <Typography variant="h4" gutterBottom>
        Staff Management
        </Typography>
      </Box>

      {/* Search Bar*/}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center', // Centers the search bar
          mb: 3,
        }}
      >
        <TextField
          variant="outlined"
          label="Search"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          sx={{
            width: '100%', // Makes it responsive
            maxWidth: 400, // Sets a decent width
            '& .MuiOutlinedInput-root': {
              borderRadius: '50px', // Adds rounded corners
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
            <MenuItem value="name">Name</MenuItem>
            <MenuItem value="email">Email</MenuItem>
            <MenuItem value="phoneNumber">Phone Number</MenuItem>
            <MenuItem value="role">Role</MenuItem>
          </Select>
        </FormControl>
      </Box>

        <TableContainer
          component={Paper}
          elevation={2}
          sx={{
            display: { xs: 'none', md: 'block' },
            overflowX: 'auto',
            borderRadius: '12px', // Adds rounded corners
            boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)', // Subtle shadow for better UI
          }}
        >
          <Table>
            <TableHead
              sx={{
                backgroundColor: '#333', // Dark header background
                '& th': {
                  color: '#fff', // White text color
                  fontWeight: 'bold', // Make the text bold
                  textAlign:'center'
                },
              }}
            >
            <TableRow>
              <TableCell>
                <Button onClick={() => handleSortChange('name')}  sx={{ color: '#fff' }}>Name</Button>
              </TableCell>
              <TableCell>
                <Button onClick={() => handleSortChange('email')} sx={{ color: '#fff' }}>Email</Button>
              </TableCell>
              <TableCell>
                <Button onClick={() => handleSortChange('phoneNumber')} sx={{ color: '#fff' }}>Phone Number</Button>
              </TableCell>
              <TableCell>
                <Button onClick={() => handleSortChange('role')}  sx={{ color: '#fff' }} >Role</Button>
              </TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredStaffList.map((staff) => (
              <TableRow key={staff._id}>
                <TableCell>{staff.name}</TableCell>
                <TableCell>{staff.email}</TableCell>
                <TableCell>{staff.phoneNumber}</TableCell>
                <TableCell>{staff.role}</TableCell>
                <TableCell align="right">
                  <IconButton color="primary" onClick={() => handleOpenDialog(staff)}>
                    <EditIcon />
                  </IconButton>
                  <IconButton color="error" onClick={() => handleDeleteStaff(staff._id)}>
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2, mb:2 }}>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={() => handleOpenDialog()}
        >
          Add New Staff
        </Button>
      </Box>
      {/* Mobile View for Staff List */}
      <Box sx={{ display: { xs: 'block', md: 'none' }, mt: 3 }}>
        {filteredStaffList.map((staff) => (
          <Paper key={staff._id} sx={{ p: 2, mb: 2 }}>
            <Typography variant="h6">{staff.name}</Typography>
            <Typography>Email: {staff.email}</Typography>
            <Typography>Phone: {staff.phoneNumber}</Typography>
            <Typography>Role: {staff.role}</Typography>
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1, mt: 2 }}>
              <IconButton color="primary" onClick={() => handleOpenDialog(staff)}>
                <EditIcon />
              </IconButton>
              <IconButton color="error" onClick={() => handleDeleteStaff(staff._id)}>
                <DeleteIcon />
              </IconButton>
            </Box>
          </Paper>
        ))}
      </Box>

      {/* Staff Add/Edit Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>{editingStaff ? 'Edit Staff Member' : 'Add New Staff Member'}</DialogTitle>
        <DialogContent>
          <Box component="form" sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField
              fullWidth
              label="Name"
              variant="outlined"
              value={newStaff.name}
              onChange={(e) => setNewStaff((prev) => ({ ...prev, name: e.target.value }))}
            />
            <TextField
              fullWidth
              label="Email"
              variant="outlined"
              value={newStaff.email}
              onChange={(e) => setNewStaff((prev) => ({ ...prev, email: e.target.value }))}
            />
            <TextField
              fullWidth
              label="Phone Number"
              variant="outlined"
              value={newStaff.phoneNumber}
              onChange={(e) => setNewStaff((prev) => ({ ...prev, phoneNumber: e.target.value }))}
            />
            <FormControl fullWidth variant="outlined">
              <InputLabel>Role</InputLabel>
              <Select
                value={newStaff.role}
                onChange={(e) => setNewStaff((prev) => ({ ...prev, role: e.target.value }))}
                label="Role"
              >
                {roles.map((role) => (
                  <MenuItem key={role} value={role}>
                    {role}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="secondary">
            Cancel
          </Button>
          <Button onClick={handleSaveStaff} color="primary" variant="contained">
            Save
          </Button>
        </DialogActions>
      </Dialog>

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

export default StaffManagement;
