// SummaryCard.js
import React from 'react';
import { Card, CardContent, Typography } from '@mui/material';

const SummaryCard = ({ title, value }) => {
  return (
    <Card sx={{ textAlign: 'center', boxShadow: 3, width: '100%' }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          {title}
        </Typography>
        <Typography variant="h4">{value}</Typography>
      </CardContent>
    </Card>
  );
};

export default SummaryCard;
