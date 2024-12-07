import React from 'react';
import { Box, Paper, Typography, IconButton } from '@mui/material';
import { Edit as EditIcon, Delete as DeleteIcon, Visibility as ViewIcon } from '@mui/icons-material';

const CardView = ({ data, onEdit, onDelete, onView, fields }) => {
  return (
    <Box sx={{ display: { xs: 'block', md: 'none' }, mt: 3 }}>
      {data.map((item) => (
        <Paper key={item.id || item._id} sx={{ p: 2, mb: 2 }}>
          {fields.map((field) => (
            <Typography key={field.name}>
              {field.label}: {item[field.name]}
            </Typography>
          ))}

          {/* Conditionally render the action buttons */}
          {(onEdit || onDelete || onView) && (
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1, mt: 2 }}>
              {onView && (
                <IconButton color="info" onClick={() => onView(item._id)}>
                  <ViewIcon />
                </IconButton>
              )}
              {onEdit && (
                <IconButton color="primary" onClick={() => onEdit(item)}>
                  <EditIcon />
                </IconButton>
              )}
              {onDelete && (
                <IconButton color="error" onClick={() => onDelete(item.id || item._id)}>
                  <DeleteIcon />
                </IconButton>
              )}
            </Box>
          )}
        </Paper>
      ))}
    </Box>
  );
};

export default CardView;
