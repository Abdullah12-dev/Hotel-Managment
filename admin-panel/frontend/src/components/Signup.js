import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { signup,googleLogin } from '../api';
import { TextField, Button, Box, Typography, Snackbar, Alert, MenuItem } from '@mui/material';
import Grid from '@mui/material/Grid2';
import hotelImage from '../assets/hotel.jpg'; // Replace with your image path
import GoogleIcon from '@mui/icons-material/Google';
import { GoogleLogin } from '@react-oauth/google';

const roles = ['Admin', 'Receptionist', 'Guest'];


const Signup = ({ setAuth }) => {
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phoneNumber: '',
    role: 'Guest', // Default role
  });
  const [errorMessage, setErrorMessage] = useState('');
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [errorType, setErrorType] = useState('error');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await signup(formData);
      alert('Account created successfully!');
      navigate('/login');
    } catch (error) {
      setErrorMessage(error.message || 'Error creating account');
      setErrorType(error.type || 'error');
      setOpenSnackbar(true);
    }
  };

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  const handleGoogleLoginSuccess = async (credentialResponse) => {
    try {
      const { data } = await googleLogin(credentialResponse.credential); // Send credential to backend
      localStorage.setItem('token', data.token); // Save token to local storage
      setAuth(true);
      navigate('/dashboard');
    } catch (error) {
      console.error('Google Login Failed:', error);
      setErrorMessage('Google login failed');
      setOpenSnackbar(true);
    }
  };
  
  const handleGoogleLoginFailure = (error) => {
    console.error('Google Login Failed:', error);
    setErrorMessage('Google login failed');
    setOpenSnackbar(true);
  };

  return (
    <Grid container style={{ minHeight: '100vh' }}>
      {/* Left Section */}
      <Grid size={{ xs: 12, md: 7 }}
        display="flex" 
        alignItems="center" 
        justifyContent="center" 
        style={{ padding: '20px' }}
      >
        <Box 
          width="100%" 
          maxWidth="400px" 
          display="flex" 
          flexDirection="column" 
          alignItems="center"
        >
          <Snackbar 
            open={openSnackbar} 
            autoHideDuration={6000} 
            onClose={handleCloseSnackbar}
            anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
          >
            <Alert onClose={handleCloseSnackbar} severity="error" sx={{ width: '100%' }}>
              {errorMessage}
            </Alert>
          </Snackbar>
          <Typography variant="h4" gutterBottom>Signup</Typography>
          <form onSubmit={handleSubmit} style={{ width: '100%' }}>
            <TextField
              label="Name"
              fullWidth
              margin="normal"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
            <TextField
              label="Email"
              type="email"
              fullWidth
              margin="normal"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
            <TextField
              label="Password"
              type="password"
              fullWidth
              margin="normal"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            />
            <TextField
              label="Phone Number"
              fullWidth
              margin="normal"
              value={formData.phoneNumber}
              onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
            />
            <TextField
              select
              label="Role"
              fullWidth
              margin="normal"
              value={formData.role}
              onChange={(e) => setFormData({ ...formData, role: e.target.value })}
            >
              {roles.map((role) => (
                <MenuItem key={role} value={role}>
                  {role}
                </MenuItem>
              ))}
            </TextField>
            <Button
              variant="contained"
              color="primary"
              type="submit"
              fullWidth
              style={{ marginTop: '16px', padding: '10px' }}
            >
              Signup
            </Button>
            <Box mt={2} width="100%">
              <GoogleLogin
                onSuccess={handleGoogleLoginSuccess}
                onError={handleGoogleLoginFailure}
                useOneTap
                fullWidth
                style={{ marginTop: '16px', padding: '10px' }}
              />
            </Box>

            <Button 
              variant="text"
              color="secondary"
              onClick={() => navigate('/login')}
              fullWidth
              style={{ marginTop: '8px' }}
            >
              Already have an account? Login
            </Button>
          </form>
        </Box>
      </Grid>

      {/* Right Section */}
      <Grid size={{ xs: 12, md: 5 }}
        style={{
          backgroundImage: `url(${hotelImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Box
          display="flex"
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
          style={{
            height: '100%',
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            color: 'white',
            width: '100%',
          }}
        >
          <Typography variant="h3" gutterBottom style={{ fontWeight: 'bold' }}>
            Hotel Manager
          </Typography>
          <Typography variant="subtitle1" style={{ textAlign: 'center' }}>
            Manage your reservations, customers, and services all in one place.
          </Typography>
        </Box>
      </Grid>
    </Grid>
  );
};

export default Signup;
