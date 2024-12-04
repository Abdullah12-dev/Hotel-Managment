import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Snackbar,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from '@mui/material';
import { fetchAllStaff, editStaff } from '../api'; // Adjust the import path as needed

const AssignRole = () => {
  const [staffList, setStaffList] = useState([]);
  const [error, setError] = useState('');

  const roles = ['Receptionist', 'Manager', 'Housekeeping'];

  useEffect(() => {
    const loadStaff = async () => {
      try {
        const response = await fetchAllStaff();
        if (response && response.data && response.data.staff) {
          setStaffList(response.data.staff);
        } else {
          throw new Error('Unexpected response format');
        }
      } catch (error) {
        setError(error.message || 'Failed to fetch staff data. Please try again.');
      }
    };

    loadStaff();
  }, []);

  const handleRoleChange = async (staffId, newRole) => {
    try {
      const updatedStaff = await editStaff(staffId, { role: newRole });
      setStaffList((prev) =>
        prev.map((staff) => (staff._id === staffId ? updatedStaff.data.staff : staff))
      );
    } catch (error) {
      setError(error.message || 'Failed to update staff role. Please try again.');
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Assign Role
      </Typography>

      {/* Responsive Table */}
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
              <TableCell>Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Phone Number</TableCell>
              <TableCell>Role</TableCell>
              <TableCell align="right">Change Role</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {staffList.map((staff) => (
              <TableRow key={staff._id}>
                <TableCell>{staff.name}</TableCell>
                <TableCell>{staff.email}</TableCell>
                <TableCell>{staff.phoneNumber}</TableCell>
                <TableCell>{staff.role}</TableCell>
                <TableCell align="right">
                  <FormControl
                    variant="outlined"
                    size="small"
                    sx={{ minWidth: 160 }}
                    align="left"
                  >
                    <InputLabel>Role</InputLabel>
                    <Select
                      value={staff.role}
                      onChange={(e) => handleRoleChange(staff._id, e.target.value)}
                      label="Role"
                      MenuProps={{
                        PaperProps: {
                          style: { maxHeight: 200, width: 150 },
                        },
                      }}
                    >
                      {roles.map((role) => (
                        <MenuItem key={role} value={role}>
                          {role}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Mobile View for Staff List */}
      <Box sx={{ display: { xs: 'block', md: 'none' }, mt: 3 }}>
        {staffList.map((staff) => (
          <Paper key={staff._id} sx={{ p: 2, mb: 2 }}>
            <Typography variant="h6">{staff.name}</Typography>
            <Typography>Email: {staff.email}</Typography>
            <Typography>Phone: {staff.phoneNumber}</Typography>
            <Typography>Role: {staff.role}</Typography>
            <FormControl
              variant="outlined"
              size="small"
              sx={{ mt: 2, minWidth: 150 }}
            >
              <InputLabel>Role</InputLabel>
              <Select
                value={staff.role}
                onChange={(e) => handleRoleChange(staff._id, e.target.value)}
                label="Role"
                MenuProps={{
                  PaperProps: {
                    style: { maxHeight: 200, width: 150 },
                  },
                }}
              >
                {roles.map((role) => (
                  <MenuItem key={role} value={role}>
                    {role}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
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

export default AssignRole;
