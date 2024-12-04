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
import { addRoom, editRoom, deleteRoom, fetchAllRooms } from '../api'; // Adjust the import path as needed
import GenerateReportButton from './GenerateReportButton';
const RoomManagement = () => {
  const [roomList, setRoomList] = useState([]);
  const [filteredRoomList, setFilteredRoomList] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortConfig, setSortConfig] = useState({ field: '', direction: '' });
  const [newRoom, setNewRoom] = useState({
    roomNumber: '',
    category: '',
    price: '',
    status: '',
    description: '',
    images: [],
  });
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
    // Filter and sort the room list whenever searchQuery or sortConfig changes
    let updatedList = roomList.filter((room) =>
      Object.values(room)
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

    setFilteredRoomList(updatedList);
  }, [roomList, searchQuery, sortConfig]);

  const handleOpenDialog = (room = null) => {
    setEditingRoom(room);
    setNewRoom(
      room ? { ...room } : { roomNumber: '', category: '', price: '', status: 'Available', description: '', images: [] }
    );
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingRoom(null);
    setError('');
  };

  const handleSaveRoom = async () => {
    try {
      if (editingRoom) {
        const updatedRoom = await editRoom(editingRoom._id, newRoom);
        setRoomList((prev) =>
          prev.map((room) => (room._id === editingRoom._id ? updatedRoom.data.room : room))
        );
      } else {
        const addedRoom = await addRoom(newRoom);
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
    { label: 'Room Number', accessor: (row) => row.roomNumber },
    { label: 'Category', accessor: (row) => row.category },
    { label: 'Price', accessor: (row) => `$${row.price}` },
    { label: 'Status', accessor: (row) => row.status },
    { label: 'Description', accessor: (row) => row.description || 'N/A' },
  ];

  
  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ textAlign: 'center', mb: 3 }}>
        <Typography variant="h4" gutterBottom>
          Room Management
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
            <MenuItem value="roomNumber">Room Number</MenuItem>
            <MenuItem value="category">Category</MenuItem>
            <MenuItem value="price">Price</MenuItem>
            <MenuItem value="status">Status</MenuItem>
          </Select>
        </FormControl>
      </Box>
  
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2, mb:2 }}>
        <GenerateReportButton
            data={filteredRoomList}
            columns={roomColumns}
            title="Rooms Report"
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
                <Button onClick={() => handleSortChange('roomNumber')} sx={{ color: '#fff' }}>Room Number</Button>
              </TableCell>
              <TableCell>
                <Button onClick={() => handleSortChange('category')}sx={{ color: '#fff' }}>Category</Button>
              </TableCell>
              <TableCell>
                <Button onClick={() => handleSortChange('price')} sx={{ color: '#fff' }}>Price</Button>
              </TableCell>
              <TableCell>
                <Button onClick={() => handleSortChange('status')} sx={{ color: '#fff' }}>Status</Button>
              </TableCell>
              <TableCell>Description</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredRoomList.map((room) => (
              <TableRow key={room._id}>
                <TableCell>{room.roomNumber}</TableCell>
                <TableCell>{room.category}</TableCell>
                <TableCell>{room.price}</TableCell>
                <TableCell>{room.status}</TableCell>
                <TableCell>{room.description}</TableCell>
                <TableCell align="right">
                  <IconButton color="primary" onClick={() => handleOpenDialog(room)}>
                    <EditIcon />
                  </IconButton>
                  <IconButton color="error" onClick={() => handleDeleteRoom(room._id)}>
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
          Add New Room
        </Button>
      </Box>



      {/* Mobile View for Room List */}
      <Box sx={{ display: { xs: 'block', md: 'none' } }}>
        {filteredRoomList.map((room) => (
          <Paper key={room._id} sx={{ p: 2, mb: 2 }}>
            <Typography variant="h6">{room.roomNumber}</Typography>
            <Typography>Category: {room.category}</Typography>
            <Typography>Price: ${room.price}</Typography>
            <Typography>Status: {room.status}</Typography>
            <Typography>Description: {room.description}</Typography>
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1, mt: 2 }}>
              <IconButton color="primary" onClick={() => handleOpenDialog(room)}>
                <EditIcon />
              </IconButton>
              <IconButton color="error" onClick={() => handleDeleteRoom(room._id)}>
                <DeleteIcon />
              </IconButton>
            </Box>
          </Paper>
        ))}
      </Box>
      

  
      {/* Room Add/Edit Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>{editingRoom ? 'Edit Room' : 'Add New Room'}</DialogTitle>
        <DialogContent>
          <Box component="form" sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
            <TextField
              fullWidth
              label="Room Number"
              variant="outlined"
              value={newRoom.roomNumber}
              onChange={(e) => setNewRoom((prev) => ({ ...prev, roomNumber: e.target.value }))}
            />
            <FormControl fullWidth variant="outlined">
              <InputLabel>Category</InputLabel>
              <Select
                value={newRoom.category}
                onChange={(e) => setNewRoom((prev) => ({ ...prev, category: e.target.value }))}
                label="Category"
              >
                {categories.map((category) => (
                  <MenuItem key={category} value={category}>
                    {category}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <TextField
              fullWidth
              label="Price"
              variant="outlined"
              type="number"
              value={newRoom.price}
              onChange={(e) => setNewRoom((prev) => ({ ...prev, price: e.target.value }))}
            />
            <FormControl fullWidth variant="outlined">
              <InputLabel>Status</InputLabel>
              <Select
                value={newRoom.status}
                onChange={(e) => setNewRoom((prev) => ({ ...prev, status: e.target.value }))}
                label="Status"
              >
                {statuses.map((status) => (
                  <MenuItem key={status} value={status}>
                    {status}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <TextField
              fullWidth
              label="Description"
              variant="outlined"
              multiline
              rows={3}
              value={newRoom.description}
              onChange={(e) => setNewRoom((prev) => ({ ...prev, description: e.target.value }))}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="secondary">
            Cancel
          </Button>
          <Button onClick={handleSaveRoom} color="primary" variant="contained">
            Save
          </Button>
        </DialogActions>
      </Dialog>
  
      <Snackbar
        open={Boolean(error)}
        message={error}
        autoHideDuration={6000}
        onClose={() => setError('')}
      />
    </Box>
  );
  
};

export default RoomManagement;

