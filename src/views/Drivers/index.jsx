import React from 'react';
import { Link } from 'react-router-dom';
import { Card, Button, Box, Grid, Typography, Divider, IconButton, Link as MuiLink, Breadcrumbs } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { gridSpacing } from 'config.js';
import BorderColorIcon from '@mui/icons-material/BorderColor';
import DeleteIcon from '@mui/icons-material/Delete';
import { useNavigate } from 'react-router-dom';

const columns = [
  { field: 'id', headerName: 'S.No', width: 80 },
  {
    field: 'photo',
    headerName: 'Photo',
    width: 120,
    renderCell: (params) => <img src={params.row.photo} alt="driver" style={{ width: 50, height: 50, borderRadius: '50%' }} />
  },
  { field: 'name', headerName: 'Name', width: 150, editable: true },
  { field: 'mobile', headerName: 'Mobile', width: 150, editable: true },
  { field: 'licenseNo', headerName: 'License No', width: 150, editable: true },
  { field: 'licenseExpDate', headerName: 'License Exp Date', width: 150, editable: true },
  { field: 'dateOfJoining', headerName: 'Date of Joining', width: 150, editable: true },
  { field: 'doc', headerName: 'Doc', width: 100, editable: true },
  {
    field: 'isActive',
    headerName: 'Status',
    width: 100,
    renderCell: (params) => {
      const isActive = params.row.isActive === 'Active';
      return (
        <Button
          variant="contained"
          style={{
            backgroundColor: isActive ? '#30aa4c' : '#dc3545',
            color: 'white',
            fontWeight: 700,
            fontSize: '10px',
            padding: '0'
          }}
        >
          {params.row.isActive}
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
          <IconButton sx={{ color: '#17a2b8', py: 2 }} onClick={() => navigate(`/add-driver/${params.row.id}`)}>
            <BorderColorIcon />
          </IconButton>
          <Divider orientation="vertical" flexItem sx={{ height: 20, mx: 0.5, alignSelf: 'center' }} />
          <IconButton color="error" sx={{ py: 2 }} onClick={() => alert(`Deleting ${params.row.name}`)}>
            <DeleteIcon />
          </IconButton>
        </Box>
      );
    }
  }
];

const rows = [
  {
    id: 1,
    photo: '/images/driver1.jpg',
    name: 'John Doe',
    mobile: '1234567890',
    licenseNo: 'L1234567',
    licenseExpDate: '2026-05-10',
    dateOfJoining: '2020-01-01',
    doc: 'Uploaded',
    isActive: 'Active'
  },
  {
    id: 2,
    photo: '/images/driver2.jpg',
    name: 'Jane Smith',
    mobile: '0987654321',
    licenseNo: 'L9876543',
    licenseExpDate: '2025-08-15',
    dateOfJoining: '2021-04-20',
    doc: 'Pending',
    isActive: 'Inactive'
  },
  {
    id: 3,
    photo: '/images/driver3.jpg',
    name: 'Jim Brown',
    mobile: '1122334455',
    licenseNo: 'L1122334',
    licenseExpDate: '2024-12-30',
    dateOfJoining: '2019-07-11',
    doc: 'Uploaded',
    isActive: 'Active'
  },
  {
    id: 4,
    photo: '/images/driver4.jpg',
    name: 'Anna White',
    mobile: '5566778899',
    licenseNo: 'L5566778',
    licenseExpDate: '2027-03-25',
    dateOfJoining: '2022-09-15',
    doc: 'Uploaded',
    isActive: 'Inactive'
  }
];

const DriverManagementPage = () => {
  const navigate = useNavigate();

  const handleOpenModal = () => {
    navigate('/add-driver');
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
          Driver Info
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
          <Typography color="text.primary">Driver Info</Typography>
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

export default DriverManagementPage;
