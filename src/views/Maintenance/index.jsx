import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, Button, Box, Grid, Typography, Divider, IconButton, Link as MuiLink, Breadcrumbs, MenuItem, Select } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import DeleteIcon from '@mui/icons-material/Delete';
import { useNavigate } from 'react-router-dom';

const initialRows = [
  { id: 1, vehicle: 'Toyota Landcruiser', startDate: '2025-02-11', endDate: '2025-02-11', serviceInfo: 'dddd', vendor: 'ghhhh', cost: '$12000', status: 'Completed' },
  { id: 2, vehicle: 'Toyota Landcruiser', startDate: '2025-02-11', endDate: '2025-02-11', serviceInfo: 'dddd', vendor: 'ghhhh', cost: '$12000', status: 'Planned' },
  { id: 3, vehicle: 'Sam New', startDate: '2025-02-04', endDate: '2025-02-05', serviceInfo: 'Replace engine', vendor: 'Raj Verma', cost: '$50000', status: 'Completed' },
  { id: 4, vehicle: 'Kia Loader', startDate: '2025-01-24', endDate: '2025-01-16', serviceInfo: 'gergeg', vendor: 'tes6', cost: '$200', status: 'Planned' }
];

const MaintenanceIndex = () => {
  const navigate = useNavigate();
  const [rows, setRows] = useState(initialRows);

  const handleStatusChange = (id, newStatus) => {
    setRows((prevRows) =>
      prevRows.map((row) => (row.id === id ? { ...row, status: newStatus } : row))
    );
  };

  const columns = [
    { field: 'id', headerName: 'S.No', width: 80 },
    { field: 'vehicle', headerName: 'Vehicle', width: 200 },
    { field: 'startDate', headerName: 'Start Date', width: 150 },
    { field: 'endDate', headerName: 'End Date', width: 150 },
    { field: 'serviceInfo', headerName: 'Service Info', width: 250 },
    { field: 'vendor', headerName: 'Vendor', width: 150 },
    { field: 'cost', headerName: 'Cost', width: 120 },
    {
      field: 'status',
      headerName: 'Status',
      width: 150,
      renderCell: (params) => (
        <Select
          value={params.row.status}
          onChange={(e) => handleStatusChange(params.row.id, e.target.value)}
          size="small"
          fullWidth
        >
          <MenuItem value="Completed">Completed</MenuItem>
          <MenuItem value="Planned">Planned</MenuItem>
          <MenuItem value="Planned">In Progess</MenuItem>
        </Select>
      )
    },
    {
      field: 'actions',
      headerName: 'Action',
      width: 150,
      sortable: false,
      renderCell: (params) => (
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <IconButton color="error" onClick={() => alert(`Deleting ${params.row.vehicle}`)}>
            <DeleteIcon />
          </IconButton>
        </Box>
      )
    }
  ];

  return (
    <>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Typography variant="h3">Maintenance Records</Typography>
        <Breadcrumbs separator="/" aria-label="breadcrumb">
          <MuiLink component={Link} to="/dashboard/default" color="inherit" underline="none">
            <Typography color="#17a2b8">Dashboard</Typography>
          </MuiLink>
          <Typography color="text.primary">Maintenance Records</Typography>
        </Breadcrumbs>
      </Box>

      <Button variant="contained" color="primary" sx={{ my: 2 }} onClick={() => navigate('/add-maintenance')}>Add</Button>

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

export default MaintenanceIndex;
