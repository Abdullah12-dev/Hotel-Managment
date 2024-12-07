import React from 'react';
import { Box, FormControl, InputLabel, Select, MenuItem } from '@mui/material';

const SortControl = ({ value, onChange, fields }) => {
  return (
    <Box sx={{ display: { xs: 'block', md: 'none' }, mb: 2 }}>
      <FormControl fullWidth variant="outlined">
        <InputLabel>Sort By</InputLabel>
        <Select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          label="Sort By"
        >
          {fields.map((field) => (
            <MenuItem key={field} value={field}>{field}</MenuItem>
          ))}
        </Select>
      </FormControl>
    </Box>
  );
};

export default SortControl;
