import React, { useState, useEffect } from 'react';
import {
  Box, Dialog, DialogActions, DialogContent, DialogTitle, TextField, Button, MenuItem
} from '@mui/material';

const GenericDialog = ({ open, onClose, data, onSave, fields, title }) => {
  const [formData, setFormData] = useState(data);

  // Sync the formData when the 'data' prop changes (for editing)
  useEffect(() => {
    setFormData(data);
  }, [data]);

  const handleInputChange = (field) => (event) => {
    setFormData((prev) => ({ ...prev, [field]: event.target.value }));
  };

  const handleSave = () => {
    onSave(formData);
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        <Box component="form" sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
          {fields.map((field) => (
            <TextField
              key={field.name}
              label={field.label}
              variant="outlined"
              fullWidth
              value={formData[field.name] || ''}
              onChange={handleInputChange(field.name)}
              type={field.type || 'text'}
              multiline={field.multiline || false}
              rows={field.rows || 1}
              select={field.type === 'select'}
            >
              {field.type === 'select' &&
                field.options.map((option) => (
                  <MenuItem key={option} value={option}>
                    {option}
                  </MenuItem>
                ))}
            </TextField>
          ))}
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleSave} color="primary">Save</Button>
      </DialogActions>
    </Dialog>
  );
};

export default GenericDialog;

