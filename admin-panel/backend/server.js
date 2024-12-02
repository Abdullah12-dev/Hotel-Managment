const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/dbConfig');
const authRoutes = require('./routes/authRoutes');
const { errorHandler } = require('./middlewares/errorMiddleware');
const staffRoutes = require('./routes/staffRoutes');
dotenv.config();
connectDB();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use('/auth', authRoutes);
app.use('/staff',staffRoutes)

// Error handler
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
