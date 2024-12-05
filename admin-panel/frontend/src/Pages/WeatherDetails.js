import React from 'react';
import { Box, Typography } from '@mui/material';

const WeatherDetails = ({ weatherData, isCelsius }) => {
  const { main, weather, name, wind } = weatherData;
  const displayedTemp = isCelsius
    ? `${main.temp.toFixed(1)}°C`
    : `${((main.temp * 9) / 5 + 32).toFixed(1)}°F`;

  return (
    <Box sx={{ mb: 3, textAlign: 'center', p: 3, borderRadius: '10px' }}>
      <Typography>Temperature: {displayedTemp}</Typography>
      <Typography>Humidity: {main.humidity}%</Typography>
      <Typography>Wind Speed: {wind.speed} m/s</Typography>
      <Typography>Condition: {weather[0].description}</Typography>
    </Box>
  );
};

export default WeatherDetails;
