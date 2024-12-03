const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/dbConfig');
const authRoutes = require('./routes/authRoutes');
const { errorHandler } = require('./middlewares/errorMiddleware');
const staffRoutes = require('./routes/staffRoutes');
const roomRoute =require('./routes/roomRoutes');
dotenv.config();
connectDB();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use('/auth', authRoutes);
app.use('/staff',staffRoutes)
app.use('/rooms',roomRoute)

// Error handler
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
