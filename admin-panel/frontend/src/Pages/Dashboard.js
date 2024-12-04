import React from 'react';
import { 
  Box, 
  Paper, 
  Typography, 
  Card, 
  CardContent, 
  CardHeader 
} from '@mui/material';
import Grid from '@mui/material/Grid2';

import { 
  People as PeopleIcon, 
  Work as WorkIcon, 
  AttachMoney as MoneyIcon 
} from '@mui/icons-material';

const DashboardCard = ({ title, value, icon, color }) => (
  <Card elevation={2} sx={{ height: '100%' }}>
    <CardContent sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
      <Box>
        <Typography variant="h6" color="text.secondary" gutterBottom>
          {title}
        </Typography>
        <Typography variant="h4" color="primary">
          {value}
        </Typography>
      </Box>
      {React.cloneElement(icon, { 
        sx: { 
          fontSize: 60, 
          color: color, 
          opacity: 0.7 
        } 
      })}
    </CardContent>
  </Card>
);

const Dashboard = () => {
  return (
    <Box sx={{ flexGrow: 1, p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Dashboard Overview
      </Typography>
      
      <Grid container spacing={3}>
        {/* Quick Stats Cards */}
        <Grid item xs={12} sm={4}>
          <DashboardCard 
            title="Total Employees" 
            value="254" 
            icon={<PeopleIcon />} 
            color="#3f51b5" 
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <DashboardCard 
            title="Active Projects" 
            value="17" 
            icon={<WorkIcon />} 
            color="#ff9800" 
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <DashboardCard 
            title="Revenue" 
            value="$456,890" 
            icon={<MoneyIcon />} 
            color="#4caf50" 
          />
        </Grid>

        {/* Recent Activities Section */}
        <Grid item xs={12} md={8}>
          <Paper elevation={2} sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Recent Activities
            </Typography>
            {/* Add a list of recent activities or a table */}
            <Typography variant="body2" color="text.secondary">
              No recent activities to display.
            </Typography>
          </Paper>
        </Grid>

        {/* Quick Actions Section */}
        <Grid item xs={12} md={4}>
          <Paper elevation={2} sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Quick Actions
            </Typography>
            {/* Add buttons or quick action links */}
            <Typography variant="body2" color="text.secondary">
              Quick actions will be added soon.
            </Typography>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;