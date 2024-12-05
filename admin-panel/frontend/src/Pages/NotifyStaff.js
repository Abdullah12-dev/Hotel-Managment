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
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  CircularProgress,
  Card,
  CardContent,
} from '@mui/material';
import { fetchAllStaff, sendNotification } from '../api'; // Add `sendNotification` function to API

const NotifyStaff = () => {
  const [staffList, setStaffList] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedStaff, setSelectedStaff] = useState(null);
  const [notification, setNotification] = useState({ subject: '', message: '' });

  useEffect(() => {
    const loadStaff = async () => {
      setLoading(true);
      try {
        const response = await fetchAllStaff();
        if (response && response.data && response.data.staff) {
          setStaffList(response.data.staff);
        } else {
          throw new Error('Unexpected response format');
        }
      } catch (error) {
        setError(error.message || 'Failed to fetch staff data. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    loadStaff();
  }, []);

  const handleOpenDialog = (staff) => {
    setSelectedStaff(staff);
    setNotification({ subject: '', message: '' });
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setSelectedStaff(null);
  };

  const handleSendNotification = async () => {
    if (!selectedStaff || !notification.subject || !notification.message) {
      setError('Please fill in all fields before sending the notification.');
      return;
    }

    setLoading(true);
    try {
      await sendNotification({
        staffId: selectedStaff._id,
        email: selectedStaff.email,
        phoneNumber: selectedStaff.phoneNumber,
        subject: notification.subject,
        message: notification.message,
      });
      setError('Notification sent successfully!');
    } catch (error) {
      setError(error.message || 'Failed to send notification. Please try again.');
    } finally {
      setLoading(false);
      handleCloseDialog();
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Notify Staff
      </Typography>

      {loading && (
        <Box textAlign="center">
          <CircularProgress />
        </Box>
      )}

      {/* Table View for Larger Screens */}
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
                textAlign: 'center',
              },
            }}
          >
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Phone Number</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {staffList.map((staff) => (
              <TableRow key={staff._id}>
                <TableCell>{staff.name}</TableCell>
                <TableCell>{staff.email}</TableCell>
                <TableCell>{staff.phoneNumber}</TableCell>
                <TableCell align="right">
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => handleOpenDialog(staff)}
                  >
                    Notify
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Card View for Mobile Devices */}
      <Box sx={{ display: { xs: 'block', md: 'none' }, mt: 3 }}>
        {staffList.map((staff) => (
          <Card key={staff._id} sx={{ mb: 2, boxShadow: 3 }}>
            <CardContent>
              <Typography variant="h6">{staff.name}</Typography>
              <Typography>Email: {staff.email}</Typography>
              <Typography>Phone: {staff.phoneNumber}</Typography>
              <Box textAlign="right" sx={{ mt: 2 }}>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => handleOpenDialog(staff)}
                >
                  Notify
                </Button>
              </Box>
            </CardContent>
          </Card>
        ))}
      </Box>

      {/* Dialog for Sending Notifications */}
      <Dialog open={dialogOpen} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>Send Notification</DialogTitle>
        <DialogContent>
          <Typography variant="subtitle1" gutterBottom>
            To: {selectedStaff?.name} ({selectedStaff?.email})
          </Typography>
          <TextField
            label="Subject"
            fullWidth
            variant="outlined"
            sx={{ mb: 2 }}
            value={notification.subject}
            onChange={(e) => setNotification((prev) => ({ ...prev, subject: e.target.value }))}
          />
          <TextField
            label="Message"
            fullWidth
            variant="outlined"
            multiline
            rows={4}
            value={notification.message}
            onChange={(e) => setNotification((prev) => ({ ...prev, message: e.target.value }))}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="secondary">
            Cancel
          </Button>
          <Button
            onClick={handleSendNotification}
            color="primary"
            variant="contained"
            disabled={loading}
          >
            {loading ? 'Sending...' : 'Send'}
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

export default NotifyStaff;
