import React, { useEffect, useState, useCallback } from 'react';
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
import { useTranslation } from 'react-i18next';

const VehiclePage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [vehicles, setVehicles] = useState([]);
  const [totalRows, setTotalRows] = useState(0);
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 10
  });

  const fetchVehicles = async () => {
    setLoading(true);
    try {
      const response = await getApi(`${urls.vehicle.get}?page=${paginationModel.page + 1}&limit=${paginationModel.pageSize}`);
      const vehicleList = response?.data?.vehicleDetails || [];
      const pagination = response?.data?.pagination || { total: 0 };

      const formattedData = vehicleList.map((vehicle) => ({
        id: vehicle.id,
        vehicleName: vehicle.vehicleName,
        registrationNo: vehicle.registrationNo,
        model: vehicle.model,
        chasisNo: vehicle.chasisNo,
        engineNo: vehicle.engineNo,
        manufacturedBy: vehicle.manufacturedBy,
        vehicleColor: vehicle.vehicleColor,
        registrationExpiry: vehicle.registrationExpiry,
        isActive: vehicle.isActive,
        image: vehicle.image || null,
        doc: vehicle.doc || null,
        vehicleGroupId: vehicle.vehicleGroup.id,
        group: vehicle.vehicleGroup?.name || 'N/A'
      }));

      setVehicles(formattedData);
      setTotalRows(pagination.total);
    } catch (error) {
      toast.error(t('text.ERROR_FETCHING'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVehicles();
  }, [paginationModel]);

  const handleDelete = async (id) => {
    await deleteApi(urls.vehicle.delete.replace(':id', id));
    toast.success(t('text.VEHICLE_DELETED'));
    fetchVehicles();
  };

  const columns = [
    { field: 'sNo', headerName: t('text.S_NO'), width: 80 },
    { field: 'vehicleName', headerName: t('text.VEHICLE_NAME'), width: 150 },
    { field: 'registrationNo', headerName: t('text.RES_NO'), width: 180 },
    { field: 'model', headerName: t('text.MODEL'), width: 100 },
    { field: 'chasisNo', headerName: t('text.CHASIS_NO'), width: 150 },
    { field: 'group', headerName: t('text.GROUP'), width: 150 },
    {
      field: 'isActive',
      headerName: t('text.STATUS'),
      width: 100,
      renderCell: (params) => (
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
      )
    },
    {
      field: 'actions',
      headerName: t('text.ACTION'),
      width: 150,
      sortable: false,
      renderCell: (params) => (
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <IconButton color="primary" sx={{ py: 2 }} onClick={() => navigate(`/view-vehicle/${params.row.id}`)}>
            <VisibilityIcon />
          </IconButton>
          <Divider orientation="vertical" flexItem sx={{ height: 20, mx: 0.5 }} />
          <IconButton
            sx={{ color: '#17a2b8', py: 2 }}
            onClick={() => navigate(`/add-vehicle/${params.row.id}`, { state: { ...params.row } })}
          >
            <BorderColorIcon />
          </IconButton>
          <Divider orientation="vertical" flexItem sx={{ height: 20, mx: 0.5 }} />
          <IconButton color="error" sx={{ py: 2 }} onClick={() => handleDelete(params.row.id)}>
            <DeleteIcon />
          </IconButton>
        </Box>
      )
    }
  ];

  return (
    <>
      <CustomBreadcrumbs title={t('text.VEHICLE_INFO')} links={[{ name: t('text.VEHICLE_MNGT'), path: '/vehicle' }]} />

      <Grid container spacing={gridSpacing}>
        <Grid item xs={12}>
          <Card>
            <Box sx={{ height: 'auto', width: '100%' }}>
              <DataGrid
                rows={
                  loading
                    ? []
                    : vehicles.map((row, index) => ({
                        ...row,
                        sNo: paginationModel.page * paginationModel.pageSize + index + 1
                      }))
                }
                columns={columns}
                rowCount={totalRows}
                loading={loading}
                pagination
                paginationMode="server"
                paginationModel={paginationModel}
                onPaginationModelChange={setPaginationModel}
                pageSizeOptions={[10]}
                disableRowSelectionOnClick
                sx={{
                  '.MuiDataGrid-columnHeaderTitle': { fontWeight: 'bold', fontSize: '16px' },
                  '.MuiDataGrid-cell': { fontSize: '16px' }
                }}
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
