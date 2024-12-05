import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  CircularProgress,
  Card,
  CardContent,
} from '@mui/material';
import Grid from '@mui/material/Grid2';


import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { fetchSummaryStats } from '../api'; // Ensure correct API path

const Dashboard = () => {
  const [summaryStats, setSummaryStats] = useState(null);
  const [loading, setLoading] = useState(true);

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

  useEffect(() => {
    const loadStats = async () => {
      try {
        const response = await fetchSummaryStats();
        // Ensure backend data matches frontend requirements
        const mappedCategoryDistribution = response.data.categoryDistribution.map((item) => ({
          category: item.category,
          value: item.count,
        }));
        const mappedOccupancyTrend = response.data.revenue.byMonth.map((item) => ({
          month: item.month,
          rate: (response.data.occupancyRate / 100).toFixed(2),
        }));

        setSummaryStats({
          ...response.data,
          categoryDistribution: mappedCategoryDistribution,
          occupancyRateTrend: mappedOccupancyTrend,
        });
      } catch (error) {
        console.error('Error loading summary stats:', error.message);
      } finally {
        setLoading(false);
      }
    };

    loadStats();
  }, []);

  if (loading) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (!summaryStats) {
    return (
      <Box sx={{ textAlign: 'center', mt: 5 }}>
        <Typography variant="h6">No data available</Typography>
      </Box>
    );
  }

  const { bookings, revenue, categoryDistribution, occupancyRateTrend } = summaryStats;

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Hotel Management Dashboard
      </Typography>
  
      {/* Summary Cards */}
      <Grid container spacing={3} style={{ marginBottom: '16px' }}>
        {/* Total Bookings */}
        <Grid
          size={{ xs: 12, md: 4 }}
          display="flex"
          justifyContent="center"
          style={{ padding: '16px' }}
        >
          <Card sx={{ textAlign: 'center', boxShadow: 3, width: '100%' }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Total Bookings
              </Typography>
              <Typography variant="h4">{bookings.total}</Typography>
            </CardContent>
          </Card>
        </Grid>
  
        {/* Revenue */}
        <Grid
          size={{ xs: 12, md: 4 }}
          display="flex"
          justifyContent="center"
          style={{ padding: '16px' }}
        >
          <Card sx={{ textAlign: 'center', boxShadow: 3, width: '100%' }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Revenue
              </Typography>
              <Typography variant="h4">${revenue.total}</Typography>
            </CardContent>
          </Card>
        </Grid>
  
        {/* Occupancy Rate */}
        <Grid
          size={{ xs: 12, md: 4 }}
          display="flex"
          justifyContent="center"
          style={{ padding: '16px' }}
        >
          <Card sx={{ textAlign: 'center', boxShadow: 3, width: '100%' }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Occupancy Rate
              </Typography>
              <Typography variant="h4">{summaryStats.occupancyRate}%</Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
  
      {/* Graphs Section */}
      <Grid container spacing={4}>
        {/* Bar Chart for Revenue */}
        <Grid
          size={{ xs: 12, md: 6 }}
          display="flex"
          justifyContent="center"
          style={{ padding: '16px' }}
        >
          <Paper sx={{ p: 3, height: 300, width: '100%' }}>
            <Typography variant="h6" gutterBottom>
              Revenue by Month
            </Typography>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={revenue.byMonth}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="amount" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>
  
        {/* Pie Chart for Room Category Distribution */}
        <Grid
          size={{ xs: 12, md: 6 }}
          display="flex"
          justifyContent="center"
          style={{ padding: '16px' }}
        >
          <Paper sx={{ p: 3, height: 300, width: '100%' }}>
            <Typography variant="h6" gutterBottom>
              Room Category Distribution
            </Typography>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryDistribution}
                  dataKey="value"
                  nameKey="category"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  fill="#8884d8"
                >
                  {categoryDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>
  

      </Grid>
    </Box>
  );
  
};

export default Dashboard;
