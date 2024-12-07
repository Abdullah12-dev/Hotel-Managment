import React from 'react';
import { Box, TextField } from '@mui/material';

const SearchBar = ({ value, onChange }) => {
  return (
    <Box
    sx={{
      display: 'flex',
      justifyContent: 'center', // Centers the search bar
      mb: 3,
    }}
    >
    <TextField
      variant="outlined"
      label="Search"
      value={value}
      onChange={onChange}
      sx={{
        width: '100%',
        maxWidth: 400,
        '& .MuiOutlinedInput-root': {
          borderRadius: '50px',
        },
      }}
    />
    </Box>
  );
};

export default SearchBar;
