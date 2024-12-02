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
} from '@mui/material';
import Grid from '@mui/material/Grid2';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
} from '@mui/icons-material';
import {
  addStaff,
  editStaff,
  deleteStaff,
  fetchAllStaff,
} from '../api'; // Adjust the import path as needed

const StaffManagement = () => {
  const [staffList, setStaffList] = useState([]);
  const [newStaff, setNewStaff] = useState({ name: '', email: '', position: '' });
  const [openDialog, setOpenDialog] = useState(false);
  const [editingStaff, setEditingStaff] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadStaff = async () => {
      try {
        const response = await fetchAllStaff();
        console.log('Full Response:', response); // Debugging output
        
        // Handle nested data structure
        if (
          response &&
          response.data &&
          response.data.staff &&
          Array.isArray(response.data.staff)
        ) {
          setStaffList(response.data.staff); // Extract the staff array
        } else {
          throw new Error('Unexpected response format: ' + JSON.stringify(response));
        }
      } catch (error) {
        console.error('Error loading staff:', error.message);
        setError('Failed to fetch staff data. Please try again.');
      }
    };
  
    loadStaff();
  }, []);
  
  

  const handleOpenDialog = (staff = null) => {
    setEditingStaff(staff);
    setNewStaff(staff ? { ...staff } : { name: '', email: '', position: '' });
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
        // Edit existing staff
        const updatedStaff = await editStaff(editingStaff.id, newStaff);
        setStaffList(staffList.map(staff => 
          staff.id === editingStaff.id ? updatedStaff.data : staff
        ));
      } else {
        // Add new staff
        const addedStaff = await addStaff(newStaff);
        setStaffList([...staffList, addedStaff.data]);
      }
      handleCloseDialog();
    } catch (error) {
      setError('Failed to save staff data. Please try again.');
    }
  };

  const handleDeleteStaff = async (id) => {
    try {
      await deleteStaff(id);
      setStaffList(staffList.filter((staff) => staff._id !== id));
    } catch (error) {
      setError('Failed to delete staff member. Please try again.');
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Staff Management
      </Typography>

      <Box sx={{ mb: 3 }}>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={() => handleOpenDialog()}
        >
          Add New Staff
        </Button>
      </Box>

      <TableContainer component={Paper} elevation={2}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Position</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {Array.isArray(staffList) && staffList.map((staff) => (
                <TableRow key={staff.id}>
                <TableCell>{staff.name}</TableCell>
                <TableCell>{staff.email}</TableCell>
                <TableCell>{staff.position}</TableCell>
                <TableCell align="right">
                    <IconButton
                    color="primary"
                    onClick={() => handleOpenDialog(staff)}
                    >
                    <EditIcon />
                    </IconButton>
                    <IconButton
                    color="error"
                    onClick={() => handleDeleteStaff(staff._id)}
                    >
                    <DeleteIcon />
                    </IconButton>
                </TableCell>
                </TableRow>
            ))}
            </TableBody>

        </Table>
      </TableContainer>

      {/* Staff Add/Edit Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>
          {editingStaff ? 'Edit Staff Member' : 'Add New Staff Member'}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Name"
                variant="outlined"
                value={newStaff.name}
                onChange={(e) => setNewStaff((prev) => ({ ...prev, name: e.target.value }))}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Email"
                variant="outlined"
                value={newStaff.email}
                onChange={(e) => setNewStaff((prev) => ({ ...prev, email: e.target.value }))}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Position"
                variant="outlined"
                value={newStaff.position}
                onChange={(e) => setNewStaff((prev) => ({ ...prev, position: e.target.value }))}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="secondary">
            Cancel
          </Button>
          <Button
            onClick={handleSaveStaff}
            color="primary"
            variant="contained"
          >
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
