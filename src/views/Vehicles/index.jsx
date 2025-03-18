import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, Divider, Box, Grid, Typography, IconButton, Button, Breadcrumbs, Link as MuiLink } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { gridSpacing } from 'config.js';
import VisibilityIcon from '@mui/icons-material/Visibility';
import BorderColorIcon from '@mui/icons-material/BorderColor';
import DeleteIcon from '@mui/icons-material/Delete';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { getApi, deleteApi } from 'common/apiClient';
import { urls } from 'common/urls';

const VehiclePage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [vehicles, setVehicles] = useState([]);

  useEffect(() => {
    fetchVehicles();
  }, []);

  const fetchVehicles = async () => {
    setLoading(true);
    try {
      const response = await getApi(urls.vehicle.get);
      const formattedData = response.data.map((vehicle, index) => ({
        id: vehicle.id,
        vehicleName: vehicle.vehicleName,
        registrationNo: vehicle.registrationNo,
        model: vehicle.model,
        chasisNo: vehicle.chasisNo,
        engineNo: vehicle.engineNo,
        manufacturedBy: vehicle.manufacturedBy,
        vehicleType: vehicle.vehicleType,
        vehicleColor: vehicle.vehicleColor,
        registrationExpiry: vehicle.registrationExpiry,
        isActive: vehicle.isActive,
        image: vehicle.image || null,
        doc: vehicle.doc || null,
        vehicleGroupId: vehicle.vehicleGroup.id,
        group: vehicle.vehicleGroup?.name || 'N/A'
      }));
      setVehicles(formattedData);
    } catch (error) {
      toast.error('Failed to fetch vehicles');
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    { field: 'sNo', headerName: 'S.No', width: 80 },
    { field: 'vehicleName', headerName: 'Vehicle Name', width: 150, editable: true },
    { field: 'registrationNo', headerName: 'Registration Number', width: 180, editable: true },
    { field: 'model', headerName: 'Model', width: 100, editable: true },
    { field: 'chasisNo', headerName: 'Chassis No', width: 120, editable: true },
    { field: 'group', headerName: 'Group', width: 150, editable: true },
    {
      field: 'isActive',
      headerName: 'Status',
      width: 100,
      renderCell: (params) => {
        return (
          <Button
            variant="contained"
            style={{
              backgroundColor: params.value ? '#30aa4c' : '#dc3545',
              color: 'white',
              fontWeight: 700,
              fontSize: '10px',
              padding: '0'
            }}
          >
            {params.value ? 'Active' : 'Inactive'}
          </Button>
        );
      }
    },
    {
      field: 'actions',
      headerName: 'Action',
      width: 100,
      sortable: false,
      renderCell: (params) => {
        const navigate = useNavigate();

        return (
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <IconButton color="primary" sx={{ py: 2 }} onClick={() => navigate(`/view-vehicle/${params.row.id}`)}>
              <VisibilityIcon />
            </IconButton>
            <Divider orientation="vertical" flexItem sx={{ height: 20, mx: 0.5, alignSelf: 'center' }} />
            <IconButton
              sx={{ color: '#17a2b8', py: 2 }}
              onClick={() => navigate(`/add-vehicle/${params.row.id}`, { state: { ...params.row } })}
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
    if (window.confirm('Are you sure you want to delete this vehicle?')) {
      try {
        await deleteApi(urls.vehicle.delete.replace(':id', id));
        toast.success('Vehicle deleted successfully');
        fetchVehicles();
      } catch (error) {
        toast.error('Failed to delete vehicle');
      }
    }
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
      <Button variant="contained" color="primary" sx={{ my: 2 }} onClick={() => navigate('/add-vehicle')}>
        Add
      </Button>

      <Grid container spacing={gridSpacing}>
        <Grid item xs={12}>
          <Card>
            <Box sx={{ height: 'auto', width: '100%' }}>
              <DataGrid
                rows={loading ? [] : vehicles.map((row, index) => ({ ...row, sNo: index + 1 }))}
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
