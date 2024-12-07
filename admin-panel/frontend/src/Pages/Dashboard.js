// Dashboard.js
import React, { useState, useEffect } from 'react';
import { Box, Typography, CircularProgress } from '@mui/material';
import { fetchSummaryStats } from '../api'; // Ensure correct API path
import SummaryCard from './components/SummaryCard';
import RevenueChart from './components/RevenueChart';
import CategoryDistributionChart from './components/CategoryDistributionChart';
import Grid from '@mui/material/Grid2';


const Dashboard = () => {
  const [summaryStats, setSummaryStats] = useState(null);
  const [loading, setLoading] = useState(true);

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

  useEffect(() => {
    const loadStats = async () => {
      try {
        const response = await fetchSummaryStats();
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

  const { bookings, revenue, categoryDistribution } = summaryStats;

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Hotel Management Dashboard
      </Typography>

      {/* Summary Cards */}
      <Grid container spacing={3} style={{ marginBottom: '16px' }}>
        <Grid size={{ xs: 12, md: 4 }} display="flex" justifyContent="center">
          <SummaryCard title="Total Bookings" value={bookings.total} />
        </Grid>
        <Grid size={{ xs: 12, md: 4 }} display="flex" justifyContent="center">
          <SummaryCard title="Revenue" value={`$${revenue.total}`} />
        </Grid>
        <Grid size={{ xs: 12, md: 4 }} display="flex" justifyContent="center">
          <SummaryCard title="Occupancy Rate" value={`${summaryStats.occupancyRate}%`} />
        </Grid>
      </Grid>

      {/* Graphs Section */}
      <Grid container spacing={4}>
        <Grid size={{ xs: 12, md: 6 }} display="flex" justifyContent="center">
          <RevenueChart data={revenue.byMonth} />
        </Grid>
        <Grid size={{ xs: 12, md: 6 }} display="flex" justifyContent="center">
          <CategoryDistributionChart data={categoryDistribution} colors={COLORS} />
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;
