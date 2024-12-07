import React from "react";
import {
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Collapse,
  Toolbar,
  Typography,
  Box,
  IconButton,
} from "@mui/material";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import CloseIcon from "@mui/icons-material/Close";
import HomeIcon from "@mui/icons-material/Home";
import PersonIcon from "@mui/icons-material/Person";
import RoomServiceIcon from "@mui/icons-material/RoomService";
import HistoryIcon from "@mui/icons-material/History";
import DashboardIcon from "@mui/icons-material/Dashboard";
import SettingsIcon from "@mui/icons-material/Settings";
import NotificationsIcon from "@mui/icons-material/Notifications";
import StorageIcon from "@mui/icons-material/Storage";
import AcUnitIcon from "@mui/icons-material/AcUnit";
import { useNavigate } from "react-router-dom";

const AppSidebar = ({ isSidebarOpen, toggleSidebar, drawerWidth = 240 }) => {
  const navigate = useNavigate();
  const [openMenu, setOpenMenu] = React.useState({ dashboard: false, settings: false });

  const handleToggle = (menu) => {
    setOpenMenu((prev) => ({ ...prev, [menu]: !prev[menu] }));
  };

  const menuItems = [
    { text: "Home", icon: <HomeIcon />, path: "/" },
    {
      text: "Staff Management",
      icon: <PersonIcon />,
      children: [
        { text: "Manage Staff", path: "/dashboard/staff-management" },
        { text: "Notify Staff", path: "/dashboard/NotifyStaff" },
      ],
    },
    {
      text: "Room Management",
      icon: <RoomServiceIcon />,
      path: "/dashboard/room-managment",
    },
    {
      text: "Service Management",
      icon: <RoomServiceIcon />,
      path: "/dashboard/service-managment",
    },
    {
      text: "Booking History",
      icon: <HistoryIcon />,
      path: "/dashboard/booking-history",
    },
    {
      text: "System Logs",
      icon: <StorageIcon />,
      path: "/dashboard/systemLogs",
    },
    {
      text: "Weather Conditions",
      icon: <AcUnitIcon />,
      path: "/dashboard/weatherDashboard",
    },
    {
      text: "Settings",
      icon: <SettingsIcon />,
      path: "/dashboard/settings",
    },
  ];

  return (
    <Drawer
      variant={isSidebarOpen ? "persistent" : "temporary"}
      open={isSidebarOpen}
      onClose={toggleSidebar}
      sx={{
        width: isSidebarOpen ? drawerWidth : 0,
        flexShrink: 0,
        [`& .MuiDrawer-paper`]: {
          width: drawerWidth,
          boxSizing: "border-box",
          backgroundColor: "#282c34",
          color: "#fff",
        },
        display: { xs: "block", sm: "block" },
      }}
      ModalProps={{
        keepMounted: true,
      }}
    >
      <Toolbar>
        <IconButton
          onClick={toggleSidebar}
          sx={{ display: { sm: "none" }, color: "#fff" }}
        >
          <CloseIcon />
        </IconButton>
        <Typography variant="h6" noWrap sx={{ ml: 2 }}>
          Hotel Manager
        </Typography>
      </Toolbar>
      <Box
        sx={{
          overflow: "auto",
          "&::-webkit-scrollbar": {
            width: "8px", // Width of the scrollbar
          },
          "&::-webkit-scrollbar-track": {
            backgroundColor: "#2c2f34", // Track color
          },
          "&::-webkit-scrollbar-thumb": {
            backgroundColor: "#50597b", // Thumb color
            borderRadius: "4px", // Rounded edges
          },
          "&::-webkit-scrollbar-thumb:hover": {
            backgroundColor: "#3f51b5", // Thumb hover color
          },
        }}
      >
        <List>
          {menuItems.map((item, index) => (
            <React.Fragment key={index}>
              {item.children ? (
                <>
                  <ListItem
                    onClick={() => handleToggle(item.text.toLowerCase())}
                    sx={{
                      padding: "10px 20px",
                      cursor: "pointer",
                      "&:hover": { backgroundColor: "#3f51b5" },
                    }}
                  >
                    <ListItemIcon sx={{ color: "#fff" }}>{item.icon}</ListItemIcon>
                    <ListItemText primary={item.text} />
                    {openMenu[item.text.toLowerCase()] ? <ExpandLess /> : <ExpandMore />}
                  </ListItem>
                  <Collapse
                    in={openMenu[item.text.toLowerCase()]}
                    timeout="auto"
                    unmountOnExit
                  >
                    <List component="div" disablePadding>
                      {item.children.map((subItem, subIndex) => (
                        <ListItem
                          key={subIndex}
                          onClick={() => navigate(subItem.path)}
                          sx={{
                            pl: 4,
                            padding: "8px 20px",
                            cursor: "pointer",
                            "&:hover": { backgroundColor: "#50597b" },
                          }}
                        >
                          <ListItemText primary={subItem.text} />
                        </ListItem>
                      ))}
                    </List>
                  </Collapse>
                </>
              ) : (
                <ListItem
                  onClick={() => {
                    item.action ? item.action() : navigate(item.path);
                  }}
                  sx={{
                    padding: "10px 20px",
                    cursor: "pointer",
                    "&:hover": { backgroundColor: "#3f51b5" },
                  }}
                >
                  <ListItemIcon sx={{ color: "#fff" }}>{item.icon}</ListItemIcon>
                  <ListItemText primary={item.text} />
                </ListItem>
              )}
            </React.Fragment>
          ))}
        </List>
      </Box>

    </Drawer>
  );
};

export default AppSidebar;