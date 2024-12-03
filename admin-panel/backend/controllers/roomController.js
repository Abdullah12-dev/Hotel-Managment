const Room = require('../models/Room'); // Adjust the import path as needed

// Add a new room
exports.addRoom = async (req, res) => {
    try {
        const { roomNumber, category, price, status, description} = req.body;
        const newRoom = new Room({ roomNumber, category, price, status, description});
        await newRoom.save();
        res.status(201).json({ message: 'Room added successfully', room: newRoom });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Edit an existing room
exports.editRoom = async (req, res) => {
    try {
        const { id } = req.params;
        const updates = req.body; // Expecting { roomNumber, category, price, status, description} in body
        const updatedRoom = await Room.findByIdAndUpdate(id, updates, { new: true });
        if (!updatedRoom) {
            return res.status(404).json({ message: 'Room not found' });
        }
        res.status(200).json({ message: 'Room updated successfully', room: updatedRoom });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Delete a room
exports.deleteRoom = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedRoom = await Room.findByIdAndDelete(id);
        if (!deletedRoom) {
            return res.status(404).json({ message: 'Room not found' });
        }
        res.status(200).json({ message: 'Room deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Fetch all rooms
exports.getAllRooms = async (req, res) => {
    try {
        const rooms = await Room.find({});
        res.status(200).json({ rooms });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Fetch room details by ID
exports.getRoomById = async (req, res) => {
    try {
        const { id } = req.params;
        const room = await Room.findById(id);
        if (!room) {
            return res.status(404).json({ message: 'Room not found' });
        }
        res.status(200).json({ room });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};