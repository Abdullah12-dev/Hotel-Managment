const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/dbConfig');
const authRoutes = require('./routes/authRoutes');
const passwordResetRoutes = require('./routes/passwordResetRoutes');
const { errorHandler } = require('./middlewares/errorMiddleware');
const staffRoutes = require('./routes/staffRoutes');
const roomRoute =require('./routes/roomRoutes');
const seviceRoutes =require('./routes/serviceRoutes');
const hotelStatsRoutes = require('./routes/hotelStatsRoutes');
const logRoutes = require('./routes/logRoutes');
const notificationRoutes = require('./routes/notificationRoutes');
const SettingRoutes = require('./routes/SettingRoutes');
dotenv.config();
connectDB();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use('/auth', authRoutes);
app.use('/auths', passwordResetRoutes);
app.use('/staff',staffRoutes)
app.use('/rooms',roomRoute)
app.use('/services',seviceRoutes)
app.use('/hotel-stats', hotelStatsRoutes);
app.use('/system-logs', logRoutes);
app.use('/settings', SettingRoutes);

app.use('/notifications', notificationRoutes);


// Error handler
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
