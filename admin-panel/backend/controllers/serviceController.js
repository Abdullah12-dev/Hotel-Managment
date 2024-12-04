const Service = require('../models/Service'); // Adjust the import path as needed

// Add a new service
exports.addService = async (req, res) => {
    try {
        const { name, description, price, status } = req.body;
        const newService = new Service({ name, description, price, status });
        await newService.save();
        res.status(201).json({ message: 'Service added successfully', service: newService });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Edit an existing service
exports.editService = async (req, res) => {
    try {
        const { id } = req.params;
        const updates = req.body; // Expecting { name, description, price, status } in body
        const updatedService = await Service.findByIdAndUpdate(id, updates, { new: true });
        if (!updatedService) {
            return res.status(404).json({ message: 'Service not found' });
        }
        res.status(200).json({ message: 'Service updated successfully', service: updatedService });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Delete a service
exports.deleteService = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedService = await Service.findByIdAndDelete(id);
        if (!deletedService) {
            return res.status(404).json({ message: 'Service not found' });
        }
        res.status(200).json({ message: 'Service deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Fetch all services
exports.getAllServices = async (req, res) => {
    try {
        const services = await Service.find({});
        res.status(200).json({ services });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Fetch service details by ID
exports.getServiceById = async (req, res) => {
    try {
        const { id } = req.params;
        const service = await Service.findById(id);
        if (!service) {
            return res.status(404).json({ message: 'Service not found' });
        }
        res.status(200).json({ service });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
