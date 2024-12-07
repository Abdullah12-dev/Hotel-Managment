// CategoryDistributionChart.js
import React from 'react';
import { Paper, Typography } from '@mui/material';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';

const CategoryDistributionChart = ({ data, colors }) => {
  return (
    <Paper sx={{ p: 3, height: 300, width: '100%' }}>
      <Typography variant="h6" gutterBottom>
        Room Category Distribution
      </Typography>
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            nameKey="category"
            cx="50%"
            cy="50%"
            outerRadius={80}
            fill="#8884d8"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
            ))}
          </Pie>
          <Tooltip />
        </PieChart>
      </ResponsiveContainer>
    </Paper>
  );
};

export default CategoryDistributionChart;
