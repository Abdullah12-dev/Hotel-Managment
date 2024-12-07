import React, { useState, useEffect } from 'react';
import { Box, Typography, Button, Snackbar } from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
import { addService, editService, deleteService, fetchAllServices } from '../api'; 
import GenericTable from './components/GenericTable'; // Generic Table Component
import GenericDialog from './components/GenericDialog'; // Generic Dialog Component
import SearchBar from './components/SearchBar';
import SortControl from './components/SortControl';
import GenerateReportButton from './components/GenerateReportButton';
import CardView from './components/CardView';

const ServiceManagement = () => {
  const [serviceList, setServiceList] = useState([]);
  const [filteredServiceList, setFilteredServiceList] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortConfig, setSortConfig] = useState({ field: '', direction: '' });
  const [newService, setNewService] = useState({ name: '', description: '', price: '', status: 'Active' });
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
          setFilteredServiceList(response.data.services); 
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
  
        // Handle number comparison for fields like price
        if (typeof aField === 'number' && typeof bField === 'number') {
          return sortConfig.direction === 'asc' ? aField - bField : bField - aField;
        }
  
        // Default string comparison
        return sortConfig.direction === 'asc' ? (aField > bField ? 1 : -1) : (aField < bField ? 1 : -1);
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

  const handleSaveService = async (serviceData) => {
    try {
      if (editingService) {
        const updatedService = await editService(editingService._id, serviceData);
        setServiceList((prev) =>
          prev.map((service) => (service._id === editingService._id ? updatedService.data.service : service))
        );
      } else {
        const addedService = await addService(serviceData);
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
    setSortConfig((prev) => {
      const direction = prev.field === field && prev.direction === 'asc' ? 'desc' : 'asc';
      return {
        field: field.toLowerCase(),  // Ensure the field matches the property in the data
        direction,
      };
    });
  };
  

  const serviceColumns = [
    { label: 'Name', accessor: 'name' },
    { label: 'Description', accessor: 'description' },
    { label: 'Price', accessor: 'price' },
    { label: 'Status', accessor: 'status' },
  ];

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ textAlign: 'center', mb: 3 }}>
        <Typography variant="h4" gutterBottom>Service Management</Typography>
      </Box>

      {/* Search Bar */}
      <SearchBar value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />

      {/* Sort Control */}
      <SortControl value={sortConfig.field} onChange={handleSortChange} fields={['Name', 'Description', 'Price', 'Status']} />

      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2, mb: 2 }}>
        <GenerateReportButton
          data={filteredServiceList}
          columns={serviceColumns}
          title="Services Report"
        />
      </Box>

      {/* Table View */}
      <GenericTable
        data={filteredServiceList}
        columns={serviceColumns}
        onEdit={handleOpenDialog}
        onDelete={handleDeleteService}
        onSort={handleSortChange}
        sortConfig={sortConfig}
      />

      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2, mb: 2 }}>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={() => handleOpenDialog()}
        >
          Add New Service
        </Button>
      </Box>

      {/* Card View */}
      <CardView
        data={filteredServiceList}
        onEdit={handleOpenDialog}
        onDelete={handleDeleteService}
        fields={[
          { name: 'name', label: 'Name' },
          { name: 'description', label: 'Description' },
          { name: 'price', label: 'Price' },
          { name: 'status', label: 'Status' },
        ]}
      />

      {/* Add/Edit Service Dialog */}
      <GenericDialog
        open={openDialog}
        onClose={handleCloseDialog}
        data={newService}
        onSave={handleSaveService}
        fields={[
          { name: 'name', label: 'Service Name' },
          { name: 'description', label: 'Description', multiline: true, rows: 4 },
          { name: 'price', label: 'Price', type: 'number' },
          { name: 'status', label: 'Status', type: 'select', options: statuses },
        ]}
        title={editingService ? 'Edit Service' : 'Add Service'}
      />

      <Snackbar open={Boolean(error)} message={error} autoHideDuration={6000} onClose={() => setError('')} />
    </Box>
  );
};

export default ServiceManagement;
