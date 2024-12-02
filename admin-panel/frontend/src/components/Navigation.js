import React from 'react';
import { useNavigate } from 'react-router-dom';
import { AppBar, Toolbar, Typography, IconButton, Menu, MenuItem, Box } from '@mui/material';
import AccountCircle from '@mui/icons-material/AccountCircle';

const Navigation = ({ children, userInfo }) => {
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    localStorage.removeItem('token'); // Clear token
    navigate('/login'); // Redirect to login page
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h4" sx={{ flexGrow: 1 }}>
            Task Manager App
          </Typography>
          <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
            <IconButton
              size="large"
              edge="end"
              color="inherit"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleMenu}
              style={{ marginRight: '8px' }}
            >
            <AccountCircle />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorEl}
              anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              open={Boolean(anchorEl)}
              onClose={handleClose}
            >
              <MenuItem onClick={handleClose}>Profile</MenuItem>
              <MenuItem onClick={handleLogout}>Logout</MenuItem>
            </Menu>
            <Typography variant="h6">
                {userInfo.name}
            </Typography>
          </div>
        </Toolbar>
      </AppBar>
      <Box p={3}>{children}</Box>
    </Box>
  );
};

export default Navigation;
