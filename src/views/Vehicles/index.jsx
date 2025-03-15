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
  { field: 'vehicleName', headerName: 'Vehicle Name', width: 150, editable: true },
  { field: 'registrationNumber', headerName: 'Registration Number', width: 180, editable: true },
  { field: 'model', headerName: 'Model', width: 150, editable: true },
  { field: 'chassisNo', headerName: 'Chassis No', width: 120, editable: true },
  { field: 'group', headerName: 'Group', width: 100, editable: true },
  {
    field: 'isActive',
    headerName: 'Is Active',
    width: 100,
    renderCell: (params) => {
      const isActive = params.row.isActive === 'Yes';
      return (
        <Button
          variant="contained"
          style={{
            backgroundColor: isActive ? '#30aa4c' : '#dc3545',
            color: 'white',
            fontWeight: 700,
            fontSize: '10px',
            width: '10%',
            padding: '0'
          }}
          onClick={() => alert(`Toggled status for ${params.row.vehicleName}`)}
        >
          {isActive ? 'Active' : 'Inactive'}
        </Button>
      );
    }
  },
  {
    field: 'actions',
    headerName: 'Action',
    width: 150,
    sortable: false,
    renderCell: (params) => {
      const navigate = useNavigate();

      return (
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <IconButton color="primary" sx={{ py: 2 }} onClick={() => navigate(`/view-vehicle/${params.row.id}`)}>
            <VisibilityIcon />
          </IconButton>
          <Divider orientation="vertical" flexItem sx={{ height: 20, mx: 0.5, alignSelf: 'center' }} />
          <IconButton sx={{ color: '#17a2b8', py: 2 }} onClick={() => navigate(`/add-vehicle/${params.row.id}`)}>
            <BorderColorIcon />
          </IconButton>
          <Divider orientation="vertical" flexItem sx={{ height: 20, mx: 0.5, alignSelf: 'center' }} />
          <IconButton color="error" sx={{ py: 2 }} onClick={() => alert(`Deleting ${params.row.vehicleName}`)}>
            <DeleteIcon />
          </IconButton>
        </Box>
      );
    }
  }
];

const rows = [
  { id: 1, vehicleName: 'Truck A', registrationNumber: 'ABC-123', model: '2023', chassisNo: 'CHS001', group: 'Heavy', isActive: 'Yes' },
  { id: 2, vehicleName: 'Van B', registrationNumber: 'XYZ-456', model: '2022', chassisNo: 'CHS002', group: 'Light', isActive: 'No' },
  { id: 3, vehicleName: 'Bus C', registrationNumber: 'LMN-789', model: '2021', chassisNo: 'CHS003', group: 'Medium', isActive: 'Yes' },
  { id: 4, vehicleName: 'Car D', registrationNumber: 'PQR-012', model: '2020', chassisNo: 'CHS004', group: 'Light', isActive: 'Yes' }
];

const VehiclePage = () => {
  const navigate = useNavigate();

  const handleOpenModal = () => {
    navigate('/add-vehicle');
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
          Vehicle Info
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
          <Typography color="text.primary">Vehicle Management</Typography>
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

export default VehiclePage;
