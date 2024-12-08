import React, { useState, useEffect } from "react";
import AppSidebar from "./components/AppSidebar"; // Adjust the import path as needed
import { Outlet } from "react-router-dom";
import {
  Box,
  CssBaseline,
  Toolbar,
  IconButton,
  Avatar,
  Menu,
  MenuItem,
  Typography,
  useMediaQuery,
  AppBar,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { useTheme } from "@mui/material/styles";

const drawerWidth = 260;

const Dashboard = () => {
  const theme = useTheme();
  const isLargeScreen = useMediaQuery(theme.breakpoints.up("sm")); // Detect large screens
  const [isSidebarOpen, setIsSidebarOpen] = useState(isLargeScreen); // Default to visible on large screens
  const [anchorEl, setAnchorEl] = useState(null); // Anchor element for profile menu

  const toggleSidebar = () => {
    setIsSidebarOpen((prev) => !prev);
  };

  useEffect(() => {
    // Automatically set the sidebar visibility when screen size changes
    setIsSidebarOpen(isLargeScreen);
  }, [isLargeScreen]);

  // Profile menu handlers
  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    localStorage.removeItem("token"); 
    window.location.href = "/login";
  };

  return (
    <Box>
      <CssBaseline />

      {/* Sidebar */}
      <AppSidebar
        isSidebarOpen={isSidebarOpen}
        toggleSidebar={toggleSidebar}
        drawerWidth={drawerWidth}
      />

      {/* Topbar */}
      <AppBar
        position="fixed"
        sx={{
          zIndex: theme.zIndex.drawer + 1, // Ensure the top bar is above the sidebar
          backgroundColor: "#282c34", // Set top bar color to black
          boxShadow: theme.shadows[1], // Optional: Add shadow for top bar
        }}
      >
        <Toolbar
          sx={{
            display: "flex",
            justifyContent: "space-between", // Space out the items
            alignItems: "center",
          }}
        >
          {/* Toggle Button for Sidebar */}
          <IconButton
            onClick={toggleSidebar}
            sx={{
              display: "inline-flex", // Visible only on small screens
              color: "white", // Change color of toggle button to white
            }}
          >
            <MenuIcon />
          </IconButton>

          {/* Spacer for Large Screens */}
          <Box sx={{ flexGrow: 1 }}></Box>

          {/* Profile Section */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1,
              ml: "auto", // Push to the right for all screen sizes
            }}
          >
            <IconButton onClick={handleMenuOpen}>
              <Avatar src="/static/images/avatar/1.jpg" />
            </IconButton>
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleMenuClose}
              sx={{
                mt: "5px", // Adjust menu to appear closer to the profile icon
              }}
            >
              <MenuItem onClick={handleLogout}>Logout</MenuItem>
            </Menu>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Main Content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          pt: 8,
          px: 3,
          transition: "margin-left 0.3s ease",
          ml: { xs: 0, sm: isSidebarOpen ? `${drawerWidth}px` : "0" }, // Ensure this is correct
        }}
      >
        {/* Dynamic Content */}
        <Outlet />
      </Box>
    </Box>
  );
};

export default Dashboard;