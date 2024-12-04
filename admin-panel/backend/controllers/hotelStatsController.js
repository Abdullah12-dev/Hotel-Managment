const { Booking, Room } = require('../models');

// Get Summary Stats for Dashboard and Graphs
exports.getSummaryStats = async (req, res) => {
  try {
    // Total Bookings
    const totalBookings = await Booking.countDocuments({});
    const confirmedBookings = await Booking.countDocuments({ status: 'Confirmed' });

    // Revenue Calculations
    const revenueByMonth = await Booking.aggregate([
      { $match: { status: 'Confirmed' } },
      { $group: { _id: { $month: '$checkInDate' }, amount: { $sum: '$totalAmount' } } },
      { $sort: { '_id': 1 } },
    ]);
    const totalRevenue = revenueByMonth.reduce((sum, entry) => sum + entry.amount, 0);

    // Occupancy Rate
    const totalRooms = await Room.countDocuments({});
    const occupiedRooms = await Room.countDocuments({ status: 'Occupied' });
    const occupancyRate = totalRooms > 0 ? (occupiedRooms / totalRooms) * 100 : 0;

    // Room Category Distribution
    const categoryDistribution = await Room.aggregate([
      { $group: { _id: '$category', count: { $sum: 1 } } },
      { $project: { category: '$_id', count: 1, _id: 0 } },
    ]);

    // Format the response
    const formattedRevenueByMonth = revenueByMonth.map((entry) => ({
      month: new Date(2024, entry._id - 1).toLocaleString('default', { month: 'long' }),
      amount: entry.amount,
    }));

    res.status(200).json({
      bookings: {
        total: totalBookings,
        confirmed: confirmedBookings,
      },
      revenue: {
        total: totalRevenue,
        byMonth: formattedRevenueByMonth,
      },
      occupancyRate: occupancyRate.toFixed(2),
      categoryDistribution,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


// Get Detailed Booking Data for Report Generation
exports.getBookingDetails = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    const filter = {};
    if (startDate && endDate) {
      filter.checkInDate = { $gte: new Date(startDate), $lte: new Date(endDate) };
    }

    const bookings = await Booking.find(filter)
      .populate('guest', 'name email')
      .populate('room', 'roomNumber category')
      .lean();

    res.status(200).json(bookings);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
