import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login, googleLogin, forgotPassword, resetPassword } from '../api';
import { TextField, Button, Box, Typography, Snackbar, Alert } from '@mui/material';
import Grid from '@mui/material/Grid2';
import hotelImage from '../assets/hotel.jpg';
import { GoogleLogin } from '@react-oauth/google';

const Login = ({ setAuth }) => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [errorMessage, setErrorMessage] = useState('');
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [errorType, setErrorType] = useState('error');
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [verificationCode, setVerificationCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await login(formData);
      console.log('Token Generated: ' + data.token);
      localStorage.setItem('token', data.token);
      setAuth(true);
      navigate('/dashboard');
    } catch (error) {
      setErrorMessage(error.message || 'Login failed');
      setErrorType(error.type || 'error');
      setOpenSnackbar(true);
    }
  };

  const handleForgotPasswordSubmit = async (e) => {
    e.preventDefault();
    try {
      await forgotPassword({ email: formData.email });
      setIsForgotPassword(false); // Switch to verification code form
      setErrorMessage('Verification code sent to your email.');
      setErrorType('success');
      setOpenSnackbar(true);
    } catch (error) {
      setErrorMessage(error.message || 'Failed to send verification code');
      setErrorType('error');
      setOpenSnackbar(true);
    }
  };

  const handleResetPasswordSubmit = async (e) => {
    e.preventDefault();
    try {
      await resetPassword({
        email: formData.email,
        code: verificationCode,
        newPassword: newPassword,
      });
      setIsForgotPassword(false); // Reset to login view
      setErrorMessage('Password updated successfully.');
      setErrorType('success');
      setOpenSnackbar(true);
    } catch (error) {
      setErrorMessage(error.message || 'Failed to reset password');
      setErrorType('error');
      setOpenSnackbar(true);
    }
  };

  const handleGoogleLoginSuccess = async (credentialResponse) => {
    try {
      const { data } = await googleLogin(credentialResponse.credential);
      localStorage.setItem('token', data.token);
      setAuth(true);
      navigate('/dashboard');
    } catch (error) {
      console.error('Google Login Failed:', error);
      setErrorMessage(error.message || 'Google login failed');
      setErrorType('error');
      setOpenSnackbar(true);
    }
  };

  const handleGoogleLoginFailure = (error) => {
    console.error('Google Login Failed:', error);
    setErrorMessage('Google login failed');
    setErrorType('error');
    setOpenSnackbar(true);
  };

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  return (
    <Grid container style={{ minHeight: '100vh' }}>
      {/* Left Section */}
      <Grid
        size={{ xs: 12, md: 7 }}
        display="flex"
        alignItems="center"
        justifyContent="center"
        style={{ padding: '20px' }}
      >
        <Box width="100%" maxWidth="400px" display="flex" flexDirection="column" alignItems="center">
          <Snackbar
            open={openSnackbar}
            autoHideDuration={6000}
            onClose={handleCloseSnackbar}
            anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
          >
            <Alert onClose={handleCloseSnackbar} severity={errorType === 'warning' ? 'warning' : errorType} sx={{ width: '100%' }}>
              {errorMessage}
            </Alert>
          </Snackbar>

          <Typography variant="h4" gutterBottom>
            {isForgotPassword ? 'Forgot Password' : 'Welcome to Hotel Manager'}
          </Typography>
          <Typography variant="subtitle1" gutterBottom>
            {isForgotPassword ? 'Enter your email to receive a verification code' : 'Login to access your dashboard'}
          </Typography>

          {!isForgotPassword ? (
            <form onSubmit={handleSubmit} style={{ width: '100%' }}>
              <TextField
                label="Email"
                type="email"
                fullWidth
                margin="normal"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
              />
              <TextField
                label="Password"
                type="password"
                fullWidth
                margin="normal"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                required
              />
              <Button variant="contained" color="primary" type="submit" fullWidth style={{ marginTop: '16px', padding: '10px' }}>
                Login
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
              <Button variant="text" color="secondary" onClick={() => setIsForgotPassword(true)} fullWidth style={{ marginTop: '8px' }}>
                Forgot Password?
              </Button>
              <Button variant="text" color="secondary" onClick={() => navigate('/signup')} fullWidth style={{ marginTop: '8px' }}>
                Don't have an account? Signup
              </Button>
            </form>
          ) : (
            <form onSubmit={handleForgotPasswordSubmit} style={{ width: '100%' }}>
              <TextField
                label="Email"
                type="email"
                fullWidth
                margin="normal"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
              />
              <Button variant="contained" color="primary" type="submit" fullWidth style={{ marginTop: '16px', padding: '10px' }}>
                Send Verification Code
              </Button>
              <Button
                variant="text"
                color="secondary"
                onClick={() => setIsForgotPassword(false)}
                fullWidth
                style={{ marginTop: '8px' }}
              >
                Back to Login
              </Button>
            </form>
          )}

          {/* Verification Code & Reset Password */}
          {isForgotPassword && (
            <form onSubmit={handleResetPasswordSubmit} style={{ width: '100%' }}>
              <TextField
                label="Verification Code"
                type="text"
                fullWidth
                margin="normal"
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value)}
                required
              />
              <TextField
                label="New Password"
                type="password"
                fullWidth
                margin="normal"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
              />
              <Button variant="contained" color="primary" type="submit" fullWidth style={{ marginTop: '16px', padding: '10px' }}>
                Reset Password
              </Button>
            </form>
          )}
        </Box>
      </Grid>

      {/* Right Section */}
      <Grid
        size={{ xs: 12, md: 5 }}
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

export default Login;
