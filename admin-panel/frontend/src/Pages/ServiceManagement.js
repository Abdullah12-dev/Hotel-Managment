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
import { addService, editService, deleteService, fetchAllServices } from '../api'; // Adjust the import path as needed
import GenerateReportButton from './GenerateReportButton';

const ServiceManagement = () => {
  const [serviceList, setServiceList] = useState([]);
  const [filteredServiceList, setFilteredServiceList] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortConfig, setSortConfig] = useState({ field: '', direction: '' });
  const [newService, setNewService] = useState({
    name: '',
    description: '',
    price: '',
    status: 'Active',
  });
  const [openDialog, setOpenDialog] = useState(false);
  const [editingService, setEditingService] = useState(null);
  const [error, setError] = useState('');

  const statuses = ['Active', 'Inactive'];

  useEffect(() => {
    const loadServices = async () => {
      try {
        const response = await fetchAllServices();
        if (response && response.data && response.data.services) {
          setServiceList(response.data.services);
          setFilteredServiceList(response.data.services); // Initialize filtered list
        } else {
          throw new Error('Unexpected response format');
        }
      } catch (error) {
        setError(error.message || 'Failed to fetch services. Please try again.');
      }
    };
    loadServices();
  }, []);

  useEffect(() => {
    let updatedList = serviceList.filter((service) =>
      Object.values(service)
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

    setFilteredServiceList(updatedList);
  }, [serviceList, searchQuery, sortConfig]);

  const handleOpenDialog = (service = null) => {
    setEditingService(service);
    setNewService(service ? { ...service } : { name: '', description: '', price: '', status: 'Active' });
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingService(null);
    setError('');
  };

  const handleSaveService = async () => {
    try {
      if (editingService) {
        const updatedService = await editService(editingService._id, newService);
        setServiceList((prev) =>
          prev.map((service) => (service._id === editingService._id ? updatedService.data.service : service))
        );
      } else {
        const addedService = await addService(newService);
        setServiceList((prev) => [...prev, addedService.data.service]);
      }
      handleCloseDialog();
    } catch (error) {
      setError(error.message || 'Failed to save service data. Please try again.');
    }
  };

  const handleDeleteService = async (id) => {
    try {
      await deleteService(id);
      setServiceList((prev) => prev.filter((service) => service._id !== id));
    } catch (error) {
      setError(error.message || 'Failed to delete service. Please try again.');
    }
  };

  const handleSortChange = (field) => {
    setSortConfig((prev) => ({
      field,
      direction: prev.field === field && prev.direction === 'asc' ? 'desc' : 'asc',
    }));
  };

  const serviceColumns = [
    { label: 'Name', accessor: (row) => row.name },
    { label: 'Description', accessor: (row) => row.description || 'N/A' },
    { label: 'Price', accessor: (row) => `$${row.price}` },
    { label: 'Status', accessor: (row) => row.status },
  ];
  
  return (
    <Box sx={{ p: 3 }}>
    <Box sx={{ textAlign: 'center', mb: 3 }}>
        <Typography variant="h4" gutterBottom>
        Service Management
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
            <MenuItem value="price">Price</MenuItem>
            <MenuItem value="status">Status</MenuItem>
          </Select>
        </FormControl>
      </Box>

      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2, mb:2 }}>
        <GenerateReportButton
            data={filteredServiceList}
            columns={serviceColumns}
            title="Services Report"
          />
      </Box>

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
              <TableCell>
                <Button onClick={() => handleSortChange('name')} sx={{ color: '#fff' }}>
                  Name
                </Button>
              </TableCell>
              <TableCell>Description</TableCell>
              <TableCell>
                <Button onClick={() => handleSortChange('price')} sx={{ color: '#fff' }}>
                  Price
                </Button>
              </TableCell>
              <TableCell>
                <Button onClick={() => handleSortChange('status')} sx={{ color: '#fff' }}>
                  Status
                </Button>
              </TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredServiceList.map((service) => (
              <TableRow
                key={service._id}
                sx={{
                  '&:hover': {
                    backgroundColor: '#f5f5f5', // Add hover effect
                  },
                }}
              >
                <TableCell>{service.name}</TableCell>
                <TableCell>{service.description}</TableCell>
                <TableCell>{service.price}</TableCell>
                <TableCell>{service.status}</TableCell>
                <TableCell align="right">
                  <IconButton color="primary" onClick={() => handleOpenDialog(service)}>
                    <EditIcon />
                  </IconButton>
                  <IconButton color="error" onClick={() => handleDeleteService(service._id)}>
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
          Add New Service
        </Button>
      </Box>

      {/* Mobile View for Service List */}
      <Box sx={{ display: { xs: 'block', md: 'none' }, mt: 3 }}>
        {filteredServiceList.map((service) => (
          <Paper key={service._id} sx={{ p: 2, mb: 2 }}>
            <Typography variant="h6">{service.name}</Typography>
            <Typography>Description: {service.description}</Typography>
            <Typography>Price: ${service.price}</Typography>
            <Typography>Status: {service.status}</Typography>
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1, mt: 2 }}>
              <IconButton color="primary" onClick={() => handleOpenDialog(service)}>
                <EditIcon />
              </IconButton>
              <IconButton color="error" onClick={() => handleDeleteService(service._id)}>
                <DeleteIcon />
              </IconButton>
            </Box>
          </Paper>
        ))}
      </Box>

      {/* Service Add/Edit Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>{editingService ? 'Edit Service' : 'Add New Service'}</DialogTitle>
        <DialogContent>
          <Box component="form" sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
            <TextField
              fullWidth
              label="Name"
              variant="outlined"
              value={newService.name}
              onChange={(e) => setNewService((prev) => ({ ...prev, name: e.target.value }))}
            />
            <TextField
              fullWidth
              label="Description"
              variant="outlined"
              multiline
              rows={3}
              value={newService.description}
              onChange={(e) => setNewService((prev) => ({ ...prev, description: e.target.value }))}
            />
            <TextField
              fullWidth
              label="Price"
              variant="outlined"
              type="number"
              value={newService.price}
              onChange={(e) => setNewService((prev) => ({ ...prev, price: e.target.value }))}
            />
            <FormControl fullWidth variant="outlined">
              <InputLabel>Status</InputLabel>
              <Select
                value={newService.status}
                onChange={(e) => setNewService((prev) => ({ ...prev, status: e.target.value }))}
                label="Status"
              >
                {statuses.map((status) => (
                  <MenuItem key={status} value={status}>
                    {status}
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
          <Button onClick={handleSaveService} color="primary" variant="contained">
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

export default ServiceManagement;
