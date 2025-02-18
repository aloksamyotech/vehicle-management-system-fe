import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, Button, Box, Grid, Typography, Divider, IconButton, Link as MuiLink, Breadcrumbs } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import BorderColorIcon from '@mui/icons-material/BorderColor';
import DeleteIcon from '@mui/icons-material/Delete';
import { useNavigate } from 'react-router-dom';

const initialRows = [
  {
    id: 1,
    fuelFillDate: '2025-02-21',
    vehicle: '122',
    quantity: 2,
    totalPrice: '$656',
    filledBy: 'Avinash',
    odometer: 2,
    comments: 'hjgjh'
  },
  {
    id: 2,
    fuelFillDate: '2025-02-09',
    vehicle: 'SUBARU',
    quantity: 200,
    totalPrice: '$45000',
    filledBy: 'muhamed',
    odometer: 234667,
    comments: 'Full tank'
  },
  {
    id: 3,
    fuelFillDate: '2025-02-05',
    vehicle: 'Sam New',
    quantity: 15,
    totalPrice: '$5345',
    filledBy: 'Rohit Verma',
    odometer: 4567,
    comments: ''
  },
  { id: 4, fuelFillDate: '2025-01-28', vehicle: 'nnn', quantity: 50, totalPrice: '$5000', filledBy: 'Dannor', odometer: 767, comments: '' },
  {
    id: 5,
    fuelFillDate: '2025-01-25',
    vehicle: 'Kia Loader',
    quantity: 56,
    totalPrice: '$5000',
    filledBy: 'muhamed',
    odometer: 45567,
    comments: ''
  },
  {
    id: 6,
    fuelFillDate: '2025-01-10',
    vehicle: 'Kia Loader',
    quantity: 45,
    totalPrice: '$990',
    filledBy: 'Brian Hecke',
    odometer: 255890,
    comments: ''
  },
  {
    id: 7,
    fuelFillDate: '2025-01-05',
    vehicle: 'Kia Loader',
    quantity: 56,
    totalPrice: '$1350',
    filledBy: 'Dannor',
    odometer: 256655,
    comments: ''
  },
  {
    id: 8,
    fuelFillDate: '2025-01-03',
    vehicle: 'Kia Loader',
    quantity: 150,
    totalPrice: '$5678',
    filledBy: 'muhamed',
    odometer: 354566,
    comments: ''
  },
  {
    id: 9,
    fuelFillDate: '2025-01-02',
    vehicle: 'Kia Loader',
    quantity: 12345,
    totalPrice: '$654',
    filledBy: 'muhamed',
    odometer: 1345566,
    comments: 'jtg'
  },
  {
    id: 10,
    fuelFillDate: '2024-12-24',
    vehicle: 'AL Micro',
    quantity: 1200,
    totalPrice: '$124563',
    filledBy: 'muhamed',
    odometer: 782,
    comments: 'full'
  }
];

const FuelRecords = () => {
  const navigate = useNavigate();
  const [rows, setRows] = useState(initialRows);

  const columns = [
    { field: 'id', headerName: 'S.No', width: 80 },
    { field: 'fuelFillDate', headerName: 'Fuel Fill Date', width: 150 },
    { field: 'vehicle', headerName: 'Vehicle', width: 200 },
    { field: 'quantity', headerName: 'Quantity', width: 120 },
    { field: 'totalPrice', headerName: 'Fuel Total Price', width: 150 },
    { field: 'filledBy', headerName: 'Fuel Filled By', width: 150 },
    { field: 'odometer', headerName: 'Odometer Reading', width: 150 },
    { field: 'comments', headerName: 'Comments', width: 200 },
    {
      field: 'actions',
      headerName: 'Action',
      width: 100,
      sortable: false,
      renderCell: (params) => (
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <IconButton sx={{ color: '#17a2b8', py: 2 }} onClick={() => handleEdit(params.row)}>
              <BorderColorIcon />
            </IconButton>
            <Divider orientation="vertical" flexItem sx={{ height: 20, mx: 0.5, alignSelf: 'center' }} />
            <IconButton color="error" sx={{ py: 2 }} onClick={() => handleDelete(params.row.id)}>
              <DeleteIcon />
            </IconButton>
          </Box>
      )
    }
  ];

  return (
    <>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Typography variant="h3">Fuel Management</Typography>
        <Breadcrumbs separator="/" aria-label="breadcrumb">
          <MuiLink component={Link} to="/dashboard/default" color="inherit" underline="none">
            <Typography color="#17a2b8">Dashboard</Typography>
          </MuiLink>
          <Typography color="text.primary">Fuel Management</Typography>
        </Breadcrumbs>
      </Box>

      <Button variant="contained" color="primary" sx={{ my: 2 }} onClick={() => navigate('/add-fuel')}>
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
    </>
  );
};

export default FuelRecords;
