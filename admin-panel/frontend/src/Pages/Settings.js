import React, { useEffect, useState } from 'react';
import { getSettings, updateSettings, resetSettings } from '../api';
import { 
  TextField, 
  Checkbox, 
  FormControlLabel, 
  Button, 
  Container, 
  Typography, 
  Box, 
  Grid, 
  Paper 
} from '@mui/material';

const Settings = () => {
  const [settings, setSettings] = useState({
    policy: '',
    notificationPreferences: { email: true, sms: true },
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch settings on component mount
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const data = await getSettings();
        setSettings(data);
      } catch (err) {
        setError('Failed to fetch settings');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchSettings();
  }, []);

  // Handle changes in the settings form
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (name === 'policy') {
      setSettings((prevState) => ({
        ...prevState,
        policy: value,
      }));
    } else {
      setSettings((prevState) => ({
        ...prevState,
        notificationPreferences: {
          ...prevState.notificationPreferences,
          [name]: type === 'checkbox' ? checked : value,
        },
      }));
    }
  };

  // Save settings to the backend
  const handleSaveSettings = async () => {
    try {
      await updateSettings(settings);
      alert('Settings saved successfully!');
    } catch (err) {
      alert('Error saving settings');
    }
  };

  // Reset settings to default
  const handleResetSettings = async () => {
    try {
      await resetSettings();
      setSettings({
        policy: '',
        notificationPreferences: { email: true, sms: true },
      });
      alert('Settings reset to default');
    } catch (err) {
      alert('Error resetting settings');
    }
  };

  if (isLoading) {
    return <Typography variant="h6">Loading...</Typography>;
  }

  if (error) {
    return <Typography variant="h6" color="error">{error}</Typography>;
  }

  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 4, textAlign: 'center' }}>
        <Typography variant="h4" gutterBottom>
          Hotel Settings
        </Typography>
      </Box>

      <Paper sx={{ padding: 3 }}>
        <Box sx={{ mb: 3 }}>
          <TextField
            label="Hotel Policy"
            name="policy"
            value={settings.policy}
            onChange={handleInputChange}
            fullWidth
            multiline
            rows={6}
            variant="outlined"
            sx={{ mb: 2 }}
          />
        </Box>

        <Box sx={{ mb: 3 }}>
          <Typography variant="h6" gutterBottom>
            Notification Preferences
          </Typography>
          <Grid container direction="column" spacing={2}>
            <Grid item>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={settings.notificationPreferences.email}
                    onChange={handleInputChange}
                    name="email"
                    color="primary"
                  />
                }
                label="Email Notifications"
              />
            </Grid>
            <Grid item>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={false}
                    onChange={handleInputChange}
                    name="sms"
                    color="primary"
                    disabled
                  />
                }
                label="SMS Notifications"
              />
            </Grid>
          </Grid>
        </Box>

        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Button 
            variant="contained" 
            color="primary" 
            onClick={handleSaveSettings} 
            sx={{ width: '48%' }}
          >
            Save Settings
          </Button>

          <Button 
            variant="outlined" 
            color="secondary" 
            onClick={handleResetSettings} 
            sx={{ width: '48%' }}
          >
            Reset to Default
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default Settings;
