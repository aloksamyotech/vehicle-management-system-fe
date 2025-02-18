import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, Divider, Box, Grid, Typography, IconButton, Button, Breadcrumbs, Link as MuiLink } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { gridSpacing } from 'config.js';
import VisibilityIcon from '@mui/icons-material/Visibility';
import BorderColorIcon from '@mui/icons-material/BorderColor';
import DeleteIcon from '@mui/icons-material/Delete';
import { useNavigate } from 'react-router-dom';

const columns = [
  { field: 'id', headerName: 'S.No', width: 80 },
  { field: 'customer', headerName: 'Customer', width: 150 },
  { field: 'vehicle', headerName: 'Vehicle', width: 150, editable: true },
  { field: 'date', headerName: 'Date', width: 150 },
  { field: 'type', headerName: 'Type', width: 120 },
  { field: 'driver', headerName: 'Driver', width: 150 },
  {
    field: 'tripStatus',
    headerName: 'Trip Status',
    width: 120,
    renderCell: (params) => {
      const status = params.row.tripStatus;
      const statusColors = {
        Cancelled: '#dc3545',
        Ongoing: '#17a2b8',
        Completed: '#30aa4c',
        'Yet to start': '#ffc107'
      };

      return (
        <Button
          variant="contained"
          style={{
            backgroundColor: statusColors[status] || '#6c757d',
            color: 'white',
            fontWeight: 700,
            fontSize: '10px',
            width: 'auto',
            padding: '0'
          }}
        >
          {status}
        </Button>
      );
    }
  },
  {
    field: 'actions',
    headerName: 'Action',
    width: 150,
    sortable: false,
    renderCell: (params) => (
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <IconButton color="primary" sx={{ py: 2 }} onClick={() => alert(`Viewing ${params.row.vehicle}`)}>
          <VisibilityIcon />
        </IconButton>
        <Divider orientation="vertical" flexItem sx={{ height: 20, mx: 0.5, alignSelf: 'center' }} />
        <IconButton sx={{ color: '#17a2b8', py: 2 }} onClick={() => alert(`Editing ${params.row.vehicle}`)}>
          <BorderColorIcon />
        </IconButton>
        <Divider orientation="vertical" flexItem sx={{ height: 20, mx: 0.5, alignSelf: 'center' }} />
        <IconButton color="error" sx={{ py: 2 }} onClick={() => alert(`Deleting ${params.row.vehicle}`)}>
          <DeleteIcon />
        </IconButton>
      </Box>
    )
  }
];

const rows = [
  { id: 1, customer: 'John Doe', vehicle: 'Truck A', date: '2025-02-14', type: 'Cargo', driver: 'Mike', tripStatus: 'Completed' },
  { id: 2, customer: 'Jane Smith', vehicle: 'Van B', date: '2025-02-13', type: 'Passenger', driver: 'Alex', tripStatus: 'Cancelled' },
  { id: 3, customer: 'Mark Wilson', vehicle: 'Bus C', date: '2025-02-12', type: 'Tourist', driver: 'John', tripStatus: 'Yet to start' },
  { id: 4, customer: 'Emma Brown', vehicle: 'Car D', date: '2025-02-11', type: 'Private', driver: 'Steve', tripStatus: 'Ongoing' }
];

const BookingPage = () => {
  const navigate = useNavigate();

  const handleOpenModal = () => {
    navigate('/add-booking');
  };

  return (
    <>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          p: 0,
          m: 0
        }}
      >
        <Typography variant="h3" sx={{ m: 0 }}>
          Booking Info
        </Typography>
        <Breadcrumbs
          separator="/"
          aria-label="breadcrumb"
          sx={{
            display: 'flex',
            alignItems: 'center',
            p: 0,
            m: 0
          }}
        >
          <MuiLink component={Link} to="/dashboard/default" color="inherit" underline="none">
            <Typography color="#17a2b8">Dashboard</Typography>
          </MuiLink>
          <Typography color="text.primary">Bookings</Typography>
        </Breadcrumbs>
      </Box>

      <Button variant="contained" color="primary" sx={{ my: 2 }} onClick={handleOpenModal}>
        Add
      </Button>

      <Grid container spacing={gridSpacing}>
        <Grid item xs={12}>
          <Card>
            <Box sx={{ height: 'auto', width: '100%' }}>
              <DataGrid
                rows={rows}
                columns={columns}
                pageSizeOptions={[5, 10]}
                disableRowSelectionOnClick
                sx={{
                  '.MuiDataGrid-columnHeaderTitle': {
                    fontWeight: 'bold',
                    fontSize: '16px'
                  },
                  '.MuiDataGrid-cell': {
                    fontSize: '16px'
                  }
                }}
              />
            </Box>
          </Card>
        </Grid>
      </Grid>
    </>
  );
};

export default BookingPage;
