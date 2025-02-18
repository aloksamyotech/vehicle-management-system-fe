import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, Button, Box, Grid, Typography, Breadcrumbs, IconButton,Link as MuiLink, Modal, Fade, Backdrop } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import DeleteIcon from '@mui/icons-material/Delete';
import FuelReminderForm from './addReminder.jsx';

const initialRows = [
  { id: 1, vehicle: 'Toyota Landcruiser', date: '2025-02-21', message: 'Oil change due' },
  { id: 2, vehicle: 'Kia Loader', date: '2025-02-15', message: 'Check tire pressure' }
];

const FuelReminderIndex = () => {
  const [rows, setRows] = useState(initialRows);
  const [open, setOpen] = useState(false);

  const handleDelete = (id) => {
    setRows(rows.filter((row) => row.id !== id));
  };

  const handleAddReminder = (newReminder) => {
    setRows([...rows, { id: rows.length + 1, ...newReminder }]);
    setOpen(false);
  };

  const columns = [
    { field: 'id', headerName: 'S.No', width: 80 },
    { field: 'vehicle', headerName: 'Vehicle', width: 250 },
    { field: 'date', headerName: 'Date', width: 150 },
    { field: 'message', headerName: 'Message', width: 400 },
    {
      field: 'actions',
      headerName: 'Action',
      width: 150,
      sortable: false,
      renderCell: (params) => (
        <IconButton color="error" onClick={() => handleDelete(params.row.id)}>
          <DeleteIcon />
        </IconButton>
      )
    }
  ];

  return (
    <>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Typography variant="h3">Reminder Info</Typography>
        <Breadcrumbs separator="/" aria-label="breadcrumb">
          <Link to="/dashboard/default" style={{ textDecoration: 'none', color: '#17a2b8' }}>
            Dashboard
          </Link>
          <Typography color="text.primary">Reminders</Typography>
        </Breadcrumbs>
      </Box>

      <Button variant="contained" color="primary" sx={{ my: 2 }} onClick={() => setOpen(true)}>
        Add
      </Button>

      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Card>
            <Box sx={{ height: 'auto', width: '100%' }}>
              <DataGrid
                rows={rows}
                columns={columns}
                pageSizeOptions={[5, 10]}
                disableRowSelectionOnClick
                sx={{
                  '.MuiDataGrid-columnHeaderTitle': { fontWeight: 'bold', fontSize: '16px' },
                  '.MuiDataGrid-cell': { fontSize: '16px' }
                }}
              />
            </Box>
          </Card>
        </Grid>
      </Grid>

      <Modal open={open} onClose={() => setOpen(false)} closeAfterTransition BackdropComponent={Backdrop} BackdropProps={{ timeout: 500 }}>
        <Fade in={open}>
          <Box sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: 500, bgcolor: 'background.paper', boxShadow: 24, p: 4, borderRadius: 2 }}>
            <Typography variant="h4" sx={{ mb: 2 }}>Add Reminder</Typography>
            <FuelReminderForm onSave={handleAddReminder} onCancel={() => setOpen(false)} />
          </Box>
        </Fade>
      </Modal>
    </>
  );
};

export default FuelReminderIndex;