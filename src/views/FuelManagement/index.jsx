import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Card, Button, Box, Grid, Typography, Divider, IconButton, Link as MuiLink, Breadcrumbs } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import BorderColorIcon from '@mui/icons-material/BorderColor';
import DeleteIcon from '@mui/icons-material/Delete';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { getApi, deleteApi } from 'common/apiClient';
import { urls } from 'common/urls';

const FuelRecords = () => {
  const navigate = useNavigate();
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await getApi(urls.fuel.get);
      const formattedData = response.data.map((fuel, index) => ({
        id: fuel.id,
        fillDate: fuel.fillDate,
        quantity: fuel.quantity,
        odometerReading: fuel.odometerReading,
        amount: fuel.amount,
        comments: fuel.comments,
        vehicleId: fuel.vehicle.id,
        vehicle: fuel.vehicle?.vehicleName || 'N/A',
        driverId: fuel.driver.id,
        driver: fuel.driver?.name || 'N/A'
      }));
      setRows(formattedData);
    } catch (error) {
      toast.error('Failed to fetch fuel data');
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    { field: 'sNo', headerName: 'S.No', width: 80 },
    {
      field: 'fillDate',
      headerName: 'Fill Date',
      width: 150,
      renderCell: (params) => {
        return params.value ? new Date(params.value).toISOString().split('T')[0] : 'N/A';
      }
    },
    { field: 'vehicle', headerName: 'Vehicle', width: 200 },
    { field: 'quantity', headerName: 'Quantity', width: 120 },
    { field: 'amount', headerName: 'Fuel Total Price', width: 150 },
    { field: 'driver', headerName: 'Fuel Filled By', width: 150 },
    { field: 'odometerReading', headerName: 'Odometer Reading', width: 150 },
    { field: 'comments', headerName: 'Comments', width: 200 },
    {
      field: 'actions',
      headerName: 'Action',
      width: 100,
      sortable: false,
      renderCell: (params) => {
        const navigate = useNavigate();

        return (
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <IconButton
              sx={{ color: '#17a2b8', py: 2 }}
              onClick={() => navigate(`/add-fuel/${params.row.id}`, { state: { ...params.row } })}
            >
              <BorderColorIcon />
            </IconButton>
            <Divider orientation="vertical" flexItem sx={{ height: 20, mx: 0.5, alignSelf: 'center' }} />
            <IconButton color="error" sx={{ py: 2 }} onClick={() => handleDelete(params.row.id)}>
              <DeleteIcon />
            </IconButton>
          </Box>
        );
      }
    }
  ];

  const handleDelete = async (id) => {
      try {
        await deleteApi(urls.fuel.delete.replace(':id', id));
        toast.success('Fuel deleted successfully');
        fetchData();
      } catch (error) {
        toast.error('Failed to delete fuel');
      }
  };

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
                rows={loading ? [] : rows.map((row, index) => ({ ...row, sNo: index + 1 }))}
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
