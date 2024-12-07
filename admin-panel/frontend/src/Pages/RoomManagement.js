import React, { useState, useEffect } from 'react';
import { Box, Typography, Button, Snackbar } from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
import { addRoom, editRoom, deleteRoom, fetchAllRooms } from '../api';
import GenericTable from './components/GenericTable'; // Generic Table Component
import GenericDialog from './components/GenericDialog'; // Generic Dialog Component
import SearchBar from './components/SearchBar';
import SortControl from './components/SortControl';
import GenerateReportButton from './components/GenerateReportButton';
import CardView from './components/CardView';

const RoomManagement = () => {
  const [roomList, setRoomList] = useState([]);
  const [filteredRoomList, setFilteredRoomList] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortConfig, setSortConfig] = useState({ field: '', direction: '' });
  const [newRoom, setNewRoom] = useState({ roomNumber: '', category: '', price: '', status: 'Available', description: '' });
  const [openDialog, setOpenDialog] = useState(false);
  const [editingRoom, setEditingRoom] = useState(null);
  const [error, setError] = useState('');

  const categories = ['Single', 'Deluxe', 'Suite'];
  const statuses = ['Available', 'Occupied', 'Maintenance'];

  useEffect(() => {
    const loadRooms = async () => {
      try {
        const response = await fetchAllRooms();
        if (response && response.data && response.data.rooms) {
          setRoomList(response.data.rooms);
          setFilteredRoomList(response.data.rooms); // Initialize filtered list
        } else {
          throw new Error('Unexpected response format');
        }
      } catch (error) {
        setError(error.message || 'Failed to fetch room data. Please try again.');
      }
    };
    loadRooms();
  }, []);

  useEffect(() => {
    let updatedList = roomList.filter((room) =>
      Object.values(room).join(' ').toLowerCase().includes(searchQuery.toLowerCase())
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

    setFilteredRoomList(updatedList);
  }, [roomList, searchQuery, sortConfig]);

  const handleOpenDialog = (room = null) => {
    setEditingRoom(room);
    setNewRoom(room ? { ...room } : { roomNumber: '', category: '', price: '', status: 'Available', description: '' });
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingRoom(null);
    setError('');
  };

  const handleSaveRoom = async (roomData) => {
    try {
      if (editingRoom) {
        const updatedRoom = await editRoom(editingRoom._id, roomData);
        setRoomList((prev) => prev.map((room) => (room._id === editingRoom._id ? updatedRoom.data.room : room)));
      } else {
        const addedRoom = await addRoom(roomData);
        setRoomList((prev) => [...prev, addedRoom.data.room]);
      }
      handleCloseDialog();
    } catch (error) {
      setError(error.message || 'Failed to save room data. Please try again.');
    }
  };

  const handleDeleteRoom = async (id) => {
    try {
      await deleteRoom(id);
      setRoomList((prev) => prev.filter((room) => room._id !== id));
    } catch (error) {
      setError(error.message || 'Failed to delete room. Please try again.');
    }
  };

  const handleSortChange = (field) => {
    setSortConfig((prev) => ({
      field,
      direction: prev.field === field && prev.direction === 'asc' ? 'desc' : 'asc',
    }));
  };

  const roomColumns = [
    { label: 'Room Number', accessor: 'roomNumber' },
    { label: 'Category', accessor: 'category' },
    { label: 'Price', accessor: 'price' },
    { label: 'Status', accessor: 'status' },
    { label: 'Description', accessor: 'description' },
  ];

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ textAlign: 'center', mb: 3 }}>
        <Typography variant="h4" gutterBottom>Room Management</Typography>
      </Box>

      <SearchBar value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />

      <SortControl value={sortConfig.field} onChange={handleSortChange} fields={['roomNumber', 'category', 'price', 'status']} />

      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2, mb:2 }}>
        <GenerateReportButton
            data={filteredRoomList}
            columns={roomColumns}
            title="Rooms Report"
          />
      </Box>

      {/* Table View */}
      <GenericTable
        data={filteredRoomList}
        columns={roomColumns}
        onEdit={handleOpenDialog}
        onDelete={handleDeleteRoom}
        onSort={handleSortChange}
        sortConfig={sortConfig}
      />

      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2, mb:2 }}>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={() => handleOpenDialog()}
        >
          Add New Room
        </Button>
      </Box>

      {/* Card View */}
      <CardView
        data={filteredRoomList}
        onEdit={handleOpenDialog}
        onDelete={handleDeleteRoom}
        fields={[
          { name: 'roomNumber', label: 'Room Number' },
          { name: 'category', label: 'Category' },
          { name: 'price', label: 'Price' },
          { name: 'status', label: 'Status' },
          { name: 'description', label: 'Description' },
        ]}
      />

      {/* Add/Edit Room Dialog */}
      <GenericDialog
        open={openDialog}
        onClose={handleCloseDialog}
        data={newRoom}
        onSave={handleSaveRoom}
        fields={[
          { name: 'roomNumber', label: 'Room Number' },
          { name: 'category', label: 'Category', type: 'select', options: categories },
          { name: 'price', label: 'Price', type: 'number' },
          { name: 'status', label: 'Status', type: 'select', options: statuses },
          { name: 'description', label: 'Description', multiline: true, rows: 4 },
        ]}
        title={editingRoom ? 'Edit Room' : 'Add Room'}
      />

      <Snackbar open={Boolean(error)} message={error} autoHideDuration={6000} onClose={() => setError('')} />
    </Box>
  );
};

export default RoomManagement;
