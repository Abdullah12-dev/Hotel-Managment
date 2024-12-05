import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  TextField,
  Switch,
  FormControlLabel,
  CircularProgress,
  Paper,
  Card,
  CardContent,
} from '@mui/material';
import { styled } from '@mui/system';
import { fetchWeatherData, fetchForecastData } from '../api';
import WeatherDetails from './WeatherDetails';

const Container = styled(Box)(({ theme }) => ({
  backgroundColor: '#f5f5f5',
  borderRadius: '8px',
  padding: '24px',
  boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)',
  maxWidth: '1200px',
  margin: 'auto',
  [theme.breakpoints.down('sm')]: {
    padding: '16px',
  },
}));

const Header = styled(Typography)(({ theme }) => ({
  color: '#333',
  fontWeight: 'bold',
  marginBottom: '16px',
  textAlign: 'center',
  [theme.breakpoints.down('sm')]: {
    fontSize: '1.5rem',
  },
}));

const SearchBarContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: '24px',
  gap: '16px',
  [theme.breakpoints.down('sm')]: {
    flexDirection: 'column',
    gap: '8px',
  },
}));

const WeatherCard = styled(Card)(({ theme }) => ({
  backgroundColor: '#e3f2fd',
  boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)',
  borderRadius: '8px',
  padding: '16px',
  textAlign: 'center',
  [theme.breakpoints.down('sm')]: {
    padding: '12px',
  },
}));

const WeatherDashboard = () => {
  const [city, setCity] = useState('');
  const [weatherData, setWeatherData] = useState(null);
  const [isCelsius, setIsCelsius] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        fetchWeatherDataByCoords(latitude, longitude);
      },
      () => setError('Unable to fetch location. Please search for a city.')
    );
  }, []);

  const fetchWeatherDataByCoords = async (lat, lon) => {
    setLoading(true);
    try {
      const data = await fetchWeatherData(null, lat, lon);
      setWeatherData(data);
      setCity(data.name);
    } catch (e) {
      setError('Error fetching weather data.');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    if (!city) return;
    setLoading(true);
    try {
      const data = await fetchWeatherData(city);
      setWeatherData(data);
    } catch (e) {
      setError('City not found.');
    } finally {
      setLoading(false);
    }
  };

  const toggleTemperature = () => {
    setIsCelsius(!isCelsius);
  };

  return (
    <Container>
      <Header variant="h4">
        Weather Dashboard
      </Header>
      <SearchBarContainer>
        <TextField
          label="Search City"
          variant="outlined"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
          fullWidth
          sx={{
            backgroundColor: '#ffffff',
            borderRadius: '8px',
          }}
        />
        <FormControlLabel
          control={<Switch checked={!isCelsius} onChange={toggleTemperature} />}
          label={isCelsius ? '°C' : '°F'}
        />
      </SearchBarContainer>

      {loading && (
        <Box textAlign="center" sx={{ my: 3 }}>
          <CircularProgress />
        </Box>
      )}

      {error && <Typography color="error" sx={{ textAlign: 'center', my: 2 }}>{error}</Typography>}

      {weatherData && (
        <>
          <WeatherCard>
            <CardContent>
              <Typography variant="h5" sx={{ color: '#1976d2', fontWeight: 'bold' }}>
                {weatherData.name}
              </Typography>
              <WeatherDetails weatherData={weatherData} isCelsius={isCelsius} />
            </CardContent>
          </WeatherCard>
        </>
      )}
    </Container>
  );
};

export default WeatherDashboard;
