import React from 'react';
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TableSortLabel, IconButton, Paper
} from '@mui/material';
import { Edit as EditIcon, Delete as DeleteIcon, Visibility as VisibilityIcon } from '@mui/icons-material';

// Helper function to safely access nested properties
const getNestedValue = (obj, path) => {
  return path.split('.').reduce((acc, part) => acc && acc[part], obj);
};

const GenericTable = ({ data, columns, onEdit, onDelete, onView, onSort, sortConfig }) => {
  // Determine if the actions column should be shown
  const showActions = onEdit || onDelete || onView;

  return (
    <TableContainer
      component={Paper}
      elevation={2}
      sx={{
        display: { xs: 'none', md: 'block' },
        overflowX: 'auto',
        borderRadius: '12px', // Adds rounded corners
        boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)', // Subtle shadow for better UI
      }}
    >
      <Table>
        <TableHead
          sx={{
            backgroundColor: '#333', // Dark header background
            '& th': {
              color: '#fff', // White text color
              fontWeight: 'bold', // Make the text bold
              textAlign: 'left',
            },
          }}
        >
          <TableRow>
            {columns.map((col) => (
              <TableCell key={col.accessor}>
                <TableSortLabel
                  active={sortConfig.field === col.accessor}
                  direction={sortConfig.direction}
                  onClick={() => onSort(col.accessor)}
                >
                  {col.label}
                </TableSortLabel>
              </TableCell>
            ))}
            {showActions && <TableCell>Actions</TableCell>} {/* Conditionally show Actions column */}
          </TableRow>
        </TableHead>

        <TableBody>
          {data.map((row) => (
            <TableRow key={row._id}>
              {columns.map((col) => (
                <TableCell key={col.accessor}>
                  {typeof col.accessor === 'function'
                    ? col.accessor(row)
                    : getNestedValue(row, col.accessor) // Use the helper function to handle nested fields
                  }
                </TableCell>
              ))}
              {showActions && ( // Conditionally render the action buttons
                <TableCell>
                  {onView && (
                    <IconButton color="primary" onClick={() => onView(row._id)}>
                      <VisibilityIcon />
                    </IconButton>
                  )}
                  {onEdit && (
                    <IconButton color="primary" onClick={() => onEdit(row)}>
                      <EditIcon />
                    </IconButton>
                  )}
                  {onDelete && (
                    <IconButton color="error" onClick={() => onDelete(row._id)}>
                      <DeleteIcon />
                    </IconButton>
                  )}
                </TableCell>
              )}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default GenericTable;
