const  Staff  = require('../models/Staff');

// Add a new staff member
exports.addStaff = async (req, res) => {
  console.log('Staff Model:', Staff);
    try {
        const { name, email, phoneNumber, role } = req.body;
        const newStaff = new Staff({ name, email, phoneNumber, role });
        await newStaff.save();
        res.status(201).json({ message: 'Staff member added successfully', staff: newStaff });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Edit an existing staff member
exports.editStaff = async (req, res) => {
    try {
        const { id } = req.params;
        const updates = req.body; // Expecting {name, email, phoneNumber, role} in body
        const updatedStaff = await Staff.findByIdAndUpdate(id, updates, { new: true });
        if (!updatedStaff) {
            return res.status(404).json({ message: 'Staff member not found' });
        }
        res.status(200).json({ message: 'Staff member updated successfully', staff: updatedStaff });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Delete a staff member
exports.deleteStaff = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedStaff = await Staff.findByIdAndDelete(id);
        if (!deletedStaff) {
            return res.status(404).json({ message: 'Staff member not found' });
        }
        res.status(200).json({ message: 'Staff member deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Assign role to a staff member
exports.assignRole = async (req, res) => {
    try {
        const { id } = req.params;
        const { role } = req.body; // Expecting {role: 'Manager'} in body
        const staff = await Staff.findByIdAndUpdate(id, { role }, { new: true });
        if (!staff) {
            return res.status(404).json({ message: 'Staff member not found' });
        }
        res.status(200).json({ message: 'Role assigned successfully', staff });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// View performance metrics
exports.getPerformanceMetrics = async (req, res) => {
    try {
        const { id } = req.params;
        const staff = await Staff.findById(id, 'performanceMetrics');
        if (!staff) {
            return res.status(404).json({ message: 'Staff member not found' });
        }
        res.status(200).json({ performanceMetrics: staff.performanceMetrics });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Fetch all staff members
exports.getAllStaff = async (req, res) => {
    try {
        const staff = await Staff.find({});
        res.status(200).json({ staff });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
