import React, { useEffect, useState } from 'react';
import { Card, Divider, Box, Grid, IconButton, Button } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { gridSpacing } from 'config.js';
import VisibilityIcon from '@mui/icons-material/Visibility';
import BorderColorIcon from '@mui/icons-material/BorderColor';
import DeleteIcon from '@mui/icons-material/Delete';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { getApi, deleteApi } from 'common/apiClient';
import { urls } from 'common/urls';
import CustomToolbar from 'common/customToolbar';
import CustomBreadcrumbs from 'common/customBreadcrumbs';
import { text } from 'common/constant';

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
      toast.error(text.ERROR_FETCHING);
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    { field: 'sNo', headerName: text.S_NO, width: 80 },
    { field: 'vehicleName', headerName: text.VEHICLE_NAME, width: 150, editable: true },
    { field: 'registrationNo', headerName: text.RES_NO, width: 180, editable: true },
    { field: 'model', headerName: text.MODEL, width: 100, editable: true },
    { field: 'chasisNo', headerName: text.CHASIS_NO, width: 150, editable: true },
    { field: 'group', headerName: text.GROUP, width: 150, editable: true },
    {
      field: 'isActive',
      headerName: text.STATUS,
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
      headerName: text.ACTION,
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
    await deleteApi(urls.vehicle.delete.replace(':id', id));
    toast.success(text.VEHICLE_DELETED);
    fetchVehicles();
  };

  return (
    <>
      <CustomBreadcrumbs title={text.VEHICLE_INFO} links={[{ name: text.VEHICLE_MNGT, path: '/vehicle' }]} />

      <Grid container spacing={gridSpacing}>
        <Grid item xs={12}>
          <Card>
            <Box sx={{ height: 'auto', width: '100%' }}>
              <DataGrid
                rows={loading ? [] : vehicles.map((row, index) => ({ ...row, sNo: index + 1 }))}
                columns={columns}
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
                initialState={{
                  pagination: {
                    paginationModel: {
                      pageSize: 10
                    }
                  }
                }}
                pageSizeOptions={[10]}
                disableColumnFilter
                disableColumnSelector
                disableDensitySelector
                slots={{ toolbar: CustomToolbar }}
                slotProps={{
                  toolbar: {
                    onAddClick: () => navigate('/add-vehicle'),
                    showExport: true
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
